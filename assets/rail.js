(function () {
  var root = document.querySelector('.hidden.md\\:block');
  if (!root) return;
  var pop = document.getElementById('rail-popover');
  if (!pop) return;

  var CLOSE_DELAY = 200;
  var closeTimer = null;

  var stepSlugs = {
    discover: 'discovery-consultation',
    build: 'website-design',
    manage: 'complete-website-management',
    support: 'website-care-plans'
  };

  var steps = {
    discover: { icon: 'search', step: 'STEP 01 — DISCOVERY', title: 'Discovery', desc: 'We learn about your business, your goals, and what your website needs to accomplish.' },
    build: { icon: 'web', step: 'STEP 02 — BUILD', title: 'Build', desc: 'We design and launch your professional website — mobile-friendly, fast, and built to represent your brand.' },
    manage: { icon: 'cloud_done', step: 'STEP 03 — MANAGE', title: 'Manage', desc: 'We host, monitor, and secure your website with backups and ongoing maintenance.' },
    support: { icon: 'forum', step: 'STEP 04 — SUPPORT', title: 'Support', desc: 'Need changes? Send us a message and we\'ll handle them — no portals, no hassle.' }
  };

  var iconEl = document.getElementById('rail-popover-icon');
  var stepEl = document.getElementById('rail-popover-step');
  var titleEl = document.getElementById('rail-popover-title');
  var descEl = document.getElementById('rail-popover-desc');

  function inServicesDir() {
    return window.location.pathname.replace(/\\/g, '/').indexOf('/services/') !== -1;
  }

  function stepHref(key) {
    var slug = stepSlugs[key];
    if (!slug) return null;
    return inServicesDir() ? slug + '.html' : 'services/' + slug + '.html';
  }

  function positionFor(trigger) {
    var r = trigger.getBoundingClientRect();
    pop.style.left = (r.right + 12) + 'px';
    pop.style.top = (r.top + r.height / 2) + 'px';
  }

  function showFor(trigger) {
    clearTimeout(closeTimer);
    var key = trigger.getAttribute('data-step');
    var data = steps[key];
    if (!data) return;
    iconEl.textContent = data.icon;
    stepEl.textContent = data.step;
    titleEl.textContent = data.title;
    descEl.textContent = data.desc;
    positionFor(trigger);
    pop.setAttribute('data-active', key);
    if (pop.classList.contains('is-visible')) {
      pop.setAttribute('aria-hidden', 'false');
      return;
    }
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        positionFor(trigger);
        pop.classList.add('is-visible');
        pop.setAttribute('aria-hidden', 'false');
      });
    });
  }

  function scheduleClose() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(function () {
      pop.classList.remove('is-visible');
      pop.setAttribute('aria-hidden', 'true');
      pop.removeAttribute('data-active');
    }, CLOSE_DELAY);
  }

  function hideNow() {
    clearTimeout(closeTimer);
    pop.classList.remove('is-visible');
    pop.setAttribute('aria-hidden', 'true');
    pop.removeAttribute('data-active');
  }

  function navigateForStep(key) {
    var href = stepHref(key);
    if (href) window.location.href = href;
  }

  function setActiveFromPath() {
    var path = window.location.pathname.replace(/\\/g, '/');
    var activeKey = null;
    Object.keys(stepSlugs).forEach(function (key) {
      if (path.indexOf(stepSlugs[key]) !== -1) activeKey = key;
    });
    if (!activeKey) return;
    root.querySelectorAll('aside [data-step]').forEach(function (b) {
      b.classList.remove('text-nebula-purple', 'bg-nebula-purple/10');
      b.classList.add('text-outline');
    });
    var activeBtn = root.querySelector('aside [data-step="' + activeKey + '"]');
    if (activeBtn) {
      activeBtn.classList.remove('text-outline');
      activeBtn.classList.add('text-nebula-purple', 'bg-nebula-purple/10');
    }
  }

  root.querySelectorAll('aside [data-step]').forEach(function (t) {
    t.style.cursor = 'pointer';
    if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '0');
    t.addEventListener('mouseenter', function () { showFor(t); });
    t.addEventListener('mouseleave', scheduleClose);
    t.addEventListener('focus', function () { showFor(t); });
    t.addEventListener('blur', scheduleClose);
    t.addEventListener('click', function () {
      var key = t.getAttribute('data-step');
      if (key) {
        hideNow();
        navigateForStep(key);
      }
    });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var key = t.getAttribute('data-step');
        if (key) {
          hideNow();
          navigateForStep(key);
        }
      }
    });
  });

  pop.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
  pop.addEventListener('mouseleave', scheduleClose);
  window.addEventListener('resize', hideNow);
  window.addEventListener('scroll', hideNow, true);
  setActiveFromPath();
})();
