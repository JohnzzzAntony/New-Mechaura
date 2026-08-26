/**
 * Extracts the six guides out of blog.html's `articlesData` JavaScript object
 * and publishes them as real, crawlable pages at /blog/<slug>.
 *
 * The modal on /blog is left in place for UX, but every card now also links to
 * a canonical article URL that search and AI crawlers can actually read.
 *
 * Run with: node tools/build-articles.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { SITE, BRAND, LEGAL, PHONE, PHONE_RAW, EMAIL, GTM, GOOGLE_TAG, AUTHOR, gccMarkets } from './site-data.mjs';
import { articles } from './article-content.mjs';

const blog = readFileSync('blog.html', 'utf8');

/* ---- render the expanded body from structured blocks ------------------ */
function renderBlocks(blocks) {
  return blocks
    .map(([type, val]) => {
      switch (type) {
        case 'h2':
          return `            <h2>${val}</h2>`;
        case 'h3':
          return `            <h3>${val}</h3>`;
        case 'p':
          return `            <p>${val}</p>`;
        case 'ul':
          return `            <ul>\n${val.map((li) => `              <li>${li}</li>`).join('\n')}\n            </ul>`;
        case 'ol':
          return `            <ol>\n${val.map((li) => `              <li>${li}</li>`).join('\n')}\n            </ol>`;
        case 'callout':
          return `            <div class="article-tldr-box"><p>${val}</p></div>`;
        case 'table':
          return `            <table>
              <thead><tr>${val.head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead>
              <tbody>
${val.rows.map((r) => `                <tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`)).join('')}</tr>`).join('\n')}
              </tbody>
            </table>`;
        case 'faq':
          return val
            .map(
              ([q, a]) => `            <h3>${q}</h3>\n            <p>${a}</p>`
            )
            .join('\n');
        default:
          return '';
      }
    })
    .join('\n\n');
}

/** Q&A pairs from the structured content drive FAQPage schema. */
function faqsFrom(blocks) {
  const block = blocks.find(([t]) => t === 'faq');
  return block ? block[1] : [];
}

/* ---- metadata per article -------------------------------------------- */
const META = {
  'article-1': {
    slug: 'abrasive-removal-brush-segments-guide',
    title: 'Abrasive Brush Segments: UAE Selection Guide',
    desc: 'How to select silicon carbide, ceramic and wire abrasive brush segments for deburring, oxide removal and weld polishing in UAE machine shops.',
    keywords: 'Abrasive Brush Segments UAE, Deburring Brush Dubai, Silicon Carbide Brush UAE, Brush Selection Guide',
    image: '/images/brush-product.png',
    category: 'Surface Treatment',
    readTime: '7 min read',
    related: '/products/abrasive-brushes',
    relatedName: 'Abrasive Removal Brush Segments',
  },
  'article-2': {
    slug: 'hydraulic-hose-failure-prevention',
    title: 'Hydraulic Hose Failure Prevention | UAE',
    desc: 'Wire-braided versus spiral-reinforced hydraulic hose selection to prevent blowouts, thermal hardening and fluid degradation in Middle East heat.',
    keywords: 'Hydraulic Hose Failure UAE, Hose Pressure Safety Dubai, 4SP vs 2SN, Hydraulic Hose Maintenance UAE',
    image: '/images/hydraulic-hose.png',
    category: 'Fluid Power',
    readTime: '8 min read',
    related: '/products/hydraulic-hoses',
    relatedName: 'Hydraulic Hoses & Fittings',
  },
  'article-3': {
    slug: 'elevator-spares-inspection-checklist',
    title: 'Elevator Spares Inspection Checklist | Dubai',
    desc: 'A maintenance engineer’s guide to door rollers, guide shoe liners, governor switches and traction spares for UAE lift compliance.',
    keywords: 'Elevator Spares Dubai, Lift Inspection Checklist UAE, Guide Shoe Liner Dubai, Elevator Maintenance UAE',
    image: '/images/elevator.png',
    category: 'Vertical Transport',
    readTime: '6 min read',
    related: '/products/elevator-accessories',
    relatedName: 'Elevator Accessories & Spares',
  },
  'article-4': {
    slug: 'precision-vs-standard-bearings',
    title: 'Precision vs Standard Bearings Compared',
    desc: 'Selecting spherical roller, deep groove and angular contact bearings for high radial loads, sand ingress and continuous production duty.',
    keywords: 'Precision Bearings UAE, Bearing Selection Dubai, Spherical Roller Bearing UAE, Bearing Tolerance Class',
    image: '/images/bearings.png',
    category: 'Motion Control',
    readTime: '6 min read',
    related: '/products/industrial-bearings',
    relatedName: 'Industrial Bearings',
  },
  'article-5': {
    slug: 'bimetal-vs-carbide-bandsaw-blades',
    title: 'Bi-Metal vs Carbide Bandsaw Blades Guide',
    desc: 'How variable tooth geometry, blade tension and coolant flow reduce blade stripping and deliver clean cut squareness on steel and exotic alloys.',
    keywords: 'Bandsaw Blade Selection UAE, Bi-Metal vs Carbide Blade, TPI Guide Dubai, Blade Stripping Causes',
    image: '/images/bandsaw.png',
    category: 'Cutting Tools',
    readTime: '5 min read',
    related: '/products/bandsaw-blades',
    relatedName: 'Bandsaw Blades',
  },
  'article-6': {
    slug: 'industrial-air-filters-arid-climates',
    title: 'Industrial Air Filters for Arid Climates',
    desc: 'Multi-stage coalescence, depth filtration and micron ratings that protect heavy machinery from sand ingress in Gulf operating conditions.',
    keywords: 'Industrial Air Filter UAE, Sand Ingress Protection Dubai, Coalescer Filter UAE, Filter Micron Rating',
    image: '/images/industrial_air_filters.png',
    category: 'Filtration Systems',
    readTime: '5 min read',
    related: '/products/industrial-air-filters',
    relatedName: 'Industrial Air Filters',
  },
};

/* ---- extract each template literal ----------------------------------- */
function extract(key) {
  const start = blog.indexOf(`'${key}': \``);
  if (start === -1) throw new Error(`article ${key} not found`);
  const from = blog.indexOf('`', start) + 1;
  const to = blog.indexOf('`', from);
  return blog.slice(from, to).trim();
}

