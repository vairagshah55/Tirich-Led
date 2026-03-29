import { useRef, useCallback, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import styles from './SmartLightingSection.module.css';
import { MOTION_EASE, buttonTap } from '../../utils/motion';

const ROOM_IMAGE   = 'https://images.pexels.com/photos/34940802/pexels-photo-34940802.jpeg?auto=compress&cs=tinysrgb&w=1600';
const PHONE_IMAGE  = 'https://images.pexels.com/photos/35490265/pexels-photo-35490265.jpeg?auto=compress&cs=tinysrgb&w=800';
const SWITCH_IMAGE = 'https://images.pexels.com/photos/17005389/pexels-photo-17005389.jpeg?auto=compress&cs=tinysrgb&w=800';

const MODES = [
  {
    id: 'mobile',
    label: 'Mobile App',
    eyebrow: 'Phone-first control',
    title: 'Every room.\nOne screen.',
    body: 'Dim, group, and scene your fittings from anywhere — without touching a wall plate. Full control lives in your pocket.',
    accent: '#F7941E',
    chips: ['Scene Control', 'Dimming', 'Schedules'],
    metric: 'iOS + Android',
    bestFor: 'Homes · Hospitality',
  },
  {
    id: 'remote',
    label: 'Wireless Remote',
    eyebrow: 'Scene recall in one tap',
    title: 'Cleaner walls.\nInstant scenes.',
    body: 'Hotel suites, living rooms, and retail spaces get premium ambience without a single visible switch on the wall.',
    accent: '#F7941E',
    chips: ['One Tap', 'Wireless', 'Instant'],
    metric: '3-zone recall',
    bestFor: 'Lounges · Retail',
  },
  {
    id: 'auto',
    label: 'Automation',
    eyebrow: 'Schedules & voice',
    title: 'Lights that\nthink ahead.',
    body: 'Time-based routines, occupancy triggers, and voice commands all run quietly. The room responds before you ask.',
    accent: '#F7941E',
    chips: ['Timers', 'Motion Sensing', 'Voice-ready'],
    metric: '24/7 routines',
    bestFor: 'Retail · Smart Homes',
  },
];

const STATS = [
  { value: '50K', unit: 'hrs', label: 'Lifespan' },
  { value: 'CRI', unit: '95+', label: 'Colour Accuracy' },
  { value: 'IP65', unit: '', label: 'Weather Rated' },
];

/* Animated floating number counter */
function Counter({ to, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const num = parseInt(to, 10);
    if (isNaN(num)) return;
    let frame;
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      observer.disconnect();
      let start = null;
      const tick = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1400, 1);
        setVal(Math.round(p * num));
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [to]);
  return <span ref={ref}>{isNaN(parseInt(to, 10)) ? to : val}{suffix}</span>;
}

/* 3D tilt hook for image card */
function useTilt(strength = 12) {
  const rotX = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  const rotY = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  const onMove = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - r.top)  / r.height - 0.5;
    const y = (e.clientX - r.left) / r.width  - 0.5;
    rotX.set(-x * strength);
    rotY.set(y * strength);
  }, [rotX, rotY, strength]);
  const onLeave = useCallback(() => { rotX.set(0); rotY.set(0); }, [rotX, rotY]);
  return { rotX, rotY, onMove, onLeave };
}

