import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import styles from './AboutPage.module.css';
import product9 from '../../assets/TLC-151.jpg';

const STATS = [
  { value: '2020',   label: 'Established' },
  { value: '500+',   label: 'Products' },
  { value: 'CRI 95', label: 'Colour Standard' },
  { value: '50K hrs', label: 'Rated Lifespan' },
];

const VALUES = [
  {
    icon: '◈',
    title: 'Precision Engineering',
    body: 'Every component is selected to meet strict tolerance requirements. From the SMD chipset to the thermal substrate, nothing leaves our facility without passing photometric and electrical verification.',
  },
  {
    icon: '◎',
    title: 'Sustainable Manufacturing',
    body: 'We operate under an ISO-aligned quality framework, minimising material waste, reducing energy consumption during production, and meeting international RoHS and CE directives.',
  },
  {
    icon: '◇',
    title: 'Client Partnership',
    body: 'We work directly with architects, electrical contractors, and facility managers — providing technical consultation from specification through to commissioning.',
  },
];

const TIMELINE = [
  { year: '2020', text: 'Tirich LED founded with a focus on commercial-grade panel lighting for the Indian market.' },
  { year: '2021', text: 'Expanded product range to include industrial fixtures, strip LEDs, and custom CCT solutions.' },
  { year: '2022', text: 'Achieved CE and RoHS certifications. Launched IP65-rated tri-proof and high-bay series.' },
  { year: '2023', text: 'Entered the architectural segment with pendant and downlight collections for hospitality.' },
  { year: '2024', text: 'Launched 500+ SKU catalogue. Began partnerships with pan-India electrical distributors.' },
];

const SPECS = [
  'IEC and CE safety certifications on every product line',
  'In-house photometric testing (lumen output, CRI, CCT)',
  'Thermal cycling and accelerated lifespan testing',
  '100% driver burn-in test before shipping',
  'ISO-aligned quality management framework',
];

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('js-revealed'); observer.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      <Navbar />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow} data-reveal>About Tirich LED</p>
          <h1 className={styles.heroTitle} data-reveal style={{ transitionDelay: '0.1s' }}>
            Built on Precision.<br />
            <span className={styles.heroAccent}>Driven by Light.</span>
          </h1>
          <div className={styles.heroDivider} />
          <p className={styles.heroLead} data-reveal style={{ transitionDelay: '0.2s' }}>
            Tirich LED is a manufacturer of industrial-grade LED lighting solutions for
            commercial, residential, and architectural applications. Since 2020, we have
            been engineering products that deliver on performance, longevity, and reliability.
          </p>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className={styles.statsBar}>
        {STATS.map((s, i) => (
          <div key={s.label} className={styles.statItem} data-reveal style={{ transitionDelay: `${i * 0.1}s` }}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── STORY ── */}
      <section className={styles.story}>
        <div data-reveal>
          <p className={styles.sectionEyebrow}>Our Story</p>
          <h2 className={styles.sectionTitle}>From a Single Product to a Complete Ecosystem</h2>
          <p className={styles.sectionBody}>
            Tirich LED was founded with a clear purpose: to manufacture LED lighting
            products that professionals can specify with confidence. We started with
            a focused range of panel lights and have grown into a manufacturer covering
            every lighting application.
          </p>
          <p className={styles.sectionBody}>
            Every product we make passes through our in-house quality process — from
            component selection and assembly to photometric testing and certification.
            We don't outsource quality assurance; it is built into our manufacturing workflow.
          </p>
        </div>

        <div data-reveal style={{ transitionDelay: '0.15s' }}>
          <ul className={styles.timeline}>
            {TIMELINE.map(item => (
              <li key={item.year} className={styles.timelineItem}>
                <div className={styles.timelineDot} />
                <span className={styles.timelineYear}>{item.year}</span>
                <p className={styles.timelineText}>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className={styles.values}>
        <div className={styles.valuesHeader} data-reveal>
          <p className={styles.sectionEyebrow}>Our Values</p>
          <h2 className={styles.sectionTitle}>What We Stand For</h2>
        </div>
        <div className={styles.valuesGrid}>
          {VALUES.map((v, i) => (
            <div key={v.title} className={styles.valueCard} data-reveal style={{ transitionDelay: `${i * 0.12}s` }}>
              <span className={styles.valueIcon}>{v.icon}</span>
              <h3 className={styles.valueTitle}>{v.title}</h3>
              <p className={styles.valueBody}>{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MANUFACTURING ── */}
      <section className={styles.manufacturing}>
        <div className={styles.manufacturingImg} data-reveal>
          <img src={product9} alt="Tirich LED TLC-151 manufacturing" />
          <span className={styles.imgBadge}>IP65 · CRI 95+ · CE Certified</span>
        </div>

        <div data-reveal style={{ transitionDelay: '0.15s' }}>
          <p className={styles.sectionEyebrow}>Manufacturing Excellence</p>
          <h2 className={styles.sectionTitle}>Every Unit Tested. Every Batch Certified.</h2>
          <p className={styles.sectionBody}>
            Our quality process is not a final step — it runs alongside every stage of
            manufacturing. Each production batch undergoes systematic verification before
            it is cleared for dispatch.
          </p>
          <ul className={styles.specsList}>
            {SPECS.map(s => (
              <li key={s} className={styles.specItem}>
                <span className={styles.specCheck}>✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection} data-reveal>
        <h2 className={styles.ctaTitle}>Ready to Specify Tirich LED?</h2>
        <p className={styles.ctaLead}>
          Explore our full product range or get in touch with our technical team
          to discuss your project requirements.
        </p>
        <div className={styles.ctaRow}>
          <Link to="/products" className={styles.btnPrimary}>Browse Products</Link>
          {/* <Link to="/login" className={styles.btnGhost}>Partner Login</Link> */}
        </div>
      </section>
    </div>
  );
}
