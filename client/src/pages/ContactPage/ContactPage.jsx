import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import styles from './ContactPage.module.css';

const CONTACT_INFO = [
  {
    icon: '◎',
    label: 'Office',
    value: 'Surat, Gujarat, India',
  },
  {
    icon: '◈',
    label: 'Email',
    value: 'info@tirichled.com',
    href: 'mailto:info@tirichled.com',
  },
  {
    icon: '◇',
    label: 'Phone',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
  },
  {
    icon: '✦',
    label: 'Business Hours',
    value: 'Mon – Sat, 9:00 AM – 6:00 PM IST',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

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

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={styles.page}>
      <Navbar />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow} data-reveal>Get In Touch</p>
          <h1 className={styles.heroTitle} data-reveal style={{ transitionDelay: '0.1s' }}>
            Let's Build Something<br />
            <span className={styles.heroAccent}>Exceptional Together.</span>
          </h1>
          <div className={styles.heroDivider} />
          <p className={styles.heroLead} data-reveal style={{ transitionDelay: '0.2s' }}>
            Whether you're specifying a single fixture or an entire lighting ecosystem,
            our technical team is ready to assist — from product selection through to delivery.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className={styles.contactSection}>

        {/* Left: Info */}
        <div className={styles.infoCol} data-reveal>
          <p className={styles.sectionEyebrow}>Contact Details</p>
          <h2 className={styles.sectionTitle}>Reach Our Team</h2>
          <p className={styles.sectionBody}>
            We respond to all enquiries within one business day. For urgent technical
            queries, please call us directly.
          </p>

          <ul className={styles.infoList}>
            {CONTACT_INFO.map(item => (
              <li key={item.label} className={styles.infoItem}>
                <span className={styles.infoIcon}>{item.icon}</span>
                <div>
                  <span className={styles.infoLabel}>{item.label}</span>
                  {item.href ? (
                    <a href={item.href} className={styles.infoValue}>{item.value}</a>
                  ) : (
                    <span className={styles.infoValue}>{item.value}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Form */}
        <div className={styles.formCol} data-reveal style={{ transitionDelay: '0.15s' }}>
          {submitted ? (
            <div className={styles.successBox}>
              <span className={styles.successIcon}>✓</span>
              <h3 className={styles.successTitle}>Message Received</h3>
              <p className={styles.successBody}>
                Thank you for reaching out. Our team will get back to you within one business day.
              </p>
              <button className={styles.btnGhost} onClick={() => setSubmitted(false)}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Full Name *</label>
                  <input
                    className={styles.input}
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Email Address *</label>
                  <input
                    className={styles.input}
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <input
                    className={styles.input}
                    type="tel"
                    name="phone"
                    placeholder="+91 00000 00000"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Subject *</label>
                  <select
                    className={styles.input}
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="product">Product Enquiry</option>
                    <option value="quote">Request a Quote</option>
                    <option value="technical">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Message *</label>
                <textarea
                  className={styles.textarea}
                  name="message"
                  rows={6}
                  placeholder="Describe your project or enquiry in detail..."
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className={styles.btnPrimary}>
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
