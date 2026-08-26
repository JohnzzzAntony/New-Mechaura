/**
 * Regenerates public/sitemap.xml from the live page set.
 * Run with: node tools/build-sitemap.mjs
 */
import { writeFileSync } from 'node:fs';
import { SITE, products, locations } from './site-data.mjs';

const TODAY = '2026-08-26';

const articleSlugs = [
  'abrasive-removal-brush-segments-guide',
  'hydraulic-hose-failure-prevention',
  'elevator-spares-inspection-checklist',
  'precision-vs-standard-bearings',
  'bimetal-vs-carbide-bandsaw-blades',
  'industrial-air-filters-arid-climates',
];

const urls = [
  ['/', '1.0', 'weekly'],
  ['/products', '0.9', 'weekly'],
  ['/abrasive-brushes-for-shot-blast-machines', '0.9', 'monthly'],
  ...products.map((p) => [`/products/${p.slug}`, '0.9', 'weekly']),
  ...locations.map((l) => [`/industrial-supplies-${l.slug}`, '0.8', 'monthly']),
  ['/services', '0.8', 'monthly'],
  ['/sectors', '0.8', 'monthly'],
  ['/contact', '0.8', 'monthly'],
  ['/blog', '0.85', 'weekly'],
  ...articleSlugs.map((s) => [`/blog/${s}`, '0.75', 'monthly']),
  ['/about', '0.7', 'monthly'],
  ['/delivery-policy', '0.4', 'yearly'],
  ['/privacy-policy', '0.3', 'yearly'],
  ['/terms-conditions', '0.3', 'yearly'],
];

const imageFor = (loc) => {
  if (loc === '/') return { url: '/images/logo.png', title: 'Mechaura International UAE' };
  const p = products.find((pr) => loc === `/products/${pr.slug}`);
  if (p) return { url: p.hero, title: p.name };
  if (loc === '/abrasive-brushes-for-shot-blast-machines')
    return { url: '/images/sp.png', title: 'Abrasive brushes for shot blast machines' };
  return null;
};

const body = urls
  .map(([loc, priority, freq]) => {
    const img = imageFor(loc);
    return `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>${
      img
        ? `
    <image:image>
      <image:loc>${SITE}${img.url}</image:loc>
      <image:title>${img.title.replace(/&/g, '&amp;')}</image:title>
    </image:image>`
        : ''
    }
  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`;

writeFileSync('public/sitemap.xml', xml, 'utf8');
console.log(`sitemap.xml written with ${urls.length} URLs`);
