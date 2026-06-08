(() => {
  const LOADER_ID = "sds-apps-loader";
  const READY_EVENT = "sds-apps-ready";
  const SLOW_PATH_MS = 50;
  const TIMEOUT_MS = 4000;
  const FADE_MS = 200;
  const FONT_TIMEOUT_MS = 1200;

  const loader = document.getElementById(LOADER_ID);
  if (!loader) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const progressBar = loader.querySelector(".sds-apps-loader__bar-fill");
  const progressTrack = loader.querySelector(".sds-apps-loader__bar");

  let revealed = false;
  let slowPath = false;
  let slowPathTimer = null;
  let progressAnimating = false;

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  const withTimeout = (promise, ms) => Promise.race([
    promise,
    wait(ms).then(() => {})
  ]);

  const criticalFontFamilies = [
    '700 1em "Archivo Expanded"',
    '600 1em "Archivo Expanded"',
    '500 14px "JetBrains Mono"',
    '400 16px "Plus Jakarta Sans"',
    '600 32px "Space Grotesk"',
    '400 24px "Material Symbols Outlined"'
  ];

  const areCriticalFontsReady = () => (
    criticalFontFamilies.every((family) => document.fonts.check(family))
  );

  const waitForCriticalFonts = () => withTimeout(
    Promise.all(criticalFontFamilies.map((family) => document.fonts.load(family).catch(() => {})))
      .then(() => document.fonts.ready),
    FONT_TIMEOUT_MS
  );

  const waitForImage = (img) => {
    if (!img) return Promise.resolve();
    if (img.complete && img.naturalWidth > 0) return Promise.resolve();

    return new Promise((resolve) => {
      img.addEventListener("load", resolve, { once: true });
      img.addEventListener("error", resolve, { once: true });
    });
  };

  const getHeroImages = () => (
    [".sds-hero__brand-mark", ".sds-hero__floating-mark"]
      .map((selector) => document.querySelector(selector))
      .filter(Boolean)
  );

  const areHeroImagesReady = () => (
    getHeroImages().every((img) => img.complete && img.naturalWidth > 0)
  );

  const waitForHeroImages = () => Promise.all(getHeroImages().map(waitForImage));

  const isPhysicsSplitReady = () => {
    const main = document.querySelector(".sds-physics-wordmark:not(.sds-physics-wordmark--sub)");
    if (!main) return true;

    const subWords = [...document.querySelectorAll(".sds-physics-wordmark--sub")];
    const subsVisible = subWords.length === 0
      || subWords.every((sub) => sub.classList.contains("is-visible"));

    return main.classList.contains("is-split") && subsVisible;
  };

  const waitForPhysicsReady = () => {
    if (isPhysicsSplitReady()) return Promise.resolve();

    return new Promise((resolve) => {
      window.addEventListener(READY_EVENT, () => resolve(), { once: true });
    });
  };

  const areRequiredGatesReady = () => (
    document.readyState !== "loading"
    && areHeroImagesReady()
    && areCriticalFontsReady()
    && isPhysicsSplitReady()
  );

  const setProgress = (value) => {
    if (!progressBar || !progressTrack) return;
    const clamped = Math.max(0, Math.min(100, value));
    progressBar.style.width = `${clamped}%`;
    progressTrack.setAttribute("aria-valuenow", String(Math.round(clamped)));
  };

  const animateProgress = async () => {
    if (progressAnimating || prefersReducedMotion) {
      setProgress(100);
      return;
    }

    progressAnimating = true;
    const steps = [18, 34, 52, 68, 84, 94];

    for (const step of steps) {
      if (revealed) return;
      setProgress(step);
      await wait(120 + Math.random() * 80);
    }
  };

  const activateSlowPath = () => {
    if (slowPath || revealed || prefersReducedMotion) return;

    slowPath = true;
    document.body.classList.add("is-apps-loading");
    document.body.setAttribute("aria-busy", "true");
    loader.classList.remove("is-pending");
    loader.classList.add("is-active");
    loader.removeAttribute("aria-hidden");

    if (progressTrack) {
      progressTrack.setAttribute("role", "progressbar");
      progressTrack.setAttribute("aria-valuemin", "0");
      progressTrack.setAttribute("aria-valuemax", "100");
      progressTrack.setAttribute("aria-valuenow", "0");
    }

    animateProgress();
  };

  const reveal = (instant = false) => {
    if (revealed) return;
    revealed = true;

    if (slowPathTimer !== null) {
      window.clearTimeout(slowPathTimer);
      slowPathTimer = null;
    }

    const finish = () => {
      setProgress(100);
      document.body.classList.remove("is-apps-loading");
      document.body.classList.add("is-apps-ready");
      document.body.removeAttribute("aria-busy");

      const skipFade = instant || prefersReducedMotion || !slowPath;

      if (skipFade) {
        loader.remove();
        window.dispatchEvent(new CustomEvent("sds-apps-revealed"));
        return;
      }

      loader.setAttribute("aria-hidden", "true");
      loader.classList.add("is-exiting");

      wait(FADE_MS).then(() => {
        loader.remove();
        window.dispatchEvent(new CustomEvent("sds-apps-revealed"));
      });
    };

    if (instant || prefersReducedMotion) {
      finish();
    } else {
      requestAnimationFrame(finish);
    }
  };

  const run = async () => {
    if (areRequiredGatesReady()) {
      reveal(true);
      return;
    }

    if (!prefersReducedMotion) {
      slowPathTimer = window.setTimeout(() => {
        if (!revealed) activateSlowPath();
      }, SLOW_PATH_MS);
    }

    await Promise.all([
      waitForCriticalFonts(),
      waitForHeroImages(),
      waitForPhysicsReady()
    ]);

    reveal(!slowPath || prefersReducedMotion);
  };

  if (areRequiredGatesReady()) {
    reveal(true);
  } else {
    Promise.race([
      run(),
      wait(TIMEOUT_MS).then(() => reveal(true))
    ]).catch(() => reveal(true));
  }

  window.addEventListener("sds-wordmark-intro-abort", () => {
    reveal(true);
  });
})();
