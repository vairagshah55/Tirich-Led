import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Seo from '../../components/Seo/Seo';
import { SITE_URL, breadcrumbLd } from '../../config/seo';
import { PRODUCTS, CATEGORIES } from '../../data/products';
import LeadCaptureModal, { hasLeadData } from '../../components/LeadCaptureModal/LeadCaptureModal';
import styles from './ProductsPage.module.css';
import { buttonHover, buttonTap, fadeUp } from '../../utils/motion';

// Animated router link — lets the category filters keep their hover/tap
// motion while still being real, crawlable <a href> elements.
const MotionLink = motion.create(Link);

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

export default function ProductsPage() {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [pendingSlug, setPendingSlug] = useState(null);

  // Category resolves from the clean path (/products/category/:slug) first,
  // then the legacy ?category= query param, else "all".
  const activeCategory = categorySlug || searchParams.get('category') || 'all';
  const activeCat = CATEGORIES.find(c => c.slug === activeCategory) || null;
  const activeCategoryLabel =
    activeCat?.label ||
    (activeCategory !== 'all'
      ? PRODUCTS.find(p => p.categorySlug === activeCategory)?.category
      : null) ||
    null;
  const activeCategoryDesc = activeCat?.desc || '';

  const [query, setQuery] = useState(searchParams.get('search') || '');

  const handleProductClick = (slug) => {
    if (hasLeadData()) {
      navigate(`/products/${slug}`);
    } else {
      setPendingSlug(slug);
      setShowLeadModal(true);
    }
  };

  const handleLeadSuccess = () => {
    setShowLeadModal(false);
    if (pendingSlug) navigate(`/products/${pendingSlug}`);
  };

  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeCategory]);

  // Re-run the reveal observer whenever the visible product set changes, so
  // cards re-added after a search is cleared/changed don't stay hidden.
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('js-revealed'); observer.unobserve(e.target); }
      }),
      { threshold: 0.06 }
    );
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [activeCategory, query]);

  const countBySlug = (slug) => PRODUCTS.filter(p => p.categorySlug === slug).length;

  const q = query.trim().toLowerCase();
  const filtered = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.categorySlug === activeCategory;
    if (!matchesCategory) return false;
    if (!q) return true;
    return (
      p.name?.toLowerCase().includes(q) ||
      p.tagline?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  });

  // Category chips are real <Link>s so crawlers can reach every category
  // landing page (they used to be buttons, leaving those pages orphaned).
  // The search term is carried across so filtering doesn't reset the query.
  const categoryHref = (slug) => {
    const qs = query.trim() ? `?search=${encodeURIComponent(query.trim())}` : '';
    // Trailing slash goes before the query string — that is the form Apache
    // serves, so the link avoids a 301 hop.
    return slug === 'all' ? `/products${qs}` : `/products/category/${slug}${qs}`;
  };

  const canonicalPath = activeCategory === 'all' ? '/products' : `/products/category/${activeCategory}`;
  const collectionProducts =
    activeCategory === 'all'
      ? PRODUCTS
      : PRODUCTS.filter(p => p.categorySlug === activeCategory);
  const pageTitle = activeCategoryLabel || 'LED Lighting Products';
  const pageDescription = activeCategoryLabel
    ? `${activeCategoryLabel} from Tirich LED — ${activeCategoryDesc || 'precision LED fixtures'}. Full specs, beam angles and finishes for every fixture.`
    : 'Browse the full Tirich LED catalogue — COB lights, downlights, linear, track, magnetic track, panels, fixtures and outdoor lighting.';

  // Search-result permutations are near-infinite and thin; keep them out of
  // the index but let crawlers follow through to the product pages. The
  // unfiltered catalogue and every category page stay fully indexable.
  const isSearchResult = Boolean(q);

  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Products', path: '/products' }];
  if (activeCategoryLabel) {
    crumbs.push({ name: activeCategoryLabel, path: canonicalPath });
  }

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${pageTitle} | Tirich LED`,
    description: pageDescription,
    url: `${SITE_URL}${canonicalPath}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: collectionProducts.length,
      itemListElement: collectionProducts.slice(0, 30).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/products/${p.slug}`,
        name: p.name,
      })),
    },
  };

  return (
    <div className={styles.page}>
      <Seo
        title={activeCategoryLabel || 'All Products'}
        path={canonicalPath}
        description={pageDescription}
        noindex={isSearchResult}
        jsonLd={[collectionLd, breadcrumbLd(crumbs)]}
      />
      <Navbar />

      {/* ── BREADCRUMB ── */}
      <motion.nav className={styles.breadcrumb} aria-label="Breadcrumb" {...fadeUp(0.05, 16)}>
        <div className={styles.breadcrumbInner}>
          <Link to="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
          {activeCategoryLabel ? (
            <>
              <Link to="/products" className={styles.breadcrumbLink}>Products</Link>
              <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
              <span className={styles.breadcrumbCurrent}>{activeCategoryLabel}</span>
            </>
          ) : (
            <span className={styles.breadcrumbCurrent}>Products</span>
          )}
        </div>
      </motion.nav>

      {/* ── FILTER BAR ── */}
      <motion.div className={styles.filterBar} {...fadeUp(0.1, 18)}>
        <div className={styles.filterInner}>
          <MotionLink
            to={categoryHref('all')}
            className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.filterBtnActive : ''}`}
            aria-current={activeCategory === 'all' ? 'page' : undefined}
            onClick={scrollToTop}
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            All Products
            <span className={styles.filterBtnCount}>{PRODUCTS.length}</span>
          </MotionLink>
          <span className={styles.filterSep} aria-hidden="true" />
          {CATEGORIES.map(cat => (
            <MotionLink
              key={cat.slug}
              to={categoryHref(cat.slug)}
              className={`${styles.filterBtn} ${activeCategory === cat.slug ? styles.filterBtnActive : ''}`}
              aria-current={activeCategory === cat.slug ? 'page' : undefined}
              onClick={scrollToTop}
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              {cat.label}
              <span className={styles.filterBtnCount}>{countBySlug(cat.slug)}</span>
            </MotionLink>
          ))}
        </div>
      </motion.div>

      {/* ── PRODUCT GRID ── */}
      <main className={styles.gridWrap}>
        {/* Page heading — one keyword-rich H1 per category for SEO */}
        <motion.header className={styles.pageHead} {...fadeUp(0.06, 14)}>
          <h1 className={styles.pageTitle}>{pageTitle}</h1>
          <p className={styles.pageIntro}>
            {activeCategoryLabel
              ? `${activeCategoryDesc ? activeCategoryDesc + '. ' : ''}Browse ${collectionProducts.length} ${activeCategoryLabel} from Tirich LED — with wattage, CRI, beam angle and finish details for every fixture.`
              : 'Precision LED lighting for residential, commercial and hospitality projects — explore downlights, COB spots, track, linear, magnetic, panels, fixtures and outdoor ranges.'}
          </p>
        </motion.header>

        {/* Search — directly above the product list */}
        <motion.div className={styles.searchBar} {...fadeUp(0.08, 16)}>
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search products by name, category…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />
            {query && (
              <button
                type="button"
                className={styles.searchClear}
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </motion.div>

        <div className={styles.grid}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              {q ? `No products match “${query.trim()}”.` : 'No products found in this category.'}
            </div>
          ) : (
            filtered.map((product, i) => (
              <motion.div
                key={product.slug}
                whileHover={{ y: -8, transition: { duration: 0.22 } }}
                {...fadeUp(Math.min(i * 0.05, 0.3), 20)}
              >
                <Link
                  to={`/products/${product.slug}`}
                  className={styles.card}
                  data-reveal
                  style={{ transitionDelay: `${Math.min(i * 0.055, 0.44)}s` }}
                  onClick={(e) => {
                    // Real crawlable href for search engines; visitors without
                    // saved lead info are still routed through the capture modal.
                    if (!hasLeadData()) {
                      e.preventDefault();
                      handleProductClick(product.slug);
                    }
                  }}
                >
                {/* Image */}
                <div className={styles.cardMedia}>
                  <img src={product.image} alt={product.name} className={styles.cardImg} width="800" height="600" loading="lazy" decoding="async" />

                  {/* Hover overlay — progressive disclosure */}
                  <div className={styles.cardOverlay}>
                    <div className={styles.overlayActions}>
                      <span className={styles.overlayBtn}>
                        View Details
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </span>
                      <span className={styles.overlayBtnGhost}>Enquire</span>
                    </div>
                    {/* Glow ring */}
                    <div className={styles.overlayGlow} aria-hidden="true" />
                  </div>
                </div>

                {/* Body */}
                <div className={styles.cardBody}>
                  <div className={styles.cardTop}>
                    <span className={styles.cardCategory}>{product.category}</span>
                    <h3 className={styles.cardName}>{product.name}</h3>
                    <p className={styles.cardTagline}>{product.tagline}</p>
                  </div>

                  <div className={styles.cardBottom}>
                    <div className={styles.cardSpecs}>
                      {product.cri   && <span className={styles.specChip}>CRI {product.cri}</span>}
                      {product.ip    && <span className={styles.specChip}>{product.ip}</span>}
                      {product.lifespan && <span className={styles.specChip}>{product.lifespan}</span>}
                    </div>
                    <div className={styles.cardFooter}>
                      <span className={styles.cardWattage}>{product.wattage}</span>
                      <span className={styles.cardArrow} aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover glow halo */}
                  <div className={styles.cardGlow} aria-hidden="true" />
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </main>

      <Footer />

      <LeadCaptureModal
        open={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        onSuccess={handleLeadSuccess}
      />
    </div>
  );
}
