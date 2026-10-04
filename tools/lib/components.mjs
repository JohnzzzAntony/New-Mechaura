/**
 * Reusable page sections. Each returns an HTML string.
 */
import { PHONE, PHONE_RAW, EMAIL, RFQ, products, groups, delivery, gccMarkets, webp } from '../site-data.mjs';
import { articleMeta, sectors, testimonials as quotes } from '../content/site-content.mjs';
import { esc, icon, img } from './html.mjs';
import { waLink } from './layout.mjs';

export const groupName = (id) => groups.find((g) => g.id === id)?.name || '';
export const productBySlug = (slug) => products.find((p) => p.slug === slug);
export const sectorBySlug = (slug) => sectors.find((s) => s.slug === slug);
export const articleBySlug = (slug) => articleMeta.find((a) => a.slug === slug);

export const btn = (label, href, variant = 'primary', ic = '', extra = '') =>
  `<a class="btn btn-${variant}" href="${href}"${extra}>${ic ? icon(ic) + ' ' : ''}${label}</a>`;

export const sectionHead = ({ eyebrow, title, intro, id, action }) => `        <div class="s-head">
          <div>
${eyebrow ? `            <p class="eyebrow">${eyebrow}</p>\n` : ''}            <h2${id ? ` id="${id}"` : ''}>${title}</h2>
${intro ? `            <p class="s-intro">${intro}</p>\n` : ''}          </div>
${action ? `          ${action}\n` : ''}        </div>`;

/* ------------------------------------------------------------------ */
/* Product cards                                                       */
/* ------------------------------------------------------------------ */

const keySpec = (p) => p.specs[0];

export function productCard(p, { heading = 'h3', filters = false } = {}) {
  const [k, v] = keySpec(p);
  const data = filters
    ? ` data-group="${p.group}" data-industries="${p.industries.join(' ')}" data-brands="${esc(p.brands.join('|'))}" data-types="${esc(p.types.join('|'))}" data-text="${esc(
        [p.name, p.short, p.category, ...p.types, ...p.brands, ...p.specs.flat()].join(' ').toLowerCase()
      )}"`
    : '';
  return `<article class="p-card"${data}>
            <a class="p-card-media" href="/products/${p.slug}" tabindex="-1" aria-hidden="true">
              ${img({ src: webp(p.hero), alt: p.name, sizes: '(min-width: 1100px) 300px, (min-width: 640px) 45vw, 92vw' })}
            </a>
            <div class="p-card-body">
              <p class="p-card-cat">${esc(groupName(p.group))}</p>
              <${heading} class="p-card-title"><a href="/products/${p.slug}" data-track="product_category_click">${esc(p.name)}</a></${heading}>
              <dl class="p-card-spec"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></dl>
              <ul class="chips" aria-label="Product types">
${p.types.slice(0, 4).map((t) => `                <li>${esc(t)}</li>`).join('\n')}
              </ul>
              <div class="p-card-actions">
                <a class="link-arrow" href="/products/${p.slug}">View product ${icon('arrow-right')}</a>
                <a class="link-quiet" href="/request-quote?product=${p.slug}" data-rfq-link>Request quote</a>
              </div>
            </div>
          </article>`;
}

export const productGrid = (list, opts) => `<div class="p-grid">
          ${list.map((p) => productCard(p, opts)).join('\n          ')}
        </div>`;

/* ------------------------------------------------------------------ */
/* Specification table                                                 */
/* ------------------------------------------------------------------ */

