/**
 * Generates the static, individually-indexable pages:
 *   /products/<slug>              8 product pages
 *   /abrasive-brushes-for-shot-blast-machines   pillar page
 *   /industrial-supplies-<city>   3 location pages
 *
 * Output is plain HTML committed to the repo — no runtime framework.
 * Run with: node tools/build-pages.mjs
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, BRAND, LEGAL, PHONE, PHONE_RAW, EMAIL, GTM, AUTHOR, products, locations, gccMarkets } from './site-data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s) => String(s).replace(/&(?!amp;|lt;|gt;|quot;|#\d+;|nbsp;|mdash;|ndash;|middot;|hellip;|rsquo;|ldquo;|rdquo;)/g, '&amp;');
const jsonLd = (o) => JSON.stringify(o, null, 2);

/* ------------------------------------------------------------------ */
/* Shared chrome                                                       */
/* ------------------------------------------------------------------ */

const gtmHead = `  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${GTM}');</script>
  <!-- End Google Tag Manager -->`;

const gtmBody = `  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM}"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->`;

function head({ title, desc, keywords, canonical, ogImage, schema, active }) {
  return `<!DOCTYPE html>
<html lang="en">

<head>
${gtmHead}
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>${esc(title)}</title>
  <meta name="title" content="${esc(title)}">
  <meta name="description" content="${esc(desc)}">
  <meta name="keywords" content="${esc(keywords)}">
  <meta name="author" content="${LEGAL}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonical}">

  <!-- Geographic (Local SEO UAE) -->
  <meta name="geo.region" content="AE-DU">
  <meta name="geo.placename" content="Dubai">
  <meta name="geo.position" content="25.2048;55.2708">
  <meta name="ICBM" content="25.2048, 55.2708">

  <link rel="icon" type="image/png" href="/images/logo.png">
  <link rel="apple-touch-icon" href="/images/logo.png">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="${SITE}${ogImage}">
  <meta property="og:site_name" content="${BRAND}">
  <meta property="og:locale" content="en_AE">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${canonical}">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${SITE}${ogImage}">

${schema.map((s) => `  <script type="application/ld+json">\n${jsonLd(s)}\n  </script>`).join('\n\n')}

  <!-- Fonts: preconnect + non-blocking load -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style"
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700;800&display=swap">
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700;800&display=swap"
    media="print" onload="this.media='all'">
  <noscript>
    <link rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700;800&display=swap">
  </noscript>

  <!-- Icons: non-blocking -->
  <link rel="preload" as="style" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
    media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"></noscript>

  <link rel="stylesheet" href="/style.css">
</head>

<body>
${gtmBody}
${nav(active)}
${mobileMenu()}

  <main id="smooth-wrapper">
    <div id="smooth-content">
`;
}

const NAV_ITEMS = [
  ['/about', 'About'],
  ['/services', 'Services'],
  ['/products', 'Products'],
  ['/sectors', 'Sectors'],
  ['/blog', 'Blog'],
  ['/contact', 'Contact'],
];

function nav(active) {
  const links = NAV_ITEMS.map(
    ([href, label]) =>
      `        <a href="${href}" class="nav-link${active === label ? ' active' : ''}" data-hover="${label}">${label}</a>`
  ).join('\n');
  return `  <!-- Navigation -->
  <nav class="navbar scrolled" aria-label="Main Navigation">
    <div class="nav-container">
      <a href="/" class="logo-link" aria-label="${BRAND} Home">
        <div class="logo-wrapper">
          <img src="/images/logo.png" alt="${BRAND} Logo" class="logo-icon" width="48" height="48">
          <div class="logo-text">
            <span class="logo-main">MECHAURA</span>
            <span class="logo-sub">INTERNATIONAL</span>
          </div>
        </div>
      </a>
      <div class="menu-links">
${links}
      </div>
      <button class="menu-btn" aria-label="Open mobile navigation menu">
        <div class="menu-line"></div>
        <div class="menu-line"></div>
      </button>
    </div>
  </nav>`;
}

