// Mechanically converts white/black rgba veil literals to theme channel vars.
//   rgba(255,255,255,0.07)  ->  rgba(var(--c-veil-rgb), 0.07)
//   rgba(0,0,0,0.45)        ->  rgba(var(--c-shadow-rgb), 0.45)
// Each call site keeps its own alpha, so this is lossless in dark mode and
// flips hue in light mode. Idempotent: already-converted call sites are skipped
// because they no longer match the numeric-channel pattern.
//
// Fully-opaque white/black (alpha 1 or omitted) is NOT touched — those are
// solid colours with real semantics, not veils, and need case-by-case tokens.
//
// Usage: node sweep-veils.js --apply <file>...     (omit --apply to dry-run)
const fs = require('fs');

const apply = process.argv.includes('--apply');
const files = process.argv.slice(2).filter((a) => a !== '--apply');

const WHITE = /rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*(0?\.\d+)\s*\)/g;
const BLACK = /rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*(0?\.\d+)\s*\)/g;

let totalW = 0;
let totalB = 0;
const rows = [];

for (const f of files) {
  let src;
  try {
    src = fs.readFileSync(f, 'utf8');
  } catch {
    continue;
  }
  let w = 0;
  let b = 0;
  let out = src.replace(WHITE, (_, a) => {
    w++;
    return `rgba(var(--c-veil-rgb), ${a})`;
  });
  out = out.replace(BLACK, (_, a) => {
    b++;
    return `rgba(var(--c-shadow-rgb), ${a})`;
  });
  if (w + b === 0) continue;
  totalW += w;
  totalB += b;
  rows.push([f, w, b]);
  if (apply && out !== src) fs.writeFileSync(f, out, 'utf8');
}

rows.sort((x, y) => y[1] + y[2] - (x[1] + x[2]));
for (const [f, w, b] of rows) {
  console.log(`${String(w).padStart(4)} veil ${String(b).padStart(4)} shadow  ${f}`);
}
console.log(
  `\n${apply ? 'APPLIED' : 'DRY RUN'}: ${totalW} veil + ${totalB} shadow = ${totalW + totalB} in ${rows.length} files`
);
