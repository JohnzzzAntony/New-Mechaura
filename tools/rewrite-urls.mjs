/**
 * One-off migration: rewrite every in-site link to an extension-less URL and
 * make asset references root-absolute so they keep resolving from nested
 * clean-URL paths (e.g. /products/).
 *
 * Run with:  node tools/rewrite-urls.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const PAGES = new Set([
  'about',
  'services',
  'products',
  'sectors',
  'contact',
  'blog',
  'product-detail',
  'delivery-policy',
  'privacy-policy',
  'terms-conditions',
]);

function rewrite(src) {
  let out = src.replace(/(\.\/)?([a-z0-9-]+)\.html/gi, (m, dot, name, offset, str) => {
    const prev = str[offset - 1];
    const absolute = prev === '/' && !dot;
    if (name === 'index') return absolute ? '' : '/';
    if (!PAGES.has(name)) return m;
    return absolute ? name : `/${name}`;
  });

  // Root-absolute assets so they resolve from /about/, /products/, etc.
  out = out.replace(/(["'(])(images|assets)\//g, '$1/$2/');
  out = out.replace(/"\.\/style\.css"/g, '"/style.css"');
  out = out.replace(/"\.\/main\.js"/g, '"/main.js"');

  return out;
}

const targets = [
  ...readdirSync(ROOT).filter((f) => f.endsWith('.html')),
  'public/sitemap.xml',
  'public/llms.txt',
];

let changed = 0;
for (const rel of targets) {
  const file = join(ROOT, rel);
  const src = readFileSync(file, 'utf8');
  const out = rewrite(src);
  if (out !== src) {
    writeFileSync(file, out, 'utf8');
    changed++;
    console.log(`rewrote ${rel}`);
  }
}
console.log(`\n${changed} file(s) updated.`);