/* ---- page shell ------------------------------------------------------ */
const NAV = [['/about','About'],['/services','Services'],['/products','Products'],['/sectors','Sectors'],['/blog','Blog'],['/contact','Contact']];

function page(key, html) {
  const m = META[key];
  const url = `${SITE}/blog/${m.slug}`;

  // Headline comes from the original guide; body comes from the expanded content.
  const h2 = html.match(/<h2>([\s\S]*?)<\/h2>/);
  const headline = h2 ? h2[1].replace(/<[^>]*>/g, '').trim() : m.title;

  const expanded = articles[m.slug];
  if (!expanded) throw new Error(`no expanded content for ${m.slug}`);

  const bodyHtml = `            <div class="article-tldr-box">
              <strong>In short</strong>
              <p>${expanded.tldr}</p>
            </div>

${renderBlocks(expanded.blocks)}`;

  const faqPairs = faqsFrom(expanded.blocks);

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Knowledge Base', item: `${SITE}/blog` },
        { '@type': 'ListItem', position: 3, name: headline, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline,
      description: m.desc,
      image: `${SITE}${m.image}`,
      datePublished: '2026-08-01',
      dateModified: '2026-08-26',
      author: { '@type': 'Organization', name: AUTHOR.name, url: `${SITE}/about` },
      publisher: {
        '@type': 'Organization',
        name: LEGAL,
        logo: { '@type': 'ImageObject', url: `${SITE}/images/logo.png` },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      articleSection: m.category,
      inLanguage: 'en-AE',
    },
  ];

  if (faqPairs.length) {
    schema.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqPairs.map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    });
  }

  const navLinks = NAV.map(([h, l]) => `        <a href="${h}" class="nav-link${l === 'Blog' ? ' active' : ''}" data-hover="${l}">${l}</a>`).join('\n');
  const mobLinks = NAV.map(([h, l]) => `      <a href="${h}" class="mob-link">${l}</a>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">

<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '${GOOGLE_TAG}');
  </script>
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${GTM}');</script>
  <!-- End Google Tag Manager -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>${m.title}</title>
  <meta name="title" content="${m.title}">
  <meta name="description" content="${m.desc}">
  <meta name="keywords" content="${m.keywords}">
  <meta name="author" content="${AUTHOR.name}, ${LEGAL}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${url}">

  <meta name="geo.region" content="AE-DU">
  <meta name="geo.placename" content="Dubai">

  <link rel="icon" type="image/png" href="/images/logo.png">
  <link rel="apple-touch-icon" href="/images/logo.png">

  <meta property="og:type" content="article">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${m.title}">
  <meta property="og:description" content="${m.desc}">
  <meta property="og:image" content="${SITE}${m.image}">
  <meta property="og:site_name" content="${BRAND}">
  <meta property="article:published_time" content="2026-08-01">
  <meta property="article:modified_time" content="2026-08-26">
  <meta property="article:section" content="${m.category}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${m.title}">
  <meta name="twitter:description" content="${m.desc}">
  <meta name="twitter:image" content="${SITE}${m.image}">

${schema.map((s) => `  <script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n  </script>`).join('\n\n')}

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700;800&display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700;800&display=swap" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700;800&display=swap"></noscript>

  <link rel="preload" as="style" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"></noscript>

  <link rel="stylesheet" href="/style.css">
</head>

<body>
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM}"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

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
${navLinks}
      </div>
      <button class="menu-btn" aria-label="Open mobile navigation menu">
        <div class="menu-line"></div>
        <div class="menu-line"></div>
      </button>
    </div>
  </nav>

  <div class="mob-overlay" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
    <div class="mob-close" aria-label="Close menu"><i class="fa-solid fa-times"></i></div>
    <div class="mob-links">
${mobLinks}
    </div>
  </div>

  <main id="smooth-wrapper">
    <div id="smooth-content">

      <article class="section article-page">
        <div class="container narrow">
          <nav class="breadcrumbs-nav" aria-label="Breadcrumb">
            <div class="breadcrumbs-list">
              <a href="/">Home</a>
              <span class="separator"><i class="fa-solid fa-chevron-right"></i></span>
              <a href="/blog">Knowledge Base</a>
              <span class="separator"><i class="fa-solid fa-chevron-right"></i></span>
              <span class="current">${m.category}</span>
            </div>
          </nav>

          <span class="section-tag">${m.category}</span>
          <h1 class="article-h1">${headline}</h1>

          <div class="article-meta">
            <span><i class="fa-regular fa-calendar"></i> <time datetime="2026-08-01">August 2026</time></span>
            <span><i class="fa-regular fa-clock"></i> ${m.readTime}</span>
            <span><i class="fa-regular fa-user"></i> ${AUTHOR.name}</span>
          </div>

          <figure class="article-hero-img">
            <img src="${m.image}" alt="${headline}" width="1200" height="630" fetchpriority="high">
          </figure>

          <div class="article-content">
${bodyHtml}
          </div>

          <div class="author-box">
            <div class="author-avatar">M</div>
            <div>
              <div class="author-name">${AUTHOR.name}</div>
              <div class="author-role">${AUTHOR.role}</div>
              <p>${AUTHOR.bio}</p>
              <p class="author-date">Published 1 August 2026 &middot; Last reviewed 26 August 2026</p>
            </div>
          </div>

          <div class="article-next">
            <span class="pi-label">Related product</span>
            <a href="${m.related}" class="explore-btn">${m.relatedName} <div class="btn-arr"><i class="fa-solid fa-arrow-right"></i></div></a>
          </div>
        </div>
      </article>

      <section class="cta-section" aria-labelledby="cta-heading">
        <div class="container">
          <div class="cta-box reveal-fade">
            <div class="cta-inner">
              <div class="cta-text">
                <span class="section-tag">Get in touch</span>
                <h2 id="cta-heading">Need help specifying the <span class="accent-text">right product?</span></h2>
                <p>Our technical desk will match the grade, size and standard to your application and come back with an
                  itemised quote, typically inside 24 working hours.</p>
              </div>
              <div class="cta-actions">
                <a href="/contact" class="explore-btn">Request a Quote <div class="btn-arr"><i class="fa-solid fa-arrow-right"></i></div></a>
                <a href="tel:${PHONE_RAW}" class="cta-ghost-btn"><i class="fa-solid fa-phone"></i> ${PHONE}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer class="footer section">
        <div class="container">
          <div class="footer-top">
            <h2 class="mega-text">Let's Talk.</h2>
            <a href="mailto:${EMAIL}" class="huge-email hover-link">${EMAIL}</a>
            <div class="footer-contact-info">
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
                <a href="/about">About</a>
                <a href="/services">Services</a>
                <a href="/products">Products</a>
                <a href="/sectors">Sectors</a>
                <a href="/blog">Blog</a>
                <a href="/industrial-supplies-dubai">Dubai</a>
                <a href="/industrial-supplies-abu-dhabi">Abu Dhabi</a>
                <a href="/industrial-supplies-sharjah">Sharjah</a>
                <a href="/delivery-policy">Delivery Policy</a>
                <a href="/privacy-policy">Privacy Policy</a>
                <a href="/terms-conditions">Terms &amp; Conditions</a>
                <a href="/contact">Contact</a>
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

  <a href="https://wa.me/971566202517" class="whatsapp-float" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
    <i class="fa-brands fa-whatsapp"></i>
    <span class="whatsapp-tooltip">Chat with us on WhatsApp</span>
  </a>

  <nav class="mobile-bottom-nav">
    <a href="/" class="mbn-link"><i class="fa-solid fa-house"></i><span>Home</span></a>
    <a href="/products" class="mbn-link"><i class="fa-solid fa-box-open"></i><span>Products</span></a>
    <a href="/blog" class="mbn-link active"><i class="fa-solid fa-newspaper"></i><span>Blog</span></a>
    <a href="/contact" class="mbn-link"><i class="fa-solid fa-envelope"></i><span>Contact</span></a>
  </nav>

  <script defer src="https://unpkg.com/@studio-freight/lenis@1.0.39/dist/lenis.min.js"></script>
  <script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script type="module" src="/main.js"></script>
</body>

</html>
`;
}

mkdirSync('blog', { recursive: true });
const written = [];
for (const key of Object.keys(META)) {
  const html = page(key, extract(key));
  const file = `blog/${META[key].slug}.html`;
  writeFileSync(file, html, 'utf8');
  written.push(META[key].slug);
  console.log('  generated', file);
}

/* ---- point the blog cards at the real article URLs -------------------- */
let b = readFileSync('blog.html', 'utf8');
for (const [key, m] of Object.entries(META)) {
  b = b.replace(
    new RegExp(`<button class="blog-read-btn open-article-btn" data-article="${key}"[^>]*>([\\s\\S]*?)</button>`),
    `<a href="/blog/${m.slug}" class="blog-read-btn">$1</a>`
  );
}
writeFileSync('blog.html', b, 'utf8');
console.log('\nblog.html cards now link to canonical article URLs.');
console.log(`${written.length} article pages generated.`);
