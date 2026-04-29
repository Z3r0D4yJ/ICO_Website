import { Link } from 'react-router-dom'
import { X, ShoppingBag, Trash2, Plus, Minus } from '@/lib/icons'
import { useUiStore } from '@/stores/uiStore'
import { useCartStore } from '@/stores/cartStore'
import Button from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function CartDrawer() {
  const { isCartOpen, closeCart } = useUiStore()
  const { items, removeItem, updateQuantity, subtotal, shippingCost, total, isEmpty } = useCartStore()

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-[rgba(8,7,6,0.68)] backdrop-blur-sm transition-opacity duration-300',
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{ zIndex: 'var(--z-overlay)' }}
        aria-hidden="true"
        onClick={closeCart}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Winkelwagen"
        className={cn(
          'fixed right-0 top-0 flex h-full w-96 max-w-[92vw] flex-col border-l border-[var(--color-border)] shadow-[var(--shadow-lg)] transition-transform duration-300 ease-[var(--ease-out)]',
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{
          background:
            'radial-gradient(circle at 100% 0%, rgba(184,111,92,0.10), transparent 18rem), var(--ink-100)',
          zIndex: 'var(--z-modal)',
        }}
      >
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <div>
            <p className="ico-eyebrow">Shop</p>
            <h2 className="mt-1 font-display text-2xl text-[var(--bone-000)]">
              Winkelwagen {items.length > 0 && <span className="text-[var(--copper-200)]">({items.reduce((n, i) => n + i.quantity, 0)})</span>}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Winkelwagen sluiten"
            className="rounded-[var(--radius-sm)] p-2 text-[var(--bone-300)] transition-colors hover:bg-[var(--ink-200)] hover:text-[var(--bone-000)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(216,158,140,0.45)]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[rgba(250,246,241,0.035)]">
                <ShoppingBag className="h-8 w-8 text-[var(--bone-300)]" aria-hidden="true" />
              </div>
              <div>
                <p className="font-display text-2xl text-[var(--bone-000)]">Nog niets gekozen</p>
                <p className="mt-1 text-sm text-[var(--bone-300)]">CleanTech producten die Rico en Nico zelf gebruiken.</p>
              </div>
              <Button variant="secondary" size="sm" as={Link} to="/shop" onClick={closeCart}>
                Naar de shop
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4" role="list">
              {items.map((item) => (
                <li key={item.id} className="grid grid-cols-[4rem_1fr_auto] gap-3">
                  <div className="h-16 w-16 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--ink-200)]">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-[var(--bone-300)]" aria-hidden="true" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--bone-000)]">{item.name}</p>
                    <p className="mt-0.5 font-display text-xl leading-none text-[var(--copper-200)]">{formatPrice(item.price)}</p>

                    <div className="mt-2 inline-flex items-center rounded-[var(--radius-sm)] border border-[var(--color-border)]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label={`Minder ${item.name}`}
                        className="flex h-7 w-7 items-center justify-center text-[var(--bone-200)] transition-colors hover:bg-[var(--ink-200)]"
                      >
                        <Minus className="h-3 w-3" aria-hidden="true" />
                      </button>
                      <span className="w-7 text-center text-sm text-[var(--bone-000)]">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label={`Meer ${item.name}`}
                        className="flex h-7 w-7 items-center justify-center text-[var(--bone-200)] transition-colors hover:bg-[var(--ink-200)]"
                      >
                        <Plus className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`${item.name} verwijderen`}
                    className="self-start rounded-[var(--radius-sm)] p-1.5 text-[var(--bone-300)] transition-colors hover:bg-[rgba(194,101,90,0.12)] hover:text-[var(--signal-stop)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--signal-stop)]"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!isEmpty && (
          <div className="flex-shrink-0 space-y-3 border-t border-[var(--color-border)] px-5 py-5">
            <div className="flex justify-between text-sm text-[var(--bone-200)]">
              <span>Subtotaal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-[var(--bone-200)]">
              <span>Verzending</span>
              <span className={shippingCost === 0 ? 'text-[var(--signal-go)]' : ''}>
                {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between border-t border-[var(--color-border)] pt-3 font-semibold text-[var(--bone-000)]">
              <span>Totaal</span>
              <span className="text-[var(--copper-200)]">{formatPrice(total)}</span>
            </div>
            <Button as={Link} to="/shop/afrekenen" variant="primary" fullWidth onClick={closeCart}>
              Afrekenen
            </Button>
            <Button variant="ghost" fullWidth size="sm" onClick={closeCart}>
              Verder winkelen
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
