(function () {
  var script = document.currentScript;
  if (!script || script.dataset.dmStandardNavReady === "true") return;

  var active = (script.dataset.active || "none").toLowerCase();
  // Legacy data-active values from superseded IAs still resolve, so a page that
  // has not been remapped yet highlights something sensible instead of nothing.
  //   pre-2026-08-16 (Home/Services/Portfolio): apps, portfolio, services
  //   pre-2026-08-17 (…/Work/…):                work
  // "work" retired when the Work item was removed — the galleries now live under
  // their parent service page, so every case-study surface highlights Websites.
  var LEGACY_ACTIVE = {
    apps: "software",
    portfolio: "websites",
    services: "websites",
    work: "websites"
  };
  if (LEGACY_ACTIVE[active]) active = LEGACY_ACTIVE[active];
  var langAlt = script.dataset.langAlt || "";
  var isSpanish = (document.documentElement.lang || "en").toLowerCase().indexOf("es") === 0;

  // Pages under services/ need a ../ prefix on every internal link the nav
  // emits (same convention as mobile-services-nav.js); root pages need none.
  var navRoot = window.location.pathname.replace(/\\/g, "/").indexOf("/services/") !== -1 ? "../" : "";
  function u(href) {
    return navRoot + href;
  }

  /* Both items now have their own pages. Kept as named constants because the
     rollout repointed them twice and they are referenced from three places
     each (desktop pill, phone dropdown row, bottom tab bar) — a single
     definition is what kept the nav from ever shipping a 404 mid-build.

     services/website-design-hosting.html is still live and indexed; it is now
     the full-detail reference reached from pricing.html and websites.html. */
  var WEBSITES_HREF = "websites.html";
  var PRICING_HREF = "pricing.html";

  /* The desktop bar shows a Home pill on every page EXCEPT the homepage
     (2026-08-17, owner request). The logo still links home everywhere — this
     just makes the route explicit once you have navigated away, without
     spending a slot on a self-link when you are already there.

     Detection deliberately checks two things. data-active is the fast path,
     but a page that forgets to set it would render a Home pill pointing at
     itself, so the URL is checked too. Netlify Pretty URLs serve the homepage
     as "/" rather than "/index.html", and the es/ mirror as "/es/", so the
     pattern has to accept a bare directory as well as the explicit filename.
     It must NOT match extensionless Pretty URLs like "/account". */
  function isHomePage() {
    if (active === "home") return true;
    var path = window.location.pathname.replace(/\\/g, "/").toLowerCase();
    return /(^|\/)(index\.html)?$/.test(path);
  }

  var copy = isSpanish
    ? {
        brandSub: '<span class="brand-subtext__line">Surette Systems</span><span class="brand-subtext__line brand-subtext__line--portal">Portal</span>',
        home: "Inicio",
        services: "Servicios",
        apps: "Apps",
        portfolio: "Portfolio",
        contact: "Comenzar",   // gradient CTA verb (bottom tab bar keeps "Contacto")
        work: "Trabajo",
        websites: "Sitios Web",
        software: "Software",
        industries: "Sectores",
        pricing: "Precios",
        langCurrent: "ES",
        langOther: "EN",
        langOtherLabel: "Switch to English",
        langStorage: "en"
      }
    : {
        brandSub: '<span class="brand-subtext__line">Surette Systems</span><span class="brand-subtext__line brand-subtext__line--portal">Portal</span>',
        home: "Home",
        services: "Services",
        apps: "Apps",
        portfolio: "Portfolio",
        contact: "Get started", // gradient CTA verb (bottom tab bar keeps "Contact")
        work: "Work",
        websites: "Websites",
        software: "Software",
        industries: "Industries",
        pricing: "Pricing",
        langCurrent: "EN",
        langOther: "ES",
        langOtherLabel: "Cambiar a español",
        langStorage: "es"
      };

  /* The services map that fed the desktop dropdown and the phone accordion was
     removed with them (2026-08-16 IA change). Its two "online" entries are now
     first-class nav items — Websites and Software — and the two "local" ones
     (in-home tech, office network setup) are reached from the shared footer
     and the homepage local-services strip. If a local-services nav entry is
     ever wanted back, add it as a plain item; do not reintroduce a dropdown. */

  // Desktop items are pills (sds-nav-pill), with the active one filled rather
  // than underlined. Geometry and colour live in nav.css under .sds-nav-pill —
  // NOT in Tailwind utilities: this markup is injected, and the CDN only builds
  // classes it finds in a page's static HTML. Four live bugs in this repo came
  // from forgetting that. font-label-mono/text-label-mono are safe because
  // nav.css pins them too.
  function desktopClass(key) {
    if (key === active) {
      return "sds-nav-pill is-active font-label-mono text-label-mono";
    }
    return "sds-nav-pill font-label-mono text-label-mono";
  }

  function mobileClass(key) {
    if (key === active) {
      return "flex flex-col items-center justify-center text-electric-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] active:scale-90 transition-all";
    }
    return "flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-starlight-white transition-all active:scale-90";
  }

  function mobileMenuLinkClass(key) {
    if (key === active) {
      return "flex items-center gap-3 px-4 py-3 text-electric-cyan bg-electric-cyan/5 font-label-mono text-sm";
    }
    return "flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-starlight-white hover:bg-white/5 font-label-mono text-sm transition-colors";
  }

  function langToggleHtml() {
    if (!langAlt) {
      return "";
    }

    if (isSpanish) {
      return (
        '<a href="' +
        langAlt +
        '" hreflang="en" lang="en" aria-label="' +
        copy.langOtherLabel +
        '" onclick="try{localStorage.setItem(\'dm_lang\',\'en\')}catch(e){}" class="text-on-surface-variant hover:text-electric-cyan transition-colors duration-300">' +
        copy.langOther +
        '</a><span class="text-outline/50">/</span><span class="text-electric-cyan" aria-current="true">' +
        copy.langCurrent +
        "</span>"
      );
    }

    return (
      '<span class="text-electric-cyan" aria-current="true">' +
      copy.langCurrent +
      '</span><span class="text-outline/50">/</span><a href="' +
      langAlt +
      '" hreflang="es" lang="es" aria-label="' +
      copy.langOtherLabel +
      '" onclick="try{localStorage.setItem(\'dm_lang\',\'es\')}catch(e){}" class="text-on-surface-variant hover:text-electric-cyan transition-colors duration-300">' +
      copy.langOther +
      "</a>"
    );
  }

  // Theme toggle.
  //
  // Deliberately carries NO Tailwind utility classes: this markup is injected,
  // and the CDN only builds classes it finds in a page's static HTML. Three
  // separate live bugs came from ignoring that (a white footer line, an
  // invisible hamburger, a grey nav hairline on portfolio.html), so every
  // visual property here is plain CSS in nav.css under .sds-theme-*.
  //
  // The label always names the DESTINATION theme ("Light theme" while dark is
  // active), which is what a visitor is deciding about. aria-pressed reflects
  // whether light is currently on. Both are corrected at runtime by syncToggles
  // once the real theme is known — the values below are only the dark-default
  // first paint, so no flash of the wrong label.
  function themeToggleHtml(variant) {
    var toLight = isSpanish ? "Tema claro" : "Light theme";
    if (variant === "mobile") {
      return (
        '<button type="button" class="sds-theme-row" data-sds-theme-toggle aria-pressed="false">' +
        '<span class="material-symbols-outlined sds-theme-row__icon" aria-hidden="true">light_mode</span>' +
        '<span class="sds-theme-row__label">' + toLight + "</span>" +
        '<span class="sds-theme-switch" aria-hidden="true"><span class="sds-theme-switch__dot"></span></span>' +
        "</button>"
      );
    }
    return (
      '<button type="button" class="sds-theme-toggle" data-sds-theme-toggle ' +
      'aria-pressed="false" aria-label="' + toLight + '" title="' + toLight + '">' +
      '<span class="material-symbols-outlined sds-theme-toggle__icon" aria-hidden="true">light_mode</span>' +
      "</button>"
    );
  }

  var html =
    '<nav class="dm-standard-desktop-nav hidden md:flex fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/10 justify-between items-center px-margin-desktop py-4">' +
    // Four plain items, no dropdown. The Services popout was the only way to
    // reach the four service pages; Websites and Software now carry the two
    // that matter, and the local-services pages moved to the footer and a
    // homepage strip. Pricing is top-level — it was previously buried two
    // levels deep inside a 2,500-line services page and appeared in no menu.
    '<div id="sds-logo"></div><div class="hidden md:flex items-center gap-2">' +
    // Home pill — omitted on the homepage itself, so it never renders as a
    // self-link. See isHomePage() above.
    (isHomePage()
      ? ""
      : '<a class="' + desktopClass("home") + '" href="' + u("index.html") + '">' + copy.home + "</a>") +
    '<a class="' +
    desktopClass("websites") +
    '" href="' + u(WEBSITES_HREF) + '">' +
    copy.websites +
    // SOFTWARE PILL REMOVED 2026-08-27. Packaged business apps are no longer
    // sold; the six app profiles survive as case studies reachable from
    // apps.html and portfolio.html, not as a nav destination.
    //
    // This takes an interior page back to SIX row items (Home · Websites ·
    // Industries · Pricing + login + theme toggle). Five pills needed ~1105px
    // and forced the hamburger switch to 1120px on 2026-08-20; re-measure
    // before adding a fifth again, and measure an INTERIOR page, not the
    // homepage, which drops the Home pill and fits ~120px lower.
    '</a><a class="' +
    desktopClass("industries") +
    '" href="' + u("industries.html") + '">' +
    copy.industries +
    // Work was removed 2026-08-17. It resolved to portfolio.html, a two-card
    // interstitial whose cards led to apps.html (already the Software item) and
    // casestudies.html — so three of four nav items showed built work and none
    // of them predicted which. Following funnls.com, the nav now names what a
    // visitor can buy and proof lives inside those pages. Both galleries keep
    // their URLs; portfolio.html stays live but unlinked from the header.
    '</a><a class="' +
    desktopClass("pricing") +
    '" href="' + u(PRICING_HREF) + '">' +
    copy.pricing +
    '</a>' +
    themeToggleHtml("desktop") +
    (langAlt ? '<div class="lang-switch flex items-center gap-1.5 font-label-mono text-label-mono shrink-0">' + langToggleHtml() + "</div>" : "") +
    // sds-on-accent, not text-starlight-white: this label sits on the
    // cyan→purple gradient, which stays dark in light mode. The nav.css CTA
    // rule also forces the colour, but only inside its min-width:1120px block,
    // so the class is what makes the intent hold on its own.
    '</div><a href="' + u("contact.html") + '" class="hidden sm:inline-block bg-gradient-to-r from-electric-cyan to-nebula-purple sds-on-accent font-label-mono text-label-mono px-6 py-2 rounded-lg hover:scale-105 active:scale-95 transition-all glow-cyan">' +
    copy.contact +
    "</a></nav>" +
    // dm-standard-mobile-shell lets nav.css flip this on at 1120px without
    // touching the identical md:hidden class that page layouts use for their
    // own phone wrapper. md:hidden stays so the shell still hides above that.
    '<div class="dm-standard-mobile-shell md:hidden"><header class="dm-unified-mobile-header fixed top-0 w-full backdrop-blur-xl z-50 border-b border-starlight-white/10 shadow-[0_0_20px_rgba(0,240,255,0.1)]">' +
    '<div class="dm-unified-mobile-header-content flex items-center justify-between px-margin-mobile h-16 w-full mx-auto"><div id="sds-logo-mobile"></div>' +
    '<div class="dm-mobile-menu-controls flex items-center gap-3">' +
    (langAlt ? '<div class="lang-switch flex items-center gap-1.5 font-label-mono text-label-mono shrink-0">' + langToggleHtml() + "</div>" : "") +
    '<div class="relative"><button type="button" id="mobile-menu-btn" class="flex flex-col justify-center items-end gap-1.5 w-10 h-10 rounded-lg active:scale-95 transition-transform" aria-expanded="false" aria-controls="mobile-menu-dropdown" aria-label="Open menu">' +
    '<span class="mobile-menu-line-top h-px w-8 bg-electric-cyan animate-pulse-cyan transition-all duration-300"></span>' +
    '<span class="mobile-menu-line-mid h-px w-6 bg-starlight-white/55 transition-all duration-300"></span>' +
    '<span class="mobile-menu-line-bot h-px w-4 bg-starlight-white/35 transition-all duration-300"></span>' +
    '</button><div id="mobile-menu-dropdown" class="mobile-nav-dropdown absolute right-0 top-full mt-3 w-64 z-[60]"><div class="mobile-nav-dropdown-panel rounded-xl py-2 overflow-hidden">' +
    '<p class="font-label-caps text-[10px] text-outline px-4 pt-2 pb-1 tracking-widest">Menu</p>' +
    // Home row — omitted on the homepage, matching the desktop pill.
    // The bottom tab bar deliberately KEEPS its Home tab on every page: a tab
    // bar holds a constant set and marks the current one, so dropping a tab
    // would shift the other three under the user's thumb.
    (isHomePage()
      ? ""
      : '<a href="' + u("index.html") + '" class="' + mobileMenuLinkClass("home") + '"><span class="material-symbols-outlined text-lg">home</span>' + copy.home + '</a>') +
    // Flat list — the "All Services" accordion is gone with the desktop
    // dropdown. Its two online entries became Websites and Software; the two
    // local ones live in the footer and the homepage strip.
    '<a href="' + u(WEBSITES_HREF) + '" class="' + mobileMenuLinkClass("websites") + '"><span class="material-symbols-outlined text-lg">language</span>' + copy.websites + '</a>' +
    '<a href="' + u("industries.html") + '" class="' + mobileMenuLinkClass("industries") + '"><span class="material-symbols-outlined text-lg">store</span>' + copy.industries + '</a>' +
    // Work row removed 2026-08-17 alongside the desktop pill — see the comment
    // in the desktop block above for why.
    '<a href="' + u(PRICING_HREF) + '" class="' + mobileMenuLinkClass("pricing") + '"><span class="material-symbols-outlined text-lg">sell</span>' + copy.pricing + '</a>' +
    // One contact entry only: the gradient CTA (mirrors the desktop nav's
    // Contact Us button). The plain "Contact" row it sat next to was redundant
    // with it AND with the bottom tab bar's Contact item, which keeps the
    // active-page highlight for contact.html.
    '<a href="' + u("contact.html") + '" class="flex items-center gap-3 px-4 py-3 text-void-black bg-gradient-to-r from-electric-cyan to-nebula-purple font-label-mono text-sm mx-2 my-1 rounded-lg"><span class="material-symbols-outlined text-lg">calendar_month</span>' + copy.contact + '</a>' +
    themeToggleHtml("mobile") +
    '</div></div></div></div>' +
    '</div></header><nav class="dm-standard-bottom-nav fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-2 pb-safe backdrop-blur-2xl border-t border-starlight-white/10 shadow-[0_-10px_30px_rgba(112,0,255,0.15)] rounded-t-xl">' +
    '<a href="' + u("index.html") + '" class="' +
    mobileClass("home") +
    '"><span class="material-symbols-outlined">home</span><span class="font-label-caps text-[10px] mt-1">' +
    copy.home +
    // Websites replaces the old Services tab, which confusingly pointed at
    // apps.html while carrying a "Services" label and a popout trigger.
    '</span></a><a href="' + u(WEBSITES_HREF) + '" class="' +
    mobileClass("websites") +
    '"><span class="material-symbols-outlined">language</span><span class="font-label-caps text-[10px] mt-1">' +
    copy.websites +
    '</span></a><a href="' + u(PRICING_HREF) + '" class="' +
    mobileClass("pricing") +
    '"><span class="material-symbols-outlined">sell</span><span class="font-label-caps text-[10px] mt-1">' +
    copy.pricing +
    '</span></a><a href="' + u("contact.html") + '" class="' +
    mobileClass("contact") +
    '"><span class="material-symbols-outlined">mail</span><span class="font-label-caps text-[10px] mt-1">' +
    (isSpanish ? "Contacto" : "Contact") +
    "</span></a></nav></div>";

  document.body.classList.add("has-dm-standard-nav");
  script.insertAdjacentHTML("afterend", html);
  script.dataset.dmStandardNavReady = "true";

  var mobileRoot = script.nextElementSibling && script.nextElementSibling.matches(".md\\:hidden")
    ? script.nextElementSibling
    : document.querySelector(".md\\:hidden");
  var menuButton = mobileRoot && mobileRoot.querySelector("#mobile-menu-btn");
  var menu = mobileRoot && mobileRoot.querySelector("#mobile-menu-dropdown");
  if (menuButton && menu) {
    function closeMenu() {
      menu.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open menu");
    }

    function openMenu() {
      menu.classList.add("is-open");
      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", "Close menu");
    }

    menuButton.addEventListener("click", function (event) {
      event.stopPropagation();
      if (menu.classList.contains("is-open")) closeMenu();
      else openMenu();
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("click", function (event) {
      if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });

    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  // Conventional mobile bottom-navigation behavior: make room for content
  // while the user moves down the page, then return the destinations as soon
  // as the scroll direction reverses. Small distance thresholds prevent touch
  // jitter from flickering the bar. Keyboard focus always brings it back and
  // keeps it present while a keyboard user is navigating inside it.
  var bottomNav = mobileRoot && mobileRoot.querySelector(".dm-standard-bottom-nav");
  if (bottomNav) {
    var lastScrollY = Math.max(window.scrollY || window.pageYOffset || 0, 0);
    var scrollDirection = 0;
    var directionDistance = 0;
    var bottomNavHidden = false;
    var keyboardNavigation = false;
    var trackedViewportWidth = window.innerWidth;

    function isMobileNavViewport() {
      return window.innerWidth < 1024;
    }

    function setBottomNavHidden(shouldHide) {
      shouldHide = Boolean(shouldHide && isMobileNavViewport());
      if (bottomNavHidden === shouldHide) return;

      bottomNavHidden = shouldHide;
      bottomNav.classList.toggle("dm-standard-bottom-nav--hidden", shouldHide);
    }

    function showBottomNav() {
      setBottomNavHidden(false);
    }

    function resetBottomNavTracking() {
      lastScrollY = Math.max(window.scrollY || window.pageYOffset || 0, 0);
      scrollDirection = 0;
      directionDistance = 0;
      showBottomNav();
    }

    function handleBottomNavResize() {
      var nextViewportWidth = window.innerWidth;
      if (nextViewportWidth === trackedViewportWidth) return;
      trackedViewportWidth = nextViewportWidth;
      resetBottomNavTracking();
    }

    function updateBottomNavOnScroll() {
      if (!isMobileNavViewport()) {
        resetBottomNavTracking();
        return;
      }

      var currentScrollY = Math.max(window.scrollY || window.pageYOffset || 0, 0);
      var delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      if (keyboardNavigation) {
        scrollDirection = 0;
        directionDistance = 0;
        showBottomNav();
        return;
      }

      if (currentScrollY <= 24) {
        scrollDirection = 0;
        directionDistance = 0;
        showBottomNav();
        return;
      }

      if (Math.abs(delta) < 1) return;

      var nextDirection = delta > 0 ? 1 : -1;
      if (nextDirection !== scrollDirection) {
        scrollDirection = nextDirection;
        directionDistance = 0;
      }
      directionDistance += Math.abs(delta);

      if (scrollDirection < 0 && directionDistance >= 6) {
        showBottomNav();
      } else if (
        scrollDirection > 0 &&
        directionDistance >= 24 &&
        !(keyboardNavigation && bottomNav.contains(document.activeElement))
      ) {
        setBottomNavHidden(true);
      }
    }

    window.addEventListener("scroll", updateBottomNavOnScroll, { passive: true });
    // Mobile browser chrome commonly fires height-only resize events during a
    // normal scroll. Ignore those so the bar does not flash back into view;
    // only a real width/mode change resets the directional state.
    window.addEventListener("resize", handleBottomNavResize, { passive: true });
    window.addEventListener("pageshow", resetBottomNavTracking);

    document.addEventListener("keydown", function () {
      keyboardNavigation = true;
      showBottomNav();
    }, true);
    document.addEventListener("pointerdown", function () {
      keyboardNavigation = false;
    }, { capture: true, passive: true });
    document.addEventListener("wheel", function () {
      keyboardNavigation = false;
    }, { capture: true, passive: true });
    bottomNav.addEventListener("focusin", showBottomNav);
  }

  /* ── Theme runtime ─────────────────────────────────────────────────────────
     The pre-paint resolver in each page's <head> has already stamped
     data-theme before anything rendered; this only handles changes made after
     load. Kept in the nav module rather than its own file because the toggle
     ships with the nav — nowhere the toggle exists is this script absent.

     A page that intentionally loads no nav also gets no toggle. It still
     honours the stored theme through the head resolver, which is the whole
     point of resolving it there instead of here.
     ────────────────────────────────────────────────────────────────────────── */
  var THEME_KEY = "sds-theme";
  var GROUND = { dark: "#050505", light: "#f4f2ee" };

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";
  }

  function syncToggles(theme) {
    var isLight = theme === "light";
    // Name the destination, not the current state.
    var label = isSpanish
      ? isLight ? "Tema oscuro" : "Tema claro"
      : isLight ? "Dark theme" : "Light theme";
    var icon = isLight ? "dark_mode" : "light_mode";

    var buttons = document.querySelectorAll("[data-sds-theme-toggle]");
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i];
      b.setAttribute("aria-pressed", isLight ? "true" : "false");
      var glyph = b.querySelector(".material-symbols-outlined");
      if (glyph) glyph.textContent = icon;
      var text = b.querySelector(".sds-theme-row__label");
      if (text) {
        text.textContent = label;
      } else {
        b.setAttribute("aria-label", label);
        b.setAttribute("title", label);
      }
    }
  }

  function applyTheme(theme, persist) {
    var d = document.documentElement;
    d.setAttribute("data-theme", theme);
    d.classList.toggle("dark", theme === "dark");
    // Overwrites the inline style attribute the no-white-flash baseline sets;
    // an inline attribute outranks every stylesheet rule, so it has to be
    // written here too, not just in CSS.
    d.style.background = GROUND[theme];

    // theme-color could not be set by the head resolver — the <meta> is parsed
    // later in <head> than that script runs. It only tints mobile browser
    // chrome, so setting it here is soon enough.
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", GROUND[theme]);

    if (persist) {
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch (e) {
        /* private mode / storage disabled — the theme still applies for this
           page view, it just will not survive navigation. */
      }
    }

    syncToggles(theme);

    // Lets the WebGL/canvas backgrounds repaint their materials. They cannot
    // read CSS variables, so they listen for this instead.
    try {
      window.dispatchEvent(
        new CustomEvent("sds-themechange", { detail: { theme: theme } })
      );
    } catch (e) {
      /* CustomEvent constructor unavailable — non-fatal, CSS already applied */
    }
  }

  document.addEventListener("click", function (event) {
    var btn = event.target.closest && event.target.closest("[data-sds-theme-toggle]");
    if (!btn) return;
    event.preventDefault();
    applyTheme(currentTheme() === "light" ? "dark" : "light", true);
  });

  // Keep multiple open tabs in agreement.
  window.addEventListener("storage", function (event) {
    if (event.key !== THEME_KEY || !event.newValue) return;
    if (event.newValue !== currentTheme()) applyTheme(event.newValue, false);
  });

  syncToggles(currentTheme());
})();
