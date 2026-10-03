/**
 * Mechaura International — site behaviour.
 * Progressive enhancement only: every page works without this file.
 */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ */
/* Service worker                                                      */
/* ------------------------------------------------------------------ */

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        reg.update();
        reg.addEventListener('updatefound', () => {
          const worker = reg.installing;
          worker?.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) location.reload();
          });
        });
      })
      .catch((err) => console.warn('[Mechaura] Service worker registration failed:', err));
  });
}

// Support utility, callable from the console: clearMechauraCache()
window.clearMechauraCache = async () => {
  if ('serviceWorker' in navigator) {
    for (const r of await navigator.serviceWorker.getRegistrations()) await r.unregister();
  }
  if ('caches' in window) for (const k of await caches.keys()) await caches.delete(k);
  location.reload();
};

/* ------------------------------------------------------------------ */
/* Analytics                                                           */
/* ------------------------------------------------------------------ */

function track(event, params = {}) {
  if (typeof window.gtag === 'function') window.gtag('event', event, params);
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-track]');
  if (el) track(el.dataset.track, { link_url: el.href, link_text: el.textContent.trim().slice(0, 80) });
});

/* ------------------------------------------------------------------ */
/* Header: dropdowns, mega menu, mobile navigation                     */
/* ------------------------------------------------------------------ */

function initNav() {
  const triggers = $$('.has-panel > .nav-top');
  const close = (except) =>
    triggers.forEach((b) => {
      if (b === except) return;
      b.setAttribute('aria-expanded', 'false');
      $(`#${b.getAttribute('aria-controls')}`).hidden = true;
    });
  const open = (b) => {
    close(b);
    b.setAttribute('aria-expanded', 'true');
    $(`#${b.getAttribute('aria-controls')}`).hidden = false;
  };
  const hoverable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  triggers.forEach((b) => {
    const li = b.parentElement;
    b.addEventListener('click', () => (b.getAttribute('aria-expanded') === 'true' ? close() : open(b)));
    if (hoverable) {
      let t;
      li.addEventListener('mouseenter', () => { clearTimeout(t); t = setTimeout(() => open(b), 90); });
      li.addEventListener('mouseleave', () => { clearTimeout(t); t = setTimeout(() => { b.setAttribute('aria-expanded', 'false'); $(`#${b.getAttribute('aria-controls')}`).hidden = true; }, 160); });
    }
    li.addEventListener('focusout', (e) => { if (!li.contains(e.relatedTarget)) { b.setAttribute('aria-expanded', 'false'); $(`#${b.getAttribute('aria-controls')}`).hidden = true; } });
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && b.getAttribute('aria-expanded') === 'true') { close(); b.focus(); }
    });
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.has-panel')) close(); });

  // Mobile drawer
  const drawer = $('#m-nav');
  const openBtn = $('.menu-open');
  if (!drawer || !openBtn) return;
  const setOpen = (on) => {
    drawer.hidden = !on;
    openBtn.setAttribute('aria-expanded', String(on));
    document.body.classList.toggle('nav-open', on);
    if (on) $('[data-close-nav]', drawer).focus();
    else openBtn.focus();
  };
  openBtn.addEventListener('click', () => setOpen(true));
  $('[data-close-nav]', drawer).addEventListener('click', () => setOpen(false));
  drawer.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
    if (e.key === 'Tab') {
      const f = $$('a, button, summary', drawer).filter((el) => el.offsetParent);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
    }
  });
  window.matchMedia('(min-width: 1100px)').addEventListener('change', (m) => { if (m.matches && !drawer.hidden) setOpen(false); });
}

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

let indexPromise;
const loadIndex = () => (indexPromise ||= fetch('/search-index.json').then((r) => r.json()).catch(() => []));
const norm = (s) => s.toLowerCase().normalize('NFKD').replace(/[^\w\s./-]/g, ' ');
const isCode = (t) => /\d/.test(t);

