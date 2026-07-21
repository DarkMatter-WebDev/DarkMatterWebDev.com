/*!
 * Surette Physics Wordmark — Canvas
 * Full-fidelity, zero-dependency Canvas replica of surette-physics-wordmark.js
 *
 * Single group (backward-compat):
 *   new SurettePhysicsWordmark(canvas, { text: 'SURETTE' })
 *
 * Multi-group (wordmark + subline):
 *   new SurettePhysicsWordmark(canvas, {
 *     groups: [
 *       { text: 'SURETTE' },                          // inherits WORDMARK defaults
 *       { text: 'DESIGN STUDIO', preset: 'subline' }, // inherits SUBLINE defaults
 *     ]
 *   })
 *
 * Any group property overrides its preset default.
 * Public API: destroy() · releaseAll() · setPhysicsEnabled(bool)
 */
(function (global) {
  'use strict';

  // ─── Global physics constants ────────────────────────────────────────────────
  const GRAVITY_LETTER      = 0.16;
  const MAX_LETTER_SPEED    = 11.5;

  const LETTER_KNOCK_MIN_SPEED= 0.48;
  const KNOCK_COOLDOWN_MS     = 280;
  const ENGAGE_COOLDOWN_MS    = 500;
  const HOVER_DEBOUNCE_MS     = 340;

  const REST_V        = 0.18;
  const REST_W        = 0.014;
  const SETTLE_MS     = 2600;
  const RETURN_DUR_MS = 900;
  const OFFSCREEN_PAD = 260;

  const INTRO_DELAY        = 350;
  const INTRO_STEP         = 260;
  const INTRO_FILL_DUR     = 520;
  const INTRO_SETTLE_DUR   = 300;
  const INTRO_COLOR_LEAD   = 1.18;

  const BG = '#09060c';

  // ─── Group presets ───────────────────────────────────────────────────────────
  // Merge order: preset defaults ← group options passed by caller.

  const GROUP_PRESETS = {
    wordmark: {
      font:         '"Archivo Expanded","Eurostile",sans-serif',
      weight:       700,
      sizeFactor:   0.128,       // clamp(W * factor, sizeMin, sizeMax) — desktop
      sizeMobile:   0.138,       // mobile multiplier
      sizeMin:      46,
      sizeMax:      112,
      color:        '#ffffff',
      spacing:      0.062,       // letter spacing as fraction of font-size
      yFactor:      0.44,        // vertical center as fraction of canvas H
      yMobile:      0.46,
      yGap:         0,           // extra gap below previous group (px); ignored for group 0
      introTints:        ['#A020F0', '#7B2FBE', '#2347D4', '#4F86C6'],
      introDelay:        0,      // extra ms before this group starts
      simultaneousIntro: true,   // all letters fill at once (no per-letter stagger)
      autoDropDelay:     0,      // drop immediately after intro
      autoDropStagger:   0,      // all letters drop simultaneously
      bounceReturn:      true,   // bounce off floor then return home
      bouncesBeforeReturn: 2,   // how many floor hits before returning
      physics: {
        restitution: 0.66,       // floor bounce coefficient
        wallBounce:  0.70,
        frictionAir: 0.013,
        angularDamp: 0.016,
      },
    },
    subline: {
      font:         '"JetBrains Mono","Fira Mono","Courier New",monospace',
      weight:       600,
      sizeFactor:   0.028,
      sizeMobile:   0.036,
      sizeMin:      13,
      sizeMax:      24,
      color:        '#AAFF00',
      spacing:      0.08,
      yFactor:      null,        // null = auto-stack below previous group
      yMobile:      null,
      yGap:         14,          // px gap between groups
      introTints:        ['#AAFF00', '#C6FF00', '#80FF00'],
      introDelay:        280,
      simultaneousIntro: true,
      autoDropDelay:     0,
      autoDropStagger:   0,
      bounceReturn:      true,
      returnDur:         220,
      physics: {
        restitution: 0.74,       // higher than wordmark (original subline: 0.972)
        wallBounce:  0.76,
        frictionAir: 0.009,
        angularDamp: 0.013,
      },
    },
  };

  // ─── Utils ───────────────────────────────────────────────────────────────────
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const lerp  = (a, b, t)   => a + (b - a) * t;

  function eio(t) {
    t = clamp(t, 0, 1);
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function hexRgba(hex, a) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `rgba(${r},${g},${b},${a.toFixed(3)})`;
  }

  function rgbMix(h1, h2, t) {
    const p = h => [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
    const [r1,g1,b1] = p(h1), [r2,g2,b2] = p(h2);
    return `rgb(${Math.round(lerp(r1,r2,t))},${Math.round(lerp(g1,g2,t))},${Math.round(lerp(b1,b2,t))})`;
  }

  // Deep merge: base ← override (only own properties, recurse for plain objects)
  function mergeGroup(base, override) {
    const out = Object.assign({}, base);
    for (const k of Object.keys(override || {})) {
      if (override[k] !== null && typeof override[k] === 'object' && !Array.isArray(override[k])
          && typeof base[k] === 'object' && base[k] !== null) {
        out[k] = Object.assign({}, base[k], override[k]);
      } else if (override[k] !== undefined) {
        out[k] = override[k];
      }
    }
    return out;
  }

  // Resolve the groups config array from raw options
  function resolveGroups(opts) {
    if (opts.groups && opts.groups.length) {
      return opts.groups.map(g => {
        const preset = GROUP_PRESETS[g.preset] || GROUP_PRESETS.wordmark;
        return mergeGroup(preset, g);
      });
    }
    // Backward-compat: single text string
    return [ mergeGroup(GROUP_PRESETS.wordmark, { text: opts.text || 'SURETTE' }) ];
  }

  // ─── Main class ──────────────────────────────────────────────────────────────

  class SurettePhysicsWordmark {

    constructor(target, opts = {}) {
      this._canvas = typeof target === 'string'
        ? document.querySelector(target) : target;

      if (!(this._canvas instanceof HTMLCanvasElement))
        throw new Error('SurettePhysicsWordmark: target must be a <canvas> or CSS selector');

      this._ctx     = this._canvas.getContext('2d');
      this._groups  = resolveGroups(opts);
      this._bg      = opts.bg !== undefined ? opts.bg : BG;

      this._W = this._H = this._DPR = 0;
      this._letters     = [];
      this._introT      = null;
      this._mouse       = { x: -9999, y: -9999 };
      this._raf         = null;
      this._destroyed   = false;
      this._gravity     = { x: 0, y: 1 };
      this._fontReady   = false;
      this._isMobile    = false;

      this._letterKnockCD     = new Map();
      this._autoDropScheduled = new Set();

      this._bindEvents();
      this._setup();
    }

    // ─── Lifecycle ─────────────────────────────────────────────────────────────

    async _setup() {
      this._isMobile = matchMedia('(max-width:767px)').matches;

      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this._fontReady = true;
        this._resize();
        this._showStatic();
        return;
      }

      this._resize();
      window.addEventListener('resize', this._onResize, { passive: true });

      // Load all unique fonts used by the groups
      const loads = [];
      const seen  = new Set();
      for (const g of this._groups) {
        const key = `${g.weight} 96px ${g.font}`;
        if (!seen.has(key)) { seen.add(key); loads.push(document.fonts.load(key)); }
      }
      try { await Promise.all(loads); } catch (_) {}

      this._fontReady = true;
      this._layoutLetters();

      this._introT = performance.now();
      this._raf = requestAnimationFrame(t => this._tick(t));

      if (this._isMobile) this._armAccelerometer();
    }

    destroy() {
      this._destroyed = true;
      if (this._raf) cancelAnimationFrame(this._raf);
      window.removeEventListener('resize',          this._onResize);
      window.removeEventListener('deviceorientation', this._onOrient, true);
      this._canvas.removeEventListener('click',         this._onClick);
      this._canvas.removeEventListener('dblclick',      this._onDblClick);
      this._canvas.removeEventListener('pointermove',   this._onPointerMove);
      this._canvas.removeEventListener('pointerleave',  this._onPointerLeave);
      this._canvas.removeEventListener('touchstart',    this._onTouch);
    }

    _bindEvents() {
      this._onResize       = () => this._resize();
      this._onClick        = e  => this._handleClick(e);
      this._onDblClick     = ()  => { const now = performance.now(); this._letters.forEach(l => this._releaseLetter(l, now)); };
      this._onPointerMove  = e  => { this._mouse.x = e.clientX; this._mouse.y = e.clientY; };
      this._onPointerLeave = () => { this._mouse.x = -9999; this._mouse.y = -9999; };
      this._onTouch        = e  => this._handleTouch(e);
      this._onOrient       = e  => this._handleOrientation(e);

      this._canvas.style.touchAction = 'none';
      this._canvas.addEventListener('click',         this._onClick);
      this._canvas.addEventListener('dblclick',      this._onDblClick);
      this._canvas.addEventListener('pointermove',   this._onPointerMove, { passive: true });
      this._canvas.addEventListener('pointerleave',  this._onPointerLeave, { passive: true });
      this._canvas.addEventListener('touchstart',    this._onTouch, { passive: false });
    }

    // ─── Resize ────────────────────────────────────────────────────────────────

    _resize() {
      var dpr = devicePixelRatio || 1;
      var w   = this._canvas.clientWidth  || innerWidth;
      var h   = this._canvas.clientHeight || innerHeight;
      // Skip no-op resizes: mobile browser chrome fires height-only window
      // resizes mid-scroll, and when the canvas box itself is unchanged,
      // resetting canvas.width clears the bitmap for nothing — a visible
      // blink of the wordmark while scrolling.
      if (w === this._W && h === this._H && dpr === this._DPR) return;
      this._DPR = dpr;
      this._W   = w;
      this._H   = h;
      this._canvas.width  = Math.round(this._W * this._DPR);
      this._canvas.height = Math.round(this._H * this._DPR);
      this._ctx.setTransform(this._DPR, 0, 0, this._DPR, 0, 0);
      this._isMobile = matchMedia('(max-width:767px)').matches;
      if (this._fontReady) this._layoutLetters();
    }

    // ─── Letter layout (multi-group) ───────────────────────────────────────────

    _groupFontSize(g) {
      const factor = this._isMobile ? g.sizeMobile : g.sizeFactor;
      return clamp(this._W * factor, g.sizeMin, g.sizeMax);
    }

    _layoutLetters() {
      const ctx  = this._ctx;
      const prev = this._letters.slice();

      const allLetters = [];
      let   globalI    = 0;     // unique index across all groups (for cooldown maps)
      let   prevGroupBottomY = null;  // bottom edge of the last group (for auto-stacking)
      let   globalIntroOffset = 0;    // cumulative intro stagger offset (ms)

      this._groups.forEach((g, gi) => {
        const sz    = this._groupFontSize(g);
        const font  = `${g.weight} ${sz}px ${g.font}`;

        ctx.save();
        ctx.font         = font;
        ctx.textBaseline = 'middle';
        ctx.textAlign    = 'center';

        const mm   = ctx.measureText('M');
        const capA = mm.actualBoundingBoxAscent;
        const capD = Math.max(mm.actualBoundingBoxDescent, sz * 0.06);
        const capH = capA + capD;
        const sp   = sz * g.spacing;

        const chars  = g.text.split('');
        const widths = chars.map(c => ctx.measureText(c).width);
        const totalW = widths.reduce((s, w) => s + w, 0) + sp * (chars.length - 1);
        ctx.restore();

        // Vertical center: explicit yFactor or auto-stack below previous group
        let homeY;
        if (g.yFactor !== null && g.yFactor !== undefined) {
          const yf = this._isMobile && g.yMobile != null ? g.yMobile : g.yFactor;
          homeY = this._H * yf;
        } else {
          // Auto-stack: sit below previous group's bottom edge
          homeY = (prevGroupBottomY || this._H * 0.44) + (g.yGap || 0) + capH * 0.5;
        }

        // Update stack pointer for the next group
        prevGroupBottomY = homeY + capH * 0.5;

        // Intro timing offset for this group
        // Group 0 starts at INTRO_DELAY; subsequent groups start after previous group
        // finishes intro + their own introDelay
        const groupIntroStart = globalIntroOffset + (gi > 0 ? (prev.length === 0 ? 0 : g.introDelay || 0) : 0);

        let curX = (this._W - totalW) * 0.5 + (g.xOffset || 0);

        chars.forEach((char, li) => {
          const w   = widths[li];
          const cx  = curX + w * 0.5;
          curX     += w + sp;

          const prevL = prev[globalI] || null;
          const activeState = prevL
            && prevL.state !== 'pre-intro'
            && prevL.state !== 'intro-filling'
            && prevL.state !== 'intro-settling';

          allLetters.push({
            char,
            i:       globalI,     // global unique index
            localI:  li,          // position within this group (for stagger)
            groupI:  gi,          // which group
            group:   g,           // full group config reference
            font, sz, w, capA, capD, capH,
            homeX:  cx,
            homeY,
            x:      activeState ? prevL.x     : cx,
            y:      activeState ? prevL.y     : homeY,
            vx:     activeState ? prevL.vx    : 0,
            vy:     activeState ? prevL.vy    : 0,
            angle:  activeState ? prevL.angle : 0,
            angV:   activeState ? prevL.angV  : 0,
            state:  activeState ? prevL.state : 'pre-intro',
            introFill:    activeState ? 1 : 0,
            introMix:     activeState ? 0 : 0,
            introOffset:  groupIntroStart,   // group-level start shift (ms)
            tint:   g.introTints[li % g.introTints.length],
            settledAt:           null,
            retStart:            null,
            retFromX:            cx,
            retFromY:            homeY,
            retFromA:            0,
            shakeStart:          null,
            hovered:             false,
            engageCooldownUntil: activeState ? (prevL.engageCooldownUntil || 0) : 0,
            lastEngageAt:        activeState ? (prevL.lastEngageAt        || 0) : 0,
          });

          globalI++;
        });

        // Next group's globalIntroOffset = after this group finishes
        const groupDuration = g.simultaneousIntro
          ? INTRO_FILL_DUR + INTRO_SETTLE_DUR
          : chars.length * INTRO_STEP + INTRO_FILL_DUR + INTRO_SETTLE_DUR;
        globalIntroOffset = groupIntroStart + groupDuration;
      });

      this._letters = allLetters;
    }

    // ─── Intro ─────────────────────────────────────────────────────────────────

    _updateIntro(now) {
      if (!this._introT) return;
      this._letters.forEach(l => {
        if (l.state !== 'pre-intro' && l.state !== 'intro-filling' && l.state !== 'intro-settling') return;

        const t0      = this._introT + INTRO_DELAY + l.introOffset + (l.group.simultaneousIntro ? 0 : l.localI * INTRO_STEP);
        const elapsed = now - t0;
        if (elapsed < 0) return;

        l.state     = 'intro-filling';
        l.introFill = clamp(elapsed / INTRO_FILL_DUR, 0, 1);
        l.introMix  = eio(clamp(elapsed / (INTRO_FILL_DUR * INTRO_COLOR_LEAD), 0, 1));

        if (elapsed >= INTRO_FILL_DUR) {
          const sp    = clamp((elapsed - INTRO_FILL_DUR) / INTRO_SETTLE_DUR, 0, 1);
          l.state     = 'intro-settling';
          l.introFill = 1;
          l.introMix  = 1 - eio(sp);
          if (sp >= 1) {
            l.state = 'idle'; l.introFill = 1; l.introMix = 0;
            l.x = l.homeX; l.y = l.homeY; l.angle = 0;
            if (l.group.autoDropStagger >= 0) this._scheduleGroupAutoDrop(l.groupI, now);
          }
        }
      });
    }

    _scheduleGroupAutoDrop(groupI, completedAt) {
      if (this._autoDropScheduled.has(groupI)) return;
      this._autoDropScheduled.add(groupI);
      const g       = this._groups[groupI];
      const delay   = g.autoDropDelay   != null ? g.autoDropDelay   : 350;
      const stagger = g.autoDropStagger != null ? g.autoDropStagger : 175;
      this._letters
        .filter(l => l.groupI === groupI)
        .forEach((l, li) => { l.autoDropAt = completedAt + delay + li * stagger; });
    }

    _updateAutoDrops(now) {
      this._letters.forEach(l => {
        if (!l.autoDropAt || now < l.autoDropAt || l.state !== 'idle') return;
        l.autoDropAt    = null;
        l.bounceCount   = 0;
        l.peakReturn    = false;
        l.extremeBounce = false;
        l.returnAt      = null;
        const dir = l.i % 2 === 0 ? -1 : 1;
        l.state  = 'falling';
        l.angle  = 0;
        l.vx     = dir * (0.7 + Math.random() * 1.4);
        l.vy     = -(1.2 + Math.random() * 2.0);
        l.angV   = (Math.random() - 0.5) * 0.14;
        l.lastEngageAt        = now;
        l.engageCooldownUntil = now + ENGAGE_COOLDOWN_MS;
      });
    }

    // ─── Letter physics (uses per-group physics constants) ─────────────────────

    _updateLetterPhysics(now) {
      const floor = this._H - 28;
      const gx    = this._gravity.x * 0.55;
      const gy    = this._gravity.y;

      this._letters.forEach(l => {
        const ph = l.group.physics;  // ← per-group physics config

        if (l.state === 'shaking') {
          const p = clamp((now - l.shakeStart) / 260, 0, 1);
          l.angle = Math.sin(p * Math.PI * 3.5) * 0.13 * (1 - p);
          if (p >= 1) {
            l.state = 'falling'; l.angle = 0;
            const dir = l.i % 2 === 0 ? -1 : 1;
            l.vx    = dir * (0.7 + Math.random() * 1.4) + gx * 2;
            l.vy    = -(1.2 + Math.random() * 2.0);
            l.angV  = (Math.random() - 0.5) * 0.14;
          }
          return;
        }

        if (l.state !== 'falling') return;

        l.vy   += GRAVITY_LETTER * gy;
        l.vx   += GRAVITY_LETTER * gx;
        l.vx   *= (1 - ph.frictionAir);
        l.vy   *= (1 - ph.frictionAir * 0.18);
        l.angV *= (1 - ph.angularDamp);

        const sp = Math.hypot(l.vx, l.vy);
        if (sp > MAX_LETTER_SPEED) { const r = MAX_LETTER_SPEED / sp; l.vx *= r; l.vy *= r; }

        l.x     += l.vx;
        l.y     += l.vy;
        l.angle += l.angV;

        const hw = l.w * 0.5 + 4;
        const hh = l.capH * 0.5 + 4;

        if (l.x - hw < 0)        { l.x = hw;         l.vx =  Math.abs(l.vx) * ph.wallBounce; l.angV += (Math.random()-0.5)*0.09; }
        if (l.x + hw > this._W)  { l.x = this._W-hw; l.vx = -Math.abs(l.vx) * ph.wallBounce; l.angV += (Math.random()-0.5)*0.09; }

        if (l.y + hh > floor) {
          l.y = floor - hh;
          const maxBounces   = l.group.bouncesBeforeReturn || 1;
          if (l.group.bounceReturn && (l.bounceCount || 0) < maxBounces) {
            const isLastBounce = (l.bounceCount || 0) + 1 >= maxBounces;
            l.bounceCount = (l.bounceCount || 0) + 1;
            const rest = isLastBounce ? 0.97 : 0.88;
            l.vy  = -Math.abs(l.vy) * rest;
            l.vx *= 0.85; l.angV *= 0.56;
            if (isLastBounce) l.peakReturn = true;
          } else {
            const bv = Math.abs(l.vy) * ph.restitution;
            l.vy  = bv < 1.4 ? 0 : -bv;
            l.vx *= 0.85; l.angV *= 0.56;
          }
        }

        // Return at the peak of the final bounce (vy crosses zero going upward → downward)
        if (l.peakReturn && l.vy >= 0) {
          l.peakReturn = false;
          this._startReturn(l, now); return;
        }

        if (l.y > this._H + OFFSCREEN_PAD) { this._startReturn(l, now); return; }

        const atRest = Math.abs(l.vx) < REST_V && Math.abs(l.vy) < REST_V && Math.abs(l.angV) < REST_W;
        if (atRest) {
          if (!l.settledAt) l.settledAt = now;
          if (now - l.settledAt >= SETTLE_MS) this._startReturn(l, now);
        } else { l.settledAt = null; }
      });
    }

    // ─── Collision detection ───────────────────────────────────────────────────

    _checkLetterLetterCollisions(now) {
      this._letters.forEach(lSrc => {
        if (lSrc.state !== 'falling') return;
        const srcSpeed = Math.hypot(lSrc.vx, lSrc.vy);
        if (srcSpeed < LETTER_KNOCK_MIN_SPEED) return;

        this._letters.forEach(lTgt => {
          if (lTgt === lSrc || lTgt.state !== 'idle') return;
          if (now < (lTgt.engageCooldownUntil || 0)) return;
          const last = this._letterKnockCD.get(lTgt.i) || 0;
          if (now - last < KNOCK_COOLDOWN_MS) return;

          const pad = 1.1;
          const dx = Math.abs(lSrc.x-lTgt.x), dy = Math.abs(lSrc.y-lTgt.y);
          const mx = lSrc.w*0.5 + lTgt.w*0.5*pad, my = lSrc.capH*0.5 + lTgt.capH*0.5*pad;
          if (dx >= mx || dy >= my) return;
          if (Math.min(mx-dx, my-dy) < lTgt.w*0.28) return;

          this._letterKnockCD.set(lTgt.i, now);
          this._knockLetter(lTgt, lSrc, srcSpeed, now);
          const nx = lSrc.x-lTgt.x, ny = lSrc.y-lTgt.y, nl = Math.hypot(nx,ny)||1;
          lSrc.vx += (nx/nl)*srcSpeed*0.10; lSrc.vy += (ny/nl)*srcSpeed*0.08;
        });
      });
    }

    _knockLetter(target, source, srcSpeed, now) {
      if (target.state !== 'idle' || now < (target.engageCooldownUntil || 0)) return;
      const dirX = srcSpeed > 0.01 ? source.vx/srcSpeed : 0;
      const dirY = srcSpeed > 0.01 ? source.vy/srcSpeed : 1;
      const imp  = Math.min(1.3, 0.46 + srcSpeed*0.10);
      target.state     = 'falling';
      target.settledAt = null;
      target.vx   = dirX*srcSpeed*imp*0.44 + (Math.random()-0.5)*0.35;
      target.vy   = Math.max(dirY*srcSpeed*imp*0.70, 1.05);
      target.angV = ((source.angV||0)*0.42) + (Math.random()-0.5)*0.05;
      target.engageCooldownUntil = now + ENGAGE_COOLDOWN_MS;
      const sp = Math.hypot(target.vx, target.vy);
      if (sp > MAX_LETTER_SPEED) { const r = MAX_LETTER_SPEED/sp; target.vx*=r; target.vy*=r; }
    }

    // ─── Letter state control ──────────────────────────────────────────────────

    _releaseLetter(l, now) {
      if (l.state !== 'idle') return;
      if (now < (l.engageCooldownUntil || 0)) return;
      if (now - (l.lastEngageAt || 0) < HOVER_DEBOUNCE_MS) return;
      l.bounceCount   = 0;
      l.extremeBounce = false;
      l.returnAt      = null;
      l.state         = 'shaking';
      l.shakeStart = now;
      l.lastEngageAt = now;
      l.engageCooldownUntil = now + ENGAGE_COOLDOWN_MS;
    }

    _dropLetterNow(l, now) {
      if (l.state !== 'idle') return;
      if (now < (l.engageCooldownUntil || 0)) return;
      if (now - (l.lastEngageAt || 0) < HOVER_DEBOUNCE_MS) return;
      const gx  = this._gravity.x * 0.55;
      const dir = l.i % 2 === 0 ? -1 : 1;
      l.bounceCount   = 0;
      l.peakReturn    = false;
      l.extremeBounce = false;
      l.returnAt      = null;
      l.state  = 'falling';
      l.angle  = 0;
      l.vx     = dir * (0.7 + Math.random() * 1.4) + gx * 2;
      l.vy     = -(1.2 + Math.random() * 2.0);
      l.angV   = (Math.random() - 0.5) * 0.14;
      l.lastEngageAt        = now;
      l.engageCooldownUntil = now + ENGAGE_COOLDOWN_MS;
    }

    _startReturn(l, now) {
      l.state       = 'returning';
      l.retStart    = now;
      l.retFromX    = l.x; l.retFromY = l.y; l.retFromA = l.angle;
      l.vx = l.vy = l.angV = 0;
      l.settledAt   = null;
      l.peakReturn  = false;
      l.bounceCount = 0;
    }

    _updateReturn(now) {
      this._letters.forEach(l => {
        if (l.state !== 'returning') return;
        const t = eio(clamp((now - l.retStart) / (l.group.returnDur || RETURN_DUR_MS), 0, 1));
        l.x     = lerp(l.retFromX, l.homeX, t);
        l.y     = lerp(l.retFromY, l.homeY, t);
        l.angle = l.retFromA * (1 - t);
        if (t >= 1) {
          l.state = 'idle'; l.x = l.homeX; l.y = l.homeY; l.angle = 0;
          l.engageCooldownUntil = now + ENGAGE_COOLDOWN_MS;
        }
      });
    }

    // ─── Hover ─────────────────────────────────────────────────────────────────

    _updateHover(now) {
      const mx = this._mouse.x, my = this._mouse.y;
      let cursor = 'default';

      this._letters.forEach(l => {
        l.hovered = false;
        if (l.state !== 'idle') return;
        const hw = l.w*0.58+14, hh = l.capH*0.58+14;
        l.hovered = Math.abs(mx-l.x) < hw && Math.abs(my-l.y) < hh;
        if (l.hovered) { cursor = 'pointer'; this._dropLetterNow(l, now); }
      });

      this._canvas.style.cursor = cursor;
    }

    _hitTestLetter(x, y) {
      return this._letters.find(l => l.state === 'idle'
        && Math.abs(x-l.x) < l.w*0.58+14 && Math.abs(y-l.y) < l.capH*0.58+14);
    }

    // ─── Interaction ───────────────────────────────────────────────────────────

    _handleClick(e) {
      const now = performance.now();
      const l = this._hitTestLetter(e.clientX, e.clientY);
      if (l) this._releaseLetter(l, now);
    }

    _handleTouch(e) {
      e.preventDefault();
      const now = performance.now();
      if (e.touches.length > 1) { this._letters.forEach(l => this._releaseLetter(l, now)); return; }
      const t = e.touches[0];
      const l = this._hitTestLetter(t.clientX, t.clientY);
      if (l) this._releaseLetter(l, now);
    }

    async _armAccelerometer() {
      if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
        try { if (await DeviceOrientationEvent.requestPermission() !== 'granted') return; }
        catch (_) { return; }
      }
      window.addEventListener('deviceorientation', this._onOrient, true);
    }

    _handleOrientation(e) {
      if (e.gamma == null || e.beta == null) return;
      this._gravity.x = clamp(e.gamma / 38, -1.2, 1.2);
      this._gravity.y = clamp((e.beta - 48) / 52 + 0.42, 0.1, 1.2);
    }

    // ─── Static fallback ───────────────────────────────────────────────────────

    _showStatic() {
      this._letters.forEach(l => { l.state = 'idle'; l.introFill = 1; l.introMix = 0; });
      this._draw(performance.now());
    }

    // ─── Drawing ───────────────────────────────────────────────────────────────

    _draw(now) {
      const ctx = this._ctx;
      ctx.clearRect(0, 0, this._W, this._H);
      if (this._bg && this._bg !== 'transparent') {
        ctx.fillStyle = this._bg;
        ctx.fillRect(0, 0, this._W, this._H);
      }
      this._letters.forEach(l => this._drawLetter(l, now));
    }

    _drawLetter(l, now) {
      if (l.state === 'pre-intro') return;
      const ctx = this._ctx;

      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.angle);
      ctx.font         = l.font;
      ctx.textBaseline = 'middle';
      ctx.textAlign    = 'center';

      if (l.state === 'intro-filling' || l.state === 'intro-settling') {
        this._drawLetterIntro(l, now);
      } else {
        if (l.state === 'falling') {
          ctx.shadowColor = hexRgba(l.group.color, 0.18);
          ctx.shadowBlur  = 12;
        } else if (l.state === 'shaking') {
          ctx.shadowColor = hexRgba(l.tint, 0.4);
          ctx.shadowBlur  = 20;
        } else if (l.state === 'returning') {
          const t = clamp((now - l.retStart) / (l.group.returnDur || RETURN_DUR_MS), 0, 1);
          const g = Math.sin(t * Math.PI) * 0.30;
          ctx.shadowColor = hexRgba(l.tint, g);
          ctx.shadowBlur  = 18 * g;
        } else if (l.hovered) {
          ctx.globalAlpha = 0.88;
        }
        ctx.fillStyle = l.group.color;  // ← per-group color
        ctx.fillText(l.char, 0, 0);
      }

      ctx.restore();
    }

    _drawLetterIntro(l, now) {
      const ctx = this._ctx;
      const { capA, capD, capH, w, introFill: fill, introMix: mix, tint, char, group } = l;
      const baseColor = group.color;

      const fillTopY = capD - capH * fill;

      // Ghost unfilled trace
      if (fill < 0.99) {
        ctx.save();
        ctx.beginPath(); ctx.rect(-(w+10), -capA-2, (w+10)*2, fillTopY+capA+2); ctx.clip();
        ctx.globalAlpha = 0.07; ctx.fillStyle = baseColor;
        ctx.fillText(char, 0, 0);
        ctx.restore();
      }

      // Filled portion — tinted color blending to group base color
      ctx.save();
      ctx.beginPath(); ctx.rect(-(w+10), fillTopY-1, (w+10)*2, capD-fillTopY+2); ctx.clip();
      ctx.shadowColor = hexRgba(tint, mix*0.88+0.06);
      ctx.shadowBlur  = 14*mix + 5;
      ctx.fillStyle   = mix > 0.02 ? rgbMix(baseColor, tint, mix) : baseColor;
      ctx.fillText(char, 0, 0);
      ctx.restore();

      // Scan edge
      if (fill > 0.04 && fill < 0.97 && mix > 0.09) {
        const g = ctx.createLinearGradient(-(w+12), fillTopY, w+12, fillTopY);
        g.addColorStop(0, 'transparent');
        g.addColorStop(0.12, hexRgba(tint, mix*0.55));
        g.addColorStop(0.88, hexRgba(tint, mix*0.55));
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(-(w+12), fillTopY-2, (w+12)*2, 4);
      }

      // Moving scan lines
      if (fill > 0.1 && mix > 0.12) {
        ctx.save();
        ctx.beginPath(); ctx.rect(-(w+10), fillTopY, (w+10)*2, capD-fillTopY); ctx.clip();
        ctx.strokeStyle = hexRgba(tint, mix*0.11);
        ctx.lineWidth   = 0.5;
        const off = (now * 0.0085) % 3;
        for (let ry = fillTopY+off; ry < capD+1; ry += 3) {
          ctx.beginPath(); ctx.moveTo(-(w+10), ry); ctx.lineTo(w+10, ry); ctx.stroke();
        }
        ctx.restore();
      }
    }

    // ─── Main loop ─────────────────────────────────────────────────────────────

    _tick(now) {
      if (this._destroyed) return;
      this._updateIntro(now);
      this._updateAutoDrops(now);
      this._updateLetterPhysics(now);
      this._checkLetterLetterCollisions(now);
      this._updateReturn(now);
      this._updateHover(now);
      this._draw(now);
      this._raf = requestAnimationFrame(t => this._tick(t));
    }

    // ─── Public API ────────────────────────────────────────────────────────────

    releaseAll() {
      const now = performance.now();
      this._letters.forEach(l => this._releaseLetter(l, now));
    }

    stop()        { this.destroy(); }

    setPhysicsEnabled(enabled) {
      if (!enabled) {
        const now = performance.now();
        this._letters.forEach(l => {
          if (l.state === 'falling' || l.state === 'shaking') {
            l.state = 'idle'; l.x = l.homeX; l.y = l.homeY;
            l.angle = l.vx = l.vy = l.angV = 0;
            l.engageCooldownUntil = now + ENGAGE_COOLDOWN_MS;
          }
        });
      }
    }
  }

  // ─── Export ──────────────────────────────────────────────────────────────────
  global.SurettePhysicsWordmark = SurettePhysicsWordmark;

})(typeof window !== 'undefined' ? window : this);
