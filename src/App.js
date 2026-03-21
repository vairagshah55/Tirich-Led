import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import LandingPage from './pages/LandingPage/LandingPage';
import AIStudioPage from './pages/AIStudioPage/AIStudioPage';
import AboutPage from './pages/AboutPage/AboutPage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import ContactPage from './pages/ContactPage/ContactPage';
import CustomCursor from './components/CustomCursor/CustomCursor';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';

function App() {
  const location = useLocation();
  const [authUser, setAuthUser] = useState(() => {
    const raw = localStorage.getItem('authUser');
    return raw ? JSON.parse(raw) : null;
  });
  const [authLoading, setAuthLoading] = useState(true);

  const handleLoginSuccess = (user) => {
    if (!user) return;
    localStorage.setItem('authUser', JSON.stringify(user));
    setAuthUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    setAuthUser(null);
  };

  const isAuthed = Boolean(authUser);
  const apiBase = useMemo(() => {
    const rawBase =
      process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';
    return rawBase.endsWith('/api') ? `${rawBase}/v1` : rawBase.replace(/\/$/, '');
  }, []);

  const dismissSplash = () => {
    const splash = document.getElementById('tirich-splash');
    if (!splash) return;
    splash.classList.add('splash-hide');
    setTimeout(() => splash.remove(), 600);
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await fetch(`${apiBase}/auth/me`, {
          credentials: 'include',
          cache: 'no-store',
        });
        const data = await res.json().catch(() => null);
        if (res.ok && data?.data?.user) {
          localStorage.setItem('authUser', JSON.stringify(data.data.user));
          setAuthUser(data.data.user);
        }
      } catch (_) {
        // Ignore restore failures
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();
  }, [apiBase]);

  useEffect(() => {
    if (!authLoading) dismissSplash();
  }, [authLoading]);

  if (authLoading) {
    return <div className="App" />;
  }

  return (
    <div className="App">
      <CustomCursor />
      <WhatsAppButton />
      <div key={location.key} className="pageTransition">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            isAuthed ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthed ? (
              <DashboardPage
                onLogout={handleLogout}
                authUser={authUser}
                onAuthRefresh={handleLoginSuccess}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/ai-studio"
          element={
            isAuthed ? (
              <AIStudioPage user={authUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </div>
    </div>
  );
}

export default App;
