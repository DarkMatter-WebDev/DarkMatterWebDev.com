/* table-scroll-hint.js
   Wide tables scroll sideways on phones and tablets, but nothing on screen says
   so — the overflow is silent, so people read the visible columns and never
   discover the ones past the right edge. While a scrollable table is in view,
   nudge it to the right and ease it back, then keep repeating every few seconds
   until the reader takes over: motion is what reads as "this moves," where a
   static affordance gets ignored — and a single nudge is easy to miss if it
   happens to fire while they are looking elsewhere on the page.

   Deliberately generic. It walks up from every <table> to find whatever element
   actually scrolls, so any table on any page is covered without opting in and a
   new one can't be forgotten. Doing nothing is the default: it only nudges when
   the table really does overflow, which is why desktop stays still.

   Two things have to be true at once — the table is in view, and it is wide
   enough to scroll — and they can arrive in either order, so both are watched.
   The portal's tables ship with an empty <tbody> and only overflow once their
   rows load, which may happen well after they are already on screen.

   Hands off the moment the reader takes over. Any interaction ends the repeat
   for good, mid-flight if need be, and a table they have already scrolled is
   left alone. Because this loops rather than firing once, it also has to know
   when to shut up: it gives up after MAX_NUDGES either way, leaving the
   viewport pauses the cycle instead of nagging an offscreen table, and
   switching to reduced-motion or to a desktop width part-way through a session
   stops it rather than looping on. */
