/* eslint-disable */
/**
 * Build-time twin of src/config/seo.js.
 *
 * The sitemap generator and the <head> pre-renderer are plain CommonJS Node
 * scripts that run outside the CRA/Babel pipeline, so they can't import the ESM
 * config the app uses. Keep this file and src/config/seo.js in sync — the
 * pre-rendered <head> must match what <Seo> renders at runtime, or crawlers see
 * one set of tags and users' browsers replace them with another.
 */

const SITE_URL = 'https://tirichled.com';
const SITE_NAME = 'Tirich LED';
const DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`;

const DEFAULT_DESCRIPTION =
  'Tirich LED — precision LED lighting made in Surat. COB downlights, track, linear, magnetic, panels and outdoor fixtures for homes, offices and hospitality.';

const BUSINESS = {
  name: SITE_NAME,
  legalName: 'Tirich Lighting Company',
  // Real short forms people search for — no invented variants.
  alternateName: ['Tirich', 'Tirich Lighting'],
  telephone: '+91-73832-47625',
  email: 'salestirichled@gmail.com',
  addressLocality: 'Udhna, Surat',
  addressRegion: 'Gujarat',
  addressCountry: 'IN',
  sameAs: [
    'https://www.instagram.com/tirich_led/',
    'https://www.facebook.com/tirichledlighting',
    'https://www.justdial.com/Surat/Tirich-Lighting-Company-Near-Rayka-Circle-Udhna/0261PX261-X261-220429153837-B8G1_BZDET',
  ],
};

const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: BUSINESS.name,
  legalName: BUSINESS.legalName,
  alternateName: BUSINESS.alternateName,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: DEFAULT_IMAGE,
  email: BUSINESS.email,
  telephone: BUSINESS.telephone,
  address: {
    '@type': 'PostalAddress',
    addressLocality: BUSINESS.addressLocality,
    addressRegion: BUSINESS.addressRegion,
    addressCountry: BUSINESS.addressCountry,
  },
  sameAs: BUSINESS.sameAs,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    contactType: 'sales',
    areaServed: 'IN',
    availableLanguage: ['en', 'hi', 'gu'],
  },
};

const webSiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

/** Routes that exist in the app but must never be crawled or listed. */
const PRIVATE_ROUTES = ['/login', '/dashboard', '/ai-studio'];

/**
 * Client-only routes that get NO pre-rendered HTML file, so the host must hand
 * them to the SPA shell instead of 404ing. Every other route in the app IS
 * pre-rendered — which is what lets unknown URLs return a real HTTP 404 rather
 * than a soft-404 copy of the homepage.
 *
 * scripts/prerender-meta.js writes these into build/.htaccess. The patterns are
 * Apache-flavoured and get anchored there; the lead inbox is matched by shape
 * rather than by its literal path, so that path isn't copied into a new file.
 */
const SPA_FALLBACK_PATTERNS = [
  'login',
  'dashboard',
  'ai-studio',
  'leads-[0-9a-fA-F-]+',
];

const withSlash = (p) => (!p || p === '/' ? '/' : p.endsWith('/') ? p : `${p}/`);
const absUrl = (p) => `${SITE_URL}${withSlash(p)}`;

const breadcrumbLd = (crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: absUrl(c.path),
  })),
});

module.exports = {
  SITE_URL,
  SITE_NAME,
  DEFAULT_IMAGE,
  DEFAULT_DESCRIPTION,
  BUSINESS,
  PRIVATE_ROUTES,
  SPA_FALLBACK_PATTERNS,
  organizationLd,
  webSiteLd,
  breadcrumbLd,
  withSlash,
  absUrl,
};

/**
 * Builds a slug → <title> map for the whole catalogue.
 *
 * A handful of SKUs share a name across two different ranges (a TLC-121 panel
 * and a TLC-121 track spot); a couple share both name and range and differ
 * only by tagline. Their URLs are already distinct, but a bare "TLC-121" would
 * still put the same <title> on two indexable pages. So the title escalates
 * only as far as it has to: name → name + range → name + tagline.
 */
const productSeoTitles = (products) => {
  const tally = (key) => {
    const counts = new Map();
    for (const p of products) counts.set(key(p), (counts.get(key(p)) || 0) + 1);
    return counts;
  };

  // "Panel Lights" → "Panel Light": reads naturally appended to a SKU.
  const singular = (c = '') => c.replace(/s$/, '');
  const withRange = (p) => `${p.name} ${singular(p.category)}`;

  const byName = tally((p) => p.name);
  const byRange = tally(withRange);

  const titles = new Map();
  for (const p of products) {
    if (byName.get(p.name) === 1) titles.set(p.slug, p.name);
    else if (byRange.get(withRange(p)) === 1) titles.set(p.slug, withRange(p));
    else titles.set(p.slug, `${p.name} — ${p.tagline}`);
  }
  return titles;
};

module.exports.productSeoTitles = productSeoTitles;

/**
 * Google truncates meta descriptions around 160 characters. Copy is written to
 * fit, but this is the backstop so a long product tagline can never ship a
 * description that gets cut mid-word in the SERP.
 */
const clampDescription = (text = '', max = 160) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:—-]+$/, '')}…`;
};

