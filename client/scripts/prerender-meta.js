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

const {
  SITE_URL,
  DEFAULT_IMAGE,
  organizationLd,
  webSiteLd,
  breadcrumbLd,
  absUrl,
  productSeoTitles,
  clampDescription,
  SPA_FALLBACK_PATTERNS,
  parseCatalogue,
} = require('./seo-shared');

const BUILD_DIR = path.join(__dirname, '..', 'build');
const SRC_DATA = path.join(__dirname, '..', 'src', 'data', 'products.js');

const source = fs.readFileSync(SRC_DATA, 'utf8');
// build/index.html is BOTH the CRA shell and the homepage's route file, and
// scripts/prerender-body.js injects the rendered homepage into it. Templating
// 107 routes from that would copy the homepage body into every one of them on a
// second postbuild run, so the pristine shell is snapshotted the first time it
// is seen with an empty #root and reused afterwards. Kept outside build/ so it
// never ships.
const SHELL_SNAPSHOT = path.join(__dirname, '..', '.prerender-shell.html');
const EMPTY_ROOT = /<div id="root">\s*<\/div>/;

function loadShell() {
  const built = fs.readFileSync(path.join(BUILD_DIR, 'index.html'), 'utf8');
  if (EMPTY_ROOT.test(built)) {
    // Fresh from react-scripts build — this is the canonical shell.
    fs.writeFileSync(SHELL_SNAPSHOT, built, 'utf8');
    return built;
  }
  if (fs.existsSync(SHELL_SNAPSHOT)) {
    console.log('[prerender-meta] build/index.html already has a body — templating from .prerender-shell.html');
    return fs.readFileSync(SHELL_SNAPSHOT, 'utf8');
  }
  throw new Error(
    'build/index.html has no empty #root and no shell snapshot exists. ' +
      'Run a clean npm build (react-scripts build must regenerate index.html).'
  );
}

const shell = loadShell();

/* ── helpers ─────────────────────────────────────────────────────── */
const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const jsonLdTag = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

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

/* ── parse the catalogue (shared with generate-sitemap.js) ────────── */
// parseCatalogue applies the PUBLISHED_SLUGS filter the app itself applies, so
// unpublished definitions never become routes. Without it 22 extra product URLs
// are emitted whose pages render "Product not found" — indexable soft-404s,
// listed in the sitemap.
const { products, categoryOrder, categoryMeta, unpublished } = parseCatalogue(
  source,
  imageUrlForVar
);
if (unpublished.length) {
  console.log(
    `[prerender-meta] skipped ${unpublished.length} unpublished product definition(s) — not in PUBLISHED_SLUGS`
  );
}

/* ── build routes ────────────────────────────────────────────────── */
const routes = [];

const CATALOGUE_DESC =
  'Browse the full Tirich LED catalogue — COB lights, downlights, linear, track, magnetic track, panels, fixtures and outdoor lighting.';

const collectionLd = (label, description, canonicalPath, items, crumbs) => [
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
  breadcrumbLd(crumbs),
];

// Home
routes.push({
  path: '/',
  title: 'Tirich LED — Precision LED Lighting',
  description:
    'Tirich LED — precision LED lighting made in Surat. COB downlights, track, linear, magnetic, panels and outdoor fixtures for homes, offices and hospitality.',
  jsonLd: [organizationLd, webSiteLd],
});

// All products
routes.push({
  path: '/products',
  title: 'All Products',
  description: CATALOGUE_DESC,
  jsonLd: collectionLd('LED Lighting Products', CATALOGUE_DESC, '/products', products, [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
  ]),
});

// Static pages. Each mirrors the JSON-LD its runtime <Seo> emits — without
// these blocks a non-JS crawler saw the correct <head> tags but no structured
// data at all on the three top-level pages.
const staticPageLd = (type, name, routePath, crumbName) => [
  {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    url: absUrl(routePath),
    mainEntity: { '@id': `${SITE_URL}/#organization` },
  },
  breadcrumbLd([
    { name: 'Home', path: '/' },
    { name: crumbName, path: routePath },
  ]),
];

routes.push({
  path: '/about',
  title: 'About Us',
  description:
    'Tirich LED designs and manufactures precision LED lighting — engineered for architects, designers and contractors across India.',
  jsonLd: staticPageLd('AboutPage', 'About Tirich LED', '/about', 'About Us'),
});
routes.push({
  path: '/contact',
  title: 'Contact Us',
  description:
    'Get in touch with Tirich LED for product enquiries, project quotes and lighting design support. Call, WhatsApp or send us a message.',
  jsonLd: staticPageLd('ContactPage', 'Contact Tirich LED', '/contact', 'Contact Us'),
});
routes.push({
  path: '/smart-lighting',
  title: 'Smart Lighting',
  description:
    'Tirich LED smart lighting — app and voice-controlled scenes, tunable white and dimming for modern homes, offices and hospitality spaces.',
  jsonLd: staticPageLd('WebPage', 'Tirich LED Smart Lighting', '/smart-lighting', 'Smart Lighting'),
});

