import { defineConfig } from 'vite'
import { mkdirSync, renameSync, writeFileSync, existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const SITE = 'https://mechaurainternational.com'

/**
 * Production serves from the domain root, so links are root-absolute.
 *
 * Set BASE_PATH to preview the built site on a GitHub Pages *project* URL
 * (https://<user>.github.io/<repo>/), which serves from a subfolder:
 *   BASE_PATH=/mechaurainternational/ npm run build
 *
 * Always redeploy without BASE_PATH before the custom domain goes live —
 * a subpath build will break every link at the domain root.
 */
const BASE = process.env.BASE_PATH || '/'

/** Every page in the site, keyed by the clean URL it is served at. */
const productSlugs = [
    'abrasive-brushes',
    'hydraulic-hoses',
    'industrial-bearings',
    'bandsaw-blades',
    'cutting-tools',
    'elevator-accessories',
    'industrial-air-filters',
    'hydraulic-pumps'
]

const articleSlugs = [
    'abrasive-removal-brush-segments-guide',
    'hydraulic-hose-failure-prevention',
    'elevator-spares-inspection-checklist',
    'precision-vs-standard-bearings',
    'bimetal-vs-carbide-bandsaw-blades',
    'industrial-air-filters-arid-climates'
]

const pages = {
    main: 'index.html',
    notFound: '404.html',
    about: 'about.html',
    services: 'services.html',
    products: 'products.html',
    sectors: 'sectors.html',
    contact: 'contact.html',
    productDetail: 'product-detail.html',
    blog: 'blog.html',
    deliveryPolicy: 'delivery-policy.html',
    privacyPolicy: 'privacy-policy.html',
    termsConditions: 'terms-conditions.html',

    // Generated landing pages (see tools/build-pages.mjs)
    shotBlastBrushes: 'abrasive-brushes-for-shot-blast-machines.html',
    locDubai: 'industrial-supplies-dubai.html',
    locAbuDhabi: 'industrial-supplies-abu-dhabi.html',
    locSharjah: 'industrial-supplies-sharjah.html',
    ...Object.fromEntries(productSlugs.map((s) => [`product_${s.replace(/-/g, '_')}`, `products/${s}.html`])),
    ...Object.fromEntries(articleSlugs.map((s) => [`article_${s.replace(/-/g, '_')}`, `blog/${s}.html`]))
}

const cleanNames = Object.values(pages)
    .map((f) => f.replace(/\.html$/, ''))
    .filter((n) => n !== 'index' && n !== '404')

/**
 * Serves `/about` as `about.html` during `vite dev` so local browsing matches
 * the extension-less URLs the built site is deployed with.
 */
function cleanUrlsDev() {
    return {
        name: 'mechaura-clean-urls-dev',
        apply: 'serve',
        configureServer(server) {
            server.middlewares.use((req, _res, next) => {
                const [path, query = ''] = req.url.split('?')
                const name = path.replace(/^\/|\/$/g, '')
                if (cleanNames.includes(name)) {
                    req.url = `/${name}.html${query ? `?${query}` : ''}`
                }
                next()
            })
        }
    }
}

/**
 * Turns `dist/about.html` into `dist/about/index.html` so the site is served at
 * `/about` on GitHub Pages (and any plain static host), and leaves a
 * meta-refresh stub at the old `/about.html` address so previously indexed
 * links keep working.
 */
function cleanUrlsBuild() {
    return {
        name: 'mechaura-clean-urls-build',
        apply: 'build',
        enforce: 'post',
        closeBundle() {
            const dist = resolve(process.cwd(), 'dist')
            for (const name of cleanNames) {
                const from = join(dist, `${name}.html`)
                if (!existsSync(from)) continue

                const to = join(dist, name, 'index.html')
                mkdirSync(dirname(to), { recursive: true })
                renameSync(from, to)

                const target = `${SITE}/${name}`
                writeFileSync(
                    from,
                    `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Redirecting…</title>
<link rel="canonical" href="${target}">
<meta name="robots" content="noindex, follow">
<meta http-equiv="refresh" content="0; url=${BASE}${name}">
<script>location.replace('${BASE}${name}' + location.search + location.hash);</script>
</head>
<body><p>This page has moved to <a href="${BASE}${name}">${target}</a>.</p></body>
</html>
`,
                    'utf8'
                )
            }
        }
    }
}

/**
 * When building for a subfolder (BASE_PATH), the hand-written root-absolute
 * links in the HTML — /about, /images/logo.webp — still point at the domain
 * root and 404. Vite rewrites the assets it processes but not these, so
 * prefix any remaining internal URL with the base.
 */
function rebaseInternalLinks() {
    return {
        name: 'mechaura-rebase-internal-links',
        apply: 'build',
        enforce: 'post',
        closeBundle() {
            if (BASE === '/') return

            const dist = resolve(process.cwd(), 'dist')
            const prefix = BASE.replace(/\/$/, '')
            let touched = 0

            const walk = (dir) => {
                for (const entry of readdirSync(dir, { withFileTypes: true })) {
                    const p = join(dir, entry.name)
                    if (entry.isDirectory()) { walk(p); continue }
                    if (!entry.name.endsWith('.html')) continue

                    const before = readFileSync(p, 'utf8')
                    const after = before.replace(
                        /((?:href|src)=")(\/(?!\/)[^"]*)"/g,
                        (m, attr, url) => (url.startsWith(`${prefix}/`) ? m : `${attr}${prefix}${url}"`)
                    )
                    if (after !== before) { writeFileSync(p, after, 'utf8'); touched++ }
                }
            }
            walk(dist)
            console.log(`\n  rebased internal links in ${touched} file(s) to ${BASE}`)
        }
    }
}

export default defineConfig({
    // Root-absolute so assets resolve from nested clean URLs such as /products/.
    base: BASE,
    plugins: [cleanUrlsDev(), cleanUrlsBuild(), rebaseInternalLinks()],
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: Object.fromEntries(
                Object.entries(pages).map(([key, file]) => [key, file])
            )
        }
    }
})
