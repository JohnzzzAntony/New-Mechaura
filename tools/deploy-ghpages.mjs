import { execSync } from 'node:child_process';
import { rmSync, cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const dist = resolve(root, 'dist');
const tempDir = resolve(root, '.gh-pages-tmp');

console.log('Deploying dist to gh-pages branch...');

try {
  if (existsSync(tempDir)) {
    try { execSync(`git worktree remove --force "${tempDir}"`, { stdio: 'ignore' }); } catch {}
    rmSync(tempDir, { recursive: true, force: true });
  }

  execSync(`git worktree add -B gh-pages "${tempDir}"`, { stdio: 'inherit' });

  // Remove existing tracked files in worktree
  try {
    execSync('git rm -rf .', { cwd: tempDir, stdio: 'ignore' });
  } catch {}

  // Copy dist contents into worktree
  cpSync(dist, tempDir, { recursive: true });

  // Commit and push
  execSync('git add -A', { cwd: tempDir, stdio: 'inherit' });
  execSync(`git commit -m "Deploy site to GitHub Pages: ${new Date().toISOString()}" --allow-empty`, { cwd: tempDir, stdio: 'inherit' });
  execSync('git push origin gh-pages --force', { cwd: tempDir, stdio: 'inherit' });

  console.log('Successfully deployed to gh-pages branch!');
} catch (err) {
  console.error('Deployment error:', err.message);
  process.exit(1);
} finally {
  try {
    execSync(`git worktree remove --force "${tempDir}"`, { stdio: 'ignore' });
  } catch {}
  if (existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true, force: true });
  }
}
