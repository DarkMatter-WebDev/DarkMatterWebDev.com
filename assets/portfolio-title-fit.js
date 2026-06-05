(function () {
  function fitTitle(el, minPx, maxPx) {
    var container = el.parentElement;
    if (!container) return;

    var style = window.getComputedStyle(container);
    var available =
      container.clientWidth -
      parseFloat(style.paddingLeft) -
      parseFloat(style.paddingRight);
    if (available <= 0) return;

    el.style.whiteSpace = "nowrap";
    el.style.overflow = "visible";
    el.style.textOverflow = "clip";
    el.style.maxWidth = "100%";

    var lo = minPx;
    var hi = maxPx;
    var best = minPx;

    while (lo <= hi) {
      var mid = (lo + hi) / 2;
      el.style.fontSize = mid + "px";
      if (el.scrollWidth <= available) {
        best = mid;
        lo = mid + 0.25;
      } else {
        hi = mid - 0.25;
      }
    }

    el.style.fontSize = best + "px";
  }

  function cardMax(container) {
    return container.clientWidth >= 260 ? 24 : 17;
  }

  function detailMax() {
    return window.innerWidth >= 768 ? 72 : 34;
  }

  function run() {
    document.querySelectorAll(".portfolio-card-title").forEach(function (el) {
      var container = el.parentElement;
      if (!container) return;
      fitTitle(el, 7, cardMax(container));
    });
    document.querySelectorAll(".portfolio-detail-title").forEach(function (el) {
      fitTitle(el, 13, detailMax());
    });
  }

  var resizeTimer;
  function schedule() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(run, 60);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  window.addEventListener("resize", schedule);
  window.addEventListener("orientationchange", schedule);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(run).catch(function () {});
  }
})();
