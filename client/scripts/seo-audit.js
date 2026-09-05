#!/usr/bin/env node
/* eslint-disable */
/**
 * SEO regression suite. Runs against the real production build in build/ —
 * never against source — so every assertion reflects what actually ships.
 *
 *   npm run seo:audit          # after a build
 *   npm run build && npm run seo:audit
 *
 * Exits 1 on any CRITICAL or HIGH failure so CI blocks the regression.
 * Warnings (medium/low) are reported but do not fail the run.
 *
 * What it cannot check offline is stated as a WARN, not silently passed: real
 * HTTP status codes need a live Apache. The route-resolution checks below
 * therefore simulate the rules parsed out of the shipped build/.htaccess
 * against the real build tree, which verifies the rule logic and the presence
 * of every file those rules depend on.
 */
const fs = require('fs');
const path = require('path');
const {
  SITE_URL,
  SPA_FALLBACK_PATTERNS,
  PRIVATE_ROUTES,
  parseCatalogue,
} = require('./seo-shared');

const BUILD = path.join(__dirname, '..', 'build');
const SRC = path.join(__dirname, '..', 'src');

const MAX_TITLE = 65;
const MAX_DESC = 160;

// Derived from the catalogue, never hardcoded: the published product list is
// the source of truth, so the expected count follows a data change instead of
// silently disagreeing with it.
const STATIC_ROUTE_COUNT = 5; // /  /products  /about  /contact  /smart-lighting
const catalogue = parseCatalogue(
  fs.readFileSync(path.join(SRC, 'data', 'products.js'), 'utf8')
);
const EXPECTED_ROUTES =
  STATIC_ROUTE_COUNT + catalogue.categoryOrder.length + catalogue.products.length;

/* ── result plumbing ─────────────────────────────────────────────── */
const results = [];
const record = (sev, name, ok, detail) => results.push({ sev, name, ok, detail });
const critical = (n, ok, d) => record('CRITICAL', n, ok, d);
const high = (n, ok, d) => record('HIGH', n, ok, d);
const medium = (n, ok, d) => record('MEDIUM', n, ok, d);
const low = (n, ok, d) => record('LOW', n, ok, d);

if (!fs.existsSync(BUILD)) {
  console.error('build/ not found — run `npm run build` first.');
  process.exit(1);
}

/* ── collect every pre-rendered route ────────────────────────────── */
const meta = (html, re) => (html.match(re) || [])[1];

// Everything inside <div id="root">…</div> — what a crawler with no JS sees.
const rootMarkup = (html) => {
  const open = html.indexOf('<div id="root">');
  if (open < 0) return { html: '', text: '', h1: 0, h2: 0, links: 0, imgs: 0, footer: false };
  const inner = html.slice(open + '<div id="root">'.length, html.lastIndexOf('</div>'));
  const text = inner
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return {
    html: inner,
    text,
    h1: (inner.match(/<h1[\s>]/gi) || []).length,
    h2: (inner.match(/<h2[\s>]/gi) || []).length,
    links: (inner.match(/<a\s[^>]*href=/gi) || []).length,
    imgs: (inner.match(/<img[\s>]/gi) || []).length,
    footer: /<footer[\s>]/i.test(inner),
  };
};
const countOf = (html, re) => (html.match(re) || []).length;

const routes = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') {
      const html = fs.readFileSync(p, 'utf8');
      const rel = path.relative(BUILD, path.dirname(p)).split(path.sep).join('/');
      routes.push({
        file: p,
        // Directory on disk -> canonical URL. The files still live at
        // about/index.html; the URL that serves them is /about.
        urlPath: rel ? `/${rel}` : '/',
        html,
        title: meta(html, /<title>([^<]*)<\/title>/),
        description: meta(html, /<meta name="description" content="([^"]*)"/),
        canonical: meta(html, /<link rel="canonical" href="([^"]*)"/),
        robots: meta(html, /<meta name="robots" content="([^"]*)"/),
        ogImage: meta(html, /<meta property="og:image" content="([^"]*)"/),
        ogTitle: meta(html, /<meta property="og:title" content="([^"]*)"/),
        ogUrl: meta(html, /<meta property="og:url" content="([^"]*)"/),
        twitterCard: meta(html, /<meta name="twitter:card" content="([^"]*)"/),
        nCanonical: countOf(html, /rel="canonical"/g),
        nOgTitle: countOf(html, /property="og:title"/g),
        nRobots: countOf(html, /name="robots"/g),
        nDesc: countOf(html, /name="description"/g),
        nMain: countOf(html, /<main[\s>]/g),
        // Body pre-render metrics, read from the shipped HTML.
        root: rootMarkup(html),
      });
    }
  }
})(BUILD);

