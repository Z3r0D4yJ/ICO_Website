import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, User, Mail, Phone, MapPin, Car,
  Calendar, Clock, FileText, ChevronDown, Trash2,
  Upload, X, Plus, MessageCircle, ExternalLink,
} from '@/lib/icons'
import { supabase } from '@/config/supabase'
import {
  BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS,
  GARAGE_BOOKING_STATUSES, MOBILE_BOOKING_STATUSES,
  SITE_URL,
} from '@/lib/constants'
import {
  fetchBookingUpdates, createBookingUpdate,
  uploadBookingUpdatePhoto, updateBookingStatus,
} from '@/api/bookings'
import { formatPrice, whatsappLink } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'
import { useUiStore } from '@/stores/uiStore'

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

function UpdateCard({ update }) {
  const BOOKING_STATUS_LABELS_LOCAL = BOOKING_STATUS_LABELS
  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: 'var(--color-surface-overlay)', border: '1px solid rgba(196,130,111,0.15)' }}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {new Date(update.created_at).toLocaleString('nl-BE', {
            day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
          })}
        </span>
        {update.status_change && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(196,130,111,0.1)', color: 'var(--color-primary)' }}
          >
            → {BOOKING_STATUS_LABELS_LOCAL[update.status_change]?.nl || update.status_change}
          </span>
        )}
      </div>
      {update.message && (
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-secondary)' }}>
          {update.message}
        </p>
      )}
      {update.photos?.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {update.photos.map((url, i) => (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer"
              className="block rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <img src={url} alt={`foto ${i + 1}`} className="w-full h-full object-cover hover:opacity-80 transition-opacity" loading="lazy" />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default function BookingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showSuccess, showError } = useUiStore()
  const fileInputRef = useRef(null)

  const [booking, setBooking]           = useState(null)
  const [service, setService]           = useState(null)
  const [updates, setUpdates]           = useState([])
  const [loading, setLoading]           = useState(true)
  const [statusLoading, setStatusLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  // Update form state
  const [updateMessage, setUpdateMessage]     = useState('')
  const [updatePhotos, setUpdatePhotos]       = useState([])   // { file, preview }[]
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [submittingUpdate, setSubmittingUpdate] = useState(false)
  const [copied, setCopied]                   = useState(false)

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
        const u = await fetchBookingUpdates(id)
        setUpdates(u)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value
    setStatusLoading(true)
    try {
      await updateBookingStatus(id, newStatus)
      setBooking((b) => ({ ...b, status: newStatus }))
      showSuccess('Status bijgewerkt.')
    } catch {
      showError('Status kon niet worden bijgewerkt.')
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

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files || [])
    const previews = files.map((f) => ({ file: f, preview: URL.createObjectURL(f) }))
    setUpdatePhotos((prev) => [...prev, ...previews])
    e.target.value = ''
  }

  const removePhoto = (idx) => {
    setUpdatePhotos((prev) => {
      URL.revokeObjectURL(prev[idx].preview)
      return prev.filter((_, i) => i !== idx)
    })
  }

  const handleSubmitUpdate = async () => {
    if (!updateMessage.trim() && updatePhotos.length === 0) return
    setSubmittingUpdate(true)
    try {
      setUploadingPhotos(true)
      const urls = await Promise.all(updatePhotos.map((p) => uploadBookingUpdatePhoto(p.file)))
      setUploadingPhotos(false)

      const update = await createBookingUpdate(id, {
        message: updateMessage.trim() || null,
        photos: urls,
        status_change: booking.status,
      })
      setUpdates((prev) => [...prev, update])
      setUpdateMessage('')
      setUpdatePhotos([])
      showSuccess('Update toegevoegd. Stuur nu de WhatsApp notificatie.')
    } catch (err) {
      showError(`Fout bij opslaan: ${err.message}`)
    } finally {
      setSubmittingUpdate(false)
      setUploadingPhotos(false)
    }
  }

  const handleCopyLink = () => {
    if (!booking?.tracking_token) return
    const url = `${SITE_URL}/mijn-boeking/${booking.tracking_token}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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

  const isGarage = booking.booking_type === 'garage'
  const statusVariant = BOOKING_STATUS_COLORS[booking.status] || 'neutral'
  const allStatuses = isGarage ? GARAGE_BOOKING_STATUSES : MOBILE_BOOKING_STATUSES

  const formattedDate = booking.preferred_date
    ? new Date(booking.preferred_date + 'T12:00:00').toLocaleDateString('nl-BE', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : '—'

  const trackingUrl = booking.tracking_token
    ? `${SITE_URL}/mijn-boeking/${booking.tracking_token}`
    : null

  const whatsappUpdateMsg = trackingUrl
    ? `Hallo ${booking.customer_name}, er is een update voor uw boeking ${booking.booking_number}. Volg de voortgang via: ${trackingUrl} — Team ICO`
    : `Hallo ${booking.customer_name}, uw boeking ${booking.booking_number} heeft een statusupdate: ${BOOKING_STATUS_LABELS[booking.status]?.nl}. Groeten, Team ICO`

  const whatsappConfirmMsg = `Hallo ${booking.customer_name}, uw boeking ${booking.booking_number} is bevestigd voor ${formattedDate} om ${booking.preferred_time_slot}. Groeten, Team ICO`

  return (
    <div className="max-w-2xl space-y-5">

      {/* Terug + header */}
      <div className="flex items-center gap-3">
        <Link to="/admin/boekingen" className="flex items-center gap-1.5 text-sm cursor-pointer transition-opacity hover:opacity-80" style={{ color: 'var(--color-text-muted)' }}>
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Boekingen
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--color-text-primary)', letterSpacing: '0.03em' }}>
              {booking.booking_number}
            </h1>
            {isGarage && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(196,130,111,0.12)', color: 'var(--color-primary)', border: '1px solid rgba(196,130,111,0.25)' }}>
                Garage
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Aangemaakt op {new Date(booking.created_at).toLocaleDateString('nl-BE')}
          </p>
        </div>
        <Badge variant={statusVariant}>
          {BOOKING_STATUS_LABELS[booking.status]?.nl || booking.status}
        </Badge>
      </div>

      {/* Status + WhatsApp knoppen */}
      <div className="rounded-xl p-4 flex flex-wrap items-center gap-3"
        style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}>
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Status:</p>
        <div className="relative">
          <select
            value={booking.status}
            onChange={handleStatusChange}
            disabled={statusLoading}
            className="appearance-none pl-3 pr-8 py-2 rounded-lg text-sm cursor-pointer focus:outline-none"
            style={{
              backgroundColor: 'var(--color-surface-overlay)',
              border: '1px solid rgba(196,130,111,0.2)',
              color: 'var(--color-text-primary)',
              opacity: statusLoading ? 0.5 : 1,
            }}
          >
            {allStatuses.map((s) => (
              <option key={s.value} value={s.value} style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
        </div>

        <Button
          as="a"
          href={whatsappLink(booking.customer_phone?.replace(/\s/g, ''), whatsappConfirmMsg)}
          target="_blank" rel="noopener noreferrer"
          variant="secondary" size="sm"
          leftIcon={<MessageCircle className="w-4 h-4" />}
        >
          Bevestiging
        </Button>

        {trackingUrl && (
          <Button
            as="a"
            href={whatsappLink(booking.customer_phone?.replace(/\s/g, ''), whatsappUpdateMsg)}
            target="_blank" rel="noopener noreferrer"
            variant="secondary" size="sm"
            leftIcon={<MessageCircle className="w-4 h-4" />}
          >
            Update sturen
          </Button>
        )}
      </div>

      {/* Tracking link */}
      {trackingUrl && (
        <div className="rounded-xl p-4 flex items-center gap-3 flex-wrap"
          style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}>
          <ExternalLink className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
          <p className="text-xs flex-1 truncate font-mono" style={{ color: 'var(--color-text-muted)' }}>
            {trackingUrl}
          </p>
          <Button variant="ghost" size="sm" onClick={handleCopyLink}>
            {copied ? 'Gekopieerd!' : 'Kopieer'}
          </Button>
          <Button
            as="a" href={trackingUrl} target="_blank" rel="noopener noreferrer"
            variant="ghost" size="sm"
          >
            Bekijken
          </Button>
        </div>
      )}

      {/* Dienst + prijs */}
      {service && (
        <div className="rounded-xl p-4 flex items-center justify-between gap-4"
          style={{ backgroundColor: 'rgba(196,130,111,0.07)', border: '1px solid rgba(196,130,111,0.2)' }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'var(--color-primary)' }}>Dienst</p>
            <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{service.title_nl}</p>
          </div>
          {(booking.total_price || service.price_from) && (
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-primary)' }}>
              {formatPrice(booking.total_price || service.price_from)}
            </p>
          )}
        </div>
      )}

      {/* Klantgegevens */}
      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>Contactgegevens</p>
        <DetailRow icon={User}   label="Naam"     value={booking.customer_name} />
        <DetailRow icon={Mail}   label="E-mail"   value={booking.customer_email} />
        <DetailRow icon={Phone}  label="Telefoon" value={booking.customer_phone} />
        {!isGarage && booking.customer_address && (
          <DetailRow icon={MapPin} label="Adres"
            value={`${booking.customer_address}, ${booking.customer_postal_code || ''} ${booking.customer_city || ''}`.trim()} />
        )}
      </div>

      {/* Planning + voertuig */}
      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>Planning & voertuig</p>
        <DetailRow icon={Calendar} label={isGarage ? 'Inbrengdatum' : 'Datum'} value={formattedDate} />
        <DetailRow icon={Clock}    label={isGarage ? 'Inbrengtijdslot' : 'Tijdslot'} value={booking.preferred_time_slot} />
        {booking.estimated_ready_date && (
          <DetailRow icon={Calendar} label="Geschatte klaardag"
            value={new Date(booking.estimated_ready_date + 'T12:00:00').toLocaleDateString('nl-BE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />
        )}
        <DetailRow icon={Car}      label="Voertuig" value={[booking.vehicle_type, booking.vehicle_brand].filter(Boolean).join(' — ')} />
        <DetailRow icon={FileText} label="Opmerkingen" value={booking.notes} />
      </div>

      {/* Voortgang updates (garage) */}
      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-muted)' }}>
          Voortgang updates {updates.length > 0 && `(${updates.length})`}
        </p>

        {/* Bestaande updates */}
        {updates.length > 0 && (
          <div className="flex flex-col gap-3 mb-5">
            {updates.map((u) => <UpdateCard key={u.id} update={u} />)}
          </div>
        )}

        {/* Nieuwe update toevoegen */}
        <div className="space-y-3">
          <textarea
            value={updateMessage}
            onChange={(e) => setUpdateMessage(e.target.value)}
            placeholder="Schrijf een bericht voor de klant (zichtbaar op de trackingpagina)..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl text-sm resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
            style={{
              backgroundColor: 'var(--color-surface-overlay)',
              border: '1px solid rgba(196,130,111,0.2)',
              color: 'var(--color-text-primary)',
            }}
          />

          {/* Foto's preview */}
          {updatePhotos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {updatePhotos.map((p, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={p.preview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer"
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                    aria-label="Verwijder foto"
                  >
                    <X className="w-3 h-3" style={{ color: '#fff' }} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handlePhotoSelect}
            />
            <Button
              variant="ghost" size="sm"
              onClick={() => fileInputRef.current?.click()}
              leftIcon={<Upload className="w-4 h-4" />}
            >
              Foto's toevoegen
            </Button>
            <Button
              variant="primary" size="sm"
              onClick={handleSubmitUpdate}
              loading={submittingUpdate}
              disabled={submittingUpdate || (!updateMessage.trim() && updatePhotos.length === 0)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              {uploadingPhotos ? "Foto's uploaden..." : 'Update plaatsen'}
            </Button>
          </div>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Na het plaatsen: stuur de klant een WhatsApp via de knop hierboven.
          </p>
        </div>
      </div>

      {/* Verwijderen */}
      <div className="flex justify-end pt-2">
        <Button variant="danger" size="sm" onClick={handleDelete} leftIcon={<Trash2 className="w-4 h-4" />}>
          {deleteConfirm ? 'Klik nogmaals om te bevestigen' : 'Boeking verwijderen'}
        </Button>
      </div>
    </div>
  )
}
