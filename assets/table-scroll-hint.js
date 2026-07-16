/* table-scroll-hint.js
   Wide tables scroll sideways on phones and tablets, but nothing on screen says
   so — the overflow is silent, so people read the visible columns and never
   discover the ones past the right edge. The first time a scrollable table
   comes into view, nudge it a little to the right and ease it back: motion is
   what reads as "this moves," where a static affordance gets ignored.

   Deliberately generic. It walks up from every <table> to find whatever element
   actually scrolls, so any table on any page is covered without opting in and a
   new one can't be forgotten. Doing nothing is the default: it only nudges when
   the table really does overflow, which is why desktop stays still.

   Two things have to be true at once — the table is in view, and it is wide
   enough to scroll — and they can arrive in either order, so both are watched.
   The portal's tables ship with an empty <tbody> and only overflow once their
   rows load, which may happen well after they are already on screen.

   Hands off the moment the reader takes over — any interaction cancels the
   animation mid-flight, and a table that is already scrolled is left alone. */
(function () {
  if (!('IntersectionObserver' in window)) return;

  // Motion is the whole point of this script, so honor the opt-out completely.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Tablet and phone only. Desktop tables fit, and gating on real overflow
  // below means a stray wide table there still stays put.
  var VIEWPORT = '(max-width: 1279.98px)';

  var NUDGE_MAX = 52;   // px of travel — enough to see columns move, not a jump
  var OUT_MS = 420;
  var HOLD_MS = 130;
  var BACK_MS = 500;
  var VISIBLE_ENOUGH = 0.35;
  var SLOP = 8;         // ignore sub-pixel/rounding overflow

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

  function animateHint(el) {
    var distance = Math.min(NUDGE_MAX, el.scrollWidth - el.clientWidth);
    if (distance < SLOP) return;

    var cancelled = false;
    var events = ['pointerdown', 'touchstart', 'wheel', 'keydown'];

    function cancel() {
      cancelled = true;
      release();
    }
    function release() {
      events.forEach(function (name) {
        el.removeEventListener(name, cancel);
      });
      el.style.scrollBehavior = '';
    }
    events.forEach(function (name) {
      el.addEventListener(name, cancel, { passive: true });
    });

    // Setting scrollLeft can itself be smooth-animated by the UA, which would
    // fight these frames. Drive the position ourselves for the duration.
    el.style.scrollBehavior = 'auto';

    function leg(from, to, ms, then) {
      var start = performance.now();
      (function step(now) {
        if (cancelled) return;
        var t = Math.min(1, (now - start) / ms);
        el.scrollLeft = from + (to - from) * easeInOutCubic(t);
        if (t < 1) requestAnimationFrame(step);
        else if (then) then();
        else release();
      })(start);
    }

    leg(0, distance, OUT_MS, function () {
      setTimeout(function () {
        if (cancelled) { release(); return; }
        leg(distance, 0, BACK_MS, null);
      }, HOLD_MS);
    });
  }

  function init() {
    var tables = document.querySelectorAll('table');
    if (!tables.length) return;

    var entries = [];
    Array.prototype.forEach.call(tables, function (table) {
      var el = scrollContainerFor(table);
      if (!el) return;
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].el === el) return;
      }
      entries.push({ el: el, table: table, visible: false, done: false });
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
          if (entry.visible) evaluate(entry);
        });
      });
    }, { threshold: VISIBLE_ENOUGH });

    function finish(entry) {
      entry.done = true;
      viewObserver.unobserve(entry.el);
      if (sizeObserver) sizeObserver.unobserve(entry.table);
    }

    function evaluate(entry) {
      if (entry.done || !entry.visible) return;
      if (!window.matchMedia(VIEWPORT).matches) return;
      if (!overflows(entry.el)) return; // not wide enough (yet) — keep watching
      // Reader already found the scroll on their own; don't yank it back.
      if (entry.el.scrollLeft > 0) { finish(entry); return; }
      finish(entry);
      animateHint(entry.el);
    }

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
