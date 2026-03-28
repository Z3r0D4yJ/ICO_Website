import { useState, useEffect } from 'react'
import { supabase } from '@/config/supabase'

// ===========================================
// ICO — Diensten Hook
// ===========================================

export function useServices({ activeOnly = true } = {}) {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    let query = supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true })

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    query.then(({ data, error: err }) => {
      if (cancelled) return
      if (err) {
        setError(err.message)
      } else {
        setServices(data || [])
      }
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [activeOnly])

  return { services, loading, error }
}

export function useService(slug) {
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false

    supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
      .then(({ data, error: err }) => {
        if (cancelled) return
        if (err) {
          setError(err.message)
        } else {
          setService(data)
        }
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [slug])

  return { service, loading, error }
}
