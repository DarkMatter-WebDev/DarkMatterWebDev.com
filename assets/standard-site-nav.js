(function () {
  var script = document.currentScript;
  if (!script || script.dataset.dmStandardNavReady === "true") return;

  var active = (script.dataset.active || "portfolio").toLowerCase();
  if (active === "apps") active = "portfolio";
  var langAlt = script.dataset.langAlt || "";
  var isSpanish = (document.documentElement.lang || "en").toLowerCase().indexOf("es") === 0;

  // Pages under services/ need a ../ prefix on every internal link the nav
  // emits (same convention as mobile-services-nav.js); root pages need none.
  var navRoot = window.location.pathname.replace(/\\/g, "/").indexOf("/services/") !== -1 ? "../" : "";
  function u(href) {
    return navRoot + href;
  }

  var copy = isSpanish
    ? {
        brandSub: '<span class="brand-subtext__line">Surette Systems</span><span class="brand-subtext__line brand-subtext__line--portal">Portal</span>',
        home: "Inicio",
        services: "Servicios",
        apps: "Apps",
        portfolio: "Portfolio",
        login: "Acceso",
        contact: "Contáctanos",
        work: "Trabajo",
        onlineHeading: "Servicios en línea",
        localHeading: "Servicios a Domicilio y Oficina",
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
        login: "Client Login",
        contact: "Contact Us",
        work: "Work",
        onlineHeading: "Online Services",
        localHeading: "In-Home & Office Services",
        langCurrent: "EN",
        langOther: "ES",
        langOtherLabel: "Cambiar a español",
        langStorage: "es"
      };

  var services = isSpanish
    ? {
        online: [
          ["Diseño Web / Hosting", "services/website-design-hosting.html"],
          ["Aplicaciones Web Empresariales a Medida", "apps.html"]
        ],
        local: [
          ["Servicios Técnicos a Domicilio", "services/in-home-services.html"],
          ["Configuración de Redes de Oficina", "services/office-network-setup.html"]
        ]
      }
    : {
        online: [
          ["Website Design / Hosting", "services/website-design-hosting.html"],
          ["Custom Business Web Apps", "apps.html"]
        ],
        local: [
          ["In-Home Tech Services", "services/in-home-services.html"],
          ["Office Network Setup", "services/office-network-setup.html"]
        ]
      };

  function desktopClass(key) {
    if (key === "account") {
      return "dm-account-link-desktop font-label-mono text-label-mono text-on-surface-variant hover:text-electric-cyan transition-colors duration-300 inline-flex items-center gap-1.5";
    }
    if (key === active) {
      return "font-label-mono text-label-mono text-electric-cyan border-b-2 border-electric-cyan pb-1 transition-colors duration-300";
    }
    return "font-label-mono text-label-mono text-on-surface-variant hover:text-electric-cyan transition-colors duration-300";
  }

  function mobileClass(key) {
    if (key === active) {
      return "flex flex-col items-center justify-center text-electric-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] active:scale-90 transition-all";
    }
    return "flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-starlight-white transition-all active:scale-90";
  }

  function serviceLinks(items) {
    return items
      .map(function (item) {
        return '<a href="' + u(item[1]) + '">' + item[0] + "</a>";
      })
      .join("");
  }

  function mobileServiceLinks(items) {
    return items
      .map(function (item) {
        return '<a href="' + u(item[1]) + '" class="block px-4 py-2.5 pl-12 text-on-surface-variant hover:text-starlight-white hover:bg-white/5 font-label-mono text-xs transition-colors">' + item[0] + "</a>";
      })
      .join("");
  }

  function mobileMenuLinkClass(key) {
    if (key === "account") {
      return "dm-account-link-mobile flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-starlight-white hover:bg-white/5 font-label-mono text-sm transition-colors";
    }
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

  var html =
    '<nav class="dm-standard-desktop-nav hidden md:flex fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/10 justify-between items-center px-margin-desktop py-4">' +
    '<div id="sds-logo"></div><div class="hidden md:flex items-center gap-10">' +
    '<a class="' +
    desktopClass("home") +
    '" href="' + u("index.html") + '">' +
    copy.home +
    '</a><div class="relative services-nav-group"><a class="' +
    desktopClass("services") +
    '" tabindex="0" aria-haspopup="true">' +
    copy.services +
    '</a><div class="services-nav-menu"><div class="services-nav-panel"><div class="services-nav-heading"><span class="material-symbols-outlined services-nav-heading-icon text-electric-cyan" aria-hidden="true">language</span>' +
    copy.onlineHeading +
    "</div>" +
    serviceLinks(services.online) +
    '<div class="services-nav-heading"><span class="material-symbols-outlined services-nav-heading-icon text-electric-cyan" aria-hidden="true">home_pin</span>' +
    copy.localHeading +
    "</div>" +
    serviceLinks(services.local) +
    '</div></div></div><a class="' +
    desktopClass("portfolio") +
    ' portfolio-nav-button' +
    '" href="' + u("portfolio.html") + '">' +
    copy.portfolio +
    '</a><a class="' +
    desktopClass("account") +
    '" href="' + u("account.html") + '"><span class="material-symbols-outlined text-base">account_circle</span>' +
    copy.login +
    '</a>' +
    (langAlt ? '<div class="lang-switch flex items-center gap-1.5 font-label-mono text-label-mono shrink-0">' + langToggleHtml() + "</div>" : "") +
    '</div><a href="' + u("contact.html") + '" class="hidden sm:inline-block bg-gradient-to-r from-electric-cyan to-nebula-purple text-starlight-white font-label-mono text-label-mono px-6 py-2 rounded-lg hover:scale-105 active:scale-95 transition-all glow-cyan">' +
    copy.contact +
    "</a></nav>" +
    // dm-standard-mobile-shell lets nav.css flip this on at 880px without
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
    '<a href="' + u("index.html") + '" class="' + mobileMenuLinkClass("home") + '"><span class="material-symbols-outlined text-lg">home</span>' + copy.home + '</a>' +
    '<button type="button" class="mobile-acc-toggle w-full flex items-center justify-between gap-3 px-4 py-3 ' + (active === "services" ? "text-electric-cyan bg-electric-cyan/5" : "text-on-surface-variant hover:text-starlight-white hover:bg-white/5") + ' font-label-mono text-sm transition-colors border-t border-white/5 mt-1" aria-expanded="false" aria-controls="m-acc-services"><span class="flex items-center gap-3"><span class="material-symbols-outlined text-lg">design_services</span>' + (isSpanish ? "Todos los Servicios" : "All Services") + '</span><span class="material-symbols-outlined text-base mobile-acc-chevron">expand_more</span></button>' +
    '<div id="m-acc-services" class="mobile-acc-panel">' +
    '<div class="mobile-menu-group-label"><span class="material-symbols-outlined text-sm">language</span>' + copy.onlineHeading + '</div>' +
    mobileServiceLinks(services.online) +
    '<div class="mobile-menu-group-label"><span class="material-symbols-outlined text-sm">home_pin</span>' + copy.localHeading + '</div>' +
    mobileServiceLinks(services.local) +
    '</div>' +
    '<a href="' + u("portfolio.html") + '" class="' + mobileMenuLinkClass("portfolio") + '"><span class="material-symbols-outlined text-lg">work</span>' + copy.portfolio + '</a>' +
    '<a href="' + u("account.html") + '" class="' + mobileMenuLinkClass("account") + '"><span class="material-symbols-outlined text-lg">account_circle</span>' + copy.login + '</a>' +
    '<a href="' + u("contact.html") + '" class="' + mobileMenuLinkClass("contact") + '"><span class="material-symbols-outlined text-lg">mail</span>' + (isSpanish ? "Contacto" : "Contact") + '</a>' +
    '<a href="' + u("contact.html") + '" class="flex items-center gap-3 px-4 py-3 text-void-black bg-gradient-to-r from-electric-cyan to-nebula-purple font-label-mono text-sm mx-2 my-1 rounded-lg"><span class="material-symbols-outlined text-lg">calendar_month</span>' + copy.contact + '</a>' +
    '</div></div></div></div>' +
    '</div></header><nav class="dm-standard-bottom-nav fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-2 pb-safe backdrop-blur-2xl border-t border-starlight-white/10 shadow-[0_-10px_30px_rgba(112,0,255,0.15)] rounded-t-xl">' +
    '<a href="' + u("index.html") + '" class="' +
    mobileClass("home") +
    '"><span class="material-symbols-outlined">home</span><span class="font-label-caps text-[10px] mt-1">' +
    copy.home +
    '</span></a><a href="' + u("apps.html") + '" class="' +
    mobileClass("services") +
    '" data-mobile-services-trigger><span class="material-symbols-outlined">design_services</span><span class="font-label-caps text-[10px] mt-1">' +
    copy.services +
    '</span></a><a href="' + u("portfolio.html") + '" class="' +
    mobileClass("portfolio") +
    '"><span class="material-symbols-outlined">work</span><span class="font-label-caps text-[10px] mt-1">' +
    copy.portfolio +
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
    var accToggles = menu.querySelectorAll(".mobile-acc-toggle");

    function collapseAccordions() {
      accToggles.forEach(function (toggle) {
        toggle.setAttribute("aria-expanded", "false");
        var panel = menu.querySelector("#" + toggle.getAttribute("aria-controls"));
        if (panel) panel.classList.remove("is-open");
      });
    }

    function closeMenu() {
      menu.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open menu");
      collapseAccordions();
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

    accToggles.forEach(function (toggle) {
      toggle.addEventListener("click", function (event) {
        event.stopPropagation();
        var expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
        var panel = menu.querySelector("#" + toggle.getAttribute("aria-controls"));
        if (panel) panel.classList.toggle("is-open", !expanded);
      });
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
})();
