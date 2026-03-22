import { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/new-log.png';
import styles from './Navbar.module.css';
import { CATEGORIES, PRODUCTS } from '../../data/products';

const FEATURED = PRODUCTS[0]; // TLC-101 as featured product

export default function Navbar() {
  const navigate   = useNavigate();
  const { pathname } = useLocation();
  const isHome     = pathname === '/';

  // ── Scroll-aware ───────────────────────────────────────────────
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Theme ──────────────────────────────────────────────────────
  const [theme, setTheme] = useState(
    () => localStorage.getItem('tirich-theme') || 'light'
  );
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tirich-theme', theme);
  }, [theme]);
  const toggleTheme = useCallback(() => {
    document.documentElement.classList.add('theme-switching');
    setTimeout(() => document.documentElement.classList.remove('theme-switching'), 420);
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  // ── Mega menu ──────────────────────────────────────────────────
  const [megaOpen, setMegaOpen]   = useState(false);
  const megaTimer                 = useRef(null);
  const openMega  = () => { clearTimeout(megaTimer.current); setMegaOpen(true); };
  const closeMega = () => { megaTimer.current = setTimeout(() => setMegaOpen(false), 180); };

  // ── Mobile menu ────────────────────────────────────────────────
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [mobileProdOpen, setMobileProdOpen] = useState(false);

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false); setMegaOpen(false); }, [pathname]);

  // Scroll-to-section helper (works on both home + other pages)
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

  // Count products per category
  const countBySlug = (slug) => PRODUCTS.filter(p => p.categorySlug === slug).length;

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        {/* ── Logo ── */}
        <Link to="/" className={styles.navBrand}>
          <img src={logo} alt="Tirich LED" className={styles.navLogo} />
        </Link>

        {/* ── Desktop centre links ── */}
        <div className={styles.navCenter}>
          {/* Home */}
          <Link
            to="/"
            className={`${styles.navLink} ${isHome ? styles.navLinkActive : ''}`}
          >
            Home
          </Link>

          {/* Products — mega menu trigger */}
          <div
            className={styles.megaTrigger}
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
          >
            <button className={`${styles.navLink} ${styles.navLinkBtn} ${pathname.startsWith('/products') ? styles.navLinkActive : ''}`}>
              Products
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>

          {/* About */}
          <Link
            to="/about"
            className={`${styles.navLink} ${pathname === '/about' ? styles.navLinkActive : ''}`}
          >
            About
          </Link>

          {/* Technology → scrolls to craftsmanship */}
          <a
            href={isHome ? '#craftsmanship' : '/#craftsmanship'}
            className={styles.navLink}
            onClick={goToSection('craftsmanship')}
          >
            Technology
          </a>

          {/* Contact */}
          <Link
            to="/contact"
            className={`${styles.navLink} ${pathname === '/contact' ? styles.navLinkActive : ''}`}
          >
            Contact
          </Link>
        </div>

        {/* ── Right controls ── */}
        <div className={styles.navRight}>
          {/* Theme toggle */}
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span className={`${styles.themeKnob} ${theme === 'light' ? styles.themeKnobLight : ''}`}>
              {theme === 'dark' ? '☽' : '☀'}
            </span>
          </button>

          {/* Partner login — hidden until ready */}
          {/* <button className={styles.navCta} onClick={() => navigate('/login')}>
            Partner Login
          </button> */}

          {/* Hamburger */}
          <button
            className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── Mega Menu (desktop) ──────────────────────────────────── */}
      {megaOpen && (
        <div
          className={styles.megaMenu}
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
        >
          {/* Left: category grid */}
          <div className={styles.megaLeft}>
            <div className={styles.megaHeader}>
              <p className={styles.megaTitle}>Browse Products</p>
              <Link to="/products" className={styles.megaViewAll} onClick={() => setMegaOpen(false)}>
                View All Products
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </div>

            <div className={styles.megaGrid}>
              {CATEGORIES.map(cat => (
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
                  <span className={styles.catArrow}>›</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: featured product */}
          <div className={styles.megaRight}>
            <div className={styles.megaFeaturedImg}>
              <img src={FEATURED.image} alt={FEATURED.name} />
            </div>
            <div className={styles.megaFeaturedBody}>
              <p className={styles.megaFeaturedEye}>Featured Product</p>
              <p className={styles.megaFeaturedName}>{FEATURED.name}</p>
              <p className={styles.megaFeaturedTag}>{FEATURED.tagline}</p>
              <Link
                to={`/products/${FEATURED.slug}`}
                className={styles.megaFeaturedLink}
                onClick={() => setMegaOpen(false)}
              >
                View Details
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Menu ──────────────────────────────────────────── */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/" className={styles.mobileLink}>Home</Link>

          <button
            className={styles.mobileLink}
            onClick={() => setMobileProdOpen(o => !o)}
          >
            Products
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: mobileProdOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {mobileProdOpen && (
            <ul className={styles.mobileCatList}>
              <li><Link to="/products">All Products</Link></li>
              {CATEGORIES.map(cat => (
                <li key={cat.slug}>
                  <Link to={`/products?category=${cat.slug}`}>{cat.label}</Link>
                </li>
              ))}
            </ul>
          )}

          <Link to="/about" className={styles.mobileLink}>About</Link>
          <a href={isHome ? '#craftsmanship' : '/#craftsmanship'} className={styles.mobileLink} onClick={goToSection('craftsmanship')}>Technology</a>
          <Link to="/contact" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Contact</Link>

          {/* <div className={styles.mobileDivider} />
          <div className={styles.mobileCtaRow}>
            <button className={styles.mobileCta} onClick={() => { navigate('/login'); setMobileOpen(false); }}>
              Partner Login
            </button>
          </div> */}
        </div>
      )}
    </>
  );
}
