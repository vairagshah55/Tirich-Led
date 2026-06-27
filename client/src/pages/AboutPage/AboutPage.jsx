import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import Navbar from '../../components/Navbar/Navbar';
import styles from './AboutPage.module.css';
import Footer from '../../components/Footer/Footer';
import brandFilm from '../../assets/videos/Tirich Brand Film.mp4';

const EASE = [0.22, 1, 0.36, 1];
const QUART_OUT = [0.25, 1, 0.5, 1];
const REVEAL = { once: true, amount: 0.2 }; // triggers at 20% visible, never resets

const JOURNEY = [
  {
    year: '2020',
    title: 'Lighting the Way',
    body: 'Tirich LED founded with a precise focus on commercial-grade panel lighting for the Indian market — built on a commitment to photometric accuracy from day one.',
    type: 'director',
    name: 'Prataprai Manshani',
    role: 'Founder & Chairman',
    image: 'https://images.pexels.com/photos/28426637/pexels-photo-28426637.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    year: '2021',
    title: 'Expanding the Range',
    body: 'Grew from a single category to a comprehensive portfolio — industrial high-bay fixtures, strip LEDs, and custom CCT solutions serving architects and contractors nationwide.',
    type: 'company',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
    caption: 'R&D and product engineering team',
  },
  {
    year: '2022',
    title: 'Certified Excellence',
    body: 'Achieved CE and RoHS international certifications. Launched the IP65-rated tri-proof and high-bay series for demanding industrial environments.',
    type: 'company',
    image: 'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=600',
    caption: 'Quality testing and certification lab',
  },
  {
    year: '2023',
    title: 'Architectural Vision',
    body: 'Entered the architectural lighting segment with pendant and recessed downlight collections. Jitendra Manshani leads the expansion into hospitality and premium commercial interiors.',
    type: 'director',
    name: 'Jitendra Manshani',
    role: 'Managing Director',
    image: 'https://images.pexels.com/photos/8382594/pexels-photo-8382594.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    year: '2024',
    title: 'Complete Ecosystem',
    body: 'Launched a 500+ SKU catalogue spanning every lighting application. Established pan-India distributor partnerships and a dedicated QA division.',
    type: 'team',
    image: 'https://images.pexels.com/photos/9301252/pexels-photo-9301252.jpeg?auto=compress&cs=tinysrgb&w=600',
    caption: 'The Tirich LED team — engineering, sales, and quality',
  },
];

const PANELS = [
  {
    id: 'quality',
    tab: 'Quality',
    icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    eyebrow: 'Manufacturing Excellence',
    title: 'Every Unit Tested. Every Batch Certified.',
    body: 'Our quality process runs alongside every stage of manufacturing. Each production batch undergoes systematic verification — from component selection and assembly to photometric testing and certification.',
    stat: '100%',
    statLabel: 'Tested',
    specs: [
      'IEC and CE safety certifications',
      'In-house photometric testing (lumen, CRI, CCT)',
      'Thermal cycling and lifespan testing',
      '100% driver burn-in before shipping',
    ],
  },
  {
    id: 'engineering',
    tab: 'Engineering',
    icon: <><circle cx="12" cy="12" r="4"/><path d="M12 2L12 6M12 18L12 22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12L6 12M18 12L22 12"/></>,
    eyebrow: 'Precision Engineering',
    title: 'Designed for Performance. Built to Last.',
    body: 'Every component — from SMD chipsets to thermal substrates — is selected to strict tolerances. Our R&D team continuously refines optic designs, CCT options, and driver configurations.',
    stat: 'CRI 95+',
    statLabel: 'Accuracy',
    specs: [
      'CRI 95+ colour accuracy across all lines',
      'Custom CCT and wattage configurations',
      'Advanced thermal management design',
      'L80 rated 50,000-hour lifespan',
    ],
  },
  {
    id: 'sustainability',
    tab: 'Sustainability',
    icon: <><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M7 12l3 3 7-7"/></>,
    eyebrow: 'Responsible Manufacturing',
    title: 'Less Waste. Higher Standards.',
    body: 'We operate under an ISO-aligned quality framework, minimising production waste while meeting international RoHS and CE directives across every product line we manufacture.',
    stat: 'IP65',
    statLabel: 'Rated',
    specs: [
      'RoHS compliant materials and processes',
      'Energy-efficient production workflow',
      'Recyclable aluminium housing and packaging',
      'Reduced carbon footprint per unit shipped',
    ],
  },
];

