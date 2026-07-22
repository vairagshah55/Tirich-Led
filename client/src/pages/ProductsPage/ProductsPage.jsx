import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Navbar from '../../components/Navbar/Navbar';
import { PRODUCTS, CATEGORIES } from '../../data/products';
import LeadCaptureModal, { hasLeadData } from '../../components/LeadCaptureModal/LeadCaptureModal';
import styles from './ProductsPage.module.css';
import { buttonHover, buttonTap, fadeIn, fadeUp } from '../../utils/motion';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [pendingSlug, setPendingSlug] = useState(null);

  const activeCategoryLabel = (() => {
    const cat = CATEGORIES.find(c => c.slug === (searchParams.get('category') || ''));
    return cat ? cat.label : null;
  })();
  const initialCat = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCat);
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
    const cat = searchParams.get('category') || 'all';
    setActiveCategory(cat);
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const setCategory = (slug) => {
    setActiveCategory(slug);
    const params = {};
    if (slug !== 'all') params.category = slug;
    if (query.trim()) params.search = query.trim();
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.page}>
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
          <motion.button
            className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.filterBtnActive : ''}`}
            onClick={() => setCategory('all')}
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            All Products
            <span className={styles.filterBtnCount}>{PRODUCTS.length}</span>
          </motion.button>
          <span className={styles.filterSep} aria-hidden="true" />
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat.slug}
              className={`${styles.filterBtn} ${activeCategory === cat.slug ? styles.filterBtnActive : ''}`}
              onClick={() => setCategory(cat.slug)}
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              {cat.label}
              <span className={styles.filterBtnCount}>{countBySlug(cat.slug)}</span>
            </motion.button>
          ))}
        </div>
        <motion.div className={styles.filterCount} key={`${activeCategory}-${filtered.length}`} {...fadeIn(0.12)}>
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        </motion.div>
      </motion.div>

      {/* ── PRODUCT GRID ── */}
      <div className={styles.gridWrap}>
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
                <div
                  className={styles.card}
                  data-reveal
                  style={{ transitionDelay: `${Math.min(i * 0.055, 0.44)}s`, cursor: 'pointer' }}
                  onClick={() => handleProductClick(product.slug)}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleProductClick(product.slug); }}
                >
                {/* Image */}
                <div className={styles.cardMedia}>
                  <img src={product.image} alt={product.name} className={styles.cardImg} loading="lazy" decoding="async" />

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
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <LeadCaptureModal
        open={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        onSuccess={handleLeadSuccess}
      />
    </div>
  );
}
