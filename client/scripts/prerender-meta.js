/* eslint-disable */
/**
 * Static per-route <head> pre-rendering (runs as the "postbuild" npm script).
 *
 * The site is a client-rendered SPA deployed as a static bundle, so crawlers
 * that don't execute JavaScript (WhatsApp / LinkedIn / X previews, Bing, social
 * scrapers) would otherwise only see the generic <head> from the single
 * index.html. This writes a real HTML file per route — home, top-level pages,
 * every category (/products/category/:slug) and every product
 * (/products/:slug) — with the correct title, description, canonical,
 * Open Graph / Twitter tags and JSON-LD baked into <head>, mirroring the <Seo>
 * component. It also emits a 404.html and an image-enabled sitemap.xml.
 *
 * Only <head> is templated; <body> stays the empty #root div, so the app still
 * renders client-side (no hydration mismatch — root has no children).
 *
 * HOSTING: the static host must serve an existing file at the request path and
 * only fall back to /index.html for unknown routes (standard SPA behaviour on
 * Render / Netlify / Vercel / Cloudflare Pages). A blanket "/* -> /index.html"
 * rewrite must be a fallback, not an override, or these files are ignored.
 */
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://tirichled.com'; // keep in sync with src/components/Seo/Seo.jsx
const BUILD_DIR = path.join(__dirname, '..', 'build');
const SRC_DATA = path.join(__dirname, '..', 'src', 'data', 'products.js');
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

const source = fs.readFileSync(SRC_DATA, 'utf8');
const shell = fs.readFileSync(path.join(BUILD_DIR, 'index.html'), 'utf8');

/* ── helpers ─────────────────────────────────────────────────────── */
const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const jsonLdTag = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

// Static hosts serve routes as directories, so the live URL has a trailing
// slash. Keep every emitted URL (canonical, OG, sitemap, JSON-LD) consistent
// with what's served to avoid 301 redirect / canonical conflicts.
const withSlash = (p) => (!p || p === '/' ? '/' : p.endsWith('/') ? p : `${p}/`);
const absUrl = (p) => `${SITE_URL}${withSlash(p)}`;

/* ── map imported image vars → built /static/media URLs ──────────── */
const importVarToBase = {};
for (const m of source.matchAll(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g)) {
  importVarToBase[m[1]] = path.basename(m[2]).replace(/\.[a-z0-9]+$/i, '');
}
const mediaDir = path.join(BUILD_DIR, 'static', 'media');
const mediaFiles = fs.existsSync(mediaDir) ? fs.readdirSync(mediaDir) : [];
function imageUrlForVar(varName) {
  const base = importVarToBase[varName];
  if (!base) return DEFAULT_IMAGE;
  const file = mediaFiles.find((f) => f.startsWith(`${base}.`));
  return file ? `${SITE_URL}/static/media/${file}` : DEFAULT_IMAGE;
}

/* ── parse products ──────────────────────────────────────────────── */
const products = [];
const productRe =
  /slug:\s*(['"])(.*?)\1,\s*\r?\n\s*name:\s*(['"])(.*?)\3,\s*\r?\n\s*category:\s*(['"])(.*?)\5,\s*\r?\n\s*categorySlug:\s*(['"])(.*?)\7,\s*\r?\n\s*tagline:\s*(['"])(.*?)\9,\s*\r?\n\s*image:\s*(\w+)/g;
for (const m of source.matchAll(productRe)) {
  products.push({
    slug: m[2],
    name: m[4],
    category: m[6],
    categorySlug: m[8],
    tagline: m[10],
    image: imageUrlForVar(m[11]),
  });
}

/* ── parse ALL_CATEGORIES (slug → label/desc); commented entries skip ─ */
const categoryMeta = {};
const categoryRe =
  /slug:\s*'([^']+)',\s*\r?\n\s*label:\s*'([^']+)',\s*\r?\n\s*desc:\s*'([^']*)'/g;
for (const m of source.matchAll(categoryRe)) {
  categoryMeta[m[1]] = { label: m[2], desc: m[3] };
}

// Categories that actually have products, in first-appearance order.
const categoryOrder = [];
for (const p of products) {
  if (!categoryOrder.includes(p.categorySlug)) categoryOrder.push(p.categorySlug);
}

/* ── build routes ────────────────────────────────────────────────── */
const routes = [];

const CATALOGUE_DESC =
  'Browse the full Tirich LED catalogue — COB lights, downlights, linear, track, magnetic track, panels, fixtures and outdoor lighting.';

const collectionLd = (label, description, canonicalPath, items) => [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${label} | Tirich LED`,
    description,
    url: absUrl(canonicalPath),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.slice(0, 30).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absUrl(`/products/${p.slug}`),
        name: p.name,
      })),
    },
  },
];

// Home
routes.push({
  path: '/',
  title: 'Tirich LED — Precision LED Lighting',
  description:
    'Premium precision LED lighting for residential, commercial and hospitality spaces — COB downlights, track, linear, magnetic track, panels, fixtures and outdoor lighting.',
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Tirich LED',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      contactPoint: { '@type': 'ContactPoint', telephone: '+91-73832-47625', contactType: 'sales' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Tirich LED',
      url: SITE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/products?search={query}`,
        'query-input': 'required name=query',
      },
    },
  ],
});

// All products
routes.push({
  path: '/products',
  title: 'All Products',
  description: CATALOGUE_DESC,
  jsonLd: collectionLd('LED Lighting Products', CATALOGUE_DESC, '/products', products),
});

