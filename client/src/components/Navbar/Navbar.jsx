import { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
// The dark-background version of the logo: same artwork, navy ink turned
// white so it reads on the navy bar (orange slash and LED unchanged).
import logo from '../../assets/logo-r-light.webp';
import styles from './Navbar.module.css';
import { CATEGORIES, PRODUCTS } from '../../data/products';
import { BUSINESS } from '../../config/seo';
import { buttonTap, presenceFade } from '../../utils/motion';
import { requestSection, sectionHref } from '../../utils/sectionNav';
import SectionLink from '../SectionLink/SectionLink';
import Icon from '../Icon/Icon';
import { getLeadData, hasLeadData, clearLeadData } from '../LeadCaptureModal/LeadCaptureModal';

const FEATURED = PRODUCTS[0];
const PHONE_DISPLAY = BUSINESS.telephone.replace(/-/g, ' ');
const PHONE_HREF = `tel:${BUSINESS.telephone.replace(/[^+\d]/g, '')}`;

// The design's links. Section links scroll in place on the homepage and
// carry ?section= from anywhere else (see utils/sectionNav.js).
const SECTION_LINKS = [
  { key: 'applications', label: 'Applications', section: 'spaces' },
  { key: 'projects', label: 'Projects', section: 'projects' },
  { key: 'trade', label: 'Trade', section: 'connect' },
];

// Homepage scroll-spy: which nav item owns each section id.
const SPY = [
  ['connect', 'trade'],
  ['products', 'products'],
  ['spaces', 'applications'],
  ['projects', 'projects'],
  ['contact', 'contact'],
];

const PILL_SPRING = { type: 'spring', stiffness: 480, damping: 38 };

const mobileList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.06 } },
};

