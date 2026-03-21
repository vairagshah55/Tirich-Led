import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, onClick, disabled = false, loading = false, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={styles.button}
    >
      {loading ? <div className={styles.spinner}></div> : children}
    </button>
  );
};

export default Button;
