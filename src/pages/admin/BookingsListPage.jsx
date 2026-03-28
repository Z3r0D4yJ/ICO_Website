import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, ChevronDown } from '@/lib/icons'
import { supabase } from '@/config/supabase'
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from '@/lib/constants'
import { useUiStore } from '@/stores/uiStore'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Alle statussen' },
  { value: 'pending', label: 'In afwachting' },
  { value: 'confirmed', label: 'Bevestigd' },
  { value: 'in_progress', label: 'Bezig' },
  { value: 'completed', label: 'Voltooid' },
  { value: 'cancelled', label: 'Geannuleerd' },
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
    } catch {
      showError('Kon status niet wijzigen. Probeer opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <select
        value={current}
        onChange={handleChange}
        disabled={loading}
        className="appearance-none text-xs font-medium pl-2.5 pr-7 py-1.5 rounded-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] transition-opacity"
        style={{
          backgroundColor: 'var(--color-surface-overlay)',
          border: '1px solid rgba(196,130,111,0.2)',
          color: 'var(--color-text-primary)',
          opacity: loading ? 0.5 : 1,
        }}
        aria-label="Status wijzigen"
      >
        {STATUS_FILTER_OPTIONS.filter((o) => o.value).map((o) => (
          <option key={o.value} value={o.value} style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
        style={{ color: 'var(--color-text-muted)' }}
        aria-hidden="true"
      />
    </div>
  )
}

export default function BookingsListPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        let query = supabase
          .from('bookings')
          .select('id, booking_number, customer_name, customer_phone, preferred_date, preferred_time_slot, status, total_price, created_at')
          .order('preferred_date', { ascending: false })

        if (statusFilter) query = query.eq('status', statusFilter)
        if (dateFrom) query = query.gte('preferred_date', dateFrom)
        if (dateTo) query = query.lte('preferred_date', dateTo)

        const { data } = await query
        setBookings(data || [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [statusFilter, dateFrom, dateTo])

  const handleStatusChange = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    )
  }

  const filtered = bookings.filter((b) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      b.customer_name?.toLowerCase().includes(q) ||
      b.booking_number?.toLowerCase().includes(q) ||
      b.customer_phone?.includes(q)
    )
  })

  const inputStyle = {
    backgroundColor: 'var(--color-surface-overlay)',
    border: '1px solid rgba(196,130,111,0.2)',
    color: 'var(--color-text-primary)',
  }

  return (
    <div className="space-y-5 max-w-5xl">
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
        className="rounded-xl p-4 flex flex-wrap gap-3"
        style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
      >
        {/* Zoekbalk */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
          <input
            type="search"
            placeholder="Naam, boekingsnummer, telefoon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            style={inputStyle}
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-lg text-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            style={inputStyle}
          >
            {STATUS_FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
        </div>

        {/* Datum range */}
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          style={inputStyle}
          aria-label="Datum van"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          style={inputStyle}
          aria-label="Datum tot"
        />
      </div>

      {/* Tabel */}
      <div
        className="rounded-xl overflow-hidden overflow-x-auto"
        style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
      >
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="line" height="52px" className="rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Geen boekingen gevonden
            </p>
          </div>
        ) : (
          <table className="w-full" role="table">
            <thead className="hidden md:table-header-group">
              <tr
                className="text-xs font-semibold uppercase tracking-widest border-b"
                style={{ color: 'var(--color-text-muted)', borderColor: 'rgba(196,130,111,0.15)' }}
              >
                <th scope="col" className="text-left px-4 py-3 font-semibold">Klant</th>
                <th scope="col" className="text-left px-4 py-3 font-semibold">Datum</th>
                <th scope="col" className="text-left px-4 py-3 font-semibold">Tijdslot</th>
                <th scope="col" className="text-left px-4 py-3 font-semibold">Status</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Acties</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => {
                const date = booking.preferred_date
                  ? new Date(booking.preferred_date + 'T12:00:00').toLocaleDateString('nl-BE', {
                      weekday: 'short', day: 'numeric', month: 'short',
                    })
                  : '—'

                return (
                  <tr
                    key={booking.id}
                    className="border-b last:border-b-0 block md:table-row"
                    style={{ borderColor: 'rgba(196,130,111,0.15)' }}
                  >
                    <td className="block md:table-cell px-4 py-3.5">
                      <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                        {booking.customer_name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {booking.booking_number}
                      </p>
                    </td>
                    <td className="block md:table-cell px-4 py-1 md:py-3.5">
                      <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{date}</span>
                    </td>
                    <td className="block md:table-cell px-4 py-1 md:py-3.5">
                      <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{booking.preferred_time_slot}</span>
                    </td>
                    <td className="block md:table-cell px-4 py-1 md:py-3.5">
                      <StatusSelect
                        bookingId={booking.id}
                        current={booking.status}
                        onChange={handleStatusChange}
                      />
                    </td>
                    <td className="block md:table-cell px-4 py-1 md:py-3.5">
                      <Link
                        to={`/admin/boekingen/${booking.id}`}
                        className="flex items-center gap-1 text-xs font-medium transition-colors duration-150 hover:opacity-80 cursor-pointer"
                        style={{ color: 'var(--color-primary)' }}
                        aria-label={`Details van ${booking.customer_name}`}
                      >
                        Details
                        <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
