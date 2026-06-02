import { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { PRODUCTS } from '../../data/products';
import LeadCaptureModal, { hasLeadData } from '../../components/LeadCaptureModal/LeadCaptureModal';
import styles from './ProductDetailPage.module.css';

const EASE = [0.25, 1, 0.5, 1];
const REVEAL = { once: true, amount: 0.15 };

const SPECS_MAP = [
  { key: 'Wattage', field: 'wattage', icon: <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/> },
  { key: 'CRI', field: 'cri', icon: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></> },
  { key: 'CCT', field: 'cct', icon: <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></> },
  { key: 'IP Rating', field: 'ip', icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/> },
  { key: 'Rated Life', field: 'lifespan', icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
];

const INFO_TABS = [
  { id: 'diagram', label: 'Technical Drawing' },
  { id: 'features', label: 'Features' },
];

function LineDiagram({ product }) {
  const isPanel = product.categorySlug === 'panel-lights';
  const isHanging = product.categorySlug === 'hanging-lights' || product.categorySlug === 'pendant-lights';
  const isTrack = product.categorySlug === 'track-lights' || product.categorySlug === 'magnetic-track';
  const isCylinder = product.categorySlug === 'cylinder-lights' || product.categorySlug === 'downlights';

  return (
    <svg viewBox="0 0 400 280" fill="none" className={styles.diagram}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.line key={`h${i}`} x1="30" y1={30 + i * 45} x2="370" y2={30 + i * 45} stroke="rgba(38,34,98,0.04)" strokeWidth="0.5"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={REVEAL} transition={{ duration: 0.4, delay: i * 0.03, ease: EASE }} />
      ))}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <motion.line key={`v${i}`} x1={30 + i * 56.7} y1="30" x2={30 + i * 56.7} y2="255" stroke="rgba(38,34,98,0.04)" strokeWidth="0.5"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={REVEAL} transition={{ duration: 0.4, delay: i * 0.03, ease: EASE }} />
      ))}

      {isPanel ? (
        <>
          <motion.rect x="70" y="105" width="260" height="18" rx="3" stroke="#262262" strokeWidth="1.5" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={REVEAL} transition={{ duration: 0.8, delay: 0.15, ease: EASE }} />
          <motion.rect x="76" y="123" width="248" height="5" rx="1.5" stroke="#F7941E" strokeWidth="0.8" strokeDasharray="4 3" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={REVEAL} transition={{ duration: 0.6, delay: 0.4, ease: EASE }} />
          <motion.line x1="70" y1="85" x2="330" y2="85" stroke="#F7941E" strokeWidth="0.7" markerEnd="url(#arr)" markerStart="url(#arr)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={REVEAL} transition={{ duration: 0.5, delay: 0.6, ease: EASE }} />
          <motion.line x1="70" y1="85" x2="70" y2="100" stroke="#F7941E" strokeWidth="0.4" initial={{ opacity: 0 }} whileInView={{ opacity: 0.4 }} viewport={REVEAL} />
          <motion.line x1="330" y1="85" x2="330" y2="100" stroke="#F7941E" strokeWidth="0.4" initial={{ opacity: 0 }} whileInView={{ opacity: 0.4 }} viewport={REVEAL} />
          <motion.text x="200" y="80" textAnchor="middle" fontSize="9" fill="#F7941E" fontFamily="Space Grotesk" fontWeight="700" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={REVEAL} transition={{ delay: 0.8 }}>Width</motion.text>
          <motion.line x1="350" y1="105" x2="350" y2="128" stroke="#F7941E" strokeWidth="0.7" markerEnd="url(#arr)" markerStart="url(#arr)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={REVEAL} transition={{ duration: 0.4, delay: 0.7, ease: EASE }} />
          <motion.text x="368" y="120" fontSize="8" fill="#F7941E" fontFamily="Space Grotesk" fontWeight="600" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={REVEAL} transition={{ delay: 0.9 }}>10mm</motion.text>
          <motion.text x="200" y="155" textAnchor="middle" fontSize="8" fill="rgba(38,34,98,0.35)" fontFamily="Inter" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={REVEAL} transition={{ delay: 1 }}>LED Driver Housing · Anti-Glare Diffuser</motion.text>
          <motion.circle cx="100" cy="114" r="3" fill="rgba(247,148,30,0.2)" stroke="#F7941E" strokeWidth="0.6" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={REVEAL} transition={{ type: 'spring', delay: 0.5 }} />
          <motion.circle cx="300" cy="114" r="3" fill="rgba(247,148,30,0.2)" stroke="#F7941E" strokeWidth="0.6" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={REVEAL} transition={{ type: 'spring', delay: 0.55 }} />
        </>
      ) : isHanging ? (
        <>
          <motion.rect x="185" y="50" width="30" height="8" rx="2" stroke="#262262" strokeWidth="1.5" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={REVEAL} transition={{ duration: 0.5, delay: 0.15, ease: EASE }} />
          <motion.line x1="200" y1="58" x2="200" y2="115" stroke="#262262" strokeWidth="0.8" strokeDasharray="5 4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={REVEAL} transition={{ duration: 0.5, delay: 0.35, ease: EASE }} />
          <motion.path d="M155 115 L245 115 L228 175 L172 175 Z" stroke="#262262" strokeWidth="1.5" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={REVEAL} transition={{ duration: 0.7, delay: 0.5, ease: EASE }} />
          <motion.path d="M172 175 L145 230 M228 175 L255 230" stroke="#F7941E" strokeWidth="0.7" strokeDasharray="3 3" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={REVEAL} transition={{ duration: 0.5, delay: 0.9, ease: EASE }} />
          <motion.text x="270" y="85" fontSize="8" fill="#F7941E" fontFamily="Space Grotesk" fontWeight="600" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={REVEAL} transition={{ delay: 1 }}>Adjustable Cable</motion.text>
          <motion.text x="268" y="150" fontSize="8" fill="rgba(38,34,98,0.35)" fontFamily="Inter" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={REVEAL} transition={{ delay: 1.1 }}>Aluminium Shade</motion.text>
          <motion.text x="200" y="250" textAnchor="middle" fontSize="8" fill="rgba(247,148,30,0.4)" fontFamily="Inter" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={REVEAL} transition={{ delay: 1.2 }}>Light Cone Output</motion.text>
        </>
      ) : (isTrack || isCylinder) ? (
        <>
          <motion.rect x="55" y="70" width="290" height="10" rx="3" stroke="#262262" strokeWidth="1.5" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={REVEAL} transition={{ duration: 0.6, delay: 0.15, ease: EASE }} />
          <motion.rect x="160" y="80" width="80" height="55" rx="4" stroke="#262262" strokeWidth="1.5" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={REVEAL} transition={{ duration: 0.6, delay: 0.4, ease: EASE }} />
          <motion.circle cx="200" cy="135" r="14" stroke="#F7941E" strokeWidth="1" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={REVEAL} transition={{ duration: 0.5, delay: 0.6, ease: EASE }} />
          <motion.circle cx="200" cy="135" r="5" fill="rgba(247,148,30,0.15)" stroke="#F7941E" strokeWidth="0.7" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={REVEAL} transition={{ type: 'spring', stiffness: 200, delay: 0.8 }} />
          <motion.path d="M186 149 L168 215 M214 149 L232 215" stroke="#F7941E" strokeWidth="0.7" strokeDasharray="3 3" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={REVEAL} transition={{ duration: 0.5, delay: 0.9, ease: EASE }} />
          <motion.text x="265" y="105" fontSize="8" fill="rgba(38,34,98,0.35)" fontFamily="Inter" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={REVEAL} transition={{ delay: 1 }}>Heat Sink</motion.text>
          <motion.text x="235" y="140" fontSize="8" fill="#F7941E" fontFamily="Space Grotesk" fontWeight="600" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={REVEAL} transition={{ delay: 1.1 }}>COB LED</motion.text>
        </>
      ) : (
        <>
          <motion.rect x="100" y="80" width="200" height="100" rx="8" stroke="#262262" strokeWidth="1.5" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={REVEAL} transition={{ duration: 0.8, delay: 0.15, ease: EASE }} />
          <motion.circle cx="200" cy="130" r="22" stroke="#F7941E" strokeWidth="0.8" strokeDasharray="4 3" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={REVEAL} transition={{ duration: 0.6, delay: 0.5, ease: EASE }} />
          <motion.text x="200" y="210" textAnchor="middle" fontSize="9" fill="rgba(38,34,98,0.35)" fontFamily="Inter" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={REVEAL} transition={{ delay: 0.8 }}>{product.name} — Technical Drawing</motion.text>
        </>
      )}

      <defs>
        <marker id="arr" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5" fill="none" stroke="#F7941E" strokeWidth="0.8" />
        </marker>
      </defs>
    </svg>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const product = PRODUCTS.find((p) => p.slug === slug);
  const related = product ? PRODUCTS.filter((p) => p.categorySlug === product.categorySlug && p.slug !== slug).slice(0, 4) : [];
  const [activeTab, setActiveTab] = useState('diagram');
  const [showLeadModal, setShowLeadModal] = useState(() => !hasLeadData());
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  useEffect(() => { window.scrollTo(0, 0); setActiveTab('diagram'); }, [slug]);

  const switchTab = useCallback((id) => setActiveTab(id), []);

  if (!product) {
    return (
      <div className={styles.page}>
        <Navbar />
        <motion.div className={styles.notFound} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
          <h2 className={styles.nfTitle}>Product not found</h2>
          <p className={styles.nfText}>The product you're looking for doesn't exist.</p>
          <Link to="/products" className={styles.btnPrimary}>Browse All Products</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Breadcrumb */}
      <motion.div className={styles.bc} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className={styles.bcInner}>
          <Link to="/" className={styles.bcLink}>Home</Link>
          <span className={styles.bcSep}>/</span>
          <Link to="/products" className={styles.bcLink}>Products</Link>
          <span className={styles.bcSep}>/</span>
          <Link to={`/products?category=${product.categorySlug}`} className={styles.bcLink}>{product.category}</Link>
          <span className={styles.bcSep}>/</span>
          <span className={styles.bcCurr}>{product.name}</span>
        </div>
      </motion.div>

      {/* ── Hero ── */}
      <section ref={heroRef} className={styles.hero}>
        <div className={styles.heroGrid}>

          {/* Left — image with parallax */}
          <motion.div className={styles.imgCol} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <motion.div className={styles.imgCard} style={{ y: imgY }}>
              <motion.img src={product.image} alt={product.name} className={styles.heroImg} whileHover={{ scale: 1.03 }} transition={{ duration: 0.5, ease: EASE }} />
              <div className={styles.imgOverlay}>
                <span className={styles.imgBadge}>{product.ip}</span>
                <span className={styles.imgBadge}>CRI {product.cri}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — info */}
          <motion.div className={styles.infoCol} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.08, ease: EASE }}>
            <p className={styles.eyebrow}>
              <motion.span className={styles.eyebrowDot} animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
              {product.category}
            </p>
            <h1 className={styles.prodName}>{product.name}</h1>
            <p className={styles.prodTag}>{product.tagline}</p>

            {/* Inline specs strip */}
            <div className={styles.inlineSpecs}>
              {SPECS_MAP.slice(0, 3).map((s) => (
                <div key={s.key} className={styles.inlineSpec}>
                  <span className={styles.inlineSpecIcon}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
                  </span>
                  <div>
                    <span className={styles.inlineSpecLabel}>{s.key}</span>
                    <span className={styles.inlineSpecVal}>{product[s.field]}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className={styles.prodDesc}>{product.description}</p>

            <div className={styles.ctaRow}>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link to="/contact" className={styles.btnPrimary}>
                  Request a Quote
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link to="/products" className={styles.btnGhost}>All Products</Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Tabbed detail section ── */}
      <section className={styles.tabSection}>
        <div className={styles.tabWrap}>
          {/* Tab bar */}
          <div className={styles.tabBar}>
            {INFO_TABS.map((t) => (
              <button key={t.id} className={`${styles.tabBtn}${activeTab === t.id ? ` ${styles.tabBtnActive}` : ''}`} onClick={() => switchTab(t.id)}>
                {t.label}
              </button>
            ))}
            <motion.div
              className={styles.tabIndicator}
              initial={false}
              animate={{ x: `${INFO_TABS.findIndex((t) => t.id === activeTab) * 100}%` }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              style={{ width: `${100 / INFO_TABS.length}%` }}
            />
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === 'features' && (
              <motion.div key="features" className={styles.tabContent} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }}>
                <ul className={styles.featList}>
                  {product.features.map((f, i) => (
                    <motion.li key={f} className={styles.featItem} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: i * 0.05, ease: EASE }}>
                      <motion.span className={styles.featCheck} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15, delay: i * 0.05 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </motion.span>
                      {f}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {activeTab === 'diagram' && (
              <motion.div key="diagram" className={styles.tabContent} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }}>
                <div className={styles.diagramSplit}>
                  {/* Left — drawing */}
                  <div className={styles.diagramLeft}>
                    <p className={styles.diagramSub}>{product.name} — {product.tagline}</p>
                    <div className={styles.diagramWrap}>
                      <LineDiagram product={product} />
                    </div>
                  </div>
                  {/* Right — specs */}
                  <div className={styles.diagramRight}>
                    <h3 className={styles.diagramSpecsTitle}>Specifications</h3>
                    <div className={styles.diagramSpecs}>
                      {SPECS_MAP.map((s, i) => (
                        <motion.div
                          key={s.key}
                          className={styles.diagramSpecRow}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.35, delay: 0.1 + i * 0.06, ease: EASE }}
                        >
                          <span className={styles.diagramSpecIcon}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
                          </span>
                          <div className={styles.diagramSpecText}>
                            <span className={styles.diagramSpecLabel}>{s.key}</span>
                            <span className={styles.diagramSpecVal}>{product[s.field]}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Related ── */}
      {related.length > 0 && (
        <section className={styles.related}>
          <div className={styles.relatedInner}>
            <motion.div className={styles.relatedHead} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={REVEAL} transition={{ duration: 0.5, ease: EASE }}>
              <h2 className={styles.relatedTitle}>Related Products</h2>
              <Link to={`/products?category=${product.categorySlug}`} className={styles.relatedLink}>
                View All
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </motion.div>
            <motion.div className={styles.relatedGrid} initial="hidden" whileInView="visible" viewport={REVEAL} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}>
              {related.map((p) => (
                <motion.div key={p.slug} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                  <Link to={`/products/${p.slug}`} className={styles.relCard}>
                    <div className={styles.relImgWrap}><img src={p.image} alt={p.name} className={styles.relImg} loading="lazy" /></div>
                    <div className={styles.relBody}>
                      <span className={styles.relCat}>{p.category}</span>
                      <h3 className={styles.relName}>{p.name}</h3>
                      <p className={styles.relTag}>{p.tagline}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      <Footer />

      <LeadCaptureModal
        open={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        onSuccess={() => setShowLeadModal(false)}
        required
      />
    </div>
  );
}
