import { useState, useEffect } from 'react'
import { Pencil, Plus, Check, Minus } from '@/lib/icons'
import { supabase } from '@/config/supabase'
import { formatPrice } from '@/lib/utils'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import { useUiStore } from '@/stores/uiStore'
import Button from '@/components/ui/Button'
import Input, { Textarea } from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Skeleton from '@/components/ui/Skeleton'

const EMPTY_PRODUCT = {
  slug: '',
  name: '',
  description_nl: '',
  price: '',
  compare_at_price: '',
  category: '',
  stock_quantity: 0,
  is_active: true,
}

function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState({
    slug: product.slug || '',
    name: product.name || '',
    description_nl: product.description_nl || '',
    price: product.price ?? '',
    compare_at_price: product.compare_at_price ?? '',
    category: product.category || '',
    stock_quantity: product.stock_quantity ?? 0,
    is_active: product.is_active ?? true,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [field]: val }))
  }

  const handleSave = async () => {
    if (!form.name || !form.price) { setError('Naam en prijs zijn verplicht.'); return }
    setSaving(true)
    setError('')

    const payload = {
      ...form,
      price: parseFloat(form.price),
      compare_at_price: form.compare_at_price !== '' ? parseFloat(form.compare_at_price) : null,
      stock_quantity: parseInt(form.stock_quantity) || 0,
      updated_at: new Date().toISOString(),
    }

    let result
    if (product.id) {
      result = await supabase.from('products').update(payload).eq('id', product.id).select().single()
    } else {
      result = await supabase.from('products').insert(payload).select().single()
    }

    setSaving(false)
    if (result.error) {
      setError('Opslaan mislukt. Controleer of de slug uniek is.')
    } else {
      onSave(result.data)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Naam *" value={form.name} onChange={set('name')} />
        <Input label="Slug *" value={form.slug} onChange={set('slug')} hint="bv. ceramicmax-coating" />
      </div>

      <Textarea label="Beschrijving (NL)" rows={3} value={form.description_nl} onChange={set('description_nl')} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Input label="Prijs (€) *" type="number" step="0.01" min="0" value={form.price} onChange={set('price')} />
        <Input label="Doorstreepprijs (€)" type="number" step="0.01" min="0" value={form.compare_at_price} onChange={set('compare_at_price')} />
        <Input label="Voorraad" type="number" min="0" value={form.stock_quantity} onChange={set('stock_quantity')} />
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
            Categorie
          </label>
          <select
            value={form.category}
            onChange={set('category')}
            className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
            style={{ backgroundColor: 'var(--color-surface-overlay)', border: '1px solid rgba(196,130,111,0.2)', color: 'var(--color-text-primary)' }}
          >
            <option value="">Geen</option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label_nl}</option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.is_active} onChange={set('is_active')} className="w-4 h-4 accent-[var(--color-primary)]" />
        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Actief (zichtbaar in webshop)</span>
      </label>

      {error && (
        <p className="text-sm px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--color-error)', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </p>
      )}

      <div className="flex gap-3 justify-end pt-2">
        <Button variant="ghost" onClick={onCancel} disabled={saving}>Annuleren</Button>
        <Button variant="primary" onClick={handleSave} loading={saving} leftIcon={<Check className="w-4 h-4" />}>
          {product.id ? 'Opslaan' : 'Aanmaken'}
        </Button>
      </div>
    </div>
  )
}

export default function ProductsManagePage() {
  const { showSuccess, showError } = useUiStore()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isNew, setIsNew] = useState(false)

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => { setProducts(data || []); setLoading(false) })
  }, [])

  const handleSave = (saved) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === saved.id)
      return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [...prev, saved]
    })
    setEditingProduct(null)
    setIsNew(false)
    showSuccess('Product opgeslagen.')
  }

  const updateStock = async (product, delta) => {
    const newStock = Math.max(0, (product.stock_quantity || 0) + delta)
    const { error } = await supabase
      .from('products')
      .update({ stock_quantity: newStock, updated_at: new Date().toISOString() })
      .eq('id', product.id)

    if (!error) {
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, stock_quantity: newStock } : p)))
    }
  }

  const modalTitle = isNew ? 'Nieuw product' : `Bewerken: ${editingProduct?.name || ''}`

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.75rem',
            color: 'var(--color-text-primary)',
            letterSpacing: '0.03em',
          }}
        >
          PRODUCTEN
        </h1>
        <Button
          variant="primary"
          size="sm"
          onClick={() => { setEditingProduct(EMPTY_PRODUCT); setIsNew(true) }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Nieuw product
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rect" height="72px" className="rounded-xl" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center rounded-xl" style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Geen producten gevonden.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl p-4 flex items-center gap-4"
              style={{
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid rgba(196,130,111,0.2)',
                opacity: product.is_active ? 1 : 0.6,
              }}
            >
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {product.name}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                    {formatPrice(product.price)}
                  </span>
                  {product.compare_at_price && (
                    <span className="text-xs line-through" style={{ color: 'var(--color-text-muted)' }}>
                      {formatPrice(product.compare_at_price)}
                    </span>
                  )}
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {product.category || 'Geen categorie'}
                  </span>
                </div>
              </div>

              {/* Voorraad aanpassen */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => updateStock(product, -1)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--color-surface-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                  style={{ border: '1px solid rgba(196,130,111,0.2)' }}
                  aria-label="Voorraad verminderen"
                >
                  <Minus className="w-3 h-3" style={{ color: 'var(--color-text-secondary)' }} aria-hidden="true" />
                </button>
                <span
                  className="text-sm font-semibold w-8 text-center"
                  style={{ color: product.stock_quantity === 0 ? 'var(--color-error)' : 'var(--color-text-primary)' }}
                >
                  {product.stock_quantity}
                </span>
                <button
                  onClick={() => updateStock(product, 1)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--color-surface-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                  style={{ border: '1px solid rgba(196,130,111,0.2)' }}
                  aria-label="Voorraad verhogen"
                >
                  <Plus className="w-3 h-3" style={{ color: 'var(--color-text-secondary)' }} aria-hidden="true" />
                </button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setEditingProduct(product); setIsNew(false) }}
                leftIcon={<Pencil className="w-3.5 h-3.5" />}
              >
                Bewerken
              </Button>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!editingProduct}
        onClose={() => { setEditingProduct(null); setIsNew(false) }}
        title={modalTitle}
        size="lg"
      >
        {editingProduct && (
          <ProductForm
            product={editingProduct}
            onSave={handleSave}
            onCancel={() => { setEditingProduct(null); setIsNew(false) }}
          />
        )}
      </Modal>
    </div>
  )
}
