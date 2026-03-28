import { supabase } from '@/config/supabase'
import { BOOKING_NUMBER_PREFIX } from '@/lib/constants'

/**
 * Genereer het volgende boekingsnummer voor dit jaar: ICO-YYYY-NNN
 */
async function getNextBookingNumber() {
  const year = new Date().getFullYear()
  const { count } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', `${year}-01-01`)
    .lte('created_at', `${year}-12-31`)

  const seq = (count || 0) + 1
  return `${BOOKING_NUMBER_PREFIX}-${year}-${String(seq).padStart(3, '0')}`
}

/**
 * Haal geblokkeerde tijdslots op voor een specifieke datum.
 * Returnt een array van tijdslot strings, bv. ['09:00-11:00', '13:00-15:00']
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
 * Maak een nieuwe boeking aan en blokkeer het tijdslot.
 * @param {object} bookingData - Alle velden van het boekingsformulier
 * @returns {object} De aangemaakte boeking
 */
export async function createBooking(bookingData) {
  const booking_number = await getNextBookingNumber()

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      booking_number,
      service_id: bookingData.service_id,
      customer_name: bookingData.customer_name,
      customer_email: bookingData.customer_email,
      customer_phone: bookingData.customer_phone,
      customer_address: bookingData.customer_address,
      customer_city: bookingData.customer_city,
      customer_postal_code: bookingData.customer_postal_code,
      preferred_date: bookingData.preferred_date,
      preferred_time_slot: bookingData.preferred_time_slot,
      vehicle_type: bookingData.vehicle_type,
      vehicle_brand: bookingData.vehicle_brand || null,
      notes: bookingData.notes || null,
      status: 'pending',
      total_price: bookingData.total_price || null,
    })
    .select()
    .single()

  if (error) throw error

  // Blokkeer het tijdslot in de availability tabel
  await supabase.from('availability').insert({
    date: bookingData.preferred_date,
    time_slot: bookingData.preferred_time_slot,
    booking_id: data.id,
  })

  return data
}
