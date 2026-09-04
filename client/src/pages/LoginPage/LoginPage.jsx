import React from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import Seo from '../../components/Seo/Seo';
import styles from './LoginPage.module.css';

const LoginPage = ({ onLoginSuccess }) => {
  return (
    <main className={styles.container}>
      <Seo title="Sign In" path="/login" noindex nofollow />
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </main>
  );
};

export default LoginPage;