// Category landing pages
for (const slug of categoryOrder) {
  const items = products.filter((p) => p.categorySlug === slug);
  const meta = categoryMeta[slug] || { label: items[0]?.category || slug, desc: '' };
  const description = `${meta.label} from Tirich LED — ${meta.desc || 'precision LED fixtures'}. Full specs, beam angles and finishes for every fixture.`;
  routes.push({
    path: `/products/category/${slug}`,
    title: meta.label,
    description,
    image: items[0]?.image,
    jsonLd: collectionLd(meta.label, description, `/products/category/${slug}`, items, [
      { name: 'Home', path: '/' },
      { name: 'Products', path: '/products' },
      { name: meta.label, path: `/products/category/${slug}` },
    ]),
  });
}

// Product detail pages — titles resolved so no two share a <title>.
const seoTitles = productSeoTitles(products);
for (const p of products) {
  const description = `${p.tagline}. ${p.name} — premium LED ${p.category.toLowerCase()} from Tirich LED.`;
  routes.push({
    path: `/products/${p.slug}`,
    title: seoTitles.get(p.slug),
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
      breadcrumbLd([
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: p.category, path: `/products/category/${p.categorySlug}` },
        { name: p.name, path: `/products/${p.slug}` },
      ]),
    ],
  });
}

/* ── render one route's HTML from the shell ────────────────── */

// public/index.html ships site-wide fallback tags (canonical, robots, og:*,
// twitter:*) so that any route this script does not emit still gets a share
// card. Per-route values must REPLACE them, not sit alongside them: two
// canonicals or two og:titles on one page is worse than none, because the
// crawler picks between them arbitrarily.
const SHELL_DEFAULTS = new RegExp(
  '[ \\t]*<(?:link rel="canonical"|meta (?:name="robots"|property="og:[^"]*"|' +
    'name="twitter:[^"]*"))[^>]*>\\r?\\n?',
  'g'
);

function buildHtml(route) {
  // canonical:false = this page answers for arbitrary URLs (the 404), so it
  // must not claim one — a canonical would map every dead URL onto it.
  const url = route.canonical === false ? null : route.canonical || absUrl(route.path);
  const fullTitle = route.path === '/' ? route.title : `${route.title} | Tirich LED`;
  const image = route.image || DEFAULT_IMAGE;
  const type = route.type || 'website';
  // Only the generated share card has known dimensions; product photos vary.
  const isDefaultImage = image === DEFAULT_IMAGE;
  const robots = route.noindex
    ? `noindex,${route.nofollow ? 'nofollow' : 'follow'}`
    : 'index,follow,max-image-preview:large,max-snippet:-1';

  const head = [
    url ? `<link rel="canonical" href="${esc(url)}"/>` : '',
    `<meta name="robots" content="${robots}"/>`,
    `<meta property="og:site_name" content="Tirich LED"/>`,
    `<meta property="og:locale" content="en_IN"/>`,
    `<meta property="og:type" content="${esc(type)}"/>`,
    `<meta property="og:title" content="${esc(fullTitle)}"/>`,
    `<meta property="og:description" content="${esc(clampDescription(route.description))}"/>`,
    url ? `<meta property="og:url" content="${esc(url)}"/>` : '',
    `<meta property="og:image" content="${esc(image)}"/>`,
    `<meta property="og:image:alt" content="${esc(fullTitle)}"/>`,
    isDefaultImage ? '<meta property="og:image:width" content="1200"/>' : '',
    isDefaultImage ? '<meta property="og:image:height" content="630"/>' : '',
    `<meta name="twitter:card" content="summary_large_image"/>`,
    `<meta name="twitter:title" content="${esc(fullTitle)}"/>`,
    `<meta name="twitter:description" content="${esc(clampDescription(route.description))}"/>`,
    `<meta name="twitter:image" content="${esc(image)}"/>`,
    `<meta name="twitter:image:alt" content="${esc(fullTitle)}"/>`,
    ...(route.jsonLd ? route.jsonLd.map(jsonLdTag) : []),
  ]
    .filter(Boolean)
    .join('');

  return shell
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(fullTitle)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${esc(clampDescription(route.description))}"/>`
    )
    .replace(SHELL_DEFAULTS, '')
    .replace('</head>', `${head}</head>`);
}

let written = 0;
for (const route of routes) {
  const outDir = route.path === '/' ? BUILD_DIR : path.join(BUILD_DIR, route.path);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), buildHtml(route), 'utf8');
  written++;
}

/* ── route manifest for the body pre-renderer ────────────────────── */
//
// This file owns route construction; scripts/prerender-body.js consumes the
// list rather than re-deriving it, so there is exactly one place that decides
// which 131 URLs exist. Written outside build/ so it never ships, and
// deliberately carries only what the body pass needs (the path and whether the
// route is indexable) — not the metadata, which is already baked into the HTML.
fs.writeFileSync(
  path.join(__dirname, '..', '.prerender-routes.json'),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      routes: routes.map((r) => ({ path: r.path, noindex: Boolean(r.noindex) })),
    },
    null,
    2
  ),
  'utf8'
);

