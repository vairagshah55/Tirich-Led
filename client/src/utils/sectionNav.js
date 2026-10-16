/**
 * Links into a homepage section — from the Navbar, the Footer, or the
 * homepage's own CTAs — optionally pre-filling the enquiry form on the way.
 *
 * Two transports, one payload ({ section, audience?, who?, enquiry? }):
 *
 *  - From another page the payload rides the URL: /?section=contact&who=dealer.
 *    LandingPage reads it on mount. The audit's dead-link check strips the
 *    query, so the crawlable href is still just "/".
 *  - On the homepage itself the URL must NOT change. App.js keys its page
 *    transition on pathname + search, so pushing "?section=…" would play the
 *    exit/enter animation and remount the whole page just to scroll it.
 *    Instead the payload is dispatched as a window event that LandingPage
 *    listens for.
 */
export const SECTION_EVENT = 'tirich:section';

/** "/?section=contact&who=dealer" — the cross-page form of a section link. */
export const sectionHref = (section, params = {}) => {
  const query = new URLSearchParams({ section });
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  return `/?${query.toString()}`;
};

/** Reads a section payload back out of a location.search string. */
export const parseSectionQuery = (search) => {
  const query = new URLSearchParams(search);
  const section = query.get('section');
  if (!section) return null;
  return {
    section,
    audience: query.get('audience') || undefined,
    who: query.get('who') || undefined,
    enquiry: query.get('enquiry') || undefined,
  };
};

/** Same-page transport: LandingPage scrolls and applies any preset. */
export const requestSection = (detail) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(SECTION_EVENT, { detail }));
};
