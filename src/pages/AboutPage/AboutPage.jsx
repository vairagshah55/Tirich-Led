import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import styles from './AboutPage.module.css';
import img101   from '../../assets/TLC-101.jpg';
import img112   from '../../assets/TLC-112.jpg';
import img108   from '../../assets/TLC-108.jpg';
import img151   from '../../assets/TLC-151.jpg';
import imgHang  from '../../assets/hanging-230.jpg';
import imgStrip from '../../assets/STRIP-LED-POST.jpg';
import img121   from '../../assets/TLC-121.jpg';

/* ── Data ─────────────────────────────────────────────────────────── */

const STATS = [
  { value: '2020',    label: 'Established' },
  { value: '500+',    label: 'Products' },
  { value: 'CRI 95',  label: 'Colour Standard' },
  { value: '50K hrs', label: 'Rated Lifespan' },
];

const MISSION = {
  eyebrow: 'Our Mission',
  title: 'Engineer with Purpose',
  body: 'To manufacture LED lighting solutions that professionals can specify with absolute confidence — delivering measurable, consistent performance on every project, at every scale.',
};

const VISION = {
  eyebrow: 'Our Vision',
  title: 'Define the Standard',
  body: "To become India's most trusted LED manufacturer by setting the industry benchmark for photometric precision, sustainable production, and uncompromising technical excellence.",
};

const TIMELINE = [
  {
    year: '2020',
    title: 'Lighting the Way',
    text: 'Tirich LED founded with a precise focus on commercial-grade panel lighting for the Indian market — built on a commitment to photometric accuracy from day one.',
  },
  {
    year: '2021',
    title: 'A New Chapter',
    text: 'Expanded the product range to include industrial high-bay fixtures, strip LEDs, and custom CCT solutions, growing from a single category to a comprehensive portfolio.',
  },
  {
    year: '2022',
    title: 'Certified Excellence',
    text: 'Achieved CE and RoHS international certifications. Launched the IP65-rated tri-proof and high-bay series, purpose-built for demanding industrial environments.',
  },
  {
    year: '2023',
    title: 'Architectural Vision',
    text: 'Entered the architectural lighting segment with pendant and recessed downlight collections for hospitality, retail, and premium commercial interiors.',
  },
  {
    year: '2024',
    title: 'Complete Ecosystem',
    text: 'Launched a 500+ SKU catalogue spanning every lighting application. Established pan-India distributor partnerships to serve projects nationwide.',
  },
];

const VALUES = [
  {
    svgPaths: (
      <>
        <path d="M12 2L12 6M12 18L12 22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12L6 12M18 12L22 12"/>
        <circle cx="12" cy="12" r="4"/>
      </>
    ),
    title: 'Precision Engineering',
    body: 'Every component is selected to strict tolerances. From SMD chipsets to thermal substrates, nothing ships without photometric and electrical verification.',
  },
  {
    svgPaths: (
      <>
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </>
    ),
    title: 'Sustainable Manufacturing',
    body: 'We operate under an ISO-aligned quality framework, minimising waste and meeting international RoHS and CE directives across every product line.',
  },
  {
    svgPaths: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </>
    ),
    title: 'Client Partnership',
    body: 'We work directly with architects, contractors, and facility managers — providing technical consultation from specification through to commissioning.',
  },
  {
    svgPaths: (
      <>
        <polyline points="23 4 23 10 17 10"/>
        <polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </>
    ),
    title: 'Continuous Innovation',
    body: 'Our R&D team continuously refines CCT options, optic designs, and driver configurations to stay ahead of evolving project requirements.',
  },
  {
    svgPaths: (
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    ),
    title: 'Integrity First',
    body: 'We publish verified photometric data, real lifespan ratings, and third-party test certificates — no inflated specifications, no shortcuts.',
  },
  {
    svgPaths: (
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    ),
    title: 'Technical Excellence',
    body: 'CRI 95+, L80 50,000-hour ratings, and IP65 protection are not marketing claims — they are measured, documented, and certified outcomes.',
  },
];

