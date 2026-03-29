import { useState, useEffect } from 'react'
import { Pencil, Plus, Check, Minus, Trash2 } from '@/lib/icons'
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
            style={{ backgroundColor: 'var(--color-surface-overlay)', border: '1px solid rgba(196,130,111,0.2)', color: 'var(--color-text-primary)', colorScheme: 'dark' }}
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
  const [deletingProduct, setDeletingProduct] = useState(null)

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

  const handleDelete = async () => {
    const { error } = await supabase.from('products').delete().eq('id', deletingProduct.id)
    if (error) {
      showError('Verwijderen mislukt.')
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id))
      showSuccess('Product verwijderd.')
    }
    setDeletingProduct(null)
  }

  const modalTitle = isNew ? 'Nieuw product' : `Bewerken: ${editingProduct?.name || ''}`

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
        PRODUCTEN
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rect" height="72px" className="rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-8">
          {PRODUCT_CATEGORIES.map((cat) => {
            const catProducts = products.filter((p) => p.category === cat.value)
            const uncategorized = cat.value === PRODUCT_CATEGORIES[0].value
              ? products.filter((p) => !p.category || !PRODUCT_CATEGORIES.find((c) => c.value === p.category))
              : []
            const allProducts = cat.value === PRODUCT_CATEGORIES[0].value
              ? [...catProducts, ...uncategorized]
              : catProducts
            if (allProducts.length === 0 && cat.value !== PRODUCT_CATEGORIES[0].value) return null
            return (
              <div key={cat.value}>
                {/* Categorie header */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>
                    {cat.label_nl}
                    <span className="ml-2 font-normal normal-case tracking-normal" style={{ color: 'var(--color-text-muted)' }}>
                      ({allProducts.length})
                    </span>
                  </p>
                  <button
                    onClick={() => {
                      setEditingProduct({ ...EMPTY_PRODUCT, category: cat.value })
                      setIsNew(true)
                    }}
                    className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                    style={{ backgroundColor: 'rgba(196,130,111,0.08)', border: '1px solid rgba(196,130,111,0.2)', color: 'var(--color-primary)' }}
                  >
                    <Plus className="w-3 h-3" aria-hidden="true" />
                    Nieuw product
                  </button>
                </div>

                {allProducts.length === 0 ? (
                  <p className="text-xs py-4 text-center rounded-xl" style={{ color: 'var(--color-text-muted)', border: '1px dashed rgba(196,130,111,0.2)' }}>
                    Nog geen producten in deze categorie.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {allProducts.map((product) => (
                      <div
                        key={product.id}
                        className="rounded-xl p-3 sm:p-4"
                        style={{
                          backgroundColor: 'var(--color-surface-elevated)',
                          border: '1px solid rgba(196,130,111,0.2)',
                          opacity: product.is_active ? 1 : 0.6,
                        }}
                      >
                        {/* Info */}
                        <div className="mb-2">
                          <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
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
                          </div>
                        </div>

                        {/* Acties */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Voorraad */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateStock(product, -1)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--color-surface-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
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
                              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--color-surface-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
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
                          <button
                            onClick={() => setDeletingProduct(product)}
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
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Verwijder bevestiging */}
      <Modal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        title="Product verwijderen"
        size="sm"
      >
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          Ben je zeker dat je <strong style={{ color: 'var(--color-text-primary)' }}>{deletingProduct?.name}</strong> wil verwijderen? Dit kan niet ongedaan gemaakt worden.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeletingProduct(null)}>Annuleren</Button>
          <Button variant="danger" onClick={handleDelete} leftIcon={<Trash2 className="w-4 h-4" />}>Verwijderen</Button>
        </div>
      </Modal>

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
