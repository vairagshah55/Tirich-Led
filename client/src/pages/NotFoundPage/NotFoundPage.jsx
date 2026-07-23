import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Navbar from '../../components/Navbar/Navbar';
import Seo from '../../components/Seo/Seo';
import { buttonHover, buttonTap } from '../../utils/motion';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.page}>
      <Seo title="Page not found" noindex />
      <Navbar />

      <main className={styles.wrap}>
        <motion.div
          className={styles.inner}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={styles.code}>404</p>
          <span className={styles.rule} aria-hidden="true" />
          <h1 className={styles.title}>Page not found</h1>
          <p className={styles.text}>
            The page you're looking for doesn't exist or may have moved. Explore our
            LED lighting range or head back to the homepage.
          </p>
          <div className={styles.actions}>
            <motion.div whileHover={buttonHover} whileTap={buttonTap}>
              <Link to="/products" className={styles.btnPrimary}>Browse Products</Link>
            </motion.div>
            <motion.div whileHover={buttonHover} whileTap={buttonTap}>
              <Link to="/" className={styles.btnGhost}>Back to Home</Link>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