const STAT_ICONS = [
  /* Established — calendar */
  <svg key="established" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>,
  /* Products — grid */
  <svg key="products" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>,
  /* Colour Standard — eye */
  <svg key="colour" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>,
  /* Lifespan — lightning bolt */
  <svg key="lifespan" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>,
];

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, rgba(236,138,28,0.82) 0%, rgba(42,47,99,0.7) 100%)',
  'linear-gradient(135deg, rgba(42,47,99,0.88) 0%, rgba(236,138,28,0.55) 100%)',
  'linear-gradient(135deg, rgba(61,74,138,0.88) 0%, rgba(236,138,28,0.45) 100%)',
  'linear-gradient(135deg, rgba(201,112,16,0.82) 0%, rgba(42,47,99,0.8) 100%)',
];

const TEAM = [
  {
    name: 'Prataprai Manshani',
    role: 'Founder & Chairman',
    initials: 'PM',
    bio: 'Pioneered quality-led LED adoption in India, founding Tirich LED with a commitment to manufacturing products that professionals can rely on without reservation.',
  },
  {
    name: 'Jitendra Manshani',
    role: 'Managing Director',
    initials: 'JM',
    bio: 'Leads product strategy, engineering direction, and business development — ensuring every product and partnership meets the Tirich LED standard.',
  },
  {
    name: 'Engineering Division',
    role: 'R&D & Photometrics',
    initials: 'RD',
    bio: 'In-house team responsible for optical design, driver engineering, photometric testing, and certification compliance across all product lines.',
  },
  {
    name: 'Quality Assurance',
    role: 'QA & Certification',
    initials: 'QA',
    bio: 'Every batch undergoes thermal cycling, lumen output verification, colour accuracy checks, and full burn-in testing before clearance for dispatch.',
  },
];

const SPECS = [
  'IEC and CE safety certifications on every product line',
  'In-house photometric testing (lumen output, CRI, CCT)',
  'Thermal cycling and accelerated lifespan testing',
  '100% driver burn-in test before shipping',
  'ISO-aligned quality management framework',
];

