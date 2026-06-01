(function () {
  var root = document.querySelector('.hidden.md\\:block');
  if (!root) return;
  var pop = document.getElementById('rail-popover');
  if (!pop) return;

  var CLOSE_DELAY = 200;
  var closeTimer = null;

  var stepSlugs = {
    design: 'website-design',
    build: 'custom-development',
    launch: 'process',
    maintain: 'website-care-plans'
  };

  var steps = {
    design: { icon: 'architecture', step: 'STEP 01 — DESIGN', title: 'Design', desc: 'We start by learning what you need, then shape the structure, visuals, and user experience before anything gets built.' },
    build: { icon: 'terminal', step: 'STEP 02 — BUILD', title: 'Build', desc: 'We build the site or web app with clean code, mobile performance, accessibility, and security best practices baked in.' },
    launch: { icon: 'rocket_launch', step: 'STEP 03 — LAUNCH', title: 'Launch', desc: 'We connect the domain, configure hosting and SSL, run final QA, and walk you through the finished site before it goes live.' },
    maintain: { icon: 'cloud_done', step: 'STEP 04 — MAINTAIN', title: 'Maintain', desc: 'After launch, we handle updates, backups, monitoring, improvements, and support through your care plan.' }
  };

  var iconEl = document.getElementById('rail-popover-icon');
  var stepEl = document.getElementById('rail-popover-step');
  var titleEl = document.getElementById('rail-popover-title');
  var descEl = document.getElementById('rail-popover-desc');

  function inServicesDir() {
    return window.location.pathname.replace(/\\/g, '/').indexOf('/services/') !== -1;
  }

  function stepHref(key) {
    if (key === 'launch') return inServicesDir() ? '../process.html' : 'process.html';
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

  function activeKeyFromPath(path) {
    if (path.indexOf('discovery-consultation') !== -1 || path.indexOf('website-design') !== -1 || path.indexOf('brand-rebranding') !== -1) return 'design';
    if (path.indexOf('custom-development') !== -1) return 'build';
    if (path.indexOf('process') !== -1 || path.indexOf('managed-hosting') !== -1 || path.indexOf('complete-website-management') !== -1) return 'launch';
    if (path.indexOf('website-care-plans') !== -1) return 'maintain';
    if (path.indexOf('index.html') !== -1 || /\/$/.test(path)) return 'design';
    return null;
  }

  function setActiveFromPath() {
    var path = window.location.pathname.replace(/\\/g, '/');
    var activeKey = activeKeyFromPath(path);
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
