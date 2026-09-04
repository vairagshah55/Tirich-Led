import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Seo from '../../components/Seo/Seo';
import styles from './SmartLightingPage.module.css';
import {
  MOTION_EASE,
  buttonHover,
  buttonTap,
  cardHover,
  presenceFade,
} from '../../utils/motion';

const ROOM_IMAGE = 'https://images.pexels.com/photos/34940802/pexels-photo-34940802.jpeg?cs=srgb&dl=pexels-travel-with-lenses-734723610-34940802.jpg&fm=jpg&w=1800';
const PHONE_IMAGE = 'https://images.pexels.com/photos/35490265/pexels-photo-35490265.jpeg?cs=srgb&dl=pexels-jakubzerdzicki-35490265.jpg&fm=jpg&w=1200';
const DEVICE_IMAGE = 'https://images.pexels.com/photos/30156624/pexels-photo-30156624.jpeg?cs=srgb&dl=pexels-jakubzerdzicki-30156624.jpg&fm=jpg&w=1200';
const SWITCH_IMAGE = 'https://images.pexels.com/photos/17005389/pexels-photo-17005389.jpeg?cs=srgb&dl=pexels-jakubzerdzicki-17005389.jpg&fm=jpg&w=1200';

const CONTROL_METHODS = [
  {
    id: 'mobile',
    label: 'Mobile',
    kicker: 'App control',
    title: 'Every scene, timer, and brightness level in one quiet app.',
    body: 'Perfect for premium homes, suites, and designer spaces that want invisible control with zero wall clutter.',
    accent: '#FF9D1C',
    image: PHONE_IMAGE,
    deviceTitle: 'Phone control',
    deviceBody: 'Launch scenes from anywhere in the room or before you walk in.',
    stats: ['iOS + Android', 'Grouped rooms'],
  },
  {
    id: 'remote',
    label: 'Remote',
    kicker: 'Wireless remote',
    title: 'Trigger dinner, work, cinema, or away mode in one tap.',
    body: 'Install cleaner walls and let guests or teams recall scenes instantly from handheld or wall-mounted remotes.',
    accent: '#FF9D1C',
    image: SWITCH_IMAGE,
    deviceTitle: 'Wireless scene button',
    deviceBody: 'Scene recall without rewiring traditional switch banks.',
    stats: ['3 scene recall', 'Fast response'],
  },
  {
    id: 'automation',
    label: 'Automation',
    kicker: 'Schedules and voice',
    title: 'Let routines wake up the room, close it down, and keep it efficient.',
    body: 'Timers, occupancy logic, and voice-ready integrations make lighting feel automatic instead of manual.',
    accent: '#FF9D1C',
    image: DEVICE_IMAGE,
    deviceTitle: 'Smart home stack',
    deviceBody: 'Devices, sensors, and scenes work together behind the scenes.',
    stats: ['24/7 routines', 'Voice ready'],
  },
];

const SCENES = [
  {
    id: 'relax',
    label: 'Relax',
    temp: 3000,
    brightness: 58,
    color: '#F3B56A',
    ambience: 'Warm hospitality lighting for lounge moments and evening comfort.',
  },
  {
    id: 'focus',
    label: 'Focus',
    temp: 4000,
    brightness: 92,
    color: '#E8F0FF',
    ambience: 'Balanced neutral light for working, reading, and sharper task visibility.',
  },
  {
    id: 'cinema',
    label: 'Cinema',
    temp: 2200,
    brightness: 22,
    color: '#FF8459',
    ambience: 'Low, warm perimeter glow that keeps the room immersive and cinematic.',
  },
  {
    id: 'away',
    label: 'Away',
    temp: 2700,
    brightness: 14,
    color: '#73E6C7',
    ambience: 'Minimal security presence with a low-energy, scheduled occupancy effect.',
  },
];

const ZONES = [
  { id: 'ceiling', label: 'Ceiling Cove', x: '54%', y: '18%', defaultOn: true },
  { id: 'sofa', label: 'Lounge Edge', x: '73%', y: '46%', defaultOn: true },
  { id: 'accent', label: 'Accent Shelf', x: '78%', y: '34%', defaultOn: true },
  { id: 'floor', label: 'Floor Wash', x: '57%', y: '72%', defaultOn: false },
  { id: 'media', label: 'Media Wall', x: '33%', y: '42%', defaultOn: false },
  { id: 'shelf', label: 'Reading Nook', x: '84%', y: '56%', defaultOn: true },
];

