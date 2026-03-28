import { useEffect, useState } from 'react'
import { Clock, X } from '@/lib/icons'
import { TIME_SLOTS } from '@/lib/constants'
import { getBlockedSlots } from '@/api/bookings'
import { cn } from '@/lib/utils'
import Skeleton from '@/components/ui/Skeleton'

/**
 * TimeSlotPicker — toont 4 tijdslots, markeert bezette slots als disabled.
 *
 * @param {string} date - Geselecteerde datum (YYYY-MM-DD)
 * @param {string|null} selected - Geselecteerd tijdslot
 * @param {function} onSelect - Callback met geselecteerd tijdslot
 */
export default function TimeSlotPicker({ date, selected, onSelect }) {
  const [blockedSlots, setBlockedSlots] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!date) { setBlockedSlots([]); return }
    setLoading(true)
    getBlockedSlots(date)
      .then(setBlockedSlots)
      .catch(() => setBlockedSlots([]))
      .finally(() => setLoading(false))
  }, [date])

  if (!date) {
    return (
      <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-muted)' }}>
        Selecteer eerst een datum om tijdslots te zien.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {TIME_SLOTS.map((slot) => {
        const isBlocked = blockedSlots.includes(slot.value)
        const isSelected = selected === slot.value

        return (
          <button
            key={slot.value}
            onClick={() => !isBlocked && onSelect(slot.value)}
            disabled={isBlocked || loading}
            aria-pressed={isSelected}
            aria-label={`${slot.label}${isBlocked ? ' — bezet' : ''}`}
            className={cn(
              'w-full flex items-center justify-between px-4 py-3.5 rounded-xl',
              'transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
              !isBlocked && !loading ? 'cursor-pointer' : 'cursor-not-allowed',
              isSelected
                ? 'border-2'
                : 'border'
            )}
            style={
              loading
                ? { opacity: 0.5, backgroundColor: 'var(--color-surface-overlay)', borderColor: 'rgba(196,130,111,0.15)' }
                : isBlocked
                ? { backgroundColor: 'var(--color-surface-overlay)', borderColor: 'rgba(196,130,111,0.15)', opacity: 0.4 }
                : isSelected
                ? {
                    backgroundColor: 'rgba(196,130,111,0.12)',
                    borderColor: 'var(--color-primary)',
                    boxShadow: '0 0 0 1px var(--color-primary)',
                  }
                : {
                    backgroundColor: 'var(--color-surface-elevated)',
                    borderColor: 'rgba(196,130,111,0.15)',
                  }
            }
          >
            <div className="flex items-center gap-3">
              {loading ? (
                <Skeleton variant="circle" width="20px" height="20px" />
              ) : (
                <Clock
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: isSelected ? 'var(--color-primary)' : isBlocked ? 'var(--color-text-muted)' : 'var(--color-text-secondary)' }}
                  aria-hidden="true"
                />
              )}
              <span
                className="font-medium text-sm"
                style={{
                  color: isSelected
                    ? 'var(--color-primary)'
                    : isBlocked
                    ? 'var(--color-text-muted)'
                    : 'var(--color-text-primary)',
                }}
              >
                {slot.label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isBlocked ? (
                <span
                  className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--color-error)' }}
                >
                  <X className="w-3 h-3" aria-hidden="true" />
                  Bezet
                </span>
              ) : isSelected ? (
                <span
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
                >
                  Geselecteerd
                </span>
              ) : (
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: 'var(--color-success)' }}
                >
                  Vrij
                </span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
