/**
 * Homepage copy and data — transcribed verbatim from the "Tirich LED — Full
 * Homepage (B2B + B2C)" design. Edit the words here; the section components
 * only lay them out.
 *
 * Two deliberate departures from the design file:
 *  - Contact details (phone, email, WhatsApp) come from BUSINESS in
 *    config/seo.js, the site's single source for them, not from the mock-up.
 *  - The design's emoji placeholders are replaced by line icons (components/Icon)
 *    and, on the product cards, by real catalogue photography.
 */
import { BUSINESS } from '../../config/seo';

import imgCob from '../../assets/HD PHOTO/PRO-116.webp';
import imgTrack from '../../assets/HD PHOTO/TLC-124.webp';
import imgMagnetic from '../../assets/HD PHOTO/MAG-MOVE.webp';
import imgLinear from '../../assets/HD PHOTO/TLC-151.webp';
import imgPanel from '../../assets/HD PHOTO/TLC-339.webp';
import imgWallWasher from '../../assets/HD PHOTO/WALL-WASHER.webp';
import imgFlood from '../../assets/HD PHOTO/TLC-218.webp';

export const PHONE_DISPLAY = BUSINESS.telephone.replace(/-/g, ' ');
export const PHONE_HREF = `tel:${BUSINESS.telephone.replace(/[^+\d]/g, '')}`;
export const EMAIL = BUSINESS.email;
export const WHATSAPP_URL = `https://wa.me/${BUSINESS.whatsapp}`;
export const CATALOGUE_PDF = '/Tirich-LED-Catalogue-2026.pdf';

/* ── Hero ─────────────────────────────────────────────────────────── */
export const HERO = {
  kicker: 'LED Manufacturer · Surat, India · Est. Since 2018',
  titleLines: ['Precision LED lighting', 'built for spaces that matter.'],
  sub:
    'Architectural and interior LED fixtures manufactured in Surat. Trusted by dealers, ' +
    'specified by architects, installed by contractors across 18 states in India.',
  primaryCta: 'Explore Products',
  ghostCta: 'Join Dealer Network',
  stats: [
    { value: '500+', label: 'Projects delivered' },
    { value: '200+', label: 'Active dealers' },
    { value: '18', label: 'States covered' },
    { value: 'CRI 95+', label: 'Colour precision' },
  ],
  featuredLabel: 'Featured Product Range',
  featured: [
    { icon: 'downlight', name: 'COB Downlights', spec: 'CRI 95+ · 7W–30W · IP65', to: '/products/category/cob-lights' },
    { icon: 'track', name: 'Track Lights', spec: '15° – 60° beam · 15W–50W', to: '/products/category/track-lights' },
    { icon: 'linear', name: 'Linear / Batten', spec: '0.6m – 1.2m · DALI Ready', to: '/products/category/linear-lights' },
    { icon: 'magnet', name: 'Magnetic Track', spec: '48V · Modular · IP54', to: '/products/category/magnetic-track' },
    { icon: 'flood', name: 'Outdoor / Flood', spec: 'IP67 · 30W–200W · IK10', to: '/products/category/outdoor-lights' },
  ],
};

/* ── Ticker ───────────────────────────────────────────────────────── */
export const TICKER = [
  'COB Downlights',
  'Magnetic Track Systems',
  'Architectural Linear',
  'Hotel & Hospitality',
  'Retail Lighting',
  'Office & Commercial',
  'CRI 95+ Precision',
  'Pan-India Delivery',
  'GST Invoicing',
  'DALI Compatible',
  '50,000 HR Lifespan',
  'Dealer Network Open',
];

/* ── Enquiry form vocabulary ──────────────────────────────────────── */
// Keys are what links and CTAs pass around (?who=dealer&enquiry=trade);
// labels are the design's wording.
export const WHO = [
  { key: 'dealer', label: 'Dealer / Distributor' },
  { key: 'architect', label: 'Architect / Designer' },
  { key: 'contractor', label: 'Contractor' },
  { key: 'consultant', label: 'Consultant' },
  { key: 'client', label: 'End Client' },
];

