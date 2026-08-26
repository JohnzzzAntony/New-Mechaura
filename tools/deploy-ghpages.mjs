import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
console.log('Deploying dist folder to gh-pages branch...');

try {
  const remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();

  execSync('git init', { cwd: distDir, stdio: 'inherit' });
  execSync('git checkout -B gh-pages', { cwd: distDir, stdio: 'inherit' });
  execSync('git add -A', { cwd: distDir, stdio: 'inherit' });
  execSync(`git commit -m "deploy: ${new Date().toISOString()}"`, { cwd: distDir, stdio: 'inherit' });
  execSync(`git push -f "${remoteUrl}" gh-pages`, { cwd: distDir, stdio: 'inherit' });

  console.log('Successfully deployed to gh-pages branch!');
} catch (err) {
  console.error('Failed to deploy to gh-pages:', err);
  process.exit(1);
}
