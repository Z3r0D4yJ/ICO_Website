import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ShoppingBag, Lock, Truck } from '@/lib/icons'
import { useCartStore } from '@/stores/cartStore'
import { useUiStore } from '@/stores/uiStore'
import { checkoutSchema } from '@/lib/validators'
import { formatPrice } from '@/lib/utils'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

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

  // Lege wagen → terug naar shop
  if (isEmpty) {
    return (
      <div className="section-padding flex flex-col items-center justify-center text-center" style={{ backgroundColor: 'var(--color-surface)', minHeight: '70vh' }}>
        <ShoppingBag className="w-12 h-12 mb-4" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
        <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>Winkelwagen is leeg</p>
        <Button as={Link} to="/shop" variant="primary" className="mt-4">Naar de shop</Button>
      </div>
    )
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      // Stap 11: Mollie betaling integratie
      // Voorlopig: order opslaan in Supabase + bevestigingspagina tonen
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
    } catch {
      showError('Er ging iets mis. Probeer opnieuw.')
      setSubmitting(false)
    }
  }

  return (
    <div className="section-padding" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="container-ico max-w-4xl">

        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/shop/winkelwagen"
            className="flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70 cursor-pointer"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Terug naar winkelwagen
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
          AFREKENEN
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Formulier */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="lg:col-span-2 space-y-6">

            {/* Persoonlijke gegevens */}
            <section
              className="rounded-xl p-5 space-y-4"
              style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                Persoonlijke gegevens
              </h2>

              <Input
                label="Naam *"
                placeholder="Jan Janssen"
                error={errors.customer_name?.message}
                {...register('customer_name')}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="E-mailadres *"
                  type="email"
                  placeholder="jan@voorbeeld.be"
                  error={errors.customer_email?.message}
                  {...register('customer_email')}
                />
                <Input
                  label="Telefoon (optioneel)"
                  type="tel"
                  placeholder="0495 123 456"
                  error={errors.customer_phone?.message}
                  {...register('customer_phone')}
                />
              </div>
            </section>

            {/* Leveringsadres */}
            <section
              className="rounded-xl p-5 space-y-4"
              style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                Leveringsadres
              </h2>

              <Input
                label="Straat en huisnummer *"
                placeholder="Hoofdstraat 1"
                error={errors.shipping_address?.message}
                {...register('shipping_address')}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <Truck className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
                {shippingCost === 0
                  ? 'Gratis verzending van toepassing'
                  : `Verzendkosten: ${formatPrice(shippingCost)}`}
              </div>
            </section>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={submitting}
              disabled={submitting}
              leftIcon={<Lock className="w-4 h-4" />}
            >
              Bestelling plaatsen
            </Button>

            <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
              Betaling via Mollie wordt geactiveerd in een volgende stap.
            </p>
          </form>

          {/* Order samenvatting */}
          <aside className="lg:col-span-1">
            <div
              className="rounded-xl p-5 space-y-4 sticky top-24"
              style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                Jouw bestelling
              </h2>

              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex-shrink-0 overflow-hidden"
                      style={{ backgroundColor: 'var(--color-surface-overlay)' }}
                    >
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                        {item.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold flex-shrink-0" style={{ color: 'var(--color-primary)' }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="border-t pt-4 space-y-2" style={{ borderColor: 'rgba(196,130,111,0.15)' }}>
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
                <div className="flex justify-between font-semibold border-t pt-2" style={{ borderColor: 'rgba(196,130,111,0.15)', color: 'var(--color-text-primary)' }}>
                  <span>Totaal</span>
                  <span style={{ color: 'var(--color-primary)' }}>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