export const specTable = (specs, caption) => `<div class="spec">
            <div class="spec-bar">
              <p class="spec-cap">${esc(caption)}</p>
              <button class="btn-text" type="button" data-copy-spec>${icon('copy', 'i-sm')} <span>Copy specification</span></button>
            </div>
            <table class="spec-table">
              <caption class="sr-only">${esc(caption)}</caption>
              <thead class="sr-only"><tr><th scope="col">Specification</th><th scope="col">Details</th></tr></thead>
              <tbody>
${specs.map(([k, v]) => `                <tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('\n')}
              </tbody>
            </table>
          </div>`;

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export const faqList = (faqs) => `<div class="faq">
${faqs
  .map(
    ([q, a]) => `          <details class="faq-item">
            <summary><span>${esc(q)}</span>${icon('chevron-down', 'i-sm')}</summary>
            <div class="faq-a"><p>${a}</p></div>
          </details>`
  )
  .join('\n')}
        </div>`;

export const faqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({
    '@type': 'Question',
    name: q.replace(/<[^>]*>/g, ''),
    acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]*>/g, '') },
  })),
});

/* ------------------------------------------------------------------ */
/* Testimonials, delivery                                              */
/* ------------------------------------------------------------------ */

export const testimonials = () => `<div class="quotes">
${quotes
  .map(
    ([q, role, org, loc]) => `          <figure class="quote">
            <blockquote><p>${esc(q)}</p></blockquote>
            <figcaption><strong>${esc(role)}</strong><span>${esc(org)} · ${esc(loc)}</span></figcaption>
          </figure>`
  )
  .join('\n')}
        </div>`;

export const deliveryBlock = () => `<div class="delivery">
            <h3>${icon('truck')} Delivery</h3>
            <dl>
