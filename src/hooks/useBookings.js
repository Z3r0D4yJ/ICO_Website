import { useState, useEffect } from 'react'
import { supabase } from '@/config/supabase'

// ===========================================
// ICO — Boekingen Hook
// ===========================================

export function useBookings({ status = null, date = null } = {}) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    let query = supabase
      .from('bookings')
      .select(`*, services(title_nl, title_en, icon)`)
      .order('preferred_date', { ascending: true })

    if (status) query = query.eq('status', status)
    if (date) query = query.eq('preferred_date', date)

    query.then(({ data, error: err }) => {
      if (cancelled) return
      if (err) {
        setError(err.message)
      } else {
        setBookings(data || [])
      }
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [status, date])

  return { bookings, loading, error }
}

export function useBooking(id) {
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    supabase
      .from('bookings')
      .select(`*, services(*)`)
      .eq('id', id)
      .single()
      .then(({ data, error: err }) => {
        if (cancelled) return
        if (err) {
          setError(err.message)
        } else {
          setBooking(data)
        }
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [id])

  return { booking, loading, error }
}

// Haal beschikbare tijdslots op voor een specifieke datum
export function useAvailability(date) {
  const [blockedSlots, setBlockedSlots] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!date) {
      setBlockedSlots([])
      return
    }
    let cancelled = false

    setLoading(true)
    supabase
      .from('availability')
      .select('time_slot')
      .eq('date', date)
      .then(({ data, error: err }) => {
        if (cancelled) return
        if (!err) {
          setBlockedSlots((data || []).map((a) => a.time_slot))
        }
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [date])

  return { blockedSlots, loading }
}
