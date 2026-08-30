// Converts hardcoded palette hex literals inside page-level <style> blocks to
// theme tokens, so page-scoped CSS follows the theme like the Tailwind
// utilities already do.
//
// ONLY the six unambiguous palette colours are swept. Deliberately NOT swept:
//
//   #fff / #ffffff / #000  — context-dependent. Some are body text on a dark
//     panel (must flip), some are labels on a brand-gradient fill (must not).
//     A blanket rule would invert the second group into invisibility. These
//     need eyes, not a regex.
//
//   #ddeeff / #00b8df      — already inside var(--sds-logo-*, …) fallbacks.
//
//   Bespoke per-page accents (#39ff14, #ffd400, #ff3b8f, …) — one-off design
//     colours with no palette token to map onto.
//
// The #dm-critical-dark-baseline block is skipped entirely: it is inlined in
// <head> and runs BEFORE nav.css defines any variable, so its literals are
// load-bearing. Rewriting it to var() would leave the page unpainted until
// the stylesheet arrived — reintroducing the white flash the block exists to
// prevent.
//
// Idempotent. Usage: node scripts/tokenize-page-styles.js --apply
const fs = require('fs');
const path = require('path');

const MAP = {
  '#050505': 'rgb(var(--t-void-black))',
  '#00f0ff': 'rgb(var(--t-electric-cyan))',
  '#7000ff': 'rgb(var(--t-nebula-purple))',
  '#c4c7c7': 'rgb(var(--t-on-surface-variant))',
  '#e3e2e2': 'rgb(var(--t-on-surface))',
  '#8e9192': 'rgb(var(--t-outline))',
};

const EXCLUDE_FILES = new Set(['multichannel-commerce-website-test-4.html']);
const apply = process.argv.includes('--apply');
const root = path.join(__dirname, '..');

const files = [
  ...fs.readdirSync(root).filter((f) => f.endsWith('.html')).map((f) => path.join(root, f)),
  ...fs.readdirSync(path.join(root, 'services')).filter((f) => f.endsWith('.html'))
    .map((f) => path.join(root, 'services', f)),
].filter((f) => !EXCLUDE_FILES.has(path.basename(f)));

const STYLE = /<style([^>]*)>([\s\S]*?)<\/style>/gi;
const HEX = /#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\b/g;

let total = 0;
const rows = [];
const perColour = {};

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  let n = 0;

  const out = src.replace(STYLE, (whole, attrs, body) => {
    // Load-bearing pre-nav.css literals — leave alone.
    if (/dm-critical-dark-baseline/.test(attrs)) return whole;

    const newBody = body.replace(HEX, (hex) => {
      const key = hex.toLowerCase();
      // Never touch a hex that is already a var() fallback.
      const repl = MAP[key];
      if (!repl) return hex;
      n++;
      perColour[key] = (perColour[key] || 0) + 1;
      return repl;
    });
    return `<style${attrs}>${newBody}</style>`;
  });

  if (!n) continue;
  total += n;
  rows.push([path.relative(root, f), n]);
  if (apply) fs.writeFileSync(f, out, 'utf8');
}

rows.sort((a, b) => b[1] - a[1]);
for (const [f, n] of rows.slice(0, 10)) console.log(`${String(n).padStart(4)}  ${f}`);
if (rows.length > 10) console.log(`      … and ${rows.length - 10} more files`);
console.log('\nby colour:');
for (const [k, v] of Object.entries(perColour).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k}  x${v}`);
}
console.log(`\n${apply ? 'APPLIED' : 'DRY RUN'}: ${total} literals in ${rows.length} files`);