/* ── 1. route count ──────────────────────────────────────────────── */
high(
  `route count is ${EXPECTED_ROUTES}`,
  routes.length === EXPECTED_ROUTES,
  `found ${routes.length}`
);

/* ── 2. titles ───────────────────────────────────────────────────── */
const titles = routes.map((r) => r.title);
const dupTitles = titles.filter((t, i) => titles.indexOf(t) !== i);
high('titles unique', dupTitles.length === 0, `${[...new Set(dupTitles)].length} duplicated: ${[...new Set(dupTitles)].slice(0, 5).join(' | ')}`);
high('titles non-empty', routes.every((r) => r.title && r.title.trim()), '');
const longTitles = routes.filter((r) => (r.title || '').length > MAX_TITLE);
medium(`titles <= ${MAX_TITLE} chars`, longTitles.length === 0, longTitles.slice(0, 3).map((r) => `${r.title.length}: ${r.urlPath}`).join(', '));

/* ── 3. descriptions ─────────────────────────────────────────────── */
const descs = routes.map((r) => r.description);
const dupDescs = descs.filter((d, i) => descs.indexOf(d) !== i);
high('descriptions unique', dupDescs.length === 0, `${[...new Set(dupDescs)].length} duplicated`);
high('descriptions non-empty', routes.every((r) => r.description && r.description.trim()), '');
const longDescs = routes.filter((r) => (r.description || '').length > MAX_DESC);
high(`descriptions <= ${MAX_DESC} chars`, longDescs.length === 0, longDescs.slice(0, 3).map((r) => `${r.description.length}: ${r.urlPath}`).join(', '));

/* ── 4. canonicals ───────────────────────────────────────────────── */
const canons = routes.map((r) => r.canonical);
const dupCanons = canons.filter((c, i) => canons.indexOf(c) !== i);
critical('canonicals unique', dupCanons.length === 0, `${[...new Set(dupCanons)].length} duplicated`);
critical('canonicals absolute', routes.every((r) => (r.canonical || '').startsWith(`${SITE_URL}/`)), '');
const wrongCanon = routes.filter((r) => r.canonical !== `${SITE_URL}${r.urlPath}`);
critical('canonical matches its own served URL', wrongCanon.length === 0,
  wrongCanon.slice(0, 3).map((r) => `${r.urlPath} -> ${r.canonical}`).join(', '));

/* ── 5. no duplicate head tags (shell defaults must be stripped) ─── */
const dupTags = routes.filter((r) => r.nCanonical !== 1 || r.nOgTitle !== 1 || r.nRobots !== 1 || r.nDesc !== 1);
critical('exactly one canonical/robots/og:title/description per page', dupTags.length === 0,
  dupTags.slice(0, 3).map((r) => `${r.urlPath} c:${r.nCanonical} r:${r.nRobots} og:${r.nOgTitle} d:${r.nDesc}`).join(', '));

/* ── 6. indexability of public routes ────────────────────────────── */
const notIndexable = routes.filter((r) => /noindex/.test(r.robots || ''));
critical('every pre-rendered route is indexable', notIndexable.length === 0,
  notIndexable.map((r) => r.urlPath).join(', '));
high('every route declares robots', routes.every((r) => r.robots), '');

/* ── 7. 404 page ─────────────────────────────────────────────────── */
const p404 = path.join(BUILD, '404.html');
if (!fs.existsSync(p404)) {
  critical('404.html exists', false, 'missing');
} else {
  const h = fs.readFileSync(p404, 'utf8');
  critical('404.html exists', true, '');
  const robots404 = meta(h, /<meta name="robots" content="([^"]*)"/) || '';
  critical('404 is noindex', /^noindex\b/.test(robots404), `robots="${robots404}"`);
  critical('404 has NO canonical', countOf(h, /rel="canonical"/g) === 0, `found ${countOf(h, /rel="canonical"/g)}`);
  critical('404 has NO og:url', countOf(h, /property="og:url"/g) === 0, '');
}