const DEFAULT_ZONE_STATES = Object.fromEntries(ZONES.map((zone) => [zone.id, zone.defaultOn]));
const OFF_ZONE_STATES = Object.fromEntries(ZONES.map((zone) => [zone.id, false]));

const FEATURE_CARDS = [
  {
    title: 'Mobile-first scenes',
    body: 'Clients can dim, group, and schedule fittings from one interface instead of walking wall to wall.',
  },
  {
    title: 'Wireless remote recall',
    body: 'Great for hospitality, living rooms, and premium retail where clean surfaces matter as much as control.',
  },
  {
    title: 'Automation routines',
    body: 'Wake, close, and away behaviours keep rooms intelligent without asking users to think about switches.',
  },
];

const ROUTINES = [
  {
    id: 'arrive',
    label: 'Arrive Home',
    time: '18:30',
    sceneId: 'relax',
    states: { ceiling: true, sofa: true, accent: true, floor: true, media: false, shelf: true },
  },
  {
    id: 'focus',
    label: 'Work Mode',
    time: '09:00',
    sceneId: 'focus',
    states: { ceiling: true, sofa: false, accent: true, floor: false, media: false, shelf: true },
  },
  {
    id: 'night',
    label: 'Night Path',
    time: '23:10',
    sceneId: 'cinema',
    states: { ceiling: false, sofa: false, accent: true, floor: true, media: false, shelf: false },
  },
];

function LightZone({ zone, on, color, onToggle }) {
  return (
    <motion.button
      type="button"
      className={`${styles.zone}${on ? ` ${styles.zoneOn}` : ''}`}
      style={{
        left: zone.x,
        top: zone.y,
        borderColor: on ? color : 'rgba(255, 255, 255, 0.16)',
        boxShadow: on ? `0 0 28px ${color}44` : 'none',
      }}
      onClick={() => onToggle(zone.id)}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
    >
      <motion.span
        className={styles.zoneDot}
        animate={{
          background: on ? color : 'rgba(255, 255, 255, 0.22)',
          boxShadow: on ? `0 0 18px ${color}99` : 'none',
        }}
        transition={{ duration: 0.28 }}
      />
      <span className={styles.zoneName}>{zone.label}</span>
    </motion.button>
  );
}

