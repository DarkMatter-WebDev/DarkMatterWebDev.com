(() => {
  if (document.querySelector(".sds-physics-wordmark")) return;

  const wordmarkName = document.querySelector(".sds-wordmark__name");
  const letters = [...document.querySelectorAll(".sds-block-letter")];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const INTRO_LIGHT_MS = 1450;
  const LETTER_STAGGER_MS = 980;
  let introRunning = !prefersReducedMotion && letters.length > 0;

  const finishIntro = () => {
    const hasActiveLetters = letters.some((letter) => letter.classList.contains("is-animating"));
    if (hasActiveLetters) {
      window.setTimeout(finishIntro, 220);
      return;
    }

    wordmarkName?.classList.remove("is-intro-lit");
    introRunning = false;
  };

  const toMs = (value) => {
    const trimmed = value.trim();
    if (trimmed.endsWith("ms")) return Number.parseFloat(trimmed);
    if (trimmed.endsWith("s")) return Number.parseFloat(trimmed) * 1000;
    return Number.parseFloat(trimmed) || 0;
  };

  const animationTotalMs = (element) => {
    const styles = window.getComputedStyle(element);
    const durations = styles.animationDuration.split(",").map(toMs);
    const delays = styles.animationDelay.split(",").map(toMs);
    return Math.max(
      ...durations.map((duration, index) => duration + (delays[index] || delays[0] || 0)),
      0
    );
  };

  const startLetterAnimation = (letter, options = {}) => {
    if (introRunning && !options.force) return 0;
    if (letter.classList.contains("is-animating")) return 0;

    letter.classList.add("is-animating");

    const blocks = [...letter.querySelectorAll(".sds-letter-block")];
    const totalMs = Math.max(...blocks.map(animationTotalMs), 0);

    window.clearTimeout(Number(letter.dataset.sdsFinishTimer || 0));
    const finishTimer = window.setTimeout(() => {
      letter.classList.remove("is-animating");
      delete letter.dataset.sdsFinishTimer;
    }, totalMs + 80);
    letter.dataset.sdsFinishTimer = String(finishTimer);

    return totalMs;
  };

  letters.forEach((letter) => {
    letter.addEventListener("mouseenter", startAnimation);
    letter.addEventListener("focus", startAnimation);

    function startAnimation() {
      startLetterAnimation(letter);
    }
  });

  if (!introRunning) return;

  wordmarkName?.classList.add("is-intro-lit");

  window.setTimeout(() => {
    letters.forEach((letter, index) => {
      window.setTimeout(() => {
        startLetterAnimation(letter, { force: true });
      }, index * LETTER_STAGGER_MS);
    });

    const introTotalMs = (letters.length - 1) * LETTER_STAGGER_MS + 9400;
    window.setTimeout(finishIntro, introTotalMs);
  }, INTRO_LIGHT_MS);
})();
