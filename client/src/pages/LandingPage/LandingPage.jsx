import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import Navbar from '../../components/Navbar/Navbar';
import Seo, { SITE_URL } from '../../components/Seo/Seo';
import styles from './LandingPage.module.css';
import { buttonHover, buttonTap, fadeUp } from '../../utils/motion';


// ── Lightweight images — Living Gallery (84 – 700 KB each) ─────────
import lgTLC105 from '../../assets/TLC-105.webp';         //  84 KB
import lgTLC151 from '../../assets/TLC-151.webp';         // 112 KB
import lgTLC112 from '../../assets/TLC-112.webp';         // 116 KB
import lgStrip from '../../assets/STRIP-LED-POST.webp';  // 124 KB
import lgTLC101 from '../../assets/TLC-101.webp';         // 156 KB
import lgHanging from '../../assets/hanging-230.webp';     // 372 KB
import lgTLC111 from '../../assets/TLC-111.webp';         // 468 KB

// ── Living Gallery — installation photos (compressed webp, ≤134 KB) ──
import gallery1 from '../../assets/gallery/gallery1.webp';
import gallery2 from '../../assets/gallery/gallery2.webp';
import gallery3 from '../../assets/gallery/gallery3.webp';
import gallery4 from '../../assets/gallery/gallery4.webp';
import gallery5 from '../../assets/gallery/gallery5.webp';
import gallery7 from '../../assets/gallery/gallery7.webp';
import gallery8 from '../../assets/gallery/gallery8.webp';
import gallery9 from '../../assets/gallery/gallery9.webp';
import gallery10 from '../../assets/gallery/gallery10.webp';
import gallery11 from '../../assets/gallery/gallery11.webp';

// ── Hero products (optimized transparent cutouts — webp, ~30 KB each) ──
import HERO_IMG_1 from '../../assets/hero/slide-1.webp';
import HERO_IMG_2 from '../../assets/hero/slide-2.webp';
import HERO_IMG_3 from '../../assets/hero/slide-3.webp';
import HERO_IMG_4 from '../../assets/hero/slide-4.webp';
import HERO_IMG_5 from '../../assets/hero/slide-5.webp';

// ── Feature-card fixtures (transparent cutouts, ~22 – 39 KB each) ──
import ENG_OPTICS from '../../assets/hero/magnetic-cob.webp';
import ENG_CONTROL from '../../assets/hero/10z-lzr.webp';
import ENG_COLOUR from '../../assets/hero/cylinder.webp';
import ENG_DESIGN from '../../assets/hero/hanging-light.webp';

import LivingGallery from '../../components/LivingGallery/LivingGallery';
import AmbientSection from '../../components/AmbientSection/AmbientSection';
import SmartLightingSection from '../../components/SmartLightingSection/SmartLightingSection';
import Footer from '../../components/Footer/Footer';
import LeadCaptureModal, { hasLeadData } from '../../components/LeadCaptureModal/LeadCaptureModal';

const CATALOGUE_PDF = '/Tirich-LED-Catalogue-2026.pdf';

// ── Living Gallery items ──────────────────────────────────────────
const LIVING_GALLERY = [
  { label: 'TLC-105 Downlight', eyebrow: 'Downlight Series', type: 'image', src: lgTLC105 },
  { label: 'TLC-112 Panel Light', eyebrow: 'Panel Series', type: 'image', src: lgTLC112 },
  { label: 'LED Strip Installation', eyebrow: 'Strip Series', type: 'image', src: lgStrip },
  { label: 'TLC-101 Fixture', eyebrow: 'Commercial Series', type: 'image', src: lgTLC101 },
  { label: 'Hanging Pendant 230', eyebrow: 'Pendant Series', type: 'image', src: lgHanging },
  { label: 'TLC-151 Surface Panel', eyebrow: 'Panel Series', type: 'image', src: lgTLC151 },
  { label: 'TLC-111 Ceiling Light', eyebrow: 'Ceiling Series', type: 'image', src: lgTLC111 },
  // ── New installation photos ──
  { label: 'Living Space Install', eyebrow: 'Project Gallery', type: 'image', src: gallery1 },
  { label: 'Ambient Interior', eyebrow: 'Project Gallery', type: 'image', src: gallery2 },
  { label: 'Cove Lighting', eyebrow: 'Project Gallery', type: 'image', src: gallery3 },
  { label: 'Accent Detail', eyebrow: 'Project Gallery', type: 'image', src: gallery4 },
  { label: 'Modern Interior', eyebrow: 'Project Gallery', type: 'image', src: gallery5 },
  { label: 'Warm Ambience', eyebrow: 'Project Gallery', type: 'image', src: gallery7 },
  { label: 'Architectural Light', eyebrow: 'Project Gallery', type: 'image', src: gallery8 },
  { label: 'Premium Finish', eyebrow: 'Project Gallery', type: 'image', src: gallery9 },
  { label: 'Designer Setup', eyebrow: 'Project Gallery', type: 'image', src: gallery10 },
  { label: 'Signature Install', eyebrow: 'Project Gallery', type: 'image', src: gallery11 },
];




