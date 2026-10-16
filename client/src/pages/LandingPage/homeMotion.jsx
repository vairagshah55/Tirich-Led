import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animate, useInView } from 'motion/react';
import { isPrerendering, prefersReducedMotion } from '../../utils/browser';
import { MOTION_EASE } from '../../utils/motion';

/**
 * Motion vocabulary for the homepage. Every section reveals with the same
 * curve and distances so the page reads as one system rather than twelve
 * separately-animated blocks.
 *
 * Reduced motion: LandingPage wraps everything in <MotionConfig
 * reducedMotion="user">, which drops the transforms and keeps the fades.
 */

export const EASE = MOTION_EASE;

/** Fires once, when a fifth of the element is on screen. */
export const VIEWPORT = { once: true, amount: 0.2 };

/** Spread on a motion element: fades and rises into place on scroll. */
export const reveal = (delay = 0, y = 28) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: VIEWPORT,
  transition: { duration: 0.75, delay, ease: EASE },
});

/** Parent variants: children using `item` animate in sequence. */
export const group = (stagger = 0.08, delay = 0) => ({
  initial: 'hidden',
  whileInView: 'show',
  viewport: VIEWPORT,
  variants: {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  },
});

export const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

export const itemScale = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

/**
 * A statistic that counts up the first time it scrolls into view.
 *
 * "500+", "CRI 95+", "50K" and "18" all work: the first run of digits
 * animates, whatever surrounds it stays put. The final value is what renders
 * first — so the pre-rendered HTML (and anyone without JS) gets the real
 * number — and it is only wound back to zero on the client, before paint,
 * when there is going to be an animation to watch.
 */
export function CountUp({ value, duration = 1.8 }) {
  const match = /^(\D*)(\d[\d,]*)(.*)$/.exec(value);
  const target = match ? Number(match[2].replace(/,/g, '')) : null;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [shown, setShown] = useState(target);
  const armed = useRef(false);

  useLayoutEffect(() => {
    if (target === null || isPrerendering() || prefersReducedMotion()) return;
    armed.current = true;
    setShown(0);
  }, [target]);

  useEffect(() => {
    if (!inView || !armed.current) return undefined;
    const controls = animate(0, target, {
      duration,
      ease: EASE,
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target, duration]);

  if (!match) return <span ref={ref}>{value}</span>;
  const [, before, , after] = match;
  return (
    <span ref={ref}>
      <span className="visually-hidden">{value}</span>
      <span aria-hidden="true">
        {before}
        {shown.toLocaleString('en-IN')}
        {after}
      </span>
    </span>
  );
}

/**
 * Cursor-following light for a grid of cards — fitting, for a lighting
 * brand. One pointermove handler on the grid; it finds the card under the
 * pointer ([data-spot]) and writes --sx / --sy on it. Each card's CSS paints
 * a radial glow at that point, so the cost is two custom properties per
 * frame, however many cards there are.
 */
export function useSpotlight() {
  const frame = useRef(0);
  const last = useRef(null);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return useCallback((e) => {
    if (e.pointerType === 'touch') return;
    const card = e.target.closest?.('[data-spot]');
    if (!card) return;
    last.current = { card, x: e.clientX, y: e.clientY };
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const { card: el, x, y } = last.current;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--sx', `${x - r.left}px`);
      el.style.setProperty('--sy', `${y - r.top}px`);
    });
  }, []);
}

/**
 * Magnetic pull for a primary CTA: the button leans toward the pointer and
 * springs back on leave. Plain elements only — on a motion component the
 * inline transform would fight motion's own.
 */
export function useMagnetic(strength = 0.22) {
  const onMouseMove = useCallback((e) => {
    if (prefersReducedMotion()) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  }, [strength]);

  const onMouseLeave = useCallback((e) => {
    e.currentTarget.style.transform = '';
  }, []);

  return { onMouseMove, onMouseLeave };
}