export const ENQUIRY_TYPES = [
  { key: 'trade', label: 'Trade / Dealer Account' },
  { key: 'pricing', label: 'Product Pricing' },
  { key: 'project', label: 'Project / BOQ Support' },
  { key: 'technical', label: 'Technical / Spec Data' },
  { key: 'catalogue', label: 'Product Catalogue' },
  { key: 'sample', label: 'Sample Request' },
  { key: 'general', label: 'General Enquiry' },
];

/* ── Who we work with ─────────────────────────────────────────────── */
// Each CTA is an action, not a URL: { enquire } scrolls to the form with it
// pre-filled, { section } scrolls to a section, { catalogue } runs the
// lead-gated PDF download.
export const CONNECT = {
  eyebrow: 'Who we work with',
  titleLines: ['One manufacturer.', 'Every professional who needs light.'],
  lead: 'Whether you sell, specify, install or design — Tirich LED has a programme built for how you work.',
};

export const AUDIENCES = [
  {
    id: 'dealer',
    tab: 'Dealers & Distributors',
    icon: 'handshake',
    tone: 'dealer',
    visualLabel: 'Dealer programme · Open',
    visualTitle: ['Build your LED', 'business with Tirich'],
    visualTags: ['Authorised Dealer', 'Preferred Dealer', 'Regional Distributor'],
    visualStats: [
      { value: '20–40%', label: 'Trade margin' },
      { value: '200+', label: 'Active dealers' },
      { value: '48 hrs', label: 'Dispatch' },
    ],
    eyebrow: 'Dealers & Distributors',
    title: 'The most trusted LED brand your customers will ask for by name.',
    desc:
      'Join 200+ active dealers across India. Get trade pricing, priority stock, project support ' +
      'and co-branded marketing — everything you need to grow a profitable LED business.',
    features: [
      'Trade margins 20–40% below MRP (based on tier)',
      'Dedicated account manager from Day 1',
      'Priority stock allocation for project orders',
      'BOQ & project quotation support within 24 hrs',
      'Co-branded marketing kits & product catalogues',
      'GST-compliant invoicing on every order',
      'Pan-India dispatch within 48 hours from Surat',
      '3-year warranty managed by Tirich LED directly',
    ],
    primary: { label: 'Apply for Trade Account', action: { enquire: { who: 'dealer', enquiry: 'trade' } } },
    secondary: { label: 'View Dealer Tiers', action: { enquire: { who: 'dealer', enquiry: 'trade' } } },
  },
  {
    id: 'architect',
    tab: 'Architects & Designers',
    icon: 'setsquare',
    tone: 'architect',
    visualLabel: 'Specifier programme',
    visualTitle: ['Specify with precision.', 'Every time.'],
    visualTags: ['IES Files', 'BIM Objects', 'Photometric Data', 'Spec Sheets'],
    visualStats: [
      { value: 'CRI 95+', label: 'Colour rendering' },
      { value: 'R9 ≥ 50', label: 'Saturated red' },
      { value: 'IES', label: 'DIALux / Relux' },
    ],
    eyebrow: 'Architects & Interior Designers',
    title: 'Lighting that earns a place in your specification library.',
    desc:
      'Tirich LED products are designed for architectural precision — accurate colour rendering, ' +
      'tight beam control and clean fixture aesthetics. Everything you need to specify with confidence.',
    features: [
      'Full IES photometric files for DIALux / Relux',
      'BIM objects and CAD drawings for all fixtures',
      'CRI 95+ for true colour accuracy in retail & hospitality',
      'Custom CCT and beam angle on project orders',
      'Sample fixtures for client presentations',
      'Lux level calculation support from our technical team',
      'Fixture aesthetic consultations for your project brief',
    ],
    primary: { label: 'Request Spec Library', action: { enquire: { who: 'architect', enquiry: 'technical' } } },
    secondary: { label: 'Download IES Files', action: { enquire: { who: 'architect', enquiry: 'technical' } } },
  },
  {
    id: 'contractor',
    tab: 'Project Contractors',
    icon: 'wrench',
    tone: 'contractor',
    visualLabel: 'Project desk',
    visualTitle: ['Project supply.', 'On time. Every time.'],
    visualTags: ['BOQ Support', 'Phased Delivery', 'Site Coordination'],
    visualStats: [
      { value: '500+', label: 'Projects delivered' },
      { value: '1', label: 'Point of contact' },
      { value: '48 hrs', label: 'Dispatch' },
    ],
    eyebrow: 'Project Contractors & Suppliers',
    title: 'Large-project lighting supply you can build your schedule around.',
    desc:
      'From hotels to hospitals to corporate fit-outs — we supply at project scale with phased ' +
      'delivery coordination, BOQ support and a single point of contact from first quote to final installation.',
    features: [
      'BOQ preparation from your site drawings',
      'Phased delivery aligned to your construction schedule',
      'Project-specific pricing on orders above ₹2 lakhs',
      'Dedicated project manager for orders above ₹5 lakhs',
      'Installation technical support (remote & on-site)',
      'GST invoicing split by phase or building wing if needed',
      'Defect-liability period stock reserved for your project',
    ],
    primary: { label: 'Submit Project Enquiry', action: { enquire: { who: 'contractor', enquiry: 'project' } } },
    secondary: { label: 'Download Product Catalogue', action: { catalogue: true } },
  },
  {
    id: 'consultant',
    tab: 'Lighting Consultants',
    icon: 'bulb',
    tone: 'consultant',
    visualLabel: 'Technical desk',
    visualTitle: ['Technical data', 'at the depth you need.'],
    visualTags: ['LM-79', 'LM-80', 'TM-21', 'DALI', 'BMS Integration'],
    visualStats: [
      { value: 'L70', label: '@ 50,000 hrs' },
      { value: 'DALI-2', label: 'Certified drivers' },
      { value: 'UGR<19', label: 'Glare data' },
    ],
    eyebrow: 'LED Lighting Consultants & MEP',
    title: 'The technical depth you require. The relationship you deserve.',
    desc:
      'Lighting consultants and MEP firms trust Tirich LED for products with genuine photometric ' +
      'accuracy, certified test data and a manufacturer who answers technical questions directly — ' +
      'not via a distributor chain.',
    features: [
      'LM-79 & LM-80 test reports available on request',
      'DALI-2 certified dimmable drivers across the range',
      'BMS / KNX integration for commercial building projects',
      'Customised CCT, CRI and wattage for spec projects',
      'Glare index (UGR) data for open-plan office compliance',
      'Direct access to our R&D team for technical queries',
      'Consulting fee arrangement available for large projects',
    ],
    primary: { label: 'Talk to Technical Team', action: { enquire: { who: 'consultant', enquiry: 'technical' } } },
    secondary: { label: 'Download Test Reports', action: { enquire: { who: 'consultant', enquiry: 'technical' } } },
  },
  {
    id: 'b2c',
    tab: 'Direct / End Clients',
    icon: 'home',
    tone: 'b2c',
    visualLabel: 'Buy direct',
    visualTitle: ['Premium light.', 'Directly from the maker.'],
    visualTags: ['Homes', 'Showrooms', 'Boutiques', 'Restaurants'],
    visualStats: [
      { value: '3 yr', label: 'Warranty' },
      { value: '₹0', label: 'Middleman markup' },
      { value: 'Free', label: 'Layout consult' },
    ],
    eyebrow: 'Direct / End Client (B2C)',
    title: 'You don’t need to compromise on the light in your space.',
    desc:
      'The same fixtures specified in 5-star hotels and luxury retail chains — available directly ' +
      'for your home, restaurant, boutique or showroom. Buy at source and get the right guidance ' +
      'from people who make the product.',
    features: [
      'Buy directly from the manufacturer — no middleman markup',
      'Free lighting layout consultation for your space',
      'Sample visit at our Surat experience centre',
      'Installation guidance and wiring support',
      '3-year replacement warranty on every product',
      'Wide range of CCT (warm white to daylight) and dimmable options',
      'Project design support for larger homes and restaurants',
    ],
    primary: { label: 'Get a Free Consultation', action: { enquire: { who: 'client', enquiry: 'general' } } },
    secondary: { label: 'Browse Products', action: { section: 'products' } },
  },
];

