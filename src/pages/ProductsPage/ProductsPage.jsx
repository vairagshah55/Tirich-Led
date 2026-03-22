import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { PRODUCTS, CATEGORIES } from '../../data/products';
import styles from './ProductsPage.module.css';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategoryLabel = (() => {
    const cat = CATEGORIES.find(c => c.slug === (searchParams.get('category') || ''));
    return cat ? cat.label : null;
  })();
  const initialCat = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCat);

  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('js-revealed'); observer.unobserve(e.target); }
      }),
      { threshold: 0.06 }
    );
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const filtered = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.categorySlug === activeCategory);

  const setCategory = (slug) => {
    setActiveCategory(slug);
    slug === 'all' ? setSearchParams({}) : setSearchParams({ category: slug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.page}>
      <Navbar />

      {/* ── BREADCRUMB ── */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
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
      </nav>

      {/* ── FILTER BAR ── */}
      <div className={styles.filterBar}>
        <div className={styles.filterInner}>
          <button
            className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.filterBtnActive : ''}`}
            onClick={() => setCategory('all')}
          >
            All Products
          </button>
          <span className={styles.filterSep} aria-hidden="true" />
          {CATEGORIES.map(cat => (
            <button
              key={cat.slug}
              className={`${styles.filterBtn} ${activeCategory === cat.slug ? styles.filterBtnActive : ''}`}
              onClick={() => setCategory(cat.slug)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className={styles.filterCount}>
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        </div>
      </div>

      {/* ── PRODUCT GRID ── */}
      <div className={styles.gridWrap}>
        <div className={styles.grid}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>No products found in this category.</div>
          ) : (
            filtered.map((product, i) => (
              <Link
                key={product.slug}
                to={`/products/${product.slug}`}
                className={styles.card}
                data-reveal
                style={{ transitionDelay: `${Math.min(i * 0.055, 0.44)}s` }}
              >
                {/* Image */}
                <div className={styles.cardMedia}>
                  <img src={product.image} alt={product.name} className={styles.cardImg} loading="lazy" />

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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
