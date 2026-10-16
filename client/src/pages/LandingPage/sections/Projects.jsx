import { motion } from 'motion/react';
import Icon from '../../../components/Icon/Icon';
import { PROJECTS, PROJECTS_SECTION, WHATSAPP_URL } from '../homeContent';
import { group, item, itemScale, reveal, useSpotlight } from '../homeMotion';
import ui from '../LandingPage.module.css';
import styles from './Projects.module.css';

const PORTFOLIO_URL = `${WHATSAPP_URL}?text=${encodeURIComponent(PROJECTS_SECTION.ctaMessage)}`;

export default function Projects() {
  const spot = useSpotlight();

  return (
    <section id="projects" className={`${ui.section} ${ui.onDark} ${styles.section}`}>
      <div className={ui.container}>
        <motion.div {...group(0.1)}>
          <motion.p className={ui.eyebrow} variants={item}>{PROJECTS_SECTION.eyebrow}</motion.p>
          <motion.h2 className={ui.sectionH} variants={item}>{PROJECTS_SECTION.title}</motion.h2>
          <motion.p className={ui.sectionP} variants={item}>{PROJECTS_SECTION.lead}</motion.p>
        </motion.div>

        <motion.ul className={styles.grid} onPointerMove={spot} {...group(0.09)}>
          {PROJECTS.map((p) => (
            <motion.li
              key={p.name}
              className={`${styles.cell}${p.big ? ` ${styles.cellBig}` : ''}`}
              variants={itemScale}
            >
              <article className={`${styles.card}${p.big ? ` ${styles.big}` : ''}`} data-spot>
                <div className={styles.bgIcon} aria-hidden="true">
                  <Icon name={p.icon} size={p.big ? 220 : 120} strokeWidth={0.8} />
                </div>
                <div className={styles.overlay} aria-hidden="true" />
                <div className={styles.content}>
                  <span className={styles.type}>{p.type}</span>
                  <h3 className={styles.name}>{p.name}</h3>
                  <p className={styles.loc}>{p.loc}</p>
                  <p className={styles.stat}>
                    <Icon name="downlight" size={13} strokeWidth={2} />
                    {p.stat}
                  </p>
                </div>
              </article>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div className={`${ui.ctaRow} ${styles.ctaRow}`} {...reveal(0.05, 16)}>
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${ui.btn} ${ui.btnOutlineWhite}`}
          >
            {PROJECTS_SECTION.cta} <span className={ui.arrow} aria-hidden="true">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
