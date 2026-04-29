import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Lock, ShoppingBag, Truck } from '@/lib/icons'
import { useCartStore } from '@/stores/cartStore'
import { useUiStore } from '@/stores/uiStore'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants'
import { checkoutSchema } from '@/lib/validators'
import { formatPrice } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, subtotal, shippingCost, total, isEmpty, clearCart } = useCartStore()
  const showError = useUiStore((s) => s.showError)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(checkoutSchema) })

  if (isEmpty) {
    return (
      <main className="section-padding bg-[var(--color-surface)]">
        <section className="container-ico">
          <div className="ico-panel mx-auto flex max-w-xl flex-col items-center px-6 py-16 text-center">
            <ShoppingBag className="mb-5 h-12 w-12 text-[var(--bone-400)]" aria-hidden="true" />
            <h1 className="font-display text-3xl text-[var(--bone-000)]">Je winkelwagen is leeg</h1>
            <p className="mt-3 text-sm text-[var(--bone-300)]">Voeg eerst een CleanTech product toe voor je afrekent.</p>
            <Button as={Link} to="/shop" variant="primary" className="mt-7">
              Naar de shop
            </Button>
          </div>
        </section>
      </main>
    )
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const { supabase } = await import('@/config/supabase')
      const orderNumber = `ICO-ORDER-${Date.now()}`

      const { error } = await supabase.from('orders').insert({
        order_number: orderNumber,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone || null,
        shipping_address: data.shipping_address,
        shipping_city: data.shipping_city,
        shipping_postal_code: data.shipping_postal_code,
        shipping_country: 'BE',
        items: items.map((i) => ({ product_id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
        subtotal,
        shipping_cost: shippingCost,
        total,
        status: 'pending',
      })

      if (error) throw error

      clearCart()
      navigate(`/shop/bevestiging?nummer=${orderNumber}`)
    } catch (err) {
      console.error('Checkout error:', err)
      showError('Er ging iets mis. Probeer opnieuw.')
      setSubmitting(false)
    }
  }

  return (
    <main className="section-padding bg-[var(--color-surface)]">
      <div className="container-ico">
        <Link
          to="/shop/winkelwagen"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--bone-300)] transition-colors hover:text-[var(--copper-200)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Terug naar winkelwagen
        </Link>

        <div className="mb-10 border-b border-[var(--color-border)] pb-8">
          <p className="edit-eyebrow">Veilig afronden</p>
          <h1 className="edit-sec-title mt-3">Afrekenen</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--bone-300)]">
            Vul je gegevens rustig in. Rico & Nico zorgen dat je bestelling netjes wordt klaargemaakt en verzonden.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <section className="ico-panel p-5 sm:p-6">
              <p className="edit-eyebrow">1. Contact</p>
              <div className="mt-5 space-y-4">
                <Input
                  label="Naam *"
                  placeholder="Jan Janssen"
                  error={errors.customer_name?.message}
                  {...register('customer_name')}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="E-mailadres *"
                    type="email"
                    placeholder="jan@voorbeeld.be"
                    error={errors.customer_email?.message}
                    {...register('customer_email')}
                  />
                  <Input
                    label="Telefoon"
                    type="tel"
                    placeholder="0495 123 456"
                    error={errors.customer_phone?.message}
                    {...register('customer_phone')}
                  />
                </div>
              </div>
            </section>

            <section className="ico-panel p-5 sm:p-6">
              <p className="edit-eyebrow">2. Levering</p>
              <div className="mt-5 space-y-4">
                <Input
                  label="Straat en huisnummer *"
                  placeholder="Hoofdstraat 1"
                  error={errors.shipping_address?.message}
                  {...register('shipping_address')}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Gemeente *"
                    placeholder="Gent"
                    error={errors.shipping_city?.message}
                    {...register('shipping_city')}
                  />
                  <Input
                    label="Postcode *"
                    placeholder="9000"
                    maxLength={4}
                    error={errors.shipping_postal_code?.message}
                    {...register('shipping_postal_code')}
                  />
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-[var(--radius-lg)] border border-[rgba(123,174,130,0.25)] bg-[rgba(123,174,130,0.08)] p-4 text-sm text-[var(--bone-200)]">
                <Truck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--signal-go)]" aria-hidden="true" />
                <p>
                  {shippingCost === 0
                    ? 'Gratis verzending is actief.'
                    : `Verzendkosten: ${formatPrice(shippingCost)}. Gratis vanaf ${formatPrice(FREE_SHIPPING_THRESHOLD)}.`}
                </p>
              </div>
            </section>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={submitting}
              disabled={submitting}
              leftIcon={<Lock className="h-4 w-4" />}
            >
              Bestelling plaatsen
            </Button>

            <p className="text-center text-xs text-[var(--bone-400)]">
              Betaling via Mollie wordt in een volgende stap geactiveerd. Je bestelling wordt nu al correct geregistreerd.
            </p>
          </form>

          <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Besteloverzicht">
            <div className="ico-panel p-6">
              <p className="edit-eyebrow">Jouw bestelling</p>

              <ul className="mt-6 space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="grid grid-cols-[56px_1fr_auto] gap-3">
                    <div className="ico-media h-14 w-14 overflow-hidden rounded-[var(--radius-md)] bg-[rgba(250,246,241,0.04)]">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-[var(--bone-400)]">
                          <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--bone-000)]">{item.name}</p>
                      <p className="mt-1 text-xs text-[var(--bone-400)]">
                        {item.quantity} x {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-display text-lg text-[var(--copper-200)]">{formatPrice(item.price * item.quantity)}</p>
                  </li>
                ))}
              </ul>

              <dl className="mt-6 space-y-3 border-t border-[var(--color-border)] pt-5 text-sm">
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
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
