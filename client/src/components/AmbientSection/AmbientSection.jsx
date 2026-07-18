import { useState, useRef, useCallback, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { MOTION_EASE as EASE } from '../../utils/motion';
import styles from './AmbientSection.module.css';

// ── House LED interiors (local) ───────────────────────────────────
import houseLiving  from '../../assets/ambient/house1.jpg';
import houseBedroom from '../../assets/ambient/house2.jpg';
import houseKitchen from '../../assets/ambient/house3.jpg';
import houseOpen    from '../../assets/ambient/house4.jpg';
import houseOffice  from '../../assets/ambient/house5.jpg';

// ── Hotel LED interiors (local) ───────────────────────────────────
import hotelLobby  from '../../assets/ambient/hotel1.jpg';
import hotelSuite  from '../../assets/ambient/hotel2.jpg';
import hotelDining from '../../assets/ambient/hotel3.jpg';
import hotelPool   from '../../assets/ambient/hotel4.jpg';
import hotelBar    from '../../assets/ambient/hotel5.jpg';

// ── Mall LED interiors (local) ────────────────────────────────────
import mallDownlights from '../../assets/ambient/mall1.jpg';
import mallBacklit    from '../../assets/ambient/mall2.jpg';
import mallPromenade  from '../../assets/ambient/mall3.jpg';
import mallCove       from '../../assets/ambient/mall4.jpg';
import mallSaucer     from '../../assets/ambient/mall5.jpg';

// ── Showroom LED interiors (local) ────────────────────────────────
import showPendants  from '../../assets/ambient/showroom1.jpg';
import showFurniture from '../../assets/ambient/showroom2.jpg';
import showJewelry   from '../../assets/ambient/showroom3.jpg';
import showBeauty    from '../../assets/ambient/showroom4.jpg';
import showFixtures  from '../../assets/ambient/showroom5.jpg';

const TABS = [
  { id: 'House',    num: '01' },
  { id: 'Hotel',    num: '02' },
  { id: 'Mall',     num: '03' },
  { id: 'Showroom', num: '04' },
];

const GALLERY = {
  House: [
    { url: houseLiving,  title: 'Modern Living Room',  tag: 'Cove & Downlighting'   },
    { url: houseBedroom, title: 'Master Bedroom',      tag: 'Cove & Strip LED'      },
    { url: houseKitchen, title: 'Kitchen & Dining',    tag: 'LED Strip Lighting'    },
    { url: houseOpen,    title: 'Open Plan Interior',  tag: 'Under-Cabinet LEDs'    },
    { url: houseOffice,  title: 'Home Office',         tag: 'Linear LED Lighting'   },
  ],
  Hotel: [
    { url: hotelLobby,  title: 'Grand Lobby',  tag: 'Chandelier & Pendant LED' },
    { url: hotelSuite,  title: 'Luxury Suite', tag: 'Pendant Downlights'       },
    { url: hotelDining, title: 'Fine Dining',  tag: 'Cove & Pendant LED'    },
    { url: hotelPool,   title: 'Pool Deck',    tag: 'IP65 Outdoor LEDs'     },
    { url: hotelBar,    title: 'Lounge & Bar', tag: 'Backlit Mood LED'      },
  ],
  Mall: [
    { url: mallDownlights, title: 'Atrium & Concourse',    tag: 'Recessed Downlights'  },
    { url: mallBacklit,    title: 'Boutique Concourse',    tag: 'Backlit LED Ceiling'  },
    { url: mallPromenade,  title: 'Illuminated Promenade', tag: 'Backlit Cove Ceiling' },
    { url: mallCove,       title: 'Modern Concourse',      tag: 'Cove & Downlights'    },
    { url: mallSaucer,     title: 'Central Atrium',        tag: 'Layered Cove LED'     },
  ],
  Showroom: [
    { url: showPendants,  title: 'Tiles Showroom',     tag: 'Track & Downlights'    },
    { url: showFurniture, title: 'Tiles Showroom',     tag: 'Display Spotlights'    },
    { url: showJewelry,   title: 'Furniture Showroom', tag: 'Track Spot Downlights' },
    { url: showBeauty,    title: 'Jewellery Showroom', tag: 'Accent Display LED'    },
    { url: showFixtures,  title: 'Jewellery Showroom', tag: 'Cabinet & Spot LED'    },
  ],
};

export default function AmbientSection() {
  const [activeEnv, setActiveEnv] = useState('House');
  const [hoveredItem, setHoveredItem] = useState(null);

  const sectionRef = useRef(null);
  const gridRef    = useRef(null);
  const featImgRef = useRef(null);
  const tabRefs    = useRef([]);

  const activeIdx = TABS.findIndex(t => t.id === activeEnv);

  // ── Sliding pill: measure the active tab's real position/width ────
  // Tabs are sized to their text (HOUSE vs SHOWROOM differ), so a fixed
  // equal-width pill overshoots into the next tab. Measure instead.
  const [pill, setPill] = useState({ left: 4, width: 0 });
  useLayoutEffect(() => {
    const measure = () => {
      const el = tabRefs.current[activeIdx];
      if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeIdx]);

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
          animate={{ x: pill.left - 4, width: pill.width }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        />

        {TABS.map(({ id, num }, i) => (
          <button
            key={id}
            ref={el => (tabRefs.current[i] = el)}
            className={`${styles.tab}${activeEnv === id ? ` ${styles.tabActive}` : ''}`}
            onClick={() => switchEnv(id)}
          >
            <span className={styles.tabNum}>{num}</span>
            <span className={styles.tabLabel}>{id}</span>
          </button>
        ))}
      </motion.div>

      {/* ── Image grid ──────────────────────────────────────────── */}
      <div className={styles.gridWrap}>
      <AnimatePresence initial={false}>
        <motion.div
          key={activeEnv}
          ref={gridRef}
          className={styles.grid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, position: 'absolute', inset: 0, zIndex: 0 }}
          transition={{ duration: 0.3 }}
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
                decoding="async"
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
      </div>

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
