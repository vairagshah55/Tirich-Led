import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MotionConfig, motion, useScroll, useSpring } from 'motion/react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Seo from '../../components/Seo/Seo';
import LeadCaptureModal, { hasLeadData } from '../../components/LeadCaptureModal/LeadCaptureModal';
import { organizationLd, webSiteLd } from '../../config/seo';
import { prefersReducedMotion } from '../../utils/browser';
import { SECTION_EVENT, parseSectionQuery } from '../../utils/sectionNav';
import { AUDIENCE_IDS, CATALOGUE_PDF } from './homeContent';
import Hero from './sections/Hero';
import Ticker from './sections/Ticker';
import Audience from './sections/Audience';
import Products from './sections/Products';
import BrandStats from './sections/BrandStats';
import Spaces from './sections/Spaces';
import Why from './sections/Why';
import Projects from './sections/Projects';
import DealerCta from './sections/DealerCta';
import Certifications from './sections/Certifications';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import ui from './LandingPage.module.css';

// ─────────────────────────────────────────────────────────────────
// Homepage — the "Full Homepage (B2B + B2C)" design.
//
// This component owns the little state the sections share: which audience
// tab is open, the preset handed to the enquiry form, and the lead-gated
// catalogue download. Copy lives in homeContent.js; each section lays out
// its slice of it.
// ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { search } = useLocation();
  const [audience, setAudience] = useState(AUDIENCE_IDS[0]);
  const [preset, setPreset] = useState(null);
  const [showCatalogueModal, setShowCatalogueModal] = useState(false);

  // Reading progress — a thin orange beam across the top of the viewport.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 });

  // ── One way to move around the page ──────────────────────────────
  // { section, audience?, who?, enquiry? } — scroll to `section`, open an
  // audience tab, pre-fill the enquiry form. Used by the sections' own CTAs,
  // by Navbar/Footer links on this page (window event) and by links from
  // other pages (?section=…).
  const goTo = useCallback(({ section, audience: nextAudience, who, enquiry } = {}) => {
    if (nextAudience && AUDIENCE_IDS.includes(nextAudience)) setAudience(nextAudience);
    if (who || enquiry) setPreset({ who, enquiry, at: Date.now() });
    const el = section && document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }, []);

  // Deferred a frame: a link in the mobile drawer fires this from the same
  // click that closes the drawer, and the drawer's body scroll-lock has to
  // be released before the page can scroll.
  useEffect(() => {
    let raf = 0;
    const onSection = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => goTo(e.detail || {}));
    };
    window.addEventListener(SECTION_EVENT, onSection);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(SECTION_EVENT, onSection);
    };
  }, [goTo]);

  // Arriving from another page: wait out the route transition, then go.
  useEffect(() => {
    const request = parseSectionQuery(search);
    if (!request) return undefined;
    const timer = setTimeout(() => goTo(request), 500);
    return () => clearTimeout(timer);
  }, [search, goTo]);

  // ── Catalogue PDF, behind the same lead capture as product pages ──
  const downloadCatalogue = useCallback(() => {
    const a = document.createElement('a');
    a.href = CATALOGUE_PDF;
    a.download = 'Tirich-LED-Catalogue-2026.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, []);

  const handleCatalogueClick = useCallback(() => {
    if (hasLeadData()) downloadCatalogue();
    else setShowCatalogueModal(true);
  }, [downloadCatalogue]);

  const handleCatalogueLeadSuccess = useCallback(() => {
    setShowCatalogueModal(false);
    downloadCatalogue();
  }, [downloadCatalogue]);

  // Audience-panel CTAs are data ({ enquire } / { section } / { catalogue }).
  const handleAction = useCallback((action) => {
    if (action.catalogue) handleCatalogueClick();
    else if (action.enquire) goTo({ section: 'contact', ...action.enquire });
    else if (action.section) goTo({ section: action.section });
  }, [goTo, handleCatalogueClick]);

  return (
    <MotionConfig reducedMotion="user">
      <div className={ui.page}>
        <Seo path="/" jsonLd={[organizationLd, webSiteLd]} />

        <motion.div className={ui.progress} style={{ scaleX: progress }} aria-hidden="true" />

        <Navbar />

        <main className="page-main">
          <Hero onNavigate={goTo} />
          <Ticker />
          <Audience active={audience} onChange={setAudience} onAction={handleAction} />
          <Products />
          <BrandStats />
          <Spaces />
          <Why />
          <Projects />
          <DealerCta onNavigate={goTo} onCatalogue={handleCatalogueClick} />
          <Certifications />
          <Testimonials />
          <Contact preset={preset} />
        </main>

        <Footer />

        <LeadCaptureModal
          open={showCatalogueModal}
          onClose={() => setShowCatalogueModal(false)}
          onSuccess={handleCatalogueLeadSuccess}
        />
      </div>
    </MotionConfig>
  );
}