function searchEntries(index, query) {
  const tokens = norm(query).split(/\s+/).filter((t) => t.length > 1 || isCode(t));
  if (!tokens.length) return { results: [], codes: [] };
  const codes = tokens.filter(isCode);
  const words = tokens.filter((t) => !isCode(t));
  const scored = [];
  for (const e of index) {
    const title = norm(e.t);
    const hay = norm(`${e.c || ''} ${e.s || ''} ${e.d || ''}`);
    let score = 0;
    let missing = 0;
    for (const t of words.length ? words : tokens) {
      if (title.startsWith(t) || title.includes(` ${t}`)) score += 8;
      else if (title.includes(t)) score += 5;
      else if (hay.includes(t)) score += 2;
      else missing++;
    }
    if (score && !missing) scored.push([score + (e.k === 'Product' ? 3 : 0), e]);
  }
  scored.sort((a, b) => b[0] - a[0]);
  return { results: scored.map(([, e]) => e), codes };
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const ICON = (n) => `<svg class="i" aria-hidden="true"><use href="/icons.svg#${n}"></use></svg>`;
const kindIcon = { 'Product type': 'layers', Brand: 'shield', Industry: 'map', Solution: 'wrench', Guide: 'file', Page: 'arrow-right' };

function renderResults(box, query, results, codes, limit) {
  if (!query.trim()) { box.innerHTML = ''; return; }
  const q = esc(query.trim());
  let html = '';
  if (codes.length || !results.length) {
    html += `<a class="sr-part" href="/request-quote?type=identify&part=${encodeURIComponent(query.trim())}" role="option">${ICON('upload')}<p><strong>Check part “${q}” with our technical desk</strong>We don’t list every part number online — send it and we’ll identify the genuine item or a verified equivalent.</p></a>`;
  }
  const groups = {};
  for (const r of results.slice(0, limit)) (groups[r.k] ||= []).push(r);
  const order = ['Product', 'Product type', 'Brand', 'Industry', 'Solution', 'Guide', 'Page'];
  for (const k of order) {
    if (!groups[k]) continue;
    html += `<p class="sr-group">${k === 'Product type' ? 'Product types' : `${k}s`}</p>`;
    html += groups[k]
      .map(
        (r) => `<a class="sr-item" href="${r.u}" role="option">${r.i ? `<img src="${r.i}" alt="" loading="lazy" width="48" height="48">` : `<span class="sr-ico">${ICON(kindIcon[r.k] || 'arrow-right')}</span>`}<span class="sr-text"><strong>${esc(r.t)}</strong><span>${esc(r.d || r.c || '')}</span></span></a>`
      )
      .join('');
  }
  if (!results.length) html += `<p class="sr-empty">No products match “${q}”. <a href="/request-quote?type=identify">Upload a photo, drawing or specification</a> and our technical team will help identify it.</p>`;
  else html += `<a class="sr-all" href="/products?q=${encodeURIComponent(query.trim())}">See all catalogue results</a>`;
  box.innerHTML = html;
}

function bindSearch(input, box, { limit = 8 } = {}) {
  let timer;
  let sent;
  const run = async () => {
    const index = await loadIndex();
    const { results, codes } = searchEntries(index, input.value);
    renderResults(box, input.value, results, codes, limit);
    if (input.value.trim().length > 2 && sent !== input.value) {
      sent = input.value;
      clearTimeout(bindSearch.t);
      bindSearch.t = setTimeout(() => track('search', { search_term: input.value.trim().slice(0, 60) }), 1200);
    }
  };
  input.addEventListener('focus', loadIndex, { once: true });
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 110); });
  input.addEventListener('keydown', (e) => {
    const items = $$('a', box);
    if (!items.length) return;
    const i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[Math.min(i + 1, items.length - 1)].focus(); }
  });
  box.addEventListener('keydown', (e) => {
    const items = $$('a', box);
    const i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[Math.min(i + 1, items.length - 1)]?.focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); (i <= 0 ? input : items[i - 1]).focus(); }
    if (e.key === 'Escape') { box.innerHTML = ''; input.focus(); }
  });
}

