import product1     from '../assets/TLC-101.jpg';
import product2     from '../assets/TLC-105.jpg';
import product3     from '../assets/TLC-108.jpg';
import product4     from '../assets/TLC-111.jpg';
import product5     from '../assets/TLC-112.jpg';
import product7     from '../assets/TLC-121.jpg';
import product8     from '../assets/TLC-129.jpg';
import product9     from '../assets/TLC-151.jpg';
import hangingLight from '../assets/hanging-230.jpg';
import stripLed     from '../assets/STRIP-LED-POST.jpg';

export const PRODUCTS = [
  {
    slug: 'tlc-101',
    name: 'TLC-101',
    category: 'Panel Lights',
    categorySlug: 'panel-lights',
    tagline: 'Ultra-Slim Surface Panel',
    image: product1,
    wattage: '12W / 18W / 24W',
    cri: '95+',
    cct: '3000K / 4000K / 6500K',
    ip: 'IP40',
    lifespan: '50,000 hrs',
    description:
      'The TLC-101 ultra-slim panel delivers uniform, glare-free illumination ideal for offices, retail spaces, and hospitality environments. Precision-engineered SMD chipset ensures colour consistency across every production batch.',
    features: ['Flicker-free driver', 'Anti-glare diffuser', '10mm slim profile', 'Easy ceiling mount', 'CE & RoHS certified'],
  },
  {
    slug: 'tlc-105',
    name: 'TLC-105',
    category: 'Panel Lights',
    categorySlug: 'panel-lights',
    tagline: 'Edge-Lit Commercial Panel',
    image: product2,
    wattage: '36W / 48W',
    cri: '95+',
    cct: '4000K / 5000K',
    ip: 'IP40',
    lifespan: '50,000 hrs',
    description:
      'Edge-lit technology for shadow-free uniformity across the full panel face. The TLC-105 is engineered for large commercial spaces where consistent colour rendering is non-negotiable.',
    features: ['Edge-lit technology', '120° beam angle', 'PF > 0.9', 'CE & RoHS certified', 'Thin bezel design'],
  },
  {
    slug: 'tlc-108',
    name: 'TLC-108',
    category: 'Downlights',
    categorySlug: 'downlights',
    tagline: 'Premium Recessed Downlight',
    image: product3,
    wattage: '7W / 12W / 18W',
    cri: '95+',
    cct: '2700K / 3000K / 4000K',
    ip: 'IP44',
    lifespan: '50,000 hrs',
    description:
      'Architectural-grade recessed downlight with a precision reflector for targeted beam control. Perfect for accent lighting in hospitality, residential, and retail environments where quality of light matters.',
    features: ['Recessed installation', 'Adjustable beam angle', 'Dimmable (trailing edge)', 'Anti-glare reflector', 'IP44 splash-proof'],
  },
  {
    slug: 'tlc-111',
    name: 'TLC-111',
    category: 'Fixtures',
    categorySlug: 'fixtures',
    tagline: 'High-Bay Industrial Fixture',
    image: product4,
    wattage: '100W / 150W / 200W',
    cri: '80+',
    cct: '4000K / 5000K',
    ip: 'IP65',
    lifespan: '50,000 hrs',
    description:
      'Heavy-duty high-bay fixture engineered for warehouses, manufacturing facilities, and large open spaces. IP65 rated for demanding industrial environments with surge protection built-in.',
    features: ['IP65 weather rated', 'Wide 120° beam', 'Surge protection 4kV', 'Die-cast aluminium housing', 'Motion sensor optional'],
  },
  {
    slug: 'tlc-112',
    name: 'TLC-112',
    category: 'Strip LEDs',
    categorySlug: 'strip-leds',
    tagline: 'Flexible LED Strip Panel',
    image: product5,
    wattage: '14.4W/m',
    cri: '90+',
    cct: '2700K / 4000K / 6500K',
    ip: 'IP20 / IP65',
    lifespan: '50,000 hrs',
    description:
      'High-density SMD 2835 strip LED for architectural cove lighting, under-cabinet illumination, and decorative applications. Available in IP20 (indoor) and IP65 (outdoor/wet area) variants.',
    features: ['Cut every 50mm', 'Self-adhesive backing', 'Custom lengths available', 'CCT selectable', 'Low heat output'],
  },
  {
    slug: 'tlc-121',
    name: 'TLC-121',
    category: 'Panel Lights',
    categorySlug: 'panel-lights',
    tagline: 'Premium UGR<19 Office Panel',
    image: product7,
    wattage: '40W / 60W',
    cri: '95+',
    cct: '4000K',
    ip: 'IP40',
    lifespan: '50,000 hrs',
    description:
      'UGR<19 anti-glare panel engineered for open-plan offices and education facilities. Meets European EN 12464-1 workplace lighting standards with HF flicker-free operation.',
    features: ['UGR < 19 anti-glare', 'HF flicker-free 50kHz', 'DALI dimmable', 'Pendant or surface mount', 'EN 12464-1 compliant'],
  },
  {
    slug: 'tlc-129',
    name: 'TLC-129',
    category: 'Panel Lights',
    categorySlug: 'panel-lights',
    tagline: 'Backlit Premium Panel',
    image: product8,
    wattage: '36W / 48W',
    cri: '95+',
    cct: '3000K / 4000K',
    ip: 'IP40',
    lifespan: '50,000 hrs',
    description:
      'Backlit technology for superior luminous uniformity. The TLC-129 delivers premium performance for corporate, healthcare, and education environments where lighting quality directly impacts wellbeing.',
    features: ['Backlit diffuser panel', 'High uniformity >0.85', 'Slim 10mm bezel', 'Easy-access driver bay', 'Recessed or surface'],
  },
  {
    slug: 'tlc-151',
    name: 'TLC-151',
    category: 'Fixtures',
    categorySlug: 'fixtures',
    tagline: 'Tri-Proof Linear Fixture',
    image: product9,
    wattage: '18W / 36W / 58W',
    cri: '80+',
    cct: '4000K / 6500K',
    ip: 'IP65',
    lifespan: '50,000 hrs',
    description:
      'Tri-proof (dust, water, impact) linear fixture for parking structures, food processing, cold storage, and industrial applications. IK08 impact rated polycarbonate body for the harshest environments.',
    features: ['IP65 + IK08 rated', 'Polycarbonate body', 'Linkable end-to-end', 'Emergency option available', 'M8 suspension mount'],
  },
  {
    slug: 'pendant-230',
    name: 'Pendant 230',
    category: 'Pendant Lights',
    categorySlug: 'pendant-lights',
    tagline: 'Architectural Pendant Fixture',
    image: hangingLight,
    wattage: '30W / 45W',
    cri: '95+',
    cct: '2700K / 3000K',
    ip: 'IP20',
    lifespan: '50,000 hrs',
    description:
      'Designer pendant fixture blending warm illumination with architectural form. Ideal for hospitality, restaurant, and high-end residential spaces where aesthetics are as important as performance.',
    features: ['360° rotatable shade', 'Adjustable cable 0.5–3m', 'Warm dim 2700K option', 'Canopy ceiling plate included', 'Custom finish available'],
  },
  {
    slug: 'strip-led-pro',
    name: 'Strip LED Pro',
    category: 'Strip LEDs',
    categorySlug: 'strip-leds',
    tagline: 'Commercial Grade LED Strip',
    image: stripLed,
    wattage: '20W/m',
    cri: '95+',
    cct: '2700K / 4000K / 6500K',
    ip: 'IP20 / IP67',
    lifespan: '50,000 hrs',
    description:
      'Professional-grade high-density LED strip for commercial cove lighting, architectural highlighting, and display illumination. 120 LEDs/m for seamless, dot-free output at any viewing angle.',
    features: ['120 LEDs/metre density', 'High CRI 95+', 'IP67 waterproof variant', 'Aluminium channel compatible', 'PWM dimming 0–100%'],
  },
];

export const CATEGORIES = [
  {
    slug: 'panel-lights',
    label: 'Panel Lights',
    desc: 'Surface & recessed panels for offices and commercial spaces',
    cover: product1,
  },
  {
    slug: 'strip-leds',
    label: 'Strip LEDs',
    desc: 'Flexible strips for architectural and accent lighting',
    cover: stripLed,
  },
  {
    slug: 'downlights',
    label: 'Downlights',
    desc: 'Precision recessed fixtures for targeted beam control',
    cover: product3,
  },
  {
    slug: 'fixtures',
    label: 'Fixtures',
    desc: 'Industrial-grade high-bay and tri-proof fixtures',
    cover: product4,
  },
  {
    slug: 'pendant-lights',
    label: 'Pendant Lights',
    desc: 'Designer hanging fixtures for premium spaces',
    cover: hangingLight,
  },
];
