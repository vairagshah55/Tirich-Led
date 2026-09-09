# Tirich LED — SEO Implementation Guide

A step-by-step, engineer-ready plan to make the Tirich LED site rank and get
indexed correctly. Work top-to-bottom: each phase builds on the previous one.
Check off items as you go.

> **Stack reality check.** This is a **Create React App (CRA) single-page app**
> rendered entirely in the browser. When Googlebot, Bing, or a social scraper
> first requests a page, they receive an almost-empty HTML shell (`<div id="root">`
> plus the splash screen). Google *can* execute JS and eventually render it, but
> it's slower, flakier, and unavailable to many crawlers (Bing, LinkedIn,
> WhatsApp, X). **Fixing the rendering (Phase 2) is the single highest-impact
> task.** Everything else amplifies it.

---

## ✅ Implementation status (as of this commit)

**Done in code:**
- Phase 1 — `react-helmet-async` + reusable `<Seo>` component; every public page
  emits title, description, canonical, Open Graph & Twitter tags. Old
  `document.title` effect removed from `App.js`.
- Phase 2.1 — Product cards are now real crawlable `<Link>`s (modal still gates humans).
- **Phase 2 (pre-rendering) — SHIPPED via static `<head>` injection** instead of
  react-snap. `scripts/prerender-meta.js` runs as `postbuild` and writes a real
  HTML file per route (`build/products/<slug>/index.html`, etc.) with the correct
  title / description / canonical / OG / Twitter / JSON-LD baked into `<head>` —
  no headless Chrome, no hydration risk (body stays the empty `#root`, so the SPA
  renders client-side exactly as before). **Non-JS crawlers now get per-page meta
  + structured data.** Verified: e.g. `/products/pro-116` ships product title,
  description, product-specific `og:image` (hashed asset) and Product+Breadcrumb
  JSON-LD. `index.js` remains hydration-ready for a future full-body prerender/SSR.
- Phase 3 — JSON-LD: Organization + WebSite (landing), Product + BreadcrumbList
  (detail pages) — emitted both at runtime (`<Seo>`) and in the pre-rendered HTML.
- Phase 4 — `sitemap.xml` auto-generated at build (`prebuild` → `scripts/generate-sitemap.js`),
  now **131 URLs / 116 unique products**; `robots.txt` updated with disallows + sitemap ref.
- Phase 5 — OG/Twitter tags emitted (fallback image = `logo.png`).
- **Phase 8.1 — Duplicate slugs FIXED.** All 13 collisions resolved by giving the
  previously-shadowed product a descriptive slug (e.g. `tlc-151-linea-lazer`,
  `pro-130-cob`, `tlc-121-track`). All 116 products now have a unique URL.

**Audit pass 2 — architecture hardening (this commit):**
- **Category pages were orphans.** They shipped in the sitemap but had no
  crawlable inbound link: the `/products` filter chips were `<button onClick>`,
  and the mega-menu only mounts on hover. Chips are now `<Link>`s
  (`motion.create(Link)`, hover/tap motion preserved), and the footer carries a
  **Categories** column, so every category page is linked from every page.
- **`/products` and `/smart-lighting` had no `<Footer />`** — the catalogue, the
  single biggest hub, dead-ended. Both now render it.
- **Private routes emitted no metadata at all.** `/login`, `/dashboard`,
  `/ai-studio` and the lead inbox inherited the *previous* page's Helmet title
  and canonical on client-side navigation. All four now send
  `noindex,nofollow` via `<Seo>`.
- **robots.txt was publishing the secret lead-inbox path.** robots.txt is world
  readable, so `Disallow: /leads-<uuid>` advertised it. Removed — that page
  relies on `noindex,nofollow` and having no inbound links. Also dropped the
  proposed `Disallow` on `?search=` / `?category=`: blocking those would stop
  crawlers reading the very canonical/noindex directives that consolidate them.
- **404 canonicalised to the homepage.** `<Seo noindex />` with no `path` fell
  back to `/`, telling Google every dead URL *was* the homepage. `<Seo>` and the
  pre-renderer now emit no canonical at all when a page has no single URL.
- **Duplicate `<title>`s.** The 13 slug collisions fixed earlier left two
  distinct products sharing a name, so 12 titles were duplicated across
  indexable pages. `productSeoTitles()` now escalates only as far as needed:
  name → name + range → name + tagline. **131/131 unique.**
- **Default OG image.** The fallback was the 452×230 logo, below the 1200×630
  social minimum. `scripts/generate-og-image.js` renders a real
  `public/og-default.jpg` share card (Phase 5 closed).
- **Duplicate `<head>` tags.** `public/index.html` now ships fallback
  canonical/robots/OG/Twitter tags for any route the pre-renderer misses, and
  `prerender-meta.js` **strips them before injecting** per-route values — two
  canonicals on one page is worse than none.
- **One SEO config.** `src/config/seo.js` (runtime) + `scripts/seo-shared.js`
  (build-time twin) hold the origin, business identity, Organization/WebSite
  schema and the breadcrumb/title/description helpers. Sitemap, pre-renderer and
  `<Seo>` can no longer disagree.
- **Real `sameAs` + address.** Organization now carries the actual Instagram,
  Facebook and JustDial profiles, plus locality (Udhna, Surat / Gujarat / IN),
  email and phone. Footer social links point at the real profiles instead of `#`.
- **Structured data coverage.** BreadcrumbList added to `/products` and every
  category page; AboutPage and ContactPage schemas added. 256 JSON-LD blocks,
  all parse, **no offers / ratings / reviews** anywhere (nothing fabricated).
- **Semantic `<main>`** on every public page (`display: contents`, so layout is
  byte-identical); product breadcrumb is now `<nav aria-label="Breadcrumb">`;
  the product-not-found heading is an `<h1>`, not an `<h2>`.
- **Description discipline.** Templates tightened and `clampDescription()` caps
  every description at 160 chars on both render paths. 0 over-length, 131 unique.
- **CLS/LCP.** `width`/`height` on the nav logo, footer logo, mega-menu thumbs,
  product cards and related-product cards; `fetchpriority="high"` on the nav
  logo. Unused `web-vitals` dependency removed; stale `client/robots.txt` deleted.