export const AUDIENCE_IDS = AUDIENCES.map((a) => a.id);

/* ── Product showcase ─────────────────────────────────────────────── */
export const PRODUCT_SECTION = {
  eyebrow: 'Product range',
  title: 'Engineered for every architectural space.',
  lead:
    'Precision-manufactured LED fixtures across six categories — from slim COB downlights to ' +
    'heavy-duty outdoor flood systems.',
  cta: 'View Full Product Catalogue',
};

export const PRODUCT_FILTERS = ['All Products', 'Downlights', 'Track', 'Linear', 'Outdoor', 'Smart', 'Panel'];

// `img` is a real catalogue cut-out of that fitting type; `to` is the
// category or product page it belongs to. `tile` picks the design's
// background gradient.
export const SHOWCASE = [
  {
    name: 'COB Downlight', sub: 'Anti-glare recessed series', badge: 'Bestseller',
    specs: ['CRI 95+', '7–30W', 'IP65'], group: 'Downlights', tile: 1,
    img: imgCob, alt: 'Tirich LED anti-glare COB recessed downlight', to: '/products/category/cob-lights',
  },
  {
    name: 'Track Light', sub: 'Adjustable retail/hospitality', badge: 'New 2026',
    specs: ['15°–60°', '15–50W', '3CCT'], group: 'Track', tile: 2,
    img: imgTrack, alt: 'Tirich LED track-mounted COB spotlight', to: '/products/category/track-lights',
  },
  {
    name: 'Magnetic Track', sub: '48V modular system', badge: 'Premium',
    specs: ['48V', 'IP54', 'DALI'], group: 'Track', tile: 3,
    img: imgMagnetic, alt: 'Tirich LED 48V magnetic track module', to: '/products/category/magnetic-track',
  },
  {
    name: 'Linear Batten', sub: 'Suspended & surface mount',
    specs: ['0.6–1.2m', 'DALI', 'IK08'], group: 'Linear', tile: 4,
    img: imgLinear, alt: 'Tirich LED linear light modules', to: '/products/category/linear-lights',
  },
  {
    name: 'Slim Panel Light', sub: 'Edge-lit office series', badge: 'New',
    specs: ['UGR<19', '40–60W', '600×600'], group: 'Panel', tile: 5,
    img: imgPanel, alt: 'Tirich LED slim square panel light', to: '/products/tlc-339',
  },
  {
    name: 'Wall Washer', sub: 'Architectural facade wash',
    specs: ['IP67', 'RGBW', 'DMX'], group: 'Outdoor', tile: 6,
    img: imgWallWasher, alt: 'Tirich LED profile wall washer', to: '/products/wall-washer',
  },
  {
    name: 'Flood Light', sub: 'High-lumen outdoor',
    specs: ['IP67', '30–200W', 'IK10'], group: 'Outdoor', tile: 7,
    img: imgFlood, alt: 'Tirich LED high-lumen flood lights', to: '/products/tlc-218',
  },
  {
    name: 'Smart Dimming System', sub: 'DALI / BMS / Zone control', badge: 'Smart',
    specs: ['DALI-2', 'BMS', 'WiFi'], group: 'Smart', tile: 8,
    icon: 'smart', to: '/smart-lighting',
  },
];

