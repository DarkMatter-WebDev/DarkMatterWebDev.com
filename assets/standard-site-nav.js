(function () {
  var script = document.currentScript;
  if (!script || script.dataset.dmStandardNavReady === "true") return;

  var active = (script.dataset.active || "apps").toLowerCase();
  var langAlt = script.dataset.langAlt || "";
  var isSpanish = (document.documentElement.lang || "en").toLowerCase().indexOf("es") === 0;

  var copy = isSpanish
    ? {
        brandSub: '<span class="brand-subtext__line">Surette Systems</span><span class="brand-subtext__line brand-subtext__line--portal">Portal</span>',
        home: "Inicio",
        services: "Servicios",
        apps: "Apps",
        process: "Proceso",
        portfolio: "Portafolio",
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
        process: "Process",
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
          ["Diseño de Sitios Web", "services/website-design.html"],
          ["Hosting Administrado", "services/managed-hosting.html"],
          ["Planes de Mantenimiento Web", "services/website-care-plans.html"],
          ["Aplicaciones Web Empresariales a Medida", "services/custom-development.html"]
        ],
        local: [
          ["Servicios Técnicos a Domicilio", "services/in-home-services.html"],
          ["Configuración de Redes de Oficina", "services/office-network-setup.html"]
        ]
      }
    : {
        online: [
          ["Website Design", "services/website-design.html"],
          ["Managed Hosting", "services/managed-hosting.html"],
          ["Website Care Plans", "services/website-care-plans.html"],
          ["Custom Business Web Apps", "services/custom-development.html"]
        ],
        local: [
          ["In-Home Tech Services", "services/in-home-services.html"],
          ["Office Network Setup", "services/office-network-setup.html"]
        ]
      };

  function desktopClass(key) {
    if (key === active) {
      if (key === "account") {
        return "font-label-mono text-label-mono text-electric-cyan hover:underline transition-colors duration-300 inline-flex items-center gap-1.5";
      }
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
        return '<a href="' + item[1] + '">' + item[0] + "</a>";
      })
      .join("");
  }

  function langToggleHtml() {
    if (!langAlt) {
      return isSpanish
        ? '<span class="text-electric-cyan" aria-current="true">ES</span>'
        : '<span class="text-electric-cyan" aria-current="true">EN</span>';
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
    '<nav class="hidden md:flex fixed top-0 w-full z-50 bg-surface/10 backdrop-blur-xl border-b border-white/10 justify-between items-center px-margin-desktop py-4">' +
    '<a href="index.html" class="site-brand inline-flex items-center gap-2.5 flex-nowrap shrink-0"><span class="material-symbols-outlined brand-mark text-electric-cyan" aria-hidden="true">blur_on</span><span class="flex flex-col leading-none"><span class="font-headline-md text-headline-md tracking-tighter brand-mystical brand-mystical--glow">DARK MATTER</span><span class="brand-subtext">' +
    copy.brandSub +
    '</span></span></a><div class="hidden md:flex items-center gap-10">' +
    '<a class="' +
    desktopClass("home") +
    '" href="index.html">' +
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
    desktopClass("apps") +
    '" href="apps.html">' +
    copy.apps +
    '</a><a class="' +
    desktopClass("process") +
    '" href="process.html">' +
    copy.process +
    '</a><a class="' +
    desktopClass("account") +
    '" href="account.html"><span class="material-symbols-outlined text-base">account_circle</span>' +
    copy.login +
    '</a><div class="lang-switch flex items-center gap-1.5 font-label-mono text-label-mono shrink-0">' +
    langToggleHtml() +
    '</div></div><a href="contact.html" class="hidden sm:inline-block bg-gradient-to-r from-electric-cyan to-nebula-purple text-starlight-white font-label-mono text-label-mono px-6 py-2 rounded-lg hover:scale-105 active:scale-95 transition-all glow-cyan">' +
    copy.contact +
    "</a></nav>" +
    '<div class="md:hidden"><header class="fixed top-0 w-full bg-surface/10 backdrop-blur-xl z-50 border-b border-starlight-white/10 shadow-[0_0_20px_rgba(0,240,255,0.1)]">' +
    '<div class="flex items-center justify-between px-margin-mobile h-16 w-full mx-auto"><a href="index.html" class="site-brand inline-flex items-center gap-2.5 flex-nowrap shrink-0"><span class="material-symbols-outlined brand-mark text-electric-cyan" aria-hidden="true">blur_on</span><span class="flex flex-col leading-none"><span class="font-headline-md text-headline-md tracking-tighter brand-mystical brand-mystical--glow">DARK MATTER</span><span class="brand-subtext">' +
    copy.brandSub +
    '</span></span></a><div class="lang-switch flex items-center gap-1.5 font-label-mono text-label-mono shrink-0">' +
    langToggleHtml() +
    '</div></div></header><nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-2 pb-safe bg-surface/10 backdrop-blur-2xl border-t border-starlight-white/10 shadow-[0_-10px_30px_rgba(112,0,255,0.15)] rounded-t-xl">' +
    '<a href="index.html" class="' +
    mobileClass("home") +
    '"><span class="material-symbols-outlined">home</span><span class="font-label-caps text-[10px] mt-1">' +
    copy.home +
    '</span></a><a href="apps.html" class="' +
    mobileClass("services") +
    '" data-mobile-services-trigger><span class="material-symbols-outlined">design_services</span><span class="font-label-caps text-[10px] mt-1">' +
    copy.services +
    '</span></a><a href="apps.html" class="' +
    mobileClass("apps") +
    '"><span class="material-symbols-outlined">download</span><span class="font-label-caps text-[10px] mt-1">' +
    copy.apps +
    '</span></a><a href="process.html" class="' +
    mobileClass("process") +
    '"><span class="material-symbols-outlined">timeline</span><span class="font-label-caps text-[10px] mt-1">' +
    copy.process +
    '</span></a><a href="contact.html" class="' +
    mobileClass("contact") +
    '"><span class="material-symbols-outlined">mail</span><span class="font-label-caps text-[10px] mt-1">' +
    (isSpanish ? "Contacto" : "Contact") +
    "</span></a></nav></div>";

  document.body.classList.add("has-dm-standard-nav");
  script.insertAdjacentHTML("afterend", html);
  script.dataset.dmStandardNavReady = "true";
})();
