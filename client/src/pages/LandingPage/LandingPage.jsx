import { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import Navbar from '../../components/Navbar/Navbar';
import styles from './LandingPage.module.css';
import { buttonHover, buttonTap, cardHover, fadeIn, fadeUp } from '../../utils/motion';

// ── Product Images ─────────────────────────────────────────────────

// ── HD Product Images ───────────────────────────────────────────────
import hdTLC121   from '../../assets/HD PHOTO/TLC-121.png';
import hdTLC333   from '../../assets/HD PHOTO/TLC-333.png';
import hdTLC118   from '../../assets/HD PHOTO/TLC-118.jpg';
import hdTLC107W  from '../../assets/HD PHOTO/TLC-107 WHITE.png';
import hdTLC108   from '../../assets/HD PHOTO/TLC-108.png';
import hdHanging  from '../../assets/HD PHOTO/HANGING LIGHT/15/PNG/HANGING LIGHT.png';
import hdMagCOB   from '../../assets/HD PHOTO/CYLINDER/3/PNG/MAGNETIC COB.png';
import heroVideo  from '../../assets/grok-video-1ae0e23a-fbb4-4bec-993c-fb8c0b748c3f.mp4';
import proVid1    from '../../assets/grok-video-083a2972-e0c2-44a4-b856-38ebb91513b1.mp4';
import proVid2    from '../../assets/grok-video-1d4fef8d-119d-4f9f-8d71-650ca413f8be.mp4';
import proVid3    from '../../assets/grok-video-2ca8b0c1-823e-4d11-a036-24e495b32dc3.mp4';

import LusterGallery          from '../../components/LusterGallery/LusterGallery';
import LivingGallery          from '../../components/LivingGallery/LivingGallery';

// ── Gallery items (Luster) ────────────────────────────────────────
const GALLERY_ITEMS = [
  { eyebrow: 'Panel Series',    label: 'TLC-121 Premium Panel', image: hdTLC121  },
  { eyebrow: 'Track Lighting',  label: 'Magnetic COB Fixture',  image: hdMagCOB  },
  { eyebrow: 'Pendant Series',  label: 'Pendant LED Fixture',   image: hdHanging },
];

// ── Living Gallery items ──────────────────────────────────────────
const LIVING_GALLERY = [
  { label: 'TLC-121 Premium Panel',  eyebrow: 'Panel Series',       type: 'image', src: hdTLC121   },
  { label: 'Pendant Hanging Light',  eyebrow: 'Pendant Series',     type: 'image', src: hdHanging  },
  { label: 'LED Project Reel',       eyebrow: 'Installation Reel',  type: 'video', src: proVid1    },
  { label: 'TLC-107 Round Pendant',  eyebrow: 'Pendant Series',     type: 'image', src: hdTLC107W  },
  { label: 'TLC-118 Panel',          eyebrow: 'Panel Series',       type: 'image', src: hdTLC118   },
  { label: 'Magnetic COB Fixture',   eyebrow: 'Track Lighting',     type: 'image', src: hdMagCOB   },
  { label: 'LED Campaign',           eyebrow: 'Commercial Install', type: 'video', src: proVid2    },
  { label: '10Z Caset Track Light',  eyebrow: 'Track Series',       type: 'image', src: hdTLC333   },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Design Consultation',    body: 'Share your project specifications — space dimensions, application type, desired colour temperature, lumen output, and IP rating. Our engineers map out the optimal solution.' },
  { step: '02', title: 'Custom Engineering',     body: 'Our R&D team configures the ideal LED assembly — custom CCT, CRI, wattage, optics, and driver specs — tailored precisely to your environment.' },
  { step: '03', title: 'Quality Manufacturing',  body: 'Every unit is factory-tested for luminous flux, colour accuracy, thermal performance, and international safety certifications before shipping.' },
];

const STATS = [
  { value: '500+',   label: 'Products Available' },
  { value: 'CRI 95', label: 'Colour Standard'    },
  { value: '50K hrs', label: 'Lifespan Rating'   },
  { value: 'IP65',   label: 'Weather Certified'  },
];


// ── Hero slides — each with its own video + copy ─────────────────
const HERO_SLIDES = [
  {
    video:   heroVideo,
    tag:     'Premium LED Manufacturing',
    title:   ['Where Every', 'Beam', 'Powers a Vision'],
    accent:  1,
    sub:     'Industrial-grade LED solutions for commercial, residential, and architectural applications.',
  },
  {
    video:   proVid1,
    tag:     'Commercial Lighting',
    title:   ['Precision', 'Engineered', 'for Performance'],
    accent:  0,
    sub:     'Every product tested for luminous flux, colour accuracy, and thermal consistency.',
  },
  {
    video:   proVid2,
    tag:     'Architectural Lighting',
    title:   ['Light That', 'Defines', 'Your Space'],
    accent:  1,
    sub:     'From strip LEDs to pendant fixtures — tailored illumination for every environment.',
  },
  {
    video:   proVid3,
    tag:     'Manufacturing Excellence',
    title:   ['50,000 Hours', 'of Reliable', 'Illumination'],
    accent:  0,
    sub:     'CE & RoHS certified. IP65 rated. Built for the most demanding conditions.',
  },
];

// ── Bokeh particle definitions ────────────────────────────────────
const BOKEH = [
  { speedX: 0.025, speedY: 0.018, w: 80,  h: 80,  l: '74%', t: '18%', blur: 25, op: 0.12 },
  { speedX: 0.04,  speedY: 0.03,  w: 50,  h: 50,  l: '88%', t: '38%', blur: 18, op: 0.09 },
  { speedX: 0.015, speedY: 0.022, w: 120, h: 120, l: '60%', t: '55%', blur: 35, op: 0.06 },
  { speedX: 0.05,  speedY: 0.04,  w: 32,  h: 32,  l: '82%', t: '65%', blur: 12, op: 0.18 },
  { speedX: 0.03,  speedY: 0.025, w: 65,  h: 65,  l: '68%', t: '78%', blur: 22, op: 0.08 },
  { speedX: 0.035, speedY: 0.02,  w: 45,  h: 45,  l: '55%', t: '28%', blur: 16, op: 0.11 },
  { speedX: 0.02,  speedY: 0.035, w: 90,  h: 90,  l: '78%', t: '88%', blur: 30, op: 0.05 },
  { speedX: 0.045, speedY: 0.022, w: 28,  h: 28,  l: '92%', t: '50%', blur: 10, op: 0.20 },
  { speedX: 0.028, speedY: 0.038, w: 55,  h: 55,  l: '65%', t: '42%', blur: 20, op: 0.08 },
  { speedX: 0.018, speedY: 0.012, w: 100, h: 100, l: '85%', t: '22%', blur: 32, op: 0.04 },
];

// ── Scroll-to (no hash in URL, gold glow on section) ─────────────
const scrollToSection = (id) => (e) => {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth' });
  el.classList.add('js-section-glow');
  setTimeout(() => el.classList.remove('js-section-glow'), 1000);
};

// ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate  = useNavigate();
  const { search } = useLocation();

  // ── Scroll to section when navigated from another page ───────
  useEffect(() => {
    const params  = new URLSearchParams(search);
    const section = params.get('section');
    if (section) {
      const timer = setTimeout(() => {
        const el = document.getElementById(section);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [search]);

  // ── Refs ─────────────────────────────────────────────────────
  const heroBgRef           = useRef(null);
  const heroContentRef      = useRef(null);
  const bokehRefs           = useRef([]);
  const heroVidRefs         = useRef([]);
  const [activeVidIdx,  setActiveVidIdx]  = useState(0);
  const [displaySlide,  setDisplaySlide]  = useState(0);
  const [textVisible,   setTextVisible]   = useState(true);

  // ── 1. Blur-to-Focus Reveal ──────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('js-revealed');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ── 2. Hero Parallax ─────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      if (heroBgRef.current)
        heroBgRef.current.style.transform = `scale(1.03) translateY(${window.scrollY * 0.12}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── 3. Hero Video Auto-Advance ────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveVidIdx(prev => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeVidIdx]);

  // Text fade-out → swap content → fade-in on slide change
  useEffect(() => {
    setTextVisible(false);
    const t = setTimeout(() => {
      setDisplaySlide(activeVidIdx);
      setTextVisible(true);
    }, 380);
    return () => clearTimeout(t);
  }, [activeVidIdx]);

  useEffect(() => {
    const vid = heroVidRefs.current[activeVidIdx];
    if (vid) { vid.currentTime = 0; vid.play().catch(() => {}); }
  }, [activeVidIdx]);


  // ── 4. Hero: 3D Tilt + Bokeh Mouse Parallax ─────────────────
  const onHeroMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width  - 0.5;
    const cy = (e.clientY - rect.top)  / rect.height - 0.5;

    if (heroContentRef.current) {
      heroContentRef.current.style.transition = 'transform 0.08s ease';
      heroContentRef.current.style.transform  =
        `perspective(900px) rotateX(${cy * -7}deg) rotateY(${cx * 7}deg)`;
    }
    bokehRefs.current.forEach((el, i) => {
      if (!el) return;
      const b = BOKEH[i];
      el.style.transition = 'none';
      el.style.transform  = `translate(${cx * b.speedX * 120}px, ${cy * b.speedY * 120}px)`;
    });
  }, []);

  const onHeroMouseLeave = useCallback(() => {
    if (heroContentRef.current) {
      heroContentRef.current.style.transition = 'transform 0.65s ease';
      heroContentRef.current.style.transform  = 'perspective(900px) rotateX(0) rotateY(0)';
    }
    bokehRefs.current.forEach((el) => {
      if (!el) return;
      el.style.transition = 'transform 0.65s ease';
      el.style.transform  = 'translate(0, 0)';
    });
  }, []);

  // ── 5. Magnetic buttons ───────────────────────────────────────
  const onMagMove  = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.transform =
      `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
  }, []);
  const onMagEnter = useCallback((e) => { e.currentTarget.style.transition = 'transform 0.1s ease'; }, []);
  const onMagLeave = useCallback((e) => {
    e.currentTarget.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)';
    e.currentTarget.style.transform  = '';
  }, []);
  const mag = { onMouseMove: onMagMove, onMouseEnter: onMagEnter, onMouseLeave: onMagLeave };

  return (
    <div className={styles.page}>

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <Navbar />

      {/* ── HERO: VIDEO CAROUSEL + 3D TILT + BOKEH ──────────────── */}
      <section
        className={styles.hero}
        id="hero"
        onMouseMove={onHeroMouseMove}
        onMouseLeave={onHeroMouseLeave}
      >
        {/* ── Video slides ── */}
        <div ref={heroBgRef} className={styles.heroVideos}>
          {HERO_SLIDES.map(({ video }, i) => (
            <video
              key={i}
              ref={el => { heroVidRefs.current[i] = el; }}
              className={`${styles.heroVideoSlide}${i === HERO_SLIDES.length - 1 ? ` ${styles.heroVideoSlideLast}` : ''}${i === activeVidIdx ? ` ${styles.heroVideoSlideActive}` : ''}`}
              style={{ transform: `scale(${i < 3 ? 1.1 : 1.03})` }}
              src={video}
              autoPlay
              muted
              loop
              playsInline
            />
          ))}
        </div>

        {/* Layered overlay: left-dark for text, right-lighter for depth */}
        <div className={styles.heroOverlay} />
        <div className={styles.heroOverlayRight} />

        {/* Bokeh particles — depth parallax on mouse move */}
        {BOKEH.map((b, i) => (
          <div
            key={i}
            ref={(el) => { bokehRefs.current[i] = el; }}
            className={styles.bokeh}
            style={{ width: b.w, height: b.h, left: b.l, top: b.t, filter: `blur(${b.blur}px)`, opacity: b.op }}
          />
        ))}

        {/* ── Hero text content ── */}
        <motion.div
          ref={heroContentRef}
          className={`${styles.heroContent} ${textVisible ? styles.heroTextIn : styles.heroTextOut}`}
          {...fadeUp(0.12, 24)}
        >
          {/* Left accent bar */}
          <div className={styles.heroBar} />

          <div className={styles.heroContentInner}>
            {/* Slide number */}
            <span className={styles.heroSlideNum}>
              {String(displaySlide + 1).padStart(2, '0')}
              <span className={styles.heroSlideTotal}> / {String(HERO_SLIDES.length).padStart(2, '0')}</span>
            </span>

            {/* Category tag */}
            <p className={styles.heroEyebrow}>
              <span className={styles.heroEyebrowDiamond}>◆</span>
              {HERO_SLIDES[displaySlide].tag}
            </p>

            {/* Title — word-level accent */}
            <h1 className={styles.heroTitle}>
              {HERO_SLIDES[displaySlide].title.map((line, li) => (
                <span
                  key={li}
                  className={`${styles.heroTitleLine} ${li === HERO_SLIDES[displaySlide].accent ? styles.heroTitleAccent : ''}`}
                >
                  {line}
                  {li < HERO_SLIDES[displaySlide].title.length - 1 && <br />}
                </span>
              ))}
            </h1>

            {/* Gold rule */}
            <div className={styles.heroRule} />

            {/* Subtitle */}
            <p className={styles.heroSubtitle}>{HERO_SLIDES[displaySlide].sub}</p>

            {/* CTAs */}
            <div className={styles.heroActions}>
              <motion.button className={styles.heroBtnPrimary} onClick={() => navigate('/products')} {...mag} whileHover={buttonHover} whileTap={buttonTap}>
                Explore Products
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </motion.button>
              <motion.a href="#collections" className={styles.heroBtnGhost} onClick={scrollToSection('collections')} {...mag} whileHover={buttonHover} whileTap={buttonTap}>
                View Catalogue
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* ── Prev / Next arrows ── */}
        <motion.button
          className={`${styles.heroArrow} ${styles.heroArrowLeft}`}
          onClick={() => setActiveVidIdx(i => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          aria-label="Previous video"
          whileHover={buttonHover}
          whileTap={buttonTap}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </motion.button>
        <motion.button
          className={`${styles.heroArrow} ${styles.heroArrowRight}`}
          onClick={() => setActiveVidIdx(i => (i + 1) % HERO_SLIDES.length)}
          aria-label="Next video"
          whileHover={buttonHover}
          whileTap={buttonTap}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </motion.button>

        {/* ── Dot indicators (bottom-right) ── */}
        <div className={styles.heroDots}>
          {HERO_SLIDES.map((_, i) => (
            <motion.button
              key={i}
              className={`${styles.heroDot}${i === activeVidIdx ? ` ${styles.heroDotActive}` : ''}`}
              onClick={() => setActiveVidIdx(i)}
              aria-label={`Slide ${i + 1}`}
              whileHover={{ scale: 1.15 }}
              whileTap={buttonTap}
            />
          ))}
        </div>

        {/* ── Progress bar ── */}
        <div className={styles.heroProgressBar} key={activeVidIdx} />

        <div className={styles.heroScroll}>
          <span>Scroll</span>
          <div className={styles.heroScrollLine} />
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────── */}
      <div className={styles.marqueeWrap}>
        <div className={styles.marquee}>
          {Array(3).fill(
            'LED Strip Lights · Panel Lights · High Bay LEDs · Flood Lights · Track Lights · Wall Washers · Smart Controls · Custom Solutions · '
          ).map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>

      {/* ── LIVING GALLERY ───────────────────────────────────────── */}
      <section className={styles.gallerySection} id="collections" data-cursor-theme="dark">
        <div className={styles.sectionHeader} data-reveal>
          <p className={styles.sectionEyebrow}>Tirich LED Product Range</p>
          <h2 className={styles.sectionTitle}>Engineered for Every Space</h2>
          <p className={styles.sectionLead}>
            From commercial high bays to architectural accent strips — every product is
            manufactured to precision standards and rigorously tested before delivery.
          </p>
        </div>
        <LivingGallery items={LIVING_GALLERY} />
      </section>

      {/* ── LUSTER GALLERY ───────────────────────────────────────── */}
      <section className={styles.sectionLight} id="luster">
        <div className={styles.sectionHeader} data-reveal>
          <p className={styles.sectionEyebrow}>Product Highlights</p>
          <h2 className={styles.sectionTitle}>Precision That Catches the Eye</h2>
          <p className={styles.sectionLead}>
            Move your cursor over any product — see the crisp design and premium build
            quality that define every Tirich LED fixture.
          </p>
        </div>
        <LusterGallery items={GALLERY_ITEMS} />
      </section>

      {/* ── TECHNOLOGY / CRAFTSMANSHIP ──────────────────────────── */}
      <section className={styles.detail} id="craftsmanship">
        <div className={styles.detailMedia} data-reveal>
          <img src={hdTLC108} alt="Tirich LED TLC-108 Downlight" className={styles.detailImg} />
          <div className={styles.detailBadge}>IP65 Rated · CRI 95+</div>
        </div>
        <div className={styles.detailCopy} data-reveal style={{ transitionDelay: '0.15s' }}>
          <p className={styles.sectionEyebrow}>Manufacturing Excellence</p>
          <h2 className={styles.sectionTitle}>Precision in Every Lumen</h2>
          <p className={styles.sectionBody}>
            Our engineers rigorously test every production batch for luminous consistency,
            thermal performance, and longevity. Each unit meets IEC and CE safety standards
            before it leaves our facility.
          </p>
          <ul className={styles.detailStats}>
            <li><strong>50K hrs</strong><span>Lifespan Rating</span></li>
            <li><strong>IP65</strong><span>Weather Certified</span></li>
            <li><strong>CRI 95+</strong><span>Colour Accuracy</span></li>
          </ul>
          <motion.button className={styles.btnPrimary} onClick={() => navigate('/products')} {...mag} whileHover={buttonHover} whileTap={buttonTap}>
            <span>View Products</span>
          </motion.button>
        </div>
      </section>

      {/* ── OUR PROCESS ──────────────────────────────────────────── */}
      <section className={styles.howItWorks} id="ai-studio" data-cursor-theme="dark">
        <div className={styles.sectionHeader} data-reveal>
          <p className={styles.sectionEyebrow}>Our Process</p>
          <h2 className={styles.sectionTitle}>From Consultation to Installation in Three Steps</h2>
          <p className={styles.sectionLead}>
            We guide every client — from initial specification to final delivery and beyond.
          </p>
        </div>
        <div className={styles.stepsGrid}>
          {HOW_IT_WORKS.map((s, i) => (
            <motion.div key={s.step} className={styles.stepCard} data-reveal style={{ transitionDelay: `${i * 0.18}s` }} whileHover={cardHover} {...fadeUp(Math.min(i * 0.1, 0.28), 18)}>
              <span className={styles.stepNumber}>{s.step}</span>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepBody}>{s.body}</p>
            </motion.div>
          ))}
        </div>
        <div className={styles.howItWorksCta} data-reveal>
          <motion.button className={styles.btnPrimary} onClick={() => navigate('/ai-studio')} {...mag} whileHover={buttonHover} whileTap={buttonTap}>
            Request a Quote
          </motion.button>
        </div>
      </section>


      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <div className={styles.statsBar} data-cursor-theme="light">
        {STATS.map((s, i) => (
          <motion.div key={s.label} className={styles.statItem} data-reveal style={{ transitionDelay: `${i * 0.1}s` }} whileHover={cardHover} {...fadeIn(Math.min(i * 0.08, 0.24))}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </motion.div>
        ))}
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <span className={styles.navBrand}>Tirich LED</span>
            <p className={styles.footerTagline}>Precision LED Manufacturing</p>
          </div>
          <nav className={styles.footerNav}>
            <div className={styles.footerNavCol}>
              <span className={styles.footerNavHead}>Explore</span>
              <a href="#collections"   onClick={scrollToSection('collections')}>Products</a>
              <a href="#craftsmanship" onClick={scrollToSection('craftsmanship')}>Technology</a>
            </div>
            <div className={styles.footerNavCol}>
              <span className={styles.footerNavHead}>Company</span>
              <a href="#ai-studio" onClick={scrollToSection('ai-studio')}>About Us</a>
              {/* <button className={styles.footerNavBtn} onClick={() => navigate('/login')}>Partner Login</button> */}
            </div>
          </nav>
        </div>
        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} Tirich LED. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
