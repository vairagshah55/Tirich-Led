import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './LivingGallery.module.css';

const SPEED = 1.2; // px per animation frame

export default function LivingGallery({ items }) {
  const trackRef    = useRef(null);
  const posRef      = useRef(0);
  const rafRef      = useRef(null);
  const pausedRef   = useRef(false);
  const halfRef     = useRef(0);
  const magnetRef   = useRef(0);
  const progressRef = useRef(null);
  const loadedRef   = useRef(0);        // count of loaded images/videos
  const totalRef    = useRef(0);        // total media items to wait for
  const startedRef  = useRef(false);    // RAF started flag

  const [ready, setReady]           = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const doubled = [...items, ...items];
  const n = items.length;

  // ── Measure track width (called after media loads) ───────────────
  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const w = track.scrollWidth / 2;
    if (w > 0) halfRef.current = w;
  }, []);

  // ── Start animation loop once track is measured ──────────────────
  const startRAF = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const animate = () => {
      if (!pausedRef.current) {
        posRef.current += SPEED;
        if (halfRef.current > 0 && posRef.current >= halfRef.current) {
          posRef.current = 0;
        }
      }
      const x = posRef.current + magnetRef.current;
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${-x}px)`;
      }
      if (progressRef.current && halfRef.current > 0) {
        progressRef.current.style.width = `${(posRef.current / halfRef.current) * 100}%`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  // ── Called each time a media element finishes loading ────────────
  const onMediaLoad = useCallback(() => {
    loadedRef.current += 1;
    measure(); // re-measure as each item loads
    if (loadedRef.current >= totalRef.current) {
      measure(); // final accurate measure
      setReady(true);
      startRAF();
    }
  }, [measure, startRAF]);

  // ── Setup: count total media, add resize listener ────────────────
  useEffect(() => {
    // Count image items only (videos fire canplay, images fire load)
    totalRef.current = doubled.length;

    window.addEventListener('resize', measure);

    // Safety net: if media takes >2s, start anyway with whatever width we have
    const fallback = setTimeout(() => {
      measure();
      if (!startedRef.current) {
        setReady(true);
        startRAF();
      }
    }, 2000);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', measure);
      clearTimeout(fallback);
    };
  }, [measure, startRAF, doubled.length]);

  // ── Section mouse handlers ────────────────────────────────────────
  const onSectionEnter = () => { pausedRef.current = true; };
  const onSectionLeave = () => {
    pausedRef.current = false;
    magnetRef.current = 0;
    setHoveredIdx(null);
  };
  const onSectionMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    magnetRef.current = ((e.clientX - rect.left) / rect.width - 0.5) * 28;
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
        className={`${styles.track} ${hoveredIdx !== null ? styles.hasHover : ''} ${ready ? styles.trackReady : ''}`}
      >
        {doubled.map((item, i) => {
          const origIdx  = i % n;
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
                  preload="auto"
                  onCanPlay={onMediaLoad}
                  onError={onMediaLoad}   /* count errors so fallback still fires */
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.label}
                  className={styles.media}
                  loading="eager"
                  decoding="async"
                  onLoad={onMediaLoad}
                  onError={onMediaLoad}   /* count errors so fallback still fires */
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
                <p className={styles.aiBadge}>Tirich LED · Precision Lighting</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className={styles.progressWrap}>
        <div ref={progressRef} className={styles.progressBar} />
      </div>
    </div>
  );
}
