import { useState } from 'react'
import {
  ClipboardText,
  Phone,
  Mail,
  Car,
  CheckCircle2,
  Clock,
  X,
  ArrowRight,
} from '@/lib/icons'
import { useQuotes } from '@/hooks/useQuotes'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'

const STATUS_TABS = [
  { key: null,         label: 'Alle' },
  { key: 'new',        label: 'Nieuw' },
  { key: 'contacted',  label: 'Gecontacteerd' },
  { key: 'quoted',     label: 'Offerte verstuurd' },
  { key: 'accepted',   label: 'Geaccepteerd' },
  { key: 'declined',   label: 'Afgewezen' },
]

const STATUS_OPTIONS = [
  { value: 'new',       label: 'Nieuw' },
  { value: 'contacted', label: 'Gecontacteerd' },
  { value: 'quoted',    label: 'Offerte verstuurd' },
  { value: 'accepted',  label: 'Geaccepteerd' },
  { value: 'declined',  label: 'Afgewezen' },
]

const STATUS_VARIANTS = {
  new:       'warning',
  contacted: 'primary',
  quoted:    'info',
  accepted:  'success',
  declined:  'neutral',
}

function QuoteCard({ quote, onOpen }) {
  const date = new Date(quote.created_at).toLocaleDateString('nl-BE', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <button
      onClick={() => onOpen(quote)}
      className="w-full text-left rounded-xl p-5 transition-all duration-150 cursor-pointer group"
      style={{
        backgroundColor: 'var(--color-surface-elevated)',
        border: '1px solid rgba(196,130,111,0.2)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.border = '1px solid rgba(196,130,111,0.45)' }}
      onMouseLeave={(e) => { e.currentTarget.style.border = '1px solid rgba(196,130,111,0.2)' }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          <p className="font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
            {quote.name}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            {date}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant={STATUS_VARIANTS[quote.status] || 'neutral'} size="sm">
            {STATUS_OPTIONS.find((s) => s.value === quote.status)?.label || quote.status}
          </Badge>
          <ArrowRight
            className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: 'var(--color-primary)' }}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {quote.email && (
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            <Mail className="w-3.5 h-3.5" aria-hidden="true" />
            {quote.email}
          </span>
        )}
        {quote.phone && (
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            <Phone className="w-3.5 h-3.5" aria-hidden="true" />
            {quote.phone}
          </span>
        )}
        {(quote.vehicle_brand || quote.vehicle_type) && (
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            <Car className="w-3.5 h-3.5" aria-hidden="true" />
            {[quote.vehicle_brand, quote.vehicle_type].filter(Boolean).join(' · ')}
          </span>
        )}
      </div>

      {quote.service_interest && (
        <p className="text-xs mt-2 font-medium" style={{ color: 'var(--color-primary)' }}>
          Dienst: {quote.service_interest}
        </p>
      )}

      {quote.message && (
        <p className="text-sm mt-2 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
          {quote.message}
        </p>
      )}
    </button>
  )
}

function QuoteDetailModal({ quote, onClose, onUpdate }) {
  const [status, setStatus] = useState(quote.status)
  const [notes, setNotes] = useState(quote.admin_notes || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const date = new Date(quote.created_at).toLocaleDateString('nl-BE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      await onUpdate(quote.id, status, notes)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = status !== quote.status || notes !== (quote.admin_notes || '')

  return (
    <Modal isOpen onClose={onClose} title="Offerte aanvraag" size="lg">
      <div className="space-y-5">
        {/* Klantgegevens */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{
            backgroundColor: 'rgba(196,130,111,0.05)',
            border: '1px solid rgba(196,130,111,0.15)',
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Klantgegevens
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Naam</p>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{quote.name}</p>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Datum aanvraag</p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{date}</p>
            </div>
            {quote.email && (
              <div>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>E-mail</p>
                <a
                  href={`mailto:${quote.email}`}
                  className="text-sm"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {quote.email}
                </a>
              </div>
            )}
            {quote.phone && (
              <div>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Telefoon</p>
                <a
                  href={`tel:${quote.phone}`}
                  className="text-sm"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {quote.phone}
                </a>
              </div>
            )}
            {quote.vehicle_brand && (
              <div>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Merk</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{quote.vehicle_brand}</p>
              </div>
            )}
            {quote.vehicle_type && (
              <div>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Type voertuig</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{quote.vehicle_type}</p>
              </div>
            )}
            {quote.service_interest && (
              <div className="sm:col-span-2">
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Gewenste dienst</p>
                <p className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>{quote.service_interest}</p>
              </div>
            )}
          </div>
        </div>

        {/* Bericht klant */}
        {quote.message && (
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Bericht klant
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {quote.message}
            </p>
          </div>
        )}

        {/* Status + notities */}
        <div className="space-y-3">
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Beheer
          </p>
          <div>
            <label
              htmlFor="quote-status"
              className="text-sm font-medium mb-1.5 block"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Status
            </label>
            <select
              id="quote-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-10 px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
              style={{
                backgroundColor: 'var(--color-surface-overlay)',
                border: '1px solid rgba(196,130,111,0.2)',
                color: 'var(--color-text-primary)',
                colorScheme: 'dark',
              }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <Textarea
            label="Admin notities"
            rows={3}
            placeholder="Interne notities, offertebedrag, afspraken..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <Modal.Footer>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Sluiten
        </Button>
        <Button
          variant="primary"
          size="sm"
          disabled={!hasChanges || saving}
          onClick={handleSave}
          leftIcon={saved ? <CheckCircle2 className="w-4 h-4" /> : saving ? <Clock className="w-4 h-4 animate-spin" /> : null}
        >
          {saved ? 'Opgeslagen!' : 'Opslaan'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default function QuotesPage() {
  const [activeStatus, setActiveStatus] = useState(null)
  const [selectedQuote, setSelectedQuote] = useState(null)
  const { quotes, loading, updateStatus } = useQuotes(activeStatus)

  const handleUpdate = async (id, status, notes) => {
    await updateStatus(id, status, notes)
    if (selectedQuote?.id === id) {
      setSelectedQuote((prev) => ({ ...prev, status, admin_notes: notes }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            color: 'var(--color-text-primary)',
            letterSpacing: '0.03em',
          }}
        >
          OFFERTES
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Vrijblijvende offerte-aanvragen van klanten
        </p>
      </div>

      {/* Status filter tabs */}
      <div
        className="flex gap-1 p-1 rounded-lg flex-wrap"
        style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.15)' }}
        role="tablist"
        aria-label="Filter op status"
      >
        {STATUS_TABS.map((tab) => {
          const isActive = activeStatus === tab.key
          return (
            <button
              key={String(tab.key)}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveStatus(tab.key)}
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
              style={
                isActive
                  ? { backgroundColor: 'rgba(196,130,111,0.15)', color: 'var(--color-primary)' }
                  : { color: 'var(--color-text-muted)' }
              }
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Lijst */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rect" height="140px" className="rounded-xl" />
          ))}
        </div>
      ) : quotes.length === 0 ? (
        <div
          className="flex flex-col items-center gap-3 py-16 rounded-xl"
          style={{
            backgroundColor: 'var(--color-surface-elevated)',
            border: '1px solid rgba(196,130,111,0.15)',
          }}
        >
          <ClipboardText
            className="w-10 h-10"
            style={{ color: 'var(--color-text-muted)' }}
            aria-hidden="true"
          />
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {activeStatus ? 'Geen offertes met deze status' : 'Nog geen offerte-aanvragen'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {quotes.map((quote) => (
            <QuoteCard key={quote.id} quote={quote} onOpen={setSelectedQuote} />
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selectedQuote && (
        <QuoteDetailModal
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  )
}