module.exports.clampDescription = clampDescription;

/**
 * Parses src/data/products.js — the catalogue is a plain module with image
 * imports, so the build scripts (CommonJS, outside the CRA/Babel pipeline)
 * read it as text rather than importing it.
 *
 * CRITICAL: the app exports
 *
 *   export const PRODUCTS = PUBLISHED_SLUGS.map(s => _BY_SLUG.get(s)).filter(Boolean)
 *
 * so only slugs listed in PUBLISHED_SLUGS actually resolve to a page. Parsing
 * every `slug:` in the file instead yields 22 extra URLs whose pages render
 * "Product not found" — and putting those in the sitemap as indexable, with a
 * self-canonical, advertises 22 soft-404s. So the published list is the
 * filter, and _BY_SLUG's "last definition wins" is reproduced here.
 *
 * @param {string} source  contents of src/data/products.js
 * @param {(varName: string) => string} [resolveImage]  maps an image import
 *        identifier to a URL; defaults to the site's share image.
 */
const parseCatalogue = (source, resolveImage = () => DEFAULT_IMAGE) => {
  // 1. the published allow-list, in display order
  const listStart = source.indexOf('const PUBLISHED_SLUGS = [');
  const listEnd = source.indexOf('const _BY_SLUG');
  if (listStart < 0 || listEnd < 0) {
    throw new Error(
      'seo-shared: PUBLISHED_SLUGS / _BY_SLUG not found in products.js — the ' +
        'catalogue export shape changed; update parseCatalogue before trusting the build.'
    );
  }
  const publishedOrder = [
    ...source.slice(listStart, listEnd).matchAll(/'([^']+)'/g),
  ].map((m) => m[1]);

  // 2. every product definition in the file
  const productRe =
    /slug:\s*(['"])(.*?)\1,\s*\r?\n\s*name:\s*(['"])(.*?)\3,\s*\r?\n\s*category:\s*(['"])(.*?)\5,\s*\r?\n\s*categorySlug:\s*(['"])(.*?)\7,\s*\r?\n\s*tagline:\s*(['"])(.*?)\9,\s*\r?\n\s*image:\s*(\w+)/g;
  const bySlug = new Map();
  for (const m of source.matchAll(productRe)) {
    // last definition wins, matching _BY_SLUG in products.js
    bySlug.set(m[2], {
      slug: m[2],
      name: m[4],
      category: m[6],
      categorySlug: m[8],
      tagline: m[10],
      image: resolveImage(m[11]),
    });
  }

  // 3. published order, skipping anything the allow-list names but the file
  //    does not define (mirrors .filter(Boolean))
  const products = publishedOrder.map((slug) => bySlug.get(slug)).filter(Boolean);
  const unpublished = [...bySlug.keys()].filter((s) => !publishedOrder.includes(s));
  const unresolved = publishedOrder.filter((s) => !bySlug.has(s));

  // 4. category label/desc from ALL_CATEGORIES (commented entries are skipped
  //    naturally, since the regex needs slug/label/desc on consecutive lines)
  const categoryMeta = {};
  const categoryRe =
    /slug:\s*'([^']+)',\s*\r?\n\s*label:\s*'([^']+)',\s*\r?\n\s*desc:\s*'([^']*)'/g;
  for (const m of source.matchAll(categoryRe)) {
    categoryMeta[m[1]] = { label: m[2], desc: m[3] };
  }

  // 5. Reproduce the app's CATEGORIES export exactly:
  //
  //      export const CATEGORIES = ALL_CATEGORIES.filter((c) =>
  //        PRODUCTS.some((p) => p.categorySlug === c.slug));
  //
  //    i.e. an uncommented ALL_CATEGORIES entry that has >=1 published product.
  //    Deriving the list from product.categorySlug instead would add pages the
  //    app never links (products carry categorySlug 'panel-lights', but that
  //    category is commented out of ALL_CATEGORIES, so nothing in the nav,
  //    footer or filter chips points at it — an orphan by construction).
  const categoryOrder = Object.keys(categoryMeta).filter((slug) =>
    products.some((p) => p.categorySlug === slug)
  );

  return { products, categoryOrder, categoryMeta, unpublished, unresolved };
};

module.exports.parseCatalogue = parseCatalogue;