function mobileMenu() {
  const links = NAV_ITEMS.map(([href, label]) => `      <a href="${href}" class="mob-link">${label}</a>`).join('\n');
  return `  <!-- Mobile Menu Overlay -->
  <div class="mob-overlay" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
    <div class="mob-close" aria-label="Close menu"><i class="fa-solid fa-times"></i></div>
    <div class="mob-links">
${links}
    </div>
  </div>`;
}

function breadcrumbNav(trail) {
  const parts = trail
    .map((t, i) =>
      i === trail.length - 1
        ? `        <span class="current">${esc(t.name)}</span>`
        : `        <a href="${t.url}">${esc(t.name)}</a>\n        <span class="separator"><i class="fa-solid fa-chevron-right"></i></span>`
    )
    .join('\n');
  return `        <nav class="breadcrumbs-nav" aria-label="Breadcrumb">
      <div class="breadcrumbs-list">
${parts}
      </div>
    </nav>`;
}

function ctaSection() {
  return `      <!-- CLOSING CTA -->
      <section class="cta-section" aria-labelledby="cta-heading">
        <div class="container">
          <div class="cta-box reveal-fade">
            <div class="cta-inner">
              <div class="cta-text">
                <span class="section-tag">Get in touch</span>
                <h2 id="cta-heading">Let's discuss your <span class="accent-text">industrial supply needs.</span></h2>
                <p>Send us the part number, the drawing, or simply the problem. Our technical desk will specify the
                  right item and come back with an itemised quote, typically inside 24 working hours.</p>
              </div>
              <div class="cta-actions">
                <a href="/contact" class="explore-btn">Request a Quote <div class="btn-arr"><i
                      class="fa-solid fa-arrow-right"></i></div></a>
                <a href="tel:${PHONE_RAW}" class="cta-ghost-btn"><i class="fa-solid fa-phone"></i> ${PHONE}</a>
              </div>
            </div>
          </div>
        </div>
      </section>
`;
}

const FOOTER_LINKS = [
  ['/about', 'About'], ['/services', 'Services'], ['/products', 'Products'], ['/sectors', 'Sectors'],
  ['/blog', 'Blog'], ['/industrial-supplies-dubai', 'Dubai'], ['/industrial-supplies-abu-dhabi', 'Abu Dhabi'],
  ['/industrial-supplies-sharjah', 'Sharjah'], ['/delivery-policy', 'Delivery Policy'],
  ['/privacy-policy', 'Privacy Policy'], ['/terms-conditions', 'Terms & Conditions'], ['/contact', 'Contact'],
];

