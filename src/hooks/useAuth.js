import { useState, useEffect } from 'react'
import { supabase } from '@/config/supabase'

// ===========================================
// ICO — Auth Hook
// Beheert de Supabase auth sessie voor admin
// ===========================================

// Vaste admin e-mailadressen — alleen deze accounts hebben admin toegang
const ADMIN_EMAILS = [
  import.meta.env.VITE_ADMIN_EMAIL_1,
  import.meta.env.VITE_ADMIN_EMAIL_2,
].filter(Boolean)

function isAdminUser(user) {
  if (!user) return false
  // Check via vaste admin e-mailadressen
  if (ADMIN_EMAILS.length > 0) {
    return ADMIN_EMAILS.includes(user.email)
  }
  // Fallback: check user metadata role (stel in via Supabase dashboard)
  return user.app_metadata?.role === 'admin' || user.user_metadata?.role === 'admin'
}

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Haal huidige sessie op
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })

    // Luister naar auth state veranderingen
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error && data?.user && !isAdminUser(data.user)) {
      await supabase.auth.signOut()
      return { data: null, error: { message: 'Geen admin toegang voor dit account.' } }
    }
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: isAdminUser(user),
    signIn,
    signOut,
  }
}
