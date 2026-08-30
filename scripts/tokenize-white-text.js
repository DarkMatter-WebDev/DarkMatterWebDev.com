// Second-pass sweep: `color: #fff` in page/asset CSS.
//
// Held back from tokenize-page-styles.js because white text is genuinely
// two different things in this codebase:
//
//   * body/heading text on a dark panel  -> MUST flip on a light ground
//   * a label on a brand gradient fill   -> MUST stay white in both themes
//
// A blanket replace would turn the second group invisible. The split is made
// structurally: if the same rule also paints a gradient or brand-accent
// background, the text is sitting on that fill and is left alone. Measured
// across the site this separates 10 on-accent rules from ~99 flippable ones.
//
// Also maps a couple of stray non-palette accents that pages reached for
// directly (Tailwind's cyan-400 #22d3ee) onto the real accent token.
//
// Skips the #dm-critical-dark-baseline block for the same reason as the first
// pass: it runs before nav.css exists, so its literals are load-bearing.
//
// Idempotent. Usage: node scripts/tokenize-white-text.js --apply
const fs = require('fs');
const path = require('path');

const apply = process.argv.includes('--apply');
const root = path.join(__dirname, '..');

const files = [
  ...fs.readdirSync(root).filter((f) => f.endsWith('.html')).map((f) => path.join(root, f)),
  ...fs.readdirSync(path.join(root, 'services')).filter((f) => f.endsWith('.html'))
    .map((f) => path.join(root, 'services', f)),
  ...fs.readdirSync(path.join(root, 'assets')).filter((f) => f.endsWith('.css'))
    .map((f) => path.join(root, 'assets', f)),
].filter((f) => !path.basename(f).startsWith('multichannel-commerce-website-test-4'));

const ACCENT_BG = /background(-image)?:\s*[^;]*(gradient|var\(--g-|#00f0ff|#7000ff|var\(--t-electric|var\(--t-nebula)/i;
const WHITE_COLOR = /(^|[^-\w])color:\s*#(?:fff|ffffff)\b/gi;
const RULE = /([^{}]+)\{([^{}]*)\}/g;

let flipped = 0;
let keptOnAccent = 0;
let strayAccents = 0;
const rows = [];

function sweepCss(css) {
  let n = 0;
  const out = css.replace(RULE, (whole, sel, body) => {
    let newBody = body;

    if (ACCENT_BG.test(body)) {
      if (WHITE_COLOR.test(body)) keptOnAccent++;
      WHITE_COLOR.lastIndex = 0;
    } else {
      newBody = newBody.replace(WHITE_COLOR, (m, lead) => {
        n++; flipped++;
        return `${lead}color: rgb(var(--t-starlight-white))`;
      });
    }

    // Tailwind cyan-400 reached for directly instead of the accent token.
    const before = newBody;
    newBody = newBody.replace(/#22d3ee\b/gi, 'rgb(var(--t-electric-cyan))');
    if (newBody !== before) { strayAccents++; n++; }

    return sel + '{' + newBody + '}';
  });
  return { out, n };
}

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  let out;
  let n = 0;

  if (f.endsWith('.css')) {
    const r = sweepCss(src);
    out = r.out; n = r.n;
  } else {
    out = src.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi, (whole, attrs, body) => {
      if (/dm-critical-dark-baseline/.test(attrs)) return whole;
      const r = sweepCss(body);
      n += r.n;
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
console.log(`\n${apply ? 'APPLIED' : 'DRY RUN'}: ${flipped} white-text flipped, ` +
  `${strayAccents} stray accents mapped, ${keptOnAccent} left on accent fills, ${rows.length} files`);
