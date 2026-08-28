/**
 * Post-build verification: keyword coverage, per-page SEO signals and
 * structured-data validity across the production build in dist/.
 *
 * Run with: node tools/audit-check.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const pages = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    statSync(p).isDirectory() ? walk(p) : f.endsWith('.html') && pages.push(p);
  }
})('dist');

const real = pages.filter(
  (p) =>
    !readFileSync(p, 'utf8').includes('<title>Redirecting') &&
    // Google's ownership-verification file is intentionally bare markup.
    !/google[0-9a-f]+\.html$/.test(p) &&
    // The error page is intentionally noindex, with no canonical or social tags.
    !/[\\/]404\.html$/.test(p)
);
const corpus = real.map((p) => readFileSync(p, 'utf8')).join('\n');

const count = (needle) => {
  const re = new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  return (corpus.match(re) || []).length;
};

console.log('=== TARGET KEYWORD COVERAGE ===');
const keywords = [
  'shot blast', 'blast machine', 'blasting', 'abrasive brush', 'brush segment',
  'hydraulic hose', 'cutting tool', 'industrial supplier', 'bearing', 'bandsaw',
  'Abu Dhabi', 'Sharjah', 'Saudi Arabia', 'Oman', 'Qatar', 'Kuwait', 'Bahrain',
];
for (const k of keywords) console.log(String(count(k)).padStart(6), ' ', k);

console.log('\n=== PER-PAGE SIGNALS ===');
const problems = [];
for (const p of real) {
  const s = readFileSync(p, 'utf8');
  const title = (s.match(/<title>([^<]*)<\/title>/) || [, ''])[1];
  const desc = (s.match(/name="description" content="([^"]*)"/) || [, ''])[1];
  const h1 = (s.match(/<h1[\s>]/g) || []).length;
  const canon = /rel="canonical"/.test(s);
  const og = /property="og:image"/.test(s);
  const tw = /name="twitter:card"/.test(s);
  const imgs = (s.match(/<img\b/g) || []).length;
  const alts = (s.match(/<img\b[^>]*alt="[^"]+"/g) || []).length;
  const noAlt = imgs - alts;

  const issues = [];
  if (!title) issues.push('no title');
  else if (title.length > 65) issues.push(`title ${title.length} chars`);
  if (!desc) issues.push('no meta description');
  if (h1 !== 1) issues.push(`${h1} H1s`);
  if (!canon) issues.push('no canonical');
  if (!og) issues.push('no og:image');
  if (!tw) issues.push('no twitter:card');
  if (noAlt > 0) issues.push(`${noAlt} img without alt`);

  // Structured data must parse.
  for (const m of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch {
      issues.push('INVALID JSON-LD');
    }
  }
  // Policy violations flagged in the audit must stay gone.
  if (/aggregateRating/.test(s)) issues.push('aggregateRating present');
  if (/"price":\s*"[^0-9"]/.test(s)) issues.push('non-numeric price');

  if (issues.length) problems.push(`${p}: ${issues.join(', ')}`);
}

console.log(`real pages: ${real.length}, redirect stubs: ${pages.length - real.length}`);
console.log(problems.length ? problems.join('\n') : 'No per-page issues found.');

console.log('\n=== SCHEMA TYPE COVERAGE ===');
const types = {};
for (const m of corpus.matchAll(/"@type":\s*"([A-Za-z]+)"/g)) types[m[1]] = (types[m[1]] || 0) + 1;
console.log(
  Object.entries(types)
    .sort((a, b) => b[1] - a[1])
    .map(([t, n]) => `${String(n).padStart(4)}  ${t}`)
    .join('\n')
);

// Exit non-zero so CI actually blocks a deploy when a page has regressed —
// a missing title, canonical, alt text, a second H1 or invalid JSON-LD.
if (problems.length) {
  console.error(`\n${problems.length} page(s) failed the SEO checks.`);
  process.exit(1);
}