const mobileItem = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  const [scrolled, setScrolled] = useState(false);
  const [spy, setSpy] = useState('home');

  // One passive listener, one rAF: the solid/transparent switch and, on the
  // homepage, the scroll-spy — the last tracked section whose top has
  // passed 40% of the viewport owns the active link.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
      if (!isHome) return;
      const line = window.innerHeight * 0.4;
      let current = 'home';
      for (const [id, key] of SPY) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = key;
      }
      setSpy(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isHome]);

  const activeKey = isHome
    ? spy
    : pathname.startsWith('/products')
      ? 'products'
      : pathname === '/contact'
        ? 'contact'
        : null;

  // Hover pill — one element that glides to whichever link is pointed at.
  const [hovered, setHovered] = useState(null);

  const [megaOpen, setMegaOpen] = useState(false);
  const megaTimer = useRef(null);
  const openMega = () => {
    clearTimeout(megaTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    megaTimer.current = setTimeout(() => setMegaOpen(false), 180);
  };
  useEffect(() => () => clearTimeout(megaTimer.current), []);

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

  // Deliberately starts null rather than reading localStorage during render.
  // The pre-rendered HTML is captured with no saved lead, so a returning
  // visitor whose first client render showed "Hi, <name>" would be a hydration
  // mismatch on every page. Read it once after mount instead — the greeting
  // appears a tick later, which nobody notices.
  const [lead, setLead] = useState(null);
  const firstName = lead?.name?.split(' ')[0] || '';

  useEffect(() => {
    if (hasLeadData()) setLead(getLeadData());
  }, []);

  // The visitor's account chip sits at the far right of the bar; its menu
  // closes on an outside click, on Escape and on navigation.
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    if (!accountOpen) return undefined;
    const onDown = (e) => {
      if (!accountRef.current?.contains(e.target)) setAccountOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setAccountOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [accountOpen]);

  const handleLeadLogout = () => {
    clearLeadData();
    setLead(null);
    setAccountOpen(false);
    navigate('/products');
  };

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
    setMobileProdOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  // The mobile drawer is a fixed, full-width panel, so without this the page
  // behind it still scrolls under the finger — you close the menu and find
  // yourself somewhere else on the page. Locking the body while it is open
  // keeps the scroll position; the padding compensates for a scrollbar
  // disappearing on the desktop widths where one exists.
  useEffect(() => {
    if (!mobileOpen || typeof document === 'undefined') return undefined;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    // Flag on the body so the floating WhatsApp button — a sibling of the
    // navbar with a higher z-index, and no shared state with it — can take
    // itself out of the way while the drawer is open.
    body.dataset.navOpen = 'true';
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
      delete body.dataset.navOpen;
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Home: on the homepage it means "back to the top".
  const onHomeClick = (e) => {
    setMobileOpen(false);
    if (!isHome) return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Products: the homepage has a products section; elsewhere it's the page.
  const onProductsClick = (e) => {
    setMegaOpen(false);
    setMobileOpen(false);
    if (!isHome) return;
    e.preventDefault();
    requestSection({ section: 'products' });
  };

  // Contact: the homepage form when on it, the contact page otherwise.
  const onContactClick = (e) => {
    setMobileOpen(false);
    if (!isHome) return;
    e.preventDefault();
    requestSection({ section: 'contact' });
  };

  const countBySlug = (slug) => PRODUCTS.filter((product) => product.categorySlug === slug).length;

  const navClass = `${styles.nav}${scrolled ? ` ${styles.navScrolled}` : ''}`;

  const linkClass = (key) => `${styles.navLink}${activeKey === key ? ` ${styles.navLinkActive}` : ''}`;

  // Hover pill + active underline, shared by every desktop link.
  const linkDecor = (key) => (
    <>
      {hovered === key && (
        <motion.span layoutId="navHoverPill" className={styles.hoverPill} transition={PILL_SPRING} aria-hidden="true" />
      )}
      {activeKey === key && (
        <motion.span layoutId="navActiveBar" className={styles.activeBar} transition={PILL_SPRING} aria-hidden="true" />
      )}
    </>
  );

  return (
    <>
      <motion.nav
        className={navClass}
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Main"
      >
        {/* While the search is open the links step aside and the field takes
            their place — otherwise it slides over them. */}
        <div className={`${styles.inner}${searchOpen ? ` ${styles.searching}` : ''}`}>
          <motion.div whileTap={buttonTap} className={styles.brandWrap}>
            <Link to="/" className={styles.navBrand} onClick={onHomeClick} aria-label="Tirich LED — home">
              <img src={logo} alt="Tirich LED" className={styles.navLogo} width="325" height="160" fetchpriority="high" decoding="async" />
            </Link>
          </motion.div>

          <ul className={styles.navCenter} onMouseLeave={() => setHovered(null)}>
            <li>
              <Link
                to="/"
                className={linkClass('home')}
                onClick={onHomeClick}
                onMouseEnter={() => setHovered('home')}
                aria-current={activeKey === 'home' ? 'page' : undefined}
              >
                {linkDecor('home')}
                <span className={styles.linkText}>Home</span>
              </Link>
            </li>

            <li className={styles.megaTrigger} onMouseEnter={openMega} onMouseLeave={closeMega}>
              <Link
                to="/products"
                className={linkClass('products')}
                onClick={onProductsClick}
                onMouseEnter={() => setHovered('products')}
                onFocus={openMega}
                aria-haspopup="true"
                aria-expanded={megaOpen}
              >
                {linkDecor('products')}
                <span className={styles.linkText}>
                  Products
                  <svg className={styles.chevron} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </Link>
            </li>

            {SECTION_LINKS.map((l) => (
              <li key={l.key}>
                <SectionLink
                  section={l.section}
                  className={linkClass(l.key)}
                  onMouseEnter={() => setHovered(l.key)}
                >
                  {linkDecor(l.key)}
                  <span className={styles.linkText}>{l.label}</span>
                </SectionLink>
              </li>
            ))}

            <li>
              <Link
                to={isHome ? sectionHref('contact') : '/contact'}
                className={linkClass('contact')}
                onClick={onContactClick}
                onMouseEnter={() => setHovered('contact')}
              >
                {linkDecor('contact')}
                <span className={styles.linkText}>Contact</span>
              </Link>
            </li>
          </ul>

          <div className={styles.navRight}>
            <form
              className={`${styles.navSearch} ${searchOpen ? styles.navSearchOpen : ''}`}
              onSubmit={submitSearch}
              // Close once focus leaves the whole form (not when it moves from
              // the field to the search button), keeping whatever was typed.
              onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setSearchOpen(false); }}
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

            <a href={PHONE_HREF} className={styles.navPhone}>
              <span className={styles.navPhoneIcon}>
                <Icon name="phone" size={14} strokeWidth={2} />
              </span>
              <strong>{PHONE_DISPLAY}</strong>
            </a>

            {firstName && (
              <div className={styles.account} ref={accountRef}>
                <button
                  type="button"
                  className={`${styles.accountBtn}${accountOpen ? ` ${styles.accountBtnOpen}` : ''}`}
                  onClick={() => setAccountOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  aria-label={`Account: ${lead.name}`}
                >
                  <span className={styles.accountAvatar} aria-hidden="true">
                    {firstName.charAt(0).toUpperCase()}
                  </span>
                  <span className={styles.accountName}>Hi, {firstName}</span>
                  <svg className={styles.accountChevron} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      className={styles.accountMenu}
                      role="menu"
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className={styles.accountHead}>
                        <span className={styles.accountAvatarLg} aria-hidden="true">
                          {firstName.charAt(0).toUpperCase()}
                        </span>
                        <span className={styles.accountHeadText}>
                          <span className={styles.accountFullName}>{lead.name}</span>
                          {lead.city && <span className={styles.accountMeta}>{lead.city}</span>}
                        </span>
                      </div>
                      <Link to="/products" className={styles.accountItem} role="menuitem" onClick={() => setAccountOpen(false)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>
                        Browse products
                      </Link>
                      <button type="button" className={`${styles.accountItem} ${styles.accountLogout}`} role="menuitem" onClick={handleLeadLogout}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button
              type="button"
              className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {megaOpen && (
          <motion.div className={styles.megaMenu} onMouseEnter={openMega} onMouseLeave={closeMega} {...presenceFade}>
            <div className={styles.megaInner}>
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
                        <img src={cat.cover} alt={cat.label} width="400" height="300" loading="lazy" decoding="async" />
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
                  <img src={FEATURED.image} alt={FEATURED.name} width="400" height="400" loading="lazy" decoding="async" />
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div id="mobile-menu" className={styles.mobileMenu} {...presenceFade}>
            <motion.div className={styles.mobileList} variants={mobileList} initial="hidden" animate="show">
              {firstName && (
                <motion.div className={styles.mobileGreeting} variants={mobileItem}>
                  <span className={styles.accountAvatarLg} aria-hidden="true">
                    {firstName.charAt(0).toUpperCase()}
                  </span>
                  <span className={styles.accountHeadText}>
                    <span className={styles.accountFullName}>Hi, {firstName}</span>
                    {lead.city && <span className={styles.accountMeta}>{lead.city}</span>}
                  </span>
                  <button type="button" className={styles.mobileLogout} onClick={handleLeadLogout}>
                    Log out
                  </button>
                </motion.div>
              )}

              <motion.form className={styles.mobileSearch} onSubmit={submitSearch} role="search" variants={mobileItem}>
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
              </motion.form>

              <motion.div variants={mobileItem}>
                <Link to="/" className={styles.mobileLink} onClick={onHomeClick}>Home</Link>
              </motion.div>

              <motion.div variants={mobileItem}>
                <button
                  type="button"
                  className={styles.mobileLink}
                  onClick={() => setMobileProdOpen((open) => !open)}
                  aria-expanded={mobileProdOpen}
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
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </motion.div>

              <AnimatePresence>
                {mobileProdOpen && (
                  <motion.ul className={styles.mobileCatList} {...presenceFade}>
                    <li><Link to="/products" onClick={closeMobile}>All Products</Link></li>
                    {CATEGORIES.map((cat) => (
                      <li key={cat.slug}>
                        <Link to={`/products/category/${cat.slug}`} onClick={closeMobile}>{cat.label}</Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>

              {SECTION_LINKS.map((l) => (
                <motion.div key={l.key} variants={mobileItem}>
                  <SectionLink section={l.section} className={styles.mobileLink} onClick={closeMobile}>
                    {l.label}
                  </SectionLink>
                </motion.div>
              ))}

              <motion.div variants={mobileItem}>
                <Link
                  to={isHome ? sectionHref('contact') : '/contact'}
                  className={styles.mobileLink}
                  onClick={onContactClick}
                >
                  Contact
                </Link>
              </motion.div>

              <motion.div className={styles.mobileCtaRow} variants={mobileItem}>
                <SectionLink
                  section="contact"
                  who="dealer"
                  enquiry="pricing"
                  className={styles.mobileCta}
                  onClick={closeMobile}
                >
                  Get Trade Pricing →
                </SectionLink>
                <a href={PHONE_HREF} className={styles.mobilePhone}>
                  <Icon name="phone" size={16} strokeWidth={2} />
                  {PHONE_DISPLAY}
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
