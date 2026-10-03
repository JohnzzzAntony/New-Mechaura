/**
 * Page chrome: <head>, header with mega menu, mobile navigation, footer and
 * mobile action bar. Every generated page goes through page().
 */
import {
  SITE, BRAND, LEGAL, PHONE, PHONE_RAW, EMAIL, GTM, GOOGLE_TAG, WHATSAPP, HQ, HOURS, SOCIAL,
  products, groups, locations,
} from '../site-data.mjs';
import { solutions, sectors, legalPages, pillar } from '../content/site-content.mjs';
import { esc, icon, img, jsonLd } from './html.mjs';

export const waLink = (text) => `https://wa.me/${WHATSAPP}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

/* ------------------------------------------------------------------ */
/* Navigation model                                                    */
/* ------------------------------------------------------------------ */

const productsByGroup = groups.map((g) => ({
  ...g,
  items: [
    ...products.filter((p) => p.group === g.id).map((p) => ({ name: p.name, href: `/products/${p.slug}` })),
    ...(g.id === 'surface' ? [{ name: 'Shot Blast Machine Brushes', href: `/${pillar.slug}` }] : []),
  ],
  types: products
    .filter((p) => p.group === g.id)
    .flatMap((p) => p.types)
    .filter((t) => /Coalescer|Depth|Fittings|Spherical|Tapered|Carbide|Guide Shoes|Door Rollers|Strip|Gear Pumps|Piston/.test(t))
    .slice(0, 3),
}));

export const NAV = [
  { id: 'products', label: 'Products', href: '/products', mega: true },
  {
    id: 'solutions', label: 'Solutions', href: '/services',
    items: solutions.map((s) => ({ name: s.name, href: `/services#${s.id}`, note: '' })),
  },
  {
    id: 'industries', label: 'Industries', href: '/sectors',
    items: sectors.map((s) => ({ name: s.name, href: `/sectors/${s.slug}` })),
  },
  { id: 'brands', label: 'Brands', href: '/brands' },
  {
    id: 'resources', label: 'Resources', href: '/blog',
    items: [
      { name: 'Technical Guides', href: '/blog' },
      { name: 'Shot Blast Brush Guide', href: `/${pillar.slug}` },
      { name: 'FAQs', href: '/faq' },
      { name: 'Request a Datasheet', href: '/request-quote?type=datasheet' },
    ],
  },
  {
    id: 'company', label: 'Company', href: '/about',
    items: [
      { name: 'About Mechaura', href: '/about' },
      { name: 'Quality & Inspection', href: '/about#quality' },
      { name: 'Delivery', href: '/delivery-policy' },
      { name: 'Contact', href: '/contact' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* <head>                                                              */
/* ------------------------------------------------------------------ */

const analytics = `  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    function _loadGTM() {
      var ga = document.createElement('script');
      ga.async = true;
      ga.src = 'https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG}';
      document.head.appendChild(ga);
      gtag('js', new Date());
      gtag('config', '${GOOGLE_TAG}');
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
        f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM}');
    }
    if (document.readyState === 'complete') { _loadGTM(); }
    else { window.addEventListener('load', _loadGTM); }
  </script>`;

function head({ path, title, desc, keywords, ogImage = '/images/logo.png', ogType = 'website', schema = [], noindex, preload, article }) {
  const url = `${SITE}${path === '/' ? '/' : path}`;
  const og = ogImage.startsWith('http') ? ogImage : `${SITE}${ogImage}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
${keywords ? `  <meta name="keywords" content="${esc(keywords)}">\n` : ''}  <meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}">
  <link rel="canonical" href="${url}">
  <meta name="theme-color" content="#0d1014">
  <meta name="geo.region" content="AE-DU">
  <meta name="geo.placename" content="Dubai">
  <link rel="icon" type="image/png" href="/images/logo.png">
  <link rel="apple-touch-icon" href="/images/logo.png">

  <meta property="og:type" content="${ogType}">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="${og}">
  <meta property="og:site_name" content="${BRAND}">
  <meta property="og:locale" content="en_AE">
${article ? `  <meta property="article:published_time" content="${article.published}">
  <meta property="article:modified_time" content="${article.modified}">
  <meta property="article:section" content="${esc(article.section)}">\n` : ''}  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${og}">

${jsonLd(schema)}

${analytics}

  <link rel="preconnect" href="https://api.fontshare.com" crossorigin>
  <link rel="preconnect" href="https://cdn.fontshare.com" crossorigin>
  <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f%5B%5D=satoshi@400,500,700&display=swap" media="print" onload="this.media='all'">
${preload ? `  <link rel="preload" as="image" href="${esc(preload)}" fetchpriority="high">\n` : ''}  <link rel="stylesheet" href="/style.css">
</head>`;
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

const logo = (variant = '') => `<a href="/" class="logo${variant}" aria-label="${BRAND} — home">
        <img src="/images/logo.webp" alt="" width="57" height="36" decoding="async">
        <span class="logo-word"><strong>MECHAURA</strong><span>INTERNATIONAL</span></span>
      </a>`;

function megaPanel() {
  const cols = productsByGroup
    .map(
      (g) => `            <div class="mega-col">
              <p class="mega-group">${esc(g.name)}</p>
              <ul>
${g.items.map((i) => `                <li><a href="${i.href}">${esc(i.name)}</a></li>`).join('\n')}
${g.types.map((t) => `                <li><a class="mega-type" href="/products?type=${encodeURIComponent(t)}">${esc(t)}</a></li>`).join('\n')}
              </ul>
            </div>`
    )
    .join('\n');
  return `          <div class="mega-grid">
${cols}
          </div>
          <div class="mega-foot">
            <a href="/products" class="link-arrow">View full product catalogue ${icon('arrow-right')}</a>
            <span class="mega-help">Can’t find a part? <a href="/request-quote?type=identify">Send a photo or drawing</a></span>
          </div>`;
}

function desktopNav(active) {
  return NAV.map((n) => {
    const cur = n.id === active ? ' aria-current="page"' : '';
    if (!n.mega && !n.items) return `        <li><a class="nav-top" href="${n.href}"${cur}>${n.label}</a></li>`;
    const panel = n.mega
      ? megaPanel()
      : `          <ul class="drop-list">
${n.items.map((i) => `            <li><a href="${i.href}">${esc(i.name)}</a></li>`).join('\n')}
          </ul>`;
    return `        <li class="has-panel${n.mega ? ' is-mega' : ''}">
          <button class="nav-top" type="button" aria-expanded="false" aria-controls="panel-${n.id}"${n.id === active ? ' data-active' : ''}>${n.label}${icon('chevron-down', 'i-sm')}</button>
          <div class="nav-panel${n.mega ? ' mega' : ''}" id="panel-${n.id}" hidden>
            <a class="panel-overview" href="${n.href}">${n.mega ? 'All products' : `${n.label} overview`} ${icon('arrow-right')}</a>
${panel}
          </div>
        </li>`;
  }).join('\n');
}

function mobileNav() {
  const section = (n) => {
    if (n.mega) {
      return `        <li>
          <details class="m-acc">
            <summary>Products${icon('chevron-down', 'i-sm')}</summary>
            <ul>
              <li><a href="/products">All products</a></li>
${products.map((p) => `              <li><a href="/products/${p.slug}">${esc(p.name)}</a></li>`).join('\n')}
              <li><a href="/${pillar.slug}">Shot Blast Machine Brushes</a></li>
            </ul>
          </details>
        </li>`;
    }
    if (!n.items) return `        <li><a class="m-link" href="${n.href}">${n.label}</a></li>`;
    return `        <li>
          <details class="m-acc">
            <summary>${n.label}${icon('chevron-down', 'i-sm')}</summary>
            <ul>
              <li><a href="${n.href}">${n.label} overview</a></li>
${n.items.map((i) => `              <li><a href="${i.href}">${esc(i.name)}</a></li>`).join('\n')}
            </ul>
          </details>
        </li>`;
  };
  return `  <div class="m-nav" id="m-nav" hidden>
    <div class="m-nav-head">
      ${logo(' logo-m')}
      <button class="icon-btn" type="button" data-close-nav aria-label="Close menu">${icon('x')}</button>
    </div>
    <nav aria-label="Mobile">
      <ul class="m-list">
${NAV.map(section).join('\n')}
      </ul>
    </nav>
    <div class="m-nav-cta">
      <a class="btn btn-primary btn-block" href="/request-quote">${icon('file')} Request a Quote</a>
      <a class="btn btn-wa btn-block" href="${waLink('Hello Mechaura, I need help with an industrial requirement.')}" target="_blank" rel="noopener" data-track="whatsapp_click">${icon('whatsapp')} WhatsApp an Engineer</a>
      <p class="m-contact"><a href="tel:${PHONE_RAW}" data-track="phone_click">${PHONE}</a> · <a href="mailto:${EMAIL}" data-track="email_click">${EMAIL}</a></p>
    </div>
  </div>`;
}

function header(active) {
  return `  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="utility">
      <div class="wrap utility-in">
        <p>Industrial components &amp; MRO supply · UAE &amp; GCC</p>
        <ul>
          <li><a href="tel:${PHONE_RAW}" data-track="phone_click">${icon('phone', 'i-sm')} ${PHONE}</a></li>
          <li><a href="mailto:${EMAIL}" data-track="email_click">${icon('mail', 'i-sm')} ${EMAIL}</a></li>
          <li><a href="${waLink()}" target="_blank" rel="noopener" data-track="whatsapp_click">${icon('whatsapp', 'i-sm')} WhatsApp</a></li>
        </ul>
      </div>
    </div>
    <div class="wrap bar">
      ${logo()}
      <nav class="primary" aria-label="Primary">
        <ul class="nav-list">
${desktopNav(active)}
        </ul>
      </nav>
      <div class="bar-actions">
        <button class="icon-btn search-open" type="button" aria-label="Search products" data-search-open>${icon('search')}<kbd>/</kbd></button>
        <a class="btn btn-primary btn-sm bar-rfq" href="/request-quote">Request Quote</a>
        <button class="icon-btn menu-open" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="m-nav">${icon('menu')}</button>
      </div>
    </div>
  </header>
${mobileNav()}`;
}

/* ------------------------------------------------------------------ */
/* Search dialog (filled by main.js from /search-index.json)           */
/* ------------------------------------------------------------------ */

const searchDialog = `  <dialog class="search-dialog" id="search-dialog" aria-label="Search">
    <form class="search-box" role="search" action="/products" data-search-form>
      ${icon('search')}
      <label class="sr-only" for="search-dialog-input">Search products, part numbers or brands</label>
      <input id="search-dialog-input" name="q" type="search" autocomplete="off" spellcheck="false"
        placeholder="Search by product, part number, OEM number or brand…" data-search-input>
      <button class="icon-btn" type="button" data-search-close aria-label="Close search">${icon('x')}</button>
    </form>
    <div class="search-results" data-search-results aria-live="polite"></div>
  </dialog>`;

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function footer() {
  const col = (title, links) => `        <div class="f-col">
          <h2 class="f-title">${title}</h2>
          <ul>
${links.map(([h, l]) => `            <li><a href="${h}">${esc(l)}</a></li>`).join('\n')}
          </ul>
        </div>`;
  return `  <footer class="site-footer">
    <div class="f-cta">
      <div class="wrap f-cta-in">
        <div>
          <p class="eyebrow">Request a quote</p>
          <h2>Need help sourcing an industrial component?</h2>
          <p>Send the part number, specification, drawing or photo. We’ll identify the right option and quote it line by line.</p>
        </div>
        <div class="f-cta-actions">
          <a class="btn btn-primary" href="/request-quote">${icon('file')} Request a Quote</a>
          <a class="btn btn-wa" href="${waLink('Hello Mechaura, I need help sourcing an industrial component.')}" target="_blank" rel="noopener" data-track="whatsapp_click">${icon('whatsapp')} WhatsApp an Engineer</a>
        </div>
      </div>
    </div>
    <div class="wrap f-main">
      <div class="f-brand">
        ${logo(' logo-f')}
        <p>Industrial components &amp; MRO supply for manufacturing, fabrication, oil &amp; gas, construction and facility management across the UAE and GCC.</p>
        <address>
          <span>${icon('map-pin', 'i-sm')} ${HQ}</span>
          <a href="tel:${PHONE_RAW}" data-track="phone_click">${icon('phone', 'i-sm')} ${PHONE}</a>
          <a href="mailto:${EMAIL}" data-track="email_click">${icon('mail', 'i-sm')} ${EMAIL}</a>
          <span>${icon('clock', 'i-sm')} ${HOURS}</span>
        </address>
        <ul class="f-social">
${SOCIAL.map(([n, h, i]) => `          <li><a href="${h}" target="_blank" rel="noopener" aria-label="${n}">${icon(i)}</a></li>`).join('\n')}
        </ul>
      </div>
      <div class="f-cols">
${col('Products', [...products.map((p) => [`/products/${p.slug}`, p.name]), ['/products', 'Full catalogue']])}
${col('Solutions', solutions.map((s) => [`/services#${s.id}`, s.name]))}
${col('Industries', sectors.map((s) => [`/sectors/${s.slug}`, s.short]))}
${col('Company', [['/about', 'About'], ['/brands', 'Brands'], ['/blog', 'Technical Guides'], ['/faq', 'FAQs'], ['/contact', 'Contact'], ['/request-quote', 'Request a Quote']])}
      </div>
    </div>
    <div class="wrap f-areas">
      <p><strong>Service areas</strong>
${locations.map((l) => `        <a href="/industrial-supplies-${l.slug}">Industrial supplies in ${l.city}</a>`).join('\n')}
        <a href="/delivery-policy#uae-delivery">Northern Emirates &amp; GCC delivery</a>
      </p>
    </div>
    <div class="wrap f-legal">
      <p>© ${new Date().getFullYear()} ${LEGAL}. All rights reserved.</p>
      <ul>
${legalPages.map((l) => `        <li><a href="/${l.slug}">${esc(l.name.replace(' & Shipping', ''))}</a></li>`).join('\n')}
      </ul>
    </div>
  </footer>`;
}

const actionBar = `  <div class="action-bar" aria-label="Quick actions">
    <a class="btn btn-wa" href="${waLink('Hello Mechaura, I need help with an industrial requirement.')}" target="_blank" rel="noopener" data-track="whatsapp_click">${icon('whatsapp')} WhatsApp</a>
    <a class="btn btn-primary" href="/request-quote" data-rfq-link>${icon('file')} Request Quote</a>
  </div>`;

/* ------------------------------------------------------------------ */
/* Breadcrumbs                                                         */
/* ------------------------------------------------------------------ */

export const breadcrumbSchema = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: `${SITE}${t.url}` })),
});

export const breadcrumbs = (trail) => `<nav class="crumbs" aria-label="Breadcrumb">
        <ol>
${trail
  .map((t, i) =>
    i === trail.length - 1
      ? `          <li><span aria-current="page">${esc(t.name)}</span></li>`
      : `          <li><a href="${t.url}">${esc(t.name)}</a>${icon('chevron-right', 'i-sm')}</li>`
  )
  .join('\n')}
        </ol>
      </nav>`;

export const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: LEGAL,
  alternateName: BRAND,
  url: `${SITE}/`,
  logo: `${SITE}/images/logo.png`,
  telephone: PHONE_RAW,
  email: EMAIL,
  address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressRegion: 'Dubai', addressCountry: 'AE' },
  sameAs: SOCIAL.map(([, h]) => h),
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

/**
 * @param {object} o
 * @param {string} o.path       clean URL, e.g. '/products/bandsaw-blades'
 * @param {Array}  [o.trail]    breadcrumb trail; adds BreadcrumbList schema
 * @param {string} o.body       page content (inside <main>)
 * @param {string} [o.active]   top-level nav id to mark as current
 * @param {boolean} [o.actionBar=true] mobile WhatsApp / quote bar
 */
export function page(o) {
  const schema = [...(o.trail ? [breadcrumbSchema(o.trail)] : []), ...(o.schema || [])];
  return `${head({ ...o, schema })}
<body${o.bodyClass ? ` class="${o.bodyClass}"` : ''}>
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM}" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe></noscript>
${header(o.active)}
  <main id="main">
${o.body}
  </main>
${footer()}
${o.actionBar === false ? '' : actionBar}
${searchDialog}
  <script type="module" src="/main.js"></script>
</body>
</html>
`;
}

export { img };
