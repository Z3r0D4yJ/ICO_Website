import { Link } from 'react-router-dom'
import { Car, ChevronDown, MessageCircle } from '@/lib/icons'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { whatsappLink } from '@/lib/utils'
import { WHATSAPP_NUMBER } from '@/lib/constants'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero sectie"
      style={{ background: 'linear-gradient(150deg, var(--color-surface) 0%, var(--color-secondary) 60%, var(--color-surface) 100%)' }}
    >
      {/* Subtiel grid patroon */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, var(--color-primary) 0, var(--color-primary) 1px, transparent 1px, transparent 72px),' +
            'repeating-linear-gradient(90deg, var(--color-primary) 0, var(--color-primary) 1px, transparent 1px, transparent 72px)',
        }}
      />

      {/* Hero car photo — rechts, alleen desktop */}
      <div
        className="absolute inset-y-0 right-0 w-1/2 pointer-events-none hidden lg:block"
        aria-hidden="true"
      >
        <img
          src="/images/porsche-taycan-zonsondergang.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Links fade naar donkere achtergrond */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, var(--color-surface) 0%, rgba(17,16,16,0.5) 40%, rgba(17,16,16,0.2) 100%)' }}
        />
        {/* Boven en onder fade */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, var(--color-surface) 0%, transparent 15%, transparent 85%, var(--color-surface) 100%)' }}
        />
        {/* Subtiele gouden tint */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(196,130,111,0.4) 0%, transparent 60%)' }}
        />
      </div>

      {/* Gouden glow rechtsboven */}
      <div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none opacity-10 hidden lg:block"
        aria-hidden="true"
        style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }}
      />

      <div className="container-ico relative z-10 py-24 md:py-32">
        <div className="max-w-3xl lg:max-w-xl xl:max-w-2xl">

          {/* Badge */}
          <div className="mb-6 animate-fade-in">
            <Badge variant="primary">
              <Car className="w-3 h-3" aria-hidden="true" />
              {t('hero.badge')}
            </Badge>
          </div>

          {/* Headline */}
          <h1
            className="mb-6 animate-slide-up"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.25rem, 9vw, 6.5rem)',
              lineHeight: 1.0,
              letterSpacing: '0.03em',
              color: 'var(--color-text-primary)',
            }}
          >
            {t('hero.tagline').split(' ').slice(0, 1).join(' ')}{' '}
            <span className="text-gradient-gold">
              {t('hero.tagline').split(' ').slice(1, 2).join(' ')}
            </span>
            <br />
            {t('hero.tagline').split(' ').slice(2, 4).join(' ')}{' '}
            <span style={{ color: 'var(--color-primary)' }}>
              {t('hero.tagline').split(' ').slice(4).join(' ')}
            </span>
          </h1>

          {/* Subtitel */}
          <p
            className="text-lg md:text-xl mb-10 max-w-xl animate-slide-up"
            style={{ color: 'var(--color-text-secondary)', lineHeight: 1.65 }}
          >
            {t('hero.subtitle')}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 animate-slide-up">
            <Button
              as={Link}
              to="/boeken"
              variant="primary"
              size="lg"
              leftIcon={<Car className="w-4 h-4" />}
            >
              {t('hero.cta_book')}
            </Button>
            <Button
              as={Link}
              to="/diensten"
              variant="secondary"
              size="lg"
            >
              {t('hero.cta_services')}
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-6 mt-12 animate-fade-in">
            <div className="flex -space-x-2" aria-hidden="true">
              {['T', 'S', 'K'].map((initial) => (
                <div
                  key={initial}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2"
                  style={{
                    backgroundColor: 'var(--color-surface-overlay)',
                    borderColor: 'var(--color-surface)',
                    color: 'var(--color-primary)',
                  }}
                >
                  {initial}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" style={{ color: 'var(--color-primary)' }}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Vertrouwd door klanten in heel Vlaanderen
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        aria-hidden="true"
      >
        <ChevronDown className="w-6 h-6" style={{ color: 'var(--color-text-muted)' }} />
      </div>
    </section>
  )
}
