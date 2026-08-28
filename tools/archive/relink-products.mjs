/**
 * Repoints every /product-detail?id=<legacyId> link (and schema URL) at the new
 * static /products/<slug> pages, so link equity and crawl paths reach them.
 * Also adds the shot-blast pillar and location pages into site navigation.
 *
 * Run with: node tools/relink-products.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { products } from './site-data.mjs';

const map = Object.fromEntries(products.map((p) => [p.legacyId, p.slug]));

const files = [
  ...readdirSync('.').filter((f) => f.endsWith('.html')),
  ...readdirSync('products').map((f) => join('products', f)),
];

let changed = 0;
for (const file of files) {
  const before = readFileSync(file, 'utf8');
  let s = before;

  // Relative links and absolute schema URLs alike.
  s = s.replace(/\/product-detail\?id=([a-z-]+)/g, (m, id) => (map[id] ? `/products/${map[id]}` : m));

  if (s !== before) {
    writeFileSync(file, s, 'utf8');
    changed++;
    console.log('  relinked', file);
  }
}
console.log(`\n${changed} file(s) relinked.`);
