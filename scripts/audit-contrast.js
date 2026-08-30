// Page-wide text-contrast auditor, injected into a browser page.
//
// Exposes two globals:
//   window.__sdsForceReveal()    — settle the object-reveal animation
//   window.__sdsAuditContrast()  — walk every visible text node, return failures
//
// This site breaks naive contrast auditing in specific ways. Each rule below
// exists because ignoring it produced a confidently wrong number:
//
//  1. Theme must be set via localStorage("sds-theme") + reload, never by
//     flipping data-theme at runtime — injected nav/footer markup keeps the
//     colours it resolved at injection time.
//  2. Gradient fills must be composited WITH stop alpha. Bailing out (the old
//     behaviour) silently skips most buttons; averaging stops without alpha
//     turns a 10% decorative overlay into an opaque fill and invents failures.
//  3. The composite stack bottoms out on the REAL body background, not a
//     hardcoded dark, or every translucent bar under-measures in light mode.
//  4. `background-clip: text` elements are skipped — the gradient IS the
//     letterform there, not a fill behind it.
//  5. Gradients are scored at their WORST stop, but stops with ~0 alpha are
//     dropped: a fully transparent stop is a decorative fade-out and reveals
//     the layer beneath, it does not define the ground.
//  6. Canvas/WebGL text is invisible here by construction. Screenshots DO work
//     in the preview pane — look at those pages as well as measuring them.
(function () {
  var REVEAL = [
    '.glass', '.glass-card', '.panel', '.card', '.portfolio-tile',
    '.portfolio-card', '.pricing-banner', '.pricing-tier-link', '.feature-card',
    '.service-card', '.case-card', '.checkout-panel', '.account-card',
    '.portal-card', '.dashboard-card', '.message-card', '.stat-card',
    '.sds-card', '.app-card', '.hero-enter', '.skel-hero', '.reveal-up'
  ];

  // nav.css holds the whole list at opacity 0 until <html> gains
  // page-content-ready (~800ms). Auditing sooner reads elements mid-fade,
  // which over-estimates contrast, or skips them entirely at exactly 0.
  // An inline style is not enough: the page's own reveal script re-sets
  // html.style.opacity after load, so a plain assignment here is silently
  // undone and every element then reads as invisible. Use a stylesheet with
  // !important, which nothing on the page outranks.
  window.__sdsForceReveal = function () {
    var d = document.documentElement;
    d.classList.add('sds-logo-loaded', 'page-content-ready');
    // .reveal-up sections are held at opacity 0 until surette-logo.js's
    // IntersectionObserver adds .in-view on scroll. Scrolling the page is the
    // honest trigger; this marks whatever the scroll did not reach.
    document.querySelectorAll('.reveal-up').forEach(function (el) {
      el.classList.add('in-view');
    });
    var id = '__sds-audit-force';
    if (!document.getElementById(id)) {
      var st = document.createElement('style');
      st.id = id;
      st.textContent =
        // scroll-behavior: smooth makes scrollTo() animate, so a rect measured
        // right after a scroll does not match a screenshot taken moments later
        'html, body { opacity: 1 !important; animation: none !important;' +
        ' scroll-behavior: auto !important; }' +
        REVEAL.join(',') +
        ' { opacity: 1 !important; transform: none !important; ' +
        'transition: none !important; animation: none !important; }';
      (document.head || d).appendChild(st);
    }
    return REVEAL.length;
  };

  // True when the forced reveal is actually in effect — a sweep must not
  // report "0 failures" from a page whose content never became visible.
  window.__sdsRevealOk = function () {
    return parseFloat(getComputedStyle(document.documentElement).opacity) > 0.99 &&
           parseFloat(getComputedStyle(document.body).opacity) > 0.99;
  };

  function ch(v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }
  function lum(c) { return 0.2126 * ch(c.r) + 0.7152 * ch(c.g) + 0.0722 * ch(c.b); }
  function ratio(f, b) {
    var L1 = lum(f), L2 = lum(b);
    var hi = Math.max(L1, L2), lo = Math.min(L1, L2);
    return (hi + 0.05) / (lo + 0.05);
  }
  function parse(s) {
    if (!s) return null;
    var m = String(s).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    var p = m[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat);
    if (p.length < 3 || p.some(isNaN)) return null;
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }
  // src over dst
  function over(s, d) {
    return {
      r: s.r * s.a + d.r * (1 - s.a),
      g: s.g * s.a + d.g * (1 - s.a),
      b: s.b * s.a + d.b * (1 - s.a),
      a: 1
    };
  }
  function hex(c) {
    return '#' + [c.r, c.g, c.b].map(function (v) {
      return ('0' + Math.round(v).toString(16)).slice(-2);
    }).join('');
  }

  // Split a comma-separated CSS list at paren depth 0.
  function splitTop(s) {
    var out = [], depth = 0, cur = '';
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (c === '(') depth++;
      else if (c === ')') depth--;
      if (c === ',' && depth === 0) { out.push(cur); cur = ''; continue; }
      cur += c;
    }
    if (cur.trim()) out.push(cur);
    return out.map(function (x) { return x.trim(); }).filter(Boolean);
  }

  // A "paint" is one option-set of candidate colours for a single painted
  // layer. A solid colour yields one option; a gradient yields one per stop
  // (worst-stop scoring), minus stops that are effectively transparent.
  function paintsFor(cs) {
    var paints = [];
    var bi = cs.backgroundImage;
    if (bi && bi !== 'none') {
      // topmost background layer is listed first
      splitTop(bi).forEach(function (layer) {
        if (/gradient\(/i.test(layer)) {
          var stops = (layer.match(/rgba?\([^)]+\)/g) || [])
            .map(parse)
            .filter(function (c) { return c && c.a > 0.04; });
          if (stops.length) paints.push({ kind: 'gradient', opts: stops });
          else paints.push({ kind: 'unknown' });
        } else if (/url\(/i.test(layer)) {
          paints.push({ kind: 'image' });
        }
      });
    }
    var bc = parse(cs.backgroundColor);
    if (bc && bc.a > 0) paints.push({ kind: 'color', opts: [bc] });
    return paints;
  }

  // Opaque ground the whole document sits on — the real body/html fill.
  function documentBase() {
    var nodes = [document.body, document.documentElement];
    for (var i = 0; i < nodes.length; i++) {
      if (!nodes[i]) continue;
      var c = parse(getComputedStyle(nodes[i]).backgroundColor);
      if (c && c.a >= 0.999) return c;
    }
    var inline = parse(document.documentElement.style.background);
    if (inline && inline.a >= 0.999) return inline;
    return document.documentElement.getAttribute('data-theme') === 'light'
      ? { r: 244, g: 242, b: 238, a: 1 }
      : { r: 5, g: 5, b: 5, a: 1 };
  }

  var MAX_CANDIDATES = 24;

  // Returns { candidates: [rgb...], overImage: bool } — every plausible
  // effective background behind this element's text.
  function effectiveBgs(el, base) {
    var paints = [];
    var overImage = false;
    var node = el;
    while (node && node.nodeType === 1) {
      var cs = getComputedStyle(node);
      var list = paintsFor(cs);
      for (var i = 0; i < list.length; i++) {
        var p = list[i];
        if (p.kind === 'image') { overImage = true; continue; }
        if (p.kind === 'unknown') { overImage = true; continue; }
        paints.push(p);
        // an opaque solid hides everything beneath it
        if (p.kind === 'color' && p.opts[0].a >= 0.999) { node = null; break; }
      }
      if (!node) break;
      node = node.parentElement;
    }

    // composite bottom-up, expanding candidates as we go
    var cands = [base];
    for (var j = paints.length - 1; j >= 0; j--) {
      var opts = paints[j].opts;
      var next = [];
      for (var a = 0; a < cands.length; a++) {
        for (var b = 0; b < opts.length; b++) {
          next.push(over(opts[b], cands[a]));
          if (next.length >= MAX_CANDIDATES) break;
        }
        if (next.length >= MAX_CANDIDATES) break;
      }
      cands = next;
    }
    return { candidates: cands, overImage: overImage };
  }

  function selector(el) {
    var s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    if (el.className && typeof el.className === 'string') {
      s += '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.');
    }
    return s;
  }

  function cumulativeOpacity(el) {
    var o = 1, n = el;
    while (n && n.nodeType === 1) {
      var v = parseFloat(getComputedStyle(n).opacity);
      if (!isNaN(v)) o *= v;
      n = n.parentElement;
    }
    return o;
  }

  window.__sdsAuditContrast = function () {
    var base = documentBase();
    var fails = [];
    var overImage = [];
    var checked = 0, skippedClipText = 0, skippedHidden = 0;
    // why things were skipped — a sweep that reports 0 failures is only
    // meaningful next to these
    var skip = { display: 0, opacity: 0, zeroRect: 0, transparentText: 0 };

    document.querySelectorAll('*').forEach(function (el) {
      var tag = el.tagName.toLowerCase();
      if (tag === 'script' || tag === 'style' || tag === 'noscript' ||
          tag === 'title' || tag === 'option' || tag === 'svg') return;

      // direct text only — never attribute a parent's colour to child text
      var text = Array.prototype.filter
        .call(el.childNodes, function (n) { return n.nodeType === 3; })
        .map(function (n) { return n.textContent.trim(); })
        .join(' ').trim();
      if (text.length < 2) return;

      var cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') { skippedHidden++; skip.display++; return; }
      if (cumulativeOpacity(el) < 0.05) { skippedHidden++; skip.opacity++; return; }

      // the gradient IS the letterform — not a fill behind it
      var clip = cs.webkitBackgroundClip || cs.backgroundClip;
      if (clip === 'text') { skippedClipText++; return; }

      var rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) { skippedHidden++; skip.zeroRect++; return; }
      // off-canvas duplicated trees (mobile/desktop wrappers) still count —
      // they are real at their own width — but zero-size ones do not.

      var fg = parse(cs.color);
      if (!fg || fg.a < 0.05) { skippedHidden++; skip.transparentText++; return; }

      var res = effectiveBgs(el, base);
      checked++;

      var px = parseFloat(cs.fontSize);
      var bold = parseFloat(cs.fontWeight) >= 700;
      var large = px >= 24 || (bold && px >= 18.66);
      var need = large ? 3 : 4.5;

      var worst = null, worstBg = null;
      res.candidates.forEach(function (bg) {
        var fgc = fg.a < 1 ? over(fg, bg) : fg;
        var r = ratio(fgc, bg);
        if (worst === null || r < worst) { worst = r; worstBg = bg; }
      });
      if (worst === null) return;

      if (worst < need) {
        var row = {
          ratio: +worst.toFixed(2),
          need: need,
          text: text.slice(0, 60),
          sel: selector(el),
          color: cs.color,
          bg: hex(worstBg),
          px: +px.toFixed(1),
          weight: cs.fontWeight,
          overImage: res.overImage
        };
        // text over a photo/unknown paint is reported separately: the measured
        // ground is the layer under the image, which may not be what shows
        if (res.overImage) overImage.push(row); else fails.push(row);
      }
    });

    fails.sort(function (a, b) { return a.ratio - b.ratio; });
    overImage.sort(function (a, b) { return a.ratio - b.ratio; });

    return {
      theme: document.documentElement.getAttribute('data-theme'),
      url: location.pathname,
      width: window.innerWidth,
      base: hex(base),
      checked: checked,
      skippedClipText: skippedClipText,
      skippedHidden: skippedHidden,
      skipReasons: skip,
      canvases: document.querySelectorAll('canvas').length,
      failCount: fails.length,
      fails: fails,
      overImageCount: overImage.length,
      overImage: overImage
    };
  };
  // ── Rendered-pixel pass ───────────────────────────────────────────────────
  // Computed style can only walk ANCESTORS. It is blind to anything painted
  // behind text by a sibling — an absolutely-positioned glow, a decorative
  // rule, a canvas, a photo. On this site that gap is real: the auction page's
  // .transfer-badge measured 3.78:1 by ancestor-walk and 2.27:1 on screen,
  // because a glowing 2px divider passes directly behind it.
  //
  // So: hide every glyph, screenshot the page, and sample the exact line boxes
  // the glyphs occupied. That ground is what the eye actually sees.

  window.__sdsHideText = function () {
    var st = document.createElement('style');
    st.id = '__sds-hide-text';
    st.textContent = '*, *::before, *::after { color: transparent !important;' +
      ' -webkit-text-fill-color: transparent !important;' +
      ' text-shadow: none !important; text-decoration-color: transparent !important; }';
    (document.head || document.documentElement).appendChild(st);
    return true;
  };

  // Elements behind the collected boxes, indexed by box id, so the occlusion
  // pass can ask "is this text actually the topmost paint here?".
  var __sdsBoxEls = [];

  // Exact glyph line boxes, in document coordinates.
  window.__sdsCollectTextBoxes = function () {
    var out = [];
    var i = 0;
    __sdsBoxEls = [];
    document.querySelectorAll('*').forEach(function (el) {
      var tag = el.tagName.toLowerCase();
      if (tag === 'script' || tag === 'style' || tag === 'noscript' ||
          tag === 'title' || tag === 'option' || tag === 'svg') return;

      var text = Array.prototype.filter
        .call(el.childNodes, function (n) { return n.nodeType === 3; })
        .map(function (n) { return n.textContent.trim(); })
        .join(' ').trim();
      if (text.length < 2) return;

      var cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') return;
      var clip = cs.webkitBackgroundClip || cs.backgroundClip;
      if (clip === 'text') return;
      var fg = null;
      var m = String(cs.color).match(/rgba?\(([^)]+)\)/);
      if (m) {
        var p = m[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat);
        if (p.length >= 3) fg = { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
      }
      if (!fg || fg.a < 0.05) return;
      var o = 1, n = el;
      while (n && n.nodeType === 1) {
        var v = parseFloat(getComputedStyle(n).opacity);
        if (!isNaN(v)) o *= v;
        n = n.parentElement;
      }
      if (o < 0.05) return;

      // line boxes of this element's own text nodes only
      var rects = [];
      Array.prototype.forEach.call(el.childNodes, function (node) {
        if (node.nodeType !== 3 || !node.textContent.trim()) return;
        var range = document.createRange();
        range.selectNodeContents(node);
        Array.prototype.forEach.call(range.getClientRects(), function (r) {
          if (r.width < 2 || r.height < 2) return;
          rects.push({
            x: r.left + window.scrollX,
            y: r.top + window.scrollY,
            w: r.width,
            h: r.height
          });
        });
      });
      if (!rects.length) return;

      var px = parseFloat(cs.fontSize);
      var bold = parseFloat(cs.fontWeight) >= 700;
      __sdsBoxEls.push(el);
      out.push({
        id: i++,
        rects: rects,
        fg: fg,
        px: +px.toFixed(1),
        large: px >= 24 || (bold && px >= 18.66),
        text: text.slice(0, 60),
        sel: selector(el)
      });
    });
    return out;
  };

  // Is this element the thing actually painted at these coordinates?
  function topmostAt(el, r) {
    var xs = [r.left + r.width * 0.15, r.left + r.width * 0.5, r.left + r.width * 0.85];
    var y = r.top + r.height / 2;
    if (y < 1 || y > window.innerHeight - 1) return false;
    for (var i = 0; i < xs.length; i++) {
      var x = xs[i];
      if (x < 1 || x > window.innerWidth - 1) continue;
      var top = document.elementFromPoint(x, y);
      if (!top) continue;
      if (top === el || el.contains(top) || top.contains(el)) return true;
    }
    return false;
  }

  // Occlusion test. A line box having geometry does not mean a reader sees it:
  // the collectible cards keep their whole back face laid out behind the front
  // one, so sampling those boxes reads front-face pixels against back-face ink
  // and invents ~58 failures across the two gallery pages. Anything not topmost
  // at its own coordinates is not on screen.
  //
  // Must run with the box scrolled into view — elementFromPoint is viewport-
  // relative. The driver walks the page a viewport at a time.
  window.__sdsProbeVisible = function (boxes) {
    var seen = {};
    var vw = window.innerWidth, vh = window.innerHeight;
    boxes.forEach(function (b) {
      var el = __sdsBoxEls[b.id];
      if (!el) return;
      for (var i = 0; i < b.rects.length; i++) {
        var r = b.rects[i];
        var y = r.y - window.scrollY + r.h / 2;
        if (y < 1 || y > vh - 1) continue;
        // probe start, middle and end of the line
        var xs = [r.x + r.w * 0.15, r.x + r.w * 0.5, r.x + r.w * 0.85];
        for (var j = 0; j < xs.length; j++) {
          var x = xs[j] - window.scrollX;
          if (x < 1 || x > vw - 1) continue;
          var top = document.elementFromPoint(x, y);
          if (!top) continue;
          if (top === el || el.contains(top) || top.contains(el)) {
            seen[b.id] = true;
            return;
          }
        }
      }
    });
    return seen;
  };

  // Fresh, viewport-relative line boxes for the given box ids, measured at the
  // current scroll position. Document coordinates captured once go stale the
  // moment anything reflows — and they are simply wrong for position:fixed
  // chrome, which does not move with the page. Re-measure at sample time.
  window.__sdsRectsNow = function (ids) {
    var out = {};
    var vh = window.innerHeight, vw = window.innerWidth;
    ids.forEach(function (id) {
      var el = __sdsBoxEls[id];
      if (!el) return;
      var rects = [];
      Array.prototype.forEach.call(el.childNodes, function (node) {
        if (node.nodeType !== 3 || !node.textContent.trim()) return;
        var range = document.createRange();
        range.selectNodeContents(node);
        Array.prototype.forEach.call(range.getClientRects(), function (r) {
          if (r.width < 2 || r.height < 2) return;
          if (r.top < 0 || r.bottom > vh) return;   // must be fully on screen
          if (r.left < 0 || r.right > vw) return;
          // Visibility must be judged PER LINE, not per element. A paragraph
          // scrolled so its first lines sit behind the fixed header is still
          // "visible" as an element, and sampling those lines reads the nav's
          // opaque fill instead of the card behind the text — portfolio.html's
          // cream card reported 1.13:1 that way.
          if (!topmostAt(el, r)) return;
          rects.push({ x: r.left, y: r.top, w: r.width, h: r.height });
        });
      });
      if (rects.length) out[id] = rects;
    });
    return out;
  };

  // Sample the screenshot under each box. Reports the ground at the 5th and
  // 95th luminance percentile — the extremes an eye lands on — ignoring the
  // outermost pixels so an anti-aliased border does not masquerade as ground.
  window.__sdsSampleGround = function (dataUrl, boxes, dpr) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        var c = document.createElement('canvas');
        c.width = img.width; c.height = img.height;
        var x = c.getContext('2d', { willReadFrequently: true });
        x.drawImage(img, 0, 0);
        var results = [];
        boxes.forEach(function (b) {
          var fgc = b.fg;
          var need = b.large ? 3 : 4.5;
          var all = [];        // every sampled pixel ratio
          var allPx = [];
          var maxChunk = 0;    // worst contiguous run of failing ground
          var worstChunkPx = null;

          b.rects.forEach(function (r) {
            var sx = Math.max(0, Math.round((r.x + 1) * dpr));
            var sy = Math.max(0, Math.round((r.y + 1) * dpr));
            var sw = Math.max(1, Math.round((r.w - 2) * dpr));
            var sh = Math.max(1, Math.round((r.h - 2) * dpr));
            if (sx + sw > c.width) sw = c.width - sx;
            if (sy + sh > c.height) sh = c.height - sy;
            if (sw < 1 || sh < 1) return;
            var d = x.getImageData(sx, sy, sw, sh).data;

            // Split the line into word-sized chunks. Hairline decoration
            // spreads its failures thinly across every chunk; a bright plume
            // or a wrong-theme panel blacks out whole chunks. Only the second
            // makes text unreadable, and only chunking tells them apart.
            var chunkW = Math.max(8, Math.round(sw / 10));
            for (var c0 = 0; c0 < sw; c0 += chunkW) {
              var cw = Math.min(chunkW, sw - c0);
              var bad = 0, tot = 0;
              var acc = { r: 0, g: 0, b: 0 };
              for (var yy = 0; yy < sh; yy++) {
                for (var xx = 0; xx < cw; xx++) {
                  var o = ((yy * sw) + (c0 + xx)) * 4;
                  var p = { r: d[o], g: d[o + 1], b: d[o + 2] };
                  var rr = ratio(fgc.a < 1 ? over(fgc, p) : fgc, p);
                  all.push(rr); allPx.push(p);
                  acc.r += p.r; acc.g += p.g; acc.b += p.b;
                  tot++;
                  if (rr < need) bad++;
                }
              }
              if (!tot) continue;
              var frac = bad / tot;
              if (frac > maxChunk) {
                maxChunk = frac;
                worstChunkPx = { r: acc.r / tot, g: acc.g / tot, b: acc.b / tot };
              }
            }
          });

          if (!all.length) { results.push(null); return; }
          var sorted = all.slice().sort(function (a, b2) { return a - b2; });
          var median = sorted[Math.floor(sorted.length * 0.5)];
          var p05 = sorted[Math.floor(sorted.length * 0.05)];
          var bad2 = 0;
          for (var q = 0; q < all.length; q++) if (all[q] < need) bad2++;
          var failFrac = bad2 / all.length;
          var lums = allPx.map(lum);
          var ord = allPx.map(function (_, i2) { return i2; })
            .sort(function (a, b2) { return lums[a] - lums[b2]; });

          results.push({
            id: b.id,
            median: +median.toFixed(2),
            p05: +p05.toFixed(2),
            failFrac: +failFrac.toFixed(3),
            maxChunk: +maxChunk.toFixed(3),
            need: need,
            // Real failure: the typical ground fails, or a word-sized run of
            // the line sits almost entirely on failing ground. Calibrated by
            // eye against two known cases: apps.html's hairline fractal peaks
            // near 0.70 per chunk and reads fine, while account.html's login
            // copy under a bright plume runs 0.85-1.00 and does not.
            fails: median < need || maxChunk >= 0.75,
            // 0.60-0.75: busy but legible. Worth a look, not a defect.
            review: median >= need && maxChunk >= 0.6 && maxChunk < 0.75,
            groundLo: hex(allPx[ord[Math.floor(ord.length * 0.05)]]),
            groundMid: hex(allPx[ord[Math.floor(ord.length * 0.5)]]),
            groundHi: hex(allPx[ord[Math.floor(ord.length * 0.95)]]),
            worstChunk: worstChunkPx ? hex(worstChunkPx) : null,
            color: 'rgb(' + [b.fg.r, b.fg.g, b.fg.b].join(',') + ')',
            px: b.px, text: b.text, sel: b.sel,
            samples: all.length
          });
        });
        resolve(results.filter(Boolean));
      };
      img.onerror = function () { resolve([]); };
      img.src = dataUrl;
    });
  };
})();