/* ── Brand numbers ────────────────────────────────────────────────── */
export const BRAND_STATS = [
  { value: '500+', label: 'Commercial Projects', note: 'Hotels · Malls · Offices' },
  { value: '200+', label: 'Active Dealers', note: 'Across 18 states' },
  { value: '50K', label: 'Hour Lifespan', note: 'Rated lifespan · 3yr warranty' },
  { value: 'CRI 95+', label: 'Colour Accuracy', note: 'True Ra measurement' },
];

/* ── Applications ─────────────────────────────────────────────────── */
export const SPACES_SECTION = {
  eyebrow: 'Applications',
  title: 'The spaces Tirich LED has been built for.',
  lead:
    'From luxury hotel lobbies to industrial warehouses — our range covers every commercial ' +
    'application with the right fixture for the environment.',
};

export const SPACES = [
  { icon: 'hotel', tile: 2, tag: 'Hospitality', name: 'Hotels & Resorts', desc: 'Warm CRI 95+ downlights and dimmable track for lobbies, rooms and F&B spaces' },
  { icon: 'bag', tile: 1, tag: 'Retail', name: 'Retail & Showrooms', desc: 'High-CRI track lighting that makes merchandise colour-accurate and desirable' },
  { icon: 'office', tile: 3, tag: 'Commercial', name: 'Corporate Offices', desc: 'UGR<19 panel lights and dimmable linear for productive, glare-free workspaces' },
  { icon: 'hospital', tile: 4, tag: 'Healthcare', name: 'Hospitals & Clinics', desc: 'Flicker-free, high-CRI lighting for patient rooms, OTs and diagnostic areas' },
  { icon: 'home', tile: 5, tag: 'Residential', name: 'Premium Homes & Villas', desc: 'Architectural COB downlights and magnetic track for luxury residential interiors' },
  { icon: 'factory', tile: 6, tag: 'Industrial', name: 'Warehouses & Factories', desc: 'High-bay and flood lighting with IP67 rating for demanding industrial environments' },
];

