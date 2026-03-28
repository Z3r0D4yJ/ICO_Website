import { useState } from 'react'
import { ChevronLeft, ChevronRight } from '@/lib/icons'
import { cn } from '@/lib/utils'

const DAYS_NL = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']
const MONTHS_NL = [
  'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
  'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December',
]

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  // 0=ma, 6=zo (Europees formaat)
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

/**
 * BookingCalendar — custom kalender voor boekingen.
 *
 * @param {string|null} selected - Geselecteerde datum (YYYY-MM-DD)
 * @param {function} onSelect - Callback met geselecteerde datum (YYYY-MM-DD)
 * @param {number} minDaysAhead - Minimum dagen in de toekomst (default 1)
 * @param {number} maxDaysAhead - Maximum dagen in de toekomst (default 60)
 */
export default function BookingCalendar({
  selected,
  onSelect,
  minDaysAhead = 1,
  maxDaysAhead = 60,
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const minDate = new Date(today)
  minDate.setDate(today.getDate() + minDaysAhead)

  const maxDate = new Date(today)
  maxDate.setDate(today.getDate() + maxDaysAhead)

  const [viewYear, setViewYear] = useState(minDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(minDate.getMonth())

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)

  const canGoPrev = () => {
    const prev = new Date(viewYear, viewMonth - 1, 1)
    return prev >= new Date(minDate.getFullYear(), minDate.getMonth(), 1)
  }

  const canGoNext = () => {
    const next = new Date(viewYear, viewMonth + 1, 1)
    return next <= new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)
  }

  const prevMonth = () => {
    if (!canGoPrev()) return
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (!canGoNext()) return
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const isDisabled = (day) => {
    const d = new Date(viewYear, viewMonth, day)
    d.setHours(0, 0, 0, 0)
    // Weekendag (zondag = 0)
    const dayOfWeek = d.getDay()
    if (dayOfWeek === 0) return true
    return d < minDate || d > maxDate
  }

  const isSelected = (day) => {
    if (!selected) return false
    const d = new Date(viewYear, viewMonth, day)
    const sel = new Date(selected)
    return d.toDateString() === sel.toDateString()
  }

  const isToday = (day) => {
    const d = new Date(viewYear, viewMonth, day)
    return d.toDateString() === today.toDateString()
  }

  const handleSelect = (day) => {
    if (isDisabled(day)) return
    const d = new Date(viewYear, viewMonth, day)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    onSelect(`${yyyy}-${mm}-${dd}`)
  }

  // Bouw grid: lege cellen voor eerste dag + daadwerkelijke dagen
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div
      className="rounded-xl p-4 select-none"
      style={{
        backgroundColor: 'var(--color-surface-elevated)',
        border: '1px solid rgba(196,130,111,0.2)',
      }}
    >
      {/* Header: maand + navigatie */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev()}
          aria-label="Vorige maand"
          className={cn(
            'p-1.5 rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40',
            canGoPrev()
              ? 'cursor-pointer hover:bg-[var(--color-surface-overlay)]'
              : 'opacity-30 cursor-not-allowed'
          )}
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>

        <h3
          className="text-sm font-semibold"
          style={{ color: 'var(--color-text-primary)' }}
          aria-live="polite"
        >
          {MONTHS_NL[viewMonth]} {viewYear}
        </h3>

        <button
          onClick={nextMonth}
          disabled={!canGoNext()}
          aria-label="Volgende maand"
          className={cn(
            'p-1.5 rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40',
            canGoNext()
              ? 'cursor-pointer hover:bg-[var(--color-surface-overlay)]'
              : 'opacity-30 cursor-not-allowed'
          )}
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Dag-labels */}
      <div className="grid grid-cols-7 mb-1" role="row">
        {DAYS_NL.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold py-1"
            style={{ color: 'var(--color-text-muted)' }}
            role="columnheader"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Dag-cellen */}
      <div className="grid grid-cols-7 gap-0.5" role="grid" aria-label={`${MONTHS_NL[viewMonth]} ${viewYear}`}>
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} role="gridcell" aria-hidden="true" />

          const disabled = isDisabled(day)
          const sel = isSelected(day)
          const tod = isToday(day)

          return (
            <button
              key={day}
              role="gridcell"
              aria-selected={sel}
              aria-disabled={disabled}
              aria-label={`${day} ${MONTHS_NL[viewMonth]} ${viewYear}${disabled ? ' (niet beschikbaar)' : ''}`}
              onClick={() => handleSelect(day)}
              disabled={disabled}
              className={cn(
                'w-full aspect-square rounded-lg text-sm font-medium',
                'transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40',
                disabled
                  ? 'opacity-25 cursor-not-allowed'
                  : sel
                  ? 'cursor-pointer'
                  : 'cursor-pointer hover:bg-[var(--color-surface-overlay)]'
              )}
              style={
                sel
                  ? {
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-text-inverse)',
                      fontWeight: 700,
                    }
                  : tod
                  ? {
                      color: 'var(--color-primary)',
                      border: '1px solid var(--color-primary)',
                    }
                  : {
                      color: disabled
                        ? 'var(--color-text-muted)'
                        : 'var(--color-text-primary)',
                    }
              }
            >
              {day}
            </button>
          )
        })}
      </div>

      {/* Legende */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t" style={{ borderColor: 'rgba(196,130,111,0.15)' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'var(--color-primary)' }} aria-hidden="true" />
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Geselecteerd</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm border" style={{ borderColor: 'var(--color-primary)' }} aria-hidden="true" />
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Vandaag</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm opacity-25" style={{ backgroundColor: 'var(--color-text-muted)' }} aria-hidden="true" />
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Niet beschikbaar</span>
        </div>
      </div>
    </div>
  )
}