export default function SmartLightingSection() {
  const [active, setActive] = useState('mobile');
  const sectionRef = useRef(null);
  const mode = MODES.find(m => m.id === active) || MODES[0];
  const activeIdx = MODES.findIndex(m => m.id === active);
  const { rotX, rotY, onMove: tiltMove, onLeave: tiltLeave } = useTilt(8);

  /* Mouse spotlight on white bg */
  const onSectionMove = useCallback((e) => {
    if (!sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    sectionRef.current.style.setProperty('--mx', `${e.clientX - r.left}px`);
    sectionRef.current.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, []);
  const onSectionLeave = useCallback(() => {
    sectionRef.current?.style.setProperty('--mx', '-999px');
    sectionRef.current?.style.setProperty('--my', '-999px');
  }, []);

  /* Stagger variants */
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden:  { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: MOTION_EASE } },
  };

  return (
    <section
      ref={sectionRef}
      id="smart-lighting"
      className={styles.section}
      style={{ '--mode-accent': mode.accent }}
      onMouseMove={onSectionMove}
      onMouseLeave={onSectionLeave}
    >
      {/* Decorative background orbs */}
      <div className={styles.orbOrange} aria-hidden />
      <div className={styles.orbNavy}   aria-hidden />

      {/* Mouse spotlight */}
      <div className={styles.spotlight} aria-hidden />

      {/* Orange top-stripe */}
      <div className={styles.topStripe} aria-hidden />

      {/* ── Header ── */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: MOTION_EASE }}
      >
        <div className={styles.headerInner}>
          <div>
            <p className={styles.eyebrow}>
              <motion.span
                className={styles.eyebrowDot}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              Smart Lighting
            </p>
            <h2 className={styles.title}>No wall switch<br />required.</h2>
            <p className={styles.lead}>
              Mobile, remote, and automation scenes — all controlling
              your Tirich LED fittings invisibly.
            </p>
          </div>
          <span className={styles.ghostNum} aria-hidden>04</span>
        </div>
      </motion.div>

      {/* ── Stats strip ── */}
      <motion.div
        className={styles.statsStrip}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, delay: 0.15, ease: MOTION_EASE }}
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            className={styles.statBox}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 + i * 0.08, ease: MOTION_EASE }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
          >
            <span className={styles.statVal}>
              <Counter to={s.value} suffix={s.unit} />
            </span>
            <span className={styles.statLabel}>{s.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Body ── */}
      <div className={styles.body}>

        {/* ── Left ── */}
        <motion.div
          className={styles.copy}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* Segmented mode control */}
          <motion.div className={styles.segControl} variants={itemVariants}>
            {/* Sliding pill */}
            <motion.span
              className={styles.segPill}
              style={{ background: mode.accent }}
              initial={false}
              animate={{ x: `calc(${activeIdx * 100}% + ${activeIdx * 2}px)` }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            />
            {MODES.map((m) => (
              <button
                key={m.id}
                className={`${styles.segBtn}${m.id === active ? ` ${styles.segBtnActive}` : ''}`}
                onClick={() => setActive(m.id)}
              >
                {m.label}
              </button>
            ))}
          </motion.div>

          {/* Copy panel — cross-fades on switch */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode.id}
              className={styles.modeCopy}
              initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
              exit={{    opacity: 0, y: -14, filter: 'blur(6px)' }}
              transition={{ duration: 0.32, ease: MOTION_EASE }}
            >
              <p className={styles.modeEyebrow}>{mode.eyebrow}</p>
              <h3 className={styles.modeTitle}>
                {mode.title.split('\n').map((line, i) => (
                  <span key={i} className={styles.modeTitleLine}>{line}</span>
                ))}
              </h3>
              <p className={styles.modeBody}>{mode.body}</p>

              <div className={styles.modeStats}>
                <div className={styles.modeStat}>
                  <span className={styles.modeStatLabel}>Primary control</span>
                  <strong className={styles.modeStatVal} style={{ color: mode.accent }}>
                    {mode.metric}
                  </strong>
                </div>
                <div className={styles.modeStat}>
                  <span className={styles.modeStatLabel}>Best for</span>
                  <strong className={styles.modeStatVal}>{mode.bestFor}</strong>
                </div>
              </div>

              <div className={styles.modeChips}>
                {mode.chips.map((chip, i) => (
                  <motion.span
                    key={chip}
                    className={styles.modeChip}
                    style={{ borderColor: `${mode.accent}50`, color: mode.accent }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.06, type: 'spring', stiffness: 400 }}
                  >
                    {chip}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* CTA */}
          <motion.div className={styles.ctaRow} variants={itemVariants}>
            <Link to="/smart-lighting" className={styles.ctaBtn}>
              <span className={styles.ctaBtnShimmer} aria-hidden />
              View More
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
            <p className={styles.ctaMeta}>Explore the full interactive demo</p>
          </motion.div>
        </motion.div>

        {/* ── Right: visuals ── */}
        <motion.div
          className={styles.visuals}
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.12, ease: MOTION_EASE }}
        >
          {/* 3D tilt room image */}
          <motion.div
            className={styles.roomCard}
            style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 900 }}
            onMouseMove={tiltMove}
            onMouseLeave={tiltLeave}
            whileTap={buttonTap}
          >
            <img
              src={ROOM_IMAGE}
              alt="Smart LED lighting — modern interior"
              className={styles.roomImg}
              loading="lazy"
            />

            {/* Animated colour aura on image — shifts with mode */}
            <motion.div
              className={styles.roomAura}
              animate={{
                background: `radial-gradient(ellipse 65% 55% at 72% 38%, ${mode.accent}38 0%, transparent 65%)`,
              }}
              transition={{ duration: 0.8, ease: MOTION_EASE }}
            />
            <div className={styles.roomOverlay} />

            {/* Top badge */}
            <motion.div
              className={styles.roomBadge}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className={styles.roomBadgeDot} style={{ background: mode.accent }} />
              No switch needed
            </motion.div>

            {/* Live panel — swaps on mode change */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode.id}
                className={styles.livePanel}
                initial={{ opacity: 0, scale: 0.94, y: 10 }}
                animate={{ opacity: 1, scale: 1,    y: 0  }}
                exit={{    opacity: 0, scale: 0.94, y: 8  }}
                transition={{ duration: 0.28, ease: MOTION_EASE }}
              >
                <div className={styles.livePanelTop}>
                  <span className={styles.livePanelEye}>Active system</span>
                  <motion.span
                    className={styles.livePanelDot}
                    animate={{
                      background: mode.accent,
                      boxShadow: `0 0 0 3px ${mode.accent}30`,
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <p className={styles.livePanelMode}>{mode.label}</p>
                <div className={styles.livePanelChips}>
                  {mode.chips.map((chip) => (
                    <span key={chip} className={styles.livePanelChip}>{chip}</span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Sub cards row */}
          <div className={styles.subCards}>
            {[
              { src: PHONE_IMAGE,  tag: 'Mobile App',       title: 'Full room control from your phone',   delay: 0.22 },
              { src: SWITCH_IMAGE, tag: 'Wireless Remote',  title: 'Scene recall in a single tap',        delay: 0.30, pulse: true },
            ].map((card) => (
              <motion.div
                key={card.tag}
                className={styles.subCard}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: card.delay, ease: MOTION_EASE }}
                whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(247,148,30,0.16)', transition: { duration: 0.22 } }}
              >
                {card.pulse && (
                  <>
                    {[60, 90, 120].map((sz, i) => (
                      <motion.span
                        key={sz}
                        className={styles.pulseRing}
                        style={{ width: sz, height: sz, top: 28, left: '50%', transform: 'translateX(-50%)' }}
                        animate={{ opacity: [0.5, 0, 0.5], scale: [0.85, 1.6, 0.85] }}
                        transition={{ duration: 2.8, delay: i * 0.7, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    ))}
                  </>
                )}
                <div className={styles.subCardImgWrap}>
                  <img src={card.src} alt={card.tag} className={styles.subCardImg} loading="lazy" />
                  <div className={styles.subCardImgOverlay} />
                </div>
                <div className={styles.subCardBody}>
                  <span className={styles.subCardTag}>{card.tag}</span>
                  <p className={styles.subCardTitle}>{card.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Bottom meta ── */}
      <div className={styles.meta}>
        <span className={styles.metaLeft}>
          <motion.span
            className={styles.metaDot}
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          Smart Lighting · {MODES.length} control methods
        </span>
        <span className={styles.metaRight}>Tirich LED Smart Series</span>
      </div>
    </section>
  );
}