/* ── Why Tirich ───────────────────────────────────────────────────── */
export const WHY_SECTION = {
  eyebrow: 'Why Tirich LED',
  title: 'What separates a lighting manufacturer from a lighting brand.',
  lead:
    'We make our own products. That means consistent quality, direct technical support, and the ' +
    'ability to customise for your project.',
};

export const WHY = [
  {
    icon: 'target',
    title: 'CRI 95+ Colour Precision',
    text:
      'Genuine Ra 95+ measurement — not marketing. Our COB chips render colour faithfully in retail, ' +
      'hospitality and healthcare where colour accuracy directly affects business outcomes.',
    spec: 'Ra ≥ 95 · R9 ≥ 50 · Tested batch by batch',
  },
  {
    icon: 'bolt',
    title: '50,000 Hour Rated Lifespan',
    text:
      'Engineered for commercial environments where replacement means scaffold hire and project ' +
      'disruption. L70 at 50,000 hours — independently measured, not estimated.',
    spec: 'L70 @ 50,000 hrs · 3-year replacement warranty',
  },
  {
    icon: 'factory',
    title: 'Manufactured in Surat',
    text:
      'We design and assemble in our own facility in Surat, Gujarat. No imported white-label ' +
      'rebranding. Direct factory support means your technical questions reach the people who built the product.',
    spec: 'JEET INDUSTRIES · Majura Udhana, Surat',
  },
  {
    icon: 'plug',
    title: 'DALI & BMS Integration',
    text:
      'Full DALI-2 compatibility across the dimming range for commercial building management. Zone ' +
      'control, scene setting and occupancy integration — ready for smart building specs from day one.',
    spec: 'DALI-2 · KNX · Modbus · 0-10V',
  },
  {
    icon: 'package',
    title: '48-Hour Dispatch, Pan-India',
    text:
      'Core SKUs maintained in Surat warehouse at all times. Standard orders dispatched within 48 hours. ' +
      'Project orders coordinated with your site delivery schedule — no surprises on opening day.',
    spec: 'Dispatches Mon–Sat · All major logistics partners',
  },
  {
    icon: 'clipboard',
    title: 'Full Technical Documentation',
    text:
      'IES files, LM-79 test reports, spec sheets, BIM objects and CAD drawings for every product — ' +
      'because architects and consultants shouldn’t have to guess at photometric data.',
    spec: 'IES · LM-79 · LM-80 · BIM · DXF',
  },
];

/* ── Projects ─────────────────────────────────────────────────────── */
export const PROJECTS_SECTION = {
  eyebrow: 'Selected projects',
  title: 'Spaces we’ve lit across India.',
  lead:
    '500+ completed projects — from single showrooms to full hotel installations. Every project ' +
    'backed by our technical and after-sales team.',
  cta: 'View All Projects',
  // No projects page exists yet, so the CTA asks for the portfolio on
  // WhatsApp rather than pointing at nothing.
  ctaMessage: 'Hello! Please share the Tirich LED project portfolio.',
};

export const PROJECTS = [
  { big: true, icon: 'hotel', type: 'Hospitality', name: 'The Grand Residency Hotel', loc: 'Surat, Gujarat · 2025', stat: '1,200 fixtures · COB + Track + Linear' },
  { icon: 'bag', type: 'Retail', name: 'Luxury Fashion Showroom', loc: 'Ahmedabad · 2025', stat: '380 fixtures' },
  { icon: 'office', type: 'Office', name: 'Corporate HQ Fit-Out', loc: 'Mumbai · 2024', stat: '640 fixtures · DALI' },
  { icon: 'dining', type: 'F&B', name: 'Restaurant Chain Rollout', loc: '6 locations · 2024', stat: '220 fixtures / location' },
  { icon: 'hospital', type: 'Healthcare', name: 'Multi-Specialty Hospital', loc: 'Vadodara · 2024', stat: '2,100 fixtures' },
];