/* ── Component ───────────────────────────────────────────────────── */

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('js-revealed');
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.08 }
    );

    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className={styles.hero} aria-labelledby="about-hero-title">
        <div className={styles.heroDotGrid} aria-hidden="true" />
        <div className={styles.heroAccentLine} aria-hidden="true" />
        <div className={styles.heroInner}>
          {/* Left — text */}
          <div className={styles.heroLeft}>
            <p className={styles.heroEyebrow} data-reveal>About Tirich LED</p>
            <h1
              className={styles.heroTitle}
              id="about-hero-title"
              data-reveal
              style={{ transitionDelay: '0.1s' }}
            >
              Built on Precision.<br />
              <span className={styles.heroAccent}>Driven by Light.</span>
            </h1>
            <div className={styles.heroDivider} aria-hidden="true" />
            <p className={styles.heroLead} data-reveal style={{ transitionDelay: '0.2s' }}>
              Tirich LED is a manufacturer of industrial-grade LED lighting solutions for
              commercial, residential, and architectural applications. Since 2020, we have
              been engineering products that deliver on performance, longevity, and reliability.
            </p>
          </div>

          {/* Right — product image mosaic */}
          <div className={styles.heroMosaic} data-reveal style={{ transitionDelay: '0.25s' }} aria-hidden="true">
            <div className={`${styles.heroMosaicItem} ${styles.heroMosaicItemTall}`}>
              <img src={img112} alt="TLC-112 LED panel" loading="eager" decoding="async" />
            </div>
            <div className={styles.heroMosaicItem}>
              <img src={img101} alt="TLC-101 LED panel" loading="eager" decoding="async" />
            </div>
            <div className={styles.heroMosaicItem}>
              <img src={img121} alt="TLC-121 LED panel" loading="eager" decoding="async" />
            </div>
          </div>
        </div>
        <div className={styles.heroDecor} aria-hidden="true" />
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <div className={styles.statsBar} role="list" aria-label="Company highlights">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={styles.statItem}
            data-reveal
            style={{ transitionDelay: `${i * 0.08}s` }}
            role="listitem"
          >
            <span className={styles.statIcon}>{STAT_ICONS[i]}</span>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── ABOUT COMPANY ────────────────────────────────────────── */}
      <section className={styles.aboutSection} aria-labelledby="about-company-title">
        <div className={styles.aboutText} data-reveal>
          <p className={styles.sectionEyebrow}>Our Story</p>
          <h2 className={styles.sectionTitle} id="about-company-title">
            From a Single Product<br />to a Complete Ecosystem
          </h2>
          <p className={styles.sectionBody}>
            Tirich LED was founded with one clear purpose: to manufacture LED lighting
            products that professionals can specify with confidence. We started with a
            focused range of panel lights and have grown into a manufacturer covering
            every lighting application — from commercial interiors to demanding industrial
            environments.
          </p>
          <p className={styles.sectionBody}>
            Every product passes through our in-house quality process — from component
            selection and assembly to photometric testing and certification. We don't
            outsource quality assurance; it is built into every stage of our manufacturing
            workflow.
          </p>
        </div>

        <div className={styles.aboutCallouts} data-reveal style={{ transitionDelay: '0.15s' }}>
          {/* Product image grid */}
          <div className={styles.aboutImages}>
            <div className={`${styles.aboutImgItem} ${styles.aboutImgItemTall}`}>
              <img src={img108} alt="TLC-108 LED fixture" loading="lazy" decoding="async" />
            </div>
            <div className={styles.aboutImgItem}>
              <img src={imgHang} alt="Hanging LED pendant 230" loading="lazy" decoding="async" />
            </div>
            <div className={styles.aboutImgItem}>
              <img src={imgStrip} alt="Strip LED post" loading="lazy" decoding="async" />
            </div>
          </div>

          {/* Compact stat callouts */}
          <div className={styles.aboutStats}>
            <div className={styles.callout}>
              <span className={styles.calloutAccent}>500+</span>
              <p className={styles.calloutLabel}>Product SKUs covering every lighting category</p>
            </div>
            <div className={styles.callout}>
              <span className={styles.calloutAccent}>CRI 95+</span>
              <p className={styles.calloutLabel}>Colour rendering accuracy across all product lines</p>
            </div>
            <div className={styles.callout}>
              <span className={styles.calloutAccent}>IP65</span>
              <p className={styles.calloutLabel}>Weather-rated protection for outdoor and industrial use</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION + VISION ─────────────────────────────────────── */}
      <section className={styles.missionVision} aria-label="Mission and Vision">
        <div className={styles.missionCard} data-reveal>
          <div className={styles.mvIconBg} aria-hidden="true">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3"/>
              <line x1="12" y1="2" x2="12" y2="5"/>
              <line x1="12" y1="19" x2="12" y2="22"/>
              <line x1="2" y1="12" x2="5" y2="12"/>
              <line x1="19" y1="12" x2="22" y2="12"/>
            </svg>
          </div>
          <p className={styles.mvEyebrow}>{MISSION.eyebrow}</p>
          <h2 className={styles.mvTitle}>{MISSION.title}</h2>
          <div className={styles.mvDivider} aria-hidden="true" />
          <p className={styles.mvBody}>{MISSION.body}</p>
        </div>

        <div className={styles.visionCard} data-reveal style={{ transitionDelay: '0.15s' }}>
          <div className={styles.mvIconBg} aria-hidden="true">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <line x1="9" y1="18" x2="15" y2="18"/>
              <line x1="10" y1="22" x2="14" y2="22"/>
              <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14z"/>
            </svg>
          </div>
          <p className={styles.mvEyebrow}>{VISION.eyebrow}</p>
          <h2 className={styles.mvTitle}>{VISION.title}</h2>
          <div className={styles.mvDivider} aria-hidden="true" />
          <p className={styles.mvBody}>{VISION.body}</p>
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────────────────────────── */}
      <section className={styles.timelineSection} aria-labelledby="timeline-title">
        <div className={styles.timelineHeader} data-reveal>
          <p className={styles.sectionEyebrow}>Our Journey</p>
          <h2 className={styles.sectionTitle} id="timeline-title">
            Five Years of Measured Progress
          </h2>
        </div>

        <div className={styles.timelineTrack} aria-label="Company milestones">
          <div className={styles.timelineLine} aria-hidden="true" />

          {TIMELINE.map((item, i) => (
            <div
              key={item.year}
              className={styles.timelineEntry}
              data-reveal
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              {/* Left slot — even entries only */}
              <div className={i % 2 === 0 ? styles.entryContentLeft : styles.entryBlank}>
                {i % 2 === 0 && (
                  <>
                    <p className={styles.entryYear}>{item.year}</p>
                    <h3 className={styles.entryTitle}>{item.title}</h3>
                    <p className={styles.entryText}>{item.text}</p>
                  </>
                )}
              </div>

              {/* Centre dot */}
              <div className={styles.entryDotWrap} aria-hidden="true">
                <span className={styles.entryDot} />
              </div>

              {/* Right slot — odd entries only */}
              <div className={i % 2 === 1 ? styles.entryContentRight : styles.entryBlank}>
                {i % 2 === 1 && (
                  <>
                    <p className={styles.entryYear}>{item.year}</p>
                    <h3 className={styles.entryTitle}>{item.title}</h3>
                    <p className={styles.entryText}>{item.text}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CORE VALUES ──────────────────────────────────────────── */}
      <section className={styles.valuesSection} aria-labelledby="values-title">
        <div className={styles.valuesHeader} data-reveal>
          <p className={styles.sectionEyebrow}>Core Values</p>
          <h2 className={styles.sectionTitle} id="values-title">What We Stand For</h2>
          <p className={styles.valuesLead}>
            Six principles that define every decision — from how we source components
            to how we support our clients after installation.
          </p>
        </div>

        <div className={styles.valuesGrid}>
          {VALUES.map((v, i) => (
            <article
              key={v.title}
              className={styles.valueCard}
              data-reveal
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <span className={styles.valueIcon} aria-hidden="true">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {v.svgPaths}
                </svg>
              </span>
              <h3 className={styles.valueTitle}>{v.title}</h3>
              <p className={styles.valueBody}>{v.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────────────── */}
      <section className={styles.teamSection} aria-labelledby="team-title">
        <div className={styles.teamHeader} data-reveal>
          <p className={styles.sectionEyebrow}>The Team</p>
          <h2 className={styles.sectionTitle} id="team-title">
            The People Behind Tirich LED
          </h2>
          <p className={styles.teamLead}>
            A team built on technical expertise and a shared commitment to precision.
          </p>
        </div>

        <div className={styles.teamGrid}>
          {TEAM.map((member, i) => (
            <article
              key={member.name}
              className={styles.teamCard}
              data-reveal
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className={styles.avatarWrap}>
                <div
                  className={styles.avatar}
                  style={{ background: AVATAR_GRADIENTS[i] }}
                  aria-hidden="true"
                >
                  <span className={styles.avatarInitials}>{member.initials}</span>
                </div>
                <div className={styles.avatarGlow} aria-hidden="true" />
              </div>

              <div className={styles.memberInfo}>
                <h3 className={styles.memberName}>{member.name}</h3>
                <p className={styles.memberRole}>{member.role}</p>
                <p className={styles.memberBio}>{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── MANUFACTURING ────────────────────────────────────────── */}
      <section className={styles.manufacturing} aria-labelledby="manufacturing-title">
        <div className={styles.manufacturingImg} data-reveal>
          <img
            src={img151}
            alt="Tirich LED TLC-151 panel light"
            loading="lazy"
            decoding="async"
          />
          <span className={styles.imgBadge} aria-label="Product certifications">
            IP65 · CRI 95+ · CE Certified
          </span>
        </div>

        <div data-reveal style={{ transitionDelay: '0.15s' }}>
          <p className={styles.sectionEyebrow}>Manufacturing Excellence</p>
          <h2 className={styles.sectionTitle} id="manufacturing-title">
            Every Unit Tested.<br />Every Batch Certified.
          </h2>
          <p className={styles.sectionBody}>
            Our quality process is not a final step — it runs alongside every stage of
            manufacturing. Each production batch undergoes systematic verification before
            it is cleared for dispatch.
          </p>
          <ul className={styles.specsList} aria-label="Quality certifications and processes">
            {SPECS.map((s) => (
              <li key={s} className={styles.specItem}>
                <span className={styles.specCheck} aria-hidden="true">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className={styles.ctaSection} data-reveal aria-labelledby="cta-title">
        <h2 className={styles.ctaTitle} id="cta-title">
          Ready to Specify Tirich LED?
        </h2>
        <p className={styles.ctaLead}>
          Explore our full product range or get in touch with our technical team
          to discuss your project requirements.
        </p>
        <div className={styles.ctaRow}>
          <Link to="/products" className={styles.btnPrimary}>Browse Products</Link>
          <Link to="/contact" className={styles.btnGhost}>Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
