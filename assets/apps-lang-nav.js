(() => {
  const bindHardLangNav = () => {
    document.querySelectorAll(".lang-switch a[hreflang]").forEach((link) => {
      if (link.dataset.langHardNavBound === "true") return;
      link.dataset.langHardNavBound = "true";

      link.addEventListener("click", () => {
        const lang = (link.getAttribute("hreflang") || link.getAttribute("lang") || "").trim();
        if (lang) {
          try {
            localStorage.setItem("dm_lang", lang);
          } catch (e) {}
        }

        if (typeof window.__sdsPhysicsTeardown === "function") {
          window.__sdsPhysicsTeardown();
        }
      }, { capture: true });
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindHardLangNav, { once: true });
  } else {
    bindHardLangNav();
  }
})();