function initSearch() {
  const dialog = $('#search-dialog');
  if (dialog) {
    const input = $('[data-search-input]', dialog);
    bindSearch(input, $('[data-search-results]', dialog), { limit: 12 });
    const openDialog = () => {
      if (typeof dialog.showModal !== 'function') { location.href = '/products'; return; }
      dialog.showModal();
      input.focus();
      loadIndex();
    };
    $$('[data-search-open]').forEach((b) => b.addEventListener('click', openDialog));
    $('[data-search-close]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && !e.target.closest('input, textarea, select, [contenteditable]')) { e.preventDefault(); openDialog(); }
    });
  }
  $$('[data-inline-search]').forEach((form) => {
    const input = $('[data-search-input]', form);
    const box = $('[data-search-results]', form);
    bindSearch(input, box, { limit: 6 });
    document.addEventListener('click', (e) => { if (!form.contains(e.target)) box.innerHTML = ''; });
  });
}

/* ------------------------------------------------------------------ */
/* Catalogue filters                                                   */
/* ------------------------------------------------------------------ */

function initCatalogue() {
  const root = $('[data-catalogue]');
  if (!root) return;
  const form = $('[data-filter-form]', root);
  const cards = $$('.p-card', root);
  const panel = $('[data-filters]', root);
  const count = $('[data-result-count]', root);
  const empty = $('[data-no-results]', root);
  const chips = $('[data-active-filters]', root);
  const grid = $('.p-grid', root);
  const facets = ['group', 'industry', 'brand'];
  const attr = { group: 'group', industry: 'industries', brand: 'brands' };
  const split = (card, f) => (f === 'brand' ? card.dataset.brands.split('|') : card.dataset[attr[f]].split(' ')).filter(Boolean);

  const banner = document.createElement('a');
  banner.className = 'sr-part';
  banner.hidden = true;
  grid.before(banner);

  // URL -> form
  const params = new URLSearchParams(location.search);
  form.q.value = params.get('q') || '';
  form.type.value = params.get('type') || '';
  for (const f of facets) {
    const vals = params.getAll(f);
    $$(`input[name="${f}"]`, form).forEach((i) => (i.checked = vals.includes(i.value)));
  }

  const state = () => ({
    q: form.q.value.trim(),
    type: form.type.value,
    ...Object.fromEntries(facets.map((f) => [f, $$(`input[name="${f}"]:checked`, form).map((i) => i.value)])),
  });

  const matches = (card, s, skip) => {
    for (const f of facets) {
      if (f === skip || !s[f].length) continue;
      if (!split(card, f).some((v) => s[f].includes(v))) return false;
    }
    if (s.type && !card.dataset.types.split('|').includes(s.type)) return false;
    const words = norm(s.q).split(/\s+/).filter((t) => t && !isCode(t));
    return words.every((w) => card.dataset.text.includes(w));
  };

  const labelFor = (f, v) => $(`input[name="${f}"][value="${CSS.escape(v)}"]`, form)?.nextElementSibling.textContent || v;

  function apply(push = true) {
    const s = state();
    let shown = 0;
    cards.forEach((c) => {
      const ok = matches(c, s);
      c.hidden = !ok;
      if (ok) shown++;
    });
    // Facet counts against the other active filters
    for (const f of facets) {
      $$(`input[name="${f}"]`, form).forEach((i) => {
        const n = cards.filter((c) => matches(c, s, f) && split(c, f).includes(i.value)).length;
        const el = $(`[data-count="${f}:${CSS.escape(i.value)}"]`, form);
        if (el) el.textContent = n;
        i.disabled = !n && !i.checked;
      });
    }
    count.textContent = `${shown} product ${shown === 1 ? 'family' : 'families'}`;
    empty.hidden = shown > 0;
    const codes = norm(s.q).split(/\s+/).filter(isCode);
    banner.hidden = !codes.length;
    if (codes.length) {
      banner.href = `/request-quote?type=identify&part=${encodeURIComponent(s.q)}`;
      banner.innerHTML = `${ICON('upload')}<p><strong>Looking for part “${esc(s.q)}”?</strong>We don’t list individual part numbers online. Send it and our technical desk will identify the genuine item or a verified equivalent.</p>`;
    }
    $('[data-identify-link]', root).href = `/request-quote?type=identify${s.q ? `&part=${encodeURIComponent(s.q)}` : ''}`;

    // Active chips
    const active = [
      ...(s.q ? [['q', s.q, `“${s.q}”`]] : []),
      ...(s.type ? [['type', s.type, `Type: ${s.type}`]] : []),
      ...facets.flatMap((f) => s[f].map((v) => [f, v, labelFor(f, v)])),
    ];
    chips.innerHTML = active.map(([f, v, l]) => `<li><button type="button" data-f="${f}" data-v="${esc(v)}" aria-label="Remove filter ${esc(l)}">${esc(l)} ${ICON('x')}</button></li>`).join('');

    if (push) {
      const p = new URLSearchParams();
      if (s.q) p.set('q', s.q);
      if (s.type) p.set('type', s.type);
      facets.forEach((f) => s[f].forEach((v) => p.append(f, v)));
      history.replaceState(null, '', `${location.pathname}${p.toString() ? `?${p}` : ''}`);
    }
  }

  chips.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const { f, v } = b.dataset;
    if (f === 'q' || f === 'type') form[f].value = '';
    else $(`input[name="${f}"][value="${CSS.escape(v)}"]`, form).checked = false;
    apply();
  });
  form.addEventListener('change', () => apply());
  let t;
  form.q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(apply, 150); });
  form.addEventListener('submit', (e) => { e.preventDefault(); apply(); });
  $$('[data-filter-reset]', root).forEach((b) =>
    b.addEventListener('click', (e) => {
      e.preventDefault();
      form.reset();
      form.q.value = '';
      form.type.value = '';
      apply();
    })
  );

  // Mobile bottom sheet
  let scrim;
  const sheet = (on) => {
    panel.classList.toggle('is-open', on);
    $('[data-filters-open]', root).setAttribute('aria-expanded', String(on));
    if (on) {
      scrim = document.createElement('div');
      scrim.className = 'scrim';
      scrim.addEventListener('click', () => sheet(false));
      document.body.append(scrim);
      document.body.classList.add('nav-open');
      $('input', panel).focus();
    } else {
      scrim?.remove();
      document.body.classList.remove('nav-open');
    }
  };
  $('[data-filters-open]', root).addEventListener('click', () => sheet(true));
  $$('[data-filters-close]', root).forEach((b) => b.addEventListener('click', () => sheet(false)));
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.classList.contains('is-open')) sheet(false); });

  apply(false);
}