// Static pages
routes.push({ path: '/about', title: 'About Us', description: 'Tirich LED designs and manufactures premium precision LED lighting — engineered for architects, designers and contractors across residential, commercial and hospitality projects.' });
routes.push({ path: '/contact', title: 'Contact Us', description: 'Get in touch with Tirich LED for product enquiries, project quotes and lighting design support. Call, WhatsApp or send us a message.' });
routes.push({ path: '/smart-lighting', title: 'Smart Lighting', description: 'Tirich LED smart lighting — app and voice-controlled scenes, tunable white and dimming for modern homes, offices and hospitality spaces.' });

// Category landing pages
for (const slug of categoryOrder) {
  const items = products.filter((p) => p.categorySlug === slug);
  const meta = categoryMeta[slug] || { label: items[0]?.category || slug, desc: '' };
  const description = `Explore Tirich LED ${meta.label} — ${meta.desc || 'precision LED fixtures'} with specs, beam angles and finishes for residential, commercial and hospitality projects.`;
  routes.push({
    path: `/products/category/${slug}`,
    title: meta.label,
    description,
    image: items[0]?.image,
    jsonLd: collectionLd(meta.label, description, `/products/category/${slug}`, items),
  });
}

// Product detail pages
for (const p of products) {
  const description = `${p.tagline}. ${p.name} — premium LED ${p.category.toLowerCase()} from Tirich LED.`;
  routes.push({
    path: `/products/${p.slug}`,
    title: p.name,
    description,
    image: p.image,
    type: 'product',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: p.name,
        description,
        image: p.image,
        sku: p.slug.toUpperCase(),
        category: p.category,
        brand: { '@type': 'Brand', name: 'Tirich LED' },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Products', item: absUrl('/products') },
          { '@type': 'ListItem', position: 3, name: p.category, item: absUrl(`/products/category/${p.categorySlug}`) },
          { '@type': 'ListItem', position: 4, name: p.name, item: absUrl(`/products/${p.slug}`) },
        ],
      },
    ],
  });
}

/* ── render one route's HTML from the shell ──────────────────────── */
function buildHtml(route) {
  const url = route.canonical || absUrl(route.path);
  const fullTitle = route.path === '/' ? route.title : `${route.title} | Tirich LED`;
  const image = route.image || DEFAULT_IMAGE;
  const type = route.type || 'website';

  const head = [
    `<link rel="canonical" href="${esc(url)}"/>`,
    route.noindex ? `<meta name="robots" content="noindex,follow"/>` : '',
    `<meta property="og:site_name" content="Tirich LED"/>`,
    `<meta property="og:type" content="${esc(type)}"/>`,
    `<meta property="og:title" content="${esc(fullTitle)}"/>`,
    `<meta property="og:description" content="${esc(route.description)}"/>`,
    `<meta property="og:url" content="${esc(url)}"/>`,
    `<meta property="og:image" content="${esc(image)}"/>`,
    `<meta name="twitter:card" content="summary_large_image"/>`,
    `<meta name="twitter:title" content="${esc(fullTitle)}"/>`,
    `<meta name="twitter:description" content="${esc(route.description)}"/>`,
    `<meta name="twitter:image" content="${esc(image)}"/>`,
    ...(route.jsonLd ? route.jsonLd.map(jsonLdTag) : []),
  ].join('');

  return shell
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(fullTitle)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\/>/,
      `<meta name="description" content="${esc(route.description)}"/>`
    )
    .replace('</head>', `${head}</head>`);
}

let written = 0;
for (const route of routes) {
  const outDir = route.path === '/' ? BUILD_DIR : path.join(BUILD_DIR, route.path);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), buildHtml(route), 'utf8');
  written++;
}

/* ── 404.html (noindex) — hosts that support it serve it for unknowns ─ */
fs.writeFileSync(
  path.join(BUILD_DIR, '404.html'),
  buildHtml({
    path: '/404',
    title: 'Page not found',
    description: 'The page you are looking for could not be found. Browse the Tirich LED product range.',
    noindex: true,
    canonical: `${SITE_URL}/404`,
  }),
  'utf8'
);

/* ── image-enabled sitemap.xml ───────────────────────────────────── */
const today = new Date().toISOString().split('T')[0];
const staticPaths = ['/', '/products', '/about', '/contact', '/smart-lighting'];
const categoryPaths = categoryOrder.map((s) => `/products/category/${s}`);

const urlEntries = [];
for (const p of [...staticPaths, ...categoryPaths]) {
  urlEntries.push(`  <url><loc>${absUrl(p)}</loc><lastmod>${today}</lastmod></url>`);
}
for (const p of products) {
  urlEntries.push(
    `  <url><loc>${absUrl(`/products/${p.slug}`)}</loc><lastmod>${today}</lastmod>` +
      `<image:image><image:loc>${esc(p.image)}</image:loc><image:title>${esc(p.name)}</image:title></image:image></url>`
  );
}
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
  urlEntries.join('\n') +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(BUILD_DIR, 'sitemap.xml'), sitemap, 'utf8');

console.log(
  `[prerender-meta] ${written} route files (${products.length} products, ${categoryOrder.length} categories, ${routes.length - products.length - categoryOrder.length} pages) + 404.html + image sitemap (${staticPaths.length + categoryPaths.length + products.length} URLs)`
);