**Audit pass 3 — keyword targeting for "LED light manufacturer in Surat / India" (this commit):**
- **The homepage was not aimed at the query it needs to win.** Title and H1 were
  both "Tirich LED — Precision LED Lighting": no *manufacturer*, no *Surat*, no
  *India*. A page cannot rank for a phrase it never uses. Now:
  - `<title>` → **"LED Light Manufacturer in Surat, India | Tirich LED"** (51 chars,
    phrase first, brand last).
  - `<h1>` → **"Tirich LED — LED Light Manufacturer in Surat, India"**. The H1 is
    the deliberately *stable* line (the rotating carousel headline is an `<h2>`),
    which is exactly why it is the right place for the phrase. Costs one extra
    wrapped line (+19px) on phones; the CTA still lands in the first screen at
    390×844 and 360×740, and 320px viewports were already two lines.
  - Meta description leads with "an LED light manufacturer in Surat, India".
- **`HOME_TITLE` / `HOME_DESCRIPTION` are now single-sourced** in
  `src/config/seo.js` + `scripts/seo-shared.js`. Three places had to agree —
  `<Seo>`'s defaults, the pre-rendered `<head>`, and the fallback tags in
  `public/index.html` — and previously all three held their own copy of the
  string.
- **Second and third pages now target the phrase too**, so the site does not
  rest on one URL: `/about` → "About Us — LED Light Manufacturer in Surat",
  `/products` → "All LED Lights & Fixtures" (was "All Products", which named
  neither a product nor a category).
- **Every product page now asserts who manufactures it.** `Product.manufacturer`
  added on both render paths (94 pre-rendered product pages + runtime), written
  as a full Organization node rather than a bare `@id`, since the Organization
  node itself is only emitted on the homepage.
