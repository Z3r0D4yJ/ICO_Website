import { Link } from 'react-router-dom'
import { ShoppingBag, Plus } from '@/lib/icons'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/stores/cartStore'
import { useUiStore } from '@/stores/uiStore'

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
  const isSoldOut = product.stock_quantity === 0

  return (
    <Link
      to={`/shop/${product.slug}`}
      className="group ico-panel flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(184,111,92,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(216,158,140,0.45)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--ink-200)]">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-[var(--bone-300)]" aria-hidden="true" />
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.category && (
            <span className="rounded-[var(--radius-sm)] bg-[rgba(8,7,6,0.72)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--bone-100)] backdrop-blur-sm">
              {product.category}
            </span>
          )}
          {hasDiscount && (
            <span className="rounded-[var(--radius-sm)] bg-[var(--signal-stop)] px-2 py-1 font-mono text-[10px] font-semibold text-[var(--bone-000)]">
              -{discountPct}%
            </span>
          )}
        </div>

        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-[rgba(8,7,6,0.62)]">
            <span className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--ink-100)] px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-[var(--bone-200)]">
              Uitverkocht
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex-1">
          <h3 className="font-body text-sm font-semibold leading-snug text-[var(--bone-000)]">
            {product.name}
          </h3>
          {product.description_nl && (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--bone-300)]">
              {product.description_nl}
            </p>
          )}
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-[var(--color-border)] pt-4">
          <div>
            <div className="font-display text-2xl leading-none text-[var(--bone-000)]">
              {formatPrice(product.price)}
            </div>
            {hasDiscount && (
              <div className="mt-1 text-xs line-through text-[var(--bone-300)]">
                {formatPrice(product.compare_at_price)}
              </div>
            )}
          </div>

          {!isSoldOut && (
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={`${product.name} toevoegen aan winkelwagen`}
              className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--copper-400)] text-[var(--ink-000)] transition-all hover:bg-[var(--copper-200)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(216,158,140,0.45)]"
            >
              <Plus className="h-4 w-4" weight="bold" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}
