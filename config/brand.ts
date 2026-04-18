/**
 * BRAND CONFIGURATION
 * ─────────────────────────────────────────────
 * This is the single source of truth for all
 * client-specific branding and configuration.
 *
 * To customize for a new client:
 * 1. Update all fields below
 * 2. Replace /public/logo.svg
 * 3. Adjust colors to match brand palette
 * 4. Update social links and contact info
 */

export const brandConfig = {
  // ── Identity ──────────────────────────────
  name: "Padel Pro Club",
  shortName: "PPC",
  tagline: "Tu cancha te espera",
  description:
    "El club de pádel más moderno de la ciudad. Reserva tu cancha, únete a torneos y vive la experiencia premium.",

  // ── Visual ────────────────────────────────
  logo: "/logo.svg",
  logoDark: "/logo-dark.svg",
  favicon: "/favicon.ico",
  ogImage: "/og-image.jpg",

  colors: {
    primary: "#0A0A0A",
    primaryForeground: "#FFFFFF",
    secondary: "#F5F5F5",
    secondaryForeground: "#0A0A0A",
    accent: "#22C55E",
    accentForeground: "#FFFFFF",
    muted: "#737373",
  },

  fonts: {
    display: "Syne",
    body: "DM Sans",
  },

  // ── Sport Type ────────────────────────────
  sport: {
    name: "Pádel",
    icon: "🎾",
    courtName: "cancha",
    courtNamePlural: "canchas",
  },

  // ── Contact ───────────────────────────────
  contact: {
    email: "contacto@padelproclub.com",
    phone: "+56 9 1234 5678",
    whatsapp: "+56912345678",
    whatsappMessage: "Hola! Me interesa reservar una cancha.",
  },

  // ── Location ──────────────────────────────
  location: {
    address: "Av. Deportiva 1234",
    commune: "Las Condes",
    city: "Santiago",
    region: "Región Metropolitana",
    country: "Chile",
    countryCode: "CL",
    coordinates: {
      lat: -33.4489,
      lng: -70.6693,
    },
    mapUrl: "https://maps.google.com/?q=-33.4489,-70.6693",
  },

  // ── Hours ─────────────────────────────────
  hours: {
    weekdays: "07:00 – 23:00",
    weekends: "08:00 – 22:00",
    holidays: "09:00 – 20:00",
  },

  // ── Social ────────────────────────────────
  social: {
    instagram: "https://instagram.com/padelproclub",
    facebook: "https://facebook.com/padelproclub",
    tiktok: "https://tiktok.com/@padelproclub",
    youtube: "",
    x: "",
  },

  // ── Booking ───────────────────────────────
  booking: {
    externalUrl: "https://reservas.padelproclub.com",
    provider: "Playtomic", // Playtomic | ClubSpot | Custom | Internal
    ctaText: "Reservar Cancha",
    ctaTextShort: "Reservar",
  },

  // ── Facilities ────────────────────────────
  facilities: {
    totalCourts: 8,
    indoorCourts: 4,
    outdoorCourts: 4,
    hasParking: true,
    hasShowers: true,
    hasCafe: true,
    hasProShop: true,
    hasLockers: true,
  },

  // ── Sections visibility ───────────────────
  sections: {
    hero: true,
    benefits: true,
    courts: true,
    community: true,
    classes: true,
    events: true,
    gallery: true,
    merch: true,
    testimonials: true,
    faq: true,
    ctaFinal: true,
  },

  // ── SEO ───────────────────────────────────
  seo: {
    titleTemplate: "%s | Padel Pro Club",
    defaultTitle: "Padel Pro Club — Tu cancha te espera",
    keywords: [
      "pádel",
      "club de pádel",
      "reservar cancha pádel",
      "clases pádel",
      "torneos pádel",
      "Las Condes",
      "Santiago",
    ],
  },

  // ── Legal ─────────────────────────────────
  legal: {
    companyName: "Padel Pro Club SpA",
    rut: "76.XXX.XXX-X",
    privacyEmail: "privacidad@padelproclub.com",
  },
} as const;

export type BrandConfig = typeof brandConfig;
