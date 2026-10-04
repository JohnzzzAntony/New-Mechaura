/**
 * Generates every page of the site as static HTML, plus the search index and
 * sitemap. Output is plain HTML at the repo root (Vite then bundles it).
 *
 *   node tools/build-site.mjs
 *
 * Content lives in tools/site-data.mjs, tools/content/* and
 * tools/article-content.mjs; layout and components in tools/lib/*.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SITE, BRAND, LEGAL, PHONE, PHONE_RAW, EMAIL, AUTHOR, HQ, HOURS,
  products, locations, groups, gccMarkets, webp,
} from './site-data.mjs';
import {
  articleMeta, legacyArticleKeys, ARTICLE_PUBLISHED, ARTICLE_MODIFIED, principles, process, generalFaqs,
  solutions, sectors, pillar, legalPages, brandList, BRAND_DISCLAIMER,
} from './content/site-content.mjs';
import { articles } from './article-content.mjs';
import { esc, plain, icon, img, slugify, loadImageMeta, writeImageVariants } from './lib/html.mjs';
import { page, breadcrumbs, orgSchema, waLink } from './lib/layout.mjs';
import {
  btn, sectionHead, productCard, productGrid, specTable, faqList, faqSchema, testimonials,
  deliveryBlock, articleCard, identifyPart, ctaBand, videoGrid, VIDEOS, rfqFull, rfqCompact, contactLines,
  groupName, productBySlug, sectorBySlug, articleBySlug,
} from './lib/components.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
await loadImageMeta();

const areaServed = [{ '@type': 'Country', name: 'United Arab Emirates' }, ...gccMarkets.map((m) => ({ '@type': 'Country', name: m }))];

/* ------------------------------------------------------------------ */
/* Article helpers                                                     */
/* ------------------------------------------------------------------ */

function renderBlocks(blocks) {
  return blocks
    .map(([type, val]) => {
      switch (type) {
        case 'h2':
          return `<h2 id="${slugify(val)}">${val}</h2>`;
        case 'h3':
          return `<h3>${val}</h3>`;
        case 'p':
          return `<p>${val}</p>`;
        case 'ul':
          return `<ul>\n${val.map((li) => `  <li>${li}</li>`).join('\n')}\n</ul>`;
        case 'ol':
          return `<ol>\n${val.map((li) => `  <li>${li}</li>`).join('\n')}\n</ol>`;
        case 'callout':
          return `<aside class="callout">${icon('info')}<p>${val}</p></aside>`;
        case 'table':
          return `<div class="table-scroll" tabindex="0" role="region" aria-label="Comparison table">
<table class="data-table">
  <thead><tr>${val.head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead>
  <tbody>
${val.rows.map((r) => `    <tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`)).join('')}</tr>`).join('\n')}
  </tbody>
</table>
</div>`;
        case 'faq':
          return `<div class="article-faq">\n${val.map(([q, a]) => `<h3>${q}</h3>\n<p>${a}</p>`).join('\n')}\n</div>`;
        default:
          return '';
      }
    })
    .join('\n\n');
}

const words = (blocks) => plain(JSON.stringify(blocks)).split(/\s+/).length;
const readTime = (slug) => Math.max(3, Math.round(words(articles[slug].blocks) / 220));
const articleFaqs = (slug) => articles[slug].blocks.find(([t]) => t === 'faq')?.[1] || [];
const articlesForProduct = (slug) => articleMeta.filter((a) => a.products.includes(slug));

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */

function home() {
  const typesTotal = products.reduce((n, p) => n + p.types.length, 0);

  const body = `    <section class="hero">
      ${img({ src: '/images/hero-banner.webp', alt: 'Industrial brush segments, hydraulic hoses, hydraulic power units, bearings and filtration elements supplied by Mechaura International', sizes: '100vw', priority: true, cls: 'hero-bg' })}
      <div class="wrap hero-in">
        <div class="hero-copy">
          <p class="eyebrow eyebrow-light">Industrial components &amp; MRO supply · UAE &amp; GCC</p>
          <h1>Industrial components and MRO supply across the UAE and GCC</h1>
          <p class="hero-lede">Source bearings, hydraulics, industrial brushes, filtration, cutting tools, elevator components and hard-to-source parts — with technical matching and itemised quotations from our Dubai desk.</p>
          <form class="hero-search" role="search" action="/products" data-inline-search>
            <label class="sr-only" for="hero-q">Search by product, part number, OEM number or brand</label>
            ${icon('search')}
            <input id="hero-q" name="q" type="search" autocomplete="off" spellcheck="false" placeholder="Search by product, part number, OEM number or brand…" data-search-input>
            <button class="btn btn-primary" type="submit">Search</button>
            <div class="search-results search-pop" data-search-results aria-live="polite"></div>
          </form>
          <div class="btn-row">
            ${btn('Request a Quote', '/request-quote', 'primary', 'file', ' data-rfq-link')}
            ${btn('Find a Product', '/products', 'ghost-light', 'search')}
            ${btn('Talk to an Engineer', waLink('Hello Mechaura, I would like to speak to an engineer.'), 'ghost-light', 'whatsapp', ' target="_blank" rel="noopener" data-track="whatsapp_click"')}
          </div>
          <p class="hero-upload">Can’t find the exact product? <a href="/request-quote?type=identify">${icon('upload', 'i-sm')} Upload a drawing or photo</a></p>
        </div>
      </div>
    </section>

    <section class="section" id="catalogue" aria-labelledby="cat-h">
      <div class="wrap">
${sectionHead({ eyebrow: 'Product catalogue', title: 'Product categories', id: 'cat-h', intro: `${products.length} product families and ${typesTotal} sub-ranges, supplied as genuine brand stock or verified equivalents.`, action: btn('View full catalogue', '/products', 'ghost', 'arrow-right') })}
        ${productGrid(products)}
      </div>
    </section>

    <section class="section finder" aria-labelledby="finder-h">
      <div class="wrap finder-in">
        <div>
          <p class="eyebrow">Product finder</p>
          <h2 id="finder-h">Find the right component faster</h2>
          <p>Search across product names, sub-ranges, specifications and brands. Part numbers we don’t list are checked by our technical desk.</p>
          <form class="finder-search" role="search" action="/products" data-inline-search>
            <label class="sr-only" for="finder-q">Search industrial products</label>
            ${icon('search')}
            <input id="finder-q" name="q" type="search" autocomplete="off" placeholder="Search industrial products…" data-search-input>
            <button class="btn btn-dark" type="submit">Search</button>
            <div class="search-results search-pop" data-search-results aria-live="polite"></div>
          </form>
        </div>
        <div class="finder-facets">
          <div>
            <h3>By industry</h3>
            <ul class="chips chips-link">
${sectors.map((s) => `              <li><a href="/products?industry=${s.slug}">${esc(s.short)}</a></li>`).join('\n')}
            </ul>
          </div>
          <div>
            <h3>By brand</h3>
            <ul class="chips chips-link">
${brandList.map((b) => `              <li><a href="/products?brand=${encodeURIComponent(b)}">${esc(b)}</a></li>`).join('\n')}
            </ul>
          </div>
          <div>
            <h3>By category</h3>
            <ul class="chips chips-link">
${groups.map((g) => `              <li><a href="/products?group=${g.id}">${esc(g.name)}</a></li>`).join('\n')}
            </ul>
          </div>
        </div>
      </div>
    </section>

    ${identifyPart()}

    <section class="section" aria-labelledby="ind-h">
      <div class="wrap">
${sectionHead({ eyebrow: 'Industries', title: 'Supply programmes by industry', id: 'ind-h', intro: 'Each sector has its own failure modes, documentation and delivery constraints. We specify for them.', action: btn('All industries', '/sectors', 'ghost', 'arrow-right') })}
        <div class="ind-grid">
${sectors
  .map(
    (s) => `          <a class="ind-card" href="/sectors/${s.slug}">
            ${img({ src: s.image, alt: '', sizes: '(min-width: 1100px) 380px, (min-width: 640px) 45vw, 92vw' })}
            <span class="ind-body"><strong>${esc(s.name)}</strong><span>${esc(s.summary)}</span></span>
          </a>`
  )
  .join('\n')}
        </div>
      </div>
    </section>

    <section class="section alt" aria-labelledby="why-h">
      <div class="wrap">
${sectionHead({ eyebrow: 'Why Mechaura', title: 'Operational differences, not slogans', id: 'why-h' })}
        <ol class="num-grid">
${principles.map(([t, d], i) => `          <li><span class="num">${String(i + 1).padStart(2, '0')}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('\n')}
        </ol>
      </div>
    </section>

    <section class="section" aria-labelledby="how-h">
      <div class="wrap">
${sectionHead({ eyebrow: 'How it works', title: 'From requirement to delivery in four steps', id: 'how-h' })}
        <ol class="process">
${process.map(([t, d], i) => `          <li><span class="num">${String(i + 1).padStart(2, '0')}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('\n')}
        </ol>
      </div>
    </section>

    <section class="section alt" aria-labelledby="brands-h">
      <div class="wrap">
${sectionHead({ eyebrow: 'Brands', title: 'Genuine brands and verified equivalents', id: 'brands-h', intro: 'We quote original manufacturer stock where available and dimensional equivalents where they make sense — stated clearly on every line.', action: btn('Brands we source', '/brands', 'ghost', 'arrow-right') })}
        <ul class="brand-wall">
${brandList.map((b) => `          <li><a href="/products?brand=${encodeURIComponent(b)}">${esc(b)}</a></li>`).join('\n')}
        </ul>
        <p class="fine">${BRAND_DISCLAIMER}</p>
      </div>
    </section>

    <section class="section" aria-labelledby="t-h">
      <div class="wrap">
${sectionHead({ eyebrow: 'Customer feedback', title: 'What maintenance and production teams say', id: 't-h' })}
        ${testimonials()}
      </div>
    </section>

    <section class="section alt" aria-labelledby="k-h">
      <div class="wrap">
${sectionHead({ eyebrow: 'Technical knowledge', title: 'Guides from our engineering desk', id: 'k-h', action: btn('All technical guides', '/blog', 'ghost', 'arrow-right') })}
        <div class="a-grid">
          ${articleMeta.slice(0, 3).map((a) => articleCard(a, readTime(a.slug))).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="faq-h">
      <div class="wrap narrow">
${sectionHead({ eyebrow: 'FAQ', title: 'Frequently asked questions', id: 'faq-h', action: btn('All FAQs', '/faq', 'ghost', 'arrow-right') })}
        ${faqList(generalFaqs)}
      </div>
    </section>

    ${ctaBand()}`;

  return page({
    path: '/',
    title: 'Industrial Supplier UAE | Abrasive Brushes & Tools | Mechaura',
    desc: 'Industrial components and MRO supply across the UAE and GCC — abrasive brush segments, hydraulic hoses and pumps, bearings, bandsaw blades, cutting tools, elevator spares and air filters. Fast, itemised quotes.',
    keywords: 'Industrial Supplier UAE, Industrial Supplies Dubai, MRO Supplier UAE, Abrasive Brushes Dubai, Hydraulic Hoses UAE, Bearings Dubai',
    ogImage: '/images/hero-banner-og.jpg',
    bodyClass: 'is-home',
    schema: [
      orgSchema,
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: BRAND,
        url: `${SITE}/`,
        potentialAction: { '@type': 'SearchAction', target: `${SITE}/products?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WholesaleStore',
        name: LEGAL,
        url: `${SITE}/`,
        image: `${SITE}/images/logo.png`,
        telephone: PHONE_RAW,
        email: EMAIL,
        address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressRegion: 'Dubai', addressCountry: 'AE' },
        areaServed,
      },
      faqSchema(generalFaqs),
    ],
    body,
  });
}

