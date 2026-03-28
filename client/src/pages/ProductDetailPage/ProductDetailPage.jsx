import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import Navbar from '../../components/Navbar/Navbar';
import { PRODUCTS } from '../../data/products';
import styles from './ProductDetailPage.module.css';
import { cardHover, fadeUp } from '../../utils/motion';

const SPECS_MAP = [
  { key: 'Wattage',      field: 'wattage'  },
  { key: 'CRI',          field: 'cri'      },
  { key: 'CCT',          field: 'cct'      },
  { key: 'IP Rating',    field: 'ip'       },
  { key: 'Rated Life',   field: 'lifespan' },
  { key: 'Category',     field: 'category' },
];

export default function ProductDetailPage() {
  const { slug }   = useParams();
  const product    = PRODUCTS.find(p => p.slug === slug);

  // Related: same category, exclude current, max 3
  const related = product
    ? PRODUCTS.filter(p => p.categorySlug === product.categorySlug && p.slug !== slug).slice(0, 3)
    : [];

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
  }, [slug]);

  if (!product) {
    return (
      <div className={styles.page}>
        <Navbar />
        <motion.div className={styles.notFound} {...fadeUp(0.08, 18)}>
          <h2 className={styles.notFoundTitle}>Product not found</h2>
          <p className={styles.notFoundText}>The product you're looking for doesn't exist.</p>
          <Link to="/products" className={styles.btnPrimary}>Browse All Products</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />

      {/* ── BREADCRUMB ── */}
      <motion.div className={styles.breadcrumb} {...fadeUp(0.05, 16)}>
        <div className={styles.breadcrumbInner}>
          <Link to="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <Link to="/products" className={styles.breadcrumbLink}>Products</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <Link to={`/products?category=${product.categorySlug}`} className={styles.breadcrumbLink}>
            {product.category}
          </Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </div>
      </motion.div>

      {/* ── PRODUCT MAIN ── */}
      <div className={styles.productMain}>

        {/* Left: Image */}
        <motion.div className={styles.imagePanel} data-reveal {...fadeUp(0.08, 18)}>
          <div className={styles.imageWrap}>
            <img
              src={product.image}
              alt={`${product.name} — ${product.tagline}`}
              className={styles.productImg}
            />
            <span className={styles.imageBadge}>{product.ip} · CRI {product.cri}</span>
          </div>
        </motion.div>

        {/* Right: Info */}
        <motion.div className={styles.infoPanel} data-reveal style={{ transitionDelay: '0.12s' }} {...fadeUp(0.14, 18)}>
          <p className={styles.infoEyebrow}>
            {product.category}
            <span className={styles.eyebrowDivider} />
          </p>
          <h1 className={styles.productName}>{product.name}</h1>
          <p className={styles.productTagline}>{product.tagline}</p>
          <p className={styles.productDesc}>{product.description}</p>

          {/* Specs table */}
          <p className={styles.specsTitle}>Specifications</p>
          <table className={styles.specsTable}>
            <tbody>
              {SPECS_MAP.map(({ key, field }) => (
                <tr key={key} className={styles.specRow}>
                  <td className={styles.specKey}>{key}</td>
                  <td className={styles.specVal}>{product[field]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Features */}
          <p className={styles.featuresTitle}>Key Features</p>
          <ul className={styles.featuresList}>
            {product.features.map(f => (
              <li key={f} className={styles.featureItem}>
                <span className={styles.featureCheck}>✓</span>
                {f}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className={styles.ctaRow}>
            {/* <button className={styles.btnPrimary} onClick={() => navigate('/login')}>
              Request a Quote
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button> */}
            <Link to="/products" className={styles.btnGhost}>
              ← All Products
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── RELATED PRODUCTS ── */}
      {related.length > 0 && (
        <section className={styles.related}>
          <div className={styles.relatedInner}>
            <div className={styles.relatedHeader}>
              <h2 className={styles.relatedTitle}>Related Products</h2>
              <Link to={`/products?category=${product.categorySlug}`} className={styles.relatedViewAll}>
                View All {product.category}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </div>
            <div className={styles.relatedGrid}>
              {related.map((p, i) => (
                <motion.div key={p.slug} whileHover={cardHover} {...fadeUp(Math.min(i * 0.08, 0.24), 18)}>
                  <Link
                    to={`/products/${p.slug}`}
                    className={styles.relatedCard}
                    data-reveal
                    style={{ transitionDelay: `${i * 0.1}s` }}
                  >
                    <img src={p.image} alt={p.name} className={styles.relatedCardImg} />
                    <div className={styles.relatedCardBody}>
                      <p className={styles.relatedCardName}>{p.name}</p>
                      <p className={styles.relatedCardTag}>{p.tagline}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
