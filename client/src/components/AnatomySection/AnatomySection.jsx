import React, { useEffect, useRef, useState } from 'react';
import styles from './AnatomySection.module.css';

const CALLOUTS = [
  {
    id: 'chip',
    label: 'SMD LED Chip',
    desc: 'High-efficiency SMD 2835 · 160 lm/W · CRI 95+ output',
    top: '22%',
    left: '48%',
    side: 'left',
  },
  {
    id: 'driver',
    label: 'Constant Current Driver',
    desc: 'Isolated driver · PF > 0.9 · THD < 10% · Surge 4 kV',
    top: '57%',
    left: '60%',
    side: 'right',
  },
  {
    id: 'heatsink',
    label: 'Aluminium Heat Sink',
    desc: 'Die-cast alloy body · Passive cooling · Junction temp < 45°C',
    top: '73%',
    left: '50%',
    side: 'left',
  },
];

export default function AnatomySection({ image }) {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.35 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className={styles.wrap}>
      <div className={styles.imageWrap}>
        <img src={image} alt="Anatomy of a Tirich LED panel light" className={styles.img} />

        {CALLOUTS.map((c, i) => {
          const delay      = i * 0.32;
          const textDelay  = delay + 0.42;
          const isLeft     = c.side === 'left';

          return (
            <div
              key={c.id}
              className={styles.callout}
              style={{
                top:  c.top,
                left: c.left,
                flexDirection: isLeft ? 'row-reverse' : 'row',
              }}
            >
              {/* Dot */}
              <div className={styles.dot} />

              {/* Line */}
              <div
                className={styles.line}
                style={{
                  width: active ? '90px' : '0',
                  transition: `width 0.5s ease ${delay}s`,
                }}
              />

              {/* Text bubble */}
              <div
                className={styles.bubble}
                style={{
                  opacity:   active ? 1 : 0,
                  transform: active
                    ? 'translateX(0)'
                    : `translateX(${isLeft ? '-12px' : '12px'})`,
                  transition: `opacity 0.4s ease ${textDelay}s, transform 0.4s ease ${textDelay}s`,
                }}
              >
                <strong className={styles.bubbleTitle}>{c.label}</strong>
                <p className={styles.bubbleDesc}>{c.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
