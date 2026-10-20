import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import Icon from '../../../components/Icon/Icon';
import { AUDIENCES, CONNECT } from '../homeContent';
import { EASE, group, item, reveal, useSpotlight } from '../homeMotion';
import ui from '../LandingPage.module.css';
import styles from './Audience.module.css';

const SPRING = { type: 'spring', stiffness: 420, damping: 38 };

// Panel choreography: the visual card settles in, then the copy, then the
// feature list ticks down. Every panel stays mounted (hidden when inactive)
// so all five audiences are in the pre-rendered HTML; these variants replay
// whenever a panel becomes the active one.
const panelVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const visualVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 12 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, staggerChildren: 0.05, delayChildren: 0.15 },
  },
};

// The downlight switches on the way an LED driver does: a catch, a dip,
// then full output.
const beamVariants = {
  hidden: { opacity: 0 },
  show: { opacity: [0, 0.9, 0.45, 1], transition: { duration: 0.9, times: [0, 0.3, 0.5, 1], delay: 0.2 } },
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -12 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 260, damping: 18 } },
};

const riseVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

// Where the downlight sits, as a fraction of the card's width. Passed to CSS
// as --lamp-x so the beam's pivot and the aim maths agree.
const LAMP_X = 0.64;
const MAX_AIM = 26;

// Swing the beam toward the pointer, pivoting at the lamp.
function aimBeam(e) {
  if (e.pointerType === 'touch') return;
  const card = e.currentTarget;
  const r = card.getBoundingClientRect();
  const dx = e.clientX - r.left - r.width * LAMP_X;
  const dy = Math.max(e.clientY - r.top, 40);
  const deg = (-Math.atan2(dx, dy) * 180) / Math.PI;
  card.style.setProperty('--aim', `${Math.max(-MAX_AIM, Math.min(MAX_AIM, deg)).toFixed(1)}deg`);
}

function releaseBeam(e) {
  e.currentTarget.style.removeProperty('--aim');
}

const pad = (n) => String(n).padStart(2, '0');

const copyVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.12 } },
};

const featureVariants = {
  hidden: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
};

