import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import styles from './AboutPage.module.css';
import product9 from '../../assets/TLC-151.jpg';

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
    icon: '◈',
    title: 'Precision Engineering',
    body: 'Every component is selected to strict tolerances. From SMD chipsets to thermal substrates, nothing ships without photometric and electrical verification.',
  },
  {
    icon: '◎',
    title: 'Sustainable Manufacturing',
    body: 'We operate under an ISO-aligned quality framework, minimising waste and meeting international RoHS and CE directives across every product line.',
  },
  {
    icon: '◇',
    title: 'Client Partnership',
    body: 'We work directly with architects, contractors, and facility managers — providing technical consultation from specification through to commissioning.',
  },
  {
    icon: '△',
    title: 'Continuous Innovation',
    body: 'Our R&D team continuously refines CCT options, optic designs, and driver configurations to stay ahead of evolving project requirements.',
  },
  {
    icon: '○',
    title: 'Integrity First',
    body: 'We publish verified photometric data, real lifespan ratings, and third-party test certificates — no inflated specifications, no shortcuts.',
  },
  {
    icon: '□',
    title: 'Technical Excellence',
    body: 'CRI 95+, L80 50,000-hour ratings, and IP65 protection are not marketing claims — they are measured, documented, and certified outcomes.',
  },
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
        <div className={styles.heroInner}>
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
      </section>

      {/* ── MISSION + VISION ─────────────────────────────────────── */}
      <section className={styles.missionVision} aria-label="Mission and Vision">
        <div className={styles.missionCard} data-reveal>
          <p className={styles.mvEyebrow}>{MISSION.eyebrow}</p>
          <h2 className={styles.mvTitle}>{MISSION.title}</h2>
          <div className={styles.mvDivider} aria-hidden="true" />
          <p className={styles.mvBody}>{MISSION.body}</p>
        </div>

        <div className={styles.visionCard} data-reveal style={{ transitionDelay: '0.15s' }}>
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
              <span className={styles.valueIcon} aria-hidden="true">{v.icon}</span>
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
            src={product9}
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
