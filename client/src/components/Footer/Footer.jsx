import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import styles from './Footer.module.css';
// Dark-background version of the logo — see Navbar.jsx.
import footerLogo from '../../assets/logo-r-light.webp';
import { BUSINESS } from '../../config/seo';
import { CATEGORIES } from '../../data/products';
import SectionLink from '../SectionLink/SectionLink';
import Icon, { WhatsAppGlyph } from '../Icon/Icon';

const EASE = [0.22, 1, 0.36, 1];
const PHONE_DISPLAY = BUSINESS.telephone.replace(/-/g, ' ');
const PHONE_HREF = `tel:${BUSINESS.telephone.replace(/[^+\d]/g, '')}`;

// Real profiles only — Instagram and Facebook also back the Organization
// schema's sameAs, so a placeholder here would put a dead link in our
// structured data. The design's LinkedIn and YouTube buttons are left out
// until those profiles exist.
const SOCIALS = [
  { label: 'Instagram', href: BUSINESS.sameAs[0], icon: <Icon name="instagram" size={16} strokeWidth={1.8} /> },
  { label: 'Facebook', href: BUSINESS.sameAs[1], icon: <Icon name="facebook" size={16} strokeWidth={1.8} /> },
  { label: 'WhatsApp', href: `https://wa.me/${BUSINESS.whatsapp}`, icon: <WhatsAppGlyph size={16} /> },
];

// The design's Products column, in its order. Entries with a `slug` are
// category landing pages: linking them from every page is what lets a
// crawler reach /products/category/* without the hover-only mega-menu. Each
// is kept only while that category exists, so a renamed one drops out
// instead of becoming a site-wide dead link.
const CATEGORY_SLUGS = new Set(CATEGORIES.map((c) => c.slug));
const FOOTER_CATEGORIES = [
  { label: 'COB Downlights', slug: 'cob-lights' },
  { label: 'Track Lights', slug: 'track-lights' },
  { label: 'Magnetic Track', slug: 'magnetic-track' },
  { label: 'Linear / Batten', slug: 'linear-lights' },
  { label: 'Panel Lights', to: '/products?search=panel' },
  { label: 'Outdoor / Flood', slug: 'outdoor-lights' },
  { label: 'Smart Lighting', to: '/smart-lighting' },
  { label: 'Wall Washers', to: '/products/wall-washer' },
].filter((cat) => !cat.slug || CATEGORY_SLUGS.has(cat.slug));

// Each entry is one of: { to } a route, { href } a file, { section, … } a
// homepage section (optionally pre-filling the enquiry form), or neither —
// a page that doesn't exist yet, rendered as plain text so nothing looks
// clickable that isn't.
const COLUMNS = [
  {
    heading: 'Trade',
    links: [
      { label: 'Dealer Programme', section: 'connect', audience: 'dealer' },
      { label: 'Distributor Tiers', section: 'contact', who: 'dealer', enquiry: 'trade' },
      { label: 'Apply for Account', section: 'contact', who: 'dealer', enquiry: 'trade' },
      { label: 'IES Files', section: 'contact', who: 'architect', enquiry: 'technical' },
      { label: 'Spec Sheets', section: 'contact', enquiry: 'technical' },
      { label: '2026 Catalogue', href: '/Tirich-LED-Catalogue-2026.pdf' },
      { label: 'Marketing Kit', section: 'contact', who: 'dealer', enquiry: 'catalogue' },
      { label: 'Training Videos', section: 'contact', enquiry: 'general' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Tirich LED', to: '/about' },
      { label: 'Projects', section: 'projects' },
      { label: 'Applications', section: 'spaces' },
      { label: 'For Architects', section: 'connect', audience: 'architect' },
      { label: 'Blog & Insights' },
      { label: 'Contact', to: '/contact' },
      { label: 'Privacy Policy' },
      { label: 'Terms of Trade' },
    ],
  },
];

function FooterLink({ link }) {
  if (link.to) return <Link to={link.to}>{link.label}</Link>;
  if (link.href) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer">
        {link.label}
      </a>
    );
  }
  if (link.section) {
    return (
      <SectionLink section={link.section} audience={link.audience} who={link.who} enquiry={link.enquiry}>
        {link.label}
      </SectionLink>
    );
  }
  return <span className={styles.pending}>{link.label}</span>;
}

const columnVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.beam} aria-hidden="true" />

      <motion.div
        className={styles.top}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.div className={styles.brand} variants={columnVariants}>
          <Link to="/" className={styles.logoBadge} aria-label="Tirich LED — home">
            <img src={footerLogo} alt="Tirich LED" className={styles.logo} width="325" height="160" loading="lazy" decoding="async" />
          </Link>
          <p className={styles.reg}>JEET INDUSTRIES</p>
          <p className={styles.desc}>
            Precision-manufactured LED lighting for interiors and architecture. Trusted by dealers,
            specified by architects, installed across 18 states in India.
          </p>
          {/* The full postal address, spelt as the Google Business Profile
              spells it — a visible address that matches the profile is one
              of the few on-page local signals that counts. */}
          <address className={styles.addr}>
            <strong>Registered Office</strong>
            {BUSINESS.streetAddress && <>{BUSINESS.streetAddress}<br /></>}
            {BUSINESS.addressLocality}, {BUSINESS.addressRegion}
            {BUSINESS.postalCode ? ` ${BUSINESS.postalCode}` : ''}
            <span className={styles.addrGap} />
            <a href={PHONE_HREF} className={styles.addrStrong}>{PHONE_DISPLAY}</a>
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
          </address>
          <div className={styles.socials}>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className={styles.social}
                aria-label={s.label}
                title={s.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.nav className={styles.col} variants={columnVariants} aria-label="Products">
          <p className={styles.colHead}>Products</p>
          <ul className={styles.links}>
            {FOOTER_CATEGORIES.map((cat) => (
              <li key={cat.label}>
                {cat.slug ? (
                  <Link to={`/products/category/${cat.slug}`}>{cat.label}</Link>
                ) : (
                  <Link to={cat.to}>{cat.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </motion.nav>

        {COLUMNS.map((col) => (
          <motion.nav key={col.heading} className={styles.col} variants={columnVariants} aria-label={col.heading}>
            <p className={styles.colHead}>{col.heading}</p>
            <ul className={styles.links}>
              {col.links.map((link) => (
                <li key={link.label}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </motion.nav>
        ))}
      </motion.div>

      <div className={styles.bottom}>
        <p className={styles.copy}>
          &copy; {new Date().getFullYear()} Tirich LED · JEET INDUSTRIES. All rights reserved. Registered trademark ®
        </p>
        <p className={styles.standards}>BIS · CE · RoHS · DALI-2 · IP65/67 · GST Registered · Made in India</p>
      </div>
    </footer>
  );
}