- **Organization schema fleshed out** for entity understanding: `description`,
  `foundingDate: 2021` (from the About page's own copy), `areaServed: India`,
  and `knowsAbout` for the seven product families. Still no invented facts.
- **Duplicate `<head>` tags after hydration — FIXED (pre-existing bug, found
  while verifying the above).** The pre-rendered `<head>` was correct in the
  shipped bytes (one canonical, one description per file, which is all the
  audit checked), but `prerender-meta.js` never marked its tags with `data-rh`.
  react-helmet-async only reconciles tags carrying that attribute, so on
  hydration it left the pre-rendered ones in place and appended its own:
  **every route served a JS-executing crawler two canonicals, two descriptions
  and a duplicate set of og:/twitter:/JSON-LD tags.** Google executes JS, so
  this was undercutting the canonical consolidation the rest of the file is
  built around. The pre-renderer now marks exactly the tags `<Seo>` re-emits —
  `og:image:width`/`height` stay unmarked, since a marked tag Helmet does not
  render is deleted on hydration with nothing put back. Verified in headless
  Chrome across `/`, `/about`, `/products`, a product page and a category page:
  1 canonical and 1 description each before *and* after hydration, JSON-LD
  steady at 2 (was 2 → 4).
- `scripts/seo-audit.js` keys on tag shape, so its extractors now tolerate the
  new attribute — without that it reported "unique canonicals 1" for the whole
  site, a broken matcher rather than a broken site.

**Audit pass 7 — LocalBusiness switched on:**

- **The gate from pass 6 is now live.** `streetAddress` ("JEET INDUSTRIES, Plot
  88/89, near Raika Circle, Laxmi Nagar, Majura") and `postalCode` ("394210")
  are filled from the Google Business Profile panel and confirmed by the owner,
  so `organizationLd['@type']` is `['Organization', 'LocalBusiness']` with a
  complete `PostalAddress`. No code change was needed to flip it.
- **`addressLocality` is now "Udhana, Surat", not "Udhna".** The Business
  Profile is what feeds the local pack, so its spelling is the one to match.
- **Second phone line published.** The Business Profile carries
  +91-90334-38967 while the site only ever published +91-73832-47625. Both are
  real, separate lines; a number Google associates with the business that the
  site never mentions reads as a NAP mismatch. `contactPoint` is now an array
  and the second entry is conditional on `BUSINESS.telephoneAlt`.
- **Still gated off:** `geo`, `hasMap`, `openingHours` — the readiness warning
  now names exactly those three, and nothing empty or guessed is published.
- Audit: **75/78 passing**, 3 warnings.

> **Business Profile status (checked against a live SERP):** the profile
> EXISTS but is UNCLAIMED — Google shows "Do you own this business?". Category
> reads "lighting manufacturer"; 4.0 stars from 4 reviews. Claiming it, setting
> the primary category to "LED Light Manufacturer" and growing the review count
> outrank every on-page change in this file for "LED light manufacturer in
> Surat". Also confirmed: tirichled.com ranks #1 for the brand query, and the
> SERP still shows the pre-deploy title — stale index, not a deploy problem
> (verified by curling the live `<head>`).

**Audit pass 6 — LocalBusiness, gated on real data (this commit):**

- **The schema now upgrades itself.** `BUSINESS` in `src/config/seo.js` +
  `scripts/seo-shared.js` gained `streetAddress`, `postalCode`, `latitude`,
  `longitude`, `hasMap` and `openingHours`, all empty. Fill `streetAddress` and
  `postalCode` and `organizationLd['@type']` becomes
  `['Organization', 'LocalBusiness']` with a full `PostalAddress`; `geo`,
  `hasMap` and `openingHoursSpecification` each switch on independently as
  their fields are filled. Blank stays a plain `Organization` — verified: the
  shipped homepage schema is byte-identical to before, with no empty or
  placeholder keys.
- **Why gated rather than filled with an approximation.** Google cross-checks a
  LocalBusiness address against the Business Profile at the same location. A
  guessed street or PIN is a NAP mismatch, which costs the local pack the block
  exists to win — strictly worse than publishing nothing.
- **Scoped to `organizationLd`.** `manufacturerLd` carries a byte-identical
  `'@type': 'Organization'` / `'@id'` pair and stays a plain Organization: it is
  a reference node on 94 product pages, not a second claim to be a place. The
  first attempt at this edit matched both and was caught by a count assertion.
- **`seo-audit.js` now reports readiness** as a standing MEDIUM warning naming
  the fields still blank, so the pending state is visible on every run rather
  than remembered. A warning, not a failure — the correct state today is "not
  yet claimed".
- Audit: **75/78 passing**, 3 warnings (this one plus two pre-existing).

**Audit pass 5 — product-level keyword targeting (this commit):**

The generic head term ("LED light manufacturer in India") is a list-intent
query: Google answers it with directories and "top 10" articles, and a single
manufacturer's homepage is the wrong *page type* regardless of authority. The
product-level form of the same query — "COB light manufacturer in India",
"magnetic track light manufacturer in India" — has identical buyer intent, a
fraction of the competition, and a specific answer a manufacturer page can give.
So the site is now aimed there, one phrase per range.

- **Category pages own the "[product] manufacturer in India" phrases.**
  `CATEGORY_SEO` in `src/config/seo.js` + `scripts/seo-shared.js` maps each slug
  to its target ("COB Light Manufacturer in India", "Magnetic Track Light
  Manufacturer in India", "Industrial LED Fixture Manufacturer in India", …).
  `categorySeoTitle()` / `categorySeoDescription()` feed the `<title>`, the H1,
  the meta description and the `CollectionPage.name` on both render paths —
  bare range labels ("COB Lights") said neither *manufacturer* nor *India*.
  All 9 titles ≤ 60 chars with suffix.
- **Product titles lead with the tagline, not the SKU.** "PRO-116" is not a
  search; "Anti-Glare COB Recessed Downlight" is. `productSeoTitles()` now
  builds `<SKU> — <tagline>` (92 of 94), falls back to `<SKU> <range>` when that
  would exceed the 65-char budget with suffix (2 of 94), and still escalates
  through range and slug on a collision (0 needed). 94/94 unique, max 63.
- **Product descriptions name the type and the origin**: "…PRO-116 COB light
  manufactured in Surat, India by Tirich LED…". 94/94 unique, none clipped.
- **Deliberately *not* done:** "manufacturer in India" on all 94 product
  pages. That is keyword stuffing, and it would set every product page
  competing with its own category page for the same phrase. The category page
  is the hub for the phrase; product pages catch the spec-level long tail.
- **Acronym-safe casing.** `decap()` lower-cases a label's ordinary words and
  leaves acronyms alone ("COB lights", never "cob lights"); hoisted beside
  `singular()` and used by both description helpers.
- Category description tail is dropped at 155 rather than 160: the audit
  measures the HTML-escaped attribute, where one "&" in a range line is
  `&amp;`, and the tail is filler.
- Audit: **75/77 passing**, 108 unique titles / descriptions / canonicals,
  216 JSON-LD blocks, 0 invalid. Headless Chrome: no static/hydrated head
  differences across 14 real routes.

**Audit pass 4 — every-page 404, and two render paths that disagreed:**

Found by diffing the pre-rendered `<head>` against the same page *after*
hydration, across every route type. Each file passed every per-file check on its
own; the bugs were all in the gap between the two render paths, which nothing
was comparing.

- **`/products/category/magnetic-track` was linked from all 107 pages and
  answered 404.** `src/data/products.js` re-files 14 magnetic fittings out of
  Track Lights *after* the array literal (`MAGNETIC_SLUGS`), so their own
  `category:` / `categorySlug:` lines still read "Track Lights".
  `parseCatalogue()` in `scripts/seo-shared.js` reads the file as text and never
  reproduced that pass, so the build did not know the category existed: **no
  pre-rendered file, no sitemap entry** — while the footer of every page, the
  `/products` filter chips and 14 product breadcrumbs all linked to it, and the
  SPA-fallback allowlist covers only the four client-only routes. Fixed in
  `parseCatalogue`, which now applies the split and reads the replacement
  label/slug back out of the loop so a rename cannot desync it again. The build
  goes 107 → **108 routes, 9 categories**; those 14 products' `Product.category`
  and breadcrumbs now match the app, and the track-lights `ItemList` no longer
  claims 14 products its own visible body never listed.
- **`/products/category/panel-lights` answered 404 too, from 18 pages.**
  `panel-lights` is commented out of `ALL_CATEGORIES` but nine published
  products are still filed under it. `parseCatalogue`'s own comment asserted
  "nothing in the nav, footer or filter chips points at it — an orphan by
  construction"; that was true of those three, and missed
  `ProductDetailPage`, which built both the breadcrumb and the "View All"
  related-products link from `product.categorySlug` unconditionally. Both now
  fall back to `/products` when the category is not served, on the runtime and
  pre-rendered paths alike, so the trail reads Home / Products / PRO-130 rather
  than linking a dead category.
- **94 product pages shipped two different meta descriptions.** The
  pre-renderer built "`<tagline>`. `<name>` — premium LED `<category>` from
  Tirich LED."; `ProductDetailPage` built "`<tagline>` — `<description>`",
  which clamping then cut mid-word. Non-JS crawlers got the tidy one, Google's
  renderer replaced it with the truncation. Now one `productSeoDescription()`
  in `src/config/seo.js` + `scripts/seo-shared.js`, imported by both.
- **All 8 category pages disagreed on `og:image`** — the pre-renderer used the
  category's first fixture, `<Seo>` fell back to the generic share card.
  `ProductsPage` now passes the same image.
- **New audit check: "every internal link in a pre-rendered body resolves to a
  served route."** The bodies are captured from the running app, so this is the
  one check that spans both paths — it is what caught both 404s, and it would
  have caught them years earlier. File-backed hrefs (the catalogue PDF) and the
  SPA-fallback routes are allowed.
- Audit: **75/77 passing**, 108 unique titles / descriptions / canonicals,
  216 JSON-LD blocks, 0 invalid. Verified in headless Chrome: no static/hydrated
  head differences across 14 routes covering every page type.

**Frontend power-ups (earlier pass):**
- **Clean category landing pages** — real `/products/category/:slug` routes
  (`App.js`), each with a keyword H1 + intro copy, `CollectionPage` + `ItemList`
  JSON-LD, canonical to the clean path, and a pre-rendered HTML file. Nav,
  mega-menu and product breadcrumbs now link to these clean paths; legacy
  `?category=` still works and canonicalises to the clean URL.
- **`ItemList` structured data** on `/products` and every category page
  (product-carousel eligibility).
- **SEO-friendly 404** — real `NotFoundPage` (`noindex`) replaces the silent
  redirect-to-home; a `noindex` `build/404.html` is emitted for hosts that serve it.
- **Image SEO + CWV** — hero LCP `preload` + `fetchpriority="high"` (via `<Seo preloadImage>`),
  descriptive alt audit (all images have alt), and an **image sitemap**
  (`<image:image>` per product, with real hashed asset URLs).
- Sitemap now uses clean category URLs; the build-time sitemap is upgraded with
  product image entries in the pre-render step.

> **⚠️ Hosting requirement for the pre-render to take effect:** the static host
> must serve an existing file at the request path and only fall back to
> `/index.html` for unknown routes (standard SPA behaviour on Render / Netlify /
> Vercel / Cloudflare Pages). If a blanket `/* → /index.html` rewrite is set,
> make it a *fallback* (serve-file-first) or the per-route HTML is ignored.

**Still to do (needs account access or is optional polish):**
- Phase 5 — Create a real `1200×630` `public/og-default.jpg` and point `<Seo>` at
  it (currently the non-product fallback is `logo.png`).
- Phase 7 — Google Search Console / Bing / GA4 / Google Business Profile.
- **`LocalBusiness` / geo schema — still the biggest missing on-page lever for
  "in Surat" queries.** Blocked on facts that must not be invented: street
  address, pincode, opening hours, and the Google Maps place URL. Once supplied,
  `organizationLd` becomes `@type: ['Organization', 'LocalBusiness']` with a full
  `PostalAddress` + `geo` + `openingHoursSpecification` + `hasMap`.
- **Off-page is what actually decides local ranking** and none of it is code: a
  verified Google Business Profile at the Udhna address (primary category
  "LED light manufacturer"), review volume, and consistent name/address/phone
  citations on IndiaMART, JustDial and TradeIndia. On-page work above makes the
  site *eligible*; these are what move it up.
- Phase 9/10 — Content, keyword mapping, ongoing measurement.
- Optional: full-body pre-render (react-snap / SSR / Next.js) if you later want the
  visible copy — not just meta — in the initial HTML. See Phase 2.2/2.5 below.

---

## 0. Conventions used in this guide

- **Canonical base URL:** `https://tirichled.com`
  Decide **www vs non-www** once and stick to it (this guide assumes non-www).
  Configure a 301 redirect from the other variant at the host/CDN level.
- Replace every `https://tirichled.com` below if the production domain differs.
- File paths are relative to the repo root (`client/` is the frontend).
- ✅ = do it now · 🔁 = ongoing · ⏳ = larger effort / later phase.

---

## Current-state audit

| Area | Status | Where |
|------|--------|-------|
| `<title>` per route | ⚠️ Partial (title only) | `client/src/App.js` |
| Meta description per route | ❌ Missing (one static tag) | `client/public/index.html` |
| Canonical tags | ❌ Missing | — |
| Open Graph / Twitter cards | ❌ Missing | — |
| Structured data (JSON-LD) | ❌ Missing | — |
| Server-side render / prerender | ❌ None (CSR only) | CRA |
| Crawlable product links | ❌ `onClick` navigation, no `href` | `client/src/pages/ProductsPage/ProductsPage.jsx` |
| `sitemap.xml` | ❌ Missing | `client/public/` |
| `robots.txt` | ⚠️ Bare, no sitemap ref | `client/public/robots.txt` |
| Image `alt` text | ⚠️ Mostly present, audit needed | product cards use `alt={product.name}` |
| Duplicate URL slugs | ❌ 13 collisions | `client/src/data/products.js` |
| Analytics / Search Console | ❓ Verify | — |

---

## Phase 1 — On-page metadata foundation

Goal: every route emits a correct `<title>`, description, canonical, and social
tags — driven by React so they stay in sync with content.

### 1.1 ✅ Install `react-helmet-async`

```bash
cd client
npm install react-helmet-async
```

### 1.2 ✅ Wrap the app in the Helmet provider

In `client/src/index.js`:

```jsx
import { HelmetProvider } from 'react-helmet-async';

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
);
```

### 1.3 ✅ Create a reusable `<Seo>` component

`client/src/components/Seo/Seo.jsx`:

```jsx
import { Helmet } from 'react-helmet-async';

const SITE = 'https://tirichled.com';
const DEFAULT_IMG = `${SITE}/logo.png`;

export default function Seo({
  title,
  description,
  path = '',            // e.g. "/products/pro-116"
  image = DEFAULT_IMG,
  type = 'website',
  jsonLd,               // object or array of objects
  noindex = false,
}) {
  const url = `${SITE}${path}`;
  const fullTitle = title ? `${title} | Tirich LED` : 'Tirich LED — Precision LED Lighting';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,follow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content="Tirich LED" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
```

### 1.4 ✅ Retire the manual `document.title` effect

Remove the `useEffect` that sets `document.title` in `client/src/App.js`
(lines ~98–108) — `<Seo>` now owns titles. Keep a sensible default `<title>`
in `client/public/index.html` as a fallback.

### 1.5 ✅ Add `<Seo>` to every page

Add near the top of each page's returned JSX. Examples:

**Landing** (`client/src/pages/LandingPage/LandingPage.jsx`):
```jsx
<Seo
  path="/"
  description="Premium precision LED lighting for residential, commercial & hospitality spaces — COB downlights, track, linear, magnetic & panel lighting."
/>
```

**Products** (`client/src/pages/ProductsPage/ProductsPage.jsx`):
```jsx
<Seo
  title={activeCategoryLabel ? `${activeCategoryLabel}` : 'All Products'}
  path={activeCategoryLabel ? `/products?category=${activeCategory}` : '/products'}
  description="Browse the full Tirich LED catalogue — COB lights, downlights, linear, track, magnetic track, panels, fixtures and outdoor lighting."
/>
```

**Product detail** — see Phase 3 for the version with Product structured data.

- [ ] Landing `/`
- [ ] Products `/products`
- [ ] Product detail `/products/:slug`
- [ ] About `/about`
- [ ] Contact `/contact`
- [ ] Smart Lighting `/smart-lighting`
- [ ] Private routes (`/login`, `/dashboard`, `/ai-studio`, leads) → pass `noindex`

---

## Phase 2 — Make the site crawlable (highest impact) ⏳

CSR alone means most crawlers see an empty page. Two things fix this: real
links, and pre-rendered HTML.

### 2.1 ✅ Product cards must be real links

Today cards use `onClick → navigate(...)`, so there is no `<a href>` for
crawlers to follow and no URL to pre-render. Wrap each card in a router `<Link>`
so the `href` exists, while keeping the lead-capture modal for humans:

```jsx
import { Link } from 'react-router-dom';

<Link
  to={`/products/${product.slug}`}
  className={styles.card}
  onClick={(e) => {
    if (!hasLeadData()) {
      e.preventDefault();          // intercept humans → show modal
      handleProductClick(product.slug);
    }
  }}
>
  {/* card content */}
</Link>
```

Crawlers get a normal, followable link; visitors without a saved lead still see
the modal. Do the same for any other JS-only navigation (mega-menu, "view all").

### 2.2 ✅ Pre-render at build time with `react-snap`

`react-snap` runs a headless browser after `npm run build` and writes a fully
rendered `index.html` for each route into `build/`. Because the product cards
are now real `<Link>`s (2.1), it will **auto-discover and pre-render all 116
product pages** by crawling.

```bash
cd client
npm install --save-dev react-snap
```

`client/package.json`:
```jsonc
{
  "scripts": {
    "build": "react-scripts build",
    "postbuild": "react-snap"
  },
  "reactSnap": {
    "source": "build",
    "minifyHtml": { "collapseWhitespace": false, "removeComments": false },
    "puppeteerArgs": ["--no-sandbox", "--disable-setuid-sandbox"],
    "include": ["/", "/products", "/about", "/contact", "/smart-lighting"]
  }
}
```

### 2.3 ✅ Switch to hydration (React 18 requirement)

`react-snap` ships static HTML that React must *hydrate*, not overwrite. Update
`client/src/index.js`:

```jsx
import { hydrateRoot, createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const app = (
  <HelmetProvider>
    <BrowserRouter><App /></BrowserRouter>
  </HelmetProvider>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, app);   // pre-rendered by react-snap
} else {
  createRoot(container).render(app);  // dev / fallback
}
```

### 2.4 ✅ Handle the splash screen

The inline `#tirich-splash` in `index.html` will be captured in every
pre-rendered page. Ensure the JS that hides it (`splash-hide`) runs on load, and
that the splash is **not** the only thing crawlers see — the real content must
be in the DOM behind it (it will be, after 2.2). Consider removing the splash
from the pre-rendered snapshot or making it CSS-dismiss after load.

### 2.5 Alternatives (evaluate later) ⏳

- **Prerender middleware on the Express `server/`** (e.g. `prerender.io` or
  self-hosted) that serves rendered HTML only to bots via user-agent sniffing.
  Good fit since you already run a Node server on Render.
- **Migrate to Next.js** for true SSR/SSG + image optimization. Largest effort,
  best long-term SEO ceiling. Plan as a separate project.

> Pick **one** rendering strategy. `react-snap` (2.2–2.4) is the recommended
> near-term path because it keeps CRA and requires no infra changes.

---

## Phase 3 — Structured data (JSON-LD)

Rich results (product snippets, breadcrumbs, sitelinks search box). Add via the
`jsonLd` prop on `<Seo>`.

### 3.1 ✅ Organization + WebSite (site-wide)

Add once on the landing page:

```jsx
const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Tirich LED",
  url: "https://tirichled.com",
  logo: "https://tirichled.com/logo.png",
  sameAs: [ /* Instagram, LinkedIn, Facebook URLs */ ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-73832-47625",
    contactType: "sales"
  }
};

const siteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: "https://tirichled.com",
  name: "Tirich LED",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://tirichled.com/products?search={query}",
    "query-input": "required name=query"
  }
};

<Seo path="/" description="..." jsonLd={[orgLd, siteLd]} />
```

### 3.2 ✅ Product schema on detail pages

`client/src/pages/ProductDetailPage/ProductDetailPage.jsx`:

```jsx
const productLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  image: `https://tirichled.com${product.image}`,
  sku: product.slug.toUpperCase(),
  brand: { "@type": "Brand", name: "Tirich LED" },
  category: product.category,
  additionalProperty: [
    { "@type": "PropertyValue", name: "Wattage", value: product.wattage },
    { "@type": "PropertyValue", name: "CRI", value: product.cri },
    { "@type": "PropertyValue", name: "IP Rating", value: product.ip }
  ]
  // Add "offers" only if you publish prices; omit otherwise (no fake data).
};

<Seo
  title={product.name}
  path={`/products/${product.slug}`}
  description={product.tagline ? `${product.tagline}. ${product.description}` : product.description}
  image={`https://tirichled.com${product.image}`}
  type="product"
  jsonLd={productLd}
/>
```

### 3.3 ✅ BreadcrumbList

On product/category pages, mirror the on-screen breadcrumb:

```jsx
const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tirichled.com/" },
    { "@type": "ListItem", position: 2, name: "Products", item: "https://tirichled.com/products" },
    { "@type": "ListItem", position: 3, name: product.name, item: `https://tirichled.com/products/${product.slug}` }
  ]
};
```

Pass an array to `jsonLd`: `jsonLd={[productLd, breadcrumbLd]}`.

### 3.4 🔁 Validate

Test every template with the [Rich Results Test](https://search.google.com/test/rich-results)
and [Schema Markup Validator](https://validator.schema.org/).

---

## Phase 4 — Sitemap & robots

### 4.1 ✅ Generate `sitemap.xml` from product data

Since routes live in `products.js`, generate the sitemap at build time so it
never goes stale. `client/scripts/generate-sitemap.js`:

```js
// Node script — run before build. Reads products, writes public/sitemap.xml.
const fs = require('fs');
const path = require('path');

