import { useState, useRef, useCallback } from 'react'

/**
 * useRateLimit — voorkomt spam op publieke formulieren.
 *
 * @param {number} cooldownMs - Cooldown in milliseconden (standaard 5000)
 * @param {number} maxAttempts - Max pogingen binnen window (standaard 5)
 * @param {number} windowMs - Tijdsvenster voor maxAttempts (standaard 60000)
 */
export function useRateLimit({ cooldownMs = 5000, maxAttempts = 5, windowMs = 60000 } = {}) {
  const [cooldown, setCooldown] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const attemptsRef = useRef([])
  const timerRef = useRef(null)

  const checkLimit = useCallback(() => {
    if (blocked) return false

    const now = Date.now()
    // Verwijder verlopen timestamps
    attemptsRef.current = attemptsRef.current.filter((t) => now - t < windowMs)

    if (attemptsRef.current.length >= maxAttempts) {
      setBlocked(true)
      // Automatisch deblokkeren na windowMs
      setTimeout(() => {
        setBlocked(false)
        attemptsRef.current = []
      }, windowMs)
      return false
    }

    if (cooldown) return false

    return true
  }, [blocked, cooldown, maxAttempts, windowMs])

  const recordAttempt = useCallback(() => {
    attemptsRef.current.push(Date.now())
    setCooldown(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setCooldown(false), cooldownMs)
  }, [cooldownMs])

  return { cooldown, blocked, checkLimit, recordAttempt }
}
