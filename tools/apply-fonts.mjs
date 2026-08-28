/**
 * Swaps the Google Fonts links (Space Grotesk + Inter) for the Satoshi stack
 * on Fontshare, which stands in for Aeonik until the licensed files are added.
 *
 * Aeonik itself is loaded via @font-face from /fonts/ in style.css — it takes
 * priority automatically once those files exist, no markup change needed.
 *
 * Run with: node tools/apply-fonts.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const FONTSHARE = 'https://api.fontshare.com/v2/css?f%5B%5D=satoshi@400,500,600,700&display=swap';

const NEW_BLOCK = `  <!-- Type: Aeonik loads from /fonts via @font-face in style.css.
       Satoshi is the licensed-free stand-in until those files are added. -->
  <link rel="preconnect" href="https://api.fontshare.com" crossorigin>
  <link rel="preload" as="style" href="${FONTSHARE}">
  <link rel="stylesheet" href="${FONTSHARE}" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="${FONTSHARE}"></noscript>`;

const files = [
  ...readdirSync('.').filter((f) => f.endsWith('.html')),
  ...(existsSync('products') ? readdirSync('products').map((f) => join('products', f)) : []),
  ...(existsSync('blog') ? readdirSync('blog').map((f) => join('blog', f)) : []),
];

let changed = 0;
for (const file of files) {
  const before = readFileSync(file, 'utf8');
  let s = before;

  // Drop every existing Google Fonts tag for the old families.
  s = s.replace(
    /[ \t]*<link[^>]*fonts\.googleapis\.com\/css2[^>]*>\r?\n?/g,
    ''
  );
  s = s.replace(/[ \t]*<link[^>]*rel="preconnect"[^>]*fonts\.(googleapis|gstatic)\.com[^>]*>\r?\n?/g, '');
  // Remove the now-empty noscript wrappers those links sat inside.
  s = s.replace(/[ \t]*<noscript>\s*<\/noscript>\r?\n?/g, '');

  if (s.includes('api.fontshare.com')) {
    if (s !== before) { writeFileSync(file, s, 'utf8'); changed++; }
    continue;
  }

  // Insert ahead of the stylesheet so the face is known before paint.
  s = s.replace(
    /([ \t]*<link rel="stylesheet" href="\/style\.css">)/,
    `${NEW_BLOCK}\n\n$1`
  );

  if (s !== before) {
    writeFileSync(file, s, 'utf8');
    changed++;
  }
}

console.log(`Font stack applied to ${changed} file(s).`);