const SITE = 'https://tirichled.com';
const STATIC = ['/', '/products', '/about', '/contact', '/smart-lighting'];

// Extract slugs + category slugs from the data file (simple + dependency-free):
const data = fs.readFileSync(path.join(__dirname, '../src/data/products.js'), 'utf8');
const slugs = [...data.matchAll(/^\s*slug:\s*['"]([^'"]+)['"]/gm)].map(m => m[1]);
const categories = [...data.matchAll(/categorySlug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

const productUrls = [...new Set(slugs)].map(s => `/products/${s}`);
const categoryUrls = [...new Set(categories)].map(c => `/products?category=${c}`);

const urls = [...STATIC, ...categoryUrls, ...productUrls];
const today = new Date().toISOString().split('T')[0];

const xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), xml);
console.log(`sitemap.xml written with ${urls.length} URLs`);
```

> ⚠️ **Fix duplicate slugs first (Phase 8)** — otherwise the sitemap lists the
> same `/products/tlc-151` URL for two different products (duplicate content).
> The `new Set(slugs)` above de-dupes URLs but not the underlying data problem.

Wire it into `client/package.json`:
```jsonc
"scripts": {
  "prebuild": "node scripts/generate-sitemap.js",
  "build": "react-scripts build",
  "postbuild": "react-snap"
}
```

> Decide how to treat category URLs: `/products?category=x` uses a query string.
> Prefer clean paths like `/products/category/track-lights` long-term (needs a
> route change), or mark query variants canonical to `/products` and rely on
> product pages for indexing.

### 4.2 ✅ Update `robots.txt`

`client/public/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /login
Disallow: /dashboard
Disallow: /ai-studio
# (lead-inbox route deliberately NOT listed — robots.txt is public)

