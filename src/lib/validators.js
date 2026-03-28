import { z } from 'zod'

// ===========================================
// ICO — Zod Validatieschema's
// ===========================================

// Belgisch telefoonnummer validatie
const belgianPhone = z
  .string()
  .min(9, 'Telefoonnummer te kort')
  .regex(
    /^(\+32|0032|0)[1-9][0-9]{7,8}$/,
    'Ongeldig Belgisch telefoonnummer (bv. 0495 123 456)'
  )

// Belgische postcode validatie
const belgianPostalCode = z
  .string()
  .regex(/^\d{4}$/, 'Postcode moet 4 cijfers zijn')

// --- Boeking formulier ---
export const bookingSchema = z.object({
  service_id: z.string().uuid('Selecteer een dienst'),
  customer_name: z.string().min(2, 'Naam moet minstens 2 tekens zijn').max(100),
  customer_email: z.string().email('Ongeldig e-mailadres'),
  customer_phone: belgianPhone,
  customer_address: z.string().min(5, 'Vul uw straat en huisnummer in').max(200),
  customer_city: z.string().min(2, 'Vul uw gemeente in').max(100),
  customer_postal_code: belgianPostalCode,
  preferred_date: z.string().min(1, 'Selecteer een datum'),
  preferred_time_slot: z.string().min(1, 'Selecteer een tijdslot'),
  vehicle_type: z.string().min(1, 'Selecteer uw voertuigtype'),
  vehicle_brand: z.string().max(50).optional(),
  notes: z.string().max(500, 'Maximum 500 tekens').optional(),
})

// --- Contactformulier ---
export const contactSchema = z.object({
  name: z.string().min(2, 'Naam moet minstens 2 tekens zijn').max(100),
  email: z.string().email('Ongeldig e-mailadres'),
  phone: belgianPhone.optional().or(z.literal('')),
  subject: z.string().min(3, 'Onderwerp moet minstens 3 tekens zijn').max(100),
  message: z.string().min(10, 'Bericht moet minstens 10 tekens zijn').max(2000),
})

// --- Checkout formulier (webshop) ---
export const checkoutSchema = z.object({
  customer_name: z.string().min(2, 'Naam moet minstens 2 tekens zijn').max(100),
  customer_email: z.string().email('Ongeldig e-mailadres'),
  customer_phone: belgianPhone.optional().or(z.literal('')),
  shipping_address: z.string().min(5, 'Vul uw straat en huisnummer in').max(200),
  shipping_city: z.string().min(2, 'Vul uw gemeente in').max(100),
  shipping_postal_code: belgianPostalCode,
  shipping_country: z.string().default('BE'),
})

// --- Admin: dienst formulier ---
export const serviceSchema = z.object({
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug mag enkel kleine letters, cijfers en koppeltekens bevatten'),
  title_nl: z.string().min(2, 'Vul een Nederlandse titel in').max(200),
  title_en: z.string().max(200).optional(),
  description_nl: z.string().min(10, 'Vul een beschrijving in').max(5000),
  description_en: z.string().max(5000).optional(),
  short_description_nl: z.string().max(300).optional(),
  short_description_en: z.string().max(300).optional(),
  price_from: z.number().min(0).optional().nullable(),
  price_to: z.number().min(0).optional().nullable(),
  price_note_nl: z.string().max(200).optional(),
  price_note_en: z.string().max(200).optional(),
  duration_minutes: z.number().int().min(0).optional().nullable(),
  icon: z.string().max(50).optional(),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
})

// --- Admin: product formulier ---
export const productSchema = z.object({
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug mag enkel kleine letters, cijfers en koppeltekens bevatten'),
  name: z.string().min(2, 'Vul een productnaam in').max(200),
  description_nl: z.string().max(5000).optional(),
  description_en: z.string().max(5000).optional(),
  price: z.number().min(0, 'Prijs moet 0 of hoger zijn'),
  compare_at_price: z.number().min(0).optional().nullable(),
  category: z.string().optional(),
  stock_quantity: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
})

// --- Offerte aanvraag ---
export const quoteRequestSchema = z.object({
  name: z.string().min(2, 'Naam moet minstens 2 tekens zijn').max(100),
  email: z.string().email('Ongeldig e-mailadres'),
  phone: belgianPhone.optional().or(z.literal('')),
  service_interest: z.string().max(200).optional(),
  vehicle_type: z.string().max(50).optional(),
  vehicle_brand: z.string().max(100).optional(),
  message: z.string().max(2000, 'Maximum 2000 tekens').optional(),
})

// --- Admin: login formulier ---
export const loginSchema = z.object({
  email: z.string().email('Ongeldig e-mailadres'),
  password: z.string().min(6, 'Wachtwoord moet minstens 6 tekens zijn'),
})
