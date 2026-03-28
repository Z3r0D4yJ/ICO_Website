import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, User, Mail, Phone, MapPin, Car,
  Calendar, Clock, FileText, ChevronDown, Trash2,
} from '@/lib/icons'
import { supabase } from '@/config/supabase'
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from '@/lib/constants'
import { formatPrice, whatsappLink } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'
import { useUiStore } from '@/stores/uiStore'

const ALL_STATUSES = [
  { value: 'pending', label: 'In afwachting' },
  { value: 'confirmed', label: 'Bevestigd' },
  { value: 'in_progress', label: 'Bezig' },
  { value: 'completed', label: 'Voltooid' },
  { value: 'cancelled', label: 'Geannuleerd' },
]

function DetailRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-b-0" style={{ borderColor: 'rgba(196,130,111,0.15)' }}>
      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
      <div>
        <p className="text-xs mb-0.5" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{value}</p>
      </div>
    </div>
  )
}

export default function BookingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showSuccess, showError } = useUiStore()

  const [booking, setBooking] = useState(null)
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statusLoading, setStatusLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('bookings')
        .select('*, services(title_nl, price_from)')
        .eq('id', id)
        .single()

      if (data) {
        setBooking(data)
        setService(data.services)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value
    setStatusLoading(true)
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      showError('Status kon niet worden bijgewerkt.')
    } else {
      setBooking((b) => ({ ...b, status: newStatus }))
      showSuccess('Status bijgewerkt.')
    }
    setStatusLoading(false)
  }

  const handleDelete = async () => {
    if (!deleteConfirm) { setDeleteConfirm(true); return }
    const { error } = await supabase.from('bookings').delete().eq('id', id)
    if (error) {
      showError('Verwijderen mislukt.')
    } else {
      showSuccess('Boeking verwijderd.')
      navigate('/admin/boekingen')
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton variant="line" width="120px" height="20px" />
        <Skeleton variant="rect" height="300px" className="rounded-xl" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="text-center py-20">
        <p style={{ color: 'var(--color-text-muted)' }}>Boeking niet gevonden.</p>
        <Link to="/admin/boekingen" className="text-sm mt-4 inline-block" style={{ color: 'var(--color-primary)' }}>
          Terug naar boekingen
        </Link>
      </div>
    )
  }

  const statusVariant = BOOKING_STATUS_COLORS[booking.status] || 'neutral'
  const formattedDate = booking.preferred_date
    ? new Date(booking.preferred_date + 'T12:00:00').toLocaleDateString('nl-BE', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : '—'

  const whatsappMsg = `Hallo ${booking.customer_name}, uw boeking ${booking.booking_number} is bevestigd voor ${formattedDate} om ${booking.preferred_time_slot}. Groeten, Team ICO`

  return (
    <div className="max-w-2xl space-y-5">

      {/* Terug + header */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/boekingen"
          className="flex items-center gap-1.5 text-sm cursor-pointer transition-opacity hover:opacity-80"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Boekingen
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              color: 'var(--color-text-primary)',
              letterSpacing: '0.03em',
            }}
          >
            {booking.booking_number}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            Aangemaakt op {new Date(booking.created_at).toLocaleDateString('nl-BE')}
          </p>
        </div>
        <Badge variant={statusVariant}>
          {BOOKING_STATUS_LABELS[booking.status]?.nl || booking.status}
        </Badge>
      </div>

      {/* Status bijwerken */}
      <div
        className="rounded-xl p-4 flex items-center gap-4 flex-wrap"
        style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
      >
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
          Status wijzigen:
        </p>
        <div className="relative">
          <select
            value={booking.status}
            onChange={handleStatusChange}
            disabled={statusLoading}
            className="appearance-none pl-3 pr-8 py-2 rounded-lg text-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            style={{
              backgroundColor: 'var(--color-surface-overlay)',
              border: '1px solid rgba(196,130,111,0.2)',
              color: 'var(--color-text-primary)',
              opacity: statusLoading ? 0.5 : 1,
            }}
          >
            {ALL_STATUSES.map((s) => (
              <option key={s.value} value={s.value} style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
        </div>

        {/* WhatsApp bevestiging knop */}
        <Button
          as="a"
          href={whatsappLink(booking.customer_phone?.replace(/\s/g, ''), whatsappMsg)}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
          size="sm"
        >
          WhatsApp klant
        </Button>
      </div>

      {/* Dienst + prijs */}
      {service && (
        <div
          className="rounded-xl p-4 flex items-center justify-between gap-4"
          style={{
            backgroundColor: 'rgba(196,130,111,0.07)',
            border: '1px solid rgba(196,130,111,0.2)',
          }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'var(--color-primary)' }}>
              Dienst
            </p>
            <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
              {service.title_nl}
            </p>
          </div>
          {(booking.total_price || service.price_from) && (
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                color: 'var(--color-primary)',
              }}
            >
              {formatPrice(booking.total_price || service.price_from)}
            </p>
          )}
        </div>
      )}

      {/* Klantgegevens */}
      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>
          Contactgegevens
        </p>
        <DetailRow icon={User} label="Naam" value={booking.customer_name} />
        <DetailRow icon={Mail} label="E-mail" value={booking.customer_email} />
        <DetailRow icon={Phone} label="Telefoon" value={booking.customer_phone} />
        <DetailRow
          icon={MapPin}
          label="Adres"
          value={`${booking.customer_address}, ${booking.customer_postal_code} ${booking.customer_city}`}
        />
      </div>

      {/* Planning + voertuig */}
      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>
          Planning & voertuig
        </p>
        <DetailRow icon={Calendar} label="Datum" value={formattedDate} />
        <DetailRow icon={Clock} label="Tijdslot" value={booking.preferred_time_slot} />
        <DetailRow
          icon={Car}
          label="Voertuig"
          value={[booking.vehicle_type, booking.vehicle_brand].filter(Boolean).join(' — ')}
        />
        <DetailRow icon={FileText} label="Opmerkingen" value={booking.notes} />
      </div>

      {/* Verwijderen */}
      <div className="flex justify-end pt-2">
        <Button
          variant="danger"
          size="sm"
          onClick={handleDelete}
          leftIcon={<Trash2 className="w-4 h-4" />}
        >
          {deleteConfirm ? 'Klik nogmaals om te bevestigen' : 'Boeking verwijderen'}
        </Button>
      </div>
    </div>
  )
}