Sitemap: https://tirichled.com/sitemap.xml
```

---

## Phase 5 — Social sharing (Open Graph images)

- [ ] ✅ OG/Twitter tags are already emitted by `<Seo>` (Phase 1).
- [ ] ✅ Create a default share image `1200×630` (`public/og-default.jpg`) and set
      it as the fallback in `Seo.jsx`.
- [ ] Product pages should use the product image; ensure it's an **absolute URL**
      and reasonably large.
- [ ] Validate with the
      [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
      and X Card Validator. (These scrapers do **not** run JS — they rely on
      Phase 2 pre-rendering.)

---

## Phase 6 — Performance & Core Web Vitals

Core Web Vitals are ranking signals. Measure with
[PageSpeed Insights](https://pagespeed.web.dev/) and Lighthouse.

- [ ] ✅ Preload the hero/LCP image; keep `loading="lazy"` on below-fold images
      (product grid already lazy-loads — good).
- [ ] ✅ Self-host or `font-display: swap` the Google Fonts (already `&display=swap`).
      Consider `preconnect` (present) + subsetting.
- [ ] ✅ Serve images as WebP (already done) and add explicit `width`/`height`
      to prevent layout shift (CLS).
- [ ] ✅ Code-split heavy routes with `React.lazy` + `Suspense` (App already uses
      `Suspense`; confirm each page is lazily imported).
- [ ] ✅ Ensure the splash screen doesn't delay LCP or trap crawlers (Phase 2.4).
- [ ] 🔁 Target: **LCP < 2.5s, CLS < 0.1, INP < 200ms** on mobile.

---

## Phase 7 — Indexing, analytics & local presence

- [ ] ✅ **Google Search Console** — verify the domain (DNS TXT), submit
      `sitemap.xml`, monitor Coverage/Pages and Core Web Vitals.
- [ ] ✅ **Bing Webmaster Tools** — verify + submit sitemap (import from GSC).
- [ ] ✅ **Analytics** — install GA4 (or Plausible). Track product views,
      "enquire", WhatsApp clicks, catalogue downloads.
- [ ] ✅ **Google Business Profile** — critical for a lighting brand/showroom;
      add NAP (Name, Address, Phone), categories, photos.
- [ ] 🔁 After deploying Phase 2, use **URL Inspection → Request Indexing** in GSC
      for key pages to accelerate crawling.

---

## Phase 8 — Fix technical SEO debt

### 8.1 ✅ Resolve duplicate product slugs (duplicate content)

13 slugs are reused by two different products, so two products resolve to the
**same URL** — Google sees duplicate/again-changing content and
`/products/:slug` renders whichever it matches first.

Duplicates: `pro-130`, `pro-131`, `pro-132`, `pro-133`, `tlc-101`, `tlc-108`,
`tlc-121`, `tlc-129`, `tlc-151`, `tlc-152`, `tlc-226`, `tlc-333`, `tlc-338`.

Give each product a unique slug (e.g. `tlc-151-linea-lazer` vs
`tlc-151-tri-proof`). This directly improves crawl clarity and fixes broken
detail links.

### 8.2 ✅ 404 handling

`App.js` currently redirects unknown routes to `/` (`<Route path="*" → Navigate>`).
A soft-redirect to home for missing products hurts SEO. Prefer a real **404
page** that returns/represents "not found" so dead URLs aren't indexed as home.

### 8.3 ✅ Trailing-slash & case consistency

Pick one URL form and 301 the rest. Keep slugs lowercase and hyphenated
(already the convention).

---

## Phase 9 — Content & keyword strategy 🔁

Technical SEO gets you *indexed*; content gets you *ranked*.

- [ ] Map keywords to pages: category pages target head terms
      ("COB downlights", "magnetic track lighting India"), product pages target
      long-tail ("PRO-116 anti-glare COB recessed downlight 15W").
- [ ] Write unique 150–160 char meta descriptions per category (avoid the single
      shared description).
- [ ] Expand category pages with a short intro paragraph (use-cases, specs) —
      thin pages rank poorly.
- [ ] Add an **application / project** or **blog** section
      ("How to choose beam angle", "CRI explained", "lighting a retail store")
      to capture informational search and earn backlinks.
- [ ] Ensure every image has descriptive `alt` (audit: cards use `alt={product.name}`;
      make hero/gallery/diagram images descriptive too).
- [ ] Internal linking: link related products and from blog posts to product/category pages.

---

## Phase 10 — Measurement & maintenance 🔁

| Cadence | Task |
|---------|------|
| Each deploy | Regenerate sitemap; re-run Rich Results Test on changed templates |
| Weekly | GSC: new coverage errors, crawl anomalies, top queries |
| Monthly | PageSpeed/CWV check; fix regressions; review rankings for target keywords |
| Quarterly | Content refresh; prune/redirect dead pages; backlink review |

---

## Recommended execution order (TL;DR)

1. **Phase 1** — Helmet + `<Seo>` on every page (fast, foundational).
2. **Phase 2** — Real `<Link>`s + `react-snap` pre-render + hydration. *(biggest win)*
3. **Phase 8.1** — Fix duplicate slugs (do before generating the sitemap).
4. **Phase 4** — Sitemap + robots.
5. **Phase 3** — Structured data.
6. **Phase 5–6** — Social images + performance.
7. **Phase 7** — Search Console, analytics, GBP.
8. **Phase 9–10** — Content + ongoing.

---

### Quick dependency summary

```bash
cd client
npm install react-helmet-async   # already installed
```

Pre-rendering is done with an in-repo build script (`scripts/prerender-meta.js`,
runs as `postbuild`) — no `react-snap` / headless Chrome needed.

---

## Post-deploy verification (run after each deploy)

> Replace `tirichled.com` if the live domain differs. `curl` ships with Windows
> 10+/PowerShell and Git Bash. The `curl` checks read the **raw** HTML (no JS) —
> exactly what non-JS crawlers see.

### ✅ Check 1 — the critical one: is per-route meta in the RAW HTML?

This proves BOTH that pre-rendering shipped AND that the host serves the
per-route files (not the SPA fallback for everything).

```bash
# Product page — expect: <title>PRO-116 | Tirich LED</title>
curl -s https://tirichled.com/products/pro-116 | grep -o "<title>[^<]*</title>"

