import { useState, useEffect, useCallback } from 'react'
import { fetchQuoteRequests, updateQuoteRequest } from '@/api/quotes'

export function useQuotes(statusFilter = null) {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchQuoteRequests({ status: statusFilter })
      setQuotes(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    load()
  }, [load])

  const updateStatus = useCallback(async (id, status, admin_notes) => {
    await updateQuoteRequest(id, { status, admin_notes })
    setQuotes((prev) =>
      prev.map((q) => q.id === id ? { ...q, status, admin_notes } : q)
    )
  }, [])

  return { quotes, loading, error, refresh: load, updateStatus }
}
