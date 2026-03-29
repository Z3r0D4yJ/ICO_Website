import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Trash2, Calendar, Clock, Phone, User } from '@/lib/icons'
import { supabase } from '@/config/supabase'
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from '@/lib/constants'
import { useUiStore } from '@/stores/uiStore'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Skeleton from '@/components/ui/Skeleton'

const STATUS_GROUPS = [
  { value: 'pending', label: 'In afwachting', color: 'warning' },
  { value: 'confirmed', label: 'Bevestigd', color: 'info' },
  { value: 'dropped_off', label: 'Ingebracht', color: 'info' },
  { value: 'in_progress', label: 'In behandeling', color: 'primary' },
  { value: 'curing', label: 'Aan het uitharden', color: 'primary' },
  { value: 'ready_for_pickup', label: 'Klaar voor afhaling', color: 'success' },
  { value: 'completed', label: 'Voltooid', color: 'success' },
  { value: 'picked_up', label: 'Afgehaald', color: 'neutral' },
  { value: 'cancelled', label: 'Geannuleerd', color: 'error' },
]

async function updateBookingStatus(id, status) {
  const { error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

function StatusSelect({ bookingId, current, onChange }) {
  const [loading, setLoading] = useState(false)
  const showSuccess = useUiStore((s) => s.showSuccess)
  const showError = useUiStore((s) => s.showError)

  const handleChange = async (e) => {
    const newStatus = e.target.value
    setLoading(true)
    try {
      await updateBookingStatus(bookingId, newStatus)
      onChange(bookingId, newStatus)
      showSuccess('Status gewijzigd')
    } catch (err) {
      console.error('Status update error:', err)
      showError('Kon status niet wijzigen. Probeer opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={loading}
      className="text-xs font-medium h-8 px-2.5 rounded-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40 transition-opacity"
      style={{
        backgroundColor: 'var(--color-surface-overlay)',
        border: '1px solid rgba(196,130,111,0.2)',
        color: 'var(--color-text-primary)',
        opacity: loading ? 0.5 : 1,
        colorScheme: 'dark',
      }}
      aria-label="Status wijzigen"
    >
      {STATUS_GROUPS.map((o) => (
        <option key={o.value} value={o.value} style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

export default function BookingsListPage() {
  const { showSuccess, showError } = useUiStore()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [deletingBooking, setDeletingBooking] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        let query = supabase
          .from('bookings')
          .select('id, booking_number, customer_name, customer_phone, customer_city, preferred_date, preferred_time_slot, status, total_price, vehicle_brand, vehicle_type, booking_type, created_at')
          .order('preferred_date', { ascending: false })

        if (dateFrom) query = query.gte('preferred_date', dateFrom)
        if (dateTo) query = query.lte('preferred_date', dateTo)

        const { data } = await query
        setBookings(data || [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [dateFrom, dateTo])

  const handleStatusChange = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    )
  }

  const handleDelete = async () => {
    if (!deletingBooking) return
    const { error } = await supabase.from('bookings').delete().eq('id', deletingBooking.id)
    if (error) {
      console.error('Delete booking error:', error)
      showError('Verwijderen mislukt.')
    } else {
      setBookings((prev) => prev.filter((b) => b.id !== deletingBooking.id))
      showSuccess('Boeking verwijderd.')
    }
    setDeletingBooking(null)
  }

  const filtered = bookings.filter((b) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      b.customer_name?.toLowerCase().includes(q) ||
      b.booking_number?.toLowerCase().includes(q) ||
      b.customer_phone?.includes(q) ||
      b.customer_city?.toLowerCase().includes(q)
    )
  })

  const inputStyle = {
    backgroundColor: 'var(--color-surface-overlay)',
    border: '1px solid rgba(196,130,111,0.2)',
    color: 'var(--color-text-primary)',
    colorScheme: 'dark',
  }

  // Groepeer per status die daadwerkelijk boekingen heeft
  const statusesWithBookings = STATUS_GROUPS.filter((sg) =>
    filtered.some((b) => b.status === sg.value)
  )

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('nl-BE', {
      weekday: 'short', day: 'numeric', month: 'short',
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.75rem',
            color: 'var(--color-text-primary)',
            letterSpacing: '0.03em',
          }}
        >
          BOEKINGEN
        </h1>
        <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {loading ? '...' : `${filtered.length} resultaten`}
        </span>
      </div>

      {/* Filters */}
      <div
        className="rounded-xl p-3 sm:p-4 space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-3"
        style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
          <input
            type="search"
            placeholder="Naam, boekingsnummer, telefoon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 h-10 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
            style={inputStyle}
          />
        </div>

        <div className="flex gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="flex-1 sm:flex-none px-3 h-10 rounded-lg text-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
            style={inputStyle}
            aria-label="Datum van"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="flex-1 sm:flex-none px-3 h-10 rounded-lg text-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
            style={inputStyle}
            aria-label="Datum tot"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rect" height="100px" className="rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-xl py-16 text-center"
          style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
        >
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Geen boekingen gevonden
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {statusesWithBookings.map((sg) => {
            const groupBookings = filtered.filter((b) => b.status === sg.value)
            return (
              <div key={sg.value}>
                {/* Status header */}
                <div className="flex items-center gap-3 mb-3">
                  <p
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {sg.label}
                    <span className="ml-2 font-normal normal-case tracking-normal" style={{ color: 'var(--color-text-muted)' }}>
                      ({groupBookings.length})
                    </span>
                  </p>
                </div>

                {/* 2-kolommen grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {groupBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-xl p-3 sm:p-4"
                      style={{
                        backgroundColor: 'var(--color-surface-elevated)',
                        border: `1px solid ${booking.status === 'cancelled' ? 'rgba(196,130,111,0.12)' : 'rgba(196,130,111,0.2)'}`,
                        opacity: booking.status === 'cancelled' ? 0.6 : 1,
                      }}
                    >
                      {/* Klantnaam + badge */}
                      <div className="flex items-center flex-wrap gap-2 mb-1.5">
                        <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                          {booking.customer_name}
                        </p>
                        <Badge variant={BOOKING_STATUS_COLORS[booking.status] || 'neutral'} size="sm">
                          {BOOKING_STATUS_LABELS[booking.status]?.nl || booking.status}
                        </Badge>
                        {booking.booking_type === 'garage' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: 'rgba(196,130,111,0.1)', color: 'var(--color-primary)' }}>
                            GARAGE
                          </span>
                        )}
                      </div>

                      <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
                        {booking.booking_number}
                      </p>

                      {/* Details */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 flex-shrink-0" aria-hidden="true" style={{ color: 'var(--color-text-muted)' }} />
                          {formatDate(booking.preferred_date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 flex-shrink-0" aria-hidden="true" style={{ color: 'var(--color-text-muted)' }} />
                          {booking.preferred_time_slot}
                        </span>
                        {booking.customer_phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 flex-shrink-0" aria-hidden="true" style={{ color: 'var(--color-text-muted)' }} />
                            {booking.customer_phone}
                          </span>
                        )}
                        {booking.customer_city && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 flex-shrink-0" aria-hidden="true" style={{ color: 'var(--color-text-muted)' }} />
                            {booking.customer_city}
                          </span>
                        )}
                      </div>

                      {(booking.vehicle_brand || booking.vehicle_type) && (
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          {[booking.vehicle_brand, booking.vehicle_type].filter(Boolean).join(' · ')}
                        </p>
                      )}

                      {/* Acties onderaan */}
                      <div
                        className="flex items-center justify-between gap-2 mt-3 pt-3"
                        style={{ borderTop: '1px solid rgba(196,130,111,0.12)' }}
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            to={`/admin/boekingen/${booking.id}`}
                            className="flex items-center gap-1 text-xs font-medium h-8 px-3 rounded-lg cursor-pointer transition-colors duration-150 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                            style={{
                              backgroundColor: 'rgba(196,130,111,0.08)',
                              border: '1px solid rgba(196,130,111,0.2)',
                              color: 'var(--color-primary)',
                            }}
                            aria-label={`Details van ${booking.customer_name}`}
                          >
                            Details
                            <ArrowRight className="w-3 h-3" aria-hidden="true" />
                          </Link>
                          <StatusSelect
                            bookingId={booking.id}
                            current={booking.status}
                            onChange={handleStatusChange}
                          />
                        </div>
                        <button
                          onClick={() => setDeletingBooking(booking)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40 flex-shrink-0"
                          style={{ border: '1px solid rgba(239,68,68,0.2)', color: 'var(--color-error)' }}
                          aria-label="Verwijderen"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Verwijder bevestiging */}
      <Modal
        isOpen={!!deletingBooking}
        onClose={() => setDeletingBooking(null)}
        title="Boeking verwijderen"
        size="sm"
      >
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          Ben je zeker dat je de boeking van <strong style={{ color: 'var(--color-text-primary)' }}>{deletingBooking?.customer_name}</strong> ({deletingBooking?.booking_number}) wil verwijderen? Dit kan niet ongedaan gemaakt worden.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeletingBooking(null)}>Annuleren</Button>
          <Button variant="danger" onClick={handleDelete} leftIcon={<Trash2 className="w-4 h-4" />}>Verwijderen</Button>
        </div>
      </Modal>
    </div>
  )
}
