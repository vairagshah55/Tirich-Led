/**
 * Browser-environment helpers.
 *
 * The production build is pre-rendered in a headless browser
 * (scripts/prerender-body.js) and the resulting HTML is then hydrated in the
 * visitor's browser. Two rules follow from that:
 *
 *  1. Nothing may touch a browser API at module scope in a way that throws if
 *     it is absent — keeps the code portable to a Node renderer later.
 *  2. Anything whose value differs between the pre-render and the visitor
 *     (localStorage, viewport, media queries) must NOT decide the *first*
 *     render, or React logs a hydration mismatch and throws the server markup
 *     away. Read it in an effect instead — see useIsomorphicValue below.
 */

export const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * True while the page is being captured by the pre-renderer.
 *
 * scripts/prerender-body.js sets window.__PRERENDER__ before any app code
 * runs. Used to freeze time-based UI (the hero carousel) so the captured HTML
 * is deterministic and matches React's first client render.
 */
export const isPrerendering = () =>
  isBrowser && window.__PRERENDER__ === true;

/** Reads a localStorage key, returning `fallback` when unavailable. */
export function getStorageItem(key, fallback = null) {
  if (!isBrowser) return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch {
    // Private mode / storage disabled / quota errors.
    return fallback;
  }
}

/** Reads and JSON-parses a localStorage key. */
export function getStorageJson(key, fallback = null) {
  const raw = getStorageItem(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/** Writes a JSON value to localStorage. Silently no-ops when unavailable. */
export function setStorageJson(key, value) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

/** Removes a localStorage key. Silently no-ops when unavailable. */
export function removeStorageItem(key) {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** Current hostname, or '' outside a browser. */
export const getHostname = () => (isBrowser ? window.location.hostname : '');

/** True when running against localhost — used to pick a dev API base. */
export const isLocalhost = () =>
  ['localhost', '127.0.0.1'].includes(getHostname());

/** Respects the OS "reduce motion" setting; false when it can't be read. */
export const prefersReducedMotion = () => {
  if (!isBrowser || typeof window.matchMedia !== 'function') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};
