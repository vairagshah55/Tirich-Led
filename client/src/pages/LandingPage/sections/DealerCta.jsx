import { motion } from 'motion/react';
import Icon from '../../../components/Icon/Icon';
import { DEALER_CTA } from '../homeContent';
import { EASE, group, item, useMagnetic } from '../homeMotion';
import ui from '../LandingPage.module.css';
import styles from './DealerCta.module.css';

const tagVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE } },
};

export default function DealerCta({ onNavigate, onCatalogue }) {
  const magnetic = useMagnetic(0.18);

  return (
    <section className={styles.section}>
      <span className={styles.sheen} aria-hidden="true" />
      <div className={styles.inner}>
        <motion.div className={styles.left} {...group(0.09)}>
          <motion.p className={styles.kicker} variants={item}>{DEALER_CTA.kicker}</motion.p>
          <motion.h2 className={styles.title} variants={item}>
            {DEALER_CTA.titleLines[0]}
            <br />
            {DEALER_CTA.titleLines[1]}
          </motion.h2>
          <motion.p className={styles.sub} variants={item}>{DEALER_CTA.sub}</motion.p>
          <motion.ul className={styles.who} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>
            {DEALER_CTA.who.map((w) => (
              <motion.li key={w} className={styles.whoTag} variants={tagVariants}>{w}</motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div className={styles.right} {...group(0.12, 0.2)}>
          <motion.div variants={item}>
            <a
              href="#contact"
              className={`${ui.btn} ${styles.btnWhite} ${ui.magnetic}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate({ section: 'contact', who: 'dealer', enquiry: 'trade' });
              }}
              {...magnetic}
            >
              {DEALER_CTA.primary} <span className={ui.arrow} aria-hidden="true">→</span>
            </a>
          </motion.div>
          <motion.div variants={item}>
            <button type="button" className={`${ui.btn} ${styles.btnGhost}`} onClick={onCatalogue}>
              <Icon name="download" size={16} strokeWidth={2.2} />
              {DEALER_CTA.secondary}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
