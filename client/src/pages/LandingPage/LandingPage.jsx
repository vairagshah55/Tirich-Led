import { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Navbar from '../../components/Navbar/Navbar';
import styles from './LandingPage.module.css';
import { buttonHover, buttonTap, fadeUp } from '../../utils/motion';
import footerLogo from '../../assets/new-log.png';


// ── Lightweight images — Living Gallery (84 – 700 KB each) ─────────
import lgTLC105  from '../../assets/TLC-105.jpg';         //  84 KB
import lgTLC151  from '../../assets/TLC-151.jpg';         // 112 KB
import lgTLC112  from '../../assets/TLC-112.jpg';         // 116 KB
import lgStrip   from '../../assets/STRIP-LED-POST.jpg';  // 124 KB
import lgTLC101  from '../../assets/TLC-101.jpg';         // 156 KB
import lgHanging from '../../assets/hanging-230.jpg';     // 372 KB
import lgTLC129  from '../../assets/TLC-129.jpg';         // 448 KB
import lgTLC111  from '../../assets/TLC-111.jpg';         // 468 KB

// ── Videos (gallery only) ──────────────────────────────────────────
import proVid1   from '../../assets/grok-video-083a2972-e0c2-44a4-b856-38ebb91513b1.mp4';  // 932 KB
import proVid2   from '../../assets/grok-video-1d4fef8d-119d-4f9f-8d71-650ca413f8be.mp4'; // 1.1 MB

import LivingGallery          from '../../components/LivingGallery/LivingGallery';
import AmbientSection         from '../../components/AmbientSection/AmbientSection';
import SmartLightingSection   from '../../components/SmartLightingSection/SmartLightingSection';

// ── Hero banner images (Pexels — free commercial use) ─────────────
const HERO_IMG_1 = 'https://images.pexels.com/photos/19689230/pexels-photo-19689230.jpeg?auto=compress&cs=tinysrgb&w=1920';
const HERO_IMG_2 = 'https://images.pexels.com/photos/3747103/pexels-photo-3747103.jpeg?auto=compress&cs=tinysrgb&w=1920';
const HERO_IMG_3 = 'https://images.pexels.com/photos/4626268/pexels-photo-4626268.jpeg?auto=compress&cs=tinysrgb&w=1920';
const HERO_IMG_4 = 'https://images.pexels.com/photos/29931645/pexels-photo-29931645.jpeg?auto=compress&cs=tinysrgb&w=1920';

// ── Living Gallery items ──────────────────────────────────────────
const LIVING_GALLERY = [
  { label: 'TLC-105 Downlight',       eyebrow: 'Downlight Series',   type: 'image', src: lgTLC105  },
  { label: 'TLC-112 Panel Light',     eyebrow: 'Panel Series',       type: 'image', src: lgTLC112  },
  { label: 'LED Strip Installation',  eyebrow: 'Strip Series',       type: 'image', src: lgStrip   },
  { label: 'LED Project Reel',        eyebrow: 'Installation Reel',  type: 'video', src: proVid1   },
  { label: 'TLC-101 Fixture',         eyebrow: 'Commercial Series',  type: 'image', src: lgTLC101  },
  { label: 'Hanging Pendant 230',     eyebrow: 'Pendant Series',     type: 'image', src: lgHanging },
  { label: 'TLC-129 Track Light',     eyebrow: 'Track Series',       type: 'image', src: lgTLC129  },
  { label: 'TLC-151 Surface Panel',   eyebrow: 'Panel Series',       type: 'image', src: lgTLC151  },
  { label: 'LED Campaign',            eyebrow: 'Commercial Install', type: 'video', src: proVid2   },
  { label: 'TLC-111 Ceiling Light',   eyebrow: 'Ceiling Series',     type: 'image', src: lgTLC111  },
];




// ── Hero slides — each with its own image + copy ─────────────────
const HERO_SLIDES = [
  {
    image:   HERO_IMG_1,
    tag:     'Premium LED Manufacturing',
    title:   ['Where Every', 'Beam', 'Powers a Vision'],
    accent:  1,
    sub:     'Industrial-grade LED solutions for commercial, residential, and architectural applications.',
  },
  {
    image:   HERO_IMG_2,
    tag:     'Commercial Lighting',
    title:   ['Precision', 'Engineered', 'for Performance'],
    accent:  0,
    sub:     'Every product tested for luminous flux, colour accuracy, and thermal consistency.',
  },
  {
    image:   HERO_IMG_3,
    tag:     'Architectural Lighting',
    title:   ['Light That', 'Defines', 'Your Space'],
    accent:  1,
    sub:     'From strip LEDs to pendant fixtures — tailored illumination for every environment.',
  },
  {
    image:   HERO_IMG_4,
    tag:     'Manufacturing Excellence',
    title:   ['50,000 Hours', 'of Reliable', 'Illumination'],
    accent:  0,
    sub:     'CE & RoHS certified. IP65 rated. Built for the most demanding conditions.',
  },
];

// ── Bokeh particle definitions ────────────────────────────────────
const BOKEH = [
  { speedX: 0.025, speedY: 0.018, w: 80,  h: 80,  l: '74%', t: '18%', blur: 25, op: 0.12 },
  { speedX: 0.04,  speedY: 0.03,  w: 50,  h: 50,  l: '88%', t: '38%', blur: 18, op: 0.09 },
  { speedX: 0.015, speedY: 0.022, w: 120, h: 120, l: '60%', t: '55%', blur: 35, op: 0.06 },
  { speedX: 0.05,  speedY: 0.04,  w: 32,  h: 32,  l: '82%', t: '65%', blur: 12, op: 0.18 },
  { speedX: 0.03,  speedY: 0.025, w: 65,  h: 65,  l: '68%', t: '78%', blur: 22, op: 0.08 },
  { speedX: 0.035, speedY: 0.02,  w: 45,  h: 45,  l: '55%', t: '28%', blur: 16, op: 0.11 },
  { speedX: 0.02,  speedY: 0.035, w: 90,  h: 90,  l: '78%', t: '88%', blur: 30, op: 0.05 },
  { speedX: 0.045, speedY: 0.022, w: 28,  h: 28,  l: '92%', t: '50%', blur: 10, op: 0.20 },
  { speedX: 0.028, speedY: 0.038, w: 55,  h: 55,  l: '65%', t: '42%', blur: 20, op: 0.08 },
  { speedX: 0.018, speedY: 0.012, w: 100, h: 100, l: '85%', t: '22%', blur: 32, op: 0.04 },
];

// ── Scroll-to (no hash in URL, gold glow on section) ─────────────
const scrollToSection = (id) => (e) => {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth' });
  el.classList.add('js-section-glow');
  setTimeout(() => el.classList.remove('js-section-glow'), 1000);
};

// ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate  = useNavigate();
  const { search } = useLocation();

  // ── Scroll to section when navigated from another page ───────
  useEffect(() => {
    const params  = new URLSearchParams(search);
    const section = params.get('section');
    if (section) {
      const timer = setTimeout(() => {
        const el = document.getElementById(section);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [search]);

  // ── Refs ─────────────────────────────────────────────────────
  const heroBgRef           = useRef(null);
  const heroContentRef      = useRef(null);
  const bokehRefs           = useRef([]);
  const [activeVidIdx,  setActiveVidIdx]  = useState(0);  // slide index (kept name for compat)
  const [displaySlide,  setDisplaySlide]  = useState(0);
  const [textVisible,   setTextVisible]   = useState(true);

  // ── 1. Blur-to-Focus Reveal ──────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('js-revealed');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ── 2. Hero Parallax ─────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      if (heroBgRef.current)
        heroBgRef.current.style.transform = `scale(1.03) translateY(${window.scrollY * 0.12}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── 3. Hero Video Auto-Advance ────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveVidIdx(prev => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeVidIdx]);

  // Text fade-out → swap content → fade-in on slide change
  useEffect(() => {
    setTextVisible(false);
    const t = setTimeout(() => {
      setDisplaySlide(activeVidIdx);
      setTextVisible(true);
    }, 380);
    return () => clearTimeout(t);
  }, [activeVidIdx]);

  // ── 4. Hero: 3D Tilt + Bokeh Mouse Parallax ─────────────────
  const onHeroMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width  - 0.5;
    const cy = (e.clientY - rect.top)  / rect.height - 0.5;

    if (heroContentRef.current) {
      heroContentRef.current.style.transition = 'transform 0.08s ease';
      heroContentRef.current.style.transform  =
        `perspective(900px) rotateX(${cy * -7}deg) rotateY(${cx * 7}deg)`;
    }
    bokehRefs.current.forEach((el, i) => {
      if (!el) return;
      const b = BOKEH[i];
      el.style.transition = 'none';
      el.style.transform  = `translate(${cx * b.speedX * 120}px, ${cy * b.speedY * 120}px)`;
    });
  }, []);

  const onHeroMouseLeave = useCallback(() => {
    if (heroContentRef.current) {
      heroContentRef.current.style.transition = 'transform 0.65s ease';
      heroContentRef.current.style.transform  = 'perspective(900px) rotateX(0) rotateY(0)';
    }
    bokehRefs.current.forEach((el) => {
      if (!el) return;
      el.style.transition = 'transform 0.65s ease';
      el.style.transform  = 'translate(0, 0)';
    });
  }, []);

  // ── 5. Magnetic buttons ───────────────────────────────────────
  const onMagMove  = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.transform =
      `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
  }, []);
  const onMagEnter = useCallback((e) => { e.currentTarget.style.transition = 'transform 0.1s ease'; }, []);
  const onMagLeave = useCallback((e) => {
    e.currentTarget.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)';
    e.currentTarget.style.transform  = '';
  }, []);
  const mag = { onMouseMove: onMagMove, onMouseEnter: onMagEnter, onMouseLeave: onMagLeave };

  return (
    <div className={styles.page}>

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <Navbar />

      {/* ── HERO: VIDEO CAROUSEL + 3D TILT + BOKEH ──────────────── */}
      <section
        className={styles.hero}
        id="hero"
        onMouseMove={onHeroMouseMove}
        onMouseLeave={onHeroMouseLeave}
      >
        {/* ── Image slides ── */}
        <div ref={heroBgRef} className={styles.heroVideos}>
          {HERO_SLIDES.map(({ image }, i) => (
            <img
              key={i}
              className={`${styles.heroVideoSlide}${i === activeVidIdx ? ` ${styles.heroVideoSlideActive}` : ''}`}
              style={{ transform: 'scale(1.1)' }}
              src={image}
              alt={HERO_SLIDES[i].tag}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>

        {/* Layered overlay: left-dark for text, right-lighter for depth */}
        <div className={styles.heroOverlay} />
        <div className={styles.heroOverlayRight} />

        {/* Bokeh particles — depth parallax on mouse move */}
        {BOKEH.map((b, i) => (
          <div
            key={i}
            ref={(el) => { bokehRefs.current[i] = el; }}
            className={styles.bokeh}
            style={{ width: b.w, height: b.h, left: b.l, top: b.t, filter: `blur(${b.blur}px)`, opacity: b.op }}
          />
        ))}

        {/* ── Hero text content ── */}
        <motion.div
          ref={heroContentRef}
          className={`${styles.heroContent} ${textVisible ? styles.heroTextIn : styles.heroTextOut}`}
          {...fadeUp(0.12, 24)}
        >
          {/* Left accent bar */}
          <div className={styles.heroBar} />

          <div className={styles.heroContentInner}>
            {/* Slide number */}
            <span className={styles.heroSlideNum}>
              {String(displaySlide + 1).padStart(2, '0')}
              <span className={styles.heroSlideTotal}> / {String(HERO_SLIDES.length).padStart(2, '0')}</span>
            </span>

            {/* Category tag */}
            <p className={styles.heroEyebrow}>
              <span className={styles.heroEyebrowDiamond}>◆</span>
              {HERO_SLIDES[displaySlide].tag}
            </p>

            {/* Title — word-level accent */}
            <h1 className={styles.heroTitle}>
              {HERO_SLIDES[displaySlide].title.map((line, li) => (
                <span
                  key={li}
                  className={`${styles.heroTitleLine} ${li === HERO_SLIDES[displaySlide].accent ? styles.heroTitleAccent : ''}`}
                >
                  {line}
                  {li < HERO_SLIDES[displaySlide].title.length - 1 && <br />}
                </span>
              ))}
            </h1>

            {/* Gold rule */}
            <div className={styles.heroRule} />

            {/* Subtitle */}
            <p className={styles.heroSubtitle}>{HERO_SLIDES[displaySlide].sub}</p>

            {/* CTAs */}
            <div className={styles.heroActions}>
              <motion.button className={styles.heroBtnPrimary} onClick={() => navigate('/products')} {...mag} whileHover={buttonHover} whileTap={buttonTap}>
                Explore Products
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </motion.button>
              <motion.a href="#collections" className={styles.heroBtnGhost} onClick={scrollToSection('collections')} {...mag} whileHover={buttonHover} whileTap={buttonTap}>
                View Catalogue
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* ── Prev / Next arrows ── */}
        <motion.button
          className={`${styles.heroArrow} ${styles.heroArrowLeft}`}
          onClick={() => setActiveVidIdx(i => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          aria-label="Previous video"
          whileHover={buttonHover}
          whileTap={buttonTap}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </motion.button>
        <motion.button
          className={`${styles.heroArrow} ${styles.heroArrowRight}`}
          onClick={() => setActiveVidIdx(i => (i + 1) % HERO_SLIDES.length)}
          aria-label="Next video"
          whileHover={buttonHover}
          whileTap={buttonTap}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </motion.button>

        {/* ── Dot indicators (bottom-right) ── */}
        <div className={styles.heroDots}>
          {HERO_SLIDES.map((_, i) => (
            <motion.button
              key={i}
              className={`${styles.heroDot}${i === activeVidIdx ? ` ${styles.heroDotActive}` : ''}`}
              onClick={() => setActiveVidIdx(i)}
              aria-label={`Slide ${i + 1}`}
              whileHover={{ scale: 1.15 }}
              whileTap={buttonTap}
            />
          ))}
        </div>

        {/* ── Progress bar ── */}
        <div className={styles.heroProgressBar} key={activeVidIdx} />

        <div className={styles.heroScroll}>
          <span>Scroll</span>
          <div className={styles.heroScrollLine} />
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────── */}
      <div className={styles.marqueeWrap}>
        <div className={styles.marquee}>
          {Array(3).fill(
            'LED Strip Lights · Panel Lights · High Bay LEDs · Flood Lights · Track Lights · Wall Washers · Smart Controls · Custom Solutions · '
          ).map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>

      {/* ── LIVING GALLERY ───────────────────────────────────────── */}
      <section className={styles.gallerySection} id="collections" data-cursor-theme="dark">
        <div className={styles.sectionHeader} data-reveal>
          <p className={styles.sectionEyebrow}>Tirich LED Product Range</p>
          <h2 className={styles.sectionTitle}>Engineered for Every Space</h2>
          <p className={styles.sectionLead}>
            From commercial high bays to architectural accent strips — every product is
            manufactured to precision standards and rigorously tested before delivery.
          </p>
        </div>
        <LivingGallery items={LIVING_GALLERY} />

        <div className={styles.catalogueCta} data-reveal>
          <div className={styles.catalogueCtaText}>
            <p className={styles.sectionEyebrow}>Product Resources</p>
            <h3 className={styles.catalogueCtaTitle}>Get the full product catalogue</h3>
            <p className={styles.catalogueCtaSub}>Specifications, dimensions, and technical data for every Tirich LED product.</p>
          </div>
          <motion.a href="#" download className={styles.catalogueCtaBtn} {...mag} whileHover={buttonHover} whileTap={buttonTap}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Catalogue
          </motion.a>
        </div>
      </section>

      {/* ── AMBIENT ENVIRONMENTS ─────────────────────────────────── */}
      <AmbientSection />

      {/* ── SMART LIGHTING ───────────────────────────────────────── */}
      <SmartLightingSection />

      {/* ── NEW LAUNCHES ────────────────────────────────────────── */}
      <motion.section
        className={styles.launches}
        id="new-launches"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--lx', `${e.clientX - r.left}px`);
          e.currentTarget.style.setProperty('--ly', `${e.clientY - r.top}px`);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.setProperty('--lx', '-999px');
          e.currentTarget.style.setProperty('--ly', '-999px');
        }}
      >
        <div className={styles.launchesOrb} aria-hidden />
        <div className={styles.launchesStripe} aria-hidden />
        <div className={styles.launchesSpotlight} aria-hidden />

        <motion.div
          className={styles.launchesHeader}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.launchesHeaderLeft}>
            <p className={styles.launchesEyebrow}>
              <motion.span
                className={styles.launchesEyebrowDot}
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              New Launches
            </p>
            <h2 className={styles.launchesTitle}>Freshly Engineered. Ready to Ship.</h2>
            <p className={styles.launchesLead}>
              Our latest additions — designed for modern interiors, tested to Tirich standards, and available now for your next project.
            </p>
          </div>
        </motion.div>

        <motion.div
          className={styles.launchGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } } }}
        >
          {/* Featured card with 3D tilt */}
          <motion.div
            className={styles.launchCardFeat}
            variants={{ hidden: { opacity: 0, y: 30, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
            whileHover={{ y: -6, boxShadow: '0 24px 56px rgba(38,34,98,0.16)', transition: { duration: 0.3 } }}
          >
            <div className={styles.launchCardFeatImg}>
              <motion.img
                src="https://images.pexels.com/photos/3324435/pexels-photo-3324435.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Pendant Pro Series"
                loading="lazy"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div className={styles.launchCardFeatImgOverlay} />
              <motion.span
                className={styles.launchBadge}
                initial={{ scale: 0, rotate: -12 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.3 }}
              >
                New
              </motion.span>
            </div>
            <div className={styles.launchCardFeatBody}>
              <span className={styles.launchCardFeatTag}>Pendant Series</span>
              <h3 className={styles.launchCardFeatTitle}>Pendant Pro — Matte Black</h3>
              <p className={styles.launchCardFeatDesc}>
                Precision-machined aluminium body with integrated COB LED. Warm 3000K output, CRI 95+, ideal for hospitality and dining.
              </p>
              <div className={styles.launchCardChips}>
                {['3000K', 'CRI 95+', 'Dimmable'].map((chip, ci) => (
                  <motion.span
                    key={chip}
                    className={styles.launchChip}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + ci * 0.06, type: 'spring', stiffness: 400 }}
                  >
                    {chip}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {[
            {
              img: 'https://images.pexels.com/photos/1166643/pexels-photo-1166643.jpeg?auto=compress&cs=tinysrgb&w=600',
              tag: 'Panel Series',
              title: 'Ultra-Slim Panel 40W',
              desc: 'Edge-lit panel with flicker-free driver. 4000K neutral white.',
              chips: ['4000K', '40W'],
            },
            {
              img: 'https://images.pexels.com/photos/518973/pexels-photo-518973.jpeg?auto=compress&cs=tinysrgb&w=600',
              tag: 'Strip LED',
              title: 'COB Strip 24V — Warm',
              desc: 'Dot-free, flexible COB strip. IP65 rated for cove and shelf lighting.',
              chips: ['IP65', '24V'],
            },
            {
              img: 'https://images.pexels.com/photos/443428/pexels-photo-443428.jpeg?auto=compress&cs=tinysrgb&w=600',
              tag: 'Ambient Series',
              title: 'Smart RGBW Controller',
              desc: 'Bluetooth + Wi-Fi scene controller. Works with all Tirich strips.',
              chips: ['BLE', 'Wi-Fi'],
            },
            {
              img: 'https://images.pexels.com/photos/12709063/pexels-photo-12709063.jpeg?auto=compress&cs=tinysrgb&w=600',
              tag: 'Downlight Series',
              title: 'Recessed COB 15W',
              desc: 'Anti-glare reflector, adjustable 30° tilt. CRI 95+ for retail.',
              chips: ['CRI 95+', '30° Tilt'],
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              className={styles.launchCard}
              variants={{ hidden: { opacity: 0, y: 24, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
              whileHover={{ y: -5, boxShadow: '0 18px 42px rgba(247,148,30,0.12)', transition: { duration: 0.25 } }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={styles.launchCardImgWrap}>
                <motion.img
                  src={card.img}
                  alt={card.title}
                  loading="lazy"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div className={styles.launchCardImgOverlay} />
                <motion.span
                  className={styles.launchBadge}
                  animate={{ boxShadow: ['0 2px 10px rgba(247,148,30,0.35)', '0 2px 18px rgba(247,148,30,0.55)', '0 2px 10px rgba(247,148,30,0.35)'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  New
                </motion.span>
              </div>
              <div className={styles.launchCardBody}>
                <span className={styles.launchCardTag}>{card.tag}</span>
                <h3 className={styles.launchCardTitle}>{card.title}</h3>
                <p className={styles.launchCardDesc}>{card.desc}</p>
                <div className={styles.launchCardChips}>
                  {card.chips.map((chip) => (
                    <span key={chip} className={styles.launchChip}>{chip}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.launchesMeta}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.launchesMetaLeft}>
            <motion.span
              className={styles.launchesMetaDot}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            5 new products · March 2026
          </span>
          <motion.button
            className={styles.launchesBtn}
            onClick={() => navigate('/products')}
            whileHover={{ y: -3, boxShadow: '0 10px 28px rgba(38,34,98,0.28)' }}
            whileTap={{ scale: 0.96 }}
          >
            View All Products
            <motion.svg
              width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              initial={{ x: 0 }}
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </motion.svg>
          </motion.button>
        </motion.div>
      </motion.section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerOrb} aria-hidden />

        <motion.div
          className={styles.footerTop}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Brand column */}
          <div className={styles.footerBrand}>
            <div className={styles.footerLogoRow}>
              <img src={footerLogo} alt="Tirich LED" className={styles.footerLogo} />
            </div>
            <p className={styles.footerTagline}>
              Premium LED lighting solutions — engineered for commercial, residential, and architectural spaces.
            </p>

            {/* Social icons */}
            <div className={styles.footerSocials}>
              {[
                { label: 'Instagram', href: '#', icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></> },
                { label: 'Facebook', href: '#', icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/> },
                { label: 'Twitter', href: '#', icon: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/> },
              ].map((s) => (
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

          {/* Nav columns */}
          <nav className={styles.footerNav}>
            <div className={styles.footerNavCol}>
              <span className={styles.footerNavHead}>Explore</span>
              <a href="#collections" onClick={scrollToSection('collections')}>Products</a>
              <a href="#environments" onClick={scrollToSection('environments')}>Applications</a>
              <a href="#smart-lighting" onClick={scrollToSection('smart-lighting')}>Smart Lighting</a>
              <a href="#new-launches" onClick={scrollToSection('new-launches')}>New Launches</a>
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

        {/* Bottom bar */}
        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} Tirich LED. All rights reserved.</p>
          <div className={styles.footerBottomLinks}>
            <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
            <span className={styles.footerDivider} />
            <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
