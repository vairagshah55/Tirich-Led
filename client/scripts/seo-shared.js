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

// Homepage title and description — the two strings the "led light manufacturer
// in surat / in india" queries are aimed at, so they lead with that phrase
// rather than with the brand. Three places have to agree: <Seo>'s defaults,
// the pre-rendered <head>, and the fallback tags in public/index.html.
const HOME_TITLE = 'LED Light Manufacturer in Surat, India | Tirich LED';
const HOME_DESCRIPTION =
  'Tirich LED is an LED light manufacturer in Surat, India — COB downlights, track, linear, magnetic, panel and outdoor LED fixtures for homes and offices.';
// Site-wide fallback for any route without its own description.
const DEFAULT_DESCRIPTION = HOME_DESCRIPTION;

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
  description:
    'LED light manufacturer in Surat, Gujarat — COB downlights, track, linear, '
    + 'magnetic, panel and outdoor LED fixtures supplied across India.',
  foundingDate: '2021',
  areaServed: { '@type': 'Country', name: 'India' },
  knowsAbout: [
    'LED lighting manufacturing',
    'COB downlights',
    'LED track lights',
    'Linear LED modules',
    'Magnetic track lighting',
    'LED panel lights',
    'Outdoor and facade LED lighting',
  ],
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

// The `manufacturer` node every Product page carries. Written out in full
// rather than as a bare `@id` reference: the Organization node itself is only
// emitted on the homepage, so on a product page a lone reference would dangle.
// The `@id` still ties it to that node for crawlers that follow it.
const manufacturerLd = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: BUSINESS.name,
  url: SITE_URL,
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

// Canonical URL form: no trailing slash, except the root.
// Apache serves /about from /about/index.html without a redirect (see
// public/.htaccess), and /about/ 301s here — so this is the single form that
// canonicals, the sitemap, JSON-LD and internal links all use.
const canonicalPath = (p) => (!p || p === '/' ? '/' : p.replace(/\/+$/, ''));
const absUrl = (p) => `${SITE_URL}${canonicalPath(p)}`;

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
  HOME_TITLE,
  HOME_DESCRIPTION,
  BUSINESS,
  PRIVATE_ROUTES,
  SPA_FALLBACK_PATTERNS,
  organizationLd,
  manufacturerLd,
  webSiteLd,
  breadcrumbLd,
  canonicalPath,
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
 * A product page's meta description.
 *
 * Lived in two places and had drifted: scripts/prerender-meta.js built
 * "<tagline>. <name> — premium LED <category> from Tirich LED." while
 * ProductDetailPage sent "<tagline> — <description>", which clamping then cut
 * mid-word. Same URL, two different descriptions — the static file got the
 * tidy one and Google's renderer replaced it with the truncated one. One
 * function now, imported by both paths.
 */
const productSeoDescription = (p) => {
  const lead = (p.tagline || '').trim().replace(/[.\s]+$/, '');
  const body = `${p.name} — premium LED ${(p.category || 'lighting').toLowerCase()} from Tirich LED.`;
  return clampDescription(lead ? `${lead}. ${body}` : body);
};

module.exports.productSeoDescription = productSeoDescription;

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

  // 2b. Reproduce the magnetic-track split.
  //
  //      const MAGNETIC_SLUGS = new Set([...14 slugs...]);
  //      for (const _p of ALL_PRODUCTS) if (MAGNETIC_SLUGS.has(_p.slug)) {
  //        _p.category = 'Magnetic Track'; _p.categorySlug = 'magnetic-track'; }
  //
  //    products.js re-files 14 fittings out of Track Lights *after* the array
  //    literal, so their own `category:` / `categorySlug:` lines still read
  //    "Track Lights". Parsing only those lines put every one of them in the
  //    wrong category and left the app with a category page the build did not
  //    know existed: no pre-rendered file and no sitemap entry, while the
  //    footer of all 107 pages, the /products filter chips and 14 product
  //    breadcrumbs linked to it — and the SPA-fallback allowlist covers four
  //    client-only routes, so it answered with a real 404. The track-lights
  //    ItemList also claimed 14 products its own visible body never listed.
  //
  //    The replacement values are read back out of the loop rather than
  //    hard-coded here, so renaming the category in products.js cannot put
  //    this file out of step again.
  const magStart = source.indexOf('const MAGNETIC_SLUGS = new Set([');
  if (magStart >= 0) {
    const magBlock = source.slice(magStart);
    const magnetic = new Set(
      [...source.slice(magStart, source.indexOf(']', magStart)).matchAll(/'([^']+)'/g)]
        .map((m) => m[1])
    );
    const label = /_p\.category\s*=\s*'([^']+)'/.exec(magBlock);
    const slug = /_p\.categorySlug\s*=\s*'([^']+)'/.exec(magBlock);
    if (!label || !slug) {
      throw new Error(
        'seo-shared: MAGNETIC_SLUGS is present in products.js but the category ' +
          'it re-files into could not be read; update parseCatalogue before ' +
          'trusting the build.'
      );
    }
    for (const prod of bySlug.values()) {
      if (magnetic.has(prod.slug)) {
        prod.category = label[1];
        prod.categorySlug = slug[1];
      }
    }
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
