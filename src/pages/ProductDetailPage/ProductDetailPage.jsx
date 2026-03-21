import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { PRODUCTS } from '../../data/products';
import styles from './ProductDetailPage.module.css';

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
  const navigate   = useNavigate();
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
        <div className={styles.notFound}>
          <h2 className={styles.notFoundTitle}>Product not found</h2>
          <p className={styles.notFoundText}>The product you're looking for doesn't exist.</p>
          <Link to="/products" className={styles.btnPrimary}>Browse All Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />

      {/* ── BREADCRUMB ── */}
      <div className={styles.breadcrumb}>
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
      </div>

      {/* ── PRODUCT MAIN ── */}
      <div className={styles.productMain}>

        {/* Left: Image */}
        <div className={styles.imagePanel} data-reveal>
          <div className={styles.imageWrap}>
            <img
              src={product.image}
              alt={`${product.name} — ${product.tagline}`}
              className={styles.productImg}
            />
            <span className={styles.imageBadge}>{product.ip} · CRI {product.cri}</span>
          </div>
        </div>

        {/* Right: Info */}
        <div className={styles.infoPanel} data-reveal style={{ transitionDelay: '0.12s' }}>
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
            <button className={styles.btnPrimary} onClick={() => navigate('/login')}>
              Request a Quote
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
            <Link to="/products" className={styles.btnGhost}>
              ← All Products
            </Link>
          </div>
        </div>
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
                <Link
                  key={p.slug}
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
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