/* ------------------------------------------------------------------ */
/* Catalogue                                                           */
/* ------------------------------------------------------------------ */

function catalogue() {
  const trail = [{ name: 'Home', url: '/' }, { name: 'Products', url: '/products' }];
  const facet = (name, label, items) => `            <fieldset class="facet">
              <legend>${label}</legend>
${items.map(([v, l]) => `              <label><input type="checkbox" name="${name}" value="${esc(v)}"> <span>${esc(l)}</span><span class="count" data-count="${name}:${esc(v)}"></span></label>`).join('\n')}
            </fieldset>`;
  const brands = [...new Set(products.flatMap((p) => p.brands))].sort();

  const body = `    <section class="page-head">
      <div class="wrap">
        ${breadcrumbs(trail)}
        <h1>Industrial product catalogue</h1>
        <p class="lede">Eight product families supplied across the UAE and GCC. Filter by category, industry or brand, or search by product, sub-range, specification or part number.</p>
      </div>
    </section>

    <section class="section catalogue" data-catalogue>
      <div class="wrap cat-layout">
        <aside class="filters" id="filters" aria-label="Filters" data-filters>
          <div class="filters-head">
            <h2>Filter</h2>
            <button class="icon-btn filters-close" type="button" data-filters-close aria-label="Close filters">${icon('x')}</button>
          </div>
          <form data-filter-form>
            <div class="field">
              <label for="cat-q">Keyword or part number</label>
              <input id="cat-q" name="q" type="search" autocomplete="off" spellcheck="false" placeholder="e.g. coalescer, 4SP, 6310">
            </div>
${facet('group', 'Category', groups.map((g) => [g.id, g.name]))}
${facet('industry', 'Industry', sectors.map((s) => [s.slug, s.short]))}
${facet('brand', 'Brand', brands.map((b) => [b, b]))}
            <input type="hidden" name="type">
            <div class="filters-foot">
              <button class="btn btn-ghost btn-sm" type="reset" data-filter-reset>Clear all</button>
              <button class="btn btn-primary btn-sm filters-apply" type="button" data-filters-close>Show results</button>
            </div>
          </form>
        </aside>

        <div class="cat-main">
          <div class="cat-toolbar">
            <p class="cat-count" aria-live="polite" data-result-count>${products.length} product families</p>
            <ul class="active-filters" data-active-filters></ul>
            <button class="btn btn-ghost btn-sm filters-open" type="button" data-filters-open aria-controls="filters">${icon('filter')} Filter</button>
          </div>
          ${productGrid(products, { heading: 'h2', filters: true })}
          <div class="no-results" data-no-results hidden>
            ${icon('search')}
            <h2>No product family matches those filters</h2>
            <p>We supply many items that are not listed individually. Send the part number, a photo or a drawing and our technical team will identify it.</p>
            <div class="btn-row">
              <a class="btn btn-primary" href="/request-quote?type=identify" data-identify-link>${icon('upload')} Ask us to identify it</a>
              <button class="btn btn-ghost" type="button" data-filter-reset>Clear filters</button>
            </div>
          </div>
          <aside class="cat-pillar">
            ${img({ src: '/images/products/shot-blasting-machine-2.webp', alt: '', sizes: '200px', width: 200 })}
            <div>
              <p class="eyebrow">Surface treatment</p>
              <h2><a href="/${pillar.slug}">Shot blast machine brushes</a></h2>
              <p>Blow-off and brush segments built to your machine’s drawing or worn sample.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section class="section alt" aria-labelledby="types-h">
      <div class="wrap">
${sectionHead({ eyebrow: 'Sub-ranges', title: 'Browse by product type', id: 'types-h' })}
        <div class="type-index">
${products
  .map(
    (p) => `          <div>
            <h3><a href="/products/${p.slug}">${esc(p.name)}</a></h3>
            <ul>
${p.types.map((t) => `              <li><a href="/products?type=${encodeURIComponent(t)}">${esc(t)}</a></li>`).join('\n')}
            </ul>
          </div>`
  )
  .join('\n')}
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="v-h">
      <div class="wrap">
${sectionHead({ eyebrow: 'In operation', title: 'Our range at work', id: 'v-h' })}
        ${videoGrid()}
      </div>
    </section>

    ${ctaBand()}`;

  return page({
    path: '/products',
    title: 'Industrial Products & Equipment Catalogue | UAE',
    desc: 'Industrial product catalogue for the UAE: abrasive brush segments, hydraulic hoses and pumps, bearings, bandsaw blades, cutting tools, elevator spares and air filters. Search by part number.',
    keywords: 'Industrial Products UAE, Abrasive Removal Brush Dubai, Elevator Spares UAE, Hydraulic Hose Supplier, Industrial Bearings Dubai, Bandsaw Blades UAE, Cutting Tools Dubai',
    ogImage: '/images/brush-product.png',
    active: 'products',
    trail,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Industrial product catalogue',
        url: `${SITE}/products`,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/products/${p.slug}`, name: p.name })),
        },
      },
    ],
    body,
  });
}

/* ------------------------------------------------------------------ */
/* Product detail                                                      */
/* ------------------------------------------------------------------ */

function productPage(p) {
  const url = `/products/${p.slug}`;
  const trail = [{ name: 'Home', url: '/' }, { name: 'Products', url: '/products' }, { name: groupName(p.group), url: `/products?group=${p.group}` }, { name: p.name, url }];
  const views = [
    { src: webp(p.hero), label: 'Product photograph' },
    ...p.photos.map((src, i) => ({ src: webp(src), label: `Detail view ${i + 2}` })),
    { src: `/images/products/${p.legacyId}-schematic.svg`, label: 'Technical schematic' },
    { src: `/images/products/${p.legacyId}-specifications.svg`, label: 'Range & specification' },
    { src: `/images/products/${p.legacyId}-applications.svg`, label: 'Applications' },
  ];
  const related = p.related.map(productBySlug);
  const guides = articlesForProduct(p.slug);
  const inds = p.industries.map(sectorBySlug);
  const wa = waLink(`Hello Mechaura, I have a question about ${plain(p.name)}.`);
  const tabs = [['overview', 'Overview'], ['specifications', 'Specifications'], ['applications', 'Applications'], ['cross-reference', 'Cross-reference'], ['documents', 'Documents'], ['faq', 'FAQ']];

  const body = `    <section class="pd-head">
      <div class="wrap">
        ${breadcrumbs(trail)}
        <div class="pd-grid">
          <div class="gallery" data-gallery>
            <div class="gallery-main">
              ${img({ src: views[0].src, alt: `${p.name} — ${views[0].label}`, sizes: '(min-width: 1100px) 620px, 92vw', priority: true, cls: 'gallery-img' })}
              <span class="gallery-label" data-gallery-label>${views[0].label} · 1 / ${views.length}</span>
            </div>
            <div class="gallery-thumbs" role="group" aria-label="Product image views">
${views
  .map(
    (v, i) => `              <button type="button" class="thumb" data-src="${esc(v.src)}" data-label="${esc(v.label)}" aria-label="Show ${esc(v.label.toLowerCase())}"${i === 0 ? ' aria-pressed="true"' : ' aria-pressed="false"'}>
                ${img({ src: v.src, alt: '', width: 120, sizes: '120px' })}
              </button>`
  )
  .join('\n')}
            </div>
          </div>

          <div class="pd-info">
            <p class="eyebrow">${esc(groupName(p.group))} · ${esc(p.category)}</p>
            <h1>${esc(p.name)} in the UAE</h1>
            <p class="lede">${esc(p.lead)}</p>
            <dl class="pd-facts">
              <div><dt>Range</dt><dd>${esc(p.types.slice(0, 4).join(', '))}${p.types.length > 4 ? ` +${p.types.length - 4} more` : ''}</dd></div>
              <div><dt>Brands</dt><dd>${p.brands.length ? `${esc(p.brands.join(', '))} and equivalents` : 'OEM and compatible equivalents'}</dd></div>
              <div><dt>Part number</dt><dd>Quoted to your part, OEM or drawing reference</dd></div>
              <div><dt>Availability</dt><dd>Stock and lead time confirmed on quotation</dd></div>
            </dl>
            <div class="btn-row">
              <a class="btn btn-primary" href="#rfq" data-rfq-start>${icon('file')} Request Quote</a>
              <a class="btn btn-wa" href="${wa}" target="_blank" rel="noopener" data-track="whatsapp_click">${icon('whatsapp')} WhatsApp an Engineer</a>
            </div>
            <p class="pd-call">Or call <a href="tel:${PHONE_RAW}" data-track="phone_click">${PHONE}</a> · ${esc(HOURS)}</p>
          </div>
        </div>
      </div>
    </section>

    <nav class="pd-tabs" aria-label="On this page">
      <div class="wrap">
        <ul>
${tabs.map(([id, l]) => `          <li><a href="#${id}">${l}</a></li>`).join('\n')}
        </ul>
      </div>
    </nav>

    <div class="wrap pd-body">
      <div class="pd-main">
        <section id="overview" class="pd-sec" aria-labelledby="overview-h">
          <h2 id="overview-h">Overview</h2>
          <p class="definition">${esc(p.definition)}</p>
          <h3>Product range</h3>
          <ul class="chips chips-link">
${p.types.map((t) => `            <li><a href="/products?type=${encodeURIComponent(t)}">${esc(t)}</a></li>`).join('\n')}
          </ul>
        </section>

        <section id="specifications" class="pd-sec" aria-labelledby="spec-h">
          <h2 id="spec-h">Key specifications</h2>
          ${specTable(p.specs, `${p.name} — specification range`)}
          <p class="fine">Ranges shown are what we typically supply. The exact rating, size and standard for your item are stated on the quotation.</p>
        </section>

        <section id="applications" class="pd-sec" aria-labelledby="app-h">
          <h2 id="app-h">Applications</h2>
          <ul class="ticks ticks-2">
${p.applications.map((a) => `            <li>${icon('check', 'i-sm')} ${esc(a)}</li>`).join('\n')}
          </ul>
          <h3>Industries</h3>
          <ul class="chips chips-link">
${inds.map((s) => `            <li><a href="/sectors/${s.slug}">${esc(s.short)}</a></li>`).join('\n')}
          </ul>
        </section>

        <section id="cross-reference" class="pd-sec" aria-labelledby="xref-h">
          <h2 id="xref-h">Compatibility &amp; cross-reference</h2>
          <p>Have an OEM or competitor part number? Send it and we will quote the genuine item where available alongside any equivalent, with dimensions and ratings stated so the substitution can be checked.</p>
          <form class="xref" action="/request-quote" data-xref>
            <input type="hidden" name="product" value="${p.slug}">
            <input type="hidden" name="type" value="crossref">
            <label for="xref-part">OEM part number</label>
            <div class="xref-row">
              <input id="xref-part" name="part" type="text" spellcheck="false" autocomplete="off" placeholder="e.g. ${p.slug === 'industrial-bearings' ? 'SKF 6310-2RS' : 'manufacturer part number'}" required>
              <button class="btn btn-dark" type="submit">Request verification</button>
            </div>
            <p class="hint">${icon('info', 'i-sm')} Any equivalent we propose is a potential alternative until our technical team has verified compatibility.</p>
          </form>
        </section>

        <section id="documents" class="pd-sec" aria-labelledby="doc-h">
          <h2 id="doc-h">Technical documents</h2>
          <ul class="docs">
            <li>${icon('file')}<span><strong>Product datasheet</strong>Manufacturer datasheet for the quoted item</span><a class="btn btn-ghost btn-sm" href="/request-quote?type=datasheet&amp;product=${p.slug}">Request</a></li>
            <li>${icon('shield')}<span><strong>Test certificates &amp; MTCs</strong>Supplied on request where the product carries them</span><a class="btn btn-ghost btn-sm" href="/request-quote?type=datasheet&amp;product=${p.slug}">Request</a></li>
          </ul>
          ${deliveryBlock()}
        </section>

        <section id="faq" class="pd-sec" aria-labelledby="faq-h">
          <h2 id="faq-h">Frequently asked questions</h2>
          ${faqList(p.faqs)}
        </section>
      </div>

      <aside class="pd-aside" id="rfq" aria-labelledby="rfq-h">
        <div class="rfq-card">
          <h2 id="rfq-h">Request a quotation</h2>
          <p class="rfq-for">For: <strong>${esc(p.name)}</strong></p>
          ${rfqCompact({ product: p, mode: 'product' })}
        </div>
      </aside>
    </div>

    <section class="section alt" aria-labelledby="rel-h">
      <div class="wrap">
${sectionHead({ eyebrow: 'Often sourced together', title: 'Related products', id: 'rel-h' })}
        ${productGrid(related)}
${guides.length ? `        <div class="related-guides">
          <h3>Technical guides</h3>
          <ul>
${guides.map((a) => `            <li><a href="/blog/${a.slug}">${esc(a.headline)} ${icon('arrow-right', 'i-sm')}</a></li>`).join('\n')}
          </ul>
        </div>` : ''}
      </div>
    </section>

    ${ctaBand({ title: `Need ${esc(p.short.toLowerCase())} specified or matched?`, product: p.slug })}`;

  return page({
    path: url,
    title: p.title,
    desc: p.metaDesc,
    keywords: p.keywords,
    ogImage: p.hero,
    active: 'products',
    trail,
    bodyClass: 'is-product',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: p.name,
        image: [`${SITE}${p.hero}`],
        description: p.metaDesc,
        category: `${groupName(p.group)} > ${p.category}`,
        url: `${SITE}${url}`,
        ...(p.brands.length ? { brand: p.brands.map((b) => ({ '@type': 'Brand', name: b })) } : {}),
        additionalProperty: p.specs.map(([k, v]) => ({ '@type': 'PropertyValue', name: k, value: v })),
      },
      faqSchema(p.faqs),
    ],
    body,
  });
}

/* ------------------------------------------------------------------ */
/* Pillar: shot blast brushes                                          */
/* ------------------------------------------------------------------ */

function pillarPage() {
  const url = `/${pillar.slug}`;
  const trail = [{ name: 'Home', url: '/' }, { name: 'Products', url: '/products' }, { name: 'Shot Blast Machine Brushes', url }];
  const shots = [1, 2, 3, 4].map((n) => `/images/products/shot-blasting-machine-${n}.webp`);
  const alts = ['Continuous plate and pipe shot blasting machine', 'Heavy-duty roller conveyor shot blast machine', 'Industrial shot blast processing unit', 'Automated surface finishing cabinet'];

  const body = `    <section class="page-head">
      <div class="wrap">
        ${breadcrumbs(trail)}
        <p class="eyebrow">Blast machine consumables</p>
        <h1>Abrasive brushes for shot blast machines</h1>
        <p class="lede">Replacement brush segments, blow-off brushes and backing channel for shot blast, wheel blast and plate blast machines — built to your machine’s drawing and supplied across the UAE and GCC.</p>
        <div class="btn-row">
          ${btn('Send your segment drawing', '/request-quote?product=abrasive-brushes&type=identify', 'primary', 'upload')}
          ${btn(PHONE, `tel:${PHONE_RAW}`, 'ghost', 'phone', ' data-track="phone_click"')}
        </div>
      </div>
    </section>

    <div class="wrap article-layout">
      <article class="prose">
        <p class="lede">If you run a shot blast machine, the brush is the part nobody specifies until it fails. It is rarely a catalogue item, the original supplier may no longer stock it, and when it wears out the machine keeps running while abrasive media walks out of the cabinet on every part you process.</p>

        <h2 id="why-custom">Why blast machine brushes are almost always custom</h2>
        <p>Shot blasting equipment is not standardised. Wheel blast, plate blast and tumble blast machines are built by dozens of manufacturers, and each uses its own segment length, backing channel profile and mounting centres. There is no industry standard. That is why searching for a part number rarely works, and why the practical route is to build from the worn segment or a dimensioned drawing.</p>
        <p>We manufacture brush segments to that drawing: you specify — or we measure — the backing width, overall length, trim height, mounting hole centres and fill material, and the replacement drops straight into the existing frame.</p>

        <h2 id="what-it-does">What the brush is doing in the machine</h2>
        <p>On most plate and section blast lines the brush performs <strong>blow-off</strong>: it sits at the cabinet exit and sweeps residual steel shot, grit and dust from the workpiece before it reaches the conveyor. In continuous shot blasting lines this is the difference between a clean part and one that carries abrasive into the paint shop. On some designs a second brush handles the underside, and on tumble machines rotary brushes clear media from complex geometry as the load discharges.</p>
        <p>Three things go wrong when the brush is worn or wrongly specified:</p>
        <ul>
          <li><strong>Media loss.</strong> Steel shot carried out of the cabinet is expensive, and it does not come back.</li>
          <li><strong>Coating defects.</strong> Residual grit under paint or galvanising causes inclusions and adhesion failure.</li>
          <li><strong>Housekeeping and safety.</strong> Loose shot on a shop floor is a slip hazard and it migrates into bearings and drives.</li>
        </ul>

        <figure class="v-feature">
          <video controls muted playsinline preload="none" poster="${VIDEOS[0].poster}" data-lazy-video aria-label="${esc(VIDEOS[0].title)}">
            <source data-src="${VIDEOS[0].src}" type="video/mp4">
          </video>
          <figcaption>Continuous shot blasting and surface finishing line in operation</figcaption>
        </figure>

        <div class="media-grid">
${shots.map((s, i) => `          ${img({ src: s, alt: alts[i], sizes: '(min-width: 900px) 360px, 45vw' })}`).join('\n')}
        </div>

        <h2 id="fill-material">Choosing the fill material</h2>
        <p>Fill choice is driven by the substrate, not by the machine. The table below covers the four we supply most often.</p>
        <div class="table-scroll" tabindex="0" role="region" aria-label="Fill materials compared">
          <table class="data-table">
            <caption>Blast machine brush fill materials compared</caption>
            <thead><tr><th scope="col">Fill material</th><th scope="col">Best for</th><th scope="col">Advantage</th><th scope="col">Trade-off</th></tr></thead>
            <tbody>
${pillar.compare.map(([a, b, c, d]) => `              <tr><th scope="row">${esc(a)}</th><td>${esc(b)}</td><td>${esc(c)}</td><td>${esc(d)}</td></tr>`).join('\n')}
            </tbody>
          </table>
        </div>

        <h2 id="specifying">Specifying a replacement segment</h2>
        <p>To quote accurately we need five dimensions and one decision. The dimensions are backing width, backing length, trim height, mounting hole diameter and hole centres. The decision is fill material, using the table above. If you would rather not measure, send us the worn segment and we will take the dimensions from it.</p>
        <p>Where a machine is already down, tell us at the point of enquiry. We will normally quote a short-run interim set to get you back into production alongside the full replacement order.</p>

        <h2 id="related">Related consumables we supply</h2>
        <p>Blast machine maintenance rarely stops at the brush. We also supply the surrounding wear and drive components — see <a href="/products/industrial-bearings">industrial bearings</a> for conveyor and wheel assemblies, <a href="/products/industrial-air-filters">industrial air filters</a> for the dust collection plant, and <a href="/products/abrasive-brushes">abrasive removal brush segments</a> for deburring and weld cleaning elsewhere in the workshop.</p>

        <h2 id="faq">Frequently asked questions</h2>
        ${faqList(pillar.faqs)}

        <div class="author">
          <span class="author-mark" aria-hidden="true">M</span>
          <div><strong>${AUTHOR.name}</strong><span>${AUTHOR.role}</span><p>${AUTHOR.bio}</p><p class="meta">Published 26 August 2026 · Last reviewed 26 August 2026</p></div>
        </div>
      </article>
      <aside class="article-aside">
        <div class="rfq-mini">
          <h2>Need a replacement set?</h2>
          <p>Send the dimensions, a drawing or a photo of the worn segment.</p>
          ${btn('Request a quote', '/request-quote?product=abrasive-brushes&type=identify', 'primary', 'upload')}
          ${btn('WhatsApp a photo', waLink('Hello Mechaura, I need replacement shot blast machine brushes. I will send a photo.'), 'wa', 'whatsapp', ' target="_blank" rel="noopener" data-track="whatsapp_click"')}
        </div>
        <div class="aside-links">
          <h2>Related products</h2>
          <ul>
${['abrasive-brushes', 'industrial-bearings', 'industrial-air-filters'].map((s) => `            <li><a href="/products/${s}">${esc(productBySlug(s).name)}</a></li>`).join('\n')}
          </ul>
        </div>
      </aside>
    </div>

    ${ctaBand({ product: 'abrasive-brushes' })}`;

  return page({
    path: url,
    title: pillar.title,
    desc: pillar.desc,
    keywords: pillar.keywords,
    ogImage: pillar.image,
    ogType: 'article',
    active: 'products',
    trail,
    schema: [
      faqSchema(pillar.faqs),
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: pillar.headline,
        description: pillar.desc,
        image: `${SITE}${pillar.image}`,
        datePublished: pillar.date,
        dateModified: pillar.date,
        author: { '@type': 'Organization', name: AUTHOR.name, url: `${SITE}/about` },
        publisher: { '@type': 'Organization', name: LEGAL, logo: { '@type': 'ImageObject', url: `${SITE}/images/logo.png` } },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}${url}` },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Custom abrasive brush segment manufacture for shot blast machines',
        provider: { '@type': 'Organization', name: LEGAL, url: `${SITE}/` },
        areaServed,
      },
    ],
    body,
  });
}

