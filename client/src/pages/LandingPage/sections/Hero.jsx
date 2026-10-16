import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import Icon from '../../../components/Icon/Icon';
import { isPrerendering, prefersReducedMotion } from '../../../utils/browser';
import { HERO } from '../homeContent';
import { CountUp, EASE, item, useMagnetic } from '../homeMotion';
import ui from '../LandingPage.module.css';
import styles from './Hero.module.css';

// How long each featured range holds before the highlight moves on. Must
// match the --cycle duration in Hero.module.css (the progress hairline).
const CYCLE_MS = 3600;

export default function Hero({ onNavigate }) {
  const sectionRef = useRef(null);
  // Only cycle (and only track the pointer) while the hero is on screen.
  const onScreen = useInView(sectionRef);
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const magnetic = useMagnetic();

  // ── Scroll exit: the copy sinks and dims as the hero scrolls away ────
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const exitY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 140]);
  const exitOpacity = useTransform(scrollYProgress, [0, 0.85], [1, reduceMotion ? 1 : 0.15]);

  // ── Featured-range highlight: steps on its own until someone points ──
  useEffect(() => {
    if (!onScreen || held || isPrerendering() || prefersReducedMotion()) return undefined;
    const t = setTimeout(() => setActive((i) => (i + 1) % HERO.featured.length), CYCLE_MS);
    return () => clearTimeout(t);
  }, [active, held, onScreen]);

  // ── Pointer → CSS custom properties, one write per frame ────────────
  // --px/--py light the LED dot-grid around the cursor; --mx/--my (-0.5…0.5)
  // tilt the product card and drift the glow. CSS does the rest.
  const ptr = useRef({ x: 0, y: 0, raf: 0 });
  useEffect(() => () => cancelAnimationFrame(ptr.current.raf), []);

  const onPointerMove = useCallback((e) => {
    if (e.pointerType === 'touch' || prefersReducedMotion()) return;
    const el = sectionRef.current;
    if (!el) return;
    ptr.current.x = e.clientX;
    ptr.current.y = e.clientY;
    if (ptr.current.raf) return;
    ptr.current.raf = requestAnimationFrame(() => {
      ptr.current.raf = 0;
      const r = el.getBoundingClientRect();
      const x = ptr.current.x - r.left;
      const y = ptr.current.y - r.top;
      el.style.setProperty('--px', `${x}px`);
      el.style.setProperty('--py', `${y}px`);
      el.style.setProperty('--mx', (x / r.width - 0.5).toFixed(3));
      el.style.setProperty('--my', (y / r.height - 0.5).toFixed(3));
      el.dataset.pointer = 'on';
    });
  }, []);

  const onPointerLeave = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.style.setProperty('--mx', '0');
    el.style.setProperty('--my', '0');
    el.dataset.pointer = 'off';
  }, []);

  const go = (target) => (e) => {
    e.preventDefault();
    onNavigate(target);
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={styles.hero}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {/* The orange slash from the logo, writ large, plus the LED dot-grid. */}
      <div className={styles.beam} aria-hidden="true" />
      <div className={styles.beam2} aria-hidden="true" />
      <div className={styles.dots} aria-hidden="true" />
      <div className={styles.dotsLit} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <motion.div className={styles.content} style={{ y: exitY, opacity: exitOpacity }}>
        <div className={styles.left}>
          <motion.div
            className={styles.kicker}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
          >
            <span className={styles.kickerDot} aria-hidden="true" />
            <span className={styles.kickerText}>{HERO.kicker}</span>
          </motion.div>

          {/* The page's one <h1>. The visible headline is the design's; the
              brand + "LED light manufacturer in Surat" phrase that the
              homepage ranks for leads it for crawlers and screen readers
              (the SEO audit requires the brand inside the h1). */}
          <h1 className={styles.title}>
            <span className="visually-hidden">Tirich LED — LED light manufacturer in Surat, India. </span>
            {HERO.titleLines.map((line, i) => (
              // The space keeps the two lines two words apart in the text
              // that crawlers and screen readers get ("lighting built").
              <span key={line} className={styles.lineMask}>
                {i > 0 && ' '}
                <motion.span
                  className={i === 1 ? styles.line2 : styles.line}
                  initial={{ y: '108%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1, delay: 0.15 + i * 0.13, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className={styles.sub}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.42, ease: EASE }}
          >
            {HERO.sub}
          </motion.p>

          <motion.div
            className={styles.btns}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.52, ease: EASE }}
          >
            <a
              href="#products"
              className={`${ui.btn} ${ui.btnOrange} ${ui.sweep} ${ui.magnetic}`}
              onClick={go({ section: 'products' })}
              {...magnetic}
            >
              {HERO.primaryCta} <span className={ui.arrow} aria-hidden="true">→</span>
            </a>
            <a
              href="#connect"
              className={`${ui.btn} ${ui.btnGhostDark}`}
              onClick={go({ section: 'connect', audience: 'dealer' })}
            >
              {HERO.ghostCta}
            </a>
          </motion.div>

          <motion.dl
            className={styles.stats}
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.62 } } }}
          >
            {HERO.stats.map((s) => (
              <motion.div key={s.label} className={styles.stat} variants={item}>
                <dt className={styles.statL}>{s.label}</dt>
                <dd className={styles.statN}>
                  <CountUp value={s.value} />
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          className={styles.right}
          initial={{ opacity: 0, x: 48 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
        >
          <div
            className={`${styles.card}${held ? ` ${styles.cardHeld}` : ''}`}
            onMouseEnter={() => setHeld(true)}
            onMouseLeave={() => setHeld(false)}
            onFocus={() => setHeld(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false);
            }}
          >
            <p className={styles.cardLabel}>{HERO.featuredLabel}</p>
            <ul className={styles.list}>
              {HERO.featured.map((f, i) => {
                const on = i === active;
                return (
                  <li key={f.name}>
                    <Link
                      to={f.to}
                      className={`${styles.product}${on ? ` ${styles.productOn}` : ''}`}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                    >
                      {on && (
                        <motion.span
                          layoutId="heroRangeHighlight"
                          className={styles.highlight}
                          transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                          aria-hidden="true"
                        >
                          <span key={active} className={styles.cycle} />
                        </motion.span>
                      )}
                      <span className={styles.icon}>
                        <Icon name={f.icon} size={22} />
                      </span>
                      <span className={styles.productText}>
                        <span className={styles.productName}>{f.name}</span>
                        <span className={styles.productSpec}>{f.spec}</span>
                      </span>
                      <span className={styles.productArrow} aria-hidden="true">→</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
