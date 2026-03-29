import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '../../components/Navbar/Navbar';
import styles from './AboutPage.module.css';

const EASE = [0.22, 1, 0.36, 1];

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

      <section
        ref={sectionRef}
        className={styles.videoSection}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {/* Decorative layers */}
        <div className={styles.videoOrb} aria-hidden />
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

        <div className={styles.videoInner}>
          {/* Left — YouTube embed with floating badge */}
          <motion.div
            className={styles.videoWrap}
            initial={{ opacity: 0, x: -30, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className={styles.videoEmbed}>
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Tirich LED — Manufacturing Excellence"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              {/* Shimmer border */}
              <div className={styles.videoShimmer} aria-hidden />
            </div>

            {/* Floating stat badge on video */}
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
            {/* Tab bar with icons */}
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

            {/* Panel counter */}
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

            {/* Animated panel content */}
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
                      <motion.svg
                        width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      >
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
        </div>
      </section>
    </div>
  );
}