// ── Hero slides ──────────────────────────────────────────────────
//
// `width` / `shadowW` / `shadowY` are measured, not guessed: each cutout is
// a 1400x1400 frame with the fixture centred inside a different amount of
// transparent padding. Scaling every frame so its longest edge lands at 72%
// of the stage keeps a flat linear blade and a tall pendant reading at the
// same size; shadowY then drops each one's contact shadow just below where
// the fixture actually ends, so it reads as floating rather than resting.
const HERO_SLIDES = [
  {
    image: HERO_IMG_1,
    width: '122%',
    shadowW: 0.70,
    shadowY: 0.91,
    tag: 'Deep Recessed Anti-Glare COB',
    title: ['Minimal', 'Presence,', 'Maximum Comfort'],
    accent: 1,
    sub: 'High-CRI magnetic COB spots engineered for retail, showroom, and gallery accenting.',
    specs: ['CRI 95+', '7W – 15W', 'IP65 Rated', '50,000 hrs'],
  },
  {
    image: HERO_IMG_2,
    width: '120%',
    shadowW: 0.79,
    shadowY: 0.78,
    tag: 'Linear LED Modules',
    title: ['Crafted For', 'Modern', 'Spaces'],
    accent: 1,
    sub: 'Anti-glare linear fixtures delivering uniform, continuous light runs.',
    specs: ['Anti-Glare', 'Magnetic', 'CRI 90+', 'Seamless Run'],
  },
  {
    image: HERO_IMG_3,
    width: '132%',
    shadowW: 0.79,
    shadowY: 0.82,
    tag: 'Micro Recessed Pinhole COB',
    title: ['A Pinpoint of Light,', 'A World of', 'Detail'],
    accent: 2,
    sub: 'Small in size, precise in performance.',
    specs: ['Surface Mount', 'Tri-CCT', 'CRI 95+', 'Anti-Glare'],
  },
  {
    image: HERO_IMG_4,
    width: '126%',
    shadowW: 0.61,
    shadowY: 0.91,
    tag: 'Trimless Deep Recessed COB',
    title: ['Where Light', 'Becomes', 'Architecture'],
    accent: 2,
    sub: 'Designed to disappear. Crafted to impress.',
    specs: ['Suspended', 'Slim Profile', 'Dimmable', 'CRI 90+'],
  },
  {
    image: HERO_IMG_5,
    width: '138%',
    shadowW: 0.75,
    shadowY: 0.91,
    tag: 'Mini Recessed Spots',
    title: ['Minimal', 'Form,', 'Maximum Focus'],
    accent: 1,
    sub: 'Mini spotlights that disappear into the ceiling — all light, no fixture.',
    specs: ['Trimless', 'Anti-Glare', 'CRI 90+', 'Adjustable'],
  },
];

// How long each hero slide holds. Must match the heroDotProgress keyframe
// duration in LandingPage.module.css, or the progress line desyncs.
const SLIDE_MS = 7000;

