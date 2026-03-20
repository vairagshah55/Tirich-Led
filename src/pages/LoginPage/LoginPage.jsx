import React from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import styles from './LoginPage.module.css';

const LoginPage = ({ onLoginSuccess }) => {
  return (
    <div className={styles.container}>
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </div>
  );
};

export default LoginPage;
