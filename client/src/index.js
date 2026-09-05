import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';

const container = document.getElementById('root');

const app = (
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
);

// createRoot, not hydrateRoot — deliberately, even though the 107 public routes
// now ship a fully rendered body.
//
// hydrateRoot expects markup produced by ReactDOMServer, which delimits every
// Suspense boundary with `<!--$-->` / `<!--/$-->` comment markers. Our HTML is
// captured from a live DOM by scripts/prerender-body.js, so those markers do
// not exist. App.js wraps <Routes> in a <Suspense> on every route, so React
// looks for a boundary marker, finds an element, and throws:
//
//   #418  Hydration failed because the initial UI does not match…
//   #423  …the entire root will switch to client rendering
//
// It recovers by re-rendering client-side anyway — so the only thing hydration
// bought here was two console errors on every page load. Verified against the
// real build: the homepage fails identically even though LandingPage is a
// static import, which rules out the lazy chunks and points at the boundary
// markers themselves.
//
// Nothing is lost for SEO: crawlers read the pre-rendered HTML, which is the
// entire point of the body pre-render. Visitors see that same HTML painted
// immediately, then React mounts over it with identical markup.
//
// To make real hydration work, the HTML has to come from ReactDOMServer — which
// needs the Node-SSR blockers in src/config, App.js and the page components
// resolved first. See "Full-body pre-rendering" in SEO.md.
createRoot(container).render(app);
