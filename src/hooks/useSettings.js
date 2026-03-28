import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/config/supabase'

// ===========================================
// ICO — Website Instellingen Hook
// ===========================================

export function useSettings(keys = null) {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Stabiele referentie voor keys array
  const stableKeys = useMemo(() => keys, [JSON.stringify(keys)]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let cancelled = false

    let query = supabase.from('site_settings').select('key, value')

    if (stableKeys && stableKeys.length > 0) {
      query = query.in('key', stableKeys)
    }

    query.then(({ data, error: err }) => {
      if (cancelled) return
      if (err) {
        setError(err.message)
      } else {
        const settingsMap = (data || []).reduce((acc, { key, value }) => {
          acc[key] = value
          return acc
        }, {})
        setSettings(settingsMap)
      }
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [stableKeys])

  return { settings, loading, error }
}
