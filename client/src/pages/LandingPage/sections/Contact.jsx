import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion } from 'motion/react';
import Icon from '../../../components/Icon/Icon';
import { prefersReducedMotion } from '../../../utils/browser';
import {
  CHANNELS,
  CONTACT_SECTION,
  ENQUIRY_TYPES,
  FORM_COPY,
  WHATSAPP_URL,
  WHO,
} from '../homeContent';
import { EASE, group, item, reveal } from '../homeMotion';
import ui from '../LandingPage.module.css';
import styles from './Contact.module.css';

const EMPTY = { name: '', phone: '', email: '', city: '', company: '', enquiry: '', message: '' };
const PHONE_RE = /^[+\d][\d\s\-()]{7,}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const labelOf = (list, key) => list.find((x) => x.key === key)?.label || '';

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Please tell us your name';
  if (!form.phone.trim()) errors.phone = 'Mobile number is required';
  else if (!PHONE_RE.test(form.phone.trim())) errors.phone = 'Enter a valid mobile number';
  if (form.email.trim() && !EMAIL_RE.test(form.email.trim())) errors.email = 'Enter a valid email';
  if (!form.city.trim()) errors.city = 'City is required';
  if (!form.enquiry) errors.enquiry = 'Choose what we can help with';
  return errors;
}

/**
 * The enquiry is delivered over WhatsApp — the channel the trade desk
 * actually answers — the same way WhatsAppQuoteModal sends product quotes:
 * the form composes the message and opens wa.me with it, and the visitor
 * taps send. No backend is involved, so nothing can silently drop it.
 */
function buildMessage(form, who) {
  return [
    'Hi Tirich LED — new enquiry from the website.',
    '',
    `*I am a:* ${labelOf(WHO, who)}`,
    `*Enquiry:* ${labelOf(ENQUIRY_TYPES, form.enquiry)}`,
    `*Name:* ${form.name.trim()}`,
    `*Mobile:* ${form.phone.trim()}`,
    form.email.trim() ? `*Email:* ${form.email.trim()}` : '',
    `*City:* ${form.city.trim()}`,
    form.company.trim() ? `*Company:* ${form.company.trim()}` : '',
    form.message.trim() ? `*Message:* ${form.message.trim()}` : '',
  ]
    .filter((line, i) => line || i === 1)
    .join('\n');
}

