/* eslint-disable */
/**
 * Generates the favicon set from the brand mark.
 *
 *   node scripts/generate-favicons.js
 *
 * Why raster files and not just the SVG:
 *
 *  - Google's search results showed a generic globe because
 *    <link rel="alternate icon" href="/favicon.ico"> pointed at a file that
 *    did not exist (404), and /favicon.ico is also the conventional path
 *    crawlers probe directly.
 *  - The old favicon.svg drew its letter with <text font-family="Georgia">.
 *    Text in an SVG icon renders only if the rasterising client has that font;
 *    Google's fetcher is not a desktop browser. The mark is drawn here as
 *    plain rectangles instead, so it is identical everywhere.
 *  - Google wants a square icon, ideally a multiple of 48px. logo.png is
 *    452x233, so it cannot be used directly.
 *
 * Output: favicon-48/96/192.png, favicon.ico (16/32/48), favicon.svg.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC = path.join(__dirname, '..', 'public');

const NAVY = '#2A2F63';
const ORANGE = '#ea7d1f';

/**
 * The brand mark: navy rounded square, orange "T", orange accent dot —
 * the same design as the previous favicon.svg, but with the T built from
 * rectangles so no font is involved.
 */
const markSvg = (size) => {
  const s = size;
  const u = s / 64; // the original artwork was drawn on a 64x64 grid
  const barW = 30 * u;
  const barH = 7 * u;
  const barX = (s - barW) / 2;
  const barY = 20 * u;
  const stemW = 7 * u;
  const stemX = (s - stemW) / 2;
  const stemH = 26 * u;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
       <rect width="${s}" height="${s}" rx="${10 * u}" fill="${NAVY}"/>
       <rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="${1.5 * u}" fill="${ORANGE}"/>
       <rect x="${stemX}" y="${barY}" width="${stemW}" height="${stemH}" rx="${1.5 * u}" fill="${ORANGE}"/>
       <circle cx="${47 * u}" cy="${15 * u}" r="${4.5 * u}" fill="${ORANGE}"/>
     </svg>`
  );
};

/**
 * Minimal ICO writer. sharp cannot emit .ico, but the format is simple and
 * Vista-era ICO allows a PNG payload per entry, so each size is just a PNG
 * blob behind a 16-byte directory entry.
 */
function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4);

  let offset = 6 + pngs.length * 16;
  const entries = [];
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width  (0 means 256)
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2); // palette count
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += data.length;
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

(async () => {
  // Google recommends a square icon sized as a multiple of 48px.
  const pngSizes = [48, 96, 192];
  for (const size of pngSizes) {
    const out = path.join(PUBLIC, `favicon-${size}.png`);
    await sharp(markSvg(size)).png({ compressionLevel: 9 }).toFile(out);
    console.log(`[favicons] favicon-${size}.png`);
  }

  const icoSizes = [16, 32, 48];
  const pngs = [];
  for (const size of icoSizes) {
    pngs.push({ size, data: await sharp(markSvg(size)).png({ compressionLevel: 9 }).toBuffer() });
  }
  fs.writeFileSync(path.join(PUBLIC, 'favicon.ico'), buildIco(pngs));
  console.log(`[favicons] favicon.ico (${icoSizes.join(', ')})`);

  // Keep the SVG for browsers that prefer it, now font-free.
  fs.writeFileSync(path.join(PUBLIC, 'favicon.svg'), markSvg(64).toString(), 'utf8');
  console.log('[favicons] favicon.svg (font-free)');
})();
