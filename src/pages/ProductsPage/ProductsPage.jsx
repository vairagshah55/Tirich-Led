import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { PRODUCTS, CATEGORIES } from '../../data/products';
import styles from './ProductsPage.module.css';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCat);

  // Sync category from URL
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
      { threshold: 0.08 }
    );
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const filtered = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.categorySlug === activeCategory);

  const setCategory = (slug) => {
    setActiveCategory(slug);
    if (slug === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: slug });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.page}>
      <Navbar />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <p className={styles.heroEyebrow} data-reveal>Product Catalogue</p>
            <h1 className={styles.heroTitle} data-reveal style={{ transitionDelay: '0.08s' }}>
              Engineered LED<br />Solutions
            </h1>
            <p className={styles.heroSub} data-reveal style={{ transitionDelay: '0.16s' }}>
              {PRODUCTS.length} products across {CATEGORIES.length} categories — all manufactured
              to IEC and CE standards.
            </p>
          </div>
          <span className={styles.heroCount}>{PRODUCTS.length}</span>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div className={styles.filterBar}>
        <div className={styles.filterInner}>
          <button
            className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.filterBtnActive : ''}`}
            onClick={() => setCategory('all')}
          >
            All Products
          </button>
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
      </div>

      {/* ── PRODUCT GRID ── */}
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
              style={{ transitionDelay: `${(i % 3) * 0.08}s` }}
            >
              {/* Image */}
              <div className={styles.cardMedia}>
                <img src={product.image} alt={product.name} className={styles.cardImg} />
                <span className={styles.cardBadge}>{product.category}</span>
                <div className={styles.cardOverlay}>
                  <span className={styles.cardOverlayBtn}>View Details</span>
                </div>
              </div>

              {/* Body */}
              <div className={styles.cardBody}>
                <h3 className={styles.cardName}>{product.name}</h3>
                <p className={styles.cardTagline}>{product.tagline}</p>

                <div className={styles.cardSpecs}>
                  <span className={styles.specChip}>CRI {product.cri}</span>
                  <span className={styles.specChip}>{product.ip}</span>
                  <span className={styles.specChip}>{product.lifespan}</span>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.cardWattage}>{product.wattage}</span>
                  <span className={styles.cardLink}>
                    Details
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
