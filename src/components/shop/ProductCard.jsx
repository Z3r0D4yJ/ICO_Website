import { Link } from 'react-router-dom'
import { ShoppingBag, Plus } from '@/lib/icons'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/stores/cartStore'
import { useUiStore } from '@/stores/uiStore'

/**
 * ProductCard — kaart voor een CleanTech product in het grid.
 */
export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem)
  const showSuccess = useUiStore((s) => s.showSuccess)

  const handleAddToCart = (e) => {
    e.preventDefault()
    addItem(product)
    showSuccess(`${product.name} toegevoegd aan winkelwagen.`)
  }

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
  const discountPct = hasDiscount
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  return (
    <Link
      to={`/shop/${product.slug}`}
      className="group flex flex-col rounded-xl overflow-hidden transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
      style={{
        backgroundColor: 'var(--color-surface-elevated)',
        border: '1px solid rgba(196,130,111,0.2)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = '1px solid rgba(196,130,111,0.35)'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = '1px solid rgba(196,130,111,0.2)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Afbeelding */}
      <div
        className="relative aspect-square overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface-overlay)' }}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag
              className="w-12 h-12"
              style={{ color: 'var(--color-text-muted)' }}
              aria-hidden="true"
            />
          </div>
        )}

        {/* Kortingsbadge */}
        {hasDiscount && (
          <div
            className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ backgroundColor: 'var(--color-error)', color: '#fff' }}
          >
            -{discountPct}%
          </div>
        )}

        {/* Uitverkocht */}
        {product.stock_quantity === 0 && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: 'var(--color-surface-elevated)', color: 'var(--color-text-muted)' }}
            >
              Uitverkocht
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex-1">
          {product.category && (
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>
              {product.category}
            </p>
          )}
          <h3 className="text-sm font-semibold leading-snug" style={{ color: 'var(--color-text-primary)' }}>
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between gap-2">
          {/* Prijs */}
          <div className="flex items-baseline gap-2">
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                color: 'var(--color-primary)',
                lineHeight: 1,
              }}
            >
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs line-through" style={{ color: 'var(--color-text-muted)' }}>
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>

          {/* Snel toevoegen */}
          {product.stock_quantity > 0 && (
            <button
              onClick={handleAddToCart}
              aria-label={`${product.name} toevoegen aan winkelwagen`}
              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150 hover:scale-110 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-inverse)',
              }}
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}
