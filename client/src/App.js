import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
// LandingPage is the first paint (default route) — keep it in the main
// bundle so the homepage renders immediately without a Suspense flash.
import LandingPage from './pages/LandingPage/LandingPage';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';
import { pageTransition } from './utils/motion';

// All other pages are split into their own chunks and loaded on demand,
// so the dashboard / AI-studio bundles and product images aren't part of
// first paint.
const LoginPage         = lazy(() => import('./pages/LoginPage/LoginPage'));
const DashboardPage     = lazy(() => import('./pages/DashboardPage/DashboardPage'));
const AIStudioPage      = lazy(() => import('./pages/AIStudioPage/AIStudioPage'));
const AboutPage         = lazy(() => import('./pages/AboutPage/AboutPage'));
const ProductsPage      = lazy(() => import('./pages/ProductsPage/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage/ProductDetailPage'));
const ContactPage       = lazy(() => import('./pages/ContactPage/ContactPage'));
const SmartLightingPage = lazy(() => import('./pages/SmartLightingPage/SmartLightingPage'));

const PAGE_TITLES = {
  '/':           'Tirich LED — Precision LED Lighting',
  '/about':      'About Us | Tirich LED',
  '/products':   'Products | Tirich LED',
  '/contact':    'Contact Us | Tirich LED',
  '/smart-lighting': 'Smart Lighting | Tirich LED',
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
      process.env.REACT_APP_API_BASE_URL || 'https://tirich-led.onrender.com/api/v1';
    return rawBase.endsWith('/api') ? `${rawBase}/v1` : rawBase.replace(/\/$/, '');
  }, []);

  const dismissSplash = () => {
    const splash = document.getElementById('tirich-splash');
    if (!splash) return;
    splash.classList.add('splash-hide');
    setTimeout(() => splash.remove(), 600);
  };

  // Dismiss the splash as soon as the app has mounted — the homepage must
  // never wait on the backend (Render free tier can cold-start for 30–60s).
  useEffect(() => {
    dismissSplash();
  }, []);

  // Refresh/validate the session in the background. The UI renders
  // immediately using the optimistic authUser read from localStorage; this
  // only updates it once /auth/me resolves and never blocks first paint.
  useEffect(() => {
    let cancelled = false;
    const restoreSession = async () => {
      try {
        const res = await fetch(`${apiBase}/auth/me`, {
          credentials: 'include',
          cache: 'no-store',
        });
        const data = await res.json().catch(() => null);
        if (cancelled) return;
        if (res.ok && data?.data?.user) {
          localStorage.setItem('authUser', JSON.stringify(data.data.user));
          setAuthUser(data.data.user);
        }
      } catch (_) {
        // Ignore restore failures — optimistic localStorage state stands.
      }
    };

    restoreSession();
    return () => { cancelled = true; };
  }, [apiBase]);

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

  return (
    <div className="App">
      <WhatsAppButton />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${location.pathname}${location.search}`}
          {...pageTransition}
        >
          <Suspense fallback={null}>
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
            <Route path="/smart-lighting" element={<SmartLightingPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
