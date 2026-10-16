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
            <motion.li key={s.name} className={styles.cell} variants={itemScale}>
              <div className={styles.card} data-spot>
                <div className={`${styles.bg} ${styles[`tile${s.tile}`]}`} aria-hidden="true">
                  <span className={styles.cone} />
                  <Icon name={s.icon} size={88} strokeWidth={1.1} className={styles.icon} />
                </div>
                <div className={styles.overlay} aria-hidden="true" />
                <div className={styles.content}>
                  <span className={styles.tag}>{s.tag}</span>
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
