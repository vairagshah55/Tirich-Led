import { motion } from 'motion/react';
import { Star } from '../../../components/Icon/Icon';
import { TESTIMONIALS, TESTIMONIALS_SECTION } from '../homeContent';
import { group, item } from '../homeMotion';
import ui from '../LandingPage.module.css';
import styles from './Testimonials.module.css';

const starsVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
};

const starVariants = {
  hidden: { opacity: 0, scale: 0.3, rotate: -40 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 380, damping: 16 } },
};

export default function Testimonials() {
  return (
    <section className={`${ui.section} ${styles.section}`}>
      <div className={ui.container}>
        <motion.div {...group(0.1)}>
          <motion.p className={ui.eyebrow} variants={item}>{TESTIMONIALS_SECTION.eyebrow}</motion.p>
          <motion.h2 className={`${ui.sectionH} ${styles.heading}`} variants={item}>
            {TESTIMONIALS_SECTION.title}
          </motion.h2>
        </motion.div>

        <motion.ul className={styles.grid} {...group(0.12)}>
          {TESTIMONIALS.map((t) => (
            <motion.li key={t.name} className={styles.cell} variants={item}>
              <figure className={styles.card}>
                <motion.div
                  className={styles.stars}
                  variants={starsVariants}
                  role="img"
                  aria-label="Rated 5 out of 5"
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.span key={i} variants={starVariants} className={styles.star}>
                      <Star size={15} />
                    </motion.span>
                  ))}
                </motion.div>
                <blockquote className={styles.quote}>
                  <p>{`“${t.quote}”`}</p>
                </blockquote>
                <figcaption className={styles.author}>
                  <span className={styles.avatar} aria-hidden="true">{t.initials}</span>
                  <span>
                    <span className={styles.name}>{t.name}</span>
                    <span className={styles.role}>{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
