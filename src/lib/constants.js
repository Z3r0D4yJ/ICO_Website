// ===========================================
// ICO — Applicatie constanten
// ===========================================

// Tijdslots (2-uurs blokken)
export const TIME_SLOTS = [
  { value: '09:00-11:00', label: '09:00 – 11:00' },
  { value: '11:00-13:00', label: '11:00 – 13:00' },
  { value: '13:00-15:00', label: '13:00 – 15:00' },
  { value: '15:00-17:00', label: '15:00 – 17:00' },
]

// Voertuigtypes — ICO-specifieke categorieën (6 formaten)
export const VEHICLE_TYPES = [
  {
    value: 'standaard',
    label_nl: 'Standaard wagen',
    label_en: 'Standard car',
    examples_nl: 'bv. VW Golf, BMW 3, Audi A3',
    examples_en: 'e.g. VW Golf, BMW 3, Audi A3',
    icon: 'Car',
  },
  {
    value: 'groot',
    label_nl: 'Grote wagen',
    label_en: 'Large car',
    examples_nl: 'bv. BMW 5, Audi A6, Mercedes E',
    examples_en: 'e.g. BMW 5, Audi A6, Mercedes E',
    icon: 'Car',
  },
  {
    value: 'xl_suv',
    label_nl: 'XL / SUV',
    label_en: 'XL / SUV',
    examples_nl: 'bv. BMW X5, Audi Q7, Range Rover',
    examples_en: 'e.g. BMW X5, Audi Q7, Range Rover',
    icon: 'Car',
  },
  {
    value: 'bestelwagen_standaard',
    label_nl: 'Bestelwagen standaard',
    label_en: 'Standard van',
    examples_nl: 'bv. VW Caddy, Berlingo, Kangoo',
    examples_en: 'e.g. VW Caddy, Berlingo, Kangoo',
    icon: 'Truck',
  },
  {
    value: 'bestelwagen_groot',
    label_nl: 'Bestelwagen groot',
    label_en: 'Large van',
    examples_nl: 'bv. VW Transporter, Mercedes Vito',
    examples_en: 'e.g. VW Transporter, Mercedes Vito',
    icon: 'Truck',
  },
  {
    value: 'bestelwagen_xl',
    label_nl: 'Bestelwagen XL',
    label_en: 'XL van',
    examples_nl: 'bv. VW Crafter, Mercedes Sprinter',
    examples_en: 'e.g. VW Crafter, Mercedes Sprinter',
    icon: 'Truck',
  },
]

// Service categorieën
export const SERVICE_CATEGORIES = [
  { value: 'wash', label_nl: 'Wasbeurten', label_en: 'Wash Services' },
  { value: 'coating', label_nl: 'Coatings', label_en: 'Coatings' },
  { value: 'ppf', label_nl: 'Paint Protection Film', label_en: 'Paint Protection Film' },
  { value: 'extra', label_nl: "Extra's", label_en: "Add-ons" },
  { value: 'homecare', label_nl: 'Home Care', label_en: 'Home Care' },
]

// Boeking statussen
export const BOOKING_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const BOOKING_STATUS_LABELS = {
  pending: { nl: 'In afwachting', en: 'Pending' },
  confirmed: { nl: 'Bevestigd', en: 'Confirmed' },
  in_progress: { nl: 'Bezig', en: 'In Progress' },
  completed: { nl: 'Voltooid', en: 'Completed' },
  cancelled: { nl: 'Geannuleerd', en: 'Cancelled' },
}

export const BOOKING_STATUS_COLORS = {
  pending: 'warning',
  confirmed: 'info',
  in_progress: 'primary',
  completed: 'success',
  cancelled: 'error',
}

// Bestelling statussen
export const ORDER_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

// Product categorieën (CleanTech webshop)
export const PRODUCT_CATEGORIES = [
  { value: 'coating', label_nl: 'Coating', label_en: 'Coating' },
  { value: 'droogdoek', label_nl: 'Droogdoeken', label_en: 'Drying Towels' },
  { value: 'accessoire', label_nl: 'Accessoires', label_en: 'Accessories' },
  { value: 'reiniger', label_nl: 'Reinigers', label_en: 'Cleaners' },
]

// FAQ categorieën
export const FAQ_CATEGORIES = [
  { value: 'diensten', label_nl: 'Diensten', label_en: 'Services' },
  { value: 'boekingen', label_nl: 'Boekingen', label_en: 'Bookings' },
  { value: 'webshop', label_nl: 'Webshop', label_en: 'Webshop' },
  { value: 'algemeen', label_nl: 'Algemeen', label_en: 'General' },
]

// Welke diensten zijn inbegrepen bij een package (service slug → inbegrepen service slugs)
// bv. Full Package PPF bevat alle losse PPF opties
export const SERVICE_INCLUDED_EXTRAS = {
  'ppf-full-package': ['ppf-full-front', 'ppf-windshield', 'ppf-headlight', 'ppf-anti-fingerprint'],
  'ppf-full-front':   ['ppf-headlight'],
}

// Booking referentie formaat: ICO-YYYY-NNN
export const BOOKING_NUMBER_PREFIX = 'ICO'

// Minimale lead time voor boekingen (in uren)
export const MIN_BOOKING_LEAD_HOURS = 24

// WhatsApp nummer (Belgisch formaat: 32...)
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '32000000000'

// Site info
export const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'ICO - Intensive Cleaning Organization'
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://ico-detailing.be'

// Shipping kosten webshop (in EUR)
export const SHIPPING_COST = 4.95
export const FREE_SHIPPING_THRESHOLD = 50
