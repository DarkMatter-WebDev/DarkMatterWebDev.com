(function () {
  if (document.documentElement.classList.contains('dm-site-hero-ready')) return;
  document.documentElement.classList.add('dm-site-hero-ready');

  var script = document.currentScript;
  if (!script || !script.src) return;

  var assetBase = script.src.replace(/site-hero\.js(?:\?.*)?$/, '');
  var videoSrc = assetBase + 'Hero-Black-Hole-desktop-1080p.mp4';

  var heroThemes = [
    { match: 'complete-website-management', accent: '0,214,255', secondary: '51,112,255', hue: '-8deg', sat: '1.24', name: 'sapphire' },
    { match: 'discovery-consultation', accent: '0,240,190', secondary: '43,190,255', hue: '24deg', sat: '1.22', name: 'aqua' },
    { match: 'website-design', accent: '255,72,180', secondary: '112,0,255', hue: '48deg', sat: '1.26', name: 'rose' },
    { match: 'brand-rebranding', accent: '255,197,92', secondary: '255,88,88', hue: '118deg', sat: '1.2', name: 'ember' },
    { match: 'managed-hosting', accent: '76,110,255', secondary: '0,240,255', hue: '-34deg', sat: '1.18', name: 'indigo' },
    { match: 'website-care-plans', accent: '118,255,115', secondary: '0,210,170', hue: '76deg', sat: '1.2', name: 'green' },
    { match: 'seo-foundations', accent: '255,214,72', secondary: '0,240,255', hue: '96deg', sat: '1.18', name: 'gold' },
    { match: 'custom-development', accent: '255,70,120', secondary: '112,0,255', hue: '136deg', sat: '1.28', name: 'crimson' },
    { match: 'in-home-services', accent: '0,255,210', secondary: '105,255,120', hue: '58deg', sat: '1.22', name: 'mint' },
    { match: 'office-network-setup', accent: '255,139,61', secondary: '0,176,255', hue: '152deg', sat: '1.24', name: 'copper' },
    { match: 'casestudies', accent: '60,150,255', secondary: '0,240,255', hue: '-18deg', sat: '1.2', name: 'blue' },
    { match: 'contact', accent: '255,86,208', secondary: '0,240,255', hue: '44deg', sat: '1.22', name: 'magenta' },
    { match: 'built-by', accent: '190,255,86', secondary: '255,214,72', hue: '82deg', sat: '1.16', name: 'lime' },
    { match: 'process', accent: '255,122,72', secondary: '255,214,72', hue: '108deg', sat: '1.2', name: 'solar' },
    { match: 'services', accent: '0,224,255', secondary: '0,255,170', hue: '18deg', sat: '1.18', name: 'teal' }
  ];

  function themeForPath() {
    var path = window.location.pathname.replace(/\\/g, '/').toLowerCase().replace(/^\/es\//, '/');
    for (var i = 0; i < heroThemes.length; i += 1) {
      if (path.indexOf(heroThemes[i].match) !== -1) return heroThemes[i];
    }
    return { accent: '0,240,255', secondary: '112,0,255', hue: '0deg', sat: '1.12', name: 'default' };
  }

  var css = [
    '.dm-universal-hero-shell{--dm-hero-accent:0,240,255;--dm-hero-secondary:112,0,255;--dm-hero-hue:0deg;--dm-hero-sat:1.12;position:relative;min-height:clamp(34rem,76vh,48rem);width:100%;overflow:hidden;display:flex;align-items:center;border-bottom:1px solid rgba(255,255,255,.08);background:#050608;}',
    '.dm-universal-hero-shell::after{content:"";position:absolute;inset:auto 0 0;height:42%;background:linear-gradient(to bottom,rgba(5,6,8,0),#050608 82%);z-index:2;pointer-events:none;}',
    '.dm-universal-hero-media{position:absolute;inset:0;z-index:0;overflow:hidden;}',
    '.dm-universal-hero-media video{width:100%;height:100%;object-fit:cover;filter:hue-rotate(var(--dm-hero-hue)) saturate(var(--dm-hero-sat)) contrast(1.08);transform:scale(1.02);opacity:.82;}',
    '.dm-universal-hero-scrim{position:absolute;inset:0;z-index:1;background:radial-gradient(circle at 64% 42%,rgba(var(--dm-hero-accent),.18),transparent 34%),radial-gradient(circle at 24% 72%,rgba(var(--dm-hero-secondary),.13),transparent 32%),linear-gradient(90deg,rgba(5,6,8,.92) 0%,rgba(5,6,8,.64) 44%,rgba(5,6,8,.34) 100%),linear-gradient(180deg,rgba(5,6,8,.48) 0%,rgba(5,6,8,.12) 48%,rgba(5,6,8,.86) 100%);}',
    '.dm-universal-hero-grid{position:absolute;inset:0;z-index:1;opacity:.25;background-image:linear-gradient(to right,rgba(255,255,255,.09) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.09) 1px,transparent 1px);background-size:90px 90px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.85),rgba(0,0,0,.28));pointer-events:none;}',
    '.dm-universal-hero-content{position:relative;z-index:3;width:min(100%,1180px);padding:10rem var(--dm-hero-x,7rem) 6rem;margin:0 auto;}',
    '.dm-universal-hero-content>*{max-width:56rem;}',
    '.dm-universal-hero-content h1,.dm-universal-hero-content h2{color:#fff;text-shadow:0 2px 28px rgba(0,0,0,.78);}',
    '.dm-universal-hero-content p{color:rgba(232,235,241,.82);text-shadow:0 1px 18px rgba(0,0,0,.72);}',
    '.dm-universal-hero-content .glass-card,.dm-universal-hero-content .glass-panel{background:rgba(8,10,14,.2);backdrop-filter:blur(18px);}',
    '.dm-universal-hero-shell[data-hero-theme="green"]{min-height:clamp(22rem,42vh,29rem);}',
    '.dm-universal-hero-shell[data-hero-theme="green"] .dm-universal-hero-content{padding-top:7rem;padding-bottom:2rem;}',
    '.dm-universal-hero-shell[data-hero-theme="green"] + main.dm-has-universal-hero{padding-top:1.25rem!important;}',
    '.dm-universal-hero-shell[data-hero-theme="blue"]{min-height:clamp(24rem,48vh,32rem);}',
    '.dm-universal-hero-shell[data-hero-theme="blue"] .dm-universal-hero-content{padding-top:7.5rem;padding-bottom:2.5rem;}',
    '.dm-universal-hero-shell[data-hero-theme="blue"] + main.dm-has-universal-hero{padding-top:1.5rem!important;}',
    '.dm-has-universal-hero{padding-top:4rem!important;background:#050608;}',
    '.md\\:hidden .dm-universal-hero-shell{min-height:clamp(31rem,78vh,44rem);}',
    '.md\\:hidden .dm-universal-hero-shell[data-hero-theme="green"]{min-height:clamp(24rem,58vh,32rem);}',
    '.md\\:hidden .dm-universal-hero-shell[data-hero-theme="green"] .dm-universal-hero-content{padding-top:7rem;padding-bottom:2.5rem;}',
    '.md\\:hidden .dm-universal-hero-shell[data-hero-theme="blue"]{min-height:clamp(24rem,58vh,32rem);}',
    '.md\\:hidden .dm-universal-hero-shell[data-hero-theme="blue"] .dm-universal-hero-content{padding-top:7rem;padding-bottom:2.5rem;}',
    '.md\\:hidden .dm-universal-hero-content{padding:8.5rem var(--dm-hero-x,1.5rem) 4.5rem;}',
    '.md\\:hidden .dm-has-universal-hero{padding-top:3rem!important;}',
    '@media (min-width:768px){.hidden.md\\:block .dm-universal-hero-content{--dm-hero-x:7rem;}.hidden.md\\:block main.md\\:pl-44.dm-has-universal-hero{padding-left:11rem!important;}}',
    '@media (max-width:767px){.dm-universal-hero-media video{transform:scale(1);}.dm-universal-hero-content h1,.dm-universal-hero-content h2{font-size:clamp(2.4rem,12vw,4rem)!important;line-height:1.04!important;}.dm-universal-hero-content .flex{max-width:100%;}}'
  ].join('');

  var style = document.createElement('style');
  style.id = 'dm-universal-hero-styles';
  style.textContent = css;
  document.head.appendChild(style);

  function firstDirect(root, selector) {
    var children = Array.prototype.slice.call(root.children);
    for (var i = 0; i < children.length; i += 1) {
      if (children[i].matches(selector)) return children[i];
    }
    return null;
  }

  function chooseIntro(main) {
    function looseIntroGroup(heading) {
      var start = heading;
      var prev = heading.previousElementSibling;
      if (prev && !prev.matches('nav,header,section,main,div')) start = prev;
      var group = document.createElement('div');
      main.insertBefore(group, start);
      var node = start;
      while (node && !node.matches('section,main,footer,script')) {
        var next = node.nextElementSibling;
        group.appendChild(node);
        if (node === heading) {
          while (next && next.matches('p,ul,ol,.flex')) {
            node = next;
            next = node.nextElementSibling;
            group.appendChild(node);
          }
          break;
        }
        node = next;
      }
      return group;
    }

    var directHeader = firstDirect(main, 'header');
    if (directHeader && directHeader.querySelector('h1,h2')) return directHeader;

    var firstHeading = main.querySelector('h1');
    if (!firstHeading) firstHeading = main.querySelector('h2');
    if (firstHeading) {
      var headingHeader = firstHeading.closest('header');
      if (headingHeader && main.contains(headingHeader)) return headingHeader;
      var headingParent = firstHeading.parentElement;
      if (headingParent && headingParent !== main && headingParent.tagName !== 'SECTION') return headingParent;
      if (headingParent === main) return looseIntroGroup(firstHeading);
      if (!firstDirect(main, 'section') || firstHeading.compareDocumentPosition(firstDirect(main, 'section')) & Node.DOCUMENT_POSITION_FOLLOWING) {
        return headingParent && headingParent !== main ? headingParent : firstHeading;
      }
    }

    var firstSection = firstDirect(main, 'section');
    var h1 = firstSection ? firstSection.querySelector('h1,h2') : null;
    if (!h1) {
      h1 = main.querySelector('h1,h2');
      if (!h1) return null;
      var nestedHeader = h1.closest('header');
      if (nestedHeader && main.contains(nestedHeader)) return nestedHeader;
      return h1.parentElement && h1.parentElement !== main ? h1.parentElement : null;
    }

    var parent = h1.parentElement;
    if (parent && parent !== firstSection && parent.tagName !== 'MAIN') return parent;

    var header = h1.closest('header');
    if (header && firstSection.contains(header)) return header;

    return firstSection;
  }

  function cleanupEmpty(node) {
    while (node && node.tagName !== 'MAIN') {
      var parent = node.parentElement;
      if (!node.textContent.trim() && node.children.length === 0) {
        node.remove();
      }
      node = parent;
    }
  }

  function createHero(intro) {
    var hero = document.createElement('section');
    var theme = themeForPath();
    hero.className = 'dm-universal-hero-shell';
    hero.dataset.heroTheme = theme.name;
    hero.style.setProperty('--dm-hero-accent', theme.accent);
    hero.style.setProperty('--dm-hero-secondary', theme.secondary);
    hero.style.setProperty('--dm-hero-hue', theme.hue);
    hero.style.setProperty('--dm-hero-sat', theme.sat);
    hero.setAttribute('aria-label', 'Page hero');
    hero.innerHTML = '<div class="dm-universal-hero-media" aria-hidden="true"><video autoplay muted loop playsinline preload="metadata"><source src="' + videoSrc + '" type="video/mp4"></video></div><div class="dm-universal-hero-scrim" aria-hidden="true"></div><div class="dm-universal-hero-grid" aria-hidden="true"></div><div class="dm-universal-hero-content"></div>';
    hero.querySelector('.dm-universal-hero-content').appendChild(intro);
    return hero;
  }

  function enhanceRoot(root) {
    var main = firstDirect(root, 'main') || root.querySelector('main');
    var container = main || root;
    if (container.dataset.universalHero === 'ready') return;
    if (container.querySelector('[data-hero-video]')) return;

    var intro = chooseIntro(container);
    if (!intro || !intro.querySelector('h1,h2')) return;

    var oldParent = intro.parentElement;
    var nextSibling = intro.nextSibling;
    var hero = createHero(intro);
    if (main) {
      main.parentNode.insertBefore(hero, main);
      main.classList.add('dm-has-universal-hero');
    } else {
      root.insertBefore(hero, oldParent === root ? nextSibling : oldParent);
      root.classList.add('dm-has-universal-hero');
    }
    container.dataset.universalHero = 'ready';
    cleanupEmpty(oldParent);
  }

  function init() {
    Array.prototype.slice.call(document.body.children).forEach(function (child) {
      if (child.matches && (child.matches('.hidden.md\\:block') || child.matches('.md\\:hidden'))) {
        enhanceRoot(child);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
