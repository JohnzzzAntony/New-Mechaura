/**
 * Image optimisation for Core Web Vitals.
 *
 * The source PNGs run 2–4 MB each, which destroys LCP on a photo-led design.
 * This script writes a resized WebP alongside each one and rewrites in-page
 * <img> references to it.
 *
 * Social/OG images keep their PNG URLs — some scrapers still handle WebP badly,
 * and og:image is fetched by the platform rather than the visitor, so its size
 * does not affect page performance.
 *
 * Run with: node tools/optimise-images.mjs
 */
import sharp from 'sharp';
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, extname, basename } from 'node:path';

const MAX_WIDTH = 1600;
const QUALITY = 78;

const dirs = ['public/images', 'public/images/products', 'public/images/industries', 'public/assets'];

let converted = 0;
let savedBytes = 0;

for (const dir of dirs) {
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir)) {
    const ext = extname(file).toLowerCase();
    if (ext !== '.png' && ext !== '.jpeg' && ext !== '.jpg') continue;
    const src = join(dir, file);
    const out = join(dir, `${basename(file, extname(file))}.webp`);

    const before = statSync(src).size;
    const meta = await sharp(src).metadata();

    await sharp(src)
      .resize({ width: Math.min(meta.width || MAX_WIDTH, MAX_WIDTH), withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(out);

    const after = statSync(out).size;
    savedBytes += before - after;
    converted++;
    console.log(
      `  ${file.padEnd(34)} ${(before / 1048576).toFixed(2)} MB -> ${(after / 1024).toFixed(0)} KB`
    );
  }
}

console.log(`\n${converted} images converted, ${(savedBytes / 1048576).toFixed(1)} MB saved.\n`);

/* ---- rewrite in-page <img> references to .webp ------------------------ */
const htmlFiles = [
  ...readdirSync('.').filter((f) => f.endsWith('.html')),
  ...(existsSync('products') ? readdirSync('products').map((f) => join('products', f)) : []),
  ...(existsSync('blog') ? readdirSync('blog').map((f) => join('blog', f)) : []),
];

let touched = 0;
for (const file of htmlFiles) {
  const before = readFileSync(file, 'utf8');

  // Only <img src>, CSS url() and preload hrefs — never og:image / twitter:image,
  // and never the JSON-LD "image" fields, which social and search prefer as PNG.
  let after = before.replace(/(<img\b[^>]*?\bsrc=")([^"]+?)\.png(")/g, '$1$2.webp$3');
  after = after.replace(/(url\(['"]?)(\/(?:images|assets)\/[^'")]+?)\.png(['"]?\))/g, '$1$2.webp$3');

  if (after !== before) {
    writeFileSync(file, after, 'utf8');
    touched++;
  }
}
console.log(`${touched} HTML file(s) repointed to WebP.`);

/* ---- and the stylesheet ---------------------------------------------- */
const cssBefore = readFileSync('style.css', 'utf8');
const cssAfter = cssBefore.replace(/(url\(["']?)(\/(?:images|assets)\/[^"')]+?)\.png(["']?\))/g, '$1$2.webp$3');
if (cssAfter !== cssBefore) {
  writeFileSync('style.css', cssAfter, 'utf8');
  console.log('style.css repointed to WebP.');
}