const PARTICLES = [
  { size: 6, x: '12%', y: '18%', dur: 4.2, delay: 0 },
  { size: 4, x: '88%', y: '25%', dur: 3.6, delay: 0.8 },
  { size: 8, x: '75%', y: '72%', dur: 5.0, delay: 0.4 },
  { size: 5, x: '22%', y: '82%', dur: 3.8, delay: 1.2 },
  { size: 3, x: '65%', y: '12%', dur: 4.5, delay: 0.6 },
  { size: 6, x: '42%', y: '90%', dur: 3.4, delay: 1.0 },
];

export default function AboutPage() {
  const [activePanel, setActivePanel] = useState(0);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const journeyRef = useRef(null);

  // Scroll parallax for video section
  const { scrollYProgress: videoProgress } = useScroll({ target: videoRef, offset: ['start end', 'end start'] });
  const videoY = useTransform(videoProgress, [0, 1], [40, -40]);
  const videoScale = useTransform(videoProgress, [0, 0.3, 1], [0.96, 1, 1]);
  const videoOpacity = useTransform(videoProgress, [0, 0.15, 0.85, 1], [0.4, 1, 1, 0.4]);

  // Scroll parallax for journey section
  const { scrollYProgress: journeyProgress } = useScroll({ target: journeyRef, offset: ['start end', 'end start'] });
  const journeyY = useTransform(journeyProgress, [0, 1], [30, -30]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePanel((prev) => (prev + 1) % PANELS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activePanel]);

  const selectPanel = useCallback((idx) => {
    setActivePanel(idx);
  }, []);

  // Mouse spotlight
  const onMove = useCallback((e) => {
    if (!sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    sectionRef.current.style.setProperty('--mx', `${e.clientX - r.left}px`);
    sectionRef.current.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, []);

  const onLeave = useCallback(() => {
    if (!sectionRef.current) return;
    sectionRef.current.style.setProperty('--mx', '-999px');
    sectionRef.current.style.setProperty('--my', '-999px');
  }, []);

  const panel = PANELS[activePanel];

  return (
    <div className={styles.page}>
      <Navbar />

      {/* ── HERO INTRO ──────────────────────────────────────────── */}
      <motion.section
        className={styles.heroIntro}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: QUART_OUT }}
      >
        <div className={styles.heroIntroOrb} aria-hidden />
        <div className={styles.heroIntroStripe} aria-hidden />
        <p className={styles.eyebrow}>
          <motion.span
            className={styles.eyebrowDot}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          About Tirich LED
        </p>
        <h1 className={styles.heroIntroTitle}>
          Built on Precision. <span className={styles.heroIntroAccent}>Driven by Light.</span>
        </h1>
        <p className={styles.heroIntroLead}>
          Since 2020, Tirich LED has been manufacturing industrial-grade LED lighting
          solutions for commercial, residential, and architectural applications —
          engineered for performance, longevity, and reliability.
        </p>
      </motion.section>

      {/* ── VIDEO + SWIPEABLE CONTENT ───────────────────────────── */}
      <motion.section
        ref={(el) => { sectionRef.current = el; videoRef.current = el; }}
        className={styles.videoSection}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ opacity: videoOpacity }}
      >
        {/* Decorative layers */}
        <motion.div className={styles.videoOrb} style={{ y: videoY }} aria-hidden />
        <div className={styles.videoOrbNavy} aria-hidden />
        <div className={styles.videoStripe} aria-hidden />
        <div className={styles.videoSpotlight} aria-hidden />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className={styles.particle}
            style={{ width: p.size, height: p.size, left: p.x, top: p.y }}
            animate={{ y: [0, -14, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          />
        ))}

        <motion.div className={styles.videoInner} style={{ y: videoY, scale: videoScale }}>
          {/* Left — YouTube embed with floating badge */}
          <motion.div
            className={styles.videoWrap}
            initial={{ opacity: 0, x: -30, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className={styles.videoEmbed}>
              <video
                src={brandFilm}
                title="Tirich Brand Film"
                controls
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
              <div className={styles.videoShimmer} aria-hidden />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={panel.id}
                className={styles.videoBadge}
                initial={{ opacity: 0, scale: 0.85, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -6 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <span className={styles.videoBadgeVal}>{panel.stat}</span>
                <span className={styles.videoBadgeLabel}>{panel.statLabel}</span>
              </motion.div>
            </AnimatePresence>

            <div className={styles.videoMeta}>
              <motion.span
                className={styles.videoDot}
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              Watch our manufacturing process
            </div>
          </motion.div>

          {/* Right — swipeable content panels */}
          <motion.div
            className={styles.videoContent}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            <div className={styles.panelTabs}>
              {PANELS.map((p, i) => (
                <motion.button
                  key={p.id}
                  className={`${styles.panelTab}${i === activePanel ? ` ${styles.panelTabActive}` : ''}`}
                  onClick={() => selectPanel(i)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <svg className={styles.panelTabIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {p.icon}
                  </svg>
                  {p.tab}
                </motion.button>
              ))}
              <motion.div
                className={styles.panelTabIndicator}
                initial={false}
                animate={{ x: `${activePanel * 100}%` }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                style={{ width: `${100 / PANELS.length}%` }}
              />
              <div className={styles.panelProgress} key={activePanel}>
                <div className={styles.panelProgressFill} />
              </div>
            </div>

            <div className={styles.panelCounter}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={activePanel}
                  className={styles.panelCounterNum}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  0{activePanel + 1}
                </motion.span>
              </AnimatePresence>
              <span className={styles.panelCounterTotal}> / 0{PANELS.length}</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={panel.id}
                className={styles.panelBody}
                initial={{ opacity: 0, y: 18, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -14, filter: 'blur(5px)' }}
                transition={{ duration: 0.38, ease: EASE }}
              >
                <p className={styles.eyebrow}>
                  <motion.span
                    className={styles.eyebrowDot}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  {panel.eyebrow}
                </p>
                <h2 className={styles.sectionTitle}>{panel.title}</h2>
                <p className={styles.sectionBody}>{panel.body}</p>

                <ul className={styles.specsList}>
                  {panel.specs.map((spec, si) => (
                    <motion.li
                      key={spec}
                      className={styles.specItem}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: 0.08 + si * 0.07, ease: EASE }}
                    >
                      <motion.span
                        className={styles.specCheck}
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.12 + si * 0.07 }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </motion.span>
                      {spec}
                    </motion.li>
                  ))}
                </ul>

                <div className={styles.ctaRow}>
                  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                    <Link to="/products" className={styles.btnPrimary}>
                      View Products
                      <motion.svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                      </motion.svg>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                    <Link to="/contact" className={styles.btnGhost}>Get in Touch</Link>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ── OUR JOURNEY — SVG path draws on scroll ──────────────── */}
      <section ref={journeyRef} className={styles.journey}>
        <motion.div className={styles.journeyOrb} style={{ y: journeyY }} aria-hidden />
        <div className={styles.journeyOrbNavy} aria-hidden />
        <div className={styles.journeyStripe} aria-hidden />

        <motion.div
          className={styles.journeyHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={REVEAL}
          transition={{ duration: 0.6, ease: QUART_OUT }}
        >
          <p className={styles.eyebrow}>
            <motion.span
              className={styles.eyebrowDot}
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            Our Journey
          </p>
          <h2 className={styles.journeyTitle}>Five Years of Measured Progress</h2>
          <p className={styles.journeyLead}>
            From a single product line to a complete lighting ecosystem — built on precision, trust, and relentless quality.
          </p>
        </motion.div>

        <div className={styles.timeline}>
          {/* SVG sinuous path — draws on scroll */}
          <svg className={styles.timelineSvg} viewBox="0 0 60 1000" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F7941E" stopOpacity="0" />
                <stop offset="8%" stopColor="#F7941E" stopOpacity="1" />
                <stop offset="92%" stopColor="#F7941E" stopOpacity="1" />
                <stop offset="100%" stopColor="#F7941E" stopOpacity="0" />
              </linearGradient>
              <filter id="pathGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Ghost track */}
            <path
              d="M30 0 C30 80, 30 120, 30 200 C30 280, 30 320, 30 400 C30 480, 30 520, 30 600 C30 680, 30 720, 30 800 C30 880, 30 920, 30 1000"
              fill="none"
              stroke="rgba(38,34,98,0.06)"
              strokeWidth="2"
            />
            {/* Drawn path — pathLength controlled by scroll */}
            <motion.path
              d="M30 0 C30 80, 30 120, 30 200 C30 280, 30 320, 30 400 C30 480, 30 520, 30 600 C30 680, 30 720, 30 800 C30 880, 30 920, 30 1000"
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#pathGlow)"
              style={{ pathLength: journeyProgress }}
            />
            {/* Glow trail — wider, more diffuse */}
            <motion.path
              d="M30 0 C30 80, 30 120, 30 200 C30 280, 30 320, 30 400 C30 480, 30 520, 30 600 C30 680, 30 720, 30 800 C30 880, 30 920, 30 1000"
              fill="none"
              stroke="rgba(247,148,30,0.15)"
              strokeWidth="8"
              strokeLinecap="round"
              style={{ pathLength: journeyProgress }}
            />
          </svg>

          {JOURNEY.map((item, i) => {
            const isEven = i % 2 === 0;
            // Even: image LEFT, text RIGHT | Odd: text LEFT, image RIGHT
            return (
              <div key={item.year} className={styles.timelineEntry}>

                {/* LEFT side */}
                <div className={styles.entrySide}>
                  {isEven ? (
                    /* Image side */
                    <motion.div
                      className={styles.entryImageCard}
                      initial={{ opacity: 0, x: -50, y: 30 }}
                      whileInView={{ opacity: 1, x: 0, y: 0 }}
                      viewport={REVEAL}
                      transition={{ duration: 0.6, ease: QUART_OUT }}
                      whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(38,34,98,0.1)', transition: { duration: 0.25 } }}
                    >
                      <motion.img
                        src={item.image}
                        alt={item.name || item.caption || item.title}
                        loading="lazy" decoding="async"
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.5, ease: QUART_OUT }}
                      />
                      {item.type === 'director' && (
                        <motion.div
                          className={styles.entryDirectorBadge}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={REVEAL}
                          transition={{ duration: 0.6, delay: 0.25, ease: QUART_OUT }}
                        >
                          <span className={styles.entryDirectorName}>{item.name}</span>
                          <span className={styles.entryDirectorRole}>{item.role}</span>
                        </motion.div>
                      )}
                      {(item.type === 'company' || item.type === 'team') && item.caption && (
                        <motion.div
                          className={styles.entryCaption}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={REVEAL}
                          transition={{ duration: 0.6, delay: 0.25, ease: QUART_OUT }}
                        >
                          {item.caption}
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    /* Text side */
                    <motion.div
                      className={styles.entryTextBlock}
                      initial={{ opacity: 0, x: -50, y: 30 }}
                      whileInView={{ opacity: 1, x: 0, y: 0 }}
                      viewport={REVEAL}
                      transition={{ duration: 0.6, delay: 0.08, ease: QUART_OUT }}
                    >
                      <motion.span className={styles.entryYear} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={REVEAL} transition={{ duration: 0.6, delay: 0.15, ease: QUART_OUT }}>
                        {item.year}
                      </motion.span>
                      <motion.h3 className={styles.entryTitle} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={REVEAL} transition={{ duration: 0.6, delay: 0.2, ease: QUART_OUT }}>
                        {item.title}
                      </motion.h3>
                      <motion.p className={styles.entryBody} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={REVEAL} transition={{ duration: 0.6, delay: 0.28, ease: QUART_OUT }}>
                        {item.body}
                      </motion.p>
                    </motion.div>
                  )}
                </div>

                {/* CENTRE — point */}
                <div className={styles.entryDotCol}>
                  <motion.span
                    className={styles.entryDotRingOuter}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: [1, 2.4, 1], opacity: [0, 0.18, 0] }}
                    viewport={REVEAL}
                    transition={{ duration: 3, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                    aria-hidden
                  />
                  <motion.span
                    className={styles.entryDotRing}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: [1, 1.7, 1], opacity: [0, 0.3, 0] }}
                    viewport={REVEAL}
                    transition={{ duration: 2.5, delay: 0.4, repeat: Infinity, ease: 'easeInOut' }}
                    aria-hidden
                  />
                  <motion.div
                    className={styles.entryIcon}
                    initial={{ scale: 0, rotate: -25 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={REVEAL}
                    transition={{ type: 'spring', stiffness: 220, damping: 10, mass: 0.7, delay: 0.06 }}
                  >
                    {item.type === 'director' ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    ) : item.type === 'team' ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    )}
                  </motion.div>
                </div>

                {/* RIGHT side */}
                <div className={styles.entrySide}>
                  {!isEven ? (
                    /* Image side */
                    <motion.div
                      className={styles.entryImageCard}
                      initial={{ opacity: 0, x: 50, y: 30 }}
                      whileInView={{ opacity: 1, x: 0, y: 0 }}
                      viewport={REVEAL}
                      transition={{ duration: 0.6, ease: QUART_OUT }}
                      whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(38,34,98,0.1)', transition: { duration: 0.25 } }}
                    >
                      <motion.img
                        src={item.image}
                        alt={item.name || item.caption || item.title}
                        loading="lazy" decoding="async"
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.5, ease: QUART_OUT }}
                      />
                      {item.type === 'director' && (
                        <motion.div
                          className={styles.entryDirectorBadge}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={REVEAL}
                          transition={{ duration: 0.6, delay: 0.25, ease: QUART_OUT }}
                        >
                          <span className={styles.entryDirectorName}>{item.name}</span>
                          <span className={styles.entryDirectorRole}>{item.role}</span>
                        </motion.div>
                      )}
                      {(item.type === 'company' || item.type === 'team') && item.caption && (
                        <motion.div
                          className={styles.entryCaption}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={REVEAL}
                          transition={{ duration: 0.6, delay: 0.25, ease: QUART_OUT }}
                        >
                          {item.caption}
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    /* Text side */
                    <motion.div
                      className={styles.entryTextBlock}
                      initial={{ opacity: 0, x: 50, y: 30 }}
                      whileInView={{ opacity: 1, x: 0, y: 0 }}
                      viewport={REVEAL}
                      transition={{ duration: 0.6, delay: 0.08, ease: QUART_OUT }}
                    >
                      <motion.span className={styles.entryYear} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={REVEAL} transition={{ duration: 0.6, delay: 0.15, ease: QUART_OUT }}>
                        {item.year}
                      </motion.span>
                      <motion.h3 className={styles.entryTitle} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={REVEAL} transition={{ duration: 0.6, delay: 0.2, ease: QUART_OUT }}>
                        {item.title}
                      </motion.h3>
                      <motion.p className={styles.entryBody} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={REVEAL} transition={{ duration: 0.6, delay: 0.28, ease: QUART_OUT }}>
                        {item.body}
                      </motion.p>
                    </motion.div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* ── MISSION, VISION & VALUES — combined premium section ── */}
      <section
        className={styles.mvvSection}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--vx', `${e.clientX - r.left}px`);
          e.currentTarget.style.setProperty('--vy', `${e.clientY - r.top}px`);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.setProperty('--vx', '-999px');
          e.currentTarget.style.setProperty('--vy', '-999px');
        }}
      >
        <div className={styles.mvvOrb} aria-hidden />
        <div className={styles.mvvOrbNavy} aria-hidden />
        <div className={styles.mvvStripe} aria-hidden />
        <div className={styles.mvvSpotlight} aria-hidden />

        {/* ── Mission & Vision ── */}
        <motion.div
          className={styles.mvvHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={REVEAL}
          transition={{ duration: 0.6, ease: QUART_OUT }}
        >
          <p className={styles.eyebrow}>
            <motion.span className={styles.eyebrowDot} animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
            What Drives Us
          </p>
          <h2 className={styles.mvvTitle}>Purpose Behind Every Product</h2>
        </motion.div>

        <div className={styles.mvvCards}>
          {[
            {
              label: 'Our Mission', title: 'Engineer with Purpose',
              body: 'To manufacture LED lighting solutions that professionals can specify with absolute confidence — delivering measurable, consistent performance on every project, at every scale.',
              icon: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></>,
              ghostIcon: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></>,
              dir: -50,
            },
            {
              label: 'Our Vision', title: 'Define the Standard',
              body: "To become India's most trusted LED manufacturer by setting the industry benchmark for photometric precision, sustainable production, and uncompromising technical excellence.",
              icon: <><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14z"/></>,
              ghostIcon: <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14z"/>,
              dir: 50,
            },
          ].map((card, ci) => (
            <motion.div
              key={card.label}
              className={styles.mvvCard}
              initial={{ opacity: 0, x: card.dir, y: 30 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={REVEAL}
              transition={{ duration: 0.6, delay: ci * 0.1, ease: QUART_OUT }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              {/* Large ghost icon background */}
              <motion.svg
                className={styles.mvvGhostIcon}
                width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={REVEAL}
                transition={{ duration: 0.8, delay: 0.2 + ci * 0.1, ease: QUART_OUT }}
                aria-hidden
              >
                {card.ghostIcon}
              </motion.svg>

              <div className={styles.mvvCardInner}>
                {/* Animated connector dot between cards */}
                {ci === 0 && (
                  <motion.div
                    className={styles.mvvConnector}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={REVEAL}
                    transition={{ duration: 0.8, delay: 0.4, ease: QUART_OUT }}
                    style={{ transformOrigin: 'left' }}
                    aria-hidden
                  />
                )}
                <motion.div
                  className={styles.mvvIconCircle}
                  initial={{ scale: 0, rotate: -20 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={REVEAL}
                  transition={{ type: 'spring', stiffness: 220, damping: 11, delay: 0.1 + ci * 0.08 }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    {card.icon}
                  </svg>
                </motion.div>
                <motion.span className={styles.mvvLabel} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={REVEAL} transition={{ duration: 0.6, delay: 0.15 + ci * 0.08, ease: QUART_OUT }}>
                  {card.label}
                </motion.span>
                <motion.h3 className={styles.mvvCardTitle} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={REVEAL} transition={{ duration: 0.6, delay: 0.2 + ci * 0.08, ease: QUART_OUT }}>
                  {card.title}
                </motion.h3>
                <motion.div className={styles.mvvDivider} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={REVEAL} transition={{ duration: 0.5, delay: 0.25 + ci * 0.08, ease: QUART_OUT }} style={{ transformOrigin: 'left' }} />
                <motion.p className={styles.mvvCardBody} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={REVEAL} transition={{ duration: 0.6, delay: 0.3 + ci * 0.08, ease: QUART_OUT }}>
                  {card.body}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Core Values ── */}
        <motion.div
          className={styles.mvvValuesHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={REVEAL}
          transition={{ duration: 0.6, ease: QUART_OUT }}
        >
          <p className={styles.eyebrow}>
            <motion.span className={styles.eyebrowDot} animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
            Core Values
          </p>
          <h2 className={styles.mvvTitle}>What We Stand For</h2>
        </motion.div>

        <motion.div
          className={styles.mvvValuesGrid}
          initial="hidden"
          whileInView="visible"
          viewport={REVEAL}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {[
            { icon: <><circle cx="12" cy="12" r="4"/><path d="M12 2L12 6M12 18L12 22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12L6 12M18 12L22 12"/></>, title: 'Precision Engineering', body: 'Every component to strict tolerances — nothing ships without photometric and electrical verification.' },
            { icon: <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>, title: 'Sustainable Manufacturing', body: 'ISO-aligned framework, minimising waste across RoHS and CE compliant product lines.' },
            { icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></>, title: 'Client Partnership', body: 'Direct collaboration with architects, contractors, and facility managers end-to-end.' },
            { icon: <><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></>, title: 'Continuous Innovation', body: 'R&D continuously refining CCT, optics, and driver specs to stay ahead.' },
            { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>, title: 'Integrity First', body: 'Real data, verified ratings, third-party certificates — no inflated specs.' },
            { icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>, title: 'Technical Excellence', body: 'CRI 95+, L80 50K hrs, IP65 — measured, documented, certified outcomes.' },
          ].map((v, i) => (
            <motion.article
              key={v.title}
              className={styles.mvvValueCard}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: QUART_OUT } },
              }}
              whileHover={{ y: -5, borderColor: 'rgba(247,148,30,0.3)', transition: { duration: 0.22 } }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.span
                className={styles.mvvValueIcon}
                variants={{
                  hidden: { scale: 0, rotate: -25 },
                  visible: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 240, damping: 11 } },
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{v.icon}</svg>
              </motion.span>
              <span className={styles.mvvValueNum}>0{i + 1}</span>
              <h3 className={styles.mvvValueTitle}>{v.title}</h3>
              <p className={styles.mvvValueBody}>{v.body}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* ── TRUSTED & CERTIFIED ─────────────────────────────────── */}
      <section className={styles.certSection}>
        <div className={styles.certStripe} aria-hidden />

        {/* Header */}
        <motion.div
          className={styles.certHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={REVEAL}
          transition={{ duration: 0.6, ease: QUART_OUT }}
        >
          <p className={styles.eyebrow}>
            <motion.span className={styles.eyebrowDot} animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
            Trusted & Certified
          </p>
          <h2 className={styles.certTitle}>BIS Approved. Globally Compliant.</h2>
          <p className={styles.certLead}>
            Every product meets national and international safety, performance, and environmental standards — verified in-house before dispatch.
          </p>
        </motion.div>

        {/* Cert badge cards */}
        <motion.div
          className={styles.certGrid}
          initial="hidden"
          whileInView="visible"
          viewport={REVEAL}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {[
            { code: 'BIS', name: 'Bureau of Indian Standards', icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/> },
            { code: 'CE', name: 'European Conformity', icon: <><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></> },
            { code: 'RoHS', name: 'Hazardous Substance Free', icon: <><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M8 12l3 3 5-5"/></> },
            { code: 'IP65', name: 'Ingress Protection', icon: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></> },
            { code: 'IEC', name: 'Electrotechnical Commission', icon: <><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></> },
            { code: 'ISO', name: 'Quality Management', icon: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></> },
          ].map((cert) => (
            <motion.div
              key={cert.code}
              className={styles.certCard}
              variants={{
                hidden: { opacity: 0, y: 24, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: QUART_OUT } },
              }}
              whileHover={{ y: -4, transition: { duration: 0.22 } }}
            >
              <motion.div
                className={styles.certCardIcon}
                variants={{
                  hidden: { scale: 0, rotate: -20 },
                  visible: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 260, damping: 14 } },
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{cert.icon}</svg>
              </motion.div>
              <span className={styles.certCardCode}>{cert.code}</span>
              <span className={styles.certCardName}>{cert.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats strip */}
        <motion.div
          className={styles.certStats}
          initial="hidden"
          whileInView="visible"
          viewport={REVEAL}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
        >
          {[
            { val: '100%', label: 'Units Tested', bar: 100 },
            { val: '0%', label: 'Defect Tolerance', bar: 100 },
            { val: '6+', label: 'Active Certifications', bar: 85 },
            { val: '50K+', label: 'Units Shipped', bar: 92 },
          ].map((s) => (
            <motion.div
              key={s.label}
              className={styles.certStat}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: QUART_OUT } } }}
            >
              <div className={styles.certStatTop}>
                <span className={styles.certStatVal}>{s.val}</span>
                <span className={styles.certStatLabel}>{s.label}</span>
              </div>
              <div className={styles.certStatBar}>
                <motion.div
                  className={styles.certStatBarFill}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.bar}%` }}
                  viewport={REVEAL}
                  transition={{ duration: 0.8, delay: 0.2, ease: QUART_OUT }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className={styles.certCta}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={REVEAL}
          transition={{ duration: 0.6, delay: 0.15, ease: QUART_OUT }}
        >
          <Link to="/contact" className={styles.btnPrimary}>
            Request Certificates
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
          <Link to="/products" className={styles.btnGhost}>View Products</Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
