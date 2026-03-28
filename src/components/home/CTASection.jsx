import { Link } from 'react-router-dom'
import { Car, MessageCircle } from '@/lib/icons'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import { whatsappLink } from '@/lib/utils'
import { WHATSAPP_NUMBER } from '@/lib/constants'

export default function CTASection() {
  const { t } = useTranslation()

  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-surface)' }}
      aria-labelledby="cta-title"
    >
      {/* Achtergrond glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(196,130,111,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="container-ico relative z-10">
        <div
          className="rounded-2xl px-8 py-14 md:px-16 md:py-20 text-center"
          style={{
            background:
              'linear-gradient(135deg, rgba(196,130,111,0.1) 0%, rgba(196,130,111,0.04) 100%)',
            border: '1px solid rgba(196,130,111,0.25)',
          }}
        >
          {/* Label */}
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-4"
            style={{ color: 'var(--color-primary)' }}
          >
            Klaar om te starten?
          </p>

          {/* Headline */}
          <h2
            id="cta-title"
            className="mb-5"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 6vw, 3.75rem)',
              color: 'var(--color-text-primary)',
              letterSpacing: '0.03em',
              lineHeight: 1.05,
            }}
          >
            UW VOERTUIG VERDIENT{' '}
            <span className="text-gradient-gold">HET BESTE</span>
          </h2>

          <p
            className="text-base md:text-lg mb-10 max-w-xl mx-auto"
            style={{ color: 'var(--color-text-secondary)', lineHeight: 1.65 }}
          >
            Maak een afspraak en onze Washbus staat binnen 24 uur bij u voor de deur.
            Regio Vlaanderen — altijd en overal.
          </p>

          {/* Knoppen */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as={Link}
              to="/boeken"
              variant="primary"
              size="lg"
              leftIcon={<Car className="w-4 h-4" />}
            >
              {t('common.bookNow')}
            </Button>
            <Button
              as="a"
              href={whatsappLink(WHATSAPP_NUMBER, 'Hallo! Ik wil graag een afspraak maken voor een DetailWash.')}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="lg"
              leftIcon={<MessageCircle className="w-4 h-4" />}
            >
              {t('common.whatsapp')}
            </Button>
          </div>

          {/* Geruststellende tekst */}
          <p className="mt-8 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Geen verplichtingen · Gratis annuleren tot 24u op voorhand · Betaling ter plaatse of online
          </p>
        </div>
      </div>
    </section>
  )
}
