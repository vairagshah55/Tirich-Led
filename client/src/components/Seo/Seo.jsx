import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { clampDescription } from '../../config/seo';
import { isBrowser } from '../../utils/browser';

/**
 * Central place for the production origin. Update here if the domain changes.
 * Used to build absolute canonical / Open Graph URLs (crawlers require these).
 */
export const SITE_URL = 'https://tirichled.com';
// 1200×630 landscape share card. Social scrapers reject or badly crop the
// 452×233 brand logo. Regenerate with: node scripts/generate-og-image.js
const DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`;
const DEFAULT_TITLE = 'Tirich LED — Precision LED Lighting';
const DEFAULT_DESCRIPTION =
  'Tirich LED — precision LED lighting made in Surat. COB downlights, track, linear, magnetic, panels and outdoor fixtures for homes, offices and hospitality.';

/**
 * Per-page SEO tags: title, description, canonical, Open Graph, Twitter card
 * and optional JSON-LD structured data.
 *
 * @param {string}  [title]        Page title (site name is appended automatically).
 * @param {string}  [description]  Meta description (~150–160 chars).
 * @param {string}  [path]         Path incl. leading slash, e.g. "/products/pro-116".
 *                                 Omit on pages that have no single canonical URL
 *                                 (the 404 catch-all); no canonical is emitted then.
 * @param {string}  [image]        Absolute or root-relative share image URL.
 * @param {string}  [type]         Open Graph type ("website" | "product" | "article").
 * @param {object|object[]} [jsonLd] One or more schema.org objects.
 * @param {boolean} [noindex]      Keep the page out of the index ("noindex,follow").
 * @param {boolean} [nofollow]     Also stop link equity flowing out (private pages).
 * @param {string}  [imageAlt]     Alt text for the share image.
 * @param {string}  [preloadImage] LCP image to preload with high priority (CWV).
 */
export default function Seo({
  title,
  description: rawDescription = DEFAULT_DESCRIPTION,
  path = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
  noindex = false,
  nofollow = false,
  imageAlt,
  preloadImage,
}) {
  // Static hosting serves routes as directories, so the live URL always has a
  // trailing slash (e.g. /products/pro-116/). Normalise canonical/OG URLs to
  // match what's actually served — avoids redirect/canonical conflicts.
  const cleanPath = (() => {
    if (!path) return null;
    const base = path.split(/[?#]/)[0];
    if (base === '/' || base === '') return '/';
    return base.endsWith('/') ? base : `${base}/`;
  })();
  const description = clampDescription(rawDescription);
  // A page with no canonical path of its own (the 404 catch-all, which answers
  // for arbitrary URLs) must not claim one. Pointing it at "/" would tell
  // Google every dead URL is the homepage.
  const url = cleanPath ? `${SITE_URL}${cleanPath}` : null;
  const fullTitle = title ? `${title} | Tirich LED` : DEFAULT_TITLE;
  const absoluteImage = image?.startsWith('http') ? image : `${SITE_URL}${image}`;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  // Default is index,follow — emitted explicitly so a stale tag from a
  // previously rendered route can never leak onto a public page.
  const robots = noindex
    ? `noindex,${nofollow ? 'nofollow' : 'follow'}`
    : 'index,follow,max-image-preview:large,max-snippet:-1';

  // Readiness signal for scripts/prerender-body.js.
  //
  // Every page renders <Seo>, and every page is a React.lazy chunk, so this
  // effect firing means "the route's chunk resolved and its component
  // committed" — the real async step, and a deterministic signal rather than a
  // guessed delay. The rAF gives Helmet one frame to flush its head tags.
  // Public page content comes from the bundled catalogue, not an API, so
  // nothing further has to be awaited.
  useEffect(() => {
    if (!isBrowser || window.__PRERENDER__ !== true) return;
    const id = requestAnimationFrame(() => {
      window.__PRERENDER_READY__ = true;
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {url && <link rel="canonical" href={url} />}
      <meta name="robots" content={robots} />
      {preloadImage && (
        <link rel="preload" as="image" href={preloadImage} fetchpriority="high" />
      )}

      {/* Open Graph */}
      <meta property="og:site_name" content="Tirich LED" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:alt" content={imageAlt || fullTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
      <meta name="twitter:image:alt" content={imageAlt || fullTitle} />

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
