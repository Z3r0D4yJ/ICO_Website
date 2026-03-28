import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, Clock, AlertCircle, Car, Calendar, Image, ArrowLeft } from '@/lib/icons'
import { fetchBookingByToken } from '@/api/bookings'
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS, GARAGE_BOOKING_STATUSES, MOBILE_BOOKING_STATUSES } from '@/lib/constants'
import Skeleton, { SkeletonText } from '@/components/ui/Skeleton'
import Badge from '@/components/ui/Badge'

// Volgorde van statussen voor de tijdlijn (geannuleerd apart)
const GARAGE_TIMELINE = ['pending', 'confirmed', 'dropped_off', 'in_progress', 'curing', 'ready_for_pickup', 'picked_up']
const MOBILE_TIMELINE = ['pending', 'confirmed', 'in_progress', 'completed']

function formatDate(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('nl-BE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatDateTime(dateStr, timeStr) {
  const date = formatDate(dateStr)
  if (!date) return null
  return timeStr ? `${date} — ${timeStr}` : date
}

function StatusDot({ done, active, cancelled }) {
  if (cancelled) return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.4)' }}>
      <AlertCircle className="w-4 h-4" style={{ color: 'var(--color-error)' }} />
    </div>
  )
  if (done) return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: 'rgba(34,197,94,0.15)', border: '2px solid var(--color-success)' }}>
      <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
    </div>
  )
  if (active) return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: 'rgba(196,130,111,0.15)', border: '2px solid var(--color-primary)' }}>
      <Clock className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
    </div>
  )
  return (
    <div className="w-8 h-8 rounded-full flex-shrink-0"
      style={{ border: '2px solid rgba(196,130,111,0.2)', backgroundColor: 'var(--color-surface-overlay)' }} />
  )
}

