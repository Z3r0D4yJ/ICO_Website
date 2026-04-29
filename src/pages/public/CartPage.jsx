import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck } from '@/lib/icons'
import { useCartStore } from '@/stores/cartStore'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import Button from '@/components/ui/Button'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, shippingCost, total, isEmpty } = useCartStore()
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)
  const amountUntilFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <main className="section-padding bg-[var(--color-surface)]">
      <div className="container-ico">
        <Link
          to="/shop"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--bone-300)] transition-colors hover:text-[var(--copper-200)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Verder winkelen
        </Link>

        <div className="mb-10 flex flex-col gap-4 border-b border-[var(--color-border)] pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="edit-eyebrow">CleanTech bestelling</p>
            <h1 className="edit-sec-title mt-3">Winkelwagen</h1>
          </div>
          {!isEmpty && (
            <p className="text-sm text-[var(--bone-300)]">
              {itemCount} {itemCount === 1 ? 'artikel' : 'artikelen'} geselecteerd
            </p>
          )}
        </div>

        {isEmpty ? (
          <section className="ico-panel mx-auto flex max-w-xl flex-col items-center px-6 py-16 text-center">
            <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[rgba(250,246,241,0.035)] text-[var(--copper-300)]">
              <ShoppingBag className="h-8 w-8" aria-hidden="true" />
            </span>
            <h2 className="font-display text-3xl text-[var(--bone-000)]">Nog niets in je mandje</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--bone-300)]">
              Kies de producten die Rico & Nico zelf gebruiken voor hun afwerkingen, onderhoud en nabehandeling.
            </p>
            <Button as={Link} to="/shop" variant="primary" className="mt-7" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Naar de shop
            </Button>
          </section>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="space-y-4" aria-label="Producten in winkelwagen">
              {items.map((item) => (
                <article key={item.id} className="ico-panel grid gap-4 p-4 sm:grid-cols-[112px_1fr_auto]">
                  <Link
                    to={`/shop/${item.slug}`}
                    className="ico-media aspect-square overflow-hidden rounded-[var(--radius-lg)] bg-[rgba(250,246,241,0.04)]"
                    aria-label={`Bekijk ${item.name}`}
                  >
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-[var(--bone-400)]">
                        <ShoppingBag className="h-8 w-8" aria-hidden="true" />
                      </span>
                    )}
                  </Link>

                  <div className="min-w-0">
                    <p className="text-xs text-[var(--bone-400)]">{item.category || 'CleanTech'}</p>
                    <Link
                      to={`/shop/${item.slug}`}
                      className="mt-1 block font-display text-2xl leading-tight text-[var(--bone-000)] transition-colors hover:text-[var(--copper-200)]"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-2 font-display text-xl text-[var(--copper-200)]">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="mt-1 text-xs text-[var(--bone-400)]">{formatPrice(item.price)} per stuk</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`${item.name} verwijderen`}
                      className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--bone-300)] transition-colors hover:border-[rgba(217,138,114,0.45)] hover:text-[var(--copper-200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(216,158,140,0.45)]"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>

                    <div className="flex items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[rgba(250,246,241,0.035)]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Minder"
                        className="flex h-10 w-10 items-center justify-center text-[var(--bone-300)] transition-colors hover:text-[var(--copper-200)] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(216,158,140,0.45)]"
                      >
                        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <span className="w-9 text-center font-mono text-sm text-[var(--bone-000)]">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Meer"
                        className="flex h-10 w-10 items-center justify-center text-[var(--bone-300)] transition-colors hover:text-[var(--copper-200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(216,158,140,0.45)]"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Besteloverzicht">
              <div className="ico-panel p-6">
                <p className="edit-eyebrow">Overzicht</p>

                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between gap-6 text-[var(--bone-300)]">
                    <dt>Subtotaal</dt>
                    <dd>{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between gap-6 text-[var(--bone-300)]">
                    <dt>Verzending</dt>
                    <dd className={shippingCost === 0 ? 'text-[var(--signal-go)]' : undefined}>
                      {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-6 border-t border-[var(--color-border)] pt-4 font-display text-2xl text-[var(--bone-000)]">
                    <dt>Totaal</dt>
                    <dd>{formatPrice(total)}</dd>
                  </div>
                </dl>

                <div className="mt-6 rounded-[var(--radius-lg)] border border-[rgba(123,174,130,0.25)] bg-[rgba(123,174,130,0.08)] p-4">
                  <div className="flex items-start gap-3">
                    <Truck className="mt-0.5 h-4 w-4 text-[var(--signal-go)]" aria-hidden="true" />
                    <p className="text-sm leading-relaxed text-[var(--bone-200)]">
                      {amountUntilFreeShipping > 0
                        ? `Nog ${formatPrice(amountUntilFreeShipping)} tot gratis verzending.`
                        : 'Gratis verzending is actief voor deze bestelling.'}
                    </p>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[rgba(250,246,241,0.08)]">
                    <div
                      className="h-full rounded-full bg-[var(--signal-go)] transition-[width] duration-500"
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                </div>

                <Button as={Link} to="/shop/afrekenen" variant="primary" fullWidth className="mt-6" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Afrekenen
                </Button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
