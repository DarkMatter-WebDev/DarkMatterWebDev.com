(function () {
  var lifecycle = new AbortController();

  window.addEventListener('pagehide', function () {
    lifecycle.abort();
  }, { capture: true });

  window.addEventListener('beforeunload', function () {
    lifecycle.abort();
  }, { capture: true });

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
      links: [
        ['Website Design', service('website-design-hosting')]
      ]
    },
    es: {
      all: 'Todos los Servicios',
      online: 'Servicios Web y en Línea',
      links: [
        ['Diseño Web', service('website-design-hosting')]
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
        copy.links.map(function (item) { return '<a href="' + item[1] + '">' + item[0] + '</a>'; }).join('') +
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
    // Keep this click from reaching document-level handlers (mobile-menu close,
    // Nova WebGL pointer listeners). Letting it bubble while the popout opens
    // corrupts the WebGL compositing layer and blanks the whole page on mobile.
    event.stopPropagation();
    if (popout.classList.contains('is-open')) close();
    else open();
  }, { signal: lifecycle.signal });

  popout.addEventListener('click', function (event) {
    if (event.target.closest('a')) close();
  }, { signal: lifecycle.signal });

  document.addEventListener('click', function (event) {
    if (!popout.contains(event.target) && !servicesTab.contains(event.target)) close();
  }, { signal: lifecycle.signal });

  window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') close();
  }, { signal: lifecycle.signal });

  window.addEventListener('scroll', close, { passive: true, signal: lifecycle.signal });
  mobileRoot.dataset.mobileServicesNav = 'ready';
})();