export default function BookingTrackingPage() {
  const { token } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await fetchBookingByToken(token)
        if (!cancelled) {
          if (data) setBooking(data)
          else setError(true)
        }
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [token])

  if (loading) return (
    <div className="section-padding" style={{ backgroundColor: 'var(--color-surface)', minHeight: '80vh' }}>
      <div className="container-ico max-w-2xl">
        <Skeleton variant="line" width="200px" height="24px" className="mb-6" />
        <Skeleton variant="rect" height="120px" className="rounded-xl mb-4" />
        <SkeletonText lines={5} />
      </div>
    </div>
  )

  if (error || !booking) return (
    <div className="section-padding" style={{ backgroundColor: 'var(--color-surface)', minHeight: '80vh' }}>
      <div className="container-ico max-w-2xl text-center py-20">
        <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-muted)', opacity: 0.4 }} />
        <p className="text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>Boeking niet gevonden</p>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
          Controleer of de link correct is of neem contact op via WhatsApp.
        </p>
        <Link to="/" className="text-sm" style={{ color: 'var(--color-primary)' }}>← Terug naar home</Link>
      </div>
    </div>
  )

  const isCancelled = booking.status === 'cancelled'
  const isGarage = booking.booking_type === 'garage'
  const timeline = isGarage ? GARAGE_TIMELINE : MOBILE_TIMELINE
  const statusList = isGarage ? GARAGE_BOOKING_STATUSES : MOBILE_BOOKING_STATUSES

  const currentIdx = isCancelled ? -1 : timeline.indexOf(booking.status)
  const statusVariant = BOOKING_STATUS_COLORS[booking.status] || 'neutral'
  const statusLabel = BOOKING_STATUS_LABELS[booking.status]?.nl || booking.status

  const dropOffDisplay = formatDateTime(booking.drop_off_date || booking.preferred_date, booking.drop_off_time || booking.preferred_time_slot)
  const readyDisplay = booking.estimated_ready_date ? formatDate(booking.estimated_ready_date) : null

  return (
    <div className="section-padding" style={{ backgroundColor: 'var(--color-surface)', minHeight: '80vh' }}>
      <div className="container-ico max-w-2xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-primary)' }}>
            Boeking opvolgen
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            color: 'var(--color-text-primary)',
            letterSpacing: '0.03em',
            lineHeight: 1.1,
          }}>
            {booking.booking_number}
          </h1>
        </div>

        {/* Status kaart */}
        <div
          className="rounded-xl p-5 mb-6"
          style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>
                {isGarage ? 'Garage behandeling' : 'Mobiele wasbeurt'}
              </p>
              <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {booking.service_title || '—'}
              </p>
              {(booking.vehicle_brand || booking.vehicle_type) && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Car className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {[booking.vehicle_brand, booking.vehicle_type].filter(Boolean).join(' — ')}
                  </span>
                </div>
              )}
            </div>
            <Badge variant={statusVariant}>{statusLabel}</Badge>
          </div>

          {/* Planning info */}
          <div className="flex flex-col gap-2 pt-4 border-t" style={{ borderColor: 'rgba(196,130,111,0.15)' }}>
            {dropOffDisplay && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {isGarage ? 'Ingebracht op: ' : 'Afspraak: '}
                  <strong style={{ color: 'var(--color-text-primary)' }}>{dropOffDisplay}</strong>
                </span>
              </div>
            )}
            {readyDisplay && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Geschatte klaardag: <strong style={{ color: 'var(--color-text-primary)' }}>{readyDisplay}</strong>
                </span>
              </div>
            )}
            {isGarage && booking.status === 'ready_for_pickup' && (
              <div
                className="mt-2 px-3 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: 'var(--color-success)', border: '1px solid rgba(34,197,94,0.25)' }}
              >
                Uw wagen is klaar voor afhaling in Hamme!
              </div>
            )}
          </div>
        </div>

        {/* Status tijdlijn */}
        <div
          className="rounded-xl p-5 mb-6"
          style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: 'var(--color-text-muted)' }}>
            Status tijdlijn
          </p>

          {isCancelled ? (
            <div className="flex items-center gap-3">
              <StatusDot cancelled />
              <span className="text-sm font-medium" style={{ color: 'var(--color-error)' }}>Boeking geannuleerd</span>
            </div>
          ) : (
            <ol className="flex flex-col gap-0">
              {timeline.map((statusValue, idx) => {
                const isDone   = idx < currentIdx
                const isActive = idx === currentIdx
                const isFuture = idx > currentIdx
                const label = BOOKING_STATUS_LABELS[statusValue]?.nl || statusValue
                const isLast = idx === timeline.length - 1

                return (
                  <li key={statusValue} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <StatusDot done={isDone} active={isActive} />
                      {!isLast && (
                        <div
                          className="w-0.5 flex-1 my-1"
                          style={{
                            minHeight: 20,
                            backgroundColor: isDone ? 'var(--color-success)' : 'rgba(196,130,111,0.15)',
                          }}
                        />
                      )}
                    </div>
                    <div className="pb-4">
                      <p
                        className="text-sm font-medium leading-8"
                        style={{
                          color: isActive
                            ? 'var(--color-text-primary)'
                            : isFuture
                            ? 'var(--color-text-muted)'
                            : 'var(--color-text-secondary)',
                          fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        {label}
                        {isActive && (
                          <span
                            className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: 'rgba(196,130,111,0.15)', color: 'var(--color-primary)' }}
                          >
                            Nu
                          </span>
                        )}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </div>

        {/* Voortgang updates */}
        {booking.updates?.length > 0 && (
          <div
            className="rounded-xl p-5 mb-6"
            style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: 'var(--color-text-muted)' }}>
              Voortgang updates
            </p>
            <div className="flex flex-col gap-5">
              {booking.updates.map((update) => (
                <div key={update.id} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {new Date(update.created_at).toLocaleString('nl-BE', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {update.status_change && (
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(196,130,111,0.1)', color: 'var(--color-primary)' }}
                      >
                        {BOOKING_STATUS_LABELS[update.status_change]?.nl || update.status_change}
                      </span>
                    )}
                  </div>
                  {update.message && (
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      {update.message}
                    </p>
                  )}
                  {update.photos?.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                      {update.photos.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                          <img
                            src={url}
                            alt={`Voortgang foto ${i + 1}`}
                            className="w-full h-full object-cover transition-opacity hover:opacity-80"
                            loading="lazy"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                  <div className="border-t mt-1" style={{ borderColor: 'rgba(196,130,111,0.1)' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-center mt-6" style={{ color: 'var(--color-text-muted)' }}>
          Vragen? Stuur ons een berichtje via{' '}
          <Link to="/contact" className="underline" style={{ color: 'var(--color-primary)' }}>
            WhatsApp of contactformulier
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
