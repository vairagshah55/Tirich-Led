import React from 'react';
import { motion } from 'motion/react';
import styles from './Button.module.css';
import { buttonHover, buttonTap } from '../../utils/motion';

const MotionButton = motion.button;

const Button = ({ children, onClick, disabled = false, loading = false, type = 'button' }) => {
  return (
    <MotionButton
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={styles.button}
      whileHover={!disabled && !loading ? buttonHover : undefined}
      whileTap={!disabled && !loading ? buttonTap : undefined}
    >
      {loading ? <div className={styles.spinner}></div> : children}
    </MotionButton>
  );
};

export default Button;
