/**
 * Surette Data Systems — Animated Logo
 * Usage:
 *   1. Add <div id="sds-logo"></div> where your logo should appear.
 *   2. Add <script src="surette-logo.js"></script> before </body>.
 *   Optional: pass a custom mount id → SuretteLogo.init('my-id')
 */
(function (global) {
  'use strict';

  // Stamp the class synchronously at parse time (before DOMContentLoaded).
  // nav.css uses this to suppress the CSS-only reveal animation on pages that
  // load this script, so JS fully controls when the page fades in.
  document.documentElement.classList.add('sds-logo-loaded');

  function init(mountId) {
    mountId = mountId || 'sds-logo';
    const mount = document.getElementById(mountId);
    if (!mount) return;

    injectFont();
    injectStyles(mountId);
    mount.innerHTML = buildHTML();
    startAnimation(mountId);
  }

  function injectFont() {
    if (document.getElementById('sds-font-link')) return;
    const link = document.createElement('link');
    link.id = 'sds-font-link';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Exo+2:wght@300;700&display=swap';
    document.head.appendChild(link);
  }

  function injectStyles(id) {
    if (document.getElementById('sds-styles')) return;
    const css = `
      #${id} a.sds-anchor {
        display: inline-flex;
        align-items: center;
        gap: 11px;
        text-decoration: none;
        cursor: pointer;
        padding: 4px 10px 4px 4px;
        border-radius: 6px;
        position: relative;
        transition: background 0.35s;
        -webkit-user-select: none;
        user-select: none;
      }
      #${id} a.sds-anchor:hover {
        background: rgba(0, 178, 255, 0.05);
      }
      #${id} a.sds-anchor::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 6px;
        border: 1px solid rgba(0, 178, 255, 0);
        pointer-events: none;
        transition: border-color 0.35s;
      }
      #${id} a.sds-anchor:hover::after {
        border-color: rgba(0, 178, 255, 0.2);
      }
      #${id} canvas.sds-canvas {
        display: block;
        flex-shrink: 0;
      }
      #${id} .sds-text {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }
      #${id} .sds-co {
        font-family: 'Exo 2', 'Segoe UI', sans-serif;
        font-size: 15px;
        font-weight: 700;
        letter-spacing: 0.16em;
        color: #ddeeff;
        line-height: 1;
        text-transform: uppercase;
        text-shadow: 0 0 12px rgba(0, 190, 255, 0.45);
        transition: text-shadow 0.35s, color 0.35s;
      }
      #${id} .sds-sub {
        font-family: 'Exo 2', 'Segoe UI', sans-serif;
        font-size: 8px;
        font-weight: 300;
        letter-spacing: 0.34em;
        color: #00b8df;
        line-height: 1;
        text-transform: uppercase;
        opacity: 0.7;
        transition: opacity 0.35s, color 0.35s;
      }
      #${id} a.sds-anchor:hover .sds-co {
        color: #eef6ff;
        text-shadow: 0 0 18px rgba(0, 210, 255, 0.8), 0 0 35px rgba(0, 180, 255, 0.3);
      }
      #${id} a.sds-anchor:hover .sds-sub {
        opacity: 1;
        color: #20d8ff;
      }
    `;
    const style = document.createElement('style');
    style.id = 'sds-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildHTML() {
    return `
      <a href="/" class="sds-anchor" title="Surette Data Systems">
        <canvas class="sds-canvas" width="60" height="60"></canvas>
        <div class="sds-text">
          <span class="sds-co">Surette</span>
          <span class="sds-sub">Data Systems</span>
        </div>
      </a>
    `;
  }

  function startAnimation(mountId) {
    const mount = document.getElementById(mountId);
    const canvas = mount.querySelector('canvas.sds-canvas');
    const anchor = mount.querySelector('a.sds-anchor');
    if (!canvas || !anchor) return;

    const ctx = canvas.getContext('2d');
    const W = 60, H = 60, cx = 30, cy = 30;
    let t = 0, hov = false;

    const orbs = [
      { a: 0,     r: 26.5, spd: 0.014, col: '#00e0ff' },
      { a: 2.094, r: 26.5, spd: 0.014, col: '#55b8f0' },
      { a: 4.189, r: 26.5, spd: 0.014, col: '#00e0ff' },
    ];

    let hexRot = Math.PI / 6;

    function hpts(r, rot) {
      return Array.from({ length: 6 }, function (_, i) {
        var a = rot + (Math.PI / 3) * i;
        return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
      });
    }

    function tracePath(pts) {
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.closePath();
    }

    function drawFrame() {
      requestAnimationFrame(drawFrame);
      ctx.clearRect(0, 0, W, H);
      t += 0.02;

      var sp = hov ? 1.9 : 1;
      var pu = 0.5 + 0.5 * Math.sin(t * 1.6);
      hexRot += 0.0028 * sp;

      // Outer orbit ring
      ctx.globalAlpha = 0.18 + 0.07 * pu;
      ctx.strokeStyle = '#006080';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.arc(cx, cy, 26.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Tick marks
      for (var i = 0; i < 20; i++) {
        var ta = (Math.PI * 2 / 20) * i + t * 0.13;
        var isMain = i % 5 === 0, isSub = i % 2 === 0;
        var r1 = isMain ? 22.5 : (isSub ? 24 : 25);
        ctx.globalAlpha = isMain ? 0.65 : (isSub ? 0.3 : 0.14);
        ctx.strokeStyle = '#00a8cc';
        ctx.lineWidth = isMain ? 1.1 : 0.5;
        ctx.beginPath();
        ctx.moveTo(cx + r1 * Math.cos(ta), cy + r1 * Math.sin(ta));
        ctx.lineTo(cx + 26.5 * Math.cos(ta), cy + 26.5 * Math.sin(ta));
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Sweeping arc highlight
      var aa = t * 0.55;
      ctx.globalAlpha = 0.5 + 0.18 * pu + (hov ? 0.15 : 0);
      ctx.strokeStyle = '#00ddff';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(cx, cy, 26.5, aa, aa + 1.15);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Secondary arc
      var aa2 = t * 0.55 + Math.PI + 0.3;
      ctx.globalAlpha = 0.2 + 0.08 * pu;
      ctx.strokeStyle = '#0088aa';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(cx, cy, 26.5, aa2, aa2 + 0.7);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Orbital particles
      orbs.forEach(function (p) {
        p.a += p.spd * sp;
        var px = cx + p.r * Math.cos(p.a);
        var py = cy + p.r * Math.sin(p.a);

        for (var tr = 6; tr >= 1; tr--) {
          var ta2 = p.a - tr * 0.09 * sp;
          ctx.globalAlpha = 0.03 * (7 - tr);
          ctx.fillStyle = p.col;
          ctx.beginPath();
          ctx.arc(cx + p.r * Math.cos(ta2), cy + p.r * Math.sin(ta2), 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 0.22 + (hov ? 0.1 : 0);
        ctx.fillStyle = p.col;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.fillStyle = '#e8f8ff';
        ctx.beginPath();
        ctx.arc(px, py, 1.3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Hexagon
      var outerR = 19.5, innerR = 14;
      var op = hpts(outerR, hexRot);
      var ip = hpts(innerR, hexRot + Math.PI / 6);

      // Glow layers
      for (var g = 4; g >= 1; g--) {
        var gp = hpts(outerR + g * 1.6, hexRot);
        tracePath(gp);
        ctx.globalAlpha = (0.035 / g) * (0.9 + 0.5 * pu) * (0.85 + 0.4 * (hov ? 1 : 0));
        ctx.strokeStyle = '#00b8ff';
        ctx.lineWidth = g * 2.2;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Hex fill
      tracePath(op);
      var grad = ctx.createRadialGradient(cx, cy, 1, cx, cy, outerR);
      grad.addColorStop(0,   'rgba(2,18,42,0.97)');
      grad.addColorStop(0.6, 'rgba(1,12,32,0.98)');
      grad.addColorStop(1,   'rgba(0,6,20,0.99)');
      ctx.fillStyle = grad;
      ctx.globalAlpha = 1;
      ctx.fill();

      // Hex border
      tracePath(op);
      var bri = 140 + Math.round(90 * pu) + (hov ? 20 : 0);
      ctx.strokeStyle = 'rgba(0,' + bri + ',240,' + (0.6 + 0.25 * pu + (hov ? 0.15 : 0)) + ')';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Inner hex
      tracePath(ip);
      ctx.strokeStyle = 'rgba(0,120,190,' + (0.18 + 0.1 * pu) + ')';
      ctx.lineWidth = 0.55;
      ctx.stroke();

      // Scanline
      var sc = (t * 9) % (outerR * 2 + 10);
      var sy = cy - outerR - 5 + sc;
      if (sy >= cy - outerR && sy <= cy + outerR) {
        tracePath(op);
        ctx.save();
        ctx.clip();
        var sa = 0.14 * Math.sin(((sc - 5) / (outerR * 2)) * Math.PI) * (1 + (hov ? 0.6 : 0));
        ctx.globalAlpha = Math.max(0, sa);
        ctx.fillStyle = '#00ccee';
        ctx.fillRect(cx - outerR, sy - 0.8, outerR * 2, 1.6);
        ctx.restore();
        ctx.globalAlpha = 1;
      }

      // SDS text
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = "bold 10px Consolas,'Courier New',monospace";

      for (var g2 = 3; g2 >= 1; g2--) {
        ctx.globalAlpha = (0.12 + 0.06 * pu + (hov ? 0.08 : 0)) / g2;
        ctx.fillStyle = '#00c0ff';
        ctx.fillText('SDS', cx + g2 * 0.4, cy + g2 * 0.4);
        ctx.fillText('SDS', cx - g2 * 0.4, cy - g2 * 0.4);
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(215,240,255,' + (0.92 + 0.06 * pu) + ')';
      ctx.fillText('SDS', cx, cy);

      // Primary vertex nodes
      [0, 2, 4].forEach(function (vi, i) {
        var vx = op[vi][0], vy = op[vi][1];
        var np = 0.35 + 0.55 * Math.sin(t * 2.8 + i * 2.09);
        ctx.globalAlpha = np * 0.75;
        ctx.fillStyle = '#00d8ff';
        ctx.beginPath();
        ctx.arc(vx, vy, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.2 * np;
        ctx.beginPath();
        ctx.arc(vx, vy, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Secondary vertex nodes
      [1, 3, 5].forEach(function (vi, i) {
        var vx = op[vi][0], vy = op[vi][1];
        var np = 0.2 + 0.3 * Math.sin(t * 2.2 + i * 1.5 + 1.0);
        ctx.globalAlpha = np * 0.4;
        ctx.fillStyle = '#4488bb';
        ctx.beginPath();
        ctx.arc(vx, vy, 1.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    anchor.addEventListener('mouseenter', function () { hov = true; });
    anchor.addEventListener('mouseleave', function () { hov = false; });

    drawFrame();
  }

  global.SuretteLogo = { init: init };

  // Page reveal — sets html opacity to 1 so the page fades in.
  // nav.css sets html { opacity: 0 } from first paint to prevent the nav-logo
  // canvas jump and Tailwind FOUC from being visible.
  function dmRevealPage() {
    document.documentElement.style.opacity = '1';

    // Fade the loading spinner out immediately — it sits above the page while
    // the html opacity transition runs, then disappears revealing live content.
    var loader = document.getElementById('page-loader');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 550);
    }

    // Mark content ready shortly after reveal so hero-enter animations fire
    // while the spinner is still fading — creates a cinematic overlap.
    setTimeout(function () {
      document.documentElement.classList.add('page-content-ready');
      initScrollReveal();
    }, 120);
  }

  function dmShowPageLoader() {
    var loader = document.getElementById('page-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'page-loader';
      loader.setAttribute('aria-hidden', 'true');
      loader.innerHTML = '<svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="23" cy="23" r="19" stroke="rgba(0,240,255,0.12)" stroke-width="3"/><path d="M23 4 A19 19 0 0 1 42 23" stroke="#00f0ff" stroke-width="3" stroke-linecap="round"/></svg><span>Loading</span>';
      document.body.appendChild(loader);
    }
    loader.classList.remove('fade-out');
    return loader;
  }

  // Scroll reveal — observes any .reveal-up elements and adds .in-view when
  // they enter the viewport. Works on every page that uses the class.
  function initScrollReveal() {
    if (!window.IntersectionObserver) {
      document.querySelectorAll('.reveal-up').forEach(function (el) {
        el.classList.add('in-view');
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });
    document.querySelectorAll('.reveal-up').forEach(function (el) { io.observe(el); });
  }

  // Wait for all DCL handlers to finish (setTimeout 0), then two rAFs so the
  // logo canvas and any Tailwind-processed nav classes have been laid out and
  // painted before we reveal.
  function dmScheduleReveal() {
    setTimeout(function () {
      requestAnimationFrame(function () {
        requestAnimationFrame(dmRevealPage);
      });
    }, 0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init();
      dmScheduleReveal();
    });
  } else {
    init();
    dmScheduleReveal();
  }

  // Safety: reveal after 850ms regardless, in case something above stalls.
  setTimeout(dmRevealPage, 850);

  // bfcache: when the browser restores this page from the back/forward cache,
  // scripts don't re-run, so the existing opacity (1) is preserved correctly.
  // But if something left it at 0, snap it back.
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { dmRevealPage(); }
  });

  // Exit transition: show the small loader briefly before same-site navigation
  // so users see an intentional transition cue instead of a frozen page.
  var dmNavigationPending = false;
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || dmNavigationPending) return;
    if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    if (a.target && a.target !== '_self') return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
    var url;
    try {
      url = new URL(href, location.href);
      if (url.origin !== location.origin) return;
    } catch (_) { return; }
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return;

    e.preventDefault();
    dmNavigationPending = true;
    dmShowPageLoader();
    document.documentElement.style.opacity = '1';

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        setTimeout(function () {
          window.location.href = url.href;
        }, 90);
      });
    });
  });

}(window));
