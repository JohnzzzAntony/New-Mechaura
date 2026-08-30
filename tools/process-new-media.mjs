import fs from 'node:fs';
import path from 'node:path';

// 1. Ensure directories exist
fs.mkdirSync('public/videos', { recursive: true });
fs.mkdirSync('public/images/products', { recursive: true });

// 2. Normalize and copy video files
const pubFiles = fs.readdirSync('public');
for (const f of pubFiles) {
  if (f.endsWith('.mp4')) {
    if (f.includes('machinery_processing')) {
      fs.copyFileSync(path.join('public', f), 'public/videos/machinery-processing.mp4');
      console.log('Copied machinery-processing.mp4');
    } else if (f.includes('products_showcase_ind')) {
      fs.copyFileSync(path.join('public', f), 'public/videos/products-showcase.mp4');
      console.log('Copied products-showcase.mp4');
    } else if (f.includes('products_showcase_seq')) {
      fs.copyFileSync(path.join('public', f), 'public/videos/products-sequence.mp4');
      console.log('Copied products-sequence.mp4');
    }
  }
  if (f.startsWith('Industrial_shot_blasting_machine') && f.endsWith('.jpeg')) {
    const num = f.match(/machine(\d*)\.jpeg/);
    const n = num && num[1] ? num[1] : '1';
    fs.copyFileSync(path.join('public', f), `public/images/products/shot-blasting-machine-${n}.jpeg`);
    console.log(`Copied shot-blasting-machine-${n}.jpeg`);
  }
}

if (fs.existsSync('public/images/Industrial_shot_blasting_machine.jpeg')) {
  fs.copyFileSync('public/images/Industrial_shot_blasting_machine.jpeg', 'public/images/products/shot-blasting-machine-1.jpeg');
  console.log('Copied shot-blasting-machine-1.jpeg from images/');
}

console.log('Media normalization complete.');