/* ── Dealer programme ─────────────────────────────────────────────── */
export const DEALER_CTA = {
  kicker: 'Dealer & Distributor Programme · Open Now',
  titleLines: ['Grow your lighting business', 'with India’s precision LED maker.'],
  sub:
    'Trade pricing, stock priority, project support and a brand that clients ask for by name. ' +
    'Becoming a Tirich LED dealer is the fastest way to win LED business in your market.',
  who: ['Electrical Dealers', 'Lighting Showrooms', 'Regional Distributors', 'Project Suppliers', 'Online Sellers'],
  primary: 'Apply for Trade Account',
  secondary: 'Download 2026 Catalogue',
};

/* ── Certifications ───────────────────────────────────────────────── */
export const CERTS_LABEL = 'Certifications & Standards';
export const CERTS = [
  'BIS Certified',
  'CE Marked',
  'RoHS Compliant',
  'IP65 / IP67',
  'DALI-2 Compatible',
  'LM-79 Tested',
  'GST Registered',
];

/* ── Testimonials ─────────────────────────────────────────────────── */
export const TESTIMONIALS_SECTION = {
  eyebrow: 'What professionals say',
  title: 'From the people who specify, sell and install.',
};

export const TESTIMONIALS = [
  {
    quote:
      'We’ve been stocking Tirich LED for 3 years. The quality consistency is what keeps us loyal — ' +
      'we’ve had almost zero returns, and our clients are genuinely happy with the light output and CRI.',
    initials: 'RS',
    name: 'Rajesh Shah',
    role: 'Electrical Dealer · Ahmedabad',
  },
  {
    quote:
      'As an interior designer, I specify by CRI first. Tirich LED’s COB downlights are genuinely 95+ — ' +
      'the colour rendering in our hospitality projects is excellent. The IES files make our DIALux work much faster.',
    initials: 'PM',
    name: 'Priya Mehta',
    role: 'Interior Designer · Mumbai',
  },
  {
    quote:
      'We completed a 1,200-fixture hotel project with Tirich LED. Their project team coordinated delivery ' +
      'in phases, the BOQ support was fast and the site team had direct technical access. Superb execution.',
    initials: 'AK',
    name: 'Ajay Kulkarni',
    role: 'MEP Contractor · Surat',
  },
];

/* ── Contact ──────────────────────────────────────────────────────── */
export const CONTACT_SECTION = {
  eyebrow: 'Connect with Tirich LED',
  title: 'Let’s find the right partnership for you.',
  lead:
    'Whether you’re a dealer wanting trade pricing, an architect needing spec data, or a client ' +
    'planning a space — we’re a direct call or message away.',
};

const ADDRESS_LINE = 'Plot 88/89, Majura Udhana, Surat 394210';

export const CHANNELS = [
  { icon: 'phone', label: 'Trade Desk · Mon–Sat 9am–6:30pm', value: PHONE_DISPLAY, href: PHONE_HREF },
  { icon: 'mail', label: 'Email — responds within 24 hours', value: EMAIL, href: `mailto:${EMAIL}` },
  { icon: 'chat', label: 'WhatsApp — fastest for catalogue & pricing', value: 'Chat on WhatsApp →', href: WHATSAPP_URL, external: true },
  {
    icon: 'pin',
    label: 'Visit our experience centre · Surat',
    value: ADDRESS_LINE,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      [BUSINESS.streetAddress, BUSINESS.addressLocality, BUSINESS.addressRegion, BUSINESS.postalCode].filter(Boolean).join(', ')
    )}`,
    external: true,
  },
];

export const FORM_COPY = {
  title: 'Send us an enquiry',
  sub: 'Tell us who you are and we’ll respond with the right information.',
  whoLabel: 'I am a',
  submit: 'Send Enquiry',
  note: 'We respond within 24 hours · Mon–Sat · No spam, ever.',
};