/* ------------------------------------------------------------------ */
/* Product gallery, tabs, spec copy                                    */
/* ------------------------------------------------------------------ */

function initGallery() {
  const g = $('[data-gallery]');
  if (!g) return;
  const main = $('.gallery-img', g);
  const label = $('[data-gallery-label]', g);
  const thumbs = $$('.thumb', g);
  const base = main.alt.split(' — ')[0];
  const first = { srcset: main.getAttribute('srcset'), sizes: main.getAttribute('sizes') };
  thumbs.forEach((b, i) =>
    b.addEventListener('click', () => {
      if (i === 0 && first.srcset) {
        main.setAttribute('srcset', first.srcset);
        main.setAttribute('sizes', first.sizes);
      } else {
        main.removeAttribute('srcset');
      }
      main.src = b.dataset.src;
      main.alt = `${base} — ${b.dataset.label}`;
      label.textContent = `${b.dataset.label} · ${i + 1} / ${thumbs.length}`;
      thumbs.forEach((t) => t.setAttribute('aria-pressed', String(t === b)));
    })
  );
}

function initScrollSpy() {
  const navs = $$('.pd-tabs, .toc');
  navs.forEach((nav) => {
    const links = $$('a[href^="#"]', nav);
    const map = new Map(links.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          links.forEach((a) => a.removeAttribute('aria-current'));
          map.get(en.target.id)?.setAttribute('aria-current', 'true');
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    map.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  });
}

function initSpecCopy() {
  $$('[data-copy-spec]').forEach((b) =>
    b.addEventListener('click', async () => {
      const table = b.closest('.spec').querySelector('table');
      const title = $('h1')?.textContent.trim() || '';
      const text = [title, ...$$('tbody tr', table).map((tr) => `${tr.cells[0].textContent.trim()}: ${tr.cells[1].textContent.trim()}`)].join('\n');
      const span = $('span', b);
      try {
        await navigator.clipboard.writeText(text);
        span.textContent = 'Copied';
      } catch {
        span.textContent = 'Copy unavailable';
      }
      setTimeout(() => (span.textContent = 'Copy specification'), 2000);
    })
  );
}

/* ------------------------------------------------------------------ */
/* Media                                                               */
/* ------------------------------------------------------------------ */

function initVideos() {
  const vids = $$('video[data-lazy-video]');
  if (!vids.length) return;
  const load = (v) => {
    const s = $('source[data-src]', v);
    if (!s) return;
    s.src = s.dataset.src;
    s.removeAttribute('data-src');
    v.load();
  };
  if (!('IntersectionObserver' in window)) { vids.forEach(load); return; }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach(({ target: v, isIntersecting }) => {
        if (isIntersecting) {
          load(v);
          if (!v.controls) {
            if (reduceMotion) v.controls = true;
            else v.play().catch(() => (v.controls = true));
          }
        } else if (!v.paused && !v.controls) v.pause();
      }),
    { rootMargin: '200px 0px', threshold: 0.25 }
  );
  vids.forEach((v) => io.observe(v));
}

