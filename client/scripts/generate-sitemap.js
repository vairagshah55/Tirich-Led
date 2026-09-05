/* eslint-disable */
/**
 * Generates public/sitemap.xml from the product catalogue at build time so it
 * never drifts from the data. Runs automatically via the "prebuild" npm script.
 *
 * The origin comes from scripts/seo-shared.js so the sitemap, the pre-rendered
 * <head> tags and the runtime <Seo> component can never disagree about it.
 */
const fs = require('fs');
const path = require('path');

const { SITE_URL, parseCatalogue } = require('./seo-shared');
// Trailing slashes: static hosts serve routes as directories (…/index.html),
// so the canonical live URL has a trailing slash. Keep sitemap URLs identical
// to what's served to avoid 301 redirect / canonical conflicts.
const STATIC_ROUTES = ['/', '/products', '/about', '/contact', '/smart-lighting'];

const dataPath = path.join(__dirname, '..', 'src', 'data', 'products.js');
const source = fs.readFileSync(dataPath, 'utf8');

// One parser, shared with scripts/prerender-meta.js. It honours PUBLISHED_SLUGS
// and rebuilds the app's CATEGORIES list, so the sitemap can only ever contain
// URLs that actually resolve to a page.
const { products, categoryOrder } = parseCatalogue(source);

const productUrls = products.map((p) => `/products/${p.slug}`);
const categoryUrls = categoryOrder.map((c) => `/products/category/${c}`);

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