export default function Contact({ preset }) {
  const [who, setWho] = useState(WHO[0].key);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sentUrl, setSentUrl] = useState('');
  const cardRef = useRef(null);

  // A CTA elsewhere on the page ("Apply for Trade Account", "Download IES
  // Files"…) arrives here as a preset: select the matching chip and enquiry
  // type, then pulse the card so the change is noticed.
  useEffect(() => {
    if (!preset) return;
    if (preset.who && WHO.some((w) => w.key === preset.who)) setWho(preset.who);
    if (preset.enquiry && ENQUIRY_TYPES.some((t) => t.key === preset.enquiry)) {
      setForm((f) => ({ ...f, enquiry: preset.enquiry }));
      setErrors((e) => ({ ...e, enquiry: undefined }));
    }
    setSentUrl('');
    if (cardRef.current && !prefersReducedMotion()) {
      animate(
        cardRef.current,
        {
          boxShadow: [
            '0 0 0 0 rgba(232, 119, 34, 0)',
            '0 0 0 6px rgba(232, 119, 34, 0.45)',
            '0 0 0 0 rgba(232, 119, 34, 0)',
          ],
        },
        { duration: 1.4, delay: 0.5, ease: 'easeOut' }
      );
    }
  }, [preset]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    if (Object.keys(found).length) {
      setErrors(found);
      const first = e.currentTarget.querySelector(`[name="${Object.keys(found)[0]}"]`);
      first?.focus();
      return;
    }
    const url = `${WHATSAPP_URL}?text=${encodeURIComponent(buildMessage(form, who))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSentUrl(url);
  };

  const reset = () => {
    setForm(EMPTY);
    setErrors({});
    setSentUrl('');
  };

  const field = (name, label, { required, type = 'text', placeholder, autoComplete, inputMode } = {}) => (
    <div className={`${styles.group}${errors[name] ? ` ${styles.groupError}` : ''}`}>
      <label htmlFor={`enq-${name}`} className={styles.label}>
        {label} {required && <span aria-hidden="true">*</span>}
      </label>
      <input
        id={`enq-${name}`}
        name={name}
        type={type}
        className={styles.input}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        value={form[name]}
        onChange={onChange}
        aria-required={required || undefined}
        aria-invalid={errors[name] ? true : undefined}
        aria-describedby={errors[name] ? `enq-${name}-err` : undefined}
      />
      <FieldError id={`enq-${name}-err`} message={errors[name]} />
    </div>
  );

  return (
    <section id="contact" className={`${ui.section} ${ui.onDark} ${styles.section}`}>
      <div className={`${ui.container} ${styles.inner}`}>
        <div>
          <motion.div {...group(0.1)}>
            <motion.p className={ui.eyebrow} variants={item}>{CONTACT_SECTION.eyebrow}</motion.p>
            <motion.h2 className={`${ui.sectionH} ${styles.heading}`} variants={item}>
              {CONTACT_SECTION.title}
            </motion.h2>
            <motion.p className={`${ui.sectionP} ${styles.lead}`} variants={item}>
              {CONTACT_SECTION.lead}
            </motion.p>
          </motion.div>

          <motion.ul className={styles.channels} {...group(0.08, 0.1)}>
            {CHANNELS.map((c) => (
              <motion.li key={c.icon} variants={item}>
                <a
                  href={c.href}
                  className={styles.channel}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span className={styles.channelIcon}>
                    <Icon name={c.icon} size={20} />
                  </span>
                  <span className={styles.channelText}>
                    <span className={styles.channelLabel}>{c.label}</span>
                    <span className={styles.channelValue}>{c.value}</span>
                  </span>
                  <span className={styles.channelArrow} aria-hidden="true">
                    <Icon name="arrow" size={16} strokeWidth={2} />
                  </span>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <motion.div ref={cardRef} className={styles.form} {...reveal(0.15, 36)}>
          <AnimatePresence mode="wait" initial={false}>
            {sentUrl ? (
              <motion.div
                key="sent"
                className={styles.sent}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: EASE }}
                role="status"
              >
                <span className={styles.sentBadge}>
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <motion.path
                      d="M20 6 9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
                    />
                  </svg>
                </span>
                <h3 className={styles.title}>Your enquiry is ready in WhatsApp</h3>
                <p className={styles.sub}>
                  Tap send in WhatsApp to reach our trade desk. {FORM_COPY.note}
                </p>
                <div className={styles.sentActions}>
                  <a href={sentUrl} target="_blank" rel="noopener noreferrer" className={`${ui.btn} ${ui.btnOrange} ${ui.sweep}`}>
                    Open WhatsApp again <span className={ui.arrow} aria-hidden="true">→</span>
                  </a>
                  <button type="button" className={`${ui.btn} ${ui.btnGhostLight}`} onClick={reset}>
                    Send another enquiry
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                noValidate
                onSubmit={onSubmit}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: EASE }}
                aria-labelledby="enq-title"
              >
                <h3 id="enq-title" className={styles.title}>{FORM_COPY.title}</h3>
                <p className={styles.sub}>{FORM_COPY.sub}</p>

                <fieldset className={styles.who}>
                  <legend className={styles.label}>
                    {FORM_COPY.whoLabel} <span aria-hidden="true">*</span>
                  </legend>
                  <div className={styles.chips}>
                    {WHO.map((w) => {
                      const on = w.key === who;
                      return (
                        <label key={w.key} className={`${styles.chip}${on ? ` ${styles.chipOn}` : ''}`}>
                          <input
                            type="radio"
                            name="who"
                            value={w.key}
                            checked={on}
                            onChange={() => setWho(w.key)}
                            className="visually-hidden"
                          />
                          {on && (
                            <motion.span
                              layoutId="enquiryWhoChip"
                              className={styles.chipPill}
                              transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                              aria-hidden="true"
                            />
                          )}
                          <span className={styles.chipLabel}>{w.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className={styles.row}>
                  {field('name', 'Name', { required: true, placeholder: 'Your name', autoComplete: 'name' })}
                  {field('phone', 'Mobile', { required: true, type: 'tel', placeholder: '+91 98XXX XXXXX', autoComplete: 'tel', inputMode: 'tel' })}
                </div>
                <div className={styles.row}>
                  {field('email', 'Email', { type: 'email', placeholder: 'email@company.com', autoComplete: 'email' })}
                  {field('city', 'City', { required: true, placeholder: 'Your city', autoComplete: 'address-level2' })}
                </div>
                {field('company', 'Company / Business Name', { placeholder: 'Your company or firm', autoComplete: 'organization' })}

                <div className={`${styles.group}${errors.enquiry ? ` ${styles.groupError}` : ''}`}>
                  <label htmlFor="enq-enquiry" className={styles.label}>
                    What can we help you with? <span aria-hidden="true">*</span>
                  </label>
                  <div className={styles.selectWrap}>
                    <select
                      id="enq-enquiry"
                      name="enquiry"
                      className={styles.input}
                      value={form.enquiry}
                      onChange={onChange}
                      aria-required="true"
                      aria-invalid={errors.enquiry ? true : undefined}
                      aria-describedby={errors.enquiry ? 'enq-enquiry-err' : undefined}
                    >
                      <option value="">Select enquiry type</option>
                      {ENQUIRY_TYPES.map((t) => (
                        <option key={t.key} value={t.key}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <FieldError id="enq-enquiry-err" message={errors.enquiry} />
                </div>

                <div className={styles.group}>
                  <label htmlFor="enq-message" className={styles.label}>Brief message</label>
                  <textarea
                    id="enq-message"
                    name="message"
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="Tell us about your project, business or what you're looking for..."
                    value={form.message}
                    onChange={onChange}
                  />
                </div>

                <button type="submit" className={`${ui.btn} ${ui.btnOrange} ${ui.sweep} ${styles.submit}`}>
                  {FORM_COPY.submit} <span className={ui.arrow} aria-hidden="true">→</span>
                </button>
                <p className={styles.note}>{FORM_COPY.note}</p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function FieldError({ id, message }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.span
          id={id}
          className={styles.error}
          role="alert"
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -4 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          {message}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