export default function Audience({ active, onChange, onAction }) {
  const listRef = useRef(null);
  const tabRefs = useRef([]);
  const spot = useSpotlight();
  const activeIndex = Math.max(0, AUDIENCES.findIndex((a) => a.id === active));

  // On a phone the tabs scroll sideways; keep the active one centred. This
  // scrolls the tab strip only — never the page, which may itself be
  // mid-scroll towards this section.
  useEffect(() => {
    const list = listRef.current;
    const tab = tabRefs.current[activeIndex];
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({
      left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2,
      behavior: 'smooth',
    });
  }, [activeIndex]);

  // Arrow keys move between tabs (WAI-ARIA tabs pattern, auto-activation).
  const onTabKeyDown = (e) => {
    const last = AUDIENCES.length - 1;
    const next = {
      ArrowRight: activeIndex === last ? 0 : activeIndex + 1,
      ArrowLeft: activeIndex === 0 ? last : activeIndex - 1,
      Home: 0,
      End: last,
    }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    onChange(AUDIENCES[next].id);
    tabRefs.current[next]?.focus();
  };

  const renderAction = (cta, primary) => {
    const className = primary
      ? `${ui.btn} ${ui.btnNavy} ${ui.sweep}`
      : `${ui.btn} ${ui.btnGhostLight}`;
    const label = (
      <>
        {cta.label}
        {primary && <span className={ui.arrow} aria-hidden="true">→</span>}
      </>
    );
    if (cta.action.catalogue) {
      return (
        <button type="button" className={className} onClick={() => onAction(cta.action)}>
          {label}
        </button>
      );
    }
    const target = cta.action.section || 'contact';
    return (
      <a
        href={`#${target}`}
        className={className}
        onClick={(e) => {
          e.preventDefault();
          onAction(cta.action);
        }}
      >
        {label}
      </a>
    );
  };

  return (
    <section id="connect" className={`${ui.section} ${styles.section}`}>
      <div className={ui.container}>
        <motion.div {...group(0.1)}>
          <motion.p className={ui.eyebrow} variants={item}>{CONNECT.eyebrow}</motion.p>
          <motion.h2 className={ui.sectionH} variants={item}>
            {CONNECT.titleLines[0]}
            <br />
            {CONNECT.titleLines[1]}
          </motion.h2>
          <motion.p className={ui.sectionP} variants={item}>{CONNECT.lead}</motion.p>
        </motion.div>

        <motion.div
          ref={listRef}
          className={styles.tabs}
          role="tablist"
          aria-label={CONNECT.eyebrow}
          {...reveal(0.05, 18)}
        >
          {AUDIENCES.map((a, i) => {
            const on = a.id === active;
            return (
              <button
                key={a.id}
                ref={(el) => { tabRefs.current[i] = el; }}
                type="button"
                role="tab"
                id={`aud-tab-${a.id}`}
                aria-selected={on}
                aria-controls={`aud-panel-${a.id}`}
                tabIndex={on ? 0 : -1}
                className={`${styles.tab}${on ? ` ${styles.tabOn}` : ''}`}
                onClick={() => onChange(a.id)}
                onKeyDown={onTabKeyDown}
              >
                {on && <motion.span layoutId="audienceTabPill" className={styles.tabPill} transition={SPRING} aria-hidden="true" />}
                <span className={styles.tabLabel}>{a.tab}</span>
              </button>
            );
          })}
        </motion.div>

        <motion.div {...reveal(0.12)}>
          {AUDIENCES.map((a, i) => {
            const on = a.id === active;
            return (
              <motion.div
                key={a.id}
                id={`aud-panel-${a.id}`}
                role="tabpanel"
                aria-labelledby={`aud-tab-${a.id}`}
                hidden={!on}
                className={styles.panel}
                initial={false}
                animate={on ? 'show' : 'hidden'}
                variants={panelVariants}
              >
                <motion.div
                  className={styles.visual}
                  data-tone={a.tone}
                  data-spot
                  style={{ '--lamp-x': `${LAMP_X * 100}%` }}
                  onPointerMove={(e) => {
                    spot(e);
                    aimBeam(e);
                  }}
                  onPointerLeave={releaseBeam}
                  variants={visualVariants}
                >
                  <span className={styles.lamp} aria-hidden="true">
                    <motion.span className={styles.beamRig} variants={beamVariants}>
                      <span className={styles.beam}>
                        <span className={styles.glow} />
                        <span className={styles.motes} />
                      </span>
                    </motion.span>
                  </span>

                  <motion.div className={styles.visualTop} variants={riseVariants}>
                    <span className={styles.status}>
                      <span className={styles.statusDot} aria-hidden="true" />
                      {a.visualLabel}
                    </span>
                    <span className={styles.index} aria-hidden="true">
                      <b>{pad(i + 1)}</b> / {pad(AUDIENCES.length)}
                    </span>
                  </motion.div>

                  <motion.span className={styles.bigIcon} variants={iconVariants}>
                    <Icon name={a.icon} size={28} strokeWidth={1.6} />
                  </motion.span>
                  <motion.p className={styles.visualTitle} variants={riseVariants}>
                    {a.visualTitle[0]}
                    <br />
                    <span>{a.visualTitle[1]}</span>
                  </motion.p>
                  <motion.ul className={styles.tags} variants={riseVariants}>
                    {a.visualTags.map((t) => <li key={t}>{t}</li>)}
                  </motion.ul>
                  <motion.dl className={styles.stats} variants={riseVariants}>
                    {a.visualStats.map((s) => (
                      <div key={s.label} className={styles.stat}>
                        <dt>{s.label}</dt>
                        <dd>{s.value}</dd>
                      </div>
                    ))}
                  </motion.dl>
                </motion.div>

                <div className={styles.content}>
                  <motion.p className={ui.eyebrow} variants={copyVariants}>{a.eyebrow}</motion.p>
                  <motion.h3 className={styles.title} variants={copyVariants}>{a.title}</motion.h3>
                  <motion.p className={styles.desc} variants={copyVariants}>{a.desc}</motion.p>
                  <motion.ul className={styles.features} variants={listVariants}>
                    {a.features.map((f) => (
                      <motion.li key={f} variants={featureVariants}>{f}</motion.li>
                    ))}
                  </motion.ul>
                  <motion.div className={styles.btns} variants={copyVariants}>
                    {renderAction(a.primary, true)}
                    {renderAction(a.secondary, false)}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
