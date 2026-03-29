import { useState, useEffect } from 'react'
import { Pencil, Check, Plus, Trash2 } from '@/lib/icons'
import { supabase } from '@/config/supabase'
import { formatPrice } from '@/lib/utils'
import { DynamicIcon } from '@/lib/icons'
import { useUiStore } from '@/stores/uiStore'
import { SERVICE_CATEGORIES } from '@/lib/constants'
import Button from '@/components/ui/Button'
import Input, { Textarea } from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Skeleton from '@/components/ui/Skeleton'

const EMPTY_SERVICE = {
  title_nl: '', title_en: '',
  description_nl: '', description_en: '',
  short_description_nl: '',
  price_from: '', price_to: '',
  price_note_nl: '',
  duration_minutes: '',
  icon: 'Sparkles',
  is_active: true,
  sort_order: 0,
}

function ServiceForm({ service, categoryValue, isNew, onSave, onCancel }) {
  const [form, setForm] = useState({
    ...EMPTY_SERVICE,
    service_category: categoryValue || service?.service_category || 'wash',
    ...( service ? {
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
      sort_order: service.sort_order ?? 0,
    } : {}),
  })
  const [saving, setSaving] = useState(false)

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [field]: val }))
  }

  const handleSave = async () => {
    if (!form.title_nl.trim()) return
    setSaving(true)
    const payload = {
      ...form,
      price_from: form.price_from !== '' ? parseFloat(form.price_from) : null,
      price_to: form.price_to !== '' ? parseFloat(form.price_to) : null,
      duration_minutes: form.duration_minutes !== '' ? parseInt(form.duration_minutes) : null,
      updated_at: new Date().toISOString(),
    }

    let result, error
    if (isNew) {
      // Genereer slug vanuit titel
      const slug = form.title_nl.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const { data, error: err } = await supabase
        .from('services')
        .insert({ ...payload, slug })
        .select()
        .single()
      result = data; error = err
    } else {
      const { error: err } = await supabase.from('services').update(payload).eq('id', service.id)
      result = { ...service, ...payload }; error = err
    }

    setSaving(false)
    if (!error) onSave(result)
  }

  return (
    <div className="space-y-4">
      {isNew && (
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
            Categorie
          </label>
          <select
            value={form.service_category}
            onChange={set('service_category')}
            className="w-full px-3 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: 'var(--color-surface-overlay)',
              border: '1px solid rgba(196,130,111,0.2)',
              color: 'var(--color-text-primary)',
              colorScheme: 'dark',
            }}
          >
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label_nl}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Naam (NL) *" value={form.title_nl} onChange={set('title_nl')} />
        <Input label="Naam (EN)" value={form.title_en} onChange={set('title_en')} />
      </div>

      <Textarea label="Beschrijving (NL) *" rows={4} value={form.description_nl} onChange={set('description_nl')} />
      <Textarea label="Beschrijving (EN)" rows={3} value={form.description_en} onChange={set('description_en')} />
      <Input label="Korte beschrijving (NL)" value={form.short_description_nl} onChange={set('short_description_nl')} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
          {isNew ? 'Toevoegen' : 'Opslaan'}
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
  const [addingCategory, setAddingCategory] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

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
    setServices((prev) => {
      const exists = prev.find((s) => s.id === updated.id)
      return exists
        ? prev.map((s) => (s.id === updated.id ? updated : s))
        : [...prev, updated]
    })
    setEditingId(null)
    setAddingCategory(null)
    showSuccess(editingId ? 'Dienst opgeslagen.' : 'Dienst toegevoegd.')
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

  const handleDelete = async () => {
    const { error } = await supabase.from('services').delete().eq('id', deletingId)
    if (error) {
      showError('Verwijderen mislukt.')
    } else {
      setServices((prev) => prev.filter((s) => s.id !== deletingId))
      showSuccess('Dienst verwijderd.')
    }
    setDeletingId(null)
  }

  const editingService = services.find((s) => s.id === editingId)
  const deletingService = services.find((s) => s.id === deletingId)

  return (
    <div className="space-y-5">
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
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rect" height="80px" className="rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-8">
          {SERVICE_CATEGORIES.map((cat) => {
            const catServices = services.filter((s) => s.service_category === cat.value)
            return (
              <div key={cat.value}>
                {/* Categorie header */}
                <div className="flex items-center justify-between mb-3">
                  <p
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {cat.label_nl}
                    <span className="ml-2 font-normal normal-case tracking-normal" style={{ color: 'var(--color-text-muted)' }}>
                      ({catServices.length})
                    </span>
                  </p>
                  <button
                    onClick={() => setAddingCategory(cat.value)}
                    className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                    style={{
                      backgroundColor: 'rgba(196,130,111,0.08)',
                      border: '1px solid rgba(196,130,111,0.2)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    <Plus className="w-3 h-3" aria-hidden="true" />
                    Nieuwe dienst
                  </button>
                </div>

                {/* 2-kolommen grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {catServices.map((service) => (
                    <div
                      key={service.id}
                      className="rounded-xl p-3 sm:p-4"
                      style={{
                        backgroundColor: 'var(--color-surface-elevated)',
                        border: `1px solid ${service.is_active ? 'rgba(196,130,111,0.2)' : 'rgba(196,130,111,0.12)'}`,
                        opacity: service.is_active ? 1 : 0.6,
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0 mb-2">
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

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => toggleActive(service)}
                          className="text-xs h-6 px-3 rounded-full cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                          style={
                            service.is_active
                              ? { backgroundColor: 'rgba(34,197,94,0.1)', color: 'var(--color-success)', border: '1px solid rgba(34,197,94,0.2)' }
                              : { backgroundColor: 'var(--color-surface-overlay)', color: 'var(--color-text-muted)', border: '1px solid rgba(196,130,111,0.2)' }
                          }
                        >
                          {service.is_active ? 'Actief' : 'Inactief'}
                        </button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(service.id)}
                          leftIcon={<Pencil className="w-3.5 h-3.5" />}
                        >
                          Bewerken
                        </Button>
                        <button
                          onClick={() => setDeletingId(service.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40 ml-auto"
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

      {/* Bewerken modal */}
      <Modal
        isOpen={!!editingId}
        onClose={() => setEditingId(null)}
        title={`Bewerken: ${editingService?.title_nl || ''}`}
        size="lg"
      >
        {editingService && (
          <ServiceForm
            service={editingService}
            isNew={false}
            onSave={handleSave}
            onCancel={() => setEditingId(null)}
          />
        )}
      </Modal>

      {/* Verwijder bevestiging */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Dienst verwijderen"
        size="sm"
      >
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          Ben je zeker dat je <strong style={{ color: 'var(--color-text-primary)' }}>{deletingService?.title_nl}</strong> wil verwijderen? Dit kan niet ongedaan gemaakt worden.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeletingId(null)}>Annuleren</Button>
          <Button variant="danger" onClick={handleDelete} leftIcon={<Trash2 className="w-4 h-4" />}>Verwijderen</Button>
        </div>
      </Modal>

      {/* Nieuwe dienst modal */}
      <Modal
        isOpen={!!addingCategory}
        onClose={() => setAddingCategory(null)}
        title={`Nieuwe dienst — ${SERVICE_CATEGORIES.find((c) => c.value === addingCategory)?.label_nl || ''}`}
        size="lg"
      >
        {addingCategory && (
          <ServiceForm
            service={null}
            categoryValue={addingCategory}
            isNew={true}
            onSave={handleSave}
            onCancel={() => setAddingCategory(null)}
          />
        )}
      </Modal>
    </div>
  )
}
