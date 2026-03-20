import { useEffect, useRef, useState } from 'react';
import styles from './LivingGallery.module.css';

const SPEED = 1.2; // px per animation frame

export default function LivingGallery({ items }) {
  const trackRef    = useRef(null);
  const posRef      = useRef(0);
  const rafRef      = useRef(null);
  const pausedRef   = useRef(false);
  const halfRef     = useRef(0);        // scrollWidth / 2 (one full set)
  const magnetRef   = useRef(0);        // magnetic X offset
  const progressRef = useRef(null);

  const [hoveredIdx, setHoveredIdx] = useState(null); // index within one set

  // Build doubled list once (for seamless loop)
  const doubled = [...items, ...items];
  const n = items.length;

  // ── Measure & start RAF ───────────────────────────────────────
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => { halfRef.current = track.scrollWidth / 2; };
    measure();
    window.addEventListener('resize', measure);

    const animate = () => {
      if (!pausedRef.current) {
        posRef.current += SPEED;
        if (posRef.current >= halfRef.current) posRef.current = 0;
      }

      const x = posRef.current + magnetRef.current;
      track.style.transform = `translateX(${-x}px)`;

      if (progressRef.current && halfRef.current > 0) {
        const pct = (posRef.current / halfRef.current) * 100;
        progressRef.current.style.width = `${pct}%`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', measure);
    };
  }, []);

  // ── Section mouse handlers ───────────────────────────────────
  const onSectionEnter = () => { pausedRef.current = true; };
  const onSectionLeave = () => {
    pausedRef.current = false;
    magnetRef.current = 0;
    setHoveredIdx(null);
  };
  const onSectionMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 → 0.5
    magnetRef.current = cx * 28; // max ±14px magnetic drift
  };

  return (
    <div
      className={styles.wrap}
      onMouseEnter={onSectionEnter}
      onMouseLeave={onSectionLeave}
      onMouseMove={onSectionMove}
    >
      <div
        ref={trackRef}
        className={`${styles.track} ${hoveredIdx !== null ? styles.hasHover : ''}`}
      >
        {doubled.map((item, i) => {
          const origIdx = i % n;
          const isHovered = hoveredIdx === origIdx;
          return (
            <div
              key={i}
              className={`${styles.card} ${isHovered ? styles.hovered : ''}`}
              onMouseEnter={() => setHoveredIdx(origIdx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {item.type === 'video' ? (
                <video
                  src={item.src}
                  className={styles.media}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.label}
                  className={styles.media}
                />
              )}

              {/* Play / Watch indicator */}
              <div className={styles.playBtn}>
                <span className={styles.playIcon}>▶</span>
                <span className={styles.playLabel}>Watch Result</span>
              </div>

              {/* Glassmorphism caption */}
              <div className={styles.caption}>
                <p className={styles.captionEyebrow}>{item.eyebrow}</p>
                <p className={styles.captionLabel}>{item.label}</p>
                <p className={styles.aiBadge}>AI-Generated · 4K Studio</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gold progress bar */}
      <div className={styles.progressWrap}>
        <div ref={progressRef} className={styles.progressBar} />
      </div>
    </div>
  );
}