function initArticleFilter() {
  const bar = $('[data-article-filter]');
  if (!bar) return;
  bar.hidden = false;
  const cards = $$('[data-article-grid] .a-card');
  bar.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    $$('button', bar).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    cards.forEach((c) => (c.hidden = !!b.dataset.cat && c.dataset.category !== b.dataset.cat));
  });
}

function initActionBar() {
  const bar = $('.action-bar');
  if (!bar) return;
  const cta = $('.f-cta');
  let footerVisible = false;
  let typing = false;
  const sync = () => bar.classList.toggle('is-hidden', footerVisible || typing);
  if (cta && 'IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => { footerVisible = en.isIntersecting; sync(); }).observe(cta);
  }
  document.addEventListener('focusin', (e) => { typing = !!e.target.closest('input, textarea, select'); sync(); });
  document.addEventListener('focusout', () => { typing = false; sync(); });
  // On product pages, quote button scrolls to the inline form instead.
  const rfq = $('#rfq');
  if (rfq) $('[data-rfq-link]', bar).href = '#rfq';
}

/* ------------------------------------------------------------------ */
/* RFQ forms                                                           */
/* ------------------------------------------------------------------ */

const MESSAGES = {
  name: 'Please enter your name.',
  company: 'Please enter your company name.',
  email: 'Please enter a valid email address.',
  phone: 'Please enter a phone number we can reach you on, including the country code.',
  requirement: 'Please describe the product you need.',
  quantity: 'Please specify the required quantity.',
  location: 'Please enter the delivery location.',
  details: 'Please describe your requirement.',
};

const fmtSize = (b) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const makeRef = () => `MI-${(Date.now().toString(36).slice(-4) + Math.random().toString(36).slice(2, 4)).toUpperCase()}`;

