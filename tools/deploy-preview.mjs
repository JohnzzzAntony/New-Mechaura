/**
 * Builds and deploys a *preview* of the site to the gh-pages branch, using the
 * GitHub Pages project URL as the base path:
 *
 *   https://muhammedanasm.github.io/mechaurainternational/
 *
 * Why this exists: production is configured for the custom domain, which serves
 * from the root, so links are written as /about, /products, etc. On the project
 * URL those resolve outside the repo folder and 404. This build prefixes them.
 *
 * IMPORTANT: a preview build must not be left on gh-pages once the custom
 * domain goes live — every link would gain a /mechaurainternational/ prefix
 * that does not exist at the domain root. Run `npm run deploy` to restore.
 *
 * Run with: npm run deploy:preview
 */
import { execSync } from 'node:child_process';
import { rmSync, existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Derive owner/repo from the git remote rather than hardcoding: GitHub Pages
// project paths are case-sensitive, and the remote has changed before.
const remote = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
const match = remote.match(/github\.com[:/]([^/]+)\/(.+?)(?:\.git)?$/i);
if (!match) throw new Error(`Could not parse a GitHub owner/repo from origin: ${remote}`);

const [, OWNER, REPO] = match;
const BASE_PATH = `/${REPO}/`;
const PAGES_URL = `https://${OWNER.toLowerCase()}.github.io${BASE_PATH}`;

console.log(`Repo:    ${OWNER}/${REPO}`);
console.log(`Preview: ${PAGES_URL}`);
console.log(`Building with base ${BASE_PATH} ...\n`);

execSync('npm run build', {
  stdio: 'inherit',
  env: { ...process.env, BASE_PATH },
});

const dist = resolve(process.cwd(), 'dist');

// The custom domain must not be claimed by a preview build — with a CNAME
// present GitHub would try to serve this subpath build at the domain root.
const cname = resolve(dist, 'CNAME');
if (existsSync(cname)) {
  rmSync(cname);
  console.log('\nRemoved CNAME from the preview build.');
}

// Leave a breadcrumb so it is obvious what is currently published.
writeFileSync(
  resolve(dist, 'PREVIEW.txt'),
  `Preview build for ${BASE_PATH}\nGenerated ${new Date().toISOString()}\n\n` +
    'This is NOT the production build. Run `npm run deploy` before pointing\n' +
    'the custom domain at GitHub Pages.\n',
  'utf8'
);

console.log('\nDeploying preview to gh-pages ...\n');
execSync('node tools/deploy-ghpages.mjs', { stdio: 'inherit' });

console.log(`\nPreview live shortly at: ${PAGES_URL}`);
console.log('Remember: run `npm run deploy` to restore the production build.');
