import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useInView } from 'motion/react';
import Icon from '../../../components/Icon/Icon';
import { PRODUCT_FILTERS, PRODUCT_SECTION, SHOWCASE } from '../homeContent';
import { EASE, group, item, reveal, useSpotlight } from '../homeMotion';
import ui from '../LandingPage.module.css';
import styles from './Products.module.css';

const ALL = PRODUCT_FILTERS[0];

// Each card carries its own states rather than inheriting variants from
// the grid. Variant inheritance doesn't survive AnimatePresence + popLayout:
// cards a filter brought back re-mounted on the inherited "hidden" state and
// never left it, and cards on their way out could freeze half-faded.
const CARD_HIDDEN = { opacity: 0, y: 26, scale: 0.97 };
const CARD_SHOWN = { opacity: 1, y: 0, scale: 1 };
const CARD_EXIT = { opacity: 0, scale: 0.92, transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } };

export default function Products() {
  const [filter, setFilter] = useState(ALL);
  const spot = useSpotlight();

  // Once the grid has been on screen, every card — including one a filter
  // brings back later — animates to visible.
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.15 });
  const shown = filter === ALL ? SHOWCASE : SHOWCASE.filter((p) => p.group === filter);

  return (
    <section id="products" className={`${ui.section} ${ui.onDark} ${styles.section}`}>
      <div className={ui.container}>
        <motion.div {...group(0.1)}>
          <motion.p className={ui.eyebrow} variants={item}>{PRODUCT_SECTION.eyebrow}</motion.p>
          <motion.h2 className={ui.sectionH} variants={item}>{PRODUCT_SECTION.title}</motion.h2>
          <motion.p className={ui.sectionP} variants={item}>{PRODUCT_SECTION.lead}</motion.p>
        </motion.div>

        <motion.div className={styles.filters} role="group" aria-label="Filter products" {...reveal(0.05, 16)}>
          {PRODUCT_FILTERS.map((f) => {
            const on = f === filter;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={on}
                className={`${styles.filter}${on ? ` ${styles.filterOn}` : ''}`}
                onClick={() => setFilter(f)}
              >
                {on && (
                  <motion.span
                    layoutId="productFilterPill"
                    className={styles.filterPill}
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    aria-hidden="true"
                  />
                )}
                <span className={styles.filterLabel}>{f}</span>
              </button>
            );
          })}
        </motion.div>

        <ul ref={gridRef} className={styles.grid} onPointerMove={spot}>
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <motion.li
                key={p.name}
                layout
                initial={CARD_HIDDEN}
                animate={gridInView ? CARD_SHOWN : CARD_HIDDEN}
                exit={CARD_EXIT}
                transition={{
                  duration: 0.6,
                  ease: EASE,
                  delay: i * 0.06,
                  layout: { duration: 0.5, ease: EASE },
                }}
                className={styles.cell}
              >
                <Link to={p.to} className={styles.card} data-spot>
                  <div className={`${styles.media} ${styles[`tile${p.tile}`]}`}>
                    <span className={styles.halo} aria-hidden="true" />
                    {p.img ? (
                      <img
                        className={styles.img}
                        src={p.img}
                        alt={p.alt}
                        width="1600"
                        height="1600"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <Icon name={p.icon} size={72} strokeWidth={1.3} className={styles.mediaIcon} />
                    )}
                    {p.badge && <span className={styles.badge}>{p.badge}</span>}
                  </div>
                  <div className={styles.body}>
                    <h3 className={styles.name}>{p.name}</h3>
                    <p className={styles.sub}>{p.sub}</p>
                    <ul className={styles.specs}>
                      {p.specs.map((s) => (
                        <li key={s} className={styles.spec}>{s}</li>
                      ))}
                    </ul>
                    <span className={styles.link}>
                      View product <span className={styles.linkArrow} aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <motion.div className={ui.ctaRow} {...reveal(0.05, 16)}>
          <Link to="/products" className={`${ui.btn} ${ui.btnOutlineWhite}`}>
            {PRODUCT_SECTION.cta} <span className={ui.arrow} aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
