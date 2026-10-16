import { motion } from 'motion/react';
import { CERTS, CERTS_LABEL } from '../homeContent';
import { EASE, group, item } from '../homeMotion';
import styles from './Certifications.module.css';

const pillVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE } },
};

export default function Certifications() {
  return (
    <div className={styles.section}>
      <motion.div className={styles.inner} {...group(0.06)}>
        <motion.p className={styles.label} variants={item}>{CERTS_LABEL}</motion.p>
        <ul className={styles.list}>
          {CERTS.map((c) => (
            <motion.li key={c} className={styles.pill} variants={pillVariants}>
              <span className={styles.dot} aria-hidden="true" />
              <span className={styles.name}>{c}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