/* ------------------------------------------------------------------ */
/* Solutions (/services)                                               */
/* ------------------------------------------------------------------ */

function solutionsPage() {
  const trail = [{ name: 'Home', url: '/' }, { name: 'Solutions', url: '/services' }];
  const body = `    <section class="page-head">
      <div class="wrap">
        ${breadcrumbs(trail)}
        <h1>Sourcing and supply solutions</h1>
        <p class="lede">Products are what we supply. Solutions are how we help: locating hard-to-find parts, matching OEM numbers, building to drawing and keeping supply predictable.</p>
        <nav class="jump" aria-label="Solutions">
${solutions.map((s) => `          <a href="#${s.id}">${esc(s.name)}</a>`).join('\n')}
        </nav>
      </div>
    </section>

    <section class="section">
      <div class="wrap sol-list">
${solutions
  .map(
    (s, i) => `        <article class="sol" id="${s.id}" aria-labelledby="${s.id}-h">
          <div class="sol-head">
            <span class="num">${String(i + 1).padStart(2, '0')}</span>
            ${icon(s.icon, 'i-lg')}
            <h2 id="${s.id}-h">${esc(s.name)}</h2>
          </div>
          <div class="sol-body">
            <p>${esc(s.summary)}</p>
            <ul class="ticks">
${s.points.map((pt) => `              <li>${icon('check', 'i-sm')} ${esc(pt)}</li>`).join('\n')}
            </ul>
${s.products.length ? `            <p class="sol-links"><span>Related products:</span> ${s.products.map((sl) => `<a href="/products/${sl}">${esc(productBySlug(sl).name)}</a>`).join(' · ')}</p>\n` : ''}            <a class="link-arrow" href="/request-quote?type=${s.id}">Discuss ${esc(s.name.toLowerCase())} ${icon('arrow-right')}</a>
          </div>
        </article>`
  )
  .join('\n')}
      </div>
    </section>

    <section class="section alt" aria-labelledby="how-h">
      <div class="wrap">
${sectionHead({ eyebrow: 'How it works', title: 'From requirement to delivery', id: 'how-h' })}
        <ol class="process">
${process.map(([t, d], i) => `          <li><span class="num">${String(i + 1).padStart(2, '0')}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('\n')}
        </ol>
      </div>
    </section>

    ${identifyPart()}

    ${ctaBand()}`;

  return page({
    path: '/services',
    title: 'Industrial Sourcing & Supply Solutions UAE | Mechaura',
    desc: 'Technical sourcing, OEM cross-reference, custom brush manufacturing, hydraulic hose assembly, emergency and scheduled supply, and procurement support across the UAE and GCC.',
    keywords: 'Industrial Supply Services UAE, Technical Sourcing Dubai, OEM Cross Reference UAE, Hose Assembly Dubai, Custom Brush Manufacturing UAE',
    ogImage: '/images/brush-product.png',
    active: 'solutions',
    trail,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Industrial supply solutions',
        itemListElement: solutions.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: { '@type': 'Service', name: s.name, description: s.summary, url: `${SITE}/services#${s.id}`, provider: { '@type': 'Organization', name: LEGAL }, areaServed },
        })),
      },
    ],
    body,
  });
}

