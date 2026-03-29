import { supabase } from '@/config/supabase'

const ALLOWED_UPDATE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_UPDATE_PHOTO_SIZE = 10 * 1024 * 1024 // 10 MB

/**
 * Haal geblokkeerde tijdslots op voor een specifieke datum.
 */
export async function getBlockedSlots(date) {
  const { data, error } = await supabase
    .from('availability')
    .select('time_slot')
    .eq('date', date)

  if (error) throw error
  return (data || []).map((row) => row.time_slot)
}

/**
 * Maak een nieuwe boeking aan via SECURITY DEFINER RPC (bypast RLS).
 * Voor garage-boekingen: drop_off_date/time ipv preferred_date/time_slot.
 */
export async function createBooking(bookingData) {
  const isGarage = bookingData.booking_type === 'garage'

  const { data, error } = await supabase.rpc('create_booking_public', {
    p_booking_type:         bookingData.booking_type        || 'mobiel',
    p_service_id:           bookingData.service_id          || '',
    p_customer_name:        bookingData.customer_name,
    p_customer_email:       bookingData.customer_email,
    p_customer_phone:       bookingData.customer_phone,
    p_customer_address:     bookingData.customer_address    || '',
    p_customer_city:        bookingData.customer_city       || '',
    p_customer_postal_code: bookingData.customer_postal_code || '',
    p_preferred_date:       bookingData.preferred_date,
    p_preferred_time_slot:  bookingData.preferred_time_slot,
    p_drop_off_date:        isGarage ? bookingData.preferred_date      : null,
    p_drop_off_time:        isGarage ? bookingData.preferred_time_slot : null,
    p_vehicle_type:         bookingData.vehicle_type        || '',
    p_vehicle_brand:        bookingData.vehicle_brand       || '',
    p_notes:                bookingData.notes               || '',
    p_total_price:          bookingData.total_price         || null,
  })

  if (error) throw error
  return data
}

/**
 * Haal een boeking op via tracking token (publieke trackingpagina).
 * Returnt alleen niet-gevoelige velden + booking_updates.
 */
export async function fetchBookingByToken(token) {
  const { data, error } = await supabase
    .rpc('get_booking_by_token', { p_token: token })

  if (error) throw error
  return data
}

/**
 * Haal alle updates op voor een boeking (admin).
 */
export async function fetchBookingUpdates(bookingId) {
  const { data, error } = await supabase
    .from('booking_updates')
    .select('*')
    .eq('booking_id', bookingId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}

/**
 * Voeg een voortgang-update toe aan een boeking (admin).
 */
export async function createBookingUpdate(bookingId, { message, photos = [], status_change = null }) {
  const { data, error } = await supabase
    .from('booking_updates')
    .insert({ booking_id: bookingId, message, photos, status_change })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Upload een voortgang-foto naar de 'booking-updates' bucket.
 */
export async function uploadBookingUpdatePhoto(file) {
  if (!ALLOWED_UPDATE_TYPES.includes(file.type)) {
    throw new Error('Alleen JPEG, PNG of WebP bestanden zijn toegestaan.')
  }
  if (file.size > MAX_UPDATE_PHOTO_SIZE) {
    throw new Error('Bestand mag maximaal 10 MB zijn.')
  }

  const ext = file.name.split('.').pop()
  const path = `updates/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from('booking-updates')
    .upload(path, file, { upsert: false })

  if (error) throw error

  const { data } = supabase.storage.from('booking-updates').getPublicUrl(path)
  return data.publicUrl
}

/**
 * Wijzig de status van een boeking (admin).
 */
export async function updateBookingStatus(bookingId, status) {
  const { error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', bookingId)

  if (error) throw error
}
