import { Helmet } from 'react-helmet-async';

/**
 * Central place for the production origin. Update here if the domain changes.
 * Used to build absolute canonical / Open Graph URLs (crawlers require these).
 */
export const SITE_URL = 'https://tirichled.com';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;
const DEFAULT_TITLE = 'Tirich LED — Precision LED Lighting';
const DEFAULT_DESCRIPTION =
  'Premium precision LED lighting for residential, commercial and hospitality spaces — COB downlights, track, linear, magnetic track, panels, fixtures and outdoor lighting.';

/**
 * Per-page SEO tags: title, description, canonical, Open Graph, Twitter card
 * and optional JSON-LD structured data.
 *
 * @param {string}  [title]        Page title (site name is appended automatically).
 * @param {string}  [description]  Meta description (~150–160 chars).
 * @param {string}  [path]         Path incl. leading slash, e.g. "/products/pro-116".
 * @param {string}  [image]        Absolute or root-relative share image URL.
 * @param {string}  [type]         Open Graph type ("website" | "product" | "article").
 * @param {object|object[]} [jsonLd] One or more schema.org objects.
 * @param {boolean} [noindex]      Set true for private/utility pages.
 * @param {string}  [preloadImage] LCP image to preload with high priority (CWV).
 */
export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
  noindex = false,
  preloadImage,
}) {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title ? `${title} | Tirich LED` : DEFAULT_TITLE;
  const absoluteImage = image?.startsWith('http') ? image : `${SITE_URL}${image}`;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,follow" />}
      {preloadImage && (
        <link rel="preload" as="image" href={preloadImage} fetchpriority="high" />
      )}

      {/* Open Graph */}
      <meta property="og:site_name" content="Tirich LED" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={absoluteImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
