/* eslint-disable no-console */
/**
 * One-off image optimizer.
 *
 * Scans src/ for static image imports (.png/.jpg/.jpeg), converts each
 * referenced file to a resized WebP sibling, then rewrites the import paths
 * to point at the new .webp file.
 *
 * Only files that are actually imported get converted — the hundreds of
 * unused photos under src/assets are left untouched (webpack never bundles
 * them anyway).
 *
 * Usage:  node ./scripts/optimize-images.js          (convert + rewrite)
 *         node ./scripts/optimize-images.js --dry-run (report only)
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC_DIR = path.join(__dirname, '..', 'src');
const MAX_WIDTH = 1600;          // plenty for full-bleed product shots
const QUALITY = 80;              // WebP quality for photos
const LOGO_QUALITY = 92;         // keep brand marks crisp
const DRY_RUN = process.argv.includes('--dry-run');

const IMPORT_RE = /from\s+['"]([^'"]+\.(?:png|jpe?g))['"]/gi;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue;
      walk(full, out);
    } else if (/\.(jsx?|tsx?)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

const fmt = (n) => `${(n / 1024).toFixed(0)} KB`;

async function main() {
  const sourceFiles = walk(SRC_DIR);

  // Map: absolute image path -> set of source files that import it
  const imageToSources = new Map();
  for (const file of sourceFiles) {
    const code = fs.readFileSync(file, 'utf8');
    let m;
    while ((m = IMPORT_RE.exec(code)) !== null) {
      const rel = m[1];
      const abs = path.resolve(path.dirname(file), rel);
      if (!imageToSources.has(abs)) imageToSources.set(abs, new Set());
      imageToSources.get(abs).add(file);
    }
  }

  console.log(`Found ${imageToSources.size} distinct imported raster images.\n`);

  let beforeTotal = 0;
  let afterTotal = 0;
  const converted = []; // { abs, webpAbs }

  for (const abs of imageToSources.keys()) {
    if (!fs.existsSync(abs)) {
      console.warn(`!! missing on disk, skipping: ${abs}`);
      continue;
    }
    const webpAbs = abs.replace(/\.(png|jpe?g)$/i, '.webp');
    const isLogo = /log/i.test(path.basename(abs));
    const beforeSize = fs.statSync(abs).size;
    beforeTotal += beforeSize;

    if (DRY_RUN) {
      const meta = await sharp(abs).metadata();
      console.log(`${path.basename(abs)}  ${meta.width}x${meta.height}  ${fmt(beforeSize)}`);
      converted.push({ abs, webpAbs });
      continue;
    }

    await sharp(abs)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: isLogo ? LOGO_QUALITY : QUALITY })
      .toFile(webpAbs);

    const afterSize = fs.statSync(webpAbs).size;
    afterTotal += afterSize;
    console.log(
      `${path.basename(abs).padEnd(28)} ${fmt(beforeSize).padStart(9)} -> ${fmt(afterSize).padStart(9)}` +
      `  (-${(100 - (afterSize / beforeSize) * 100).toFixed(0)}%)`
    );
    converted.push({ abs, webpAbs });
  }

  if (DRY_RUN) {
    console.log(`\nDry run — ${converted.length} images, ${fmt(beforeTotal)} total. No files written.`);
    return;
  }

  // Rewrite imports: replace the original extension with .webp in every
  // source file that referenced a converted image.
  let rewrites = 0;
  for (const file of sourceFiles) {
    let code = fs.readFileSync(file, 'utf8');
    const original = code;
    code = code.replace(IMPORT_RE, (full, p) => {
      const abs = path.resolve(path.dirname(file), p);
      if (converted.some((c) => c.abs === abs)) {
        rewrites += 1;
        return full.replace(p, p.replace(/\.(png|jpe?g)$/i, '.webp'));
      }
      return full;
    });
    if (code !== original) fs.writeFileSync(file, code);
  }

  console.log(
    `\nDone. ${converted.length} images: ${fmt(beforeTotal)} -> ${fmt(afterTotal)} ` +
    `(-${(100 - (afterTotal / beforeTotal) * 100).toFixed(0)}%). Rewrote ${rewrites} import paths.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
