import { useState, useEffect, useRef } from 'react'
import { Pencil, Check, X, GripVertical } from '@/lib/icons'
import { supabase } from '@/config/supabase'
import { formatPrice } from '@/lib/utils'
import { DynamicIcon } from '@/lib/icons'
import { useUiStore } from '@/stores/uiStore'
import Button from '@/components/ui/Button'
import Input, { Textarea } from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Skeleton from '@/components/ui/Skeleton'

function ServiceForm({ service, onSave, onCancel }) {
  const [form, setForm] = useState({
    title_nl: service.title_nl || '',
    title_en: service.title_en || '',
    description_nl: service.description_nl || '',
    description_en: service.description_en || '',
    short_description_nl: service.short_description_nl || '',
    price_from: service.price_from ?? '',
    price_to: service.price_to ?? '',
    price_note_nl: service.price_note_nl || '',
    duration_minutes: service.duration_minutes ?? '',
    icon: service.icon || 'Sparkles',
    is_active: service.is_active ?? true,
  })
  const [saving, setSaving] = useState(false)

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [field]: val }))
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      ...form,
      price_from: form.price_from !== '' ? parseFloat(form.price_from) : null,
      price_to: form.price_to !== '' ? parseFloat(form.price_to) : null,
      duration_minutes: form.duration_minutes !== '' ? parseInt(form.duration_minutes) : null,
      updated_at: new Date().toISOString(),
    }
    const { error } = await supabase.from('services').update(payload).eq('id', service.id)
    setSaving(false)
    if (!error) onSave({ ...service, ...payload })
  }

  const inputStyle = {
    backgroundColor: 'var(--color-surface-overlay)',
    border: '1px solid rgba(196,130,111,0.2)',
    color: 'var(--color-text-primary)',
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Naam (NL) *" value={form.title_nl} onChange={set('title_nl')} />
        <Input label="Naam (EN)" value={form.title_en} onChange={set('title_en')} />
      </div>

      <Textarea label="Beschrijving (NL) *" rows={4} value={form.description_nl} onChange={set('description_nl')} />
      <Textarea label="Beschrijving (EN)" rows={3} value={form.description_en} onChange={set('description_en')} />
      <Input label="Korte beschrijving (NL)" value={form.short_description_nl} onChange={set('short_description_nl')} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Input label="Prijs vanaf (€)" type="number" step="0.01" min="0" value={form.price_from} onChange={set('price_from')} />
        <Input label="Prijs tot (€)" type="number" step="0.01" min="0" value={form.price_to} onChange={set('price_to')} />
        <Input label="Duur (min)" type="number" min="0" value={form.duration_minutes} onChange={set('duration_minutes')} />
        <Input label="Icon (Lucide)" value={form.icon} onChange={set('icon')} hint="bv. Sparkles" />
      </div>

      <Input label="Prijsopmerking (NL)" value={form.price_note_nl} onChange={set('price_note_nl')} hint="bv. Afhankelijk van staat voertuig" />

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={set('is_active')}
          className="w-4 h-4 accent-[var(--color-primary)] cursor-pointer"
        />
        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Actief (zichtbaar op website)
        </span>
      </label>

      <div className="flex gap-3 justify-end pt-2">
        <Button variant="ghost" onClick={onCancel} disabled={saving}>Annuleren</Button>
        <Button variant="primary" onClick={handleSave} loading={saving} leftIcon={<Check className="w-4 h-4" />}>
          Opslaan
        </Button>
      </div>
    </div>
  )
}

export default function ServicesManagePage() {
  const { showSuccess, showError } = useUiStore()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setServices(data || [])
        setLoading(false)
      })
  }, [])

  const handleSave = (updated) => {
    setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    setEditingId(null)
    showSuccess('Dienst opgeslagen.')
  }

  const toggleActive = async (service) => {
    const newVal = !service.is_active
    const { error } = await supabase
      .from('services')
      .update({ is_active: newVal, updated_at: new Date().toISOString() })
      .eq('id', service.id)

    if (error) {
      showError('Kon status niet wijzigen.')
    } else {
      setServices((prev) => prev.map((s) => (s.id === service.id ? { ...s, is_active: newVal } : s)))
    }
  }

  const editingService = services.find((s) => s.id === editingId)

  return (
    <div className="max-w-3xl space-y-5">
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.75rem',
          color: 'var(--color-text-primary)',
          letterSpacing: '0.03em',
        }}
      >
        DIENSTEN
      </h1>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} variant="rect" height="80px" className="rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-xl p-4"
              style={{
                backgroundColor: 'var(--color-surface-elevated)',
                border: `1px solid ${service.is_active ? 'rgba(196,130,111,0.2)' : 'rgba(196,130,111,0.12)'}`,
                opacity: service.is_active ? 1 : 0.6,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(196,130,111,0.1)', border: '1px solid rgba(196,130,111,0.2)' }}
                  >
                    <DynamicIcon name={service.icon || 'Sparkles'} className="w-4 h-4" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                      {service.title_nl}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                      {service.price_from ? `Vanaf ${formatPrice(service.price_from)}` : 'Geen prijs'}
                      {service.duration_minutes ? ` · ~${Math.floor(service.duration_minutes / 60)}u${service.duration_minutes % 60 > 0 ? `${service.duration_minutes % 60}min` : ''}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Actief toggle */}
                  <button
                    onClick={() => toggleActive(service)}
                    className="text-xs px-2.5 py-1 rounded-full cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                    style={
                      service.is_active
                        ? { backgroundColor: 'rgba(34,197,94,0.1)', color: 'var(--color-success)', border: '1px solid rgba(34,197,94,0.2)' }
                        : { backgroundColor: 'var(--color-surface-overlay)', color: 'var(--color-text-muted)', border: '1px solid rgba(196,130,111,0.2)' }
                    }
                  >
                    {service.is_active ? 'Actief' : 'Inactief'}
                  </button>

                  {/* Bewerken */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingId(service.id)}
                    leftIcon={<Pencil className="w-3.5 h-3.5" />}
                  >
                    Bewerken
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      <Modal
        isOpen={!!editingId}
        onClose={() => setEditingId(null)}
        title={`Bewerken: ${editingService?.title_nl || ''}`}
        size="lg"
      >
        {editingService && (
          <ServiceForm
            service={editingService}
            onSave={handleSave}
            onCancel={() => setEditingId(null)}
          />
        )}
      </Modal>
    </div>
  )
}
