// Third-pass sweep: translucent PALETTE colours written in rgba() form.
//
//   rgba(18, 20, 20, 0.55)  ->  rgb(var(--t-surface) / 0.55)
//
// These slipped through the earlier passes because:
//   * sweep-veils.js only matched pure white and pure black channels;
//   * tokenize-page-styles.js only matched #hex literals.
// A translucent panel like .wp-card's rgba(18,20,20,0.55) is neither, so it
// stayed dark while its text flipped to ink — one such rule accounted for
// hundreds of failing elements on the pricing page.
//
// Output uses the SPACE-slash form rgb(R G B / A), which is what the
// channel-triplet variables support. rgba(var(--t-surface), 0.55) would not
// work: the variable expands to "18 20 20", and legacy comma rgba() cannot
// take a space-separated triplet.
//
// Idempotent. Usage: node scripts/tokenize-translucent-palette.js --apply
const fs = require('fs');
const path = require('path');

// Only colours with a real theme token. Anything else is left alone.
const TRIPLETS = {
  '5,5,5': 'void-black',
  '18,20,20': 'surface',
  '26,28,28': 'surface-container-low',
  '31,32,32': 'surface-container',
  '41,42,42': 'surface-container-high',
  '52,53,53': 'surface-container-highest',
  '56,57,57': 'surface-bright',
  '13,14,15': 'surface-container-lowest',
  '26,26,26': 'deep-space-grey',
  '227,226,226': 'on-surface',
  '196,199,199': 'on-surface-variant',
  '142,145,146': 'outline',
  '0,240,255': 'electric-cyan',
  '112,0,255': 'nebula-purple',
  '0,219,233': 'tertiary',
  '209,188,255': 'secondary',
};

const RGBA = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([\d.]+)\s*)?\)/g;

const apply = process.argv.includes('--apply');
const root = path.join(__dirname, '..');
const files = [
  ...fs.readdirSync(root).filter((f) => f.endsWith('.html')).map((f) => path.join(root, f)),
  ...fs.readdirSync(path.join(root, 'services')).filter((f) => f.endsWith('.html'))
    .map((f) => path.join(root, 'services', f)),
  ...fs.readdirSync(path.join(root, 'assets')).filter((f) => f.endsWith('.css'))
    .map((f) => path.join(root, 'assets', f)),
].filter((f) => !path.basename(f).startsWith('multichannel-commerce-website-test-4'));

const hits = {};
let total = 0;
const rows = [];

function sweep(css) {
  let n = 0;
  const out = css.replace(RGBA, (whole, r, g, b, a) => {
    const key = `${+r},${+g},${+b}`;
    const token = TRIPLETS[key];
    if (!token) return whole;
    // A fully-opaque rgb() is better expressed without the slash.
    const alpha = a === undefined || +a >= 1 ? null : a;
    n++; total++;
    hits[key] = (hits[key] || 0) + 1;
    return alpha === null
      ? `rgb(var(--t-${token}))`
      : `rgb(var(--t-${token}) / ${alpha})`;
  });
  return { out, n };
}

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  let out;
  let n = 0;
  if (f.endsWith('.css')) {
    const r = sweep(src); out = r.out; n = r.n;
  } else {
    out = src.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi, (whole, attrs, body) => {
      if (/dm-critical-dark-baseline/.test(attrs)) return whole;   // pre-nav.css, literals required
      const r = sweep(body); n += r.n;
      return `<style${attrs}>${r.out}</style>`;
    });
  }
  if (!n) continue;
  rows.push([path.relative(root, f), n]);
  if (apply) fs.writeFileSync(f, out, 'utf8');
}

rows.sort((a, b) => b[1] - a[1]);
for (const [f, n] of rows.slice(0, 10)) console.log(`${String(n).padStart(4)}  ${f}`);
if (rows.length > 10) console.log(`      … and ${rows.length - 10} more`);
console.log('\nby colour:');
for (const [k, v] of Object.entries(hits).sort((a, b) => b[1] - a[1])) {
  console.log(`  rgba(${k})  ->  --t-${TRIPLETS[k]}   x${v}`);
}
console.log(`\n${apply ? 'APPLIED' : 'DRY RUN'}: ${total} in ${rows.length} files`);