/* ── 8. private routes are not pre-rendered and not in the sitemap ─ */
const sitemapPath = path.join(BUILD, 'sitemap.xml');
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

critical('sitemap.xml exists', sitemap.length > 0, '');
high(`sitemap lists ${EXPECTED_ROUTES} URLs`, sitemapUrls.length === EXPECTED_ROUTES, `found ${sitemapUrls.length}`);
critical('sitemap URLs are all absolute', sitemapUrls.every((u) => u.startsWith(`${SITE_URL}/`)), '');

const canonSet = new Set(canons);
const sitemapNotCanonical = sitemapUrls.filter((u) => !canonSet.has(u));
critical('every sitemap URL is a canonical of a real 200 page', sitemapNotCanonical.length === 0,
  sitemapNotCanonical.slice(0, 3).join(', '));

const privateInSitemap = sitemapUrls.filter((u) =>
  PRIVATE_ROUTES.some((p) => u.includes(p)) || /leads-/.test(u)
);
critical('no private route in sitemap', privateInSitemap.length === 0, privateInSitemap.join(', '));

const privatePrerendered = PRIVATE_ROUTES.filter((p) => fs.existsSync(path.join(BUILD, p, 'index.html')));
high('private routes are not pre-rendered (they must stay app-only)', privatePrerendered.length === 0, privatePrerendered.join(', '));

/* ── 9. private routes declare noindex,nofollow in source ────────── */
const PRIVATE_PAGES = {
  'pages/LoginPage/LoginPage.jsx': '/login',
  'pages/DashboardPage/DashboardPage.jsx': '/dashboard',
  'pages/AIStudioPage/AIStudioPage.jsx': '/ai-studio',
  'pages/LeadListPage/LeadListPage.jsx': 'lead inbox',
};
const missingNoindex = Object.entries(PRIVATE_PAGES).filter(([rel]) => {
  const p = path.join(SRC, rel);
  if (!fs.existsSync(p)) return true;
  const s = fs.readFileSync(p, 'utf8');
  return !/<Seo[^>]*\bnoindex\b[^>]*\bnofollow\b/s.test(s);
});
critical('every private page renders <Seo noindex nofollow>', missingNoindex.length === 0,
  missingNoindex.map(([, label]) => label).join(', '));

/* ── 10. search-result pages are noindex ─────────────────────────── */
const productsPage = fs.readFileSync(path.join(SRC, 'pages/ProductsPage/ProductsPage.jsx'), 'utf8');
high('search-result pages send noindex', /noindex=\{isSearchResult\}/.test(productsPage), '');
high('search/category pages canonicalise to the clean path',
  /canonicalPath = activeCategory === 'all' \? '\/products' :/.test(productsPage), '');

/* ── 11. Open Graph ──────────────────────────────────────────────── */
high('every route has og:image', routes.every((r) => r.ogImage), '');
high('every og:image is absolute', routes.every((r) => (r.ogImage || '').startsWith('https://')), '');
high('every route has og:title/og:url/twitter:card', routes.every((r) => r.ogTitle && r.ogUrl && r.twitterCard), '');

// og:image files must actually exist in the build, not just be well-formed URLs.
const brokenOg = [...new Set(routes.map((r) => r.ogImage))].filter((u) => {
  const rel = (u || '').replace(`${SITE_URL}/`, '');
  return rel && !fs.existsSync(path.join(BUILD, rel));
});
critical('every og:image resolves to a file in the build', brokenOg.length === 0, brokenOg.slice(0, 3).join(', '));

// The default share card must meet the 1200x630 social minimum.
const ogDefault = path.join(BUILD, 'og-default.jpg');
if (!fs.existsSync(ogDefault)) {
  high('default og image exists', false, 'og-default.jpg missing');
} else {
  high('default og image exists', true, '');
  let dims = null;
  try {
    dims = require('sharp') && null; // sharp is a devDependency; read the JPEG header directly instead
  } catch (_) {}
  const buf = fs.readFileSync(ogDefault);
  // Walk JPEG segments to the SOF marker for width/height.
  let i = 2, w = 0, h = 0;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      h = buf.readUInt16BE(i + 5); w = buf.readUInt16BE(i + 7); break;
    }
    i += 2 + len;
  }
  high('default og image is 1200x630', w === 1200 && h === 630, `${w}x${h}`);
}