(function () {
  if (!('IntersectionObserver' in window)) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Motion is the whole point of this script, so honor the opt-out completely.
  if (reduceMotion.matches) return;

  // Tablet and phone only. Desktop tables fit, and gating on real overflow
  // below means a stray wide table there still stays put.
  var VIEWPORT = '(max-width: 1279.98px)';

  var NUDGE_MAX = 52;   // px of travel — enough to see columns move, not a jump
  var OUT_MS = 420;
  var HOLD_MS = 130;
  var BACK_MS = 500;
  var REPEAT_MS = 4000; // stillness between nudges — long enough to read past
  // Give up after this many. Someone who has ignored six of these has seen it
  // and chosen not to scroll, and unbounded motion beside text they are trying
  // to read is its own problem (WCAG 2.2.2). ~6 x ~5s covers anyone who simply
  // missed the first one. Counted per page load, not per time in view.
  var MAX_NUDGES = 6;
  var VISIBLE_ENOUGH = 0.35;
  var SLOP = 8;         // ignore sub-pixel/rounding overflow

  // User-driven only. Our own animation writes scrollLeft, which fires `scroll`,
  // so `scroll` can't be used to detect the reader without racing ourselves.
  var INTERACT = ['pointerdown', 'touchstart', 'wheel', 'keydown'];

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // The element that scrolls is rarely the table itself — it's whichever
  // ancestor was given overflow-x (.wp-scroll, .client-admin-table-wrap, ...).
  function scrollContainerFor(table) {
    for (var el = table.parentElement; el && el !== document.body; el = el.parentElement) {
      var overflowX = window.getComputedStyle(el).overflowX;
      if (overflowX === 'auto' || overflowX === 'scroll') return el;
    }
    return null;
  }

  function overflows(el) {
    return el.scrollWidth - el.clientWidth > SLOP;
  }

  function listen(mql, fn) {
    if (mql.addEventListener) mql.addEventListener('change', fn);
    else if (mql.addListener) mql.addListener(fn);
  }

  function init() {
    var tables = document.querySelectorAll('table');
    if (!tables.length) return;

    var viewport = window.matchMedia(VIEWPORT);
    var entries = [];

    Array.prototype.forEach.call(tables, function (table) {
      var el = scrollContainerFor(table);
      if (!el) return;
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].el === el) return;
      }
      entries.push({
        el: el,
        table: table,
        visible: false,
        done: false,     // retired: reader took over, or we've said our piece
        shown: 0,        // nudges spent, against MAX_NUDGES
        timer: 0,
        abort: null,     // aborts an in-flight animation, if any
        bound: null      // interaction handler while the cycle is armed
      });
    });
    if (!entries.length) return;

    var sizeObserver = 'ResizeObserver' in window
      ? new ResizeObserver(function (records) {
          records.forEach(function (record) {
            entries.forEach(function (entry) {
              if (entry.table === record.target) evaluate(entry);
            });
          });
        })
      : null;

    var viewObserver = new IntersectionObserver(function (records) {
      records.forEach(function (record) {
        entries.forEach(function (entry) {
          if (entry.el !== record.target) return;
          entry.visible = record.isIntersecting;
          evaluate(entry);
        });
      });
    }, { threshold: VISIBLE_ENOUGH });

    function clearTimer(entry) {
      if (entry.timer) {
        clearTimeout(entry.timer);
        entry.timer = 0;
      }
    }

    function arm(entry) {
      if (entry.bound) return;
      entry.bound = function () { stop(entry); };
      INTERACT.forEach(function (name) {
        entry.el.addEventListener(name, entry.bound, { passive: true });
      });
    }

    function disarm(entry) {
      if (!entry.bound) return;
      INTERACT.forEach(function (name) {
        entry.el.removeEventListener(name, entry.bound);
      });
      entry.bound = null;
    }

    // Permanent: the reader took over, we ran out of nudges, or motion is no
    // longer wanted. Leaves the table wherever it currently sits — yanking it
    // back would be the opposite of getting out of the way.
    function stop(entry) {
      entry.done = true;
      clearTimer(entry);
      if (entry.abort) entry.abort();
      disarm(entry);
      viewObserver.unobserve(entry.el);
      if (sizeObserver) sizeObserver.unobserve(entry.table);
    }

    // Temporary: offscreen, or not a phone/tablet width right now. Unlike stop()
    // this rewinds, so a half-finished nudge isn't later mistaken for the reader
    // having scrolled it themselves.
    function pause(entry) {
      clearTimer(entry);
      if (entry.abort) {
        entry.abort();
        entry.el.scrollLeft = 0;
      }
    }

    function animate(entry, done) {
      var el = entry.el;
      var distance = Math.min(NUDGE_MAX, el.scrollWidth - el.clientWidth);
      if (distance < SLOP) { done(); return; }

      var cancelled = false;
      var raf = 0;
      var hold = 0;

      entry.abort = function () {
        cancelled = true;
        if (raf) cancelAnimationFrame(raf);
        if (hold) clearTimeout(hold);
        el.style.scrollBehavior = '';
        entry.abort = null;
      };

      function settle() {
        el.style.scrollBehavior = '';
        entry.abort = null;
        done();
      }

      // Setting scrollLeft can itself be smooth-animated by the UA, which would
      // fight these frames. Drive the position ourselves for the duration.
      el.style.scrollBehavior = 'auto';

      function leg(from, to, ms, then) {
        var start = performance.now();
        (function step(now) {
          if (cancelled) return;
          var t = Math.min(1, (now - start) / ms);
          el.scrollLeft = from + (to - from) * easeInOutCubic(t);
          if (t < 1) raf = requestAnimationFrame(step);
          else if (then) then();
          else settle();
        })(start);
      }

      leg(0, distance, OUT_MS, function () {
        hold = setTimeout(function () {
          if (cancelled) return;
          leg(distance, 0, BACK_MS, null);
        }, HOLD_MS);
      });
    }

    function run(entry) {
      if (entry.done) return;
      // Guard the cap here, not only where the next one is queued: a table that
      // goes offscreen mid-cycle comes back in through evaluate(), which would
      // otherwise walk straight past a spent budget.
      if (entry.shown >= MAX_NUDGES) { stop(entry); return; }
      if (!entry.visible || !viewport.matches) return;
      if (!overflows(entry.el)) return;      // not wide enough (yet) — keep watching
      // Reader found the scroll on their own between nudges; leave it alone.
      if (entry.el.scrollLeft > 0) { stop(entry); return; }
      arm(entry);
      entry.shown++;
      animate(entry, function () {
        if (entry.done) return;
        // Retire on the spot rather than idling observed-but-silent forever.
        if (entry.shown >= MAX_NUDGES) { stop(entry); return; }
        if (!entry.visible) return;          // paused — evaluate() resumes it
        entry.timer = setTimeout(function () {
          entry.timer = 0;
          run(entry);
        }, REPEAT_MS);
      });
    }

    function evaluate(entry) {
      if (entry.done) return;
      if (!entry.visible || !viewport.matches) { pause(entry); return; }
      if (!overflows(entry.el)) return;
      if (entry.el.scrollLeft > 0) { stop(entry); return; }
      if (entry.timer || entry.abort) return; // already cycling
      run(entry);
    }

    // A one-shot could ignore these; a loop can't. Reduced-motion turning on
    // must end it, and crossing the desktop line must park it (and un-park it).
    listen(reduceMotion, function () {
      if (!reduceMotion.matches) return;
      entries.slice().forEach(function (entry) {
        if (!entry.done) stop(entry);
      });
    });

    listen(viewport, function () {
      entries.forEach(function (entry) {
        if (!entry.done) evaluate(entry);
      });
    });

    entries.forEach(function (entry) {
      viewObserver.observe(entry.el);
      if (sizeObserver) sizeObserver.observe(entry.table);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
