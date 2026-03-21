import { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';

// ── Product Images ─────────────────────────────────────────────────
import product1   from '../../assets/TLC-101.jpg';
import product2   from '../../assets/TLC-105.jpg';
import product3   from '../../assets/TLC-108.jpg';
import product4   from '../../assets/TLC-111.jpg';
import product5   from '../../assets/TLC-112.jpg';
import product7   from '../../assets/TLC-121.jpg';
import product8   from '../../assets/TLC-129.jpg';
import product9   from '../../assets/TLC-151.jpg';
import hangingLight from '../../assets/hanging-230.jpg';
import stripLed   from '../../assets/STRIP-LED-POST.jpg';
import heroVideo  from '../../assets/grok-video-1ae0e23a-fbb4-4bec-993c-fb8c0b748c3f.mp4';
import proVid1    from '../../assets/grok-video-083a2972-e0c2-44a4-b856-38ebb91513b1.mp4';
import proVid2    from '../../assets/grok-video-1d4fef8d-119d-4f9f-8d71-650ca413f8be.mp4';
import proVid3    from '../../assets/grok-video-2ca8b0c1-823e-4d11-a036-24e495b32dc3.mp4';

import LusterGallery          from '../../components/LusterGallery/LusterGallery';
import AnatomySection         from '../../components/AnatomySection/AnatomySection';
import LightingCustomizer     from '../../components/LightingCustomizer/LightingCustomizer';
import TransformationEngine   from '../../components/TransformationEngine/TransformationEngine';
import LivingGallery          from '../../components/LivingGallery/LivingGallery';

// ── Gallery items ─────────────────────────────────────────────────
const GALLERY_ITEMS = [
  { eyebrow: 'Panel Series',    label: 'TLC Premium Panel',    image: product1 },
  { eyebrow: 'Strip Series',    label: 'LED Strip Pro',        image: stripLed },
  { eyebrow: 'Hanging Series',  label: 'Pendant LED Fixture',  image: hangingLight },
];

// ── Living Gallery items ──────────────────────────────────────────
const LIVING_GALLERY = [
  { label: 'Strip LED Showcase',   eyebrow: 'Product Feature',    type: 'image', src: stripLed     },
  { label: 'TLC-101 Panel',        eyebrow: 'Product Detail',     type: 'image', src: product1     },
  { label: 'LED Project Reel',     eyebrow: 'Installation Reel',  type: 'video', src: proVid1      },
  { label: 'TLC-105 Series',       eyebrow: 'Macro Detail',       type: 'image', src: product2     },
  { label: 'Hanging Pendant',      eyebrow: 'Interior Lighting',  type: 'image', src: hangingLight },
  { label: 'TLC-112 Panel',        eyebrow: 'Product Detail',     type: 'image', src: product5     },
  { label: 'LED Campaign',         eyebrow: 'Commercial Install', type: 'video', src: proVid2      },
  { label: 'TLC-121 Premium',      eyebrow: 'Premium Series',     type: 'image', src: product7     },
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

// ── Transformation Engine outputs (3×3 grid) ─────────────────────
const OUTPUTS = [
  { label: 'TLC-101 Panel',    category: 'Panel',   type: 'image', image: product1  },
  { label: 'TLC-108 Downlight', category: 'Downlight', type: 'image', image: product3 },
  { label: 'LED Campaign I',   category: 'Project', type: 'video', video: proVid1   },
  { label: 'TLC-111 Fixture',  category: 'Fixture', type: 'image', image: product4  },
  { label: 'TLC-112 Strip',    category: 'Strip',   type: 'image', image: product5  },
  { label: 'Hanging Light',    category: 'Pendant', type: 'image', image: hangingLight },
  { label: 'LED Campaign II',  category: 'Project', type: 'video', video: proVid2   },
  { label: 'TLC-121 Panel',    category: 'Panel',   type: 'image', image: product7  },
  { label: 'TLC-129 Series',   category: 'Series',  type: 'image', image: product8  },
];

// ── Hero video slides ─────────────────────────────────────────────
const HERO_VIDEOS = [heroVideo, proVid1, proVid2, proVid3];

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
  const navigate = useNavigate();

  // ── Theme ────────────────────────────────────────────────────
  const [theme, setTheme] = useState(
    () => localStorage.getItem('tirich-theme') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tirich-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    document.documentElement.classList.add('theme-switching');
    setTimeout(() => document.documentElement.classList.remove('theme-switching'), 420);
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }, []);

  // ── Refs ─────────────────────────────────────────────────────
  const heroBgRef           = useRef(null);
  const heroContentRef      = useRef(null);
  const bokehRefs           = useRef([]);
  const heroVidRefs         = useRef([]);
  const [activeVidIdx, setActiveVidIdx] = useState(0);

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
        heroBgRef.current.style.transform = `scale(1.1) translateY(${window.scrollY * 0.28}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── 3. Hero Video Auto-Advance ────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveVidIdx(prev => (prev + 1) % HERO_VIDEOS.length);
    }, 6000);
    return () => clearInterval(timer);
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
      <nav className={styles.nav}>
        <span className={styles.navBrand}>Tirich LED</span>
        <div className={styles.navLinks}>
          <a href="#collections"   onClick={scrollToSection('collections')}>Products</a>
          <a href="#craftsmanship" onClick={scrollToSection('craftsmanship')}>Technology</a>
          <a href="#lifestyle"     onClick={scrollToSection('lifestyle')}>Projects</a>
          <a href="#ai-studio"     onClick={scrollToSection('ai-studio')}>About</a>
          <button
            className={`${styles.themeToggle} ${theme === 'light' ? styles.lightMode : ''}`}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            {...mag}
          >
            <span className={styles.themeKnob}>
              {theme === 'dark' ? '☽' : '☀'}
            </span>
          </button>
          <button className={styles.navCta} onClick={() => navigate('/login')} {...mag}>
            Partner Login
          </button>
        </div>
      </nav>

      {/* ── HERO: VIDEO CAROUSEL + 3D TILT + BOKEH ──────────────── */}
      <section
        className={styles.hero}
        id="hero"
        onMouseMove={onHeroMouseMove}
        onMouseLeave={onHeroMouseLeave}
      >
        {/* ── Video slides ── */}
        <div ref={heroBgRef} className={styles.heroVideos}>
          {HERO_VIDEOS.map((src, i) => (
            <video
              key={i}
              ref={el => { heroVidRefs.current[i] = el; }}
              className={`${styles.heroVideoSlide}${i === activeVidIdx ? ` ${styles.heroVideoSlideActive}` : ''}`}
              src={src}
              autoPlay
              muted
              loop
              playsInline
            />
          ))}
        </div>

        <div className={styles.heroOverlay} />

        {/* Bokeh particles — depth parallax on mouse move */}
        {BOKEH.map((b, i) => (
          <div
            key={i}
            ref={(el) => { bokehRefs.current[i] = el; }}
            className={styles.bokeh}
            style={{ width: b.w, height: b.h, left: b.l, top: b.t, filter: `blur(${b.blur}px)`, opacity: b.op }}
          />
        ))}

        <div ref={heroContentRef} className={styles.heroContent}>
          <p className={styles.heroEyebrow} data-reveal>Premium LED Manufacturing — EST. 2020</p>
          <h1 className={styles.heroTitle} data-reveal style={{ transitionDelay: '0.1s' }}>
            Where Every<br />
            <span className={styles.heroAccent}>Beam</span> Powers a Vision
          </h1>
          <p className={styles.heroSubtitle} data-reveal style={{ transitionDelay: '0.2s' }}>
            Industrial-grade LED solutions for commercial, residential, and architectural applications.
            Engineered for performance, certified for reliability.
          </p>
          <div className={styles.heroActions} data-reveal style={{ transitionDelay: '0.3s' }}>
            <button className={styles.btnPrimary} onClick={() => navigate('/ai-studio')} {...mag}>
              Explore Products
            </button>
            <a href="#collections" className={styles.btnGhost} onClick={scrollToSection('collections')} {...mag}>
              View Catalog
            </a>
          </div>
        </div>

        {/* ── Prev / Next arrows ── */}
        <button
          className={`${styles.heroArrow} ${styles.heroArrowLeft}`}
          onClick={() => setActiveVidIdx(i => (i - 1 + HERO_VIDEOS.length) % HERO_VIDEOS.length)}
          aria-label="Previous video"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button
          className={`${styles.heroArrow} ${styles.heroArrowRight}`}
          onClick={() => setActiveVidIdx(i => (i + 1) % HERO_VIDEOS.length)}
          aria-label="Next video"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        {/* ── Slide indicators ── */}
        <div className={styles.heroDots}>
          {HERO_VIDEOS.map((_, i) => (
            <button
              key={i}
              className={`${styles.heroDot}${i === activeVidIdx ? ` ${styles.heroDotActive}` : ''}`}
              onClick={() => setActiveVidIdx(i)}
              aria-label={`Video ${i + 1}`}
            />
          ))}
        </div>

        {/* ── Progress bar resets on each slide ── */}
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

      {/* ── ANATOMY OF AN LED ────────────────────────────────────── */}
      <section className={styles.sectionDark} id="anatomy" data-cursor-theme="dark">
        <div className={styles.sectionHeader} data-reveal>
          <p className={styles.sectionEyebrow}>Product Anatomy</p>
          <h2 className={styles.sectionTitle}>Deconstructed, Explained</h2>
          <p className={styles.sectionLead}>
            Every Tirich LED product is assembled from premium-grade components.
            Discover what's inside every fixture we manufacture.
          </p>
        </div>
        <AnatomySection image={product1} />
      </section>


      {/* ── ONE-TO-MANY PRODUCT CATALOG ──────────────────────────── */}
      <section className={styles.transformSection} id="catalog" data-cursor-theme="dark">
        <div className={styles.sectionHeader} data-reveal>
          <p className={styles.sectionEyebrow}>The Product Range</p>
          <h2 className={styles.sectionTitle}>One Manufacturer. Complete Solutions.</h2>
          <p className={styles.sectionLead}>
            From a single SMD chip to a full smart lighting ecosystem — Tirich LED
            engineers and manufactures every component in-house.
          </p>
        </div>
        <TransformationEngine
          sourceImage={product1}
          outputs={OUTPUTS}
        />
      </section>

      {/* ── TECHNOLOGY / CRAFTSMANSHIP ──────────────────────────── */}
      <section className={styles.detail} id="craftsmanship">
        <div className={styles.detailMedia} data-reveal>
          <img src={product9} alt="Tirich LED TLC-151 Panel Light" className={styles.detailImg} />
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
          <button className={styles.btnPrimary} {...mag}>View Products</button>
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
            <div key={s.step} className={styles.stepCard} data-reveal style={{ transitionDelay: `${i * 0.18}s` }}>
              <span className={styles.stepNumber}>{s.step}</span>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepBody}>{s.body}</p>
            </div>
          ))}
        </div>
        <div className={styles.howItWorksCta} data-reveal>
          <button className={styles.btnPrimary} onClick={() => navigate('/ai-studio')} {...mag}>
            Request a Quote
          </button>
        </div>
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

      {/* ── PROJECTS / LIFESTYLE ─────────────────────────────────── */}
      <section className={styles.lifestyle} id="lifestyle" data-cursor-theme="light">
        <div className={styles.lifestyleCopy} data-reveal>
          <p className={styles.sectionEyebrow}>Built for Every Environment</p>
          <h2 className={styles.sectionTitle}>Light It. Live In It.</h2>
          <p className={styles.sectionBody}>
            From sprawling warehouse floors to intimate hospitality spaces — Tirich LED
            delivers consistent, efficient illumination across every commercial and
            residential application.
          </p>
          <div className={styles.lifestyleFeatures}>
            <div className={styles.feature}><span className={styles.featureIcon}>✦</span><span>Long-life SMD 2835 chipsets</span></div>
            <div className={styles.feature}><span className={styles.featureIcon}>✦</span><span>3-year manufacturer warranty</span></div>
            <div className={styles.feature}><span className={styles.featureIcon}>✦</span><span>Custom CCT &amp; CRI options available</span></div>
          </div>
          <button className={styles.btnPrimary} onClick={() => navigate('/ai-studio')} {...mag}>
            Request a Quote
          </button>
        </div>
        <div className={styles.lifestyleMedia} data-reveal style={{ transitionDelay: '0.15s' }}>
          <img src={hangingLight} alt="Tirich LED hanging pendant installation" className={styles.lifestyleImg} />
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <div className={styles.statsBar} data-cursor-theme="light">
        {STATS.map((s, i) => (
          <div key={s.label} className={styles.statItem} data-reveal style={{ transitionDelay: `${i * 0.1}s` }}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
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
              <a href="#lifestyle"     onClick={scrollToSection('lifestyle')}>Projects</a>
            </div>
            <div className={styles.footerNavCol}>
              <span className={styles.footerNavHead}>Company</span>
              <a href="#ai-studio" onClick={scrollToSection('ai-studio')}>About Us</a>
              <button className={styles.footerNavBtn} onClick={() => navigate('/login')}>Partner Login</button>
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