function initRfq(form) {
  const mode = form.dataset.rfq;
  const prefix = mode === 'full' ? '' : `${mode}-`;
  const key = (el) => el.name.replace(prefix, '');
  const done = form.nextElementSibling;
  const summary = $('.err-summary', form);
  const maxFiles = +form.dataset.maxFiles;
  const maxBytes = +form.dataset.maxMb * 1048576;
  const accept = form.dataset.accept.split(',');
  const fileInput = $('input[type="file"]', form);
  const fileList = $('[data-file-list]', form);
  const drop = $('[data-drop]', form);
  let files = [];
  let started = false;

  $('input[name="page"]', form).value = location.href;
  form.addEventListener('focusin', () => {
    if (!started) { started = true; track('rfq_start', { form: mode }); }
  });

  /* ---- prefill from the URL (product, part, brand, type, sector) ---- */
  const p = new URLSearchParams(location.search);
  const set = (name, v) => { const el = form.elements[`${prefix}${name}`]; if (el && v && !el.value) el.value = v; };
  if (mode === 'full') {
    const cat = form.elements.category;
    const product = p.get('product');
    if (product && cat.querySelector(`option[value="${CSS.escape(product)}"]`)) {
      cat.value = product;
      set('requirement', cat.selectedOptions[0].textContent);
    }
    set('part', p.get('part'));
    set('brand', p.get('brand'));
    const notes = {
      identify: 'Please help identify this part. Photos, drawings or the old part number are attached / included above.',
      datasheet: 'Please send the datasheet and any test certificates for this product.',
      crossref: 'Please cross-reference this OEM part number and quote the genuine item and any verified equivalent.',
    };
    const type = p.get('type');
    const sector = p.get('sector');
    if (type) set('details', notes[type] || `Enquiry about: ${type.replace(/-/g, ' ')}.`);
    if (sector) set('application', `Sector: ${sector.replace(/-/g, ' ')}`);
  }

  /* ---- files ---- */
  const fileErr = () => $(`#${fileInput.id}-err`, form);
  function addFiles(list) {
    const errs = [];
    for (const f of list) {
      const ext = `.${f.name.split('.').pop().toLowerCase()}`;
      if (!accept.includes(ext)) errs.push(`“${f.name}” isn’t an accepted file type. Use PDF, JPG, PNG, DOC/DOCX, XLS/XLSX or DWG/DXF.`);
      else if (f.size > maxBytes) errs.push(`“${f.name}” is ${fmtSize(f.size)}. Each file must be ${form.dataset.maxMb} MB or smaller.`);
      else if (files.length >= maxFiles) errs.push(`You can attach up to ${maxFiles} files. Email any extra files with your reference number.`);
      else if (!files.some((x) => x.name === f.name && x.size === f.size)) files.push(f);
    }
    const el = fileErr();
    el.hidden = !errs.length;
    el.textContent = errs.join(' ');
    renderFiles();
    if (list.length) track('file_upload', { form: mode, files: files.length });
  }
  function renderFiles() {
    fileList.innerHTML = files
      .map((f, i) => `<li>${ICON('file')}<span>${esc(f.name)}</span><small>${fmtSize(f.size)}</small><button type="button" data-remove="${i}" aria-label="Remove ${esc(f.name)}">${ICON('x')}</button></li>`)
      .join('');
  }
  fileInput.addEventListener('change', () => { addFiles([...fileInput.files]); fileInput.value = ''; });
  fileList.addEventListener('click', (e) => {
    const b = e.target.closest('[data-remove]');
    if (!b) return;
    files.splice(+b.dataset.remove, 1);
    renderFiles();
    fileInput.focus();
  });
  ['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('is-over'); }));
  ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('is-over'); }));
  drop.addEventListener('drop', (e) => addFiles([...e.dataTransfer.files]));

  /* ---- validation ---- */
  function check(el) {
    const k = key(el);
    let msg = '';
    const v = el.value.trim();
    if (el.required && !v) msg = MESSAGES[k] || 'This field is required.';
    else if (el.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = MESSAGES.email;
    else if (el.type === 'tel' && v && v.replace(/\D/g, '').length < 7) msg = MESSAGES.phone;
    const err = $(`#${el.id}-err`, form);
    if (err) { err.hidden = !msg; err.textContent = msg; }
    if (msg) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
    return msg;
  }
  form.addEventListener('blur', (e) => { if (e.target.matches('input[required], textarea[required], input[type="email"], input[type="tel"]') && e.target.value) check(e.target); }, true);
  form.addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid')) check(e.target); });

  function validate(scope) {
    const fields = $$('input:not([type="hidden"]):not([type="file"]):not([type="radio"]):not([name="website"]), select, textarea', scope);
    const errors = fields.map((el) => [el, check(el)]).filter(([, m]) => m);
    if (errors.length) {
      summary.hidden = false;
      summary.innerHTML = `<strong>Please correct ${errors.length === 1 ? 'this field' : `these ${errors.length} fields`}:</strong><ul>${errors.map(([el, m]) => `<li><a href="#${el.id}">${esc(m)}</a></li>`).join('')}</ul>`;
      summary.focus();
      summary.querySelectorAll('a').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); $(a.hash, form).focus(); }));
    } else summary.hidden = true;
    return !errors.length;
  }

  /* ---- steps (full form) ---- */
  const steps = $$('.step', form);
  if (steps.length) {
    let cur = 0;
    const markers = $$('.steps li', form);
    const back = $('[data-step-back]', form);
    const next = $('[data-step-next]', form);
    const submit = $('[data-submit]', form);
    const show = (i) => {
      cur = i;
      steps.forEach((s, j) => (s.hidden = j !== i));
      markers.forEach((m, j) => {
        m.classList.toggle('done', j < i);
        if (j === i) m.setAttribute('aria-current', 'step');
        else m.removeAttribute('aria-current');
      });
      back.hidden = i === 0;
      next.hidden = i === steps.length - 1;
      submit.hidden = i !== steps.length - 1;
      summary.hidden = true;
      $('legend', steps[i]).scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
      $('input:not([type="hidden"]), select, textarea', steps[i])?.focus({ preventScroll: true });
    };
    next.addEventListener('click', () => { if (validate(steps[cur])) { track('rfq_step', { step: cur + 2 }); show(cur + 1); } });
    back.addEventListener('click', () => show(cur - 1));
    form.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.matches('input') && cur < steps.length - 1) { e.preventDefault(); next.click(); }
    });
  }

  /* ---- submit ---- */
  const value = (name) => form.elements[`${prefix}${name}`]?.value?.trim() || '';

  function finish(ref, pending, filesToEmail = []) {
    const mailFiles = `mailto:${form.dataset.email}?subject=${encodeURIComponent(`Files for RFQ ${ref}`)}&body=${encodeURIComponent(`Reference: ${ref}
Attached: ${filesToEmail.map((f) => f.name).join(', ')}`)}`;
    const wa = `https://wa.me/971566202517?text=${encodeURIComponent(`Hello Mechaura, following up on my request ${ref}.`)}`;
    done.className = `rfq-done${pending ? ' is-pending' : ''}`;
    done.innerHTML = pending
      ? `<h2>${ICON('mail')} Almost done — send the email</h2>
         <p>Your email app has opened with your request filled in. ${files.length ? `<strong>Attach the ${files.length} file${files.length > 1 ? 's' : ''} you selected</strong> (${files.map((f) => esc(f.name)).join(', ')}) and press send.` : 'Press send to submit it.'}</p>
         <p>Reference: <span class="ref">${ref}</span></p>
         <p>If nothing opened, email <a href="mailto:${form.dataset.email}?subject=${encodeURIComponent(`RFQ ${ref}`)}">${form.dataset.email}</a> or send the details on WhatsApp.</p>
         <div class="btn-row"><a class="btn btn-primary" href="${form.dataset.mailto}">${ICON('mail')} Open email again</a><a class="btn btn-wa" href="${wa}" target="_blank" rel="noopener" data-track="whatsapp_click">${ICON('whatsapp')} WhatsApp an Engineer</a></div>`
      : `<h2>${ICON('check')} Request received</h2>
         <p>Thank you. Your technical requirement has been submitted.</p>
         <p>Reference: <span class="ref">${ref}</span></p>
         <p>Our team will review your request and contact you within the stated response period.</p>
         ${filesToEmail.length ? `<p><strong>One more step:</strong> email your ${filesToEmail.length} file${filesToEmail.length > 1 ? 's' : ''} (${filesToEmail.map((f) => esc(f.name)).join(', ')}) to <a href="${mailFiles}">${form.dataset.email}</a> quoting reference ${ref}, or send ${filesToEmail.length > 1 ? 'them' : 'it'} on WhatsApp.</p>` : ''}
         <div class="btn-row">${filesToEmail.length ? `<a class="btn btn-primary" href="${mailFiles}">${ICON('mail')} Email the files</a>` : '<a class="btn btn-primary" href="/products">Continue browsing</a>'}<a class="btn btn-wa" href="${wa}" target="_blank" rel="noopener" data-track="whatsapp_click">${ICON('whatsapp')} WhatsApp an Engineer</a></div>`;
    form.hidden = true;
    done.hidden = false;
    done.focus();
    done.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    track('rfq_submit', { form: mode, method: pending ? 'email' : 'form', files: files.length });
  }

  function emailFallback(ref) {
    const fields = $$('input:not([type="hidden"]):not([type="file"]):not([name="website"]), select, textarea', form)
      .filter((el) => (el.type === 'radio' ? el.checked : el.value.trim()))
      .map((el) => {
        const label = el.type === 'radio' ? 'Urgency' : ($(`label[for="${el.id}"]`, form)?.childNodes[0].textContent.trim() || key(el));
        const v = el.tagName === 'SELECT' ? el.selectedOptions[0].textContent : el.value.trim();
        return `${label}: ${v}`;
      });
    const product = $('input[name="product"]', form)?.value;
    const body = [`Reference: ${ref}`, ...(product ? [`Product: ${product}`] : []), ...fields, ...(files.length ? ['', `Attachments (${files.length}) — please attach: ${files.map((f) => f.name).join(', ')}`] : []), '', `Sent from: ${location.href}`]
      .join('\n')
      .slice(0, 1800);
    const subject = `RFQ ${ref} — ${product || value('requirement') || value('part') || 'Industrial requirement'}`;
    const href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    form.dataset.mailto = href;
    location.href = href;
    finish(ref, true);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.elements.website.value) return; // honeypot
    if (!validate(form)) {
      const firstBad = $('[aria-invalid="true"]', form);
      const step = firstBad?.closest('.step');
      if (step && step.hidden) $$('.step', form).forEach((s) => (s.hidden = s !== step));
      return;
    }
    const ref = makeRef();
    const endpoint = form.dataset.endpoint;
    if (!endpoint) { emailFallback(ref); return; }

    const data = new FormData();
    data.append('reference', ref);
    for (const el of $$('input, select, textarea', form)) {
      if (el.type === 'file' || el.name === 'website' || (el.type === 'radio' && !el.checked)) continue;
      if (el.value.trim()) data.append(key(el), el.value.trim());
    }
    data.append('_subject', `RFQ ${ref} — ${data.get('product') || value('requirement') || 'Industrial requirement'}`);
    // File uploads need a paid Formspree plan; without it, files are emailed separately.
    const uploads = form.dataset.uploads === 'true';
    if (uploads) files.forEach((f) => data.append('attachments', f, f.name));
    else if (files.length) data.append('attachments_to_follow', files.map((f) => f.name).join(', '));

    const btn = $('[data-submit]', form);
    const bar = $('[data-progress]', form);
    const fill = $('span', bar);
    btn.setAttribute('aria-disabled', 'true');
    btn.dataset.label = btn.innerHTML;
    btn.textContent = 'Submitting…';
    bar.hidden = !(uploads && files.length);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.upload.addEventListener('progress', (ev) => { if (ev.lengthComputable) fill.style.width = `${Math.round((ev.loaded / ev.total) * 100)}%`; });
    const fail = (detail) => {
      btn.removeAttribute('aria-disabled');
      btn.innerHTML = btn.dataset.label;
      bar.hidden = true;
      summary.hidden = false;
      summary.innerHTML = `<strong>We couldn’t submit your request.</strong><ul>${detail ? `<li>${esc(detail)}</li>` : ''}<li>Check your connection and try again — your details are still here.</li><li>Or email <a href="mailto:${form.dataset.email}">${form.dataset.email}</a> or message us on <a href="https://wa.me/971566202517" target="_blank" rel="noopener">WhatsApp</a>.</li></ul>`;
      summary.focus();
    };
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) return finish(ref, false, uploads ? [] : files);
      let detail = '';
      try { detail = (JSON.parse(xhr.responseText).errors || []).map((x) => x.message).join(' '); } catch { /* non-JSON error */ }
      fail(detail);
    });
    xhr.addEventListener('error', () => fail());
    xhr.send(data);
  });
}

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */

initNav();
initSearch();
initCatalogue();
initGallery();
initScrollSpy();
initSpecCopy();
initVideos();
initArticleFilter();
initActionBar();
$$('form[data-rfq]').forEach(initRfq);
