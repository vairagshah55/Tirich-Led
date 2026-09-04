/**
 * Central SEO configuration — the single source of truth for the site origin,
 * business identity and the site-wide JSON-LD blocks.
 *
 * Anything here that is also needed at build time (the sitemap generator and
 * the <head> pre-renderer are plain Node scripts and can't import JSX) is
 * mirrored in scripts/seo-shared.js. Keep the two in sync.
 *
 * Only verifiable facts belong in the structured data below — no invented
 * ratings, prices, opening hours or street addresses.
 */

export const SITE_URL = 'https://tirichled.com';
export const SITE_NAME = 'Tirich LED';

export const BUSINESS = {
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

/** Organization — emitted once, on the homepage. */
export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: BUSINESS.name,
  legalName: BUSINESS.legalName,
  alternateName: BUSINESS.alternateName,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/og-default.jpg`,
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

/** WebSite — enables the sitelinks search box. */
export const webSiteLd = {
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

/**
 * Builds a BreadcrumbList from [{ name, path }] crumbs. Paths get the trailing
 * slash the static host actually serves, so the schema URLs match the
 * canonicals exactly.
 */
export const breadcrumbLd = (crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: `${SITE_URL}${c.path === '/' || c.path.endsWith('/') ? c.path : `${c.path}/`}`,
  })),
});

/**
 * Builds a slug → <title> map for the whole catalogue.
 *
 * A handful of SKUs share a name across two different ranges (a TLC-121 panel
 * and a TLC-121 track spot); a couple share both name and range and differ
 * only by tagline. Their URLs are already distinct, but a bare "TLC-121" would
 * still put the same <title> on two indexable pages. So the title escalates
 * only as far as it has to: name → name + range → name + tagline.
 */
export const productSeoTitles = (products) => {
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

/**
 * Google truncates meta descriptions around 160 characters. Copy is written to
 * fit, but this is the backstop so a long product tagline can never ship a
 * description that gets cut mid-word in the SERP.
 */
export const clampDescription = (text = '', max = 160) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:—-]+$/, '')}…`;
};
