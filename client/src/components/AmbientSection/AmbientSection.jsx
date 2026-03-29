import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { MOTION_EASE as EASE } from '../../utils/motion';
import styles from './AmbientSection.module.css';

const TABS = [
  { id: 'House',    num: '01' },
  { id: 'Hotel',    num: '02' },
  { id: 'Mall',     num: '03' },
  { id: 'Showroom', num: '04' },
];

const GALLERY = {
  House: [
    { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=72', title: 'Modern Living Room',  tag: 'Residential Ambient'   },
    { url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=72',  title: 'Master Bedroom',      tag: 'Warm Downlighting'     },
    { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=72',  title: 'Kitchen & Dining',    tag: 'Task Lighting'         },
    { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=72',  title: 'Open Plan Interior',  tag: 'Strip Accent Lighting' },
    { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=72',  title: 'Home Office',         tag: 'Focus Lighting'        },
  ],
  Hotel: [
    { url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=72', title: 'Grand Lobby',         tag: 'Hospitality Lighting'  },
    { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=72',  title: 'Luxury Suite',        tag: 'Warm Ambience'         },
    { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=72',  title: 'Fine Dining',         tag: 'Pendant Series'        },
    { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=72',  title: 'Pool Deck',           tag: 'IP65 Outdoor LEDs'     },
    { url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=72',  title: 'Lounge & Bar',        tag: 'Mood Lighting'         },
  ],
  Mall: [
    { url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=72', title: 'Atrium & Common Area', tag: 'High Bay LEDs'         },
    { url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=72',   title: 'Retail Interior',      tag: 'CRI 95+ Track Lights'  },
    { url: 'https://images.unsplash.com/photo-1481437156560-3205f6a55735?auto=format&fit=crop&w=800&q=72',   title: 'Shopping Corridor',    tag: 'Corridor Lighting'     },
    { url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=72',   title: 'Anchor Store',         tag: 'Commercial Panel LED'  },
    { url: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=800&q=72',   title: 'F&B Zone',             tag: 'Warm Accent Lighting'  },
  ],
  Showroom: [
    { url: 'https://images.unsplash.com/photo-1603825491103-bd638b1873b0?auto=format&fit=crop&w=1200&q=72', title: 'Luxury Brand Showroom', tag: 'Accent Spotlighting'  },
    { url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=72',   title: 'Automotive Display',    tag: 'COB Track Lighting'   },
    { url: 'https://images.unsplash.com/photo-1524758631624-e2822132143e?auto=format&fit=crop&w=800&q=72',   title: 'Furniture Studio',      tag: 'Warm Panel Lighting'  },
    { url: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=800&q=72',      title: 'Product Display',       tag: 'CRI 95 Spotlights'    },
    { url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=72',   title: 'Fashion Boutique',      tag: 'Magnetic COB Series'  },
  ],
};

export default function AmbientSection() {
  const [activeEnv, setActiveEnv] = useState('House');
  const [hoveredItem, setHoveredItem] = useState(null);

  const sectionRef = useRef(null);
  const gridRef    = useRef(null);
  const featImgRef = useRef(null);

  const activeIdx = TABS.findIndex(t => t.id === activeEnv);

  // ── Spring cursor ────────────────────────────────────────────────
  const rawX    = useMotionValue(-300);
  const rawY    = useMotionValue(-300);
  const cursorX = useSpring(rawX, { stiffness: 500, damping: 38, mass: 0.45 });
  const cursorY = useSpring(rawY, { stiffness: 500, damping: 38, mass: 0.45 });

  // ── Mouse move: spotlight + featured parallax + cursor ───────────
  const onMove = useCallback((e) => {
    rawX.set(e.clientX);
    rawY.set(e.clientY);

    if (sectionRef.current) {
      const r = sectionRef.current.getBoundingClientRect();
      sectionRef.current.style.setProperty('--mx', `${e.clientX - r.left}px`);
      sectionRef.current.style.setProperty('--my', `${e.clientY - r.top}px`);
    }

    if (gridRef.current) {
      const r = gridRef.current.getBoundingClientRect();
      gridRef.current.style.setProperty('--mx', `${e.clientX - r.left}px`);
      gridRef.current.style.setProperty('--my', `${e.clientY - r.top}px`);
    }

    if (featImgRef.current && sectionRef.current) {
      const r  = sectionRef.current.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width  - 0.5;
      const cy = (e.clientY - r.top)  / r.height - 0.5;
      featImgRef.current.style.transform = `translate(${cx * 18}px, ${cy * 12}px) scale(1.07)`;
    }
  }, [rawX, rawY]);

  const onLeave = useCallback(() => {
    rawX.set(-300);
    rawY.set(-300);
    setHoveredItem(null);
    if (sectionRef.current) {
      sectionRef.current.style.setProperty('--mx', '-999px');
      sectionRef.current.style.setProperty('--my', '-999px');
    }
    if (featImgRef.current) {
      featImgRef.current.style.transform = 'translate(0,0) scale(1.04)';
    }
  }, [rawX, rawY]);

  const switchEnv = useCallback((id) => {
    setHoveredItem(null);
    setActiveEnv(id);
  }, []);

  // Pill width per tab
  const tabCount = TABS.length;

  return (
    <section
      id="environments"
      ref={sectionRef}
      className={styles.section}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* Decorative background */}
      <div className={styles.orbOrange} aria-hidden />
      <div className={styles.orbNavy} aria-hidden />
      <div className={styles.sectionSpotlight} aria-hidden />
      <div className={styles.topStripe} aria-hidden />

      {/* ── Floating spring cursor label ─────────────────────────── */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            className={styles.floatingLabel}
            style={{ x: cursorX, y: cursorY }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.16, ease: EASE }}
          >
            <span className={styles.floatingTag}>{hoveredItem.tag}</span>
            <span className={styles.floatingTitle}>{hoveredItem.title}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ──────────────────────────────────────────────── */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease: EASE }}
      >
        <div className={styles.headerInner}>
          <div>
            <p className={styles.eyebrow}>
              <motion.span
                className={styles.eyebrowDot}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              Real World Applications
            </p>
            <h2 className={styles.title}>LED Lighting Across Every Space</h2>
            <p className={styles.lead}>
              From warm residential interiors to high-intensity commercial
              environments — see how Tirich LED transforms real spaces.
            </p>
          </div>
          <span className={styles.ghostNum} aria-hidden>03</span>
        </div>
      </motion.div>

      {/* ── Pill-style category tabs ───────────────────────────── */}
      <motion.div
        className={styles.tabs}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay: 0.18, ease: EASE }}
      >
        {/* Sliding pill */}
        <motion.span
          className={styles.tabPill}
          initial={false}
          animate={{ x: `calc(${activeIdx * 100}% + ${activeIdx * 4}px)` }}
          style={{ width: `calc(${100 / tabCount}% - 3px)` }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        />

        {TABS.map(({ id, num }) => (
          <button
            key={id}
            className={`${styles.tab}${activeEnv === id ? ` ${styles.tabActive}` : ''}`}
            onClick={() => switchEnv(id)}
          >
            <span className={styles.tabNum}>{num}</span>
            <span className={styles.tabLabel}>{id}</span>
          </button>
        ))}
      </motion.div>

      {/* ── Image grid ──────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeEnv}
          ref={gridRef}
          className={styles.grid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.14 }}
        >
          {GALLERY[activeEnv].map((item, i) => (
            <motion.div
              key={i}
              className={`${styles.card}${i === 0 ? ` ${styles.cardFeat}` : ''}`}
              initial={{ clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
              exit={{ clipPath: 'inset(0% 0% 100% 0%)', opacity: 0 }}
              transition={{ duration: 0.52, delay: i * 0.065, ease: EASE }}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <img
                ref={i === 0 ? featImgRef : null}
                src={item.url}
                alt={item.title}
                className={styles.img}
                loading={i === 0 ? 'eager' : 'lazy'}
                style={i === 0 ? { transition: 'transform 0.1s linear', transformOrigin: 'center' } : undefined}
              />

              {i === 0 && (
                <div className={styles.overlayFeat}>
                  <span className={styles.cardTag}>{item.tag}</span>
                  <span className={styles.cardTitle}>{item.title}</span>
                </div>
              )}

              {i !== 0 && (
                <div className={styles.overlayHover}>
                  <span className={styles.cardTag}>{item.tag}</span>
                  <span className={styles.cardTitleSm}>{item.title}</span>
                </div>
              )}
            </motion.div>
          ))}

          <div className={styles.spotlight} aria-hidden />
        </motion.div>
      </AnimatePresence>

      {/* ── Bottom meta bar ─────────────────────────────────────── */}
      <div className={styles.meta}>
        <span className={styles.metaLeft}>
          <motion.span
            className={styles.metaDot}
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          {activeEnv} · LED Installations
        </span>
        <span className={styles.metaRight}>
          {GALLERY[activeEnv].length} locations shown
        </span>
      </div>

    </section>
  );
}
