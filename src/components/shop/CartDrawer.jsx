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
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{ zIndex: 'var(--z-overlay)' }}
        aria-hidden="true"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Winkelwagen"
        className={cn(
          'fixed top-0 right-0 h-full w-96 max-w-[90vw] flex flex-col',
          'transition-transform duration-300 ease-out',
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{
          backgroundColor: 'var(--color-surface-elevated)',
          borderLeft: '1px solid rgba(196,130,111,0.2)',
          zIndex: 'var(--z-modal)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: 'rgba(196,130,111,0.15)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)', fontSize: '1.25rem', letterSpacing: '0.05em' }}>
            WINKELWAGEN {items.length > 0 && <span style={{ color: 'var(--color-primary)' }}>({items.reduce((n, i) => n + i.quantity, 0)})</span>}
          </h2>
          <button
            onClick={closeCart}
            aria-label="Winkelwagen sluiten"
            className="p-2 rounded-md cursor-pointer transition-colors duration-150 hover:bg-[var(--color-surface-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-overlay)' }}>
                <ShoppingBag className="w-8 h-8" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
              </div>
              <div>
                <p className="font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>Winkelwagen is leeg</p>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Voeg producten toe uit onze shop</p>
              </div>
              <Button variant="secondary" size="sm" as={Link} to="/shop" onClick={closeCart}>
                Naar de Shop
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4" role="list">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  {/* Thumbnail */}
                  <div
                    className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden"
                    style={{ backgroundColor: 'var(--color-surface-overlay)' }}
                  >
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{item.name}</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--color-primary)' }}>{formatPrice(item.price)}</p>

                    {/* Quantity stepper */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label={`Minder ${item.name}`}
                        className="w-6 h-6 rounded flex items-center justify-center cursor-pointer transition-colors duration-150 hover:bg-[var(--color-surface-overlay)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-primary)]"
                        style={{ border: '1px solid rgba(196,130,111,0.2)' }}
                      >
                        <Minus className="w-3 h-3" style={{ color: 'var(--color-text-secondary)' }} aria-hidden="true" />
                      </button>
                      <span className="text-sm w-6 text-center" style={{ color: 'var(--color-text-primary)' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label={`Meer ${item.name}`}
                        className="w-6 h-6 rounded flex items-center justify-center cursor-pointer transition-colors duration-150 hover:bg-[var(--color-surface-overlay)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-primary)]"
                        style={{ border: '1px solid rgba(196,130,111,0.2)' }}
                      >
                        <Plus className="w-3 h-3" style={{ color: 'var(--color-text-secondary)' }} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Verwijder */}
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label={`${item.name} verwijderen`}
                    className="p-1.5 rounded cursor-pointer transition-colors duration-150 hover:bg-[var(--color-surface-overlay)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-error)] flex-shrink-0 self-start"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — totalen + checkout */}
        {!isEmpty && (
          <div className="flex-shrink-0 px-6 py-5 border-t space-y-3" style={{ borderColor: 'rgba(196,130,111,0.15)' }}>
            <div className="flex justify-between text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <span>Subtotaal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <span>Verzending</span>
              <span>{shippingCost === 0 ? <span style={{ color: 'var(--color-success)' }}>Gratis</span> : formatPrice(shippingCost)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-3" style={{ borderColor: 'rgba(196,130,111,0.15)', color: 'var(--color-text-primary)' }}>
              <span>Totaal</span>
              <span style={{ color: 'var(--color-primary)' }}>{formatPrice(total)}</span>
            </div>
            <Button
              as={Link}
              to="/shop/afrekenen"
              variant="primary"
              fullWidth
              onClick={closeCart}
            >
              Afrekenen
            </Button>
            <Button variant="ghost" fullWidth size="sm" onClick={closeCart}>
              Verder Winkelen
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
