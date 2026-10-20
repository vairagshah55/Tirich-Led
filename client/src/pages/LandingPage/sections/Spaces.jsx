import { motion } from 'motion/react';
import Icon from '../../../components/Icon/Icon';
import { SPACES, SPACES_SECTION } from '../homeContent';
import { group, item, itemScale, useSpotlight } from '../homeMotion';
import ui from '../LandingPage.module.css';
import styles from './Spaces.module.css';

export default function Spaces() {
  const spot = useSpotlight();

  return (
    <section id="spaces" className={`${ui.section} ${styles.section}`}>
      <div className={ui.container}>
        <motion.div {...group(0.1)}>
          <motion.p className={ui.eyebrow} variants={item}>{SPACES_SECTION.eyebrow}</motion.p>
          <motion.h2 className={ui.sectionH} variants={item}>{SPACES_SECTION.title}</motion.h2>
          <motion.p className={ui.sectionP} variants={item}>{SPACES_SECTION.lead}</motion.p>
        </motion.div>

        <motion.ul className={styles.grid} onPointerMove={spot} {...group(0.08)}>
          {SPACES.map((s) => (
            <motion.li
              key={s.name}
              className={`${styles.cell}${s.wide ? ` ${styles.wide}` : ''}`}
              variants={itemScale}
            >
              <div className={`${styles.card} ${s.photo ? styles.photoCard : styles.fixtureCard}`} data-spot>
                {s.photo ? (
                  <>
                    <img
                      className={styles.photo}
                      src={s.photo.src}
                      alt={s.photo.alt}
                      width={s.photo.width}
                      height={s.photo.height}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className={styles.shade} aria-hidden="true" />
                  </>
                ) : (
                  <div className={styles.stage}>
                    <img
                      className={styles.fixture}
                      src={s.fixture.src}
                      alt={s.fixture.alt}
                      width="1600"
                      height="1600"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}

                <span className={styles.tag}>
                  <Icon name={s.icon} size={13} strokeWidth={2} />
                  {s.tag}
                </span>

                <div className={styles.content}>
                  {s.fixture && <p className={styles.shown}>Shown · {s.fixture.name}</p>}
                  <h3 className={styles.name}>{s.name}</h3>
                  <p className={styles.desc}>{s.desc}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