${delivery.map(([k, v]) => `              <div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('\n')}
            </dl>
            <a class="link-arrow" href="/delivery-policy">Full delivery policy ${icon('arrow-right')}</a>
          </div>`;

/* ------------------------------------------------------------------ */
/* Article cards                                                       */
/* ------------------------------------------------------------------ */

export const articleCard = (a, readTime) => `<article class="a-card" data-category="${esc(a.category)}">
            <a class="a-card-media" href="/blog/${a.slug}" tabindex="-1" aria-hidden="true">
              ${img({ src: webp(a.image), alt: a.category, sizes: '(min-width: 1100px) 380px, (min-width: 640px) 45vw, 92vw' })}
            </a>
            <div class="a-card-body">
              <p class="meta"><span>${esc(a.category)}</span>${readTime ? `<span>${readTime} min read</span>` : ''}</p>
              <h3><a href="/blog/${a.slug}">${esc(a.headline)}</a></h3>
              <p>${esc(a.desc)}</p>
            </div>
          </article>`;

/* ------------------------------------------------------------------ */
/* Part identification + CTA band                                      */
/* ------------------------------------------------------------------ */

export const identifyPart = () => `<section class="section identify" aria-labelledby="identify-h">
      <div class="wrap identify-in">
        <div class="identify-copy">
          <p class="eyebrow">Part identification</p>
          <h2 id="identify-h">Can’t identify the part?</h2>
          <p>Upload a photo, drawing, old part number or datasheet. Our technical team reviews it and comes back with the correct product — or the closest equivalent, clearly marked as needing verification.</p>
          <ul class="ticks">
            <li>${icon('check', 'i-sm')} Worn samples, nameplates and legacy part numbers</li>
            <li>${icon('check', 'i-sm')} PDF, JPG, PNG, DOC/DOCX, XLS/XLSX and DWG accepted</li>
            <li>${icon('check', 'i-sm')} Reviewed by people, not an automated matcher</li>
          </ul>
          <div class="btn-row">
            ${btn('Upload part information', '/request-quote?type=identify', 'primary', 'upload')}
            ${btn('Send a photo on WhatsApp', waLink('Hello Mechaura, I would like help identifying a part. I will send a photo.'), 'ghost', 'whatsapp', ' target="_blank" rel="noopener" data-track="whatsapp_click"')}
          </div>
        </div>
        <ol class="identify-steps" aria-label="How identification works">
          <li><span>01</span><strong>Send what you have</strong>Photo, drawing, nameplate or the number stamped on the old part.</li>
          <li><span>02</span><strong>We measure and match</strong>Dimensions, ratings and material checked against genuine and equivalent options.</li>
          <li><span>03</span><strong>You get a clear answer</strong>An itemised quote that states exactly what is genuine and what is an equivalent.</li>
        </ol>
      </div>
    </section>`;

export const ctaBand = ({ title = 'Have an industrial requirement?', text = 'Send us the part number, specification, drawing or photo. Our team will help identify the right sourcing option.', product } = {}) => `<section class="cta-band" aria-label="Request a quote">
      <div class="wrap cta-band-in">
        <div>
          <h2>${title}</h2>
          <p>${text}</p>
        </div>
        <div class="btn-row">
          ${btn('Request a Quote', product ? `/request-quote?product=${product}` : '/request-quote', 'primary', 'file', ' data-rfq-link')}
          ${btn('WhatsApp an Engineer', waLink('Hello Mechaura, I have an industrial requirement.'), 'wa', 'whatsapp', ' target="_blank" rel="noopener" data-track="whatsapp_click"')}
          ${btn('Upload a Part', '/request-quote?type=identify', 'ghost-light', 'upload')}
        </div>
      </div>
    </section>`;

/* ------------------------------------------------------------------ */
/* Video                                                               */
/* ------------------------------------------------------------------ */

export const VIDEOS = [
  { src: '/videos/machinery-processing.mp4', poster: '/images/products/shot-blasting-machine-1.webp', title: 'Continuous shot blasting and surface processing', tag: 'Surface finishing' },
  { src: '/videos/products-showcase.mp4', poster: '/images/brush-product.webp', title: 'Industrial consumables and spares', tag: 'Supplies & spares' },
  { src: '/videos/products-sequence.mp4', poster: '/images/products/brush1.webp', title: 'Brush segments, fittings, bearings and tooling', tag: 'Product range' },
];

/** Muted, looping clips that only load and play while on screen (main.js). */
export const videoGrid = (list = VIDEOS) => `<div class="v-grid">
${list
  .map(
    (v) => `          <figure class="v-item">
            <video muted loop playsinline preload="none" poster="${v.poster}" data-lazy-video aria-label="${esc(v.title)}">
              <source data-src="${v.src}" type="video/mp4">
            </video>
            <figcaption><span>${esc(v.tag)}</span>${esc(v.title)}</figcaption>
          </figure>`
  )
  .join('\n')}
        </div>`;

/* ------------------------------------------------------------------ */
/* RFQ forms                                                           */
/* ------------------------------------------------------------------ */

const field = ({ id, label, type = 'text', required, auto, hint, options, rows, value = '', placeholder = '', full, attrs = '' }) => {
  const req = required ? ' required aria-required="true"' : '';
  const star = required ? ' <span class="req" aria-hidden="true">*</span>' : ' <span class="opt">(optional)</span>';
  const desc = `${hint ? `${id}-hint ` : ''}${id}-err`;
  let control;
  if (options) {
    control = `<select id="${id}" name="${id}"${req} aria-describedby="${desc}"${attrs}>
${options.map((o) => (Array.isArray(o) ? `                  <option value="${esc(o[0])}">${esc(o[1])}</option>` : `                  <option>${esc(o)}</option>`)).join('\n')}
                </select>`;
  } else if (type === 'textarea') {
    control = `<textarea id="${id}" name="${id}" rows="${rows || 4}"${req} aria-describedby="${desc}" placeholder="${esc(placeholder)}"${attrs}>${esc(value)}</textarea>`;
  } else {
    control = `<input id="${id}" name="${id}" type="${type}"${auto ? ` autocomplete="${auto}"` : ''}${req} aria-describedby="${desc}" value="${esc(value)}"${placeholder ? ` placeholder="${esc(placeholder)}"` : ''}${attrs}>`;
  }
  return `              <div class="field${full ? ' full' : ''}">
                <label for="${id}">${label}${star}</label>
${hint ? `                <p class="hint" id="${id}-hint">${hint}</p>\n` : ''}                ${control}
                <p class="err" id="${id}-err" hidden></p>
              </div>`;
};

const categoryOptions = [['', 'Select a category'], ...products.map((p) => [p.slug, p.name]), ['shot-blast-brushes', 'Shot Blast Machine Brushes'], ['other', 'Other / mixed requirement']];

const uploader = (id = 'files') => `              <div class="field full">
                <span class="label" id="${id}-label">Photos, drawings or datasheets <span class="opt">(optional)</span></span>
                <div class="drop" data-drop>
                  ${icon('upload')}
                  <p><label for="${id}" class="drop-link">Choose files</label> or drag them here</p>
                  <p class="hint" id="${id}-hint">Up to ${RFQ.maxFiles} files, ${RFQ.maxFileMB} MB each · PDF, JPG, PNG, DOC/DOCX, XLS/XLSX, DWG/DXF</p>
                  <input class="sr-only" id="${id}" name="attachments" type="file" multiple accept="${RFQ.accept.join(',')}" aria-describedby="${id}-hint ${id}-err" aria-labelledby="${id}-label">
                </div>
                <ul class="file-list" data-file-list aria-live="polite"></ul>
                <p class="err" id="${id}-err" hidden></p>
              </div>`;

const formShell = (inner, { mode, product }) => `<form class="rfq rfq-${mode}" data-rfq="${mode}" novalidate
            action="${RFQ.endpoint || `mailto:${EMAIL}`}" method="post" enctype="${RFQ.endpoint ? 'multipart/form-data' : 'text/plain'}"
            data-endpoint="${esc(RFQ.endpoint)}" data-uploads="${RFQ.uploads}" data-email="${EMAIL}" data-max-files="${RFQ.maxFiles}" data-max-mb="${RFQ.maxFileMB}" data-accept="${RFQ.accept.join(',')}">
            <div class="err-summary" role="alert" tabindex="-1" hidden></div>
            <input type="hidden" name="form" value="${mode}">
            <input type="hidden" name="page" value="">
${product ? `            <input type="hidden" name="product" value="${esc(product.name)}">\n` : ''}            <div class="hp" aria-hidden="true"><label for="website-${mode}">Website</label><input id="website-${mode}" name="website" type="text" tabindex="-1" autocomplete="off"></div>
${inner}
          </form>
          <div class="rfq-done" hidden tabindex="-1" data-rfq-done></div>`;

const privacyNote = `<p class="privacy-note">${icon('shield', 'i-sm')} We use your details only to respond to this request. See our <a href="/privacy-policy">Privacy Policy</a>.</p>`;

/** Four-step RFQ used on /request-quote. */
export function rfqFull() {
  const steps = [
    ['Contact', `${field({ id: 'name', label: 'Full name', required: true, auto: 'name' })}
${field({ id: 'company', label: 'Company', required: true, auto: 'organization' })}
${field({ id: 'email', label: 'Business email', type: 'email', required: true, auto: 'email' })}
${field({ id: 'phone', label: 'Phone / WhatsApp', type: 'tel', required: true, auto: 'tel', hint: 'Include the country code, e.g. +971.' })}
${field({ id: 'country', label: 'Country', options: ['United Arab Emirates', ...gccMarkets, 'Other'], auto: 'country-name' })}`],
    ['Requirement', `${field({ id: 'category', label: 'Product category', options: categoryOptions })}
${field({ id: 'requirement', label: 'Product or description', required: true, placeholder: 'e.g. Spherical roller bearing, 4SP hose assembly' })}
${field({ id: 'part', label: 'Part number / OEM number', placeholder: 'e.g. SKF 22220 E', attrs: ' spellcheck="false"' })}
${field({ id: 'brand', label: 'Brand', placeholder: 'Preferred or current brand' })}
${field({ id: 'quantity', label: 'Quantity', required: true, placeholder: 'e.g. 20 pcs' })}
${field({ id: 'needed', label: 'Required by', type: 'date' })}
${field({ id: 'application', label: 'Application', full: true, placeholder: 'Machine, operating pressure, temperature, material — whatever is known' })}`],
    ['Technical information', `${field({ id: 'details', label: 'Description', type: 'textarea', rows: 5, full: true, placeholder: 'Dimensions, ratings, standards, what failed and how — anything that helps us match the part.' })}
${uploader()}`],
    ['Delivery', `${field({ id: 'location', label: 'Delivery location', required: true, placeholder: 'e.g. Al Quoz, Dubai or Dammam, KSA', auto: 'address-level2' })}
              <fieldset class="field full radios">
                <legend>Urgency</legend>
                <label><input type="radio" name="urgency" value="Standard" checked> Standard</label>
                <label><input type="radio" name="urgency" value="Planned date"> Planned for a specific date</label>
                <label><input type="radio" name="urgency" value="Urgent - machine down"> Urgent — machine down</label>
              </fieldset>`],
  ];
  const inner = `            <ol class="steps" aria-label="Form progress">
${steps.map(([t], i) => `              <li${i === 0 ? ' aria-current="step"' : ''}><span>${i + 1}</span>${t}</li>`).join('\n')}
            </ol>
${steps
  .map(
    ([t, fields], i) => `            <fieldset class="step" data-step="${i + 1}"${i ? ' hidden' : ''}>
              <legend><span class="step-no">Step ${i + 1} of ${steps.length}</span> ${t}</legend>
              <div class="grid-fields">
${fields}
              </div>
            </fieldset>`
  )
  .join('\n')}
            <div class="rfq-nav">
              <button class="btn btn-ghost" type="button" data-step-back hidden>${icon('arrow-left')} Back</button>
              <button class="btn btn-primary" type="button" data-step-next>Continue ${icon('arrow-right')}</button>
              <button class="btn btn-primary" type="submit" data-submit hidden>Submit RFQ ${icon('arrow-right')}</button>
            </div>
            <div class="progress" data-progress hidden><span></span></div>
            <p class="response-note">${icon('clock', 'i-sm')} ${RFQ.responseNote}</p>
            ${privacyNote}`;
  return formShell(inner, { mode: 'full' });
}

/** Single-step RFQ used on product pages and the contact page. */
export function rfqCompact({ product, mode = 'product', title = 'Request a technical quotation' } = {}) {
  const fields = `${field({ id: `${mode}-name`, label: 'Name', required: true, auto: 'name' })}
${field({ id: `${mode}-company`, label: 'Company', required: true, auto: 'organization' })}
${field({ id: `${mode}-email`, label: 'Email', type: 'email', required: true, auto: 'email' })}
${field({ id: `${mode}-phone`, label: 'Phone', type: 'tel', required: true, auto: 'tel' })}
${product ? '' : field({ id: `${mode}-category`, label: 'Product category', options: categoryOptions, full: true })}
${field({ id: `${mode}-part`, label: 'Part number', attrs: ' spellcheck="false"' })}
${field({ id: `${mode}-quantity`, label: 'Quantity', required: mode === 'product' })}
${field({ id: `${mode}-details`, label: mode === 'contact' ? 'Your requirement' : 'Application & requirements', type: 'textarea', rows: 4, full: true, required: mode === 'contact', placeholder: 'Size, rating, application, required date…' })}
${uploader(`${mode}-files`)}`;
  const inner = `            <div class="grid-fields">
${fields.replace(/\n\n/g, '\n')}
            </div>
            <div class="progress" data-progress hidden><span></span></div>
            <button class="btn btn-primary btn-block" type="submit" data-submit>${title} ${icon('arrow-right')}</button>
            <p class="response-note">${icon('clock', 'i-sm')} ${RFQ.responseNote}</p>
            ${privacyNote}`;
  return formShell(inner, { mode, product });
}

export const contactLines = () => `<ul class="contact-lines">
            <li>${icon('phone')}<span><small>Phone</small><a href="tel:${PHONE_RAW}" data-track="phone_click">${PHONE}</a></span></li>
            <li>${icon('whatsapp')}<span><small>WhatsApp</small><a href="${waLink()}" target="_blank" rel="noopener" data-track="whatsapp_click">${PHONE}</a></span></li>
            <li>${icon('mail')}<span><small>Email</small><a href="mailto:${EMAIL}" data-track="email_click">${EMAIL}</a></span></li>
          </ul>`;
