// Adds the pre-paint theme resolver to every in-system page, and extends the
// existing #dm-critical-dark-baseline with its light-mode counterpart.
//
// WHY PRE-PAINT: the site's no-white-flash baseline paints #050505 from the
// <html> inline style attribute, the critical <style> block, and nav.css —
// all before any content shows. If the stored theme were applied later (say
// from a script at the end of <body>), a light-mode visitor would get a black
// flash on every single navigation. The resolver therefore runs as the first
// script in <head>, and must stay there.
//
// It also overwrites the inline style="background:#050505" on <html>, which is
// an inline attribute and would otherwise beat every stylesheet rule.
//
// theme-color is deliberately NOT handled here: the <meta> tag is parsed later
// in <head> than this script runs, so it does not exist yet. assets/theme.js
// updates it once the DOM is ready — it only tints mobile browser chrome, so a
// few ms late is imperceptible.
//
// Idempotent: pages already carrying the marker are skipped.
//
// Usage: node scripts/add-theme-resolver.js --apply
const fs = require('fs');
const path = require('path');

const MARKER = 'sds-theme-resolver';

const RESOLVER =
  `<script id="${MARKER}">/* Pre-paint theme resolver — must stay the first script in <head>. ` +
  `Stamps data-theme on <html> from the stored choice before anything paints, and overwrites ` +
  `the inline dark background attribute. Dark is the brand default when nothing is stored, so a ` +
  `visitor whose OS prefers light still gets the site's intended look until they choose. */` +
  `(function(){var d=document.documentElement,t;try{t=localStorage.getItem("sds-theme")}catch(e){}` +
  `if(t!=="light")t="dark";d.setAttribute("data-theme",t);d.classList.toggle("dark",t==="dark");` +
  `d.style.background=t==="light"?"#f4f2ee":"#050505"})();<\/script>`;

// Mirrors the light values in assets/nav.css. Kept literal (not var()) because
// this block must work before nav.css has loaded.
const LIGHT_BASELINE =
  `html[data-theme="light"],html[data-theme="light"] body{background:#f4f2ee;color:#0b0e10;color-scheme:light}` +
  `html[data-theme="light"] #__next,html[data-theme="light"] #root,html[data-theme="light"] .app{background:#f4f2ee}` +
  `html[data-theme="light"] #page-loader,html[data-theme="light"] .sds-apps-loader{background:#f4f2ee}`;

const EXCLUDE = new Set(['multichannel-commerce-website-test-4.html']);

const apply = process.argv.includes('--apply');
const root = path.join(__dirname, '..');
const files = [
  ...fs.readdirSync(root).filter((f) => f.endsWith('.html')).map((f) => path.join(root, f)),
  ...fs.readdirSync(path.join(root, 'services')).filter((f) => f.endsWith('.html'))
    .map((f) => path.join(root, 'services', f)),
].filter((f) => !EXCLUDE.has(path.basename(f)));

let addedResolver = 0;
let addedBaseline = 0;
const problems = [];

for (const f of files) {
  const rel = path.relative(root, f);
  let src = fs.readFileSync(f, 'utf8');
  const orig = src;

  if (!src.includes(MARKER)) {
    const m = /<meta\s+charset=["'][^"']+["']\s*\/?>/i.exec(src);
    if (!m) {
      problems.push(`${rel}: no <meta charset> to anchor the resolver`);
    } else {
      src = src.slice(0, m.index + m[0].length) + '\n' + RESOLVER + src.slice(m.index + m[0].length);
      addedResolver++;
    }
  }

  if (!src.includes('html[data-theme="light"]')) {
    const i = src.indexOf('dm-critical-dark-baseline');
    if (i === -1) {
      problems.push(`${rel}: no #dm-critical-dark-baseline block`);
    } else {
      const close = src.indexOf('</style>', i);
      if (close === -1) {
        problems.push(`${rel}: unterminated baseline <style>`);
      } else {
        src = src.slice(0, close) + LIGHT_BASELINE + '\n' + src.slice(close);
        addedBaseline++;
      }
    }
  }

  if (apply && src !== orig) fs.writeFileSync(f, src, 'utf8');
}

for (const p of problems) console.log('  !! ' + p);
console.log(
  `\n${apply ? 'APPLIED' : 'DRY RUN'}: resolver +${addedResolver}, light baseline +${addedBaseline}, ` +
  `${files.length} pages, ${problems.length} problems`
);
