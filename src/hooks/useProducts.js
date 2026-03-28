import { useState, useEffect } from 'react'
import { supabase } from '@/config/supabase'

// ===========================================
// ICO — Producten Hook (CleanTech webshop)
// ===========================================

export function useProducts({ category = null, activeOnly = true } = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    let query = supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })

    if (activeOnly) query = query.eq('is_active', true)
    if (category) query = query.eq('category', category)

    query.then(({ data, error: err }) => {
      if (cancelled) return
      if (err) {
        setError(err.message)
      } else {
        setProducts(data || [])
      }
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [category, activeOnly])

  return { products, loading, error }
}

export function useProduct(slug) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false

    supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
      .then(({ data, error: err }) => {
        if (cancelled) return
        if (err) {
          setError(err.message)
        } else {
          setProduct(data)
        }
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [slug])

  return { product, loading, error }
}