# Category page — expect: <title>Downlights | Tirich LED</title>
curl -s https://tirichled.com/products/category/downlights | grep -o "<title>[^<]*</title>"

# Product OG image + JSON-LD present in raw HTML
curl -s https://tirichled.com/products/pro-116 | grep -o "og:image\|application/ld+json"
```

**If these return the generic homepage title** (`Tirich LED — Precision Lighting`)
instead of the page-specific title, the host is serving `/index.html` for every
route → the pre-render isn't being used. Fix: make the SPA rewrite a
**fallback** (serve the real file if it exists, else `/index.html`). On Render
Static Sites this is the default; remove any blanket `/* → /index.html` rewrite
that overrides files.

### ✅ Check 2 — sitemap & robots are live

```bash
curl -sI https://tirichled.com/sitemap.xml | head -1     # expect: 200
curl -s  https://tirichled.com/sitemap.xml | grep -c "<loc>"   # expect: 131
curl -s  https://tirichled.com/robots.txt                # expect: Sitemap: line present
```

### ✅ Check 3 — structured data validates

- [Rich Results Test](https://search.google.com/test/rich-results) → paste a
  product URL: expect **Product** + **Breadcrumb**. Paste `/` : expect
  **Organization** / **Sitelinks searchbox**. Paste a category URL: **ItemList**.
- [Schema Markup Validator](https://validator.schema.org/) → no errors.

### ✅ Check 4 — social link previews (the non-JS crawlers we fixed)

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) →
  paste a product URL → title, description and product image should appear
  (click "Scrape Again" after redeploys).
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).
- Paste the link into **WhatsApp** / **X** → a preview card with the product
  image should render.

### ✅ Check 5 — Google Search Console (do once, then monitor)

1. Add & verify the property (DNS TXT for the domain).
2. Submit `https://tirichled.com/sitemap.xml`.
3. **URL Inspection** on a product URL → "View Crawled Page" shows the correct
   title/description → **Request Indexing**.
4. Over the following days: watch **Pages** (indexed count should climb toward
   ~131) and **Enhancements** (Products, Breadcrumbs).
5. Repeat sitemap submit in [Bing Webmaster Tools](https://www.bing.com/webmasters).

### ✅ Check 6 — Core Web Vitals

[PageSpeed Insights](https://pagespeed.web.dev/) on the homepage and a product
page → aim for **LCP < 2.5s, CLS < 0.1, INP < 200ms** (mobile). Confirm the hero
image is fetched early (the `<link rel="preload" ... fetchpriority="high">`).

### ✅ Check 7 — 404 & canonical

```bash
# Bogus URL should render the 404 page (noindex), not the homepage content
curl -s https://tirichled.com/this-does-not-exist | grep -o "noindex,follow\|Page not found"

# Canonical on a category page points to the clean path
curl -s https://tirichled.com/products/category/cob-lights | grep -o 'rel="canonical" href="[^"]*"'
```

> **Quick browser method for any page:** right-click → **View Page Source**
> (`Ctrl+U`). That's the pre-JS HTML — confirm `<title>`, `<meta name="description">`,
> `<link rel="canonical">`, `og:*` and the `application/ld+json` block are all
> present and correct. If they're only visible in DevTools *Elements* (post-JS)
> but not in View-Source, pre-rendering isn't being served (see Check 1).

---

## Hosting contract (Apache) — required for the pre-render to work

The build emits **131 route-specific HTML files** plus `404.html`. The host must
serve them in this order, and `client/public/.htaccess` now encodes exactly that:

```
/requested-route
      |
      +-- maps to a real file or directory?  -> serve it
      |      (the pre-rendered route HTML; mod_dir adds the trailing slash our
      |       canonicals use, so every route has exactly one 200 URL)
      |
      +-- a client-only app route?           -> /index.html (React Router)
      |      (login, dashboard, ai-studio, leads-<uuid> — the only routes with
      |       no pre-rendered file; list lives in scripts/seo-shared.js)
      |
      +-- anything else                      -> real HTTP 404 + /404.html
```

**The bug this replaced.** The previous `.htaccess` ended with:

```apache
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

A blanket catch-all. Two consequences, both confirmed against production:

1. **Every unknown URL returned HTTP 200** with the SPA shell — a soft 404.
   `curl -o /dev/null -w '%{http_code}' https://tirichled.com/random-non-existing-url`
   returned `200`. Google indexes those as thin duplicates of the homepage.
2. It only *happened* not to shadow the route files because `!-d` fails for a
   real directory. That was luck, not design — any host whose rewrite ran before
   the file check would have served the generic shell for all 131 routes.

The generated block is rebuilt on every `npm run build` from
`SPA_FALLBACK_PATTERNS`, so the allowlist cannot drift from the app's routes.
`npm run seo:audit` parses the shipped `build/.htaccess` and resolves 16 URLs
against the real build tree, failing CI if any status is wrong.

> **If the site ever moves off Apache**, the same three-step order must be
> reproduced. Nginx: `try_files $uri $uri/index.html @spa;` with a `location`
> allowlist for the four app routes and `error_page 404 /404.html`. Netlify /
> Vercel / Cloudflare: make the SPA rewrite a *fallback* (`status = 404` on the
> catch-all, or omit it and rely on `404.html`), never a blanket
> `/* -> /index.html` with status 200.

---

## Full-body pre-rendering — shipped

Every indexable route now ships its rendered body. A crawler with JavaScript
disabled gets the real page:

```
curl -s https://tirichled.com/products/pro-116 | grep -c '<div id="root"></div>'
0                       # no empty mount point

<h1>PRO-116</h1>        # …and the actual product page, breadcrumb,
                        #    specs, related products and footer
```

### Pipeline

```
npm run build
  │
  ├─ prebuild   generate-sitemap.js    public/sitemap.xml
  │
  ├─ build      react-scripts build    build/ (shell + hashed assets)
  │
  └─ postbuild
       ├─ prerender-meta.js   one HTML file per route: <head> only
       │                      + 404.html + app-shell.html + image sitemap
       │                      + build/.htaccess rules
       │                      + .prerender-routes.json  (route manifest)
       │
       └─ prerender-body.js   headless Chromium visits each route and injects
                              the rendered #root into the file above
```

The split matters: `prerender-meta.js` owns `<head>`, `prerender-body.js` owns
`<body>`, and neither touches the other's output. The metadata that passes the
audit is written once and never rewritten by the browser pass.

### Why not react-snap

It was evaluated first, and it does install and launch (its bundled Chromium 78
runs). It was rejected on four specific grounds:

| | |
|---|---|
| Rewrites `<head>` | `inlineCss`, `minimalcss`, `minifyHtml`, `removeStyleTags`, `preloadImages`. The head here is generated and audited (exactly one canonical / robots / OG set / JSON-LD block per route). Letting react-snap regenerate it means either duplicated tags — shell *and* Helmet — or losing the audited output. |
| No readiness hook | Only a fixed `waitFor` delay. A guessed delay is not a correctness mechanism for 107 routes. |
| Second route list | Discovers routes by crawling links or a hand-listed `include` array, competing with the list `prerender-meta.js` already derives from the catalogue. |
| Unmaintained | `puppeteer ^1.8.0` (2018); npm flags it as no longer supported. |

`prerender-body.js` drives Puppeteer directly instead — a devDependency, never
shipped to the browser — and injects only `#root`.

### Readiness is a signal, not a delay

`<Seo>` sets `window.__PRERENDER_READY__` after its effect commits. Every page
renders `<Seo>`, and every page is a `React.lazy` chunk, so the flag means "this
route's chunk resolved and its component mounted" — the actual async step.
Public page content comes from the bundled catalogue, not an API, so nothing
else has to be awaited. The timeout is a failure path.

`window.__PRERENDER__` is set before any app code runs, and is what freezes the
hero carousel so the captured HTML is deterministic.

### Two traps this pipeline avoids

**`build/index.html` is two different things.** It is the CRA shell *and* the
homepage's route file. Injecting the homepage body into it would mean the SPA
fallback serves a rendered homepage for `/login` — React would hydrate a login
page against homepage markup. So `prerender-meta.js` also emits
**`app-shell.html`**: an empty-`#root`, `noindex,nofollow` shell, and the
`.htaccess` fallback points at that instead. `prerender-meta.js` also snapshots
the pristine shell to `.prerender-shell.html` so a second `postbuild` run does
not template all 107 routes from an already-filled index.html.

**The splash screen.** `#tirich-splash` is `position: fixed; inset: 0` over a
white background. On a pre-rendered page there is nothing to cover — the content
is already in the HTML — and for any client that doesn't run the JS that removes
it, it is a full-viewport white layer over the content. `prerender-body.js`
strips it from the 107 route files, which also takes it off the LCP path.
`app-shell.html` keeps it, since those routes really do render client-side.

### Browser-API work this required

`src/utils/browser.js` centralises the guards. What changed and why:

| Site | Problem | Fix |
|---|---|---|
| `Navbar.jsx` | `useState(() => hasLeadData() ? getLeadData() : null)` read `localStorage` **during render**. The snapshot has no saved lead, so a returning visitor's first client render differed — a hydration mismatch on *every page*. | Starts `null`; read in `useEffect`. |
| `LeadCaptureModal.jsx` | `window.location.hostname` at module scope; raw `localStorage` calls. | `isLocalhost()`, `getStorageJson`, `setStorageJson`, `removeStorageItem` — all try/catch, so private-mode storage errors no longer throw. |
| `LeadListPage.jsx` | `window.location.hostname` at module scope. | `isLocalhost()`. |
| `LandingPage.jsx` | Carousel advanced during capture; rotating `<h1>`. | Frozen under `isPrerendering()`; stable `<h1>` (below). |

`App.js` was **not** modified. Its `localStorage` read in a `useState`
initialiser is safe here because the pre-renderer is a real browser, and
`authUser` only affects the private routes, which are never pre-rendered.

### The homepage H1

It was the rotating hero headline, so the primary heading changed with the
carousel and targeted nothing. That headline is now an `<h2>` (same class, no
visual change) and the `<h1>` is a stable line naming the business:

```
Tirich LED — Precision LED Lighting
```

It sits outside `.heroFade` so it does not flicker on a slide change, and it is
visible text, not a hidden SEO string.

### Catalogue bug this surfaced

The pre-render revealed that 22 of the previous 131 routes rendered "Product not
found". `products.js` exports

```js
export const PRODUCTS = PUBLISHED_SLUGS.map((s) => _BY_SLUG.get(s)).filter(Boolean);
```

but the build scripts regex-parsed *every* `slug:` in the file. The 22 extras
were the disambiguated slugs (`tlc-121-track`, `pro-130-cob`, …) that were never
added to `PUBLISHED_SLUGS` — so they were advertised in the sitemap as
indexable, with self-canonicals, and served a not-found page.

`parseCatalogue()` in `scripts/seo-shared.js` is now the single parser for both
build scripts, applies `PUBLISHED_SLUGS`, and rebuilds the app's `CATEGORIES`
filter exactly. **The real route count is 107** (94 products + 8 categories + 5
static), not 131. The 22 URLs should be restored by adding their slugs to
`PUBLISHED_SLUGS` — a catalogue decision, not an SEO one.

---

## Deploying — build off-host

**The production host does not build the site.** It serves static files.

The body pre-render needs headless Chrome, and Hostinger-style shared hosting
cannot run it. Building on the host fails at exactly that step:

```
[prerender-body] Could not find Chrome (ver. 152.0.7977.75)
  cache path: /home/uXXXXXXXX/.cache/puppeteer
ERROR: Failed to build the application
```

Installing Chrome there is not worth attempting on shared hosting: even once the
binary downloads, it usually cannot launch (no sandbox, missing `libnss3` /
`libatk` / `libgbm`, and a memory ceiling well below what Chromium wants).

### The pipeline

```
your machine / CI                          host (Apache)
─────────────────                          ─────────────
npm ci
npm run build          ──►  build/  ──►    upload as-is
npm run seo:audit                          serve statically
   (must pass)
```

`build/` is a finished artifact — 107 pre-rendered HTML files, hashed assets,
`sitemap.xml`, `robots.txt`, `404.html`, `app-shell.html`, `.htaccess`. There is
nothing for the host to compile.

**Upload the dotfiles.** `.htaccess` is easy to miss — many FTP clients hide
dotfiles by default. Without it, every unknown URL becomes a soft 404 again and
private routes lose their `X-Robots-Tag`.

**Gate the upload on the audit.** `npm run seo:audit` fails on empty bodies, so
it catches a degraded build before it ships:

```
✗ CRITICAL  no indexable route ships an empty #root
```

### If the host must run the build anyway

`prerender-body.js` degrades instead of failing: no browser means a loud warning
and exit 0, leaving the head-only HTML that `prerender-meta.js` wrote. That is
the pre-existing behaviour — correct metadata, empty body — so the deploy is not
blocked, but **the full-body benefit is lost**. It is not silent, and the audit
still fails on it.

To make it a hard error instead (recommended in CI):

```bash
PRERENDER_REQUIRED=1 npm run build
```

To skip it deliberately:

```bash
SKIP_PRERENDER_BODY=1 npm run build
```

To point at a Chrome you already have (VPS, or a CI image with one installed):

```bash
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium npm run build
```

### GitHub Actions sketch

Runners already have Chrome, so the standard workflow needs no extra setup:

```yaml
- uses: actions/setup-node@v4
  with: { node-version: 22, cache: npm }
- run: npm ci
  working-directory: client
- run: PRERENDER_REQUIRED=1 CI=true npm run build
  working-directory: client
- run: npm run seo:audit
  working-directory: client
# then rsync/FTP client/build/ to the host, dotfiles included
```