function footer(activeBottom) {
  const links = FOOTER_LINKS.map(([h, l]) => `                <a href="${h}">${l}</a>`).join('\n');
  const mbn = [
    ['/', 'Home', 'fa-house'],
    ['/products', 'Products', 'fa-box-open'],
    ['/blog', 'Blog', 'fa-newspaper'],
    ['/contact', 'Contact', 'fa-envelope'],
  ]
    .map(
      ([h, l, i]) =>
        `    <a href="${h}" class="mbn-link${activeBottom === l ? ' active' : ''}">
      <i class="fa-solid ${i}"></i>
      <span>${l}</span>
    </a>`
    )
    .join('\n');

  return `      <!-- FOOTER -->
      <footer class="footer section" id="contact">
        <div class="container">
          <div class="footer-top">
            <h2 class="mega-text reveal-text">Let's Talk.</h2>
            <a href="mailto:${EMAIL}" class="huge-email hover-link">${EMAIL}</a>
            <div class="footer-contact-info reveal-fade">
              <a href="tel:${PHONE_RAW}" class="footer-phone hover-link">${PHONE}</a>
              <p class="footer-location">Dubai, UAE</p>
            </div>
          </div>
          <div class="footer-separator"></div>
          <div class="footer-bottom">
            <div class="fb-left">
              <div class="fb-logo">
                <img src="/images/logo.png" alt="${BRAND}" class="fb-logo-img" width="48" height="48">
                <div class="fb-logo-name">
                  <span class="fb-brand">MECHAURA</span>
                  <span class="fb-sub">INTERNATIONAL</span>
                </div>
              </div>
              <p class="fb-copy">&copy; 2026 ${LEGAL}.<br>All Rights Reserved.</p>
            </div>
            <div class="fb-center">
              <nav class="footer-nav">
${links}
              </nav>
            </div>
            <div class="fb-right">
              <p class="fb-location"><i class="fa-solid fa-location-dot"></i> Dubai, UAE</p>
              <div class="social-links">
                <a href="https://www.instagram.com/mechaura_international" target="_blank" rel="noopener" aria-label="Instagram" class="ig"><i class="fa-brands fa-instagram"></i></a>
                <a href="https://www.threads.net/@mechaura_international" target="_blank" rel="noopener" aria-label="Threads" class="threads"><i class="fa-brands fa-threads"></i></a>
                <a href="https://www.linkedin.com/company/mechaura-international" target="_blank" rel="noopener" aria-label="LinkedIn" class="linkedin"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="mailto:${EMAIL}" aria-label="Email" class="email"><i class="fa-solid fa-envelope"></i></a>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  </main>

  <a href="https://wa.me/971566202517?text=Hello%20Mechaura%20International,%20I%20would%20like%20to%20inquire%20about%20industrial%20products." class="whatsapp-float" target="_blank" rel="noopener" aria-label="Chat with ${BRAND} on WhatsApp">
    <i class="fa-brands fa-whatsapp"></i>
    <span class="whatsapp-tooltip">Chat with us on WhatsApp</span>
  </a>

  <nav class="mobile-bottom-nav">
${mbn}
  </nav>

  <script defer src="https://unpkg.com/@studio-freight/lenis@1.0.39/dist/lenis.min.js"></script>
  <script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script defer src="https://unpkg.com/split-type"></script>
  <script type="module" src="/main.js"></script>
</body>

</html>
`;
}

/* Reusable FAQ block + schema */
function faqBlock(faqs, headingId = 'faq-heading') {
  const items = faqs
    .map(
      ([q, a], i) => `            <div class="faq-item${i === 0 ? ' active' : ''} reveal-fade">
              <button class="faq-question" aria-expanded="${i === 0}">
                <span>${esc(q)}</span>
                <div class="faq-icon"><i class="fa-solid fa-chevron-down"></i></div>
              </button>
              <div class="faq-answer">
                <p>${esc(a)}</p>
              </div>
            </div>`
    )
    .join('\n\n');

  return `      <!-- FAQ -->
      <section class="faq-section" aria-labelledby="${headingId}">
        <div class="container">
          <div class="section-head centered mb-lg">
            <span class="section-tag">Common Questions</span>
            <h2 id="${headingId}" class="section-title reveal-text">Answers from our <span class="accent-text">technical desk.</span></h2>
          </div>
          <div class="faq-container">
${items}
          </div>
        </div>
      </section>
`;
}

const faqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});

const breadcrumbSchema = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.name,
    item: `${SITE}${t.url}`,
  })),
});

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: LEGAL,
  alternateName: BRAND,
  url: `${SITE}/`,
  logo: `${SITE}/images/logo.png`,
  telephone: PHONE_RAW,
  email: EMAIL,
  address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressRegion: 'Dubai', addressCountry: 'AE' },
  sameAs: [
    'https://www.instagram.com/mechaura_international',
    'https://www.threads.net/@mechaura_international',
    'https://www.linkedin.com/company/mechaura-international',
  ],
};

/* ------------------------------------------------------------------ */
/* Product pages                                                       */
/* ------------------------------------------------------------------ */

