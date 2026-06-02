import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import styles from './WhatsAppQuoteModal.module.css';

const EASE = [0.25, 1, 0.5, 1];
const PHONE = '919586556384';

export default function WhatsAppQuoteModal({ open, onClose, product }) {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Mobile number is required';
    else if (!/^[+\d][\d\s\-()]{7,}$/.test(form.phone.trim()))
      errs.phone = 'Enter a valid mobile number';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const lines = [
      `Hi, I'm interested in a Tirich LED product.`,
      ``,
      `*Product:* ${product?.name || 'N/A'}`,
      `*Category:* ${product?.category || 'N/A'}`,
      product?.wattage ? `*Wattage:* ${product.wattage}` : '',
      product?.cct ? `*CCT:* ${product.cct}` : '',
      product?.ip ? `*IP Rating:* ${product.ip}` : '',
      ``,
      `*Name:* ${form.name.trim()}`,
      `*Phone:* ${form.phone.trim()}`,
      form.message.trim() ? `*Message:* ${form.message.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(lines)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    // Reset and close
    setForm({ name: '', phone: '', message: '' });
    setErrors({});
    onClose();
  };

  const handleBackdropClick = () => {
    setForm({ name: '', phone: '', message: '' });
    setErrors({});
    onClose();
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
          onClick={handleBackdropClick}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button className={styles.closeBtn} onClick={handleBackdropClick} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Header */}
            <div className={styles.header}>
              <motion.span
                className={styles.iconCircle}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24" aria-hidden="true">
                  <path
                    d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.469 2.027 7.773L0 32l8.456-2.016A15.94 15.94 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.77-1.85l-.485-.287-5.02 1.197 1.225-4.887-.317-.503A13.253 13.253 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.874c-.397-.199-2.35-1.16-2.714-1.292-.365-.133-.63-.199-.895.199-.265.397-1.028 1.292-1.26 1.558-.232.265-.464.299-.861.1-.397-.199-1.676-.618-3.193-1.97-1.18-1.052-1.977-2.351-2.208-2.748-.232-.397-.025-.611.174-.809.179-.178.397-.464.596-.696.199-.232.265-.397.397-.662.133-.265.066-.497-.033-.696-.1-.199-.895-2.157-1.226-2.953-.323-.775-.65-.67-.895-.683-.232-.012-.497-.015-.762-.015-.265 0-.696.1-1.06.497-.365.397-1.393 1.36-1.393 3.317 0 1.957 1.426 3.847 1.625 4.112.199.265 2.806 4.285 6.798 5.997.95.41 1.692.655 2.27.838.953.303 1.82.26 2.505.158.764-.114 2.35-.96 2.682-1.888.332-.928.332-1.724.232-1.888-.099-.165-.364-.265-.762-.464z"
                    fill="currentColor"
                  />
                </svg>
              </motion.span>
              <h2 className={styles.title}>Get a Quote on WhatsApp</h2>
              <p className={styles.subtitle}>
                Fill in your details and we'll open a WhatsApp chat with your product enquiry ready to send.
              </p>
            </div>

            {/* Product badge */}
            {product && (
              <div className={styles.productBadge}>
                <img src={product.image} alt={product.name} className={styles.productThumb} loading="lazy" />
                <div className={styles.productInfo}>
                  <span className={styles.productCat}>{product.category}</span>
                  <strong className={styles.productName}>{product.name}</strong>
                </div>
              </div>
            )}

            {/* Form */}
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label className={styles.label}>
                  Your Name <span className={styles.req}>*</span>
                </label>
                <input
                  className={`${styles.input}${errors.name ? ` ${styles.inputError}` : ''}`}
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange}
                  autoFocus
                />
                {errors.name && <span className={styles.error}>{errors.name}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Mobile Number <span className={styles.req}>*</span>
                </label>
                <input
                  className={`${styles.input}${errors.phone ? ` ${styles.inputError}` : ''}`}
                  type="tel"
                  name="phone"
                  placeholder="+91 00000 00000"
                  value={form.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className={styles.error}>{errors.phone}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Message <span className={styles.optional}>(optional)</span>
                </label>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  name="message"
                  placeholder="Any specific requirements..."
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <motion.button
                type="submit"
                className={styles.submitBtn}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="18" height="18" aria-hidden="true">
                  <path
                    d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.469 2.027 7.773L0 32l8.456-2.016A15.94 15.94 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.77-1.85l-.485-.287-5.02 1.197 1.225-4.887-.317-.503A13.253 13.253 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.874c-.397-.199-2.35-1.16-2.714-1.292-.365-.133-.63-.199-.895.199-.265.397-1.028 1.292-1.26 1.558-.232.265-.464.299-.861.1-.397-.199-1.676-.618-3.193-1.97-1.18-1.052-1.977-2.351-2.208-2.748-.232-.397-.025-.611.174-.809.179-.178.397-.464.596-.696.199-.232.265-.397.397-.662.133-.265.066-.497-.033-.696-.1-.199-.895-2.157-1.226-2.953-.323-.775-.65-.67-.895-.683-.232-.012-.497-.015-.762-.015-.265 0-.696.1-1.06.497-.365.397-1.393 1.36-1.393 3.317 0 1.957 1.426 3.847 1.625 4.112.199.265 2.806 4.285 6.798 5.997.95.41 1.692.655 2.27.838.953.303 1.82.26 2.505.158.764-.114 2.35-.96 2.682-1.888.332-.928.332-1.724.232-1.888-.099-.165-.364-.265-.762-.464z"
                    fill="currentColor"
                  />
                </svg>
                Send via WhatsApp
              </motion.button>
            </form>

            <p className={styles.privacy}>
              This will open WhatsApp with your enquiry pre-filled. No data is stored.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
