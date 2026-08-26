import { defineConfig } from 'vite'
import { mkdirSync, renameSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const SITE = 'https://mechaurainternational.com'

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
    .filter((n) => n !== 'index')

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
<meta http-equiv="refresh" content="0; url=/${name}">
<script>location.replace('/${name}' + location.search + location.hash);</script>
</head>
<body><p>This page has moved to <a href="/${name}">${target}</a>.</p></body>
</html>
`,
                    'utf8'
                )
            }
        }
    }
}

export default defineConfig({
    // Root-absolute so assets resolve from nested clean URLs such as /products/.
    base: '/',
    plugins: [cleanUrlsDev(), cleanUrlsBuild()],
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: Object.fromEntries(
                Object.entries(pages).map(([key, file]) => [key, file])
            )
        }
    }
})
