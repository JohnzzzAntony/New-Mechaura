/**
 * Applies the audit's Critical / High / Quick-Win fixes to the hand-written pages.
 * Idempotent — safe to re-run.  node tools/apply-seo-fixes.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const log = [];
const edit = (file, fn) => {
  const before = readFileSync(file, 'utf8');
  const after = fn(before);
  if (after !== before) {
    writeFileSync(file, after, 'utf8');
    log.push(file);
  }
};

const ALL_HTML = readdirSync('.').filter((f) => f.endsWith('.html'));

/* 1. Quick win — lazy-load + intrinsic dimensions on every non-critical image.
      Prevents layout shift (CLS) and defers offscreen bytes (LCP).            */
for (const f of ALL_HTML) {
  edit(f, (s) =>
    s.replace(/<img\b([^>]*?)>/g, (m, attrs) => {
      if (/fetchpriority=|loading=/.test(attrs)) return m;
      if (/class="(logo-icon|hero-img)"/.test(attrs)) return m;
      return `<img${attrs} loading="lazy" decoding="async">`;
    })
  );
}

/* 2. Critical — remove the unverifiable aggregateRating (Google policy risk)
      and fix the non-numeric Offer price on product-detail.                   */
edit('product-detail.html', (s) => {
  s = s.replace(
    /\s*"aggregateRating":\s*\{[^}]*\},\n/,
    '\n'
  );
  s = s.replace(/"price": "Call For Quote",\n\s*/, '');
  s = s.replace(
    /"priceCurrency": "AED",/,
    '"priceCurrency": "AED",\n      "priceSpecification": {\n        "@type": "PriceSpecification",\n        "priceCurrency": "AED",\n        "valueAddedTaxIncluded": false\n      },'
  );
  return s;
});

/* 3. Quick win — homepage title was 92 chars and truncating in SERPs.         */
edit('index.html', (s) =>
  s
    .replace(
      /<title>[^<]*<\/title>/,
      '<title>Industrial Supplier UAE | Abrasive Brushes &amp; Tools | Mechaura</title>'
    )
    .replace(
      /<meta name="title" content="[^"]*">/,
      '<meta name="title" content="Industrial Supplier UAE | Abrasive Brushes &amp; Tools | Mechaura">'
    )
);

/* 4. Quick win — homepage H1 carried no searchable term.                      */
edit('index.html', (s) =>
  s.replace(
    /<h1 class="hero-title">[\s\S]*?<\/h1>/,
    '<h1 class="hero-title">Industrial Supplier in the UAE for <span class="accent-text">Abrasive Brushes &amp; Tooling.</span></h1>'
  )
);

/* 5. Quick win — blog.html carried 7 H1s; article card titles become H2.      */
edit('blog.html', (s) =>
  s
    .replace(/<h1 class="blog-card-title">/g, '<h2 class="blog-card-title">')
    .replace(/<h2 class="blog-card-title">([\s\S]*?)<\/h1>/g, '<h2 class="blog-card-title">$1</h2>')
);

/* 6. Quick win — twitter:card was missing on 6 pages.                         */
for (const f of ALL_HTML) {
  edit(f, (s) => {
    if (s.includes('name="twitter:card"')) return s;
    const og = s.match(/<meta property="og:title" content="([^"]*)">/);
    const od = s.match(/<meta property="og:description" content="([^"]*)">/);
    const oi = s.match(/<meta property="og:image" content="([^"]*)">/);
    if (!og) return s;
    const block = `
  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${og[1]}">
  <meta name="twitter:description" content="${od ? od[1] : ''}">
  <meta name="twitter:image" content="${oi ? oi[1] : 'https://mechaurainternational.com/images/logo.png'}">
`;
    return s.replace(/(<meta property="og:site_name"[^>]*>\n)/, `$1${block}`);
  });
}

/* 7. Performance — defer render-blocking third-party JS, load icon/font CSS
      asynchronously. Keeps identical behaviour, removes blocking requests.    */
for (const f of ALL_HTML) {
  edit(f, (s) =>
    s
      .replace(
        /<script src="(https:\/\/(?:cdn\.jsdelivr\.net|unpkg\.com|cdnjs\.cloudflare\.com)[^"]*)"><\/script>/g,
        '<script defer src="$1"></script>'
      )
      .replace(
        /<link rel="stylesheet" href="(https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome[^"]*)">/,
        '<link rel="preload" as="style" href="$1">\n  <link rel="stylesheet" href="$1" media="print" onload="this.media=\'all\'">\n  <noscript><link rel="stylesheet" href="$1"></noscript>'
      )
  );
}

console.log(`Updated ${new Set(log).size} file(s):`);
[...new Set(log)].forEach((f) => console.log('  ', f));
