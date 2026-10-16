import { motion } from 'motion/react';
import { BRAND_STATS } from '../homeContent';
import { CountUp, group, item } from '../homeMotion';
import styles from './BrandStats.module.css';

export default function BrandStats() {
  return (
    <div className={styles.strip}>
      <motion.dl className={styles.inner} {...group(0.1)}>
        {BRAND_STATS.map((s) => (
          <motion.div key={s.label} className={styles.stat} variants={item}>
            <dt className={styles.label}>{s.label}</dt>
            <dd className={styles.value}>
              <CountUp value={s.value} />
            </dd>
            <dd className={styles.note}>{s.note}</dd>
          </motion.div>
        ))}
      </motion.dl>
    </div>
  );
}
