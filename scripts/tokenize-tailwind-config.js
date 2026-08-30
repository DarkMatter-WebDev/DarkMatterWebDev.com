// Rewrites every page's inline tailwind.config colour palette from hex
// literals to CSS-variable-backed values, so Tailwind utilities follow the
// active theme:
//
//   "void-black": "#050505"
//     ->  "void-black": "rgb(var(--t-void-black) / <alpha-value>)"
//
// The <alpha-value> placeholder is what keeps the opacity variants working
// (bg-void-black/40, text-starlight-white/60). It only functions inside an
// rgb()/hsl() function, which is why assets/nav.css stores the palette as
// space-separated channel triplets rather than hex.
//
// The configs have DRIFTED across pages — 15 carry a unique subset, 6 share
// another, 14 have none — but every colour NAME maps to exactly one hex value
// site-wide, so a name-keyed rewrite is deterministic regardless of subset.
// Any name not in the known palette is left alone and reported, so a new
// colour can never be silently half-converted.
//
// Idempotent: an already-converted value contains "var(--t-" and is skipped.
//
// Usage: node scripts/tokenize-tailwind-config.js --apply [files...]
//        (omit --apply to dry-run; omit files to do the whole site)
const fs = require('fs');
const path = require('path');

const KNOWN = new Set([
  'void-black','primary-container','background','surface','surface-dim',
  'surface-bright','surface-container-lowest','surface-container-low',
  'surface-container','surface-container-high','surface-container-highest',
  'surface-variant','surface-tint','deep-space-grey','starlight-white',
  'on-background','on-surface','on-surface-variant','on-primary',
  'on-primary-container','primary','inverse-primary','inverse-on-surface',
  'inverse-surface','outline','outline-variant','electric-cyan','tertiary',
  'tertiary-container','tertiary-fixed-dim','on-tertiary',
  'on-tertiary-container','nebula-purple','secondary','secondary-container',
  'secondary-fixed-dim','on-secondary','on-secondary-container','error',
  'error-container','on-error','on-error-container','primary-fixed',
  'primary-fixed-dim','on-primary-fixed','on-primary-fixed-variant',
  'secondary-fixed','on-secondary-fixed','on-secondary-fixed-variant',
  'tertiary-fixed','on-tertiary-fixed','on-tertiary-fixed-variant',
]);

const apply = process.argv.includes('--apply');
let files = process.argv.slice(2).filter((a) => a !== '--apply');
if (!files.length) {
  const root = path.join(__dirname, '..');
  files = [
    ...fs.readdirSync(root).filter((f) => f.endsWith('.html')).map((f) => path.join(root, f)),
    ...fs.readdirSync(path.join(root, 'services')).filter((f) => f.endsWith('.html'))
      .map((f) => path.join(root, 'services', f)),
    path.join(root, 'assets', 'tailwind-nav-config.js'),
  ];
}

// Find the balanced extent of the "colors" object literal.
function colorsBlock(src) {
  const m = /["']?colors["']?\s*:\s*\{/.exec(src);
  if (!m) return null;
  let i = m.index + m[0].length;
  let depth = 1;
  while (i < src.length && depth > 0) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') depth--;
    i++;
  }
  // start points AT the opening brace, not past it, so the first entry has a
  // [{,] delimiter for ENTRY to anchor on like every other entry does.
  return depth === 0 ? { start: m.index + m[0].length - 1, end: i - 1 } : null;
}

// Keys may be quoted ("void-black") or bare (surface:, outline:) — the configs
// mix both styles. The leading [{,] anchor keeps a bare key from matching the
// tail of a longer identifier; it is not consumed in a way that can hide the
// next entry, since each entry keeps its own preceding delimiter.
const ENTRY = /([{,]\s*)(["']?)([a-z0-9-]+)\2(\s*:\s*)(["'])(#[0-9A-Fa-f]{3,8})\5/g;

let converted = 0;
let skipped = 0;
const unknown = new Map();
const rows = [];

for (const f of files) {
  let src;
  try {
    src = fs.readFileSync(f, 'utf8');
  } catch {
    continue;
  }
  const blk = colorsBlock(src);
  if (!blk) continue;

  const before = src.slice(blk.start, blk.end);
  let n = 0;
  const after = before.replace(ENTRY, (whole, lead, q, name, sep, q2, hex) => {
    if (!KNOWN.has(name)) {
      unknown.set(name, (unknown.get(name) || 0) + 1);
      skipped++;
      return whole;
    }
    n++;
    return `${lead}${q}${name}${q}${sep}${q2}rgb(var(--t-${name}) / <alpha-value>)${q2}`;
  });

  if (!n) continue;
  converted += n;
  rows.push([path.relative(process.cwd(), f), n]);
  if (apply) fs.writeFileSync(f, src.slice(0, blk.start) + after + src.slice(blk.end), 'utf8');
}

rows.sort((a, b) => b[1] - a[1]);
for (const [f, n] of rows) console.log(`${String(n).padStart(3)} colours  ${f}`);
if (unknown.size) {
  console.log('\nUNKNOWN colour names left as-is (add to KNOWN + nav.css if real):');
  for (const [k, v] of unknown) console.log(`  ${k} (${v}x)`);
}
console.log(`\n${apply ? 'APPLIED' : 'DRY RUN'}: ${converted} converted, ${skipped} skipped, ${rows.length} files`);
