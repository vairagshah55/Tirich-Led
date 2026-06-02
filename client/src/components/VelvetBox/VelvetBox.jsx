import React, { useRef, useEffect } from 'react';
import styles from './VelvetBox.module.css';

export default function VelvetBox({ image }) {
  const containerRef = useRef(null);
  const lidRef       = useRef(null);
  const necklaceRef  = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const lid       = lidRef.current;
    const necklace  = necklaceRef.current;
    if (!container || !lid || !necklace) return;

    const onScroll = () => {
      const rect     = container.getBoundingClientRect();
      const total    = container.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / total));

      // Lid swings open: starts -18deg (slightly ajar) → -115deg
      lid.style.transform = `rotateX(${-18 + progress * -97}deg)`;

      // Necklace lifts out — starts at 50% opacity already visible
      const lift = progress * 65;
      const sc   = 0.88 + progress * 0.12;
      necklace.style.transform = `translateX(-50%) translateY(${-lift}px) scale(${sc})`;
      necklace.style.opacity   = String(0.5 + progress * 0.5);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // set initial state
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.sticky}>
        <div className={styles.scene}>
          {/* Lid — JS drives rotateX */}
          <div ref={lidRef} className={styles.lid}>
            <div className={styles.lidRim} />
          </div>

          {/* Box body */}
          <div className={styles.box}>
            <div className={styles.velvetFloor} />
            <div className={styles.vignette} />
            <img
              ref={necklaceRef}
              src={image}
              alt="Necklace in velvet box"
              className={styles.necklace}
              loading="lazy"
            />
          </div>
        </div>

        {/* Caption */}
        <div className={styles.caption}>
          <p className={styles.captionEyebrow}>Unboxing</p>
          <h2 className={styles.captionTitle}>A Moment Worthy of the Piece</h2>
          <p className={styles.captionSub}>Scroll to reveal</p>
        </div>
      </div>
    </div>
  );
}
