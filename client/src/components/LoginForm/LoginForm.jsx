import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../InputField/InputField';
import Button from '../Button/Button';
import styles from './LoginForm.module.css';

const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [serverSuccess, setServerSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // This effect runs whenever formData or errors change
    // to determine if the login button should be enabled.
    const validateForm = () => {
      const noErrors = Object.keys(errors).length === 0;
      const allFieldsFilled = formData.email !== '' && formData.password !== '';
      setIsFormValid(noErrors && allFieldsFilled);
    };
    validateForm();
  }, [formData, errors]);

  const validateField = (name, value) => {
    let error = '';
    if (name === 'email') {
      if (!value) {
        error = 'Email is required.';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = 'Email address is invalid.';
      }
    } else if (name === 'password') {
      if (!value) {
        error = 'Password is required.';
      } else if (value.length < 8) {
        error = 'Password must be at least 8 characters.';
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const fieldError = validateField(name, value);
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (fieldError) {
        newErrors[name] = fieldError;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setServerSuccess('');

    if (!isFormValid) {
      console.log('Form is invalid, cannot submit.');
      return;
    }

    setIsLoading(true);
    try {
      const rawBase =
        process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';
      const apiBase = rawBase.endsWith('/api')
        ? `${rawBase}/v1`
        : rawBase.replace(/\/$/, '');
      const response = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (data?.errors) {
          setErrors((prev) => ({ ...prev, ...data.errors }));
        }
        setServerError(data?.message || 'Login failed.');
        return;
      }

      const user = data?.data?.user;
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
      setServerSuccess('Login successful!');
      setFormData({ email: '', password: '' });
      navigate('/dashboard');
    } catch (err) {
      setServerError('Unable to reach server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <h2 className={styles.title}>Sign in to your account</h2>
      <InputField
        id="email"
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        autoComplete="email"
        required
      />
      <div className={styles.passwordWrapper}>
        <InputField
          id="password"
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={styles.showPasswordButton}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {/* Basic SVG for show/hide icon */}
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      <div className={styles.options}>
        <div className={styles.rememberMe}>
          <input type="checkbox" id="remember-me" />
          <label htmlFor="remember-me">Remember me</label>
        </div>
        <a href="/forgot-password" className={styles.forgotPassword}>
          Forgot password?
        </a>
      </div>

      {serverError && <p className={styles.formError}>{serverError}</p>}
      {serverSuccess && <p className={styles.formSuccess}>{serverSuccess}</p>}

      <Button type="submit" disabled={!isFormValid} loading={isLoading}>
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