function productPage(pr) {
  const url = `${SITE}/products/${pr.slug}`;
  const trail = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: pr.name, url: `/products/${pr.slug}` },
  ];

  const views = [
    { src: pr.hero, label: 'Product photograph' },
    ...pr.photos.map((src, i) => ({ src, label: `Detail view ${i + 2}` })),
    { src: `/images/products/${pr.legacyId}-schematic.svg`, label: 'Technical schematic' },
    { src: `/images/products/${pr.legacyId}-specifications.svg`, label: 'Range & specification' },
    { src: `/images/products/${pr.legacyId}-applications.svg`, label: 'Applications' },
  ];

  const thumbs = views
    .map(
      (v, i) => `              <button type="button" class="pd-thumb${i === 0 ? ' active' : ''}" data-src="${v.src}"
                data-label="${esc(v.label)}" aria-label="${esc(pr.name)} — ${esc(v.label)}">
                <img src="${v.src}" alt="${esc(pr.name)} — ${esc(v.label)}" loading="lazy" width="160" height="120">
              </button>`
    )
    .join('\n');

  const specRows = pr.specs
    .map(([k, v]) => `              <tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`)
    .join('\n');

  const appItems = pr.applications.map((a) => `              <li><i class="fa-solid fa-check"></i> ${esc(a)}</li>`).join('\n');

  const related = products
    .filter((p) => p.slug !== pr.slug)
    .slice(0, 4)
    .map(
      (p) => `            <a href="/products/${p.slug}" class="rel-card">
              <div class="rel-img"><img src="${p.hero}" alt="${esc(p.name)}" loading="lazy" width="320" height="200"></div>
              <span class="rel-cat">${esc(p.category)}</span>
              <h3>${esc(p.name)}</h3>
            </a>`
    )
    .join('\n');

  const schema = [
    breadcrumbSchema(trail),
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: pr.name,
      image: [`${SITE}${pr.hero}`],
      description: pr.metaDesc,
      category: pr.category,
      brand: { '@type': 'Brand', name: BRAND },
      manufacturer: { '@type': 'Organization', name: LEGAL },
      additionalProperty: pr.specs.map(([k, v]) => ({ '@type': 'PropertyValue', name: k, value: v })),
      offers: {
        '@type': 'Offer',
        url,
        priceCurrency: 'AED',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'AED',
          valueAddedTaxIncluded: false,
        },
        seller: { '@type': 'Organization', name: LEGAL, url: `${SITE}/` },
        areaServed: [
          { '@type': 'Country', name: 'United Arab Emirates' },
          ...gccMarkets.map((m) => ({ '@type': 'Country', name: m })),
        ],
      },
    },
    faqSchema(pr.faqs),
    orgSchema,
  ];

  return (
    head({
      title: pr.title,
      desc: pr.metaDesc,
      keywords: pr.keywords,
      canonical: url,
      ogImage: pr.hero,
      schema,
      active: 'Products',
    }) +
    `      <section class="product-page section">
        <div class="container">
${breadcrumbNav(trail)}

          <div class="pd-grid">
            <div class="detail-img-wrap">
              <div class="pd-gallery">
                <div class="pd-image-box">
                  <img id="product-img" src="${pr.hero}" alt="${esc(pr.name)} — product photograph"
                    width="800" height="600" fetchpriority="high">
                </div>
                <div class="pd-thumbs" id="product-thumbs" aria-label="Product image views">
${thumbs}
                </div>
                <span class="pd-view-label" id="product-view-label">Product photograph &middot; 1 / ${views.length}</span>
              </div>
            </div>

            <div class="pd-info-box">
              <span class="pd-category">${esc(pr.category)}</span>
              <h1>${esc(pr.name)} in the UAE</h1>
              <p class="pd-description">${esc(pr.lead)}</p>

              <div class="pd-definition">
                <h2>What ${esc(pr.name.toLowerCase())} are</h2>
                <p>${esc(pr.definition)}</p>
              </div>

              <h2 class="pd-sub">Technical specification</h2>
              <table class="spec-table">
                <caption class="visually-hidden">Technical specification for ${esc(pr.name)}</caption>
                <tbody>
${specRows}
                </tbody>
              </table>

              <h2 class="pd-sub">Typical applications</h2>
              <ul class="app-list">
${appItems}
              </ul>

              <div class="pd-actions">
                <a href="/contact" class="explore-btn">Request a Quote <div class="btn-arr"><i class="fa-solid fa-arrow-right"></i></div></a>
                <a href="tel:${PHONE_RAW}" class="cta-ghost-btn"><i class="fa-solid fa-phone"></i> ${PHONE}</a>
              </div>
              <p class="pd-note"><i class="fa-solid fa-truck-fast accent-text"></i> Dispatched across Dubai, Abu Dhabi,
                Sharjah and the wider UAE, with export to Saudi Arabia, Oman, Qatar, Kuwait and Bahrain.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- RELATED PRODUCTS -->
      <section class="section related-section" aria-labelledby="related-heading">
        <div class="container">
          <div class="section-head mb-lg">
            <span class="section-tag">More from our range</span>
            <h2 id="related-heading" class="section-title">Related <span class="accent-text">products.</span></h2>
          </div>
          <div class="rel-grid">
${related}
          </div>
        </div>
      </section>

` +
    faqBlock(pr.faqs, `faq-${pr.slug}`) +
    ctaSection() +
    footer('Products')
  );
}

