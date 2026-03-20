import { useEffect, useRef } from 'react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const prismRef = useRef(null);

  useEffect(() => {
    // Only on pointer (mouse) devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot   = dotRef.current;
    const ring  = ringRef.current;
    const prism = prismRef.current;
    if (!dot || !ring || !prism) return;

    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;
    let rafId;

    document.body.style.cursor = 'none';

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot follows instantly
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    };

    const animate = () => {
      // Ring lags behind with lerp
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      const pos = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      ring.style.transform  = pos;
      prism.style.transform = pos;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    const onEnter = (e) => {
      const tag = e.target.tagName;
      ring.classList.add(styles.expanded);
      dot.classList.add(styles.dotHidden);
      if (tag === 'IMG') {
        ring.dataset.label = 'View';
        prism.classList.add(styles.prismActive);
      } else {
        ring.dataset.label = '';
      }
    };
    const onLeave = () => {
      ring.classList.remove(styles.expanded);
      dot.classList.remove(styles.dotHidden);
      ring.dataset.label = '';
      prism.classList.remove(styles.prismActive);
    };

    const bindHoverables = () => {
      document.querySelectorAll('a, button, img').forEach((el) => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    bindHoverables();

    // Re-bind after 500ms to catch late-rendered elements
    const bindTimer = setTimeout(bindHoverables, 500);

    // ── Inverted cursor: dark on cream sections, gold on dark sections ──
    const onThemeEnter = (e) => {
      const theme = e.currentTarget.dataset.cursorTheme;
      if (theme === 'light') {
        dot.classList.add(styles.lightMode);
        ring.classList.add(styles.lightMode);
      } else {
        dot.classList.remove(styles.lightMode);
        ring.classList.remove(styles.lightMode);
      }
    };
    const bindThemes = () => {
      document.querySelectorAll('[data-cursor-theme]').forEach((el) => {
        el.addEventListener('mouseenter', onThemeEnter);
      });
    };
    bindThemes();
    const themeTimer = setTimeout(bindThemes, 500);

    document.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
      clearTimeout(bindTimer);
      clearTimeout(themeTimer);
      prism.classList.remove(styles.prismActive);
      dot.classList.remove(styles.lightMode);
      ring.classList.remove(styles.lightMode);
      document.querySelectorAll('a, button, img').forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      document.querySelectorAll('[data-cursor-theme]').forEach((el) => {
        el.removeEventListener('mouseenter', onThemeEnter);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef}   className={styles.dot}   />
      <div ref={ringRef}  className={styles.ring}  />
      <div ref={prismRef} className={styles.prism} />
    </>
  );
}
