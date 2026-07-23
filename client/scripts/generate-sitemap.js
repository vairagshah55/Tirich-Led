/* eslint-disable */
/**
 * Generates public/sitemap.xml from the product catalogue at build time so it
 * never drifts from the data. Runs automatically via the "prebuild" npm script.
 *
 * Update SITE_URL if the production domain changes (keep it in sync with
 * src/components/Seo/Seo.jsx → SITE_URL).
 */
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://tirichled.com';
const STATIC_ROUTES = ['/', '/products', '/about', '/contact', '/smart-lighting'];

const dataPath = path.join(__dirname, '..', 'src', 'data', 'products.js');
const source = fs.readFileSync(dataPath, 'utf8');

// Product slugs = a `slug:` line immediately followed by a `name:` line
// (category definitions in ALL_CATEGORIES are followed by `label:`, so they
// are naturally excluded).
const productSlugs = [
  ...source.matchAll(/slug:\s*['"]([^'"]+)['"]\s*,?\s*\r?\n\s*name:/g),
].map((m) => m[1]);

const categorySlugs = [
  ...source.matchAll(/categorySlug:\s*['"]([^'"]+)['"]/g),
].map((m) => m[1]);

const productUrls = [...new Set(productSlugs)].map((s) => `/products/${s}`);
const categoryUrls = [...new Set(categorySlugs)].map(
  (c) => `/products/category/${c}`
);

const routes = [...STATIC_ROUTES, ...categoryUrls, ...productUrls];
const lastmod = new Date().toISOString().split('T')[0];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) =>
      `  <url><loc>${SITE_URL}${route}</loc><lastmod>${lastmod}</lastmod></url>`
  )
  .join('\n')}
</urlset>
`;

const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf8');
console.log(
  `[sitemap] wrote ${routes.length} URLs (${productUrls.length} products, ${categoryUrls.length} categories) → public/sitemap.xml`
);
