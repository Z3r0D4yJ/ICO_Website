import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Package, ArrowRight } from '@/lib/icons'
import Button from '@/components/ui/Button'

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams()
  const orderNumber = searchParams.get('nummer')

  return (
    <div
      className="section-padding flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-surface)', minHeight: '80vh' }}
    >
      <div className="container-ico max-w-lg text-center">

        {/* Success icoon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(34,197,94,0.12)',
              border: '2px solid var(--color-success)',
            }}
          >
            <CheckCircle2 className="w-10 h-10" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
          </div>
        </div>

        <h1
          className="mb-3"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            color: 'var(--color-text-primary)',
            letterSpacing: '0.03em',
          }}
        >
          BESTELLING GEPLAATST!
        </h1>

        <p className="text-base mb-6" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
          Bedankt voor je bestelling. Je ontvangt een bevestiging per e-mail zodra de betaling verwerkt is.
        </p>

        {orderNumber && (
          <div
            className="inline-flex flex-col items-center px-8 py-4 rounded-xl mb-8"
            style={{
              backgroundColor: 'rgba(196,130,111,0.08)',
              border: '1px solid rgba(196,130,111,0.3)',
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-primary)' }}>
              Bestelnummer
            </p>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                color: 'var(--color-primary)',
                letterSpacing: '0.08em',
              }}
            >
              {orderNumber}
            </p>
          </div>
        )}

        <div
          className="flex gap-3 p-4 rounded-xl mb-8 text-left"
          style={{
            backgroundColor: 'var(--color-surface-elevated)',
            border: '1px solid rgba(196,130,111,0.2)',
          }}
        >
          <Package className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--color-text-primary)' }}>
              Wat nu?
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Je bestelling wordt verwerkt en zo snel mogelijk verzonden. Bij vragen kan je ons altijd contacteren via WhatsApp.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button as={Link} to="/shop" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Verder winkelen
          </Button>
          <Button as={Link} to="/" variant="ghost">
            Terug naar home
          </Button>
        </div>
      </div>
    </div>
  )
}
