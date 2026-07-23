import { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import logo from '../../assets/new-log.webp';
import styles from './Navbar.module.css';
import { CATEGORIES, PRODUCTS } from '../../data/products';
import { buttonHover, buttonTap, fadeIn, fadeUp, presenceFade } from '../../utils/motion';
import { getLeadData, hasLeadData, clearLeadData } from '../LeadCaptureModal/LeadCaptureModal';

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

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchInputRef = useRef(null);

  const submitSearch = (e) => {
    if (e) e.preventDefault();
    const term = searchValue.trim();
    navigate(term ? `/products?search=${encodeURIComponent(term)}` : '/products');
    setSearchOpen(false);
    setMobileOpen(false);
  };

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const [lead, setLead] = useState(() => hasLeadData() ? getLeadData() : null);
  const firstName = lead?.name?.split(' ')[0] || '';

  const handleLeadLogout = () => {
    clearLeadData();
    setLead(null);
    navigate('/products');
  };

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
            <img src={logo} alt="Tirich LED" className={styles.navLogo} decoding="async" />
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
          {firstName && (
            <div className={styles.leadUser}>
              <span className={styles.leadAvatar}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <span className={styles.leadName}>Hi, {firstName}</span>
              <button className={styles.leadLogout} onClick={handleLeadLogout} aria-label="Logout">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          )}
          <form
            className={`${styles.navSearch} ${searchOpen ? styles.navSearchOpen : ''}`}
            onSubmit={submitSearch}
            role="search"
          >
            <input
              ref={searchInputRef}
              type="text"
              className={styles.navSearchInput}
              placeholder="Search products…"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') { setSearchOpen(false); setSearchValue(''); } }}
              aria-label="Search products"
              tabIndex={searchOpen ? 0 : -1}
            />
            <button
              type="submit"
              className={styles.navSearchBtn}
              onClick={(e) => { if (!searchOpen) { e.preventDefault(); setSearchOpen(true); } }}
              aria-label="Search"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>

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
                    to={`/products/category/${cat.slug}`}
                    className={styles.catCard}
                    onClick={() => setMegaOpen(false)}
                  >
                    <div className={styles.catThumb}>
                      <img src={cat.cover} alt={cat.label} loading="lazy" decoding="async" />
                    </div>
                    <div className={styles.catInfo}>
                      <p className={styles.catLabel}>{cat.label}</p>
                      <p className={styles.catDesc}>{cat.desc}</p>
                      <span className={styles.catCount}>{countBySlug(cat.slug)} products</span>
                    </div>
                    <span className={styles.catArrow}>{'→'}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className={styles.megaRight}>
              <div className={styles.megaFeaturedImg}>
                <img src={FEATURED.image} alt={FEATURED.name} loading="lazy" decoding="async" />
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
            {firstName && (
              <div className={styles.mobileGreeting}>
                <span className={styles.leadAvatar}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <span className={styles.mobileGreetText}>Hi, {firstName}</span>
                <button className={styles.leadLogout} onClick={handleLeadLogout} aria-label="Logout">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            )}
            <form className={styles.mobileSearch} onSubmit={submitSearch} role="search">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className={styles.mobileSearchInput}
                placeholder="Search products…"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                aria-label="Search products"
              />
            </form>

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
                      <Link to={`/products/category/${cat.slug}`}>{cat.label}</Link>
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