/* ------------------------------------------------------------------ */
/* Industries                                                          */
/* ------------------------------------------------------------------ */

function sectorsHub() {
  const trail = [{ name: 'Home', url: '/' }, { name: 'Industries', url: '/sectors' }];
  const body = `    <section class="page-head">
      <div class="wrap">
        ${breadcrumbs(trail)}
        <h1>Industries we supply</h1>
        <p class="lede">Each sector fails in its own way — heat and dust in oil and gas, impulse loads on construction plant, door faults in buildings. We specify consumables for those conditions.</p>
      </div>
    </section>

    <section class="section">
      <div class="wrap sector-list">
${sectors
  .map(
    (s) => `        <article class="sector-row">
          <a class="sector-media" href="/sectors/${s.slug}" tabindex="-1" aria-hidden="true">${img({ src: s.image, alt: '', sizes: '(min-width: 900px) 420px, 92vw' })}</a>
          <div>
            <h2><a href="/sectors/${s.slug}">${esc(s.name)}</a></h2>
            <p>${esc(s.summary)}</p>
            <ul class="chips chips-link">
${s.products.map((sl) => `              <li><a href="/products/${sl}">${esc(productBySlug(sl).short)}</a></li>`).join('\n')}
            </ul>
            <div class="btn-row">
              <a class="link-arrow" href="/sectors/${s.slug}">${esc(s.short)} supply ${icon('arrow-right')}</a>
              <a class="link-quiet" href="/request-quote?sector=${s.slug}">Request sector quotation</a>
            </div>
          </div>
        </article>`
  )
  .join('\n')}
      </div>
    </section>

    <section class="section alt" aria-labelledby="v-h">
      <div class="wrap">
${sectionHead({ eyebrow: 'In operation', title: 'Our range at work', id: 'v-h' })}
        ${videoGrid()}
      </div>
    </section>

    ${ctaBand()}`;

  return page({
    path: '/sectors',
    title: 'Industries We Serve | Industrial Supplier UAE | Mechaura',
    desc: 'Industrial supply for UAE manufacturing, oil & gas, construction, automotive, engineering and fabrication, and facility management — specified for each sector’s operating conditions.',
    keywords: 'Industrial Sectors UAE, Oil and Gas Supplies Dubai, Construction Equipment UAE, Manufacturing Spares UAE, Automotive Industrial Tools',
    ogImage: '/images/industries/manufacturing.webp',
    active: 'industries',
    trail,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Industries we supply',
        url: `${SITE}/sectors`,
        mainEntity: { '@type': 'ItemList', itemListElement: sectors.map((s, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/sectors/${s.slug}`, name: s.name })) },
      },
    ],
    body,
  });
}

function sectorPage(s) {
  const url = `/sectors/${s.slug}`;
  const trail = [{ name: 'Home', url: '/' }, { name: 'Industries', url: '/sectors' }, { name: s.name, url }];
  const prods = s.products.map(productBySlug);
  const body = `    <section class="sector-hero">
      ${img({ src: s.image, alt: '', sizes: '100vw', priority: true, cls: 'sector-hero-img' })}
      <div class="wrap sector-hero-in">
        ${breadcrumbs(trail)}
        <p class="eyebrow eyebrow-light">Industry</p>
        <h1>${esc(s.name)}</h1>
        <p class="lede">${esc(s.summary)}</p>
        <div class="btn-row">
          ${btn('Request sector quotation', `/request-quote?sector=${s.slug}`, 'primary', 'file', ' data-rfq-link')}
          ${btn('WhatsApp an Engineer', waLink(`Hello Mechaura, I need supplies for ${s.name}.`), 'ghost-light', 'whatsapp', ' target="_blank" rel="noopener" data-track="whatsapp_click"')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap two-col">
        <div class="prose">
          <h2>Overview</h2>
          <p>${esc(s.overview)}</p>
          <h2>Typical applications</h2>
          <ul>
${s.applications.map((a) => `            <li>${esc(a)}</li>`).join('\n')}
          </ul>
        </div>
        <aside class="req-box">
          <h2>Common requirements</h2>
          <ul class="ticks">
${s.requirements.map((r) => `            <li>${icon('check', 'i-sm')} ${esc(r)}</li>`).join('\n')}
          </ul>
        </aside>
      </div>
    </section>

    <section class="section alt" aria-labelledby="sp-h">
      <div class="wrap">
${sectionHead({ eyebrow: 'Relevant products', title: `Products for ${esc(s.short.toLowerCase())}`, id: 'sp-h' })}
        ${productGrid(prods)}
      </div>
    </section>

    <section class="section" aria-labelledby="tc-h">
      <div class="wrap">
${sectionHead({ eyebrow: 'Technical considerations', title: 'What we check before we quote', id: 'tc-h' })}
        <div class="consider">
${s.considerations.map(([t, d]) => `          <div><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('\n')}
        </div>
        <div class="related-guides">
          <h3>Related technical guides</h3>
          <ul>
${s.guides.map((g) => `            <li><a href="/blog/${g}">${esc(articleBySlug(g).headline)} ${icon('arrow-right', 'i-sm')}</a></li>`).join('\n')}
          </ul>
        </div>
      </div>
    </section>

    ${ctaBand({ title: `Supplying ${esc(s.short.toLowerCase())}?`, text: 'Send your consumables list, a part number or a photo. We return an itemised quotation with lead times per line.' })}`;

  return page({
    path: url,
    title: s.title,
    desc: s.metaDesc,
    ogImage: s.image,
    active: 'industries',
    trail,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: `Industrial supply for ${s.name}`,
        description: s.metaDesc,
        url: `${SITE}${url}`,
        provider: { '@type': 'Organization', name: LEGAL, url: `${SITE}/` },
        areaServed,
      },
    ],
    body,
  });
}

/* ------------------------------------------------------------------ */
/* Brands                                                              */
/* ------------------------------------------------------------------ */

function brandsPage() {
  const trail = [{ name: 'Home', url: '/' }, { name: 'Brands', url: '/brands' }];
  const byBrand = brandList.map((b) => [b, products.filter((p) => p.brands.includes(b))]);
  const body = `    <section class="page-head">
      <div class="wrap">
        ${breadcrumbs(trail)}
        <h1>Brands we source</h1>
        <p class="lede">We quote genuine manufacturer stock where it is available and dimensional equivalents where they make technical and commercial sense. Every quotation states which is which.</p>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="brand-table">
${byBrand
  .map(
    ([b, ps]) => `          <div class="brand-row" id="${slugify(b)}">
            <h2>${esc(b)}</h2>
            <p>${ps.length ? ps.map((p) => `<a href="/products/${p.slug}">${esc(p.name)}</a>`).join(', ') : 'Quoted on request'}</p>
            <a class="link-quiet" href="/request-quote?brand=${encodeURIComponent(b)}">Quote a ${esc(b)} part</a>
          </div>`
  )
  .join('\n')}
        </div>
        <aside class="callout">${icon('info')}<p>${BRAND_DISCLAIMER} Brand names are listed to help you find the right product family. Where we propose an equivalent, it is a potential alternative until compatibility has been verified.</p></aside>
      </div>
    </section>

    <section class="section alt" aria-labelledby="x-h">
      <div class="wrap two-col">
        <div>
          <p class="eyebrow">OEM cross-reference</p>
          <h2 id="x-h">Have a part number from one of these brands?</h2>
          <p>Send it with the quantity. We return the genuine item where available and any equivalent, with the dimensions and ratings stated so you can compare like for like.</p>
        </div>
        <form class="xref" action="/request-quote" data-xref>
          <input type="hidden" name="type" value="crossref">
          <label for="bx-part">OEM part number</label>
          <div class="xref-row">
            <input id="bx-part" name="part" type="text" spellcheck="false" autocomplete="off" placeholder="e.g. SKF 6310-2RS" required>
            <button class="btn btn-dark" type="submit">Request verification</button>
          </div>
          <p class="hint">${icon('info', 'i-sm')} Potential alternatives are subject to technical verification.</p>
        </form>
      </div>
    </section>

    ${ctaBand()}`;

  return page({
    path: '/brands',
    title: 'Industrial Brands We Source | SKF, Parker, Osborn | Mechaura',
    desc: 'Genuine brand stock and verified equivalents for bearings, hydraulics, brushes, bandsaw blades and cutting tools in the UAE — SKF, FAG, NSK, Timken, Parker, Gates, Osborn and more.',
    ogImage: '/images/logo.png',
    active: 'brands',
    trail,
    body,
  });
}

/* ------------------------------------------------------------------ */
/* Resources: blog, articles, FAQ                                      */
/* ------------------------------------------------------------------ */

function blogIndex() {
  const trail = [{ name: 'Home', url: '/' }, { name: 'Technical Guides', url: '/blog' }];
  const cats = [...new Set(articleMeta.map((a) => a.category))];
  const body = `    <section class="page-head">
      <div class="wrap">
        ${breadcrumbs(trail)}
        <h1>Technical guides</h1>
        <p class="lede">Practical guidance on selection, maintenance and failure prevention — written for maintenance engineers, production managers and buyers working in Gulf conditions.</p>
        <div class="tabs-filter" role="group" aria-label="Filter guides by category" data-article-filter hidden>
          <button type="button" aria-pressed="true" data-cat="">All</button>
${cats.map((c) => `          <button type="button" aria-pressed="false" data-cat="${esc(c)}">${esc(c)}</button>`).join('\n')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="a-grid" data-article-grid>
          ${articleMeta.map((a) => articleCard(a, readTime(a.slug))).join('\n          ')}
        </div>
        <aside class="cat-pillar">
          ${img({ src: '/images/sp.webp', alt: '', sizes: '200px', width: 200 })}
          <div>
            <p class="eyebrow">Selection guide</p>
            <h2><a href="/${pillar.slug}">Abrasive brushes for shot blast machines</a></h2>
            <p>Fill materials, blow-off function and how to specify a replacement segment.</p>
          </div>
        </aside>
      </div>
    </section>

    ${ctaBand({ title: 'Need help selecting the right specification?', text: 'Our technical desk can review your application and recommend the right grade, size or equivalent.' })}
    <script>
      // Guides used to open in a modal at /blog?article=article-N. Send those links to the article page.
      (function () {
        var map = ${JSON.stringify(legacyArticleKeys)};
        var key = new URLSearchParams(location.search).get('article');
        if (key && map[key]) location.replace('/blog/' + map[key]);
      })();
    </script>`;

  return page({
    path: '/blog',
    title: 'Technical Guides | Industrial Knowledge Base | Mechaura UAE',
    desc: 'Technical guides on abrasive brush segments, hydraulic hose failure, elevator spares inspection, bearing selection, bandsaw blades and industrial air filtration in UAE conditions.',
    keywords: 'Industrial Engineering Blog UAE, Abrasive Brush Guide Dubai, Hydraulic Hose Maintenance UAE, Elevator Spares Dubai Guide, Industrial Bearings Selection UAE',
    ogImage: '/images/brush-product.png',
    active: 'resources',
    trail,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: `${BRAND} Technical Guides`,
        url: `${SITE}/blog`,
        blogPost: articleMeta.map((a) => ({ '@type': 'BlogPosting', headline: a.headline, url: `${SITE}/blog/${a.slug}`, datePublished: ARTICLE_PUBLISHED })),
      },
    ],
    body,
  });
}

function articlePage(m) {
  const url = `/blog/${m.slug}`;
  const trail = [{ name: 'Home', url: '/' }, { name: 'Technical Guides', url: '/blog' }, { name: m.headline, url }];
  const a = articles[m.slug];
  const toc = a.blocks.filter(([t]) => t === 'h2').map(([, v]) => [slugify(v), plain(v)]);
  const faqs = articleFaqs(m.slug);
  const prods = m.products.map(productBySlug);
  const others = articleMeta.filter((x) => x.slug !== m.slug).slice(0, 3);
  const minutes = readTime(m.slug);

  const body = `    <section class="page-head article-head">
      <div class="wrap">
        ${breadcrumbs(trail)}
        <p class="eyebrow">${esc(m.category)}</p>
        <h1>${esc(m.headline)}</h1>
        <p class="meta"><span>${AUTHOR.name}</span><span>Updated <time datetime="${ARTICLE_MODIFIED}">26 August 2026</time></span><span>${minutes} min read</span></p>
      </div>
    </section>

    <div class="wrap article-layout">
      <article class="prose">
        <aside class="tldr"><strong>In short</strong><p>${a.tldr}</p></aside>
${renderBlocks(a.blocks)}

        <section class="spec-help" aria-labelledby="sh-h">
          <h2 id="sh-h">Need help selecting the right specification?</h2>
          <p>Send the application, the part you use today or a photo. We’ll recommend the right grade and quote it line by line.</p>
          <div class="btn-row">
            ${btn('Request technical quote', `/request-quote?product=${m.products[0]}`, 'primary', 'file', ' data-rfq-link')}
            ${btn('WhatsApp an Engineer', waLink(`Hello Mechaura, I read your guide "${plain(m.headline)}" and have a question.`), 'wa', 'whatsapp', ' target="_blank" rel="noopener" data-track="whatsapp_click"')}
          </div>
        </section>

        <div class="author">
          <span class="author-mark" aria-hidden="true">M</span>
          <div><strong>${AUTHOR.name}</strong><span>${AUTHOR.role}</span><p>${AUTHOR.bio}</p></div>
        </div>
      </article>

      <aside class="article-aside">
${toc.length ? `        <nav class="toc" aria-label="Contents">
          <h2>Contents</h2>
          <ol>
${toc.map(([id, t]) => `            <li><a href="#${id}">${esc(t)}</a></li>`).join('\n')}
          </ol>
        </nav>` : ''}
        <div class="aside-links">
          <h2>Products in this guide</h2>
          <ul>
${prods.map((p) => `            <li><a href="/products/${p.slug}">${esc(p.name)}</a></li>`).join('\n')}
          </ul>
          ${btn('Request a quote', `/request-quote?product=${m.products[0]}`, 'primary', 'file', ' data-rfq-link')}
        </div>
      </aside>
    </div>

    <section class="section alt" aria-labelledby="rp-h">
      <div class="wrap">
${sectionHead({ eyebrow: 'Related products', title: 'Products discussed in this guide', id: 'rp-h' })}
        ${productGrid(prods)}
        <div class="related-guides">
          <h3>More technical guides</h3>
          <ul>
${others.map((o) => `            <li><a href="/blog/${o.slug}">${esc(o.headline)} ${icon('arrow-right', 'i-sm')}</a></li>`).join('\n')}
          </ul>
        </div>
      </div>
    </section>`;

  return page({
    path: url,
    title: m.title,
    desc: m.desc,
    keywords: m.keywords,
    ogImage: m.image,
    ogType: 'article',
    article: { published: ARTICLE_PUBLISHED, modified: ARTICLE_MODIFIED, section: m.category },
    active: 'resources',
    trail,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: m.headline,
        description: m.desc,
        image: `${SITE}${m.image}`,
        datePublished: ARTICLE_PUBLISHED,
        dateModified: ARTICLE_MODIFIED,
        author: { '@type': 'Organization', name: AUTHOR.name, url: `${SITE}/about` },
        publisher: { '@type': 'Organization', name: LEGAL, logo: { '@type': 'ImageObject', url: `${SITE}/images/logo.png` } },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}${url}` },
        articleSection: m.category,
        inLanguage: 'en-AE',
      },
      faqs.length ? faqSchema(faqs) : null,
    ],
    body,
  });
}

function faqPage() {
  const trail = [{ name: 'Home', url: '/' }, { name: 'FAQs', url: '/faq' }];
  const body = `    <section class="page-head">
      <div class="wrap">
        ${breadcrumbs(trail)}
        <h1>Frequently asked questions</h1>
        <p class="lede">Ordering, delivery and cross-referencing first, then technical questions for each product family.</p>
        <nav class="jump" aria-label="FAQ sections">
          <a href="#general">General</a>
${products.map((p) => `          <a href="#faq-${p.slug}">${esc(p.short)}</a>`).join('\n')}
        </nav>
      </div>
    </section>

    <section class="section">
      <div class="wrap narrow faq-page">
        <h2 id="general">Ordering &amp; delivery</h2>
        ${faqList(generalFaqs)}
${products
  .map(
    (p) => `        <h2 id="faq-${p.slug}">${esc(p.name)}</h2>
        ${faqList(p.faqs)}
        <p class="faq-more"><a class="link-arrow" href="/products/${p.slug}">${esc(p.name)} ${icon('arrow-right')}</a></p>`
  )
  .join('\n')}
      </div>
    </section>

    ${ctaBand({ title: 'Question not answered here?', text: 'Our technical desk answers specification and sourcing questions directly.' })}`;

  return page({
    path: '/faq',
    title: 'Industrial Supply FAQs | Ordering, Delivery & Products',
    desc: 'Answers on ordering, UAE and GCC delivery, OEM cross-referencing and product selection for brushes, hydraulics, bearings, blades, cutting tools, elevator spares and filters.',
    active: 'resources',
    trail,
    schema: [faqSchema(generalFaqs)],
    body,
  });
}

/* ------------------------------------------------------------------ */
/* Company                                                             */
/* ------------------------------------------------------------------ */

function aboutPage() {
  const trail = [{ name: 'Home', url: '/' }, { name: 'About', url: '/about' }];
  const body = `    <section class="page-head">
      <div class="wrap">
        ${breadcrumbs(trail)}
        <h1>About Mechaura International</h1>
        <p class="lede">A Dubai-based trading and distribution company supplying industrial equipment, tools and specialised brushes to businesses across the UAE and GCC.</p>
      </div>
    </section>

    <section class="section">
      <div class="wrap two-col">
        <div class="prose">
          <h2>Who we are</h2>
          <p>Mechaura International specialises in the distribution of industrial equipment, tools and specialised brushes in the UAE. We work with manufacturers internationally to supply products that are reliable, durable and cost-effective.</p>
          <p>Our goal is simple: reliable supply, competitive pricing and efficient operations for businesses in manufacturing, construction, automotive, oil and gas, fabrication and facility management.</p>
          <p>We are a supplier rather than a brand agent. That lets us quote genuine manufacturer stock and verified equivalents side by side, and state plainly on every line which is which.</p>
        </div>
        <aside class="facts">
          <h2>Company facts</h2>
          <dl>
            <div><dt>Legal entity</dt><dd>${LEGAL}</dd></div>
            <div><dt>Headquarters</dt><dd>${HQ}</dd></div>
            <div><dt>Service region</dt><dd>All seven Emirates and the GCC</dd></div>
            <div><dt>Product families</dt><dd>${products.length}</dd></div>
            <div><dt>Industries served</dt><dd>${sectors.length}</dd></div>
            <div><dt>Hours</dt><dd>${esc(HOURS)}</dd></div>
          </dl>
        </aside>
      </div>
    </section>

    <section class="section alt" id="quality" aria-labelledby="q-h">
      <div class="wrap">
${sectionHead({ eyebrow: 'Quality & inspection', title: 'How we check what we ship', id: 'q-h', intro: 'Quality is a process, not a claim. These are the steps every order goes through.' })}
        <ol class="process">
          <li><span class="num">01</span><h3>Sourced to specification</h3><p>Each line is sourced against the grade, size and standard on your enquiry, with any equivalent identified as such.</p></li>
          <li><span class="num">02</span><h3>Checked on arrival</h3><p>Stock is checked against the datasheet — dimensions, markings and batch traceability where the product carries it.</p></li>
          <li><span class="num">03</span><h3>Inspected before dispatch</h3><p>Items undergo standard dimensional and visual inspection before crating. Hose assemblies are pressure-tested in house.</p></li>
          <li><span class="num">04</span><h3>Documented on delivery</h3><p>Test certificates, MTCs and certificates of origin supplied on request, with batch numbers recorded where applicable.</p></li>
        </ol>
      </div>
    </section>

    <section class="section" aria-labelledby="p-h">
      <div class="wrap">
${sectionHead({ eyebrow: 'Principles', title: 'Operational differences, not slogans', id: 'p-h' })}
        <ol class="num-grid">
${principles.map(([t, d], i) => `          <li><span class="num">${String(i + 1).padStart(2, '0')}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('\n')}
        </ol>
      </div>
    </section>

    <section class="section alt" aria-labelledby="t-h">
      <div class="wrap">
${sectionHead({ eyebrow: 'Customer feedback', title: 'What maintenance and production teams say', id: 't-h' })}
        ${testimonials()}
      </div>
    </section>

    ${ctaBand()}`;

  return page({
    path: '/about',
    title: 'About Mechaura International | Industrial Supplier UAE',
    desc: 'Mechaura International FZE LLC is a Dubai-based industrial supply and trading company providing brushes, hydraulics, bearings, tooling and elevator spares across the UAE and GCC.',
    keywords: 'About Mechaura International, Industrial Trading Dubai, Industrial Equipment Supplier UAE, Engineering Spares Dubai',
    ogImage: '/images/about.png',
    active: 'company',
    trail,
    schema: [{ '@context': 'https://schema.org', '@type': 'AboutPage', name: 'About Mechaura International', url: `${SITE}/about`, mainEntity: { '@id': `${SITE}/#organization` } }, orgSchema],
    body,
  });
}

function contactPage() {
  const trail = [{ name: 'Home', url: '/' }, { name: 'Contact', url: '/contact' }];
  const body = `    <section class="page-head">
      <div class="wrap">
        ${breadcrumbs(trail)}
        <h1>Contact our technical sales desk</h1>
        <p class="lede">Questions, quotations, datasheets and delivery updates. For detailed requirements with drawings or several lines, use the full <a href="/request-quote">request for quotation</a>.</p>
      </div>
    </section>

    <section class="section">
      <div class="wrap contact-grid">
        <div class="contact-info">
          <h2>Direct contacts</h2>
          ${contactLines()}
          <dl class="facts-list">
            <div><dt>${icon('map-pin', 'i-sm')} Location</dt><dd>${HQ}</dd></div>
            <div><dt>${icon('clock', 'i-sm')} Hours</dt><dd>${esc(HOURS)}</dd></div>
            <div><dt>${icon('globe', 'i-sm')} Coverage</dt><dd>All seven Emirates and export to ${gccMarkets.join(', ')}</dd></div>
          </dl>
          ${deliveryBlock()}
        </div>
        <div class="rfq-card">
          <h2>Send an enquiry</h2>
          ${rfqCompact({ mode: 'contact', title: 'Send enquiry' })}
        </div>
      </div>
    </section>`;

  return page({
    path: '/contact',
    title: 'Contact Us & Request Quotes | Mechaura International Dubai',
    desc: 'Contact Mechaura International FZE LLC in Dubai, UAE. Phone, WhatsApp and email for quotations on brushes, hydraulics, bearings, cutting tools, elevator spares and filtration.',
    keywords: 'Contact Mechaura International, Industrial Supplies Quote Dubai, Elevator Spares Dubai Contact, Industrial Brush Supplier UAE Phone',
    active: 'company',
    trail,
    schema: [{ '@context': 'https://schema.org', '@type': 'ContactPage', name: 'Contact Mechaura International', url: `${SITE}/contact`, mainEntity: { '@id': `${SITE}/#organization` } }, orgSchema],
    body,
  });
}

function requestQuotePage() {
  const trail = [{ name: 'Home', url: '/' }, { name: 'Request a Quote', url: '/request-quote' }];
  const body = `    <section class="page-head">
      <div class="wrap">
        ${breadcrumbs(trail)}
        <h1>Request a quotation</h1>
        <p class="lede">Tell us what you need — a part number, a description or just a photo of the old part. We’ll come back with an itemised quote stating grade, size, standard and lead time for each line.</p>
      </div>
    </section>

    <section class="section rfq-section">
      <div class="wrap rfq-layout">
        <div class="rfq-card rfq-card-full">
          ${rfqFull()}
        </div>
        <aside class="rfq-side">
          <h2>What happens next</h2>
          <ol class="mini-steps">
${process.slice(1).map(([t, d]) => `            <li><strong>${esc(t)}</strong>${esc(d)}</li>`).join('\n')}
          </ol>
          <h2>Prefer to talk?</h2>
          ${contactLines()}
        </aside>
      </div>
    </section>`;

  return page({
    path: '/request-quote',
    title: 'Request a Quote | Industrial Components UAE | Mechaura',
    desc: 'Request a quotation for industrial components in the UAE and GCC. Attach drawings, photos or datasheets; we reply with an itemised quote stating grade, size and lead time.',
    active: null,
    trail,
    actionBar: false,
    body,
  });
}

/* ------------------------------------------------------------------ */
/* Location pages                                                      */
/* ------------------------------------------------------------------ */

function locationPage(loc) {
  const url = `/industrial-supplies-${loc.slug}`;
  const trail = [{ name: 'Home', url: '/' }, { name: `Industrial Supplier in ${loc.city}`, url }];
  const zone = loc.slug === 'abu-dhabi' ? 'Abu Dhabi & Al Ain' : 'Dubai & Sharjah';
  const faqs = [
    [`Do you deliver industrial supplies across ${loc.city}?`, `Yes. We dispatch to all industrial areas of ${loc.city}, including ${loc.areas.slice(0, 3).join(', ')}. Stock lines ordered before midday are generally delivered the same working day, and we schedule recurring deliveries for customers with regular consumable requirements.`],
    [`What industrial products do you supply in ${loc.city}?`, 'Our range covers abrasive removal brush segments, hydraulic hoses and fittings, industrial bearings, bandsaw blades, CNC cutting tools, elevator accessories, industrial air filters and hydraulic pumps. Where an item sits outside the standard catalogue we source or manufacture it to drawing.'],
    [`Can I get a quote for a bulk industrial supply contract in ${loc.city}?`, 'Yes. Send your consumable list with annual or quarterly volumes and we will return itemised pricing with lead times per line. For customers on scheduled supply we hold agreed stock levels so that fast-moving items are available on call-off.'],
    ['Are you an authorised industrial supplier in the UAE?', `${LEGAL} is a UAE-registered FZE LLC trading and distribution company supplying industrial consumables and equipment. We supply genuine brand stock alongside dimensional equivalents, and state clearly on every quotation which is which.`],
  ];
  const body = `    <section class="page-head">
      <div class="wrap">
        ${breadcrumbs(trail)}
        <p class="eyebrow">${esc(loc.city)}, United Arab Emirates</p>
        <h1>Industrial supplier in ${esc(loc.city)}</h1>
        <p class="lede">${esc(loc.intro)}</p>
        <div class="btn-row">
          ${btn('Request a Quote', '/request-quote', 'primary', 'file', ' data-rfq-link')}
          ${btn(PHONE, `tel:${PHONE_RAW}`, 'ghost', 'phone', ' data-track="phone_click"')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap two-col">
        <div class="prose">
          <h2>How we serve ${esc(loc.city)}</h2>
          <p>${esc(loc.focus)}</p>
          <h2>Who we supply here</h2>
          <p>${esc(loc.sectors)}</p>
          <h2 id="gcc-supply">Beyond ${esc(loc.city)}</h2>
          <p>We also serve ${locations.filter((l) => l.slug !== loc.slug).map((l) => `<a href="/industrial-supplies-${l.slug}">${l.city}</a>`).join(' and ')}, the northern Emirates, and export across the GCC to ${gccMarkets.join(', ')}.</p>
        </div>
        <aside class="req-box">
          <h2>Industrial areas we cover</h2>
          <ul class="ticks">
${loc.areas.map((a) => `            <li>${icon('map-pin', 'i-sm')} ${esc(a)}</li>`).join('\n')}
          </ul>
          <p class="fine"><strong>${zone}:</strong> see our <a href="/delivery-policy#uae-delivery">Delivery Policy</a> for dispatch times.</p>
        </aside>
      </div>
    </section>

    <section class="section alt" aria-labelledby="lp-h">
      <div class="wrap">
${sectionHead({ eyebrow: 'Our range', title: `Products supplied in ${esc(loc.city)}`, id: 'lp-h' })}
        ${productGrid(products)}
      </div>
    </section>

    <section class="section" aria-labelledby="lf-h">
      <div class="wrap narrow">
${sectionHead({ eyebrow: 'FAQ', title: `Supplying ${esc(loc.city)}: common questions`, id: 'lf-h' })}
        ${faqList(faqs)}
      </div>
    </section>

    ${ctaBand()}`;

  return page({
    path: url,
    title: loc.title,
    desc: loc.metaDesc,
    keywords: loc.keywords,
    ogImage: '/assets/hero_equipment.png',
    active: null,
    trail,
    schema: [
      faqSchema(faqs),
      {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: `${LEGAL} — ${loc.city}`,
        description: loc.metaDesc,
        url: `${SITE}${url}`,
        telephone: PHONE_RAW,
        email: EMAIL,
        image: `${SITE}/images/logo.png`,
        address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressRegion: 'Dubai', addressCountry: 'AE' },
        areaServed: loc.areas.map((a) => ({ '@type': 'Place', name: `${a}, ${loc.city}` })),
        parentOrganization: { '@type': 'Organization', name: LEGAL, url: `${SITE}/` },
      },
    ],
    body,
  });
}

/* ------------------------------------------------------------------ */
/* Legal                                                               */
/* ------------------------------------------------------------------ */

function legalPage(l) {
  const url = `/${l.slug}`;
  const trail = [{ name: 'Home', url: '/' }, { name: l.name, url }];
  const content = readFileSync(join(ROOT, 'tools/content/legal', `${l.slug}.html`), 'utf8');
  const toc = [...content.matchAll(/<section class="legal-block" id="([^"]+)">\s*<h2>([\s\S]*?)<\/h2>/g)].map((m) => [m[1], plain(m[2])]);
  const body = `    <section class="page-head">
      <div class="wrap">
        ${breadcrumbs(trail)}
        <p class="eyebrow">${esc(l.eyebrow)}</p>
        <h1>${esc(l.name)}</h1>
        <p class="lede">${esc(l.intro)}</p>
        <p class="meta"><span>Last updated: August 2026</span></p>
      </div>
    </section>

    <div class="wrap article-layout legal">
      <article class="prose">
${content}
      </article>
      <aside class="article-aside">
        <nav class="toc" aria-label="Contents">
          <h2>Contents</h2>
          <ol>
${toc.map(([id, t]) => `            <li><a href="#${id}">${esc(t.replace(/^\d+\.\s*/, ''))}</a></li>`).join('\n')}
          </ol>
        </nav>
        <div class="aside-links">
          <h2>Other policies</h2>
          <ul>
${legalPages.filter((x) => x.slug !== l.slug).map((x) => `            <li><a href="/${x.slug}">${esc(x.name)}</a></li>`).join('\n')}
          </ul>
        </div>
      </aside>
    </div>`;

  return page({ path: url, title: l.title, desc: l.desc, keywords: l.keywords, active: 'company', trail, body });
}

/* ------------------------------------------------------------------ */
/* 404 and legacy product-detail                                       */
/* ------------------------------------------------------------------ */

function notFound() {
  const body = `    <section class="nf">
      <div class="wrap narrow">
        <p class="eyebrow">Error 404</p>
        <h1>We couldn’t find that page</h1>
        <p class="lede">The link may be out of date. Try searching our products, or go back to the homepage.</p>
        <form class="hero-search nf-search" role="search" action="/products" data-inline-search>
          <label class="sr-only" for="nf-q">Search products</label>
          ${icon('search')}
          <input id="nf-q" name="q" type="search" autocomplete="off" placeholder="Search by product, part number or brand…" data-search-input>
          <button class="btn btn-primary" type="submit">Search products</button>
          <div class="search-results search-pop" data-search-results aria-live="polite"></div>
        </form>
        <div class="btn-row">
          ${btn('Back to Home', '/', 'ghost', 'arrow-left')}
          ${btn('Request a Quote', '/request-quote', 'ghost', 'file')}
        </div>
        <h2>Popular pages</h2>
        <ul class="chips chips-link">
${products.map((p) => `          <li><a href="/products/${p.slug}">${esc(p.short)}</a></li>`).join('\n')}
        </ul>
      </div>
    </section>
    <script>
      // Old addresses ended in .html (/about.html). The site now serves clean URLs
      // (/about), so forward those. No redirect stub can live at /about.html:
      // GitHub Pages would serve it for /about too, which loops.
      (function () {
        var path = location.pathname;
        if (!/\\.html$/.test(path) || /\\/(404|index)\\.html$/.test(path)) return;
        location.replace(path.replace(/\\.html$/, '') + location.search + location.hash);
      })();
    </script>`;
  return page({
    path: '/404',
    title: 'Page Not Found | Mechaura International',
    desc: 'The page you requested could not be found. Search Mechaura International’s industrial supply range or contact our technical desk in Dubai, UAE.',
    noindex: true,
    body,
  });
}

/** /product-detail?id=<legacyId> was the old product URL. Forward to /products/<slug>. */
function legacyProductDetail() {
  const map = Object.fromEntries(products.map((p) => [p.legacyId, p.slug]));
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Redirecting… | Mechaura International</title>
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${SITE}/products">
  <script>
    (function () {
      var map = ${JSON.stringify(map)};
      var id = new URLSearchParams(location.search).get('id');
      location.replace(map[id] ? '/products/' + map[id] : '/products');
    })();
  </script>
  <meta http-equiv="refresh" content="0; url=/products">
</head>
<body>
  <p>This page has moved. <a href="/products">View the product catalogue</a>.</p>
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* Search index                                                        */
/* ------------------------------------------------------------------ */

function searchIndex() {
  const thumb = (src) => {
    const w = webp(src);
    return `/_r${decodeURI(w).replace(/\.webp$/, '')}-480.webp`.replace(/ /g, '-');
  };
  const entries = [
    ...products.map((p) => ({
      k: 'Product', t: p.name, u: `/products/${p.slug}`, c: groupName(p.group), i: thumb(p.hero),
      d: `${p.specs[0][0]}: ${p.specs[0][1]}`,
      s: [p.short, p.category, ...p.types, ...p.brands, ...p.specs.flat(), p.keywords].join(' '),
    })),
    { k: 'Product', t: 'Shot Blast Machine Brushes', u: `/${pillar.slug}`, c: 'Surface Treatment', i: '/_r/images/sp-480.webp', d: 'Built to drawing for any blast machine frame', s: 'shot blast blow-off wheel blast plate blast brush segment' },
    ...products.flatMap((p) => p.types.map((t) => ({ k: 'Product type', t, u: `/products?type=${encodeURIComponent(t)}`, c: p.name, s: p.short }))),
    ...[...new Set(products.flatMap((p) => p.brands))].map((b) => ({
      k: 'Brand', t: b, u: `/products?brand=${encodeURIComponent(b)}`, c: products.filter((p) => p.brands.includes(b)).map((p) => p.short).join(', '), s: '',
    })),
    ...sectors.map((s) => ({ k: 'Industry', t: s.name, u: `/sectors/${s.slug}`, c: 'Industry', s: s.summary })),
    ...solutions.map((s) => ({ k: 'Solution', t: s.name, u: `/services#${s.id}`, c: 'Solution', s: s.summary })),
    ...articleMeta.map((a) => ({ k: 'Guide', t: a.headline, u: `/blog/${a.slug}`, c: a.category, s: a.desc })),
    { k: 'Page', t: 'Delivery & Shipping Policy', u: '/delivery-policy', c: 'Company', s: 'delivery shipping dispatch gcc export lead time' },
    { k: 'Page', t: 'Request a Quote', u: '/request-quote', c: 'Company', s: 'rfq quotation price enquiry upload drawing' },
    { k: 'Page', t: 'Contact', u: '/contact', c: 'Company', s: 'phone email whatsapp address hours' },
  ];
  return JSON.stringify(entries);
}

/* ------------------------------------------------------------------ */
/* Sitemap                                                             */
/* ------------------------------------------------------------------ */

function sitemap(routes) {
  const priority = (u) =>
    u === '/' ? ['1.0', 'weekly'] : /^\/products/.test(u) || u === `/${pillar.slug}` ? ['0.9', 'weekly'] : /^\/blog\//.test(u) ? ['0.75', 'monthly'] : /policy|terms/.test(u) ? ['0.3', 'yearly'] : ['0.8', 'monthly'];
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((u) => {
    const [p, f] = priority(u);
    return `  <url>\n    <loc>${SITE}${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${f}</changefreq>\n    <priority>${p}</priority>\n  </url>`;
  })
  .join('\n')}
</urlset>
`;
}

/* ------------------------------------------------------------------ */
/* Write                                                               */
/* ------------------------------------------------------------------ */

const out = [
  ['index.html', '/', home()],
  ['products.html', '/products', catalogue()],
  ...products.map((p) => [`products/${p.slug}.html`, `/products/${p.slug}`, productPage(p)]),
  [`${pillar.slug}.html`, `/${pillar.slug}`, pillarPage()],
  ['services.html', '/services', solutionsPage()],
  ['sectors.html', '/sectors', sectorsHub()],
  ...sectors.map((s) => [`sectors/${s.slug}.html`, `/sectors/${s.slug}`, sectorPage(s)]),
  ['brands.html', '/brands', brandsPage()],
  ['blog.html', '/blog', blogIndex()],
  ...articleMeta.map((a) => [`blog/${a.slug}.html`, `/blog/${a.slug}`, articlePage(a)]),
  ['faq.html', '/faq', faqPage()],
  ['about.html', '/about', aboutPage()],
  ['contact.html', '/contact', contactPage()],
  ['request-quote.html', '/request-quote', requestQuotePage()],
  ...locations.map((l) => [`industrial-supplies-${l.slug}.html`, `/industrial-supplies-${l.slug}`, locationPage(l)]),
  ...legalPages.map((l) => [`${l.slug}.html`, `/${l.slug}`, legalPage(l)]),
  ['404.html', null, notFound()],
  ['product-detail.html', null, legacyProductDetail()],
];

for (const [file, , html] of out) {
  const p = join(ROOT, file);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, html, 'utf8');
}
writeFileSync(join(ROOT, 'public/search-index.json'), searchIndex(), 'utf8');
writeFileSync(join(ROOT, 'public/sitemap.xml'), sitemap(out.filter(([, r]) => r).map(([, r]) => r)), 'utf8');

const v = await writeImageVariants();
console.log(`${out.length} pages, search index and sitemap written. Image variants: ${v.made} generated, ${v.total} referenced.`);
