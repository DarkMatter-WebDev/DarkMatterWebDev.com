(function () {
  var mobileRoot = document.querySelector('.md\\:hidden');
  if (!mobileRoot || mobileRoot.dataset.mobileServicesNav === 'ready') return;

  var tabBar = mobileRoot.querySelector('nav.fixed');
  if (!tabBar) return;

  var lang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase().indexOf('es') === 0 ? 'es' : 'en';
  var servicesTab = Array.prototype.slice.call(tabBar.querySelectorAll('a')).find(function (link) {
    return /services\.html|servicios|services/i.test(link.getAttribute('href') || '') || /services|servicios/i.test(link.textContent || '');
  });
  if (!servicesTab) return;

  var path = window.location.pathname.replace(/\\/g, '/');
  var inServicesDir = path.indexOf('/services/') !== -1;
  var pagePrefix = inServicesDir ? '../' : '';
  var servicesPrefix = inServicesDir ? '' : 'services/';

  function page(pathPart) {
    return pagePrefix + pathPart;
  }

  function service(slug) {
    return servicesPrefix + slug + '.html';
  }

  var copy = {
    en: {
      all: 'All Services',
      online: 'Web & Online Services',
      local: 'In-Home & Office',
      links: [
        ['Complete Website Management', service('complete-website-management')],
        ['Consultation', service('discovery-consultation')],
        ['Website Design', service('website-design')],
        ['Brand & Rebranding', service('brand-rebranding')],
        ['Managed Hosting', service('managed-hosting')],
        ['Website Care Plans', service('website-care-plans')],
        ['SEO Foundations', service('seo-foundations')],
        ['Custom Business Web Apps', service('custom-development')]
      ],
      localLinks: [
        ['In-Home Tech Services', service('in-home-services')],
        ['Office Network Setup', service('office-network-setup')]
      ]
    },
    es: {
      all: 'Todos los Servicios',
      online: 'Servicios Web y en Línea',
      local: 'A Domicilio y Oficina',
      links: [
        ['Gestión Completa de Sitios Web', service('complete-website-management')],
        ['Consulta', service('discovery-consultation')],
        ['Diseño de Sitios Web', service('website-design')],
        ['Marca y Rediseño', service('brand-rebranding')],
        ['Hosting Administrado', service('managed-hosting')],
        ['Planes de Mantenimiento Web', service('website-care-plans')],
        ['Fundamentos de SEO', service('seo-foundations')],
        ['Aplicaciones Web Empresariales', service('custom-development')]
      ],
      localLinks: [
        ['Servicios Técnicos a Domicilio', service('in-home-services')],
        ['Configuración de Redes de Oficina', service('office-network-setup')]
      ]
    }
  }[lang];

  var popout = document.createElement('div');
  popout.className = 'mobile-services-popout';
  popout.setAttribute('aria-hidden', 'true');
  popout.innerHTML =
    '<div class="mobile-services-popout__grid">' +
      '<div class="mobile-services-popout__group">' +
        '<div class="mobile-services-popout__heading"><span class="material-symbols-outlined text-sm">language</span>' + copy.online + '</div>' +
        '<a href="' + page('services.html') + '">' + copy.all + '</a>' +
        copy.links.map(function (item) { return '<a href="' + item[1] + '">' + item[0] + '</a>'; }).join('') +
      '</div>' +
      '<div class="mobile-services-popout__group">' +
        '<div class="mobile-services-popout__heading"><span class="material-symbols-outlined text-sm">home_pin</span>' + copy.local + '</div>' +
        copy.localLinks.map(function (item) { return '<a href="' + item[1] + '">' + item[0] + '</a>'; }).join('') +
      '</div>' +
    '</div>';
  mobileRoot.appendChild(popout);

  function close() {
    popout.classList.remove('is-open');
    popout.setAttribute('aria-hidden', 'true');
    servicesTab.setAttribute('aria-expanded', 'false');
  }

  function open() {
    popout.classList.add('is-open');
    popout.setAttribute('aria-hidden', 'false');
    servicesTab.setAttribute('aria-expanded', 'true');
  }

  servicesTab.setAttribute('aria-haspopup', 'true');
  servicesTab.setAttribute('aria-expanded', 'false');
  servicesTab.addEventListener('click', function (event) {
    event.preventDefault();
    if (popout.classList.contains('is-open')) close();
    else open();
  });

  popout.addEventListener('click', function (event) {
    if (event.target.closest('a')) close();
  });

  document.addEventListener('click', function (event) {
    if (!popout.contains(event.target) && !servicesTab.contains(event.target)) close();
  });

  window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') close();
  });

  window.addEventListener('scroll', close, { passive: true });
  mobileRoot.dataset.mobileServicesNav = 'ready';
})();