const PREFERS_REDUCED_MOTION =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Below the fold: four engineering claims, one fixture each ─────
const ENGINEERED = [
  {
    num: '01',
    title: 'Precision Optics',
    img: ENG_OPTICS,
    alt: 'Tirich LED adjustable magnetic COB spotlight',
    desc:
      'Deep-set reflectors and anti-glare apertures put light exactly where the ' +
      'reflected-ceiling plan says it goes — and keep it out of everyone\u2019s eyes.',
    spec: '10\u00B0 / 24\u00B0 / 38\u00B0 optics \u00B7 UGR < 19',
    width: '112%',
    footprint: '84%',
  },
  {
    num: '02',
    title: 'Smart Control',
    img: ENG_CONTROL,
    alt: 'Tirich LED linear magnetic laser blade fixture',
    desc:
      'Flicker-free drivers that dim smoothly and shift from 3000K to 6000K on ' +
      'the same circuit, so one run of fixtures covers day, evening and display.',
    spec: 'DALI dimming \u00B7 3-in-1 tunable CCT',
    width: '106%',
    nudge: { '--fit-dx': '1.6%', '--fit-dy': '-6.2%' },
    footprint: '68%',
  },
  {
    num: '03',
    title: 'True Colour',
    img: ENG_COLOUR,
    alt: 'Tirich LED surface-mounted cylinder downlight',
    desc:
      'Tightly binned Bridgelux COB emitters, so timber reads as timber and ' +
      'skin reads as skin — consistently, across a hundred-fixture install.',
    spec: 'CRI 95+ \u00B7 Bridgelux COB',
    width: '96%',
    nudge: { '--fit-dy': '-3.9%' },
    footprint: '86%',
  },
  {
    num: '04',
    title: 'Architectural Design',
    img: ENG_DESIGN,
    alt: 'Tirich LED minimal suspended pendant fixture',
    desc:
      'Machined aluminium bodies, trimless plaster-in frames and blacked-out ' +
      'apertures. The fixture recedes into the ceiling; only the light stays.',
    spec: 'Trimless \u00B7 Plaster-in \u00B7 Matte finish',
    width: '70%',
    fit: 'engCardImgTall',
    suspended: true,
  },
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
  const navigate = useNavigate();
  const { search } = useLocation();

  // ── Scroll to section when navigated from another page ───────
  useEffect(() => {
    const params = new URLSearchParams(search);
    const section = params.get('section');
    if (section) {
      const timer = setTimeout(() => {
        const el = document.getElementById(section);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [search]);

  // ── Refs / state ─────────────────────────────────────────────
  const heroRef = useRef(null);
  const [activeVidIdx, setActiveVidIdx] = useState(0);  // slide index (kept name for compat)
  const [displaySlide, setDisplaySlide] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [showCatalogueModal, setShowCatalogueModal] = useState(false);
  // Only the first fixture ships with first paint; the rest warm up on idle.
  const [mountedSlides, setMountedSlides] = useState(1);
  // Is the hero on screen? Gates the carousel timer, the scroll listener
  // and (via .heroIdle) every looping CSS animation inside it.
  const [heroLive, setHeroLive] = useState(true);

  // Trigger the catalogue PDF download
  const downloadCatalogue = useCallback(() => {
    const a = document.createElement('a');
    a.href = CATALOGUE_PDF;
    a.download = 'Tirich-LED-Catalogue-2026.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, []);

  // Gate the download behind lead capture (same flow as viewing products)
  const handleCatalogueClick = useCallback(() => {
    if (hasLeadData()) {
      downloadCatalogue();
    } else {
      setShowCatalogueModal(true);
    }
  }, [downloadCatalogue]);

  const handleCatalogueLeadSuccess = useCallback(() => {
    setShowCatalogueModal(false);
    downloadCatalogue();
  }, [downloadCatalogue]);

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

  // ── 2. Hero interaction — one rAF, three custom properties ────
  //
  // Pointer position and scroll progress are the only inputs the hero has.
  // Both land on --mx / --my / --sy on the <section>, and CSS does the rest:
  // parallax, tilt, glow offset, shadow drift and the scroll dissolve are
  // all composited from those three numbers. A full mouse sweep therefore
  // costs three style writes per frame instead of a dozen node transforms.
  const heroVars = useRef({ mx: 0, my: 0, sy: 0, rect: null, raf: 0 });

  const flushHeroVars = useCallback(() => {
    heroVars.current.raf = 0;
    const el = heroRef.current;
    if (!el) return;
    const { mx, my, sy } = heroVars.current;
    el.style.setProperty('--mx', mx.toFixed(3));
    el.style.setProperty('--my', my.toFixed(3));
    el.style.setProperty('--sy', sy.toFixed(3));
  }, []);

  const scheduleHeroVars = useCallback(() => {
    if (heroVars.current.raf) return;
    heroVars.current.raf = requestAnimationFrame(flushHeroVars);
  }, [flushHeroVars]);

  useEffect(() => () => {
    if (heroVars.current.raf) cancelAnimationFrame(heroVars.current.raf);
  }, []);

  const onHeroPointerEnter = useCallback((e) => {
    // Measure once per hover so pointermove never forces a layout.
    heroVars.current.rect = e.currentTarget.getBoundingClientRect();
  }, []);

  const onHeroPointerMove = useCallback((e) => {
    if (PREFERS_REDUCED_MOTION || e.pointerType === 'touch') return;
    const v = heroVars.current;
    const rect = v.rect || (v.rect = e.currentTarget.getBoundingClientRect());
    const clamp = (n) => Math.max(-0.5, Math.min(0.5, n));
    v.mx = clamp((e.clientX - rect.left) / rect.width - 0.5);
    v.my = clamp((e.clientY - rect.top) / rect.height - 0.5);
    scheduleHeroVars();
  }, [scheduleHeroVars]);

  const onHeroPointerLeave = useCallback(() => {
    // Zero the inputs; the CSS transitions ease the fixture back to centre.
    const v = heroVars.current;
    v.mx = 0;
    v.my = 0;
    v.rect = null;
    scheduleHeroVars();
  }, [scheduleHeroVars]);

  // Scroll dissolve — only bound while the hero is actually on screen.
  useEffect(() => {
    if (!heroLive) return undefined;
    let travel = (heroRef.current?.offsetHeight || window.innerHeight) * 0.9;
    const measure = () => {
      travel = (heroRef.current?.offsetHeight || window.innerHeight) * 0.9;
    };
    const onScroll = () => {
      heroVars.current.sy = Math.min(1, window.scrollY / Math.max(1, travel));
      scheduleHeroVars();
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
    };
  }, [heroLive, scheduleHeroVars]);

  // ── 3. Park the hero once it scrolls away ────────────────────
  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setHeroLive(entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ── 4. Carousel auto-advance ─────────────────────────────────
  // A timeout keyed on the active slide (rather than a standing interval)
  // keeps the progress line and the slide change on the same clock.
  useEffect(() => {
    if (!heroLive || PREFERS_REDUCED_MOTION) return undefined;
    const timer = setTimeout(() => {
      setActiveVidIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_MS);
    return () => clearTimeout(timer);
  }, [activeVidIdx, heroLive]);

  const stepSlide = useCallback((delta) => {
    setActiveVidIdx((i) => (i + delta + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Keep one fixture in the critical path and fetch the other four when the
  // browser is idle — they aren't needed until the first slide change.
  useEffect(() => {
    if (mountedSlides >= HERO_SLIDES.length) return undefined;
    const idle = typeof window.requestIdleCallback === 'function';
    const id = idle
      ? window.requestIdleCallback(() => setMountedSlides(HERO_SLIDES.length))
      : window.setTimeout(() => setMountedSlides(HERO_SLIDES.length), 1400);
    return () => (idle ? window.cancelIdleCallback(id) : window.clearTimeout(id));
  }, [mountedSlides]);

  useEffect(() => {
    setMountedSlides((n) => Math.max(n, activeVidIdx + 1));
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

  // ── 5. Feature-card tilt — same two-property trick, per card ──
  const cardRect = useRef(null);
  const onCardEnter = useCallback((e) => {
    cardRect.current = e.currentTarget.getBoundingClientRect();
  }, []);
  const onCardMove = useCallback((e) => {
    if (PREFERS_REDUCED_MOTION || e.pointerType === 'touch') return;
    const rect = cardRect.current || e.currentTarget.getBoundingClientRect();
    const el = e.currentTarget;
    el.style.setProperty('--cx', ((e.clientX - rect.left) / rect.width - 0.5).toFixed(3));
    el.style.setProperty('--cy', ((e.clientY - rect.top) / rect.height - 0.5).toFixed(3));
  }, []);
  const onCardLeave = useCallback((e) => {
    cardRect.current = null;
    e.currentTarget.style.setProperty('--cx', '0');
    e.currentTarget.style.setProperty('--cy', '0');
  }, []);

  // ── 5. Magnetic buttons ───────────────────────────────────────
  const onMagMove = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.transform =
      `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
  }, []);
  const onMagEnter = useCallback((e) => { e.currentTarget.style.transition = 'transform 0.1s ease'; }, []);
  const onMagLeave = useCallback((e) => {
    e.currentTarget.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)';
    e.currentTarget.style.transform = '';
  }, []);
  const mag = { onMouseMove: onMagMove, onMouseEnter: onMagEnter, onMouseLeave: onMagLeave };

  // The product leads the transition and the copy follows it, so the two
  // read from different indices: `liveSlide` is the fixture currently
  // cross-fading in, `copySlide` is the text mid-swap behind it.
  const liveSlide = HERO_SLIDES[activeVidIdx];
  const copySlide = HERO_SLIDES[displaySlide];

  return (
    <div className={styles.page}>

      <Seo
        path="/"
        preloadImage={HERO_IMG_1}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Tirich LED',
            url: SITE_URL,
            logo: `${SITE_URL}/logo.png`,
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+91-73832-47625',
              contactType: 'sales',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Tirich LED',
            url: SITE_URL,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${SITE_URL}/products?search={query}`,
              'query-input': 'required name=query',
            },
          },
        ]}
      />

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <Navbar />

      {/* ══ HERO — white architectural studio ═════════════════════ */}
      <section
        className={`${styles.hero}${heroLive ? '' : ` ${styles.heroIdle}`}`}
        id="hero"
        ref={heroRef}
        onPointerEnter={onHeroPointerEnter}
        onPointerMove={onHeroPointerMove}
        onPointerLeave={onHeroPointerLeave}
      >
        {/* The room — lit wall, construction grid, floor plane, overhead
            beam, the pool of light where it lands, ambient occlusion. */}
        <div className={styles.envWall} aria-hidden="true" />
        <div className={styles.envGrid} aria-hidden="true" />
        <div className={styles.envFloor} aria-hidden="true" />
        <div className={styles.envShell} aria-hidden="true">
          <div className={styles.envColumn}>
            <div className={styles.envBeam} />
            <div className={styles.envPool} />
          </div>
        </div>
        <div className={styles.envVignette} aria-hidden="true" />

        <div className={styles.heroInner}>
          {/* One cell on desktop; `display: contents` on mobile splits these
              two halves so the fixture can land between them. */}
          <div className={styles.heroCopy}>
            {/* ── Slide index · category · headline ── */}
            <motion.div className={styles.heroCopyTop} {...fadeUp(0.1, 22)}>
              <div className={`${styles.heroFade}${textVisible ? '' : ` ${styles.heroFadeOut}`}`}>
                <div className={styles.heroMeta}>
                  <span className={styles.heroSlideNum}>
                    {String(displaySlide + 1).padStart(2, '0')}
                    <span className={styles.heroSlideTotal}>
                      {' / '}{String(HERO_SLIDES.length).padStart(2, '0')}
                    </span>
                  </span>
                  <span className={styles.heroMetaRule} aria-hidden="true" />
                </div>

                <p className={styles.heroEyebrow}>
                  <span className={styles.heroEyebrowDot} aria-hidden="true" />
                  {copySlide.tag}
                </p>

                <h1 className={styles.heroTitle}>
                  {copySlide.title.map((line, li) => (
                    <span
                      key={line}
                      className={`${styles.heroTitleLine}${li === copySlide.accent ? ` ${styles.heroTitleAccent}` : ''}`}
                    >
                      {line}
                    </span>
                  ))}
                </h1>

                <div className={styles.heroRule} aria-hidden="true" />
              </div>
            </motion.div>

            {/* ── Supporting line · CTAs ── */}
            <motion.div className={styles.heroCopyBottom} {...fadeUp(0.18, 22)}>
              <div className={`${styles.heroFade}${textVisible ? '' : ` ${styles.heroFadeOut}`}`}>
                <p className={styles.heroSubtitle}>{copySlide.sub}</p>

                <div className={styles.heroActions}>
                  <motion.button
                    type="button"
                    className={styles.heroBtnPrimary}
                    onClick={() => navigate('/products')}
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                  >
                    Explore Products
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </motion.button>
                  <motion.a
                    href="#collections"
                    className={styles.heroBtnGhost}
                    onClick={scrollToSection('collections')}
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                  >
                    View Catalogue
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Product stage ── */}
          <div
            className={styles.heroStage}
            style={{ '--shW': liveSlide.shadowW, '--shY': liveSlide.shadowY }}
          >
            {/* White core erases the wall's grey (reads as "lit"); the amber
                ring on top of it warms that core to lamp colour. */}
            <div className={styles.stageAura} aria-hidden="true" />
            <div className={styles.stagePool} aria-hidden="true" />
            <div className={styles.stageAuraWarm} aria-hidden="true" />

            <div className={styles.stageScroll}>
              <div className={styles.stageShadow} aria-hidden="true" />
              <div className={styles.stageShadowCore} aria-hidden="true" />

              <div className={styles.stageParallax}>
                <div className={styles.stageTilt}>
                  <div className={styles.stageFloat}>
                    {HERO_SLIDES.slice(0, mountedSlides).map((slide, i) => (
                      <img
                        key={slide.image}
                        className={`${styles.heroProduct}${i === activeVidIdx ? ` ${styles.heroProductActive}` : ''}`}
                        style={{ width: slide.width }}
                        src={slide.image}
                        alt={`${slide.tag} — Tirich LED`}
                        width="1400"
                        height="1400"
                        decoding="async"
                        loading={i === 0 ? 'eager' : 'lazy'}
                        fetchpriority={i === 0 ? 'high' : 'low'}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Specification pills (re-keyed so they re-stagger per slide) ── */}
          <div className={styles.heroSpecs} key={displaySlide}>
            {copySlide.specs.map((spec, i) => (
              <span
                key={spec}
                className={styles.heroSpecChip}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className={styles.heroSpecDot} aria-hidden="true" />
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* ── Scroll cue · slide index · arrows ── */}
        <div className={styles.heroFooter}>
          <div className={styles.heroScroll}>
            <span>Scroll</span>
            <span className={styles.heroScrollTrack} aria-hidden="true" />
          </div>

          <div className={styles.heroNav}>
            <button
              type="button"
              className={styles.heroArrow}
              onClick={() => stepSlide(-1)}
              aria-label="Previous product"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
            </button>

            <div className={styles.heroDots} aria-label="Featured products">
            {HERO_SLIDES.map((slide, i) => (
              <Fragment key={slide.image}>
                <button
                  type="button"
                  className={`${styles.heroDot}${i === activeVidIdx ? ` ${styles.heroDotActive}` : ''}`}
                  aria-current={i === activeVidIdx ? 'true' : undefined}
                  aria-label={`Show ${slide.tag}`}
                  onClick={() => setActiveVidIdx(i)}
                >
                  {String(i + 1).padStart(2, '0')}
                </button>
                {i === activeVidIdx && (
                  <span className={styles.heroDotTrack} aria-hidden="true">
                    <span className={styles.heroDotFill} key={activeVidIdx} />
                  </span>
                )}
              </Fragment>
            ))}
            </div>

            <button
              type="button"
              className={styles.heroArrow}
              onClick={() => stepSlide(1)}
              aria-label="Next product"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>

          <span aria-hidden="true" />
        </div>
      </section>

      {/* ══ LIGHT, ENGINEERED DIFFERENTLY ═════════════════════════ */}
      <section className={styles.engineered} id="engineered">
        <div className={styles.engInner}>
          <div className={styles.engHeader} data-reveal>
            <div>
              <p className={styles.engEyebrow}>
                <span className={styles.engEyebrowDot} aria-hidden="true" />
                Why Tirich
              </p>
              <h2 className={styles.engTitle}>
                Light, engineered{' '}
                <span className={styles.engTitleAccent}>differently.</span>
              </h2>
            </div>
            <p className={styles.engLead}>
              Precision lighting designed for spaces that demand more — specified
              by architects, built to hold its colour and its beam for years.
            </p>
          </div>

          <div className={styles.engGrid}>
            {ENGINEERED.map((card, i) => (
              <article
                key={card.num}
                className={`${styles.engCard}${card.suspended ? ` ${styles.engCardNoPlinth}` : ''}`}
                data-reveal
                style={{ '--reveal-delay': `${i * 90}ms`, '--fit-sy': card.footprint }}
                onPointerEnter={onCardEnter}
                onPointerMove={onCardMove}
                onPointerLeave={onCardLeave}
              >
                <div className={styles.engCardMedia}>
                  <span className={styles.engCardPlinth} aria-hidden="true" />
                  <img
                    className={`${styles.engCardImg}${card.fit ? ` ${styles[card.fit]}` : ''}`}
                    style={{ '--fit-w': card.width, ...card.nudge }}
                    src={card.img}
                    alt={card.alt}
                    width="1400"
                    height="1400"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className={styles.engCardBody}>
                  <div className={styles.engCardHead}>
                    <span className={styles.engCardNum}>{card.num}</span>
                    <span className={styles.engCardNumRule} aria-hidden="true" />
                  </div>
                  <h3 className={styles.engCardTitle}>{card.title}</h3>
                  <p className={styles.engCardDesc}>{card.desc}</p>
                  <p className={styles.engCardSpec}>
                    <span className={styles.engCardSpecDot} aria-hidden="true" />
                    {card.spec}
                  </p>
                </div>
              </article>
            ))}
          </div>
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
          <motion.button type="button" onClick={handleCatalogueClick} className={styles.catalogueCtaBtn} {...mag} whileHover={buttonHover} whileTap={buttonTap}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Catalogue
          </motion.button>
        </div>
      </section>

      {/* ── AMBIENT ENVIRONMENTS ─────────────────────────────────── */}
      <AmbientSection />

      {/* ── SMART LIGHTING ───────────────────────────────────────── */}
      <SmartLightingSection />

      {/* ── NEW LAUNCHES (temporarily disabled) ──────────────────── */}
      {false && (
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
              whileHover={{ y: -6, boxShadow: '0 24px 56px rgba(21,21,21,0.16)', transition: { duration: 0.3 } }}
            >
              <div className={styles.launchCardFeatImg}>
                <motion.img
                  src="https://images.pexels.com/photos/3324435/pexels-photo-3324435.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Pendant Pro Series"
                  loading="lazy"
                  decoding="async"
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
                img: 'https://media.istockphoto.com/id/1215074546/photo/controlling-light-bulb-with-mobile-device.jpg?s=612x612&w=0&k=20&c=sz-8_kbsCsaAKLCfsgFFu4SSyONwwMrNA38JXdoFJOc=',
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
                whileHover={{ y: -5, boxShadow: '0 18px 42px rgba(255,157,28,0.12)', transition: { duration: 0.25 } }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={styles.launchCardImgWrap}>
                  <motion.img
                    src={card.img}
                    alt={card.title}
                    loading="lazy"
                    decoding="async"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div className={styles.launchCardImgOverlay} />
                  <motion.span
                    className={styles.launchBadge}
                    animate={{ boxShadow: ['0 2px 10px rgba(255,157,28,0.35)', '0 2px 18px rgba(255,157,28,0.55)', '0 2px 10px rgba(255,157,28,0.35)'] }}
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
              whileHover={{ y: -3, boxShadow: '0 10px 28px rgba(21,21,21,0.28)' }}
              whileTap={{ scale: 0.96 }}
            >
              View All Products
              <motion.svg
                width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </motion.svg>
            </motion.button>
          </motion.div>
        </motion.section>
      )}

      <Footer />

      <LeadCaptureModal
        open={showCatalogueModal}
        onClose={() => setShowCatalogueModal(false)}
        onSuccess={handleCatalogueLeadSuccess}
      />

    </div>
  );
}