/* ── app-shell.html — the SPA fallback target ────────────────────── */
//
// The four client-only routes (login / dashboard / ai-studio / lead inbox) are
// answered with this file rather than /index.html. Two reasons:
//
//   - index.html is the homepage's pre-rendered route file. Serving it for
//     /login would hand React a fully rendered homepage to hydrate a login
//     page against — a guaranteed mismatch that throws the markup away.
//   - This shell is noindex,nofollow in its own right, so those routes are
//     protected by the HTML as well as by the X-Robots-Tag header.
//
// #root is deliberately left empty: these routes render client-side only.
fs.writeFileSync(
  path.join(BUILD_DIR, 'app-shell.html'),
  buildHtml({
    path: '/app-shell',
    title: 'Tirich LED',
    description:
      'Tirich LED — precision LED lighting made in Surat. COB downlights, track, linear, magnetic, panels and outdoor fixtures for homes, offices and hospitality.',
    noindex: true,
    nofollow: true,
    canonical: false,
  }),
  'utf8'
);

/* ── 404.html (noindex) — hosts that support it serve it for unknowns ─ */
fs.writeFileSync(
  path.join(BUILD_DIR, '404.html'),
  buildHtml({
    path: '/404',
    title: 'Page not found',
    description: 'The page you are looking for could not be found. Browse the Tirich LED product range.',
    noindex: true,
    nofollow: false,
    canonical: false,
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

/* ── build/.htaccess: SPA fallback allowlist ─────────────────────── */
//
// Only the client-only routes below have no pre-rendered HTML file, so only
// they may fall back to the shell. Everything else that isn't a real file or
// directory is genuinely missing and must reach Apache's 404 handler
// (ErrorDocument 404 /404.html) — rewriting it to /index.html would answer a
// dead URL with HTTP 200 and get it indexed as a soft 404.
const htaccessPath = path.join(BUILD_DIR, '.htaccess');
if (fs.existsSync(htaccessPath)) {
  const rules = [
    '  # @generated:spa-fallback — written by scripts/prerender-meta.js',
    ...SPA_FALLBACK_PATTERNS.flatMap((p) => [
      '  RewriteCond %{REQUEST_FILENAME} !-f',
      '  RewriteCond %{REQUEST_FILENAME} !-d',
      `  RewriteRule ^(${p})/?$ /app-shell.html [L]`,
    ]),
    '  # Everything else: no rewrite. Real files and directories are served as',
    '  # they are (that is the pre-rendered route HTML); unknown paths fall',
    '  # through to ErrorDocument 404 /404.html with a real 404 status.',
    '  # @end:spa-fallback',
  ].join('\n');

  const src = fs.readFileSync(htaccessPath, 'utf8');
  const start = src.indexOf('  # @generated:spa-fallback');
  const endMark = '  # @end:spa-fallback';
  const end = src.indexOf(endMark);
  if (start < 0 || end < 0) {
    console.warn('[prerender-meta] WARNING: .htaccess markers missing — SPA fallback not narrowed; unknown URLs will soft-404');
  } else {
    fs.writeFileSync(
      htaccessPath,
      src.slice(0, start) + rules + src.slice(end + endMark.length),
      'utf8'
    );
    // Same allowlist drives the HTTP-level noindex for those routes: the SPA
    // shell they are served with says index,follow in its static <head>, and
    // only a JS-executing crawler sees the runtime <Seo noindex nofollow>.
    let conf = fs.readFileSync(htaccessPath, 'utf8');
    const nStart = conf.indexOf('  # @generated:private-noindex');
    const nEnd = conf.indexOf('  # @end:private-noindex');
    if (nStart >= 0 && nEnd >= 0) {
      // Match on a literal prefix so the lead inbox's real path is never written
      // here — the UUID body is irrelevant to the header.
      const prefixes = SPA_FALLBACK_PATTERNS.map((p) => p.replace(/\[.*$/, '').replace(/\\.*$/, ''));
      const line =
        '  # @generated:private-noindex — written by scripts/prerender-meta.js\n' +
        `  SetEnvIf Request_URI "^/(${prefixes.join('|')})" TIRICH_PRIVATE_ROUTE\n`;
      conf = conf.slice(0, nStart) + line + conf.slice(nEnd);
      fs.writeFileSync(htaccessPath, conf, 'utf8');
      console.log(
        `[prerender-meta] build/.htaccess: X-Robots-Tag noindex,nofollow for ${prefixes.join(', ')}`
      );
    } else {
      console.warn('[prerender-meta] WARNING: private-noindex markers missing — private routes rely on JS-only noindex');
    }

    console.log(
      `[prerender-meta] build/.htaccess: SPA fallback narrowed to ${SPA_FALLBACK_PATTERNS.length} client-only routes; unknown URLs now return a real 404`
    );
  }
} else {
  console.warn('[prerender-meta] WARNING: build/.htaccess missing — is public/.htaccess still present?');
}

console.log(
  `[prerender-meta] ${written} route files (${products.length} products, ${categoryOrder.length} categories, ${routes.length - products.length - categoryOrder.length} pages) + 404.html + image sitemap (${staticPaths.length + categoryPaths.length + products.length} URLs)`
);
