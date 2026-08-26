# Deployment Guide — mechaurainternational.com

Last updated: 26 August 2026

---

## 1. The core problem to fix first

Your domain is served from **Hostinger**, not GitHub Pages. Response headers
confirm it:

```
platform: hostinger
Server: hcdn
```

But `.github/workflows/deploy.yml` publishes to **GitHub Pages**. Those are two
different destinations, so every CI run has been deploying to an address nobody
visits. Meanwhile, Hostinger is serving **raw, unbuilt source files** — which is
why `robots.txt`, `sitemap.xml` and `llms.txt` all returned 404.

**Pick one host.** Everything below assumes you stay on Hostinger, since that is
where the domain currently resolves.

---

## 2. Build the production files

```bash
npm install && npm run build
```

This runs, in order:

1. `tools/build-pages.mjs` — 8 product pages, the shot-blast pillar page, 3 location pages
2. `tools/build-articles.mjs` — 6 knowledge-base article pages
3. `tools/build-sitemap.mjs` — regenerates `public/sitemap.xml`
4. `tools/optimise-images.mjs` — WebP conversion and reference rewriting
5. `vite build` — bundles, hashes assets, and writes clean-URL directories

Output lands in **`dist/`** (139 files, ~13 MB).

Verify before uploading:

```bash
npm run audit
```

Expected result: `No per-page issues found.`

---

## 3. Upload to Hostinger

Upload **the entire contents of `dist/`** into `public_html/` — the contents,
not the folder itself. `public_html/index.html` must exist at the top level.

Via hPanel: File Manager → `public_html` → upload a zip of `dist/` contents →
Extract.

Via FTP/SFTP: connect, navigate to `public_html`, upload everything from `dist/`.

---

## 4. Delete these files from `public_html`

These are stale raw-source files currently served publicly. I confirmed each one
returns HTTP 200 on the live site. They leak your build configuration and
dependency list, and none of them belong on a web server.

| Delete | Why |
|---|---|
| `package.json` | Exposes dependencies and scripts |
| `package-lock.json` | Exposes full dependency tree |
| `vite.config.js` | Exposes build configuration |
| `README.md` | Not public content |
| `.gitignore` | Not public content |
| `.github/` (whole folder) | Contains your CI workflow |
| `main.js` | Superseded by hashed `/assets/main-*.js` |
| `style.css` | Superseded by hashed `/assets/main-*.css` |
| `node_modules/` | If present — should never be uploaded |
| `sections/` | If present — old React files, no longer used |
| `tools/` | If present — build scripts, not runtime files |
| `src/`, `.vscode/`, `.idea/` | If present |

Everything in `dist/` is safe to keep. Do **not** delete `CNAME`,
`googlefd4c40fe556b6d4a.html`, `robots.txt`, `sitemap.xml` or `llms.txt`.

> **Note on the `.html` files in `dist/`.** Files like `about.html` sitting next
> to the `about/` folder are intentional. They are tiny `noindex` redirect stubs
> that forward old indexed URLs to the new clean ones. Keep them.

---

## 5. Post-deploy verification

Run these and confirm each returns **200**:

```bash
curl -sI https://mechaurainternational.com/robots.txt | head -1
```

```bash
curl -sI https://mechaurainternational.com/sitemap.xml | head -1
```

```bash
curl -sI https://mechaurainternational.com/products/abrasive-brushes | head -1
```

And confirm these now return **404** (proving the cleanup worked):

```bash
curl -sI https://mechaurainternational.com/package.json | head -1
```

---

## 6. Then, in Google Search Console

1. **Submit the sitemap** — Sitemaps → enter `sitemap.xml` → Submit.
2. **Request indexing** for the priority new pages via URL Inspection:
   - `/abrasive-brushes-for-shot-blast-machines`
   - `/products/abrasive-brushes`
   - `/products/hydraulic-hoses`
   - `/products/cutting-tools`
   - `/industrial-supplies-dubai`
3. **Check Coverage** after a week for crawl errors on the new URLs.
4. **Validate structured data** at `search.google.com/test/rich-results` for one
   product page and one article page.

Also worth doing, and outside what code can deliver:

- **Create and verify a Google Business Profile** with a full street address.
  This is the single largest remaining factor for local and "near me" queries,
  and no amount of on-page work substitutes for it.
- **Add a complete street address** to the contact page once the profile exists.
- **Pursue directory listings** — UAE trade directories, chamber of commerce,
  industry associations. The audit found zero independent citations, which is
  what currently caps the GEO score.

---

## 7. Regenerating content later

| Task | Command |
|---|---|
| Edit product copy, specs or FAQs | Edit `tools/site-data.mjs`, then `npm run build` |
| Edit article content | Edit `tools/article-content.mjs`, then `npm run build` |
| Add a new product | Add an entry to `products` in `tools/site-data.mjs`, add its slug to `productSlugs` in `vite.config.js`, then `npm run build` |
| Regenerate product technical SVGs | `npm run media` |
| Check SEO health | `npm run audit` |

The generated `.html` files are committed to the repo, so the site still works
as plain static HTML even if you never run the generators again.
