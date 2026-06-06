import { useState } from 'react';
import styles from './LightingCustomizer.module.css';

const LIGHTING = [
  { id: 'daylight',    label: '☀ Daylight',    filter: 'brightness(1.08) saturate(1.12) contrast(1.0)' },
  { id: 'candlelight', label: '🕯 Candlelight', filter: 'brightness(0.88) sepia(0.42) saturate(1.35) contrast(0.95)' },
  { id: 'studio',      label: '💡 Studio',      filter: 'brightness(1.14) contrast(1.25) saturate(0.88)' },
  { id: 'golden',      label: '✦ Golden Hour',  filter: 'brightness(0.95) hue-rotate(-8deg) sepia(0.25) saturate(1.45)' },
];

const SKIN_TONES = [
  { id: 'fair',   label: 'Fair',   filter: '' },
  { id: 'medium', label: 'Medium', filter: 'hue-rotate(-4deg) sepia(0.08) saturate(1.1)' },
  { id: 'warm',   label: 'Warm',   filter: 'hue-rotate(-10deg) sepia(0.18) saturate(1.18) brightness(0.96)' },
  { id: 'deep',   label: 'Deep',   filter: 'hue-rotate(-12deg) sepia(0.22) saturate(1.25) brightness(0.88)' },
];

export default function LightingCustomizer({ image, video }) {
  const [light, setLight] = useState('daylight');
  const [tone,  setTone]  = useState('fair');

  const lightFilter = LIGHTING.find((l) => l.id === light)?.filter   ?? '';
  const toneFilter  = SKIN_TONES.find((t) => t.id === tone)?.filter  ?? '';
  const combinedFilter = [lightFilter, toneFilter].filter(Boolean).join(' ');

  return (
    <div className={styles.wrap}>
      {/* ── Media ── */}
      <div className={styles.imageWrap}>
        {video ? (
          <video
            src={video}
            autoPlay
            muted
            loop
            playsInline
            className={styles.img}
            style={{
              filter: combinedFilter || 'none',
              transition: 'filter 0.55s ease',
            }}
          />
        ) : (
          <img
            src={image}
            alt="Jewelry lighting preview"
            className={styles.img}
            loading="lazy" decoding="async"
            style={{
              filter: combinedFilter || 'none',
              transition: 'filter 0.55s ease',
            }}
          />
        )}
        <div className={styles.activeLabel}>
          {LIGHTING.find((l) => l.id === light)?.label} ·{' '}
          {SKIN_TONES.find((t) => t.id === tone)?.label} Skin
        </div>
      </div>

      {/* ── Controls ── */}
      <div className={styles.controls}>
        {/* Lighting row */}
        <div className={styles.controlGroup}>
          <p className={styles.groupLabel}>Lighting</p>
          <div className={styles.btnRow}>
            {LIGHTING.map((l) => (
              <button
                key={l.id}
                className={`${styles.presetBtn} ${light === l.id ? styles.presetBtnActive : ''}`}
                onClick={() => setLight(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skin tone row */}
        <div className={styles.controlGroup}>
          <p className={styles.groupLabel}>Skin Tone</p>
          <div className={styles.btnRow}>
            {SKIN_TONES.map((t) => (
              <button
                key={t.id}
                className={`${styles.toneBtn} ${styles[`tone_${t.id}`]} ${tone === t.id ? styles.toneBtnActive : ''}`}
                onClick={() => setTone(t.id)}
                aria-label={t.label}
                title={t.label}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
