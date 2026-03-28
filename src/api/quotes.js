import { supabase } from '@/config/supabase'
import { quoteRequestSchema } from '@/lib/validators'

export async function createQuoteRequest(data) {
  // Valideer input voordat het naar de database gaat
  const validated = quoteRequestSchema.parse(data)
  const { data: result, error } = await supabase
    .from('quote_requests')
    .insert([validated])
    .select()
    .single()
  if (error) throw error
  return result
}

export async function fetchQuoteRequests({ status = null } = {}) {
  let query = supabase
    .from('quote_requests')
    .select('*')
    .order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function updateQuoteRequest(id, updates) {
  const { error } = await supabase
    .from('quote_requests')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function countNewQuotes() {
  const { count, error } = await supabase
    .from('quote_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')
  if (error) throw error
  return count || 0
}