/* ── 12. structured data ─────────────────────────────────────────── */
let ldBlocks = 0, ldBad = [];
const ldTypes = {};
for (const r of routes) {
  for (const m of r.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    ldBlocks++;
    try {
      const o = JSON.parse(m[1].replace(/\\u003c/g, '<'));
      ldTypes[o['@type']] = (ldTypes[o['@type']] || 0) + 1;
    } catch (e) {
      ldBad.push(`${r.urlPath}: ${e.message}`);
    }
  }
}
critical('all JSON-LD parses', ldBad.length === 0, ldBad.slice(0, 3).join(' | '));
high('JSON-LD present on every route', routes.every((r) => /application\/ld\+json/.test(r.html)), '');

// Nothing fabricated: no prices, ratings or reviews anywhere.
const fabricated = routes.filter((r) => /"(aggregateRating|review|offers|priceCurrency|ratingValue)"/.test(r.html));
critical('no fabricated offers/ratings/reviews in structured data', fabricated.length === 0,
  fabricated.slice(0, 3).map((r) => r.urlPath).join(', '));

/* ── 13. category pages have crawlable inbound links ─────────────── */
const categorySlugs = [...new Set(
  sitemapUrls
    .filter((u) => u.includes('/products/category/'))
    .map((u) => u.replace(`${SITE_URL}/products/category/`, '').replace(/\/$/, ''))
)];

// A link only counts if it is in the DOM unconditionally — a mega-menu that
// mounts on hover is invisible to a crawler.
const readSrc = (rel) => {
  const p = path.join(SRC, rel);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
};
const chipsSrc = productsPage;
const footerSrc = readSrc('components/Footer/Footer.jsx');
const navbarSrc = readSrc('components/Navbar/Navbar.jsx');

