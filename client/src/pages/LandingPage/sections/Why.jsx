import { motion } from 'motion/react';
import Icon from '../../../components/Icon/Icon';
import { WHY, WHY_SECTION } from '../homeContent';
import { group, item } from '../homeMotion';
import ui from '../LandingPage.module.css';
import styles from './Why.module.css';

export default function Why() {
  return (
    <section className={`${ui.section} ${styles.section}`}>
      <div className={ui.container}>
        <motion.div {...group(0.1)}>
          <motion.p className={ui.eyebrow} variants={item}>{WHY_SECTION.eyebrow}</motion.p>
          <motion.h2 className={ui.sectionH} variants={item}>{WHY_SECTION.title}</motion.h2>
          <motion.p className={ui.sectionP} variants={item}>{WHY_SECTION.lead}</motion.p>
        </motion.div>

        <motion.ul className={styles.grid} {...group(0.08)}>
          {WHY.map((w) => (
            <motion.li key={w.title} className={styles.cell} variants={item}>
              <div className={styles.card}>
                <span className={styles.icon}>
                  <Icon name={w.icon} size={24} />
                </span>
                <div>
                  <h3 className={styles.title}>{w.title}</h3>
                  <p className={styles.text}>{w.text}</p>
                  <span className={styles.spec}>{w.spec}</span>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
