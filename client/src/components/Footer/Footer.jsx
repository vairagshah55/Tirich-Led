import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import styles from './Footer.module.css';
import footerLogo from '../../assets/new-log.png';

const EASE = [0.25, 1, 0.5, 1];

const SOCIALS = [
  { label: 'Instagram', href: '#', icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></> },
  { label: 'Facebook', href: '#', icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/> },
  { label: 'Twitter', href: '#', icon: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/> },
];

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
            <img src={footerLogo} alt="Tirich LED" className={styles.footerLogo} />
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
            <Link to="/products">Products</Link>
            <Link to="/smart-lighting">Smart Lighting</Link>
            <Link to="/about">About Us</Link>
          </div>
          <div className={styles.footerNavCol}>
            <span className={styles.footerNavHead}>Company</span>
            <Link to="/contact">Contact</Link>
            <Link to="/products">All Products</Link>
            <Link to="/smart-lighting">Smart Systems</Link>
          </div>
          <div className={styles.footerNavCol}>
            <span className={styles.footerNavHead}>Support</span>
            <a href="#" onClick={(e) => e.preventDefault()}>Catalogue</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Warranty</a>
            <a href="#" onClick={(e) => e.preventDefault()}>FAQs</a>
          </div>
        </nav>
      </motion.div>

      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} Tirich LED. All rights reserved.</p>
        <div className={styles.footerBottomLinks}>
          <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
          <span className={styles.footerDivider} />
          <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
        </div>
      </div>
    </footer>
  );
}
