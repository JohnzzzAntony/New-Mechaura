# Deployment — mechaurainternational.com

Host: **GitHub Pages**, served from the `gh-pages` branch of
`muhammedanasm/mechaurainternational`.

---

## Why the deploy currently shows an error

The build and the deploy script both work. The error in
**Settings → Pages** is a DNS mismatch, and it is the only thing left.

The `gh-pages` branch contains a `CNAME` file naming
`mechaurainternational.com`. That tells GitHub to serve the site at that
domain. But the domain does not point at GitHub:

```
mechaurainternational.com  ->  13.248.169.48, 76.223.54.146   (Hostinger)
GitHub Pages needs         ->  185.199.108.153 .. 185.199.111.153
```

GitHub runs a DNS check, it fails, and Pages reports the domain as
misconfigured. Until the DNS records below are changed, that error stays
regardless of how many times the site is redeployed.

---

## Step 1 — Change DNS at your domain registrar

This has to be done by you: it needs your registrar login, which is not
something I can or should handle.

Delete the existing `A` records for the root domain, then add these four:

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

And one for `www`:

| Type | Name | Value |
|---|---|---|
| CNAME | `www` | `muhammedanasm.github.io` |

If your registrar supports `AAAA` records, optionally also add
`2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`,
`2606:50c0:8003::153`.

Propagation typically takes 15 minutes to a few hours, occasionally up to 24.

---

## Step 2 — Confirm the GitHub Pages source

In **Settings → Pages**:

- **Source**: Deploy from a branch
- **Branch**: `gh-pages` / `(root)`
- **Custom domain**: `mechaurainternational.com`
- **Enforce HTTPS**: tick this once the DNS check passes (the checkbox stays
  greyed out until GitHub can issue the certificate, which needs working DNS)

---

## Step 3 — Verify

Once DNS has propagated:

```bash
nslookup mechaurainternational.com
```

Expect `185.199.10x.153`. Then:

```bash
curl -sI https://mechaurainternational.com/ | head -1
```

```bash
curl -sI https://mechaurainternational.com/robots.txt | head -1
```

```bash
curl -sI https://mechaurainternational.com/products/abrasive-brushes | head -1
```

All three should return `200`.

---

## Publishing changes

```bash
npm run deploy
```

That runs `npm run build` then pushes `dist/` to the `gh-pages` branch. The
live site updates within a minute or two.

To check SEO health before publishing:

```bash
npm run audit
```

Expected: `No per-page issues found.`

---

## What the build produces

`npm run build` runs, in order:

1. `tools/build-pages.mjs` — 8 product pages, the shot-blast pillar page, 3 location pages
2. `tools/build-articles.mjs` — 6 knowledge-base article pages
3. `tools/build-sitemap.mjs` — regenerates `public/sitemap.xml`
4. `tools/optimise-images.mjs` — WebP conversion and reference rewriting
5. `vite build` — bundles, hashes assets, writes clean-URL directories

Output: `dist/`, roughly 13 MB, 30 indexable pages.

Files GitHub Pages specifically needs, all generated automatically:

| File | Purpose |
|---|---|
| `CNAME` | Binds the custom domain |
| `.nojekyll` | Stops Jekyll processing, so `_`-prefixed paths work |
| `404.html` | Branded error page, must stay at the root |

---

## A note on Hostinger

Hostinger is currently serving the domain with an old, unbuilt copy of the
site. Once DNS moves to GitHub, Hostinger stops receiving traffic and can be
left alone or cancelled.

If you ever point the domain back at Hostinger, note that these files were
publicly exposed there and should be deleted: `package.json`,
`package-lock.json`, `vite.config.js`, `README.md`, `.gitignore` and
`.github/`. They leak build configuration and dependency lists.

---

## Regenerating content

| Task | Command |
|---|---|
| Edit product copy, specs or FAQs | Edit `tools/site-data.mjs`, then `npm run deploy` |
| Edit article content | Edit `tools/article-content.mjs`, then `npm run deploy` |
| Add a product | Add to `products` in `tools/site-data.mjs`, add the slug to `productSlugs` in `vite.config.js`, then `npm run deploy` |
| Regenerate product technical SVGs | `npm run media` |
| Check SEO health | `npm run audit` |

Generated `.html` files are committed, so the site remains plain static HTML
even if the generators are never run again.

---

## After the domain is live

In Google Search Console:

1. Submit `sitemap.xml`.
2. Request indexing for `/abrasive-brushes-for-shot-blast-machines`,
   `/products/abrasive-brushes`, `/products/hydraulic-hoses`,
   `/products/cutting-tools` and `/industrial-supplies-dubai`.
3. Check Coverage after a week for crawl errors.

Outside what code can deliver, and still the two largest remaining factors:

- **Create and verify a Google Business Profile** with a full street address.
  Nothing on-page substitutes for this on local and "near me" queries.
- **Pursue third-party citations** — UAE trade directories, chamber of
  commerce, industry associations. The audit found zero independent mentions,
  which is what currently caps visibility in AI answer engines.
