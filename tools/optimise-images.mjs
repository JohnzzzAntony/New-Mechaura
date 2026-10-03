/**
 * Image optimisation for Core Web Vitals.
 *
 * The source PNGs run 2–4 MB each, which destroys LCP on a photo-led design.
 * This script writes a resized WebP alongside each one; pages reference the
 * WebP directly (tools/build-site.mjs). Up-to-date WebPs are skipped.
 *
 * Social/OG images keep their PNG URLs — some scrapers still handle WebP badly,
 * and og:image is fetched by the platform rather than the visitor, so its size
 * does not affect page performance.
 *
 * Run with: node tools/optimise-images.mjs
 */
import sharp from 'sharp';
import { readdirSync, statSync, existsSync } from 'node:fs';
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
    if (/-og.[a-z]+$/.test(file)) continue; // social-share images stay JPEG/PNG
    const src = join(dir, file);
    const out = join(dir, `${basename(file, extname(file))}.webp`);
    if (existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs) continue;

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
