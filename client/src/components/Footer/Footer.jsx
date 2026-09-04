import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import styles from './Footer.module.css';
import footerLogo from '../../assets/new-log.webp';
import { BUSINESS } from '../../config/seo';
import { CATEGORIES } from '../../data/products';

const EASE = [0.25, 1, 0.5, 1];

// Real profiles only — these also back the Organization schema's sameAs, so a
// placeholder here would put a dead link in our structured data.
const SOCIALS = [
  { label: 'Instagram', href: BUSINESS.sameAs[0], icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></> },
  { label: 'Facebook', href: BUSINESS.sameAs[1], icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/> },
];

// Every category landing page linked from every page — without this the
// /products/category/* pages are only reachable through the hover-only
// mega-menu, i.e. invisible to crawlers.
const FOOTER_CATEGORIES = CATEGORIES.slice(0, 6);

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerOrb} aria-hidden />

      <motion.div
        className={styles.footerTop}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className={styles.footerBrand}>
          <div className={styles.footerLogoRow}>
            <img src={footerLogo} alt="Tirich LED" className={styles.footerLogo} width="452" height="233" loading="lazy" decoding="async" />
          </div>
          <p className={styles.footerTagline}>
            Premium LED lighting solutions — engineered for commercial, residential, and architectural spaces.
          </p>
          <div className={styles.footerSocials}>
            {SOCIALS.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                className={styles.footerSocialLink}
                aria-label={s.label}
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {s.icon}
                </svg>
              </motion.a>
            ))}
          </div>
        </div>

        <nav className={styles.footerNav}>
          <div className={styles.footerNavCol}>
            <span className={styles.footerNavHead}>Explore</span>
            <Link to="/products">All Products</Link>
            <Link to="/smart-lighting">Smart Lighting</Link>
            <Link to="/about">About Us</Link>
            <a href="/Tirich-LED-Catalogue-2026.pdf" target="_blank" rel="noopener noreferrer">
              2026 Catalogue (PDF)
            </a>
          </div>
          <div className={styles.footerNavCol}>
            <span className={styles.footerNavHead}>Categories</span>
            {FOOTER_CATEGORIES.map((cat) => (
              <Link key={cat.slug} to={`/products/category/${cat.slug}`}>{cat.label}</Link>
            ))}
          </div>
          <div className={styles.footerNavCol}>
            <span className={styles.footerNavHead}>Company</span>
            <Link to="/contact">Contact</Link>
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
            <a href={`tel:${BUSINESS.telephone.replace(/[^+\d]/g, '')}`}>{BUSINESS.telephone}</a>
            <span className={styles.footerNavNote}>
              {BUSINESS.addressLocality}, {BUSINESS.addressRegion}
            </span>
          </div>
        </nav>
      </motion.div>

      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} Tirich LED. All rights reserved.</p>
        {/* Privacy Policy and Terms pages do not exist yet. Rendered as plain
            text rather than buttons so nothing looks clickable that is not —
            swap these for <Link>s once the real pages are written. */}
        <div className={styles.footerBottomLinks}>
          <span className={styles.footerLegalPending}>Privacy</span>
          <span className={styles.footerDivider} />
          <span className={styles.footerLegalPending}>Terms</span>
        </div>
      </div>
    </footer>
  );
}
