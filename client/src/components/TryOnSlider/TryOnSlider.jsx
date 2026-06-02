import React, { useRef, useState, useCallback } from 'react';
import styles from './TryOnSlider.module.css';

/**
 * Drag-to-reveal before/after slider.
 * Left (before): the same image with a "raw/unprocessed" CSS filter.
 * Right (after): full-color "AI enhanced" version.
 */
export default function TryOnSlider({
  image,
  labelA = 'Before',
  labelB = 'After',
}) {
  const containerRef = useRef(null);
  const [pos, setPos] = useState(48);   // % from left
  const dragging = useRef(false);

  const update = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(4, Math.min(clientX - rect.left, rect.width - 4));
    setPos((x / rect.width) * 100);
  }, []);

  const onMouseDown  = ()  => { dragging.current = true; };
  const onMouseUp    = ()  => { dragging.current = false; };
  const onMouseMove  = (e) => { if (dragging.current) update(e.clientX); };
  const onTouchStart = ()  => { dragging.current = true; };
  const onTouchMove  = (e) => { e.preventDefault(); update(e.touches[0].clientX); };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchEnd={onMouseUp}
    >
      {/* ── After (right) — full color vivid ── */}
      <div className={styles.after}>
        <img src={image} alt={labelB} className={styles.img} loading="lazy" />
        <span className={`${styles.label} ${styles.labelRight}`}>{labelB}</span>
      </div>

      {/* ── Before (left) — clipped, desaturated "raw" look ── */}
      <div
        className={styles.before}
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img src={image} alt={labelA} className={`${styles.img} ${styles.imgBefore}`} loading="lazy" />
        <span className={`${styles.label} ${styles.labelLeft}`}>{labelA}</span>
      </div>

      {/* ── Drag handle ── */}
      <div className={styles.handle} style={{ left: `${pos}%` }}>
        <div className={styles.handleLine} />
        <div
          className={styles.handleBtn}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          role="slider"
          aria-valuenow={Math.round(pos)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
            <path
              d="M7 4L1 11L7 18M15 4L21 11L15 18"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
