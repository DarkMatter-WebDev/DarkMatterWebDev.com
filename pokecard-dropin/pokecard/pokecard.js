/* ============================================================
   POKECARD.JS — tiny (vanilla-tilt-sized) driver for the Lab's
   Pokémon-style template card. It only ever writes CSS custom
   properties; the CSS (pokecard.css) does all the painting.

     desktop (fine pointer + hover):
       mousemove -> --rx/--ry (3D tilt, clamped to ±MAX) + --px/--py
                    (glare position) + --glow (glare on). rAF-throttled.
       mouseleave -> ease everything back to neutral.

     touch / no-hover:
       tap the card face -> flip 180° (--flip) to the back.

     keyboard (all devices):
       focus the card, press Enter/Space -> flip. Links inside stay
       individually focusable; the hidden face is made `inert` so a
       keyboard user never lands on an off-screen control.

     prefers-reduced-motion:
       tilt + glare are skipped here (and forced off in CSS); the flip
       still toggles state but CSS cross-fades faces instead of spinning.
   ============================================================ */
(function () {
  "use strict";

  var scenes = document.querySelectorAll(".poke-scene");
  if (!scenes.length) return;

  var mHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  var mReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var MAX = 10; // max tilt in degrees (subtle)

  scenes.forEach(function (scene) {
    var card = scene.querySelector(".poke-card");
    if (!card) return;

    var faceFront = scene.querySelector(".poke-face--front");
    var faceBack = scene.querySelector(".poke-face--back");

    var raf = 0;
    var pending = null;

    function canTilt() {
      return mHover.matches && !mReduce.matches;
    }

    /* ---------- tilt + glare (desktop hover) ---------- */
    function render() {
      raf = 0;
      if (!pending) return;
      var r = card.getBoundingClientRect();
      var x = (pending.x - r.left) / r.width; // 0 (left) .. 1 (right)
      var y = (pending.y - r.top) / r.height; // 0 (top)  .. 1 (bottom)
      x = x < 0 ? 0 : x > 1 ? 1 : x;
      y = y < 0 ? 0 : y > 1 ? 1 : y;

      // the hovered edge recedes: hover left -> left goes back,
      // hover top -> top goes back (matches "tilts back").
      var ry = (x - 0.5) * 2 * MAX; // left(x<.5) => negative => left recedes
      var rx = (0.5 - y) * 2 * MAX; // top(y<.5)  => positive => top recedes

      scene.style.setProperty("--ry", ry.toFixed(2) + "deg");
      scene.style.setProperty("--rx", rx.toFixed(2) + "deg");
      scene.style.setProperty("--px", (x * 100).toFixed(1) + "%");
      scene.style.setProperty("--py", (y * 100).toFixed(1) + "%");
    }

    function onMove(e) {
      if (!canTilt()) return;
      pending = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(render);
    }

    function onEnter() {
      if (!canTilt()) return;
      scene.setAttribute("data-active", "1");
      scene.style.setProperty("--glow", "1");
    }

    function reset() {
      pending = null;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      scene.removeAttribute("data-active");
      scene.style.setProperty("--glow", "0");
      scene.style.setProperty("--rx", "0deg");
      scene.style.setProperty("--ry", "0deg");
      scene.style.setProperty("--px", "50%");
      scene.style.setProperty("--py", "50%");
    }

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", reset);

    /* ---------- flip (touch + keyboard) ---------- */
    function setFlip(on) {
      scene.setAttribute("data-flip", on ? "1" : "0");
      scene.style.setProperty("--flip", on ? "1" : "0");
      card.setAttribute("aria-pressed", on ? "true" : "false");
      // keep only the visible face's links keyboard-reachable
      if (faceFront) faceFront.inert = on;
      if (faceBack) faceBack.inert = !on;
      if (on) reset(); // never hold a tilt while flipped
    }

    function toggleFlip() {
      setFlip(scene.getAttribute("data-flip") !== "1");
    }

    // single click anywhere on the card (except the links/buttons)
    // flips it — on both desktop and touch.
    card.addEventListener("click", function (e) {
      if (e.target.closest("a")) return; // let real links work
      toggleFlip();
    });

    // keyboard flip on every device (Enter / Space) — only when the
    // card itself is focused, so Enter on an inner link follows it.
    card.addEventListener("keydown", function (e) {
      if (e.target !== card) return;
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        toggleFlip();
      }
    });

    /* ---------- init + capability changes ---------- */
    setFlip(false);

    function onCapChange() {
      // if a device stops supporting hover-tilt (or reduced-motion
      // turns on) mid-session, drop any in-flight tilt.
      if (!canTilt()) reset();
    }
    listen(mHover, onCapChange);
    listen(mReduce, onCapChange);
  });

  // MediaQueryList change listener with a fallback for older Safari.
  function listen(mql, fn) {
    if (mql.addEventListener) mql.addEventListener("change", fn);
    else if (mql.addListener) mql.addListener(fn);
  }
})();
