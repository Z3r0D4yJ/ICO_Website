import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Calendar, Phone, ArrowRight } from '@/lib/icons'
import { whatsappLink } from '@/lib/utils'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import Button from '@/components/ui/Button'

export default function BookingConfirmation() {
  const [searchParams] = useSearchParams()
  const bookingNumber = searchParams.get('nummer')

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
            <CheckCircle2
              className="w-10 h-10"
              style={{ color: 'var(--color-success)' }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Titel */}
        <h1
          className="mb-3"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            color: 'var(--color-text-primary)',
            letterSpacing: '0.03em',
          }}
        >
          BOEKING ONTVANGEN!
        </h1>

        <p className="text-base mb-6" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
          Bedankt voor uw boeking. Wij nemen zo snel mogelijk contact met u op ter bevestiging.
        </p>

        {/* Boekingsnummer */}
        {bookingNumber && (
          <div
            className="inline-flex flex-col items-center px-8 py-4 rounded-xl mb-8"
            style={{
              backgroundColor: 'rgba(196,130,111,0.08)',
              border: '1px solid rgba(196,130,111,0.3)',
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-primary)' }}>
              Uw boekingsnummer
            </p>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.75rem',
                color: 'var(--color-primary)',
                letterSpacing: '0.1em',
              }}
            >
              {bookingNumber}
            </p>
          </div>
        )}

        {/* Info blokjes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
          <div
            className="flex gap-3 p-4 rounded-xl"
            style={{
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid rgba(196,130,111,0.2)',
            }}
          >
            <Calendar
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: 'var(--color-primary)' }}
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--color-text-primary)' }}>
                Bevestiging
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                U ontvangt een bevestiging per e-mail zodra uw boeking goedgekeurd is.
              </p>
            </div>
          </div>

          <div
            className="flex gap-3 p-4 rounded-xl"
            style={{
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid rgba(196,130,111,0.2)',
            }}
          >
            <Phone
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: 'var(--color-primary)' }}
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--color-text-primary)' }}>
                Vragen?
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Contacteer ons via WhatsApp of telefoon. Wij helpen u graag verder.
              </p>
            </div>
          </div>
        </div>

        {/* Actieknoppen */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            as="a"
            href={whatsappLink(WHATSAPP_NUMBER, `Vraag over boeking ${bookingNumber || ''}`)}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="lg"
          >
            Contact via WhatsApp
          </Button>

          <Button
            as={Link}
            to="/"
            variant="ghost"
            size="lg"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Terug naar home
          </Button>
        </div>

      </div>
    </div>
  )
}
