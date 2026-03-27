import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './LivingGallery.module.css';

const SPEED = 1.2;
const CARD_WIDTH = 210;
const CARD_HEIGHT = 373;
const OBSERVER_ROOT_MARGIN = '35% 0px';

const GalleryCard = memo(function GalleryCard({
  item,
  origIdx,
  isClone,
  isHovered,
  isDimmed,
  shouldLoad,
  isLoaded,
  onMediaLoad,
  onHoverStart,
  onHoverEnd,
}) {
  const cardClassName = [
    styles.card,
    isHovered ? styles.hovered : '',
    isLoaded ? styles.cardLoaded : '',
    isDimmed ? styles.cardDimmed : '',
  ].filter(Boolean).join(' ');

  return (
    <article
      className={cardClassName}
      onMouseEnter={() => onHoverStart(origIdx)}
      onMouseLeave={onHoverEnd}
      aria-hidden={isClone}
    >
      {!isLoaded && <div className={styles.skeleton} aria-hidden="true" />}

      {shouldLoad && (item.type === 'video' ? (
        <video
          src={item.src}
          poster={item.poster}
          className={`${styles.media} ${isLoaded ? styles.mediaLoaded : ''}`}
          autoPlay
          muted
          loop
          playsInline
          preload={origIdx < 2 ? 'metadata' : 'none'}
          onLoadedData={() => onMediaLoad(origIdx)}
          onCanPlay={() => onMediaLoad(origIdx)}
          onError={() => onMediaLoad(origIdx)}
        />
      ) : (
        <picture>
          {item.webpSrc ? <source srcSet={item.webpSrc} type="image/webp" /> : null}
          <img
            src={item.src}
            alt={item.label}
            className={`${styles.media} ${isLoaded ? styles.mediaLoaded : ''}`}
            loading={origIdx < 2 ? 'eager' : 'lazy'}
            fetchPriority={origIdx < 2 ? 'high' : 'auto'}
            decoding="async"
            width={item.width || CARD_WIDTH}
            height={item.height || CARD_HEIGHT}
            sizes="(max-width: 480px) 68vw, (max-width: 767px) 62vw, 210px"
            onLoad={() => onMediaLoad(origIdx)}
            onError={() => onMediaLoad(origIdx)}
          />
        </picture>
      ))}

      <div className={styles.caption}>
        <p className={styles.captionEyebrow}>{item.eyebrow}</p>
        <p className={styles.captionLabel}>{item.label}</p>
        <p className={styles.aiBadge}>Tirich LED &middot; Precision Lighting</p>
      </div>
    </article>
  );
});

export default function LivingGallery({ items }) {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const posRef = useRef(0);
  const rafRef = useRef(null);
  const pausedRef = useRef(false);
  const halfRef = useRef(0);
  const magnetRef = useRef(0);
  const progressRef = useRef(null);
  const visibleRef = useRef(false);

  // Touch drag refs
  const isTouching = useRef(false);
  const touchLastX = useRef(0);

  const [ready, setReady] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loadedMap, setLoadedMap] = useState({});
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const doubled = useMemo(
    () => [...items, ...items].map((item, index) => ({
      ...item,
      cloneIndex: index,
      origIdx: index % items.length,
      isClone: index >= items.length,
    })),
    [items]
  );

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const width = track.scrollWidth / 2;
    if (width > 0) {
      halfRef.current = width;
    }
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        setIsVisible(entry.isIntersecting);

        if (entry.isIntersecting) {
          setShouldLoad(true);
        }
      },
      {
        rootMargin: OBSERVER_ROOT_MARGIN,
        threshold: 0.01,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const animate = () => {
      if (!pausedRef.current && visibleRef.current) {
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
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;

    const track = trackRef.current;
    if (!track) return;

    setReady(true);
    measure();

    const resizeObserver = new ResizeObserver(() => {
      measure();
    });

    resizeObserver.observe(track);
    window.addEventListener('resize', measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure, shouldLoad]);

  const onMediaLoad = useCallback((index) => {
    setLoadedMap((prev) => {
      if (prev[index]) return prev;
      return { ...prev, [index]: true };
    });
  }, []);

  const onSectionEnter = () => {
    // keep scrolling — do not pause
  };

  const onSectionLeave = () => {
    magnetRef.current = 0;
    setHoveredIdx(null);
  };

  const onSectionMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    magnetRef.current = ((event.clientX - rect.left) / rect.width - 0.5) * 28;
  };

  const onTouchStart = useCallback((e) => {
    isTouching.current = true;
    pausedRef.current = true;
    touchLastX.current = e.touches[0].clientX;
  }, []);

  const onTouchMove = useCallback((e) => {
    if (!isTouching.current) return;
    const delta = touchLastX.current - e.touches[0].clientX;
    touchLastX.current = e.touches[0].clientX;
    posRef.current += delta;
    if (halfRef.current > 0) {
      if (posRef.current >= halfRef.current) posRef.current -= halfRef.current;
      if (posRef.current < 0) posRef.current += halfRef.current;
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    isTouching.current = false;
    pausedRef.current = false;
  }, []);

  return (
    <div
      ref={wrapRef}
      className={styles.wrap}
      onMouseEnter={onSectionEnter}
      onMouseLeave={onSectionLeave}
      onMouseMove={onSectionMove}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        ref={trackRef}
        className={`${styles.track} ${ready ? styles.trackReady : ''} ${isVisible ? styles.trackActive : ''}`}
      >
        {doubled.map((item) => (
          <GalleryCard
            key={`${item.label}-${item.cloneIndex}`}
            item={item}
            origIdx={item.origIdx}
            isClone={item.isClone}
            isHovered={hoveredIdx === item.origIdx}
            isDimmed={hoveredIdx !== null && hoveredIdx !== item.origIdx}
            shouldLoad={shouldLoad}
            isLoaded={Boolean(loadedMap[item.origIdx])}
            onMediaLoad={onMediaLoad}
            onHoverStart={setHoveredIdx}
            onHoverEnd={() => setHoveredIdx(null)}
          />
        ))}
      </div>

      <div className={styles.edgeFade} aria-hidden="true" />

      <div className={styles.progressWrap}>
        <div ref={progressRef} className={styles.progressBar} />
      </div>
    </div>
  );
}