import { useEffect, useRef, useState } from 'react';
import styles from './TransformationEngine.module.css';

const PROMPTS = [
  'Scanning product specifications...',
  'Analysing luminous flux data...',
  'Configuring CCT & CRI parameters...',
  'Applying thermal simulation...',
  'Rendering product variations...',
  'Generating catalog assets...',
  'Exporting final deliverables...',
];

const FEATURES = [
  { icon: '✦', label: 'CRI 95+ Standard' },
  { icon: '©', label: 'IP65 Certified'    },
  { icon: '↓', label: 'Custom CCT & CRI'  },
];

export default function TransformationEngine({ sourceImage, outputs }) {
  const [promptIdx,     setPromptIdx]     = useState(0);
  const [revealed,      setRevealed]      = useState(false);
  const [hoveredOutput, setHoveredOutput] = useState(null);
  const wrapRef = useRef(null);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRevealed(true); },
      { threshold: 0.15 }
    );
    if (wrapRef.current) observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, []);

  // Cycling prompt text
  useEffect(() => {
    const id = setInterval(() => setPromptIdx(p => (p + 1) % PROMPTS.length), 1900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.engine} ref={wrapRef}>

      {/* ── Animated prompt / thinking bar ── */}
      <div className={styles.promptBar}>
        <span className={styles.promptDot} />
        <span className={styles.promptText} key={promptIdx}>{PROMPTS[promptIdx]}</span>
      </div>

      <div className={styles.layout}>

        {/* ── Input card (left) ── */}
        <div className={`${styles.inputPanel} ${revealed ? styles.inputVisible : ''}`}>
          <p className={styles.panelEyebrow}>Input</p>
          <div className={styles.inputCard}>
            <img
              src={sourceImage}
              alt="Original upload"
              className={styles.inputImg}
              loading="lazy"
            />
            {hoveredOutput && (
              hoveredOutput.type === 'video' ? (
                <video
                  key={hoveredOutput.video}
                  src={hoveredOutput.video}
                  className={styles.inputOverlay}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={hoveredOutput.image}
                  alt="AI preview"
                  className={styles.inputOverlay}
                  style={{ filter: hoveredOutput.filter }}
                  loading="lazy"
                />
              )
            )}
            <div className={styles.sourceBadge}>
              {hoveredOutput ? 'AI Preview' : 'Original Upload'}
            </div>
          </div>
        </div>

        {/* ── Pulse connector (middle) ── */}
        <div className={`${styles.connector} ${revealed ? styles.connectorVisible : ''}`}>
          <svg className={styles.pulseSvg} viewBox="0 0 120 40" fill="none">
            <path
              className={styles.pulsePath}
              d="M 8 20 L 100 20"
              stroke="rgba(197,163,104,0.55)"
              strokeWidth="1.5"
              strokeDasharray="10 7"
            />
            <path
              d="M 96 12 L 112 20 L 96 28"
              stroke="rgba(197,163,104,0.85)"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
          <span className={styles.connectorLabel}>AI</span>
        </div>

        {/* ── Output grid (right) ── */}
        <div className={styles.outputPanel}>
          <p className={styles.panelEyebrow}>AI Outputs</p>
          <div className={styles.outputGrid}>
            {outputs.map((o, i) => (
              <div
                key={o.label}
                className={`${styles.outputCard} ${revealed ? styles.outputVisible : ''}`}
                style={{ transitionDelay: `${0.25 + i * 0.07}s` }}
                onMouseEnter={() => setHoveredOutput(o)}
                onMouseLeave={() => setHoveredOutput(null)}
              >
                <div className={styles.imgWrap}>
                  {o.type === 'video' ? (
                    <video
                      src={o.video}
                      className={styles.outputImg}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={o.image}
                      alt={o.label}
                      className={styles.outputImg}
                      style={{ filter: o.filter }}
                      loading="lazy"
                    />
                  )}
                  <div className={styles.shimmer} />
                  <div className={styles.categoryBadge}>{o.category}</div>
                  {o.type === 'video' && <div className={styles.playBtn}>▶</div>}
                </div>
                <p className={styles.outputLabel}>{o.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Feature bar ── */}
      <div className={styles.featureBar}>
        {FEATURES.map((f) => (
          <div key={f.label} className={styles.featureItem}>
            <span className={styles.featureIcon}>{f.icon}</span>
            <span className={styles.featureLabel}>{f.label}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
