import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import styles from './LeadCaptureModal.module.css';

const EASE = [0.25, 1, 0.5, 1];
const STORAGE_KEY = 'tirichLead';
// Lead capture is handled by the 57facets backend.

// Must be https on the live site (https://tirichled.com) — an http→https
// redirect breaks the CORS preflight.
// Lead API is mounted under /api (nginx only proxies /api/* to the Node app).
// const LEAD_API_BASE = 'https://57facets.in/api';
const LEAD_API_BASE = 'http://localhost:5000/api'

const BUSINESS_OPTIONS = [
  { value: '', label: 'Select business type' },
  { value: 'led-showroom', label: 'LED Showroom' },
  { value: 'electrical-shop', label: 'Electrical Shop' },
  { value: 'distributor', label: 'Distributor' },
  { value: 'other', label: 'Other' },
];

const DESIGNATION_OPTIONS = [
  { value: '', label: 'Select designation' },
  { value: 'owner', label: 'Owner' },
  { value: 'interior', label: 'Interior Designer' },
  { value: 'architect', label: 'Architect' },
];

export function hasLeadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    // all required fields from the current form must exist
    return Boolean(
      data?.name && data?.phone && data?.city &&
      data?.business_type && data?.designation
    );
  } catch {
    return false;
  }
}

export function getLeadData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function clearLeadData() {
  localStorage.removeItem(STORAGE_KEY);
}


/* ────────────────── Modal Component ────────────────── */

