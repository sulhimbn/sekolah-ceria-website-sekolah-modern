/**
 * Bundle Size Regression Checker
 * Compares current build size against baseline to detect regressions
 *
 * Usage:
 *   node scripts/check-bundle-regression.js         # Check for regression
 *   node scripts/check-bundle-regression.js --update # Update baseline
 */

import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = 'dist/client';
const BASELINE_FILE = 'bundle-size-baseline.json';
const REGRESSION_THRESHOLD_PERCENT = 5; // Fail if size increases by more than 5%

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
      files.push({ path: fullPath, size: stat.size });
    }
  }
  return files;
}

function getTotalBundleSize() {
  const files = getFiles(DIST_DIR);
  return files.reduce((total, file) => total + file.size, 0);
}

function loadBaseline() {
  if (!fs.existsSync(BASELINE_FILE)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf-8'));
}

function saveBaseline(totalBytes) {
  const baseline = {
    totalBytes,
    totalKB: Math.round((totalBytes / 1024) * 10) / 10,
    date: new Date().toISOString().split('T')[0],
    note: 'Baseline for bundle size regression detection. Update when intentional size change.',
  };
  fs.writeFileSync(BASELINE_FILE, JSON.stringify(baseline, null, 2) + '\n');
  console.log(
    `✅ Baseline updated: ${formatBytes(totalBytes)} (${baseline.totalKB}KB)`
  );
}

function main() {
  const args = process.argv.slice(2);
  const isUpdateMode = args.includes('--update');

  const currentSize = getTotalBundleSize();
  const currentKB = Math.round((currentSize / 1024) * 10) / 10;

  console.log('\n📦 Bundle Size Regression Check\n');
  console.log('='.repeat(50));

  if (isUpdateMode) {
    saveBaseline(currentSize);
    process.exit(0);
  }

  const baseline = loadBaseline();

  if (!baseline) {
    console.log('⚠️  No baseline found. Creating baseline with current size.');
    saveBaseline(currentSize);
    console.log(
      '\n💡 Run with --update flag to update baseline after intentional changes.'
    );
    process.exit(0);
  }

  console.log(
    `Current size:  ${formatBytes(currentSize).padStart(10)} (${currentKB}KB)`
  );
  console.log(
    `Baseline size: ${formatBytes(baseline.totalBytes).padStart(10)} (${baseline.totalKB}KB)`
  );

  const diffBytes = currentSize - baseline.totalBytes;
  const diffPercent = ((diffBytes / baseline.totalBytes) * 100).toFixed(2);
  const diffSign = diffBytes >= 0 ? '+' : '';

  console.log(
    `Difference: ${diffSign}${formatBytes(Math.abs(diffBytes))} (${diffSign}${diffPercent}%)`
  );

  if (diffBytes > 0) {
    // Size increased - check for regression
    const thresholdBytes =
      baseline.totalBytes * (REGRESSION_THRESHOLD_PERCENT / 100);

    if (diffBytes > thresholdBytes) {
      console.log(`\n❌ REGRESSION DETECTED!`);
      console.log(
        `   Size increased by ${diffPercent}% (threshold: ${REGRESSION_THRESHOLD_PERCENT}%)`
      );
      console.log(`   Exceeded by ${formatBytes(diffBytes - thresholdBytes)}`);
      console.log(`\n💡 To update baseline after intentional changes, run:`);
      console.log(`   bun run build:update-baseline`);
      process.exit(1);
    } else {
      console.log(
        `\n⚠️  Size increased but within threshold (${REGRESSION_THRESHOLD_PERCENT}%)`
      );
      console.log(`   ✅ No regression - build can proceed`);
    }
  } else if (diffBytes < 0) {
    console.log(
      `\n🎉 Improvement! Bundle size reduced by ${formatBytes(Math.abs(diffBytes))}`
    );
    console.log(`   ✅ No regression - build can proceed`);
  } else {
    console.log(`\n✅ No change in bundle size`);
  }

  console.log('');
}

main();
