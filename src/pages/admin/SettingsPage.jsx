import { useState, useEffect } from 'react'
import { Check } from '@/lib/icons'
import { supabase } from '@/config/supabase'
import { useUiStore } from '@/stores/uiStore'
import Input, { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'

// Welke instellingen we tonen en hoe
const SETTINGS_SCHEMA = [
  {
    group: 'Contact',
    items: [
      { key: 'contact_phone', label: 'Telefoonnummer', type: 'text', placeholder: '+32 495 00 00 00' },
      { key: 'contact_email', label: 'E-mailadres', type: 'email', placeholder: 'info@ico-detailing.be' },
      { key: 'contact_whatsapp', label: 'WhatsApp nummer', type: 'text', placeholder: '32495000000', hint: 'Internationaal formaat zonder + of spaties' },
    ],
  },
  {
    group: 'Werkgebied & openingstijden',
    items: [
      { key: 'service_area_nl', label: 'Werkgebied omschrijving (NL)', type: 'textarea', placeholder: 'Regio Vlaanderen — Gent, Brussel, Antwerpen...' },
      { key: 'opening_hours_nl', label: 'Openingstijden (NL)', type: 'textarea', placeholder: 'Ma–Vr: 08:00–18:00\nZa: 09:00–17:00\nZo: Gesloten' },
    ],
  },
  {
    group: 'Social media',
    items: [
      { key: 'social_instagram', label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/ico_detailing' },
      { key: 'social_facebook', label: 'Facebook URL', type: 'url', placeholder: 'https://facebook.com/icodetailing' },
      { key: 'social_tiktok', label: 'TikTok URL', type: 'url', placeholder: 'https://tiktok.com/@ico_detailing' },
    ],
  },
  {
    group: 'SEO & site info',
    items: [
      { key: 'site_tagline_nl', label: 'Tagline (NL)', type: 'text', placeholder: 'Mobiliteit ontmoet vakmanschap' },
      { key: 'meta_description_nl', label: 'Meta beschrijving (NL)', type: 'textarea', placeholder: 'Premium mobile car detailing in Vlaanderen...' },
    ],
  },
]

export default function SettingsPage() {
  const { showSuccess, showError } = useUiStore()
  const [values, setValues] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key, value')
      .then(({ data }) => {
        const mapped = {}
        ;(data || []).forEach(({ key, value }) => {
          // value is JSONB — voor strings is het een string in JSON
          mapped[key] = typeof value === 'string' ? value : value?.text ?? JSON.stringify(value)
        })
        setValues(mapped)
        setLoading(false)
      })
  }, [])

  const set = (key) => (e) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Upsert alle gewijzigde waarden
      const upserts = Object.entries(values).map(([key, val]) => ({
        key,
        value: val, // Supabase slaat strings op als JSONB string
        updated_at: new Date().toISOString(),
      }))

      const { error } = await supabase
        .from('site_settings')
        .upsert(upserts, { onConflict: 'key' })

      if (error) throw error
      showSuccess('Instellingen opgeslagen.')
    } catch {
      showError('Opslaan mislukt.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.75rem',
            color: 'var(--color-text-primary)',
            letterSpacing: '0.03em',
          }}
        >
          INSTELLINGEN
        </h1>
        <Button
          variant="primary"
          onClick={handleSave}
          loading={saving}
          disabled={saving || loading}
          leftIcon={<Check className="w-4 h-4" />}
        >
          Alles opslaan
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} variant="rect" height="120px" className="rounded-xl" />)}
        </div>
      ) : (
        SETTINGS_SCHEMA.map((group) => (
          <section
            key={group.group}
            className="rounded-xl p-5 space-y-4"
            style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
          >
            <h2
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {group.group}
            </h2>

            {group.items.map((item) => (
              item.type === 'textarea' ? (
                <Textarea
                  key={item.key}
                  label={item.label}
                  placeholder={item.placeholder}
                  hint={item.hint}
                  rows={3}
                  value={values[item.key] || ''}
                  onChange={set(item.key)}
                />
              ) : (
                <Input
                  key={item.key}
                  label={item.label}
                  type={item.type}
                  placeholder={item.placeholder}
                  hint={item.hint}
                  value={values[item.key] || ''}
                  onChange={set(item.key)}
                />
              )
            ))}
          </section>
        ))
      )}

      {/* Opslaan onderaan */}
      {!loading && (
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleSave}
            loading={saving}
            disabled={saving}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Alles opslaan
          </Button>
        </div>
      )}
    </div>
  )
}
