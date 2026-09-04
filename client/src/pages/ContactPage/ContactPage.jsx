import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '../../components/Navbar/Navbar';
import Seo from '../../components/Seo/Seo';
import { SITE_URL, breadcrumbLd } from '../../config/seo';
import Footer from '../../components/Footer/Footer';
import styles from './ContactPage.module.css';

const EASE = [0.25, 1, 0.5, 1];
const REVEAL = { once: true, amount: 0.2 };

const CONTACT_INFO = [
  {
    icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    label: 'Office',
    value: 'Surat, Gujarat, India',
  },
  {
    icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    label: 'Email',
    value: 'salestirichled@gmail.com',
    href: 'mailto:salestirichled@gmail.com',
  },
  {
    icon: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></>,
    label: 'Phone',
    value: '+91 73832 47625',
    href: 'tel:+917383247625',
  },
  {
    icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    label: 'Business Hours',
    value: 'Mon – Sat, 9 AM – 6 PM IST',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <div className={styles.page}>
      <Seo
        title="Contact Us"
        path="/contact"
        description="Get in touch with Tirich LED for product enquiries, project quotes and lighting design support. Call, WhatsApp or send us a message."
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact Tirich LED',
            url: `${SITE_URL}/contact/`,
            mainEntity: { '@id': `${SITE_URL}/#organization` },
          },
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Contact Us', path: '/contact' },
          ]),
        ]}
      />
      <Navbar />

      <main className="page-main">

      {/* ── Hero ── */}
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.heroStripe} aria-hidden />
        <div className={styles.heroOrb} aria-hidden />

        <motion.div
          className={styles.heroInner}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p className={styles.heroEyebrow}>
            <motion.span
              className={styles.eyebrowDot}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            Get In Touch
          </p>
          <h1 className={styles.heroTitle}>
            Let's Build Something <span className={styles.heroAccent}>Exceptional.</span>
          </h1>
          <p className={styles.heroLead}>
            Whether you're specifying a single fixture or an entire lighting ecosystem,
            our technical team is ready to assist.
          </p>
        </motion.div>
      </motion.section>

      {/* ── Contact cards + Form ── */}
      <section className={styles.main}>
        <div className={styles.mainInner}>

          {/* Left: info cards */}
          <motion.div
            className={styles.infoCol}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={REVEAL}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <h2 className={styles.infoTitle}>Reach Our Team</h2>
            <p className={styles.infoLead}>
              We respond to all enquiries within one business day.
            </p>

            <motion.div
              className={styles.infoCards}
              initial="hidden"
              whileInView="visible"
              viewport={REVEAL}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
            >
              {CONTACT_INFO.map((item) => (
                <motion.div
                  key={item.label}
                  className={styles.infoCard}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                  }}
                  whileHover={{ y: -3, borderColor: 'rgba(255,157,28,0.2)', transition: { duration: 0.2 } }}
                >
                  <span className={styles.infoIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
                  </span>
                  <div>
                    <span className={styles.infoLabel}>{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className={styles.infoValue}>{item.value}</a>
                    ) : (
                      <span className={styles.infoValue}>{item.value}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            className={styles.formCol}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={REVEAL}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  className={styles.success}
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <motion.span
                    className={styles.successIcon}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 12, delay: 0.1 }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </motion.span>
                  <h3 className={styles.successTitle}>Message Sent</h3>
                  <p className={styles.successBody}>
                    Thank you for reaching out. Our team will get back to you within one business day.
                  </p>
                  <motion.button className={styles.btnGhost} onClick={() => setSubmitted(false)} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                    Send Another
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  className={styles.form}
                  onSubmit={handleSubmit}
                  noValidate
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.formRow}>
                    <div className={styles.field}>
                      <label className={styles.label}>Full Name</label>
                      <input className={styles.input} type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Email</label>
                      <input className={styles.input} type="email" name="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.field}>
                      <label className={styles.label}>Phone</label>
                      <input className={styles.input} type="tel" name="phone" placeholder="+91 00000 00000" value={form.phone} onChange={handleChange} />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Subject</label>
                      <select className={styles.input} name="subject" value={form.subject} onChange={handleChange} required>
                        <option value="">Select a subject</option>
                        <option value="product">Product Enquiry</option>
                        <option value="quote">Request a Quote</option>
                        <option value="technical">Technical Support</option>
                        <option value="partnership">Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Message</label>
                    <textarea className={styles.textarea} name="message" rows={5} placeholder="Tell us about your project..." value={form.message} onChange={handleChange} required />
                  </div>
                  <motion.button type="submit" className={styles.btnPrimary} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                    Send Message
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      </main>

      <Footer />
    </div>
  );
}
