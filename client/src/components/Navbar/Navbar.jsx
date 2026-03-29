import { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import logo from '../../assets/new-log.png';
import styles from './Navbar.module.css';
import { CATEGORIES, PRODUCTS } from '../../data/products';
import { buttonHover, buttonTap, fadeIn, fadeUp, presenceFade } from '../../utils/motion';

const FEATURED = PRODUCTS[0];

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [megaOpen, setMegaOpen] = useState(false);
  const megaTimer = useRef(null);
  const openMega = () => {
    clearTimeout(megaTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    megaTimer.current = setTimeout(() => setMegaOpen(false), 180);
  };

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProdOpen, setMobileProdOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
    setMobileProdOpen(false);
  }, [pathname]);

  const goToSection = useCallback(
    (id) => (e) => {
      e.preventDefault();
      setMobileOpen(false);
      if (isHome) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(`/?section=${id}`);
      }
    },
    [isHome, navigate]
  );

  const countBySlug = (slug) => PRODUCTS.filter((product) => product.categorySlug === slug).length;

  return (
    <>
      <motion.nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`} {...fadeIn()}>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={buttonTap}>
          <Link to="/" className={styles.navBrand}>
            <img src={logo} alt="Tirich LED" className={styles.navLogo} />
          </Link>
        </motion.div>

        <motion.div className={styles.navCenter} {...fadeUp(0.05, 16)}>
          <Link to="/" className={`${styles.navLink} ${isHome ? styles.navLinkActive : ''}`}>
            Home
          </Link>

          <div className={styles.megaTrigger} onMouseEnter={openMega} onMouseLeave={closeMega}>
            <button className={`${styles.navLink} ${styles.navLinkBtn} ${pathname.startsWith('/products') ? styles.navLinkActive : ''}`}>
              Products
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>

          <Link to="/about" className={`${styles.navLink} ${pathname === '/about' ? styles.navLinkActive : ''}`}>
            About
          </Link>

          <a href={isHome ? '#smart-lighting' : '/#smart-lighting'} className={styles.navLink} onClick={goToSection('smart-lighting')}>
            Smart Lighting
          </a>

          <Link to="/contact" className={`${styles.navLink} ${pathname === '/contact' ? styles.navLinkActive : ''}`}>
            Contact
          </Link>
        </motion.div>

        <motion.div className={styles.navRight} {...fadeUp(0.1, 16)}>
          <motion.button
            className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle menu"
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            <span /><span /><span />
          </motion.button>
        </motion.div>
      </motion.nav>

      <AnimatePresence>
        {megaOpen && (
          <motion.div className={styles.megaMenu} onMouseEnter={openMega} onMouseLeave={closeMega} {...presenceFade}>
            <div className={styles.megaLeft}>
              <div className={styles.megaHeader}>
                <p className={styles.megaTitle}>Browse Products</p>
                <Link to="/products" className={styles.megaViewAll} onClick={() => setMegaOpen(false)}>
                  View All Products
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>

              <div className={styles.megaGrid}>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/products?category=${cat.slug}`}
                    className={styles.catCard}
                    onClick={() => setMegaOpen(false)}
                  >
                    <div className={styles.catThumb}>
                      <img src={cat.cover} alt={cat.label} />
                    </div>
                    <div className={styles.catInfo}>
                      <p className={styles.catLabel}>{cat.label}</p>
                      <p className={styles.catDesc}>{cat.desc}</p>
                      <span className={styles.catCount}>{countBySlug(cat.slug)} products</span>
                    </div>
                    <span className={styles.catArrow}>�</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className={styles.megaRight}>
              <div className={styles.megaFeaturedImg}>
                <img src={FEATURED.image} alt={FEATURED.name} />
              </div>
              <div className={styles.megaFeaturedBody}>
                <p className={styles.megaFeaturedEye}>Featured Product</p>
                <p className={styles.megaFeaturedName}>{FEATURED.name}</p>
                <p className={styles.megaFeaturedTag}>{FEATURED.tagline}</p>
                <Link to={`/products/${FEATURED.slug}`} className={styles.megaFeaturedLink} onClick={() => setMegaOpen(false)}>
                  View Details
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className={styles.mobileMenu} {...presenceFade}>
            <Link to="/" className={styles.mobileLink}>Home</Link>

            <motion.button
              className={styles.mobileLink}
              onClick={() => setMobileProdOpen((open) => !open)}
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              Products
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: mobileProdOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </motion.button>

            <AnimatePresence>
              {mobileProdOpen && (
                <motion.ul className={styles.mobileCatList} {...presenceFade}>
                  <li><Link to="/products">All Products</Link></li>
                  {CATEGORIES.map((cat) => (
                    <li key={cat.slug}>
                      <Link to={`/products?category=${cat.slug}`}>{cat.label}</Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>

            <Link to="/about" className={styles.mobileLink}>About</Link>
            <a href={isHome ? '#smart-lighting' : '/#smart-lighting'} className={styles.mobileLink} onClick={goToSection('smart-lighting')}>Smart Lighting</a>
            <Link to="/contact" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Contact</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