export default function SmartLightingPage() {
  const [activeMethod, setActiveMethod] = useState('mobile');
  const [activeScene, setActiveScene] = useState('relax');
  const [activeRoutine, setActiveRoutine] = useState('arrive');
  const [brightness, setBrightness] = useState(58);
  const [colorTemp, setColorTemp] = useState(3000);
  const [masterOn, setMasterOn] = useState(true);
  const [zoneStates, setZoneStates] = useState(DEFAULT_ZONE_STATES);

  const method = CONTROL_METHODS.find((item) => item.id === activeMethod) || CONTROL_METHODS[0];
  const scene = SCENES.find((item) => item.id === activeScene) || SCENES[0];

  const applyScene = useCallback((sceneId) => {
    const nextScene = SCENES.find((item) => item.id === sceneId) || SCENES[0];
    setActiveScene(nextScene.id);
    setBrightness(nextScene.brightness);
    setColorTemp(nextScene.temp);
  }, []);

  const toggleZone = useCallback((zoneId) => {
    setMasterOn(true);
    setZoneStates((prev) => ({ ...prev, [zoneId]: !prev[zoneId] }));
  }, []);

  const toggleMaster = useCallback(() => {
    setMasterOn((prev) => {
      const next = !prev;
      setZoneStates(next ? DEFAULT_ZONE_STATES : OFF_ZONE_STATES);
      return next;
    });
  }, []);

  const applyRoutine = useCallback(
    (routineId) => {
      const routine = ROUTINES.find((item) => item.id === routineId) || ROUTINES[0];
      setActiveRoutine(routine.id);
      setMasterOn(true);
      setZoneStates(routine.states);
      applyScene(routine.sceneId);
      setActiveMethod(routine.id === 'night' ? 'automation' : 'mobile');
    },
    [applyScene]
  );

  const activeZoneCount = Object.values(zoneStates).filter(Boolean).length;
  const anyOn = masterOn && activeZoneCount > 0;

  const roomTint = anyOn
    ? `linear-gradient(180deg, rgba(26, 23, 64, 0.08) 0%, rgba(26, 23, 64, 0.74) 100%), radial-gradient(ellipse 56% 44% at 72% 35%, ${scene.color}55 0%, transparent 70%)`
    : 'linear-gradient(180deg, rgba(26, 23, 64, 0.26) 0%, rgba(26, 23, 64, 0.92) 100%)';

  return (
    <div className={styles.page} style={{ '--accent': method.accent, '--scene-color': scene.color }}>
      <Seo
        title="Smart Lighting"
        path="/smart-lighting"
        description="Tirich LED smart lighting — app and voice-controlled scenes, tunable white and dimming for modern homes, offices and hospitality spaces."
      />
      <Navbar />

      <main className={styles.main}>
        <section className={styles.hero}>
          <motion.div
            className={styles.heroCopy}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: MOTION_EASE }}
          >
            <p className={styles.eyebrow}>Smart Lighting Systems</p>
            <h1 className={styles.heroTitle}>Lights on. Lights off. No wall switch needed.</h1>
            <p className={styles.heroLead}>
              Tirich Smart Lighting blends mobile control, wireless remotes, schedules,
              and voice-ready routines into one premium experience for modern interiors.
            </p>

            <div className={styles.methodTabs}>
              {CONTROL_METHODS.map((item) => {
                const active = item.id === activeMethod;
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    className={`${styles.methodBtn}${active ? ` ${styles.methodBtnActive}` : ''}`}
                    style={active ? { borderColor: item.accent, color: '#17164A' } : undefined}
                    onClick={() => setActiveMethod(item.id)}
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                  >
                    <span className={styles.methodBtnLabel}>{item.label}</span>
                    <span className={styles.methodBtnKicker}>{item.kicker}</span>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={method.id} className={styles.methodPanel} {...presenceFade}>
                <p className={styles.methodKicker}>{method.kicker}</p>
                <h2 className={styles.methodTitle}>{method.title}</h2>
                <p className={styles.methodBody}>{method.body}</p>
                <div className={styles.methodStats}>
                  {method.stats.map((stat) => (
                    <span key={stat} className={styles.methodStat}>
                      {stat}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className={styles.heroActions}>
              <motion.a href="#control-lab" className={styles.primaryBtn} whileHover={buttonHover} whileTap={buttonTap}>
                Try Control Lab
              </motion.a>
              <motion.div className={styles.inlineStatus} whileHover={cardHover}>
                <motion.span
                  className={styles.inlineDot}
                  animate={{ background: anyOn ? scene.color : 'rgba(21,21,21,0.2)', boxShadow: anyOn ? `0 0 8px ${scene.color}` : 'none' }}
                  transition={{ duration: 0.4 }}
                />
                <span>{anyOn ? `${activeZoneCount} zones active` : 'All lights off'}</span>
              </motion.div>
              <Link to="/contact" className={styles.secondaryBtn}>
                Talk to Tirich
              </Link>
            </div>
          </motion.div>

          <motion.div
            className={styles.heroVisual}
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.08, ease: MOTION_EASE }}
          >
            <div className={styles.showcaseCard}>
              <img
                src={ROOM_IMAGE}
                alt="Modern living room with layered ambient smart lighting"
                className={styles.showcaseImage}
                loading="eager" decoding="async"
              />
              <div className={styles.showcaseTint} style={{ background: roomTint }} />
              <div className={styles.showcaseBadge}>Scene: {scene.label}</div>
              <div className={styles.showcaseFooter}>
                <span>{masterOn ? 'System armed' : 'System off'}</span>
                <strong>{scene.ambience}</strong>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={method.id} className={styles.deviceCard} {...presenceFade}>
                <img
                  src={method.image}
                  alt={method.deviceTitle}
                  className={styles.deviceImage}
                  loading="lazy" decoding="async"
                />
                <div className={styles.deviceCopy}>
                  <p className={styles.deviceKicker}>{method.label}</p>
                  <h3 className={styles.deviceTitle}>{method.deviceTitle}</h3>
                  <p className={styles.deviceBody}>{method.deviceBody}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <motion.div className={styles.heroPanel} whileHover={cardHover}>
              <div className={styles.heroPanelTop}>
                <span>Live command</span>
                <strong>{scene.label}</strong>
              </div>
              <div className={styles.heroPanelRow}>
                <span>Brightness</span>
                <strong>{brightness}%</strong>
              </div>
              <div className={styles.heroBar}>
                <motion.span
                  className={styles.heroBarFill}
                  animate={{ width: `${brightness}%`, background: scene.color }}
                  transition={{ duration: 0.25 }}
                />
              </div>
              <div className={styles.heroChipRow}>
                {['Mobile', 'Remote', 'Automation'].map((chip) => (
                  <span key={chip} className={styles.heroChip}>
                    {chip}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section className={styles.featureGrid}>
          {FEATURE_CARDS.map((card, index) => (
            <motion.article
              key={card.title}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: MOTION_EASE }}
              whileHover={cardHover}
            >
              <span className={styles.featureIndex}>0{index + 1}</span>
              <h2 className={styles.featureTitle}>{card.title}</h2>
              <p className={styles.featureBody}>{card.body}</p>
            </motion.article>
          ))}
        </section>

        <section className={styles.lab} id="control-lab">
          <motion.div
            className={styles.labIntro}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-70px' }}
            transition={{ duration: 0.6, ease: MOTION_EASE }}
          >
            <p className={styles.sectionEyebrow}>Interactive demo</p>
            <h2 className={styles.sectionTitle}>See how the room behaves without using a switch board.</h2>
            <p className={styles.sectionLead}>
              Use scenes, zones, and routines below to simulate how Tirich smart lighting responds from mobile,
              remote, and scheduled control.
            </p>
          </motion.div>

          <div className={styles.labShell}>
            <motion.div className={styles.roomPanel} whileHover={cardHover}>
              <img src={ROOM_IMAGE} alt="Smart lighting demo room" className={styles.roomImage} loading="lazy" decoding="async" />
              <div className={styles.roomTint} style={{ background: roomTint }} />

              {ZONES.map((zone) => (
                <LightZone
                  key={zone.id}
                  zone={zone}
                  on={masterOn && zoneStates[zone.id]}
                  color={scene.color}
                  onToggle={toggleZone}
                />
              ))}

              <div className={styles.roomLegend}>
                <span className={styles.roomLegendDot} style={{ background: anyOn ? scene.color : 'rgba(255,255,255,0.24)' }} />
                <span>{anyOn ? `${scene.label} scene with ${activeZoneCount} active zones` : 'All zones are currently off'}</span>
              </div>
            </motion.div>

            <div className={styles.controlPanel}>
              <div className={styles.controlBlock}>
                <div className={styles.blockHeader}>
                  <p className={styles.blockLabel}>Master power</p>
                  <motion.button
                    type="button"
                    className={`${styles.masterBtn}${masterOn ? ` ${styles.masterBtnOn}` : ''}`}
                    style={masterOn ? { background: scene.color, borderColor: scene.color } : undefined}
                    onClick={toggleMaster}
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                  >
                    {masterOn ? 'On' : 'Off'}
                  </motion.button>
                </div>
                <p className={styles.blockCopy}>Power the entire lighting plan on or off in one step.</p>
              </div>

              <div className={styles.controlBlock}>
                <p className={styles.blockLabel}>Scene presets</p>
                <div className={styles.sceneGrid}>
                  {SCENES.map((item) => {
                    const active = item.id === activeScene;
                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        className={`${styles.sceneBtn}${active ? ` ${styles.sceneBtnActive}` : ''}`}
                        style={active ? { borderColor: item.color, background: `${item.color}18` } : undefined}
                        onClick={() => applyScene(item.id)}
                        whileHover={buttonHover}
                        whileTap={buttonTap}
                      >
                        <span className={styles.sceneSwab} style={{ background: item.color }} />
                        <span className={styles.sceneLabel}>{item.label}</span>
                        <span className={styles.sceneTemp}>{item.temp}K</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className={styles.controlBlock}>
                <div className={styles.sliderRow}>
                  <p className={styles.blockLabel}>Brightness</p>
                  <span className={styles.sliderValue}>{brightness}%</span>
                </div>
                <div className={styles.sliderTrack}>
                  <motion.span
                    className={styles.sliderFill}
                    animate={{ width: `${brightness}%`, background: scene.color }}
                    transition={{ duration: 0.2 }}
                  />
                  <input
                    className={styles.sliderInput}
                    type="range"
                    min={5}
                    max={100}
                    value={brightness}
                    onChange={(event) => setBrightness(Number(event.target.value))}
                  />
                </div>
              </div>

              <div className={styles.controlBlock}>
                <div className={styles.sliderRow}>
                  <p className={styles.blockLabel}>Color temperature</p>
                  <span className={styles.sliderValue}>{colorTemp}K</span>
                </div>
                <div className={`${styles.sliderTrack} ${styles.tempTrack}`}>
                  <input
                    className={styles.sliderInput}
                    type="range"
                    min={2200}
                    max={5000}
                    step={100}
                    value={colorTemp}
                    onChange={(event) => setColorTemp(Number(event.target.value))}
                  />
                </div>
                <div className={styles.tempLabels}>
                  <span>Warm</span>
                  <span>Balanced</span>
                  <span>Cool</span>
                </div>
              </div>

              <div className={styles.controlBlock}>
                <p className={styles.blockLabel}>Zones</p>
                <div className={styles.zoneList}>
                  {ZONES.map((zone) => {
                    const active = masterOn && zoneStates[zone.id];
                    return (
                      <div key={zone.id} className={styles.zoneRow}>
                        <div className={styles.zoneRowInfo}>
                          <span
                            className={styles.zoneIndicator}
                            style={{
                              background: active ? scene.color : 'rgba(21,21,21,0.15)',
                              boxShadow: active ? `0 0 14px ${scene.color}99` : 'none',
                            }}
                          />
                          <span className={styles.zoneRowName}>{zone.label}</span>
                        </div>
                        <motion.button
                          type="button"
                          className={`${styles.zoneToggle}${active ? ` ${styles.zoneToggleOn}` : ''}`}
                          style={active ? { background: scene.color } : undefined}
                          onClick={() => toggleZone(zone.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.94 }}
                        >
                          <motion.span
                            className={styles.zoneThumb}
                            animate={{ x: active ? 18 : 2 }}
                            transition={{ type: 'spring', stiffness: 430, damping: 28 }}
                          />
                        </motion.button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={styles.controlBlock}>
                <p className={styles.blockLabel}>Automation routines</p>
                <div className={styles.routineList}>
                  {ROUTINES.map((routine) => {
                    const active = routine.id === activeRoutine;
                    return (
                      <motion.button
                        key={routine.id}
                        type="button"
                        className={`${styles.routineCard}${active ? ` ${styles.routineCardActive}` : ''}`}
                        style={active ? { borderColor: scene.color, background: `${scene.color}14` } : undefined}
                        onClick={() => applyRoutine(routine.id)}
                        whileHover={buttonHover}
                        whileTap={buttonTap}
                      >
                        <div>
                          <span className={styles.routineTime}>{routine.time}</span>
                          <strong className={styles.routineLabel}>{routine.label}</strong>
                        </div>
                        <span className={styles.routineScene}>{routine.sceneId}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <motion.div
            className={styles.ctaCard}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-70px' }}
            transition={{ duration: 0.6, ease: MOTION_EASE }}
          >
            <div>
              <p className={styles.sectionEyebrow}>Project fit</p>
              <h2 className={styles.sectionTitle}>Want this control system built into your next project?</h2>
              <p className={styles.sectionLead}>
                We can configure Tirich smart lighting for homes, suites, hospitality spaces, and modern commercial environments.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <Link to="/contact" className={styles.primaryBtn}>
                Book a Smart Lighting Consultation
              </Link>
              <Link to="/products" className={styles.secondaryBtn}>
                Browse Lighting Products
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