const chipsLinkAll =
  /CATEGORIES\.map\(/.test(chipsSrc) &&
  /<MotionLink[\s\S]{0,400}?to=\{categoryHref\(cat\.slug\)\}/.test(chipsSrc);
const footerLinks =
  /FOOTER_CATEGORIES\.map\(/.test(footerSrc) &&
  /<Link[^>]*to=\{`\/products\/category\/\$\{cat\.slug\}`\}/.test(footerSrc);
const megaIsHoverGated = /\{megaOpen &&/.test(navbarSrc);

critical(
  `all ${categorySlugs.length} category pages linked from /products via real <Link>`,
  chipsLinkAll,
  chipsLinkAll ? '' : 'category chips are not crawlable <Link>s'
);
high('category pages also linked site-wide from the footer', footerLinks, '');
medium('mega-menu category links are hover-gated (do not count for crawling)',
  true, megaIsHoverGated ? 'confirmed hover-gated — footer + chips carry the crawl path' : 'mega-menu now always mounted');

// Nothing may be reachable ONLY through the hover-gated mega-menu.
const footerCount = (footerSrc.match(/CATEGORIES\.slice\(0,\s*(\d+)\)/) || [])[1];
if (footerCount) {
  medium(`footer lists ${footerCount} of ${categorySlugs.length} categories`,
    Number(footerCount) <= categorySlugs.length,
    `remaining ${categorySlugs.length - Number(footerCount)} are covered by the /products chips`);
}

/* ── 14. no placeholder or misleading links ──────────────────────── */
const jsxFiles = [];
(function walkSrc(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walkSrc(p);
    else if (e.name.endsWith('.jsx')) jsxFiles.push(p);
  }
})(SRC);

const placeholderHrefs = jsxFiles.filter((f) => /href=(["'])#\1/.test(fs.readFileSync(f, 'utf8')));
medium('no placeholder href="#" anchors', placeholderHrefs.length === 0,
  placeholderHrefs.map((f) => path.relative(SRC, f)).join(', '));

/* ── 15. semantic landmarks ──────────────────────────────────────── */
const PUBLIC_PAGES = [
  'pages/LandingPage/LandingPage.jsx',
  'pages/ProductsPage/ProductsPage.jsx',
  'pages/ProductDetailPage/ProductDetailPage.jsx',
  'pages/AboutPage/AboutPage.jsx',
  'pages/ContactPage/ContactPage.jsx',
  'pages/SmartLightingPage/SmartLightingPage.jsx',
  'pages/NotFoundPage/NotFoundPage.jsx',
];
const noMain = PUBLIC_PAGES.filter((rel) => !/<main[\s>]/.test(readSrc(rel)));
medium('every public page has a <main> landmark', noMain.length === 0, noMain.join(', '));

const nestedMain = PUBLIC_PAGES.filter((rel) => {
  const s = readSrc(rel);
  // NotFound/ProductDetail have two returns (found / not-found); one <main> each is fine.
  const opens = (s.match(/<main[\s>]/g) || []).length;
  const closes = (s.match(/<\/main>/g) || []).length;
  return opens !== closes;
});
medium('<main> tags are balanced', nestedMain.length === 0, nestedMain.join(', '));

/* ── 16. footer present on the major public hubs ─────────────────── */
const HUBS = {
  'pages/ProductsPage/ProductsPage.jsx': '/products',
  'pages/SmartLightingPage/SmartLightingPage.jsx': '/smart-lighting',
  'pages/LandingPage/LandingPage.jsx': '/',
  'pages/ProductDetailPage/ProductDetailPage.jsx': '/products/:slug',
  'pages/AboutPage/AboutPage.jsx': '/about',
  'pages/ContactPage/ContactPage.jsx': '/contact',
};
const noFooter = Object.entries(HUBS).filter(([rel]) => !/<Footer \/>/.test(readSrc(rel)));
high('every public hub renders <Footer />', noFooter.length === 0, noFooter.map(([, u]) => u).join(', '));

/* ── 17. the lead-inbox path must not reach any public artifact ──── */
const LEAK_RE = /leads-[0-9a-fA-F]{8}-/;
const publicArtifacts = ['robots.txt', 'sitemap.xml', '404.html', 'index.html'];
const leaks = publicArtifacts.filter((f) => {
  const p = path.join(BUILD, f);
  return fs.existsSync(p) && LEAK_RE.test(fs.readFileSync(p, 'utf8'));
});
critical('lead-inbox path absent from robots.txt / sitemap / HTML', leaks.length === 0, leaks.join(', '));

// It is unavoidably present in the JS bundle (it is a client-side route), which
// is exactly why obscurity is not access control. Reported so it is never
// mistaken for a fixed issue.
const bundles = fs.existsSync(path.join(BUILD, 'static/js'))
  ? fs.readdirSync(path.join(BUILD, 'static/js')).filter((f) => f.endsWith('.js'))
  : [];
const inBundle = bundles.some((f) => LEAK_RE.test(fs.readFileSync(path.join(BUILD, 'static/js', f), 'utf8')));
low('lead-inbox path is in the JS bundle (obscurity is not access control)',
  !inBundle,
  inBundle ? 'present in main bundle — needs real server-side auth, tracked as a known limitation' : '');

/* ── 18. robots.txt ──────────────────────────────────────────────── */
const robotsPath = path.join(BUILD, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  critical('robots.txt exists', false, 'missing');
} else {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  critical('robots.txt exists', true, '');
  high('robots.txt references the sitemap', new RegExp(`Sitemap:\\s*${SITE_URL}/sitemap.xml`).test(robots), '');
  high('robots.txt disallows the private routes',
    PRIVATE_ROUTES.every((p) => new RegExp(`Disallow:\\s*${p}\\b`).test(robots)), '');
  medium('robots.txt does not block CSS/JS/images',
    !/Disallow:\s*\/static/.test(robots) && !/Disallow:\s*\*?\.(css|js)/.test(robots), '');
  // Only one robots source of truth.
  low('no stale duplicate robots.txt outside public/',
    !fs.existsSync(path.join(__dirname, '..', 'robots.txt')), 'client/robots.txt still present');
}

/* ── 19. route resolution — simulate the shipped .htaccess rules ─── */
const htaccess = path.join(BUILD, '.htaccess');
if (!fs.existsSync(htaccess)) {
  critical('build/.htaccess exists', false, 'missing — host will not serve route files correctly');
} else {
  const conf = fs.readFileSync(htaccess, 'utf8');
  critical('build/.htaccess exists', true, '');
  critical('no blanket catch-all rewrite',
    !/RewriteRule\s+\.\s+\/(index|app-shell)\.html/.test(conf),
    'a catch-all rewrite would shadow every pre-rendered route file');
  // Only a rule whose target is literally /index.html is the dangerous one.
  // The canonical-URL rewrite targets /$1/index.html (serving /about from
  // about/index.html), which is correct and must not trip this check.
  const badFallback = [...conf.matchAll(/RewriteRule\s+\S+\s+(\/\S*index\.html)\s+\[/g)]
    .map((m) => m[1])
    .filter((target) => target === '/index.html');
  critical('SPA fallback targets app-shell.html, not the pre-rendered homepage',
    badFallback.length === 0,
    'falling back to /index.html serves the homepage body for /login');
  critical('ErrorDocument points at the pre-rendered 404',
    /ErrorDocument\s+404\s+\/404\.html/.test(conf), '');

  // The SPA shell those private routes are served with says index,follow in
  // its static <head>; only a JS-executing crawler sees the runtime noindex.
  // An HTTP header is what actually protects them.
  const setEnv = conf.match(/SetEnvIf Request_URI "\^\/\(([^)]+)\)"/);
  const hasHeader = /Header set X-Robots-Tag "noindex, nofollow" env=TIRICH_PRIVATE_ROUTE/.test(conf);
  critical('private routes send X-Robots-Tag noindex,nofollow at the HTTP level',
    Boolean(setEnv) && hasHeader,
    setEnv ? (hasHeader ? '' : 'SetEnvIf present but Header directive missing') : 'SetEnvIf missing');
  if (setEnv) {
    const covered = setEnv[1].split('|');
    const expected = SPA_FALLBACK_PATTERNS.map((p) => p.replace(/\[.*$/, ''));
    critical('every client-only route is covered by that header',
      expected.every((e) => covered.includes(e)),
      `header covers ${covered.join(', ')}; routes are ${expected.join(', ')}`);
    low('the header rule carries no literal secret path',
      !/[0-9a-f]{8}-[0-9a-f]{4}/.test(setEnv[1]), setEnv[1]);
  }

  // Parse the generated fallback allowlist straight out of the shipped file.
  const allow = [
    ...conf.matchAll(/RewriteRule\s+\^\(([^)]+)\)\/\?\$\s+\/app-shell\.html/g),
  ].map((m) => m[1]);
  high('SPA fallback is an explicit allowlist, not a catch-all',
    allow.length === SPA_FALLBACK_PATTERNS.length,
    `found ${allow.length} rules: ${allow.join(', ')}`);

  // Resolve URLs the way Apache would: real file/dir wins, then the allowlist,
  // else 404. Verified against the actual build tree.
  const resolve = (url) => {
    const clean = url.split('?')[0].replace(/^\//, '').replace(/\/$/, '');
    if (clean === '') return { status: 200, served: 'index.html' };
    const asFile = path.join(BUILD, clean);
    if (fs.existsSync(asFile) && fs.statSync(asFile).isFile()) return { status: 200, served: clean };
    if (fs.existsSync(asFile) && fs.statSync(asFile).isDirectory()
        && fs.existsSync(path.join(asFile, 'index.html'))) {
      return { status: 200, served: `${clean}/index.html` };
    }
    if (allow.some((p) => new RegExp(`^(${p})$`).test(clean))) {
      return { status: 200, served: 'app-shell.html (SPA)' };
    }
    return { status: 404, served: '404.html' };
  };

  const cases = [
    ['/', 200], ['/products', 200], ['/products/pro-116', 200],
    ['/products/category/downlights', 200], ['/about', 200], ['/contact', 200],
    ['/smart-lighting', 200],
    ['/login', 200], ['/dashboard', 200], ['/ai-studio', 200],
    // Shape-matched, not the real path — the rule is a pattern, and this file
    // has no reason to carry the actual lead-inbox URL.
    ['/leads-00000000-0000-0000-0000-000000000000', 200],
    ['/random-non-existing-url', 404],
    ['/products/non-existing-product', 404],
    ['/non-existing-category', 404],
    ['/products/category/not-a-category', 404],
    ['/products?search=test', 200],
  ];
  const failed = cases.filter(([url, want]) => resolve(url).status !== want);
  critical('route resolution returns the right status for every case',
    failed.length === 0,
    failed.map(([u, w]) => `${u} want ${w} got ${resolve(u).status}`).join(', '));

  // The pre-rendered page must win over the shell for indexable routes.
  // "shadowed" means the ROOT index.html or the SPA shell answered instead of
  // the route's own file. products/pro-116/index.html is the correct answer, so
  // match the exact bare filenames rather than any path ending in index.html.
  const shadowed = ['/products/pro-116', '/products/category/downlights', '/about']
    .filter((u) => {
      const served = resolve(u).served;
      return served === 'index.html' || /\(SPA\)$/.test(served) || served === 'app-shell.html';
    });
  critical('pre-rendered route HTML is served, not the generic shell',
    shadowed.length === 0, shadowed.join(', '));
}

/* ── 20. every app route is either pre-rendered or in the allowlist ─ */
const appJs = fs.readFileSync(path.join(SRC, 'App.js'), 'utf8');
const appRoutes = [...appJs.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1])
  .filter((p) => p !== '*');
const unhandled = appRoutes.filter((r) => {
  if (r.includes(':')) return false; // dynamic — covered by the generated per-slug files
  const clean = r.replace(/^\//, '');
  if (clean === '') return false;
  if (fs.existsSync(path.join(BUILD, clean, 'index.html'))) return false;
  return !SPA_FALLBACK_PATTERNS.some((p) => new RegExp(`^(${p})$`).test(clean));
});
critical('every route in App.js is pre-rendered or covered by the SPA allowlist',
  unhandled.length === 0,
  `${unhandled.join(', ')} would return a hard 404 — add a pre-render entry or an SPA_FALLBACK_PATTERNS entry`);

/* ── 21. BODY PRE-RENDER: is there anything for a crawler to read? ─ */
//
// This is the whole point of the body pre-render: an indexable URL fetched
// without JavaScript must return the actual page, not an empty mount point.
const emptyRoot = routes.filter((r) => !r.root.html.trim());
critical('no indexable route ships an empty #root', emptyRoot.length === 0,
  `${emptyRoot.length} route(s): ${emptyRoot.slice(0, 5).map((r) => r.urlPath).join(', ')}`);

// A splash/skeleton captured instead of the page is the classic failure mode,
// and it looks like success unless the text is actually inspected.
const LOADING_ONLY = /^(loading|please wait|tirich\s*led)?[\s.…]*$/i;
const loadingOnly = routes.filter(
  (r) => r.root.text.length < 200 || LOADING_ONLY.test(r.root.text)
);
critical('no indexable route ships only a loading/splash state', loadingOnly.length === 0,
  loadingOnly.slice(0, 5).map((r) => `${r.urlPath} (${r.root.text.length} chars)`).join(', '));

const noH1Body = routes.filter((r) => r.root.h1 !== 1);
critical('every indexable route has exactly one <h1> in its pre-rendered body',
  noH1Body.length === 0,
  noH1Body.slice(0, 5).map((r) => `${r.urlPath} (${r.root.h1})`).join(', '));

const noFooterBody = routes.filter((r) => !r.root.footer);
high('every indexable route ships its <footer> (internal links without JS)',
  noFooterBody.length === 0,
  noFooterBody.slice(0, 5).map((r) => r.urlPath).join(', '));

const fewLinks = routes.filter((r) => r.root.links < 10);
high('every indexable route ships crawlable internal links', fewLinks.length === 0,
  fewLinks.slice(0, 5).map((r) => `${r.urlPath} (${r.root.links})`).join(', '));

const noMainBody = routes.filter((r) => !/<main[\s>]/i.test(r.root.html));
medium('every indexable route ships a <main> landmark in its body',
  noMainBody.length === 0, noMainBody.slice(0, 5).map((r) => r.urlPath).join(', '));

const noH2 = routes.filter((r) => r.root.h2 === 0);
medium('routes have a sub-heading hierarchy (h2)', noH2.length === 0,
  `${noH2.length} route(s) with no <h2>: ${noH2.slice(0, 4).map((r) => r.urlPath).join(', ')}`);

const noImgs = routes.filter((r) => r.root.imgs === 0);
medium('routes ship <img> markup', noImgs.length === 0,
  `${noImgs.length} route(s) with no images`);

// The brand has to be readable without JS — it is what a brand query matches.
const brandless = routes.filter((r) => !/tirich/i.test(r.root.text));
high('brand name appears in every pre-rendered body', brandless.length === 0,
  brandless.slice(0, 5).map((r) => r.urlPath).join(', '));

const home = routes.find((r) => r.urlPath === '/');
if (home) {
  critical('homepage body names the brand in its <h1>',
    /<h1[^>]*>[\s\S]{0,300}?Tirich/i.test(home.root.html),
    home.root.html.match(/<h1[\s\S]{0,160}/i)?.[0]?.replace(/\s+/g, ' ') || 'no h1');
}

// A product page must carry its own product's name, not just chrome.
const productRoutes = routes.filter((r) => /^\/products\/[^/]+\/$/.test(r.urlPath));
// Compared against the catalogue's actual product name, not a guess derived
// from the slug: slugs are hyphenated ("10z-caset") while names are not
// ("10Z Casetlzr"), so slug-matching produces false failures.
const productBySlug = new Map(catalogue.products.map((p) => [p.slug, p]));
const thinProducts = productRoutes.filter((r) => {
  const slug = r.urlPath.replace(/^\/products\//, '').replace(/\/$/, '');
  const product = productBySlug.get(slug);
  if (!product) return true; // a product route with no catalogue entry is worse
  return !r.root.text.toLowerCase().includes(product.name.toLowerCase());
});
high('each product body contains its own product name', thinProducts.length === 0,
  `${thinProducts.length}: ${thinProducts.slice(0, 5).map((r) => r.urlPath).join(', ')}`);

const medianText = (() => {
  const v = routes.map((r) => r.root.text.length).sort((a, b) => a - b);
  return v.length ? v[Math.floor(v.length / 2)] : 0;
})();

/* ── 22. app-shell.html — the SPA fallback target ────────────────── */
const shellPath = path.join(BUILD, 'app-shell.html');
if (!fs.existsSync(shellPath)) {
  critical('app-shell.html exists (SPA fallback target)', false,
    'missing — private routes would fall back to the pre-rendered homepage');
} else {
  const shell = fs.readFileSync(shellPath, 'utf8');
  critical('app-shell.html exists (SPA fallback target)', true, '');
  critical('app-shell.html has an EMPTY #root',
    /<div id="root">\s*<\/div>/.test(shell),
    'a fallback with markup would make React hydrate /login against another page');
  critical('app-shell.html is noindex,nofollow',
    /content="noindex,nofollow"/.test(shell),
    meta(shell, /<meta name="robots" content="([^"]*)"/) || 'no robots tag');
  high('app-shell.html has no canonical',
    (shell.match(/rel="canonical"/g) || []).length === 0, '');
}

/* ── report ──────────────────────────────────────────────────────── */
const ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
results.sort((a, b) => ORDER[a.sev] - ORDER[b.sev]);

const pad = (s, n) => String(s).padEnd(n);
console.log('\n  SEO AUDIT — build/\n  ' + '─'.repeat(72));
let failedCritical = 0, failedHigh = 0, warned = 0;
for (const r of results) {
  const icon = r.ok ? '✓' : (r.sev === 'CRITICAL' || r.sev === 'HIGH' ? '✗' : '!');
  if (!r.ok) {
    if (r.sev === 'CRITICAL') failedCritical++;
    else if (r.sev === 'HIGH') failedHigh++;
    else warned++;
  }
  const detail = r.detail && (!r.ok || r.sev === 'MEDIUM') ? `  — ${r.detail}` : '';
  console.log(`  ${icon} ${pad(r.sev, 9)} ${r.name}${detail}`);
}

console.log('  ' + '─'.repeat(72));
console.log(`  routes ${routes.length} | unique titles ${new Set(titles).size} | unique descriptions ${new Set(descs).size} | unique canonicals ${new Set(canons).size}`);
console.log(`  JSON-LD blocks ${ldBlocks} (${ldBad.length} invalid) | ${Object.entries(ldTypes).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
console.log(`  sitemap URLs ${sitemapUrls.length} | category pages ${categorySlugs.length}`);
console.log(
  `  pre-rendered bodies ${routes.length - emptyRoot.length}/${routes.length} | ` +
    `median ${medianText} chars of text | ` +
    `empty #root ${emptyRoot.length} | missing h1 ${noH1Body.length}`
);
console.log(`\n  ${results.filter((r) => r.ok).length}/${results.length} checks passed` +
  (failedCritical ? ` | ${failedCritical} CRITICAL` : '') +
  (failedHigh ? ` | ${failedHigh} HIGH` : '') +
  (warned ? ` | ${warned} warning(s)` : ''));

if (failedCritical || failedHigh) {
  console.error(`\n  FAILED: ${failedCritical} critical, ${failedHigh} high-severity SEO regression(s).\n`);
  process.exit(1);
}
console.log('\n  PASSED — no critical or high-severity SEO regressions.\n');
