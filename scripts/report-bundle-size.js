/**
 * Bundle Size Reporter
 * Reports the size of built assets to help track bundle size over time
 */

import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = 'dist/client';
const SIZE_LIMIT_KB = 870;
const WARNING_LIMIT_KB = 800;

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;

  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...getFiles(fullPath));
    } else if (
      stat.isFile() &&
      (fullPath.endsWith('.js') || fullPath.endsWith('.css'))
    ) {
      files.push(fullPath);
    }
  }
  return files;
}

function main() {
  const files = getFiles(DIST_DIR);

  if (files.length === 0) {
    console.log('No build artifacts found. Run "bun run build" first.');
    process.exit(0);
  }

  console.log('\n📦 Bundle Size Report\n');
  console.log('='.repeat(50));

  let totalSize = 0;
  const fileSizes = [];

  for (const file of files) {
    const stats = fs.statSync(file);
    const size = stats.size;
    totalSize += size;
    const relativePath = path.relative('.', file);
    fileSizes.push({ path: relativePath, size });
  }

  // Sort by size descending
  fileSizes.sort((a, b) => b.size - a.size);

  // Print individual files
  for (const { path: filePath, size } of fileSizes) {
    console.log(`${formatBytes(size).padStart(10)}  ${filePath}`);
  }

  console.log('='.repeat(50));
  console.log(`${formatBytes(totalSize).padStart(10)}  TOTAL`);

  const totalKB = totalSize / 1024;

  // Warning threshold check
  if (totalKB > WARNING_LIMIT_KB && totalKB <= SIZE_LIMIT_KB) {
    console.log(
      `\n⚠️  WARNING: Bundle size (${totalKB.toFixed(1)}KB) exceeds warning threshold (${WARNING_LIMIT_KB}KB)`
    );
    console.log(
      `   Approaching limit (${(SIZE_LIMIT_KB - totalKB).toFixed(1)}KB remaining)`
    );
  }

  console.log(
    `\n📊 Bundle size: ${totalKB.toFixed(1)}KB (warning: ${WARNING_LIMIT_KB}KB, limit: ${SIZE_LIMIT_KB}KB)`
  );

  if (totalKB > SIZE_LIMIT_KB) {
    console.log(
      `   🚨 EXCEEDED limit by ${(totalKB - SIZE_LIMIT_KB).toFixed(1)}KB`
    );
    process.exit(1);
  } else if (totalKB > WARNING_LIMIT_KB) {
    console.log(
      `   ✅ Within budget but ${(totalKB - WARNING_LIMIT_KB).toFixed(1)}KB over warning threshold`
    );
  } else {
    console.log(
      `   ✅ Well within budget (${(SIZE_LIMIT_KB - totalKB).toFixed(1)}KB under limit)`
    );
  }
}

main();