/* ------------------------------------------------------------------ */
/* Pillar page — the SERP gap                                          */
/* ------------------------------------------------------------------ */

function pillarPage() {
  const slug = 'abrasive-brushes-for-shot-blast-machines';
  const url = `${SITE}/${slug}`;
  const title = 'Abrasive Brushes for Shot Blast Machines | UAE Supplier';
  const desc =
    'Replacement brush segments and blow-off brushes for shot blast and wheel blast machines in the UAE. Built to drawing for any frame, with fill, trim and backing matched to your machine.';
  const trail = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: 'Abrasive Brushes for Shot Blast Machines', url: `/${slug}` },
  ];

  const faqs = [
    [
      'What does the brush on a shot blast machine actually do?',
      'On most wheel blast and plate blast machines the brush sits at the exit and performs blow-off: it sweeps residual steel shot, grit and dust off the workpiece before it leaves the cabinet. Without it, abrasive is carried out of the machine, which loses expensive media, contaminates downstream coating and creates a housekeeping hazard.',
    ],
    [
      'Can you supply brushes for any make of blast machine?',
      'Yes. Blast machine brushes are almost never a catalogue item, because every manufacturer uses its own segment length, backing profile and mounting centres. Send the dimensions, a drawing, or simply the worn segment, and we build a replacement to match.',
    ],
    [
      'Which fill material is best for blast machine blow-off?',
      'For general steel plate and section, crimped steel wire gives the aggressive sweep needed to dislodge trapped shot. Where the substrate must not be marked — non-ferrous, pre-coated or thin gauge material — use nylon or abrasive nylon instead, which clears media without scoring the surface.',
    ],
    [
      'How do I know when blast machine brushes need replacing?',
      'The practical indicator is media carry-over: when you start finding shot on the conveyor beyond the cabinet or in the paint area, the trim has worn past its effective contact length. Measuring trim height against the original dimension at each shift change gives you a predictable replacement interval.',
    ],
    [
      'Do you supply the abrasive media as well as the brushes?',
      'Our focus is the brush consumables and the surrounding wear parts — segments, backing channel, mounting hardware, bearings and drive components. We work alongside your existing media supplier rather than replacing them.',
    ],
    [
      'How quickly can replacement segments be supplied in the UAE?',
      'Where the profile matches a standard backing we can often build within a few working days. Fully bespoke segments, or those needing a non-standard channel, typically run two to four weeks. If the machine is down, tell us — we will quote a short-run interim set alongside the full order.',
    ],
  ];

  const schema = [
    breadcrumbSchema(trail),
    faqSchema(faqs),
    orgSchema,
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Abrasive Brushes for Shot Blast Machines: Selection and Replacement Guide',
      description: desc,
      image: `${SITE}/images/sp.png`,
      datePublished: '2026-08-26',
      dateModified: '2026-08-26',
      author: { '@type': 'Organization', name: AUTHOR.name, url: `${SITE}/about` },
      publisher: {
        '@type': 'Organization',
        name: LEGAL,
        logo: { '@type': 'ImageObject', url: `${SITE}/images/logo.png` },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Custom abrasive brush segment manufacture for shot blast machines',
      provider: { '@type': 'Organization', name: LEGAL, url: `${SITE}/` },
      areaServed: [
        { '@type': 'Country', name: 'United Arab Emirates' },
        ...gccMarkets.map((m) => ({ '@type': 'Country', name: m })),
      ],
    },
  ];

  const compareRows = [
    ['Crimped steel wire', 'Steel plate, structural section, heavy scale', 'Aggressive sweep, dislodges trapped shot', 'Can mark soft or coated substrate'],
    ['Abrasive nylon (SiC)', 'Mixed substrate, light descaling in the same pass', 'Cuts as it sweeps, non-sparking', 'Higher cost per segment'],
    ['Plain nylon', 'Non-ferrous, pre-coated, thin gauge', 'No surface marking, quiet running', 'Less effective on heavy carry-over'],
    ['Tampico / natural', 'Delicate finishes, wet applications', 'Very soft, absorbs fluid', 'Short life in abrasive service'],
  ]
    .map(
      ([a, b, c, d]) =>
        `              <tr><td><strong>${esc(a)}</strong></td><td>${esc(b)}</td><td>${esc(c)}</td><td>${esc(d)}</td></tr>`
    )
    .join('\n');

  return (
    head({
      title,
      desc,
      keywords:
        'Abrasive Brush Shot Blast Machine, Blast Machine Brush UAE, Shot Blast Machine Brush Dubai, Blow Off Brush UAE, Wheel Blast Machine Brush, Blast Machine Spares UAE, Brush Segment Blast Machine',
      canonical: url,
      ogImage: '/images/sp.png',
      schema,
      active: 'Products',
    }) +
    `      <section class="section pillar-hero">
        <div class="container">
${breadcrumbNav(trail)}
          <div class="section-head">
            <span class="section-tag">Blast Machine Consumables</span>
            <h1 class="section-title">Abrasive Brushes for <span class="accent-text">Shot Blast Machines</span></h1>
            <p class="section-desc">Replacement brush segments, blow-off brushes and backing channel for shot blast,
              wheel blast and plate blast machines — built to your machine's drawing and supplied across the UAE and GCC.</p>
          </div>
          <div class="pillar-actions">
            <a href="/contact" class="explore-btn">Send us your segment drawing <div class="btn-arr"><i class="fa-solid fa-arrow-right"></i></div></a>
            <a href="tel:${PHONE_RAW}" class="cta-ghost-btn"><i class="fa-solid fa-phone"></i> ${PHONE}</a>
          </div>
        </div>
      </section>

      <section class="section article-body">
        <div class="container narrow">
          <p class="lede">If you run a shot blast machine, the brush is the part nobody specifies until it fails.
            It is rarely a catalogue item, the original supplier may no longer stock it, and when it wears out the
            machine keeps running while abrasive media walks out of the cabinet on every part you process.</p>

          <h2>Why blast machine brushes are almost always custom</h2>
          <p>Shot blasting equipment is not standardised. Wheel blast, plate blast and tumble blast machines are built by dozens of manufacturers, and each uses its
            own segment length, backing channel profile and mounting centres. There is no industry standard. That is why
            searching for a part number rarely works, and why the practical route is to build from the worn segment or a
            dimensioned drawing.</p>
          <p>We manufacture brush segments to that drawing: you specify — or we measure — the backing width, overall
            length, trim height, mounting hole centres and fill material, and the replacement drops straight into the
            existing frame.</p>

          <h2>What the brush is doing in the machine</h2>
          <p>On most plate and section blast lines the brush performs <strong>blow-off</strong>: it sits at the cabinet
            exit and sweeps residual steel shot, grit and dust from the workpiece before it reaches the conveyor. In continuous shot blasting lines this is the difference between a clean part and one that carries abrasive into the paint shop. On some
            designs a second brush handles the underside, and on tumble machines rotary brushes clear media from complex
            geometry as the load discharges.</p>
          <p>Three things go wrong when the brush is worn or wrongly specified:</p>
          <ul class="app-list">
            <li><i class="fa-solid fa-check"></i> <strong>Media loss.</strong> Steel shot carried out of the cabinet is expensive, and it does not come back.</li>
            <li><i class="fa-solid fa-check"></i> <strong>Coating defects.</strong> Residual grit under paint or galvanising causes inclusions and adhesion failure.</li>
            <li><i class="fa-solid fa-check"></i> <strong>Housekeeping and safety.</strong> Loose shot on a shop floor is a slip hazard and it migrates into bearings and drives.</li>
          </ul>

          <h2>Choosing the fill material</h2>
          <p>Fill choice is driven by the substrate, not by the machine. The table below covers the four we supply most often.</p>
          <div class="table-wrap">
            <table class="spec-table compare-table">
              <caption>Blast machine brush fill materials compared</caption>
              <thead>
                <tr><th scope="col">Fill material</th><th scope="col">Best for</th><th scope="col">Advantage</th><th scope="col">Trade-off</th></tr>
              </thead>
              <tbody>
${compareRows}
              </tbody>
            </table>
          </div>

          <h2>Specifying a replacement segment</h2>
          <p>To quote accurately we need five dimensions and one decision. The dimensions are backing width, backing
            length, trim height, mounting hole diameter and hole centres. The decision is fill material, using the table
            above. If you would rather not measure, send us the worn segment and we will take the dimensions from it.</p>
          <p>Where a machine is already down, tell us at the point of enquiry. We will normally quote a short-run interim
            set to get you back into production alongside the full replacement order.</p>

          <h2>Related consumables we supply</h2>
          <p>Blast machine maintenance rarely stops at the brush. We also supply the surrounding wear and drive
            components — see <a href="/products/industrial-bearings">industrial bearings</a> for conveyor and wheel
            assemblies, <a href="/products/industrial-air-filters">industrial air filters</a> for the dust collection
            plant, and <a href="/products/abrasive-brushes">abrasive removal brush segments</a> for deburring and weld
            cleaning elsewhere in the workshop.</p>

          <div class="author-box">
            <div class="author-avatar">M</div>
            <div>
              <div class="author-name">${AUTHOR.name}</div>
              <div class="author-role">${AUTHOR.role}</div>
              <p>${AUTHOR.bio}</p>
              <p class="author-date">Published 26 August 2026 &middot; Last reviewed 26 August 2026</p>
            </div>
          </div>
        </div>
      </section>

` +
    faqBlock(faqs, 'faq-blast') +
    ctaSection() +
    footer('Products')
  );
}

