import { Link } from 'react-router-dom'
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight, Truck } from '@/lib/icons'
import { useCartStore } from '@/stores/cartStore'
import { formatPrice } from '@/lib/utils'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants'
import Button from '@/components/ui/Button'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, shippingCost, total, isEmpty } = useCartStore()

  const amountUntilFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  return (
    <div className="section-padding" style={{ backgroundColor: 'var(--color-surface)', minHeight: '70vh' }}>
      <div className="container-ico max-w-4xl">

        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/shop"
            className="flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70 cursor-pointer"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Verder winkelen
          </Link>
        </div>

        <h1
          className="mb-8"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            color: 'var(--color-text-primary)',
            letterSpacing: '0.03em',
          }}
        >
          WINKELWAGEN
          {!isEmpty && (
            <span className="ml-3 text-2xl" style={{ color: 'var(--color-primary)' }}>
              ({items.reduce((n, i) => n + i.quantity, 0)})
            </span>
          )}
        </h1>

        {isEmpty ? (
          <div className="py-20 flex flex-col items-center gap-5 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
            >
              <ShoppingBag className="w-9 h-9" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
                Je winkelwagen is leeg
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Ontdek onze CleanTech producten
              </p>
            </div>
            <Button as={Link} to="/shop" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Naar de shop
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-xl"
                  style={{
                    backgroundColor: 'var(--color-surface-elevated)',
                    border: '1px solid rgba(196,130,111,0.2)',
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    className="w-20 h-20 rounded-lg flex-shrink-0 overflow-hidden"
                    style={{ backgroundColor: 'var(--color-surface-overlay)' }}
                  >
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-7 h-7" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          to={`/shop/${item.slug}`}
                          className="text-sm font-semibold hover:opacity-80 transition-opacity cursor-pointer"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {item.name}
                        </Link>
                        <p
                          className="mt-0.5"
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.1rem',
                            color: 'var(--color-primary)',
                          }}
                        >
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            {formatPrice(item.price)} per stuk
                          </p>
                        )}
                      </div>

                      {/* Verwijder */}
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label={`${item.name} verwijderen`}
                        className="p-1.5 rounded-lg cursor-pointer transition-colors hover:bg-[var(--color-surface-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-error)]"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Quantity stepper */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Minder"
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--color-surface-overlay)] disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                        style={{ border: '1px solid rgba(196,130,111,0.2)' }}
                      >
                        <Minus className="w-3 h-3" style={{ color: 'var(--color-text-secondary)' }} aria-hidden="true" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Meer"
                        className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--color-surface-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                        style={{ border: '1px solid rgba(196,130,111,0.2)' }}
                      >
                        <Plus className="w-3 h-3" style={{ color: 'var(--color-text-secondary)' }} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totalen sidebar */}
            <aside className="lg:col-span-1">
              <div
                className="rounded-xl p-5 space-y-4 sticky top-24"
                style={{
                  backgroundColor: 'var(--color-surface-elevated)',
                  border: '1px solid rgba(196,130,111,0.2)',
                }}
              >
                <h2
                  className="text-sm font-semibold uppercase tracking-widest"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Overzicht
                </h2>

                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <span>Subtotaal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <span>Verzending</span>
                    <span style={{ color: shippingCost === 0 ? 'var(--color-success)' : undefined }}>
                      {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
                    </span>
                  </div>
                </div>

                {/* Gratis verzending progressie */}
                {amountUntilFreeShipping > 0 && (
                  <div
                    className="p-3 rounded-lg text-xs"
                    style={{
                      backgroundColor: 'rgba(34,197,94,0.07)',
                      border: '1px solid rgba(34,197,94,0.15)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <Truck className="w-3.5 h-3.5" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
                      <span>
                        Nog <strong style={{ color: 'var(--color-text-primary)' }}>{formatPrice(amountUntilFreeShipping)}</strong> voor gratis verzending
                      </span>
                    </div>
                    <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ backgroundColor: 'rgba(196,130,111,0.12)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                          backgroundColor: 'var(--color-success)',
                        }}
                      />
                    </div>
                  </div>
                )}

                <div
                  className="flex justify-between font-semibold text-base border-t pt-4"
                  style={{ borderColor: 'rgba(196,130,111,0.15)', color: 'var(--color-text-primary)' }}
                >
                  <span>Totaal</span>
                  <span style={{ color: 'var(--color-primary)' }}>{formatPrice(total)}</span>
                </div>

                <Button
                  as={Link}
                  to="/shop/afrekenen"
                  variant="primary"
                  fullWidth
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Afrekenen
                </Button>

                <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
                  Veilig betalen via Mollie
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
