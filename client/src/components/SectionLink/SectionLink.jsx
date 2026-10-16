import { Link, useLocation } from 'react-router-dom';
import { requestSection, sectionHref } from '../../utils/sectionNav';

/**
 * A link to a homepage section that behaves correctly from anywhere:
 * a real, crawlable <a href="/?section=…"> everywhere, but on the homepage
 * the click is intercepted and handled in place (see utils/sectionNav.js).
 *
 * `section` is the target element id; `audience`, `who` and `enquiry`
 * optionally pre-select the audience tab and the enquiry form.
 */
export default function SectionLink({
  section,
  audience,
  who,
  enquiry,
  onClick,
  children,
  ...rest
}) {
  const { pathname } = useLocation();

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || pathname !== '/') return;
    // Let modified clicks (new tab / window) through untouched.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    requestSection({ section, audience, who, enquiry });
  };

  return (
    <Link to={sectionHref(section, { audience, who, enquiry })} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