export default function LeadCaptureModal({ open, onClose, onSuccess, required = false }) {
  // 'register' = full form, 'verify' = phone-only check
  const [mode, setMode] = useState('register');

  // ── Register form state ──
  const [form, setForm] = useState({
    name: '', phone: '', city: '',
    business_type: '', business_other: '', designation: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // ── Verify form state ──
  const [verifyPhone, setVerifyPhone] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (name === 'business_type' && value !== 'other') {
      setForm((f) => ({ ...f, business_type: value, business_other: '' }));
      if (errors.business_other) setErrors((prev) => ({ ...prev, business_other: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Mobile number is required';
    else if (!/^[+\d][\d\s\-()]{7,}$/.test(form.phone.trim())) errs.phone = 'Enter a valid mobile number';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.business_type) errs.business_type = 'Select your business type';
    if (form.business_type === 'other' && !form.business_other.trim()) errs.business_other = 'Please specify your business';
    if (!form.designation) errs.designation = 'Select your designation';
    return errs;
  };

  const saveLead = (lead) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...lead, capturedAt: new Date().toISOString() }));
  };

  // ── Submit full form ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setServerError('');

    const leadData = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      business_type: form.business_type,
      business_other: form.business_type === 'other' ? form.business_other.trim() : '',
      designation: form.designation,
    };

    try {
      const res = await fetch(`${LEAD_API_BASE}/sub-domain/lead/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || 'Something went wrong');
      }
      saveLead(leadData);
      onSuccess(leadData);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Verify phone number ──
  const handleVerify = async (e) => {
    e.preventDefault();
    const phone = verifyPhone.trim();
    if (!phone) { setVerifyError('Enter your mobile number'); return; }
    if (!/^[+\d][\d\s\-()]{7,}$/.test(phone)) { setVerifyError('Enter a valid mobile number'); return; }

    setVerifyLoading(true);
    setVerifyError('');

    try {
      const res = await fetch(`${LEAD_API_BASE}/sub-domain/lead/verify/${encodeURIComponent(phone)}`);
      if (res.status === 404) {
        setVerifyError('No record found. Please fill in your details.');
        return;
      }
      if (!res.ok) throw new Error('Something went wrong');
      const { data } = await res.json();
      saveLead(data.lead);
      onSuccess(data.lead);
    } catch (err) {
      setVerifyError(err.message);
    } finally {
      setVerifyLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setServerError('');
    setVerifyError('');
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={required ? undefined : onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button — hidden when modal is required */}
            {!required && (
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}

            {/* Header */}
            <div className={styles.header}>
              <motion.span
                className={styles.iconCircle}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </motion.span>
              <h2 className={styles.title}>
                {mode === 'register' ? 'Quick Details' : 'Welcome Back'}
              </h2>
              <p className={styles.subtitle}>
                {mode === 'register'
                  ? 'Share your details to explore our full product catalogue with specifications and pricing.'
                  : 'Enter your registered mobile number to continue.'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {mode === 'register' ? (
                /* ────────── REGISTER FORM ────────── */
                <motion.form
                  key="register"
                  className={styles.form}
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  {/* Name */}
                  <div className={styles.field}>
                    <label className={styles.label}>Full Name <span className={styles.req}>*</span></label>
                    <input
                      className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                      type="text" name="name" placeholder="Your name"
                      value={form.name} onChange={handleChange} autoFocus
                    />
                    {errors.name && <span className={styles.error}>{errors.name}</span>}
                  </div>

                  {/* Phone + City */}
                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label className={styles.label}>Mobile Number <span className={styles.req}>*</span></label>
                      <input
                        className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                        type="tel" name="phone" placeholder="+91 00000 00000"
                        value={form.phone} onChange={handleChange}
                      />
                      {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>City <span className={styles.req}>*</span></label>
                      <input
                        className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                        type="text" name="city" placeholder="Your city"
                        value={form.city} onChange={handleChange}
                      />
                      {errors.city && <span className={styles.error}>{errors.city}</span>}
                    </div>
                  </div>

                  {/* Nature of Business */}
                  <div className={styles.field}>
                    <label className={styles.label}>Nature of Business <span className={styles.req}>*</span></label>
                    <select
                      className={`${styles.input} ${styles.select} ${errors.business_type ? styles.inputError : ''}`}
                      name="business_type" value={form.business_type} onChange={handleChange}
                    >
                      {BUSINESS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} disabled={opt.value === ''}>{opt.label}</option>
                      ))}
                    </select>
                    {errors.business_type && <span className={styles.error}>{errors.business_type}</span>}
                  </div>

                  {/* Other business */}
                  <AnimatePresence>
                    {form.business_type === 'other' && (
                      <motion.div
                        className={styles.field}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        style={{ overflow: 'hidden' }}
                      >
                        <label className={styles.label}>Please Specify <span className={styles.req}>*</span></label>
                        <input
                          className={`${styles.input} ${errors.business_other ? styles.inputError : ''}`}
                          type="text" name="business_other" placeholder="Your business type"
                          value={form.business_other} onChange={handleChange}
                        />
                        {errors.business_other && <span className={styles.error}>{errors.business_other}</span>}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Designation */}
                  <div className={styles.field}>
                    <label className={styles.label}>Designation <span className={styles.req}>*</span></label>
                    <select
                      className={`${styles.input} ${styles.select} ${errors.designation ? styles.inputError : ''}`}
                      name="designation" value={form.designation} onChange={handleChange}
                    >
                      {DESIGNATION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} disabled={opt.value === ''}>{opt.label}</option>
                      ))}
                    </select>
                    {errors.designation && <span className={styles.error}>{errors.designation}</span>}
                  </div>

                  {serverError && <p className={styles.serverError}>{serverError}</p>}

                  <motion.button
                    type="submit" className={styles.submitBtn} disabled={loading}
                    whileHover={!loading ? { y: -2 } : undefined}
                    whileTap={!loading ? { scale: 0.97 } : undefined}
                  >
                    {loading ? <span className={styles.spinner} /> : (
                      <>
                        Continue to Product
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                      </>
                    )}
                  </motion.button>

                  <p className={styles.switchLink}>
                    Already shared your details?{' '}
                    <button type="button" className={styles.linkBtn} onClick={() => switchMode('verify')}>
                      Verify with mobile number
                    </button>
                  </p>
                </motion.form>
              ) : (
                /* ────────── VERIFY FORM ────────── */
                <motion.form
                  key="verify"
                  className={styles.form}
                  onSubmit={handleVerify}
                  noValidate
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  <div className={styles.field}>
                    <label className={styles.label}>Mobile Number <span className={styles.req}>*</span></label>
                    <input
                      className={`${styles.input} ${verifyError ? styles.inputError : ''}`}
                      type="tel" placeholder="+91 00000 00000"
                      value={verifyPhone}
                      onChange={(e) => { setVerifyPhone(e.target.value); setVerifyError(''); }}
                      autoFocus
                    />
                    {verifyError && <span className={styles.error}>{verifyError}</span>}
                  </div>

                  <motion.button
                    type="submit" className={styles.submitBtn} disabled={verifyLoading}
                    whileHover={!verifyLoading ? { y: -2 } : undefined}
                    whileTap={!verifyLoading ? { scale: 0.97 } : undefined}
                  >
                    {verifyLoading ? <span className={styles.spinner} /> : (
                      <>
                        Verify & Continue
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                      </>
                    )}
                  </motion.button>

                  <p className={styles.switchLink}>
                    New here?{' '}
                    <button type="button" className={styles.linkBtn} onClick={() => switchMode('register')}>
                      Fill in your details
                    </button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>

            <p className={styles.privacy}>
              Your information is kept private and used only for business enquiries.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
