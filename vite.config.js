import { defineConfig } from 'vite'
import { mkdirSync, renameSync, writeFileSync, existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

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

// Git Bash on Windows rewrites a leading-slash env value into a Windows path
// (/foo/ becomes C:/Program Files/Git/foo/). Catch it rather than silently
// building a broken site — set BASE_PATH from Node, or use npm run deploy:preview.
if (BASE !== '/' && (/^[A-Za-z]:/.test(BASE) || !BASE.startsWith('/') || !BASE.endsWith('/'))) {
    throw new Error(
        `BASE_PATH is "${BASE}", which is not a valid base path.\n` +
        'It must start and end with "/" (e.g. /mechaurainternational/).\n' +
        'On Git Bash, shell path conversion mangles this — run "npm run deploy:preview" instead.'
    )
}

/**
 * Every generated page (see tools/build-site.mjs), keyed by its path. Pages
 * live at the repo root and in products/, sectors/ and blog/.
 */
const pages = Object.fromEntries(
    ['.', 'products', 'sectors', 'blog']
        .flatMap((dir) =>
            existsSync(dir)
                ? readdirSync(dir).filter((f) => f.endsWith('.html')).map((f) => (dir === '.' ? f : `${dir}/${f}`))
                : []
        )
        .map((f) => [f.replace(/\.html$/, '').replace(/\//g, '_'), f])
)

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
 * `/about`.
 *
 * Deliberately leaves nothing behind at `dist/about.html`. GitHub Pages resolves
 * an extensionless request by trying `about.html` BEFORE `about/index.html`, so
 * a redirect stub at that path shadows the real page — and because the stub
 * points back at `/about`, it produces an infinite redirect loop.
 *
 * Old `*.html` addresses are instead handled by 404.html, which rewrites them
 * to the clean URL. See rewriteLegacyHtmlUrls in 404.html.
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
