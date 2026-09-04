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
- `LocalBusiness` / geo schema — deferred (needs showroom address, hours, socials).
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

## Full-body pre-render / SSR — audit and recommendation

**Current state.** Only `<head>` is pre-rendered. Verified live:

```
curl -s https://tirichled.com/ | grep -o '<div id="root"></div>'
-> <div id="root"></div>
```

Per-route title, description, canonical, OG/Twitter and JSON-LD are all correct
in the raw HTML, but **no visible copy reaches a non-JS crawler**. This is now
the single largest remaining SEO limitation.

**Node SSR (`renderToString`) is not viable without touching App.js.** Five
module-scope browser accesses execute at import time, before any React lifecycle:

| File | Line | Access |
|---|---|---|
| `components/LeadCaptureModal/LeadCaptureModal.jsx` | 14 | `window.location.hostname` |
| `pages/LeadListPage/LeadListPage.jsx` | 10 | `window.location.hostname` |
| `pages/LandingPage/LandingPage.jsx` | 151 | `window.matchMedia(...)` |
| `pages/ProductsPage/ProductsPage.jsx` | 17 | `window.scrollTo` (in a closure — safe) |
| `index.js` | 8 | `document.getElementById` |

Plus `App.js:27` reads `localStorage` inside a `useState` initialiser, which runs
**during render**. SSR would throw on the first request. Fixing it means guarding
each site and moving the auth bootstrap into an effect — i.e. editing App.js and
changing auth timing, which is outside the agreed scope.

**Headless-Chrome pre-render (react-snap / Puppeteer) is the safe path**, because
it renders in a real browser: every one of the accesses above works unchanged.
Readiness:

- `index.js` already calls `hydrateRoot` when `#root` has children — the app is
  hydration-ready today, no change needed.
- `react-helmet-async` and `motion/react` both support hydration.
- Product cards, category chips and footer links are real `<a href>`s, so the
  crawler can discover all 131 routes on its own.

Four things to handle before enabling it:

1. **The splash screen.** `#tirich-splash` is `position: fixed; inset: 0` and
   would be captured in all 131 snapshots, covering the content until JS removes
   it. Gate it on a `data-prerendered` flag, or strip it in a post-snapshot step.
2. **Carousel state freezes** at whichever hero slide is active on snapshot —
   acceptable (slide 1 is the LCP content), but the `<h1>` becomes whichever
   headline was showing. See the H1 note below.
3. **`localStorage`-gated UI** snapshots in its logged-out / no-lead state. That
   is the correct default for a crawler, but confirm the lead-capture modal is
   not baked open.
4. **Build time**: 131 pages through headless Chrome adds minutes. Run it only
   for production builds.

**Recommendation:** react-snap, in that order, as a separate change with its own
verification pass. Do **not** migrate to Next.js for this — it would rewrite
routing, data loading and the build for a problem react-snap solves in the
existing architecture.

### Related content note — the homepage `<h1>`

The homepage `<h1>` is the rotating hero headline (`Minimal Presence, Maximum
Comfort`, etc.), so the page's primary heading changes with the carousel and
targets no term. It costs nothing today because the body isn't pre-rendered and
no crawler sees it — but it must be settled **before** full-body pre-render, or
131 pages ship with an arbitrary H1. A stable, descriptive H1 with the rotating
copy demoted to a `<p>`/`<h2>` is the fix; it is a copy decision, not a code one.
