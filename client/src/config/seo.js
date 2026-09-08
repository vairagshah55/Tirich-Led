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

/**
 * Homepage title and description — the two strings the "led light manufacturer
 * in surat / in india" queries are aimed at, so they lead with that phrase
 * rather than with the brand. Exported (rather than inlined in <Seo>) because
 * three places have to agree: <Seo>'s defaults, the pre-rendered <head>, and
 * the fallback tags in public/index.html.
 */
export const HOME_TITLE = 'LED Light Manufacturer in Surat, India | Tirich LED';
export const HOME_DESCRIPTION =
  'Tirich LED is an LED light manufacturer in Surat, India — COB downlights, track, linear, magnetic, panel and outdoor LED fixtures for homes and offices.';

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

/**
 * The `manufacturer` node every Product page carries. Written out in full
 * rather than as a bare `@id` reference: the Organization node itself is only
 * emitted on the homepage, so on a product page a lone reference would dangle.
 * The `@id` still ties it to that node for crawlers that follow it.
 */
export const manufacturerLd = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: BUSINESS.name,
  url: SITE_URL,
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
 * Builds a BreadcrumbList from [{ name, path }] crumbs, normalised to the
 * canonical no-trailing-slash form so the schema URLs match the canonicals.
 */
export const breadcrumbLd = (crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: `${SITE_URL}${c.path === '/' ? '/' : c.path.replace(/\/+$/, '')}`,
  })),
});


/** "Panel Lights" -> "Panel Light": reads naturally in a title. */
const singular = (c = '') => c.replace(/s$/, '');

/**
 * Lower-case a label's ordinary words and leave its acronyms alone:
 * "COB Lights" -> "COB lights", never "cob lights". A word is ordinary if it
 * is one capital followed by lower-case letters.
 */
const decap = (str = '') => str.replace(/\b[A-Z][a-z]+\b/g, (w) => w.toLowerCase());

/** Lower-case just the first letter, for a sentence that continues after a dash. */
const lower1 = (str = '') => (/^[A-Z][a-z]/.test(str) ? str[0].toLowerCase() + str.slice(1) : str);

/** The search phrase a category page is built to rank for. */
export const CATEGORY_SEO = {
  // Buyers search for a product type + "manufacturer in India"; the bare
  // category labels ("COB Lights") never said either. One phrase per category,
  // each a real product-type query this range can answer. The generic head
  // term ("LED light manufacturer in India") is a list-intent query that goes
  // to directories — these product-level forms are the ones a single
  // manufacturer's page can actually win.
  'cob-lights':     'COB Light Manufacturer in India',
  'downlights':     'LED Downlight Manufacturer in India',
  'linear-lights':  'Linear LED Light Manufacturer in India',
  'track-lights':   'LED Track Light Manufacturer in India',
  'magnetic-track': 'Magnetic Track Light Manufacturer in India',
  'fixtures':       'Industrial LED Fixture Manufacturer in India',
  'pendant-lights': 'LED Pendant Light Manufacturer in India',
  'surface-lights': 'Surface Mounted LED Light Manufacturer in India',
  'outdoor-lights': 'Outdoor LED Light Manufacturer in India',
};

export const categorySeoTitle = (slug, label = '') =>
  CATEGORY_SEO[slug] || `${singular(label)} Manufacturer in India`;

/**
 * Category meta description: who makes it, where, then the range's own line.
 * Kept under 160 by dropping the closing sentence before it would clip.
 */
export const categorySeoDescription = (slug, meta = {}) => {
  const what = decap(meta.label || slug);
  const lead = `Tirich LED manufactures ${what} in Surat, India — ${lower1(meta.desc) || 'precision LED fixtures'}.`;
  const tail = ' Full specs, beam angles and finishes for every fixture.';
  // 155, not 160: the audit measures the escaped attribute, where a range
  // line's "&" is five characters, and the tail is filler — cheaper to drop
  // than to let one ampersand push a page over.
  return clampDescription(lead.length + tail.length <= 155 ? lead + tail : lead);
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
export const productSeoTitles = (products) => {
  const tally = (key) => {
    const counts = new Map();
    for (const p of products) counts.set(key(p), (counts.get(key(p)) || 0) + 1);
    return counts;
  };

  // The tagline is the searchable part — "Anti-Glare COB Recessed Downlight"
  // is what a buyer types; "PRO-116" is not. So it leads. The suffix
  // " | Tirich LED" adds 13, and titles are kept at 65 or under, so anything
  // past 52 here falls back to SKU + range rather than clipping in the SERP.
  const TITLE_BUDGET = 52;
  const withTagline = (p) => `${p.name} — ${p.tagline}`;
  const withRange = (p) => `${p.name} ${singular(p.category)}`;
  const base = (p) => (p.tagline && withTagline(p).length <= TITLE_BUDGET ? withTagline(p) : withRange(p));

  // Two ranges can share a tagline word-for-word, so the ladder still has to
  // escalate: base -> base + range -> base + range + SKU is unique by
  // construction, since slugs are.
  const byBase = tally(base);
  const withBaseRange = (p) => `${base(p)} · ${singular(p.category)}`;
  const byBaseRange = tally(withBaseRange);

  const titles = new Map();
  for (const p of products) {
    if (byBase.get(base(p)) === 1) titles.set(p.slug, base(p));
    else if (byBaseRange.get(withBaseRange(p)) === 1) titles.set(p.slug, withBaseRange(p));
    else titles.set(p.slug, `${withBaseRange(p)} · ${p.slug.toUpperCase()}`);
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
export const productSeoDescription = (p) => {
  const lead = (p.tagline || '').trim().replace(/[.\s]+$/, '');
  const type = decap(singular(p.category || 'LED light'));
  const body = `${p.name} ${type} manufactured in Surat, India by Tirich LED — full specs, beam angle and finish.`;
  return clampDescription(lead ? `${lead}. ${body}` : body);
};

