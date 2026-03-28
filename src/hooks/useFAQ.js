import { useState, useEffect } from 'react'
import { supabase } from '@/config/supabase'

// ===========================================
// ICO — FAQ Hook
// ===========================================

export function useFAQ(category = null) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    let query = supabase
      .from('faq_items')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    query.then(({ data, error: err }) => {
      if (cancelled) return
      if (err) {
        setError(err.message)
      } else {
        setItems(data || [])
      }
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [category])

  return { items, loading, error }
}
