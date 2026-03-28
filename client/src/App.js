import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
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
import { pageTransition } from './utils/motion';

const PAGE_TITLES = {
  '/':           'Tirich LED — Precision LED Lighting',
  '/about':      'About Us | Tirich LED',
  '/products':   'Products | Tirich LED',
  '/contact':    'Contact Us | Tirich LED',
  '/login':      'Partner Login | Tirich LED',
  '/dashboard':  'Dashboard | Tirich LED',
  '/ai-studio':  'AI Studio | Tirich LED',
};

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

  useEffect(() => {
    const path = location.pathname;
    // Product detail: /products/:slug
    if (path.startsWith('/products/')) {
      const slug = path.replace('/products/', '').replace(/-/g, ' ');
      const name = slug.replace(/\b\w/g, c => c.toUpperCase());
      document.title = `${name} | Tirich LED`;
    } else {
      document.title = PAGE_TITLES[path] || 'Tirich LED — Precision LED Lighting';
    }
  }, [location.pathname]);

  if (authLoading) {
    return <div className="App" />;
  }

  return (
    <div className="App">
      <CustomCursor />
      <WhatsAppButton />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${location.pathname}${location.search}`}
          {...pageTransition}
        >
          <Routes location={location}>
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
