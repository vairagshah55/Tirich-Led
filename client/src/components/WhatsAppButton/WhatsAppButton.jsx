import { motion } from 'motion/react';
import styles from './WhatsAppButton.module.css';
import { buttonHover, buttonTap, scaleIn } from '../../utils/motion';

const MotionAnchor = motion.a;

const PHONE = '917383247625'; // +91 country code + number
const MESSAGE = 'Hello! I am interested in Tirich LED products.';

export default function WhatsAppButton() {
  const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <MotionAnchor
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.btn}
      aria-label="Chat with us on WhatsApp"
      {...scaleIn(0.35)}
      animate={{
        ...scaleIn(0.35).animate,
        y: [0, -4, 0],
        transition: {
          opacity: { duration: 0.45, delay: 0.35, ease: [0.22, 1, 0.36, 1] },
          scale: { duration: 0.45, delay: 0.35, ease: [0.22, 1, 0.36, 1] },
          y: {
            duration: 3.2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        },
      }}
      whileHover={buttonHover}
      whileTap={buttonTap}
    >
      {/* WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className={styles.icon}
        aria-hidden="true"
      >
        <path
          d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.469 2.027 7.773L0 32l8.456-2.016A15.94 15.94 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.77-1.85l-.485-.287-5.02 1.197 1.225-4.887-.317-.503A13.253 13.253 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.874c-.397-.199-2.35-1.16-2.714-1.292-.365-.133-.63-.199-.895.199-.265.397-1.028 1.292-1.26 1.558-.232.265-.464.299-.861.1-.397-.199-1.676-.618-3.193-1.97-1.18-1.052-1.977-2.351-2.208-2.748-.232-.397-.025-.611.174-.809.179-.178.397-.464.596-.696.199-.232.265-.397.397-.662.133-.265.066-.497-.033-.696-.1-.199-.895-2.157-1.226-2.953-.323-.775-.65-.67-.895-.683-.232-.012-.497-.015-.762-.015-.265 0-.696.1-1.06.497-.365.397-1.393 1.36-1.393 3.317 0 1.957 1.426 3.847 1.625 4.112.199.265 2.806 4.285 6.798 5.997.95.41 1.692.655 2.27.838.953.303 1.82.26 2.505.158.764-.114 2.35-.96 2.682-1.888.332-.928.332-1.724.232-1.888-.099-.165-.364-.265-.762-.464z"
          fill="currentColor"
        />
      </svg>
      <span className={styles.label}>Chat with us</span>
    </MotionAnchor>
  );
}
