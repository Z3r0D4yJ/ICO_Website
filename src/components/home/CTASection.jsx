import { Link } from 'react-router-dom'
import { whatsappLink } from '@/lib/utils'
import { WHATSAPP_NUMBER } from '@/lib/constants'

export default function CTASection() {
  return (
    <section
      aria-labelledby="cta-title"
      className="relative overflow-hidden"
      style={{
        backgroundColor: 'var(--ink-050)',
        padding: '128px 0',
        borderTop: '1px solid var(--ink-300)',
      }}
    >
      {/* Copper bloom — bottom-center */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(184,111,92,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="container-ico relative z-10">
        <div
          className="relative overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse 60% 100% at 90% 0%, rgba(184,111,92,0.10) 0%, transparent 60%), var(--ink-100)',
            border: '1px solid var(--ink-400)',
            borderRadius: 24,
            padding: 'clamp(48px, 6vw, 96px) clamp(32px, 5vw, 80px)',
          }}
        >
          {/* Eyebrow */}
          <p className="edit-eyebrow mb-8">Boek je afspraak</p>

          <h2
            id="cta-title"
            style={{
              fontFamily: 'var(--font-fraunces)',
              fontWeight: 300,
              fontSize: 'clamp(48px, 7vw, 96px)',
              lineHeight: 0.95,
              letterSpacing: '-0.035em',
              color: 'var(--bone-000)',
              margin: 0,
              maxWidth: '14ch',
              textWrap: 'balance',
            }}
          >
            Klaar voor twee uur{' '}
            <em
              style={{
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'var(--copper-200)',
              }}
            >
              echt vakwerk?
            </em>
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-geist)',
              fontSize: 'clamp(16px, 1.6vw, 19px)',
              lineHeight: 1.5,
              color: 'var(--bone-200)',
              margin: '32px 0 40px',
              maxWidth: '52ch',
            }}
          >
            Kies een datum, vul je adres in, wij komen langs. Geen verplichtingen.
            Gratis annuleren tot 24 uur op voorhand. Betaling ter plaatse of online.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/boeken" className="edit-btn edit-btn-primary edit-btn-lg">
              Boek nu — kies een datum
              <span className="edit-arrow" aria-hidden="true" />
            </Link>
            <a
              href={whatsappLink(
                WHATSAPP_NUMBER,
                'Hallo! Ik wil graag een afspraak maken voor een DetailWash.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="edit-btn edit-btn-secondary edit-btn-lg"
            >
              Of stuur een WhatsApp
            </a>
          </div>

          {/* Bottom rule with reassurance */}
          <div
            className="mt-12 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
            style={{ borderTop: '1px solid var(--ink-400)' }}
          >
            {[
              ['Geen verplichtingen', 'vrijblijvende offerte'],
              ['Gratis annulatie', 'tot 24u op voorhand'],
              ['Betaling op maat', 'ter plaatse of online'],
            ].map(([title, sub]) => (
              <div key={title} className="flex flex-col gap-1">
                <span
                  style={{
                    fontFamily: 'var(--font-geist)',
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'var(--bone-000)',
                  }}
                >
                  {title}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: 'var(--bone-300)',
                  }}
                >
                  — {sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
