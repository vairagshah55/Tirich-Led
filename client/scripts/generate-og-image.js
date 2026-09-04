/* eslint-disable */
/**
 * Generates public/og-default.jpg — the 1200x630 fallback share image used by
 * <Seo> and the pre-renderer for every page that has no image of its own.
 *
 * Social scrapers (WhatsApp, LinkedIn, X, Facebook) require a large landscape
 * image; the brand logo alone is 452x233, which most of them reject or crop
 * badly. Run manually after a logo change:  node scripts/generate-og-image.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC = path.join(__dirname, '..', 'public');
const OUT = path.join(PUBLIC, 'og-default.jpg');
const W = 1200;
const H = 630;

const backdrop = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
     <rect width="${W}" height="${H}" fill="#FFFFFF"/>
     <rect x="0" y="${H - 8}" width="${W}" height="8" fill="#FF9D1C"/>
     <text x="${W / 2}" y="472" text-anchor="middle"
           font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
           font-size="30" font-weight="500" letter-spacing="6" fill="#151515">
       PRECISION LED LIGHTING
     </text>
     <text x="${W / 2}" y="522" text-anchor="middle"
           font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
           font-size="21" font-weight="400" letter-spacing="1" fill="#6B6B6B">
       Downlights · COB · Track · Linear · Magnetic · Panels · Outdoor
     </text>
   </svg>`
);

(async () => {
  const logo = await sharp(path.join(PUBLIC, 'logo.png'))
    .resize({ width: 620, fit: 'inside', withoutEnlargement: false })
    .toBuffer();
  const { height: logoH } = await sharp(logo).metadata();

  await sharp(backdrop)
    .composite([{ input: logo, left: Math.round((W - 620) / 2), top: Math.round(288 - logoH / 2) }])
    .jpeg({ quality: 86, chromaSubsampling: '4:4:4' })
    .toFile(OUT);

  const { size } = fs.statSync(OUT);
  console.log(`[og-image] wrote public/og-default.jpg (${W}x${H}, ${Math.round(size / 1024)} KB)`);
})();
