import { useState, useEffect } from 'react'
import { supabase } from '@/config/supabase'

export function useTestimonials({ featuredOnly = false } = {}) {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    let query = supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (featuredOnly) query = query.eq('is_featured', true)

    query.then(({ data, error: err }) => {
      if (cancelled) return
      if (err) setError(err.message)
      else setTestimonials(data || [])
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [featuredOnly])

  return { testimonials, loading, error }
}
