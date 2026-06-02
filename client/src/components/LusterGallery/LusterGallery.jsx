import React, { useCallback } from 'react';
import styles from './LusterGallery.module.css';

/**
 * Three-column jewelry gallery where a specular "glint"
 * follows the cursor — mimicking light catching a gem.
 */
export default function LusterGallery({ items }) {
  const onMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--gx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--gy', `${e.clientY - rect.top}px`);
  }, []);

  const onMouseLeave = useCallback((e) => {
    // Move glint far off-screen so it disappears cleanly
    e.currentTarget.style.setProperty('--gx', '-400px');
    e.currentTarget.style.setProperty('--gy', '-400px');
  }, []);

  return (
    <div className={styles.grid}>
      {items.map((item, i) => (
        <div
          key={i}
          className={styles.item}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          data-reveal
          style={{ transitionDelay: `${i * 0.14}s` }}
        >
          <div className={styles.mediaWrap}>
            <img src={item.image} alt={item.label} className={styles.img} loading="lazy" />

            {/* Soft radial glow that follows cursor */}
            <div className={styles.glowLayer} />

            {/* Sharp starburst point at exact cursor */}
            <div className={styles.starLayer} />

            {/* Pearl nacre iridescent shimmer */}
            <div className={styles.nacreLayer} />
          </div>

          <div className={styles.info}>
            <span className={styles.infoEyebrow}>{item.eyebrow}</span>
            <span className={styles.infoLabel}>{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