/* ------------------------------------------------------------------ */
/* Location pages                                                      */
/* ------------------------------------------------------------------ */

function locationPage(loc) {
  const slug = `industrial-supplies-${loc.slug}`;
  const url = `${SITE}/${slug}`;
  const trail = [
    { name: 'Home', url: '/' },
    { name: `Industrial Supplier in ${loc.city}`, url: `/${slug}` },
  ];

  const faqs = [
    [
      `Do you deliver industrial supplies across ${loc.city}?`,
      `Yes. We dispatch to all industrial areas of ${loc.city}, including ${loc.areas.slice(0, 3).join(', ')}. Stock lines ordered before midday are generally delivered the same working day, and we schedule recurring deliveries for customers with regular consumable requirements.`,
    ],
    [
      `What industrial products do you supply in ${loc.city}?`,
      `Our range covers abrasive removal brush segments, hydraulic hoses and fittings, industrial bearings, bandsaw blades, CNC cutting tools, elevator accessories, industrial air filters and hydraulic pumps. Where an item sits outside the standard catalogue we source or manufacture it to drawing.`,
    ],
    [
      `Can I get a quote for a bulk industrial supply contract in ${loc.city}?`,
      `Yes. Send your consumable list with annual or quarterly volumes and we will return itemised pricing with lead times per line. For customers on scheduled supply we hold agreed stock levels so that fast-moving items are available on call-off.`,
    ],
    [
      `Are you an authorised industrial supplier in the UAE?`,
      `${LEGAL} is a UAE-registered FZE LLC trading and distribution company supplying industrial consumables and equipment. We supply genuine brand stock alongside dimensional equivalents, and state clearly on every quotation which is which.`,
    ],
  ];

  const areaItems = loc.areas.map((a) => `              <li><i class="fa-solid fa-location-dot"></i> ${esc(a)}</li>`).join('\n');
  const prodCards = products
    .map(
      (p) => `            <a href="/products/${p.slug}" class="rel-card">
              <div class="rel-img"><img src="${p.hero}" alt="${esc(p.name)} supplied in ${esc(loc.city)}" loading="lazy" width="320" height="200"></div>
              <span class="rel-cat">${esc(p.category)}</span>
              <h3>${esc(p.name)}</h3>
            </a>`
    )
    .join('\n');

  const schema = [
    breadcrumbSchema(trail),
    faqSchema(faqs),
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: `${LEGAL} — ${loc.city}`,
      description: loc.metaDesc,
      url,
      telephone: PHONE_RAW,
      email: EMAIL,
      image: `${SITE}/images/logo.png`,
      priceRange: '$$',
      address: { '@type': 'PostalAddress', addressLocality: loc.city, addressRegion: loc.region, addressCountry: 'AE' },
      areaServed: loc.areas.map((a) => ({ '@type': 'Place', name: `${a}, ${loc.city}` })),
      parentOrganization: { '@type': 'Organization', name: LEGAL, url: `${SITE}/` },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '08:00',
          closes: '18:00',
        },
      ],
    },
  ];

  return (
    head({
      title: loc.title,
      desc: loc.metaDesc,
      keywords: loc.keywords,
      canonical: url,
      ogImage: '/assets/hero_equipment.png',
      schema,
      active: null,
    }) +
    `      <section class="section pillar-hero">
        <div class="container">
${breadcrumbNav(trail)}
          <div class="section-head">
            <span class="section-tag">${esc(loc.city)}, United Arab Emirates</span>
            <h1 class="section-title">Industrial Supplier in <span class="accent-text">${esc(loc.city)}</span></h1>
            <p class="section-desc">${esc(loc.intro)}</p>
          </div>
          <div class="pillar-actions">
            <a href="/contact" class="explore-btn">Request a Quote <div class="btn-arr"><i class="fa-solid fa-arrow-right"></i></div></a>
            <a href="tel:${PHONE_RAW}" class="cta-ghost-btn"><i class="fa-solid fa-phone"></i> ${PHONE}</a>
          </div>
        </div>
      </section>

      <section class="section article-body">
        <div class="container narrow">
          <h2>How we serve ${esc(loc.city)}</h2>
          <p>${esc(loc.focus)}</p>

          <h2>Industrial areas we cover</h2>
          <ul class="area-list">
${areaItems}
          </ul>

          <h2>Who we supply here</h2>
          <p>${esc(loc.sectors)}</p>

          <h2>Beyond ${esc(loc.city)}</h2>
          <p>We also serve
            ${locations
              .filter((l) => l.slug !== loc.slug)
              .map((l) => `<a href="/industrial-supplies-${l.slug}">${l.city}</a>`)
              .join(' and ')}, the northern Emirates, and export across the GCC to
            ${gccMarkets.join(', ')}.</p>
        </div>
      </section>

      <section class="section related-section" aria-labelledby="range-heading">
        <div class="container">
          <div class="section-head mb-lg">
            <span class="section-tag">Our Range</span>
            <h2 id="range-heading" class="section-title">Products supplied in <span class="accent-text">${esc(loc.city)}.</span></h2>
          </div>
          <div class="rel-grid">
${prodCards}
          </div>
        </div>
      </section>

` +
    faqBlock(faqs, `faq-${loc.slug}`) +
    ctaSection() +
    footer(null)
  );
}

/* ------------------------------------------------------------------ */

let count = 0;
const write = (rel, html) => {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html, 'utf8');
  count++;
  console.log('  generated', rel);
};

console.log('Product pages:');
products.forEach((p) => write(`products/${p.slug}.html`, productPage(p)));

console.log('Pillar page:');
write('abrasive-brushes-for-shot-blast-machines.html', pillarPage());

console.log('Location pages:');
locations.forEach((l) => write(`industrial-supplies-${l.slug}.html`, locationPage(l)));

console.log(`\n${count} pages generated.`);
