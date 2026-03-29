import { Link } from 'react-router-dom'
import { Car, ChevronDown } from '@/lib/icons'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      aria-label="Hero sectie"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      {/* ═══════════════════════════════════════════
          DESKTOP: bestaande diagonale split layout
          ═══════════════════════════════════════════ */}

      {/* Subtiel grid patroon */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, var(--color-primary) 0, var(--color-primary) 1px, transparent 1px, transparent 72px),' +
            'repeating-linear-gradient(90deg, var(--color-primary) 0, var(--color-primary) 1px, transparent 1px, transparent 72px)',
        }}
      />

      {/* Gouden radiale gloed linksonder */}
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none opacity-[0.07]"
        aria-hidden="true"
        style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }}
      />

      {/* Auto foto — diagonale split, alleen desktop */}
      <div
        className="absolute inset-y-0 right-0 w-[42%] pointer-events-none hidden lg:block"
        aria-hidden="true"
        style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)' }}
      >
        <img
          src="/images/rico&nico.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, var(--color-surface) 0%, transparent 12%, transparent 88%, var(--color-surface) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to left, var(--color-surface) 0%, transparent 15%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            background: 'radial-gradient(ellipse at 70% 60%, rgba(196,130,111,0.5) 0%, transparent 55%)',
          }}
        />
      </div>

      {/* Diagonale accentlijn — alleen desktop */}
      <div
        className="absolute inset-y-0 hidden lg:block pointer-events-none"
        aria-hidden="true"
        style={{
          right: 'calc(42% - 2px)',
          width: '2px',
          background: 'linear-gradient(to bottom, transparent 0%, var(--color-primary) 30%, rgba(196,130,111,0.4) 70%, transparent 100%)',
          opacity: 0.5,
          transform: 'skewX(-6deg)',
          transformOrigin: 'top',
        }}
      />

      {/* ═══════════════════════════════════════════
          MOBIEL: foto bovenaan, content eronder
          ═══════════════════════════════════════════ */}

      {/* Mobiele foto sectie — bovenste ~40vh */}
      <div
        className="relative lg:hidden flex-shrink-0"
        style={{ height: '32vh', minHeight: '200px' }}
        aria-hidden="true"
      >
        <img
          src="/images/rico&nico.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        {/* Zachte fade naar surface kleur onderaan */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, transparent 40%, var(--color-surface) 100%)',
          }}
        />
        {/* Subtiele gouden tint */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse at 50% 40%, rgba(196,130,111,0.4) 0%, transparent 60%)',
          }}
        />
        {/* Lichte vignette bovenaan */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(15,15,26,0.3) 0%, transparent 30%)',
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════
          CONTENT — desktop: gecentreerd, mobiel: onder foto
          ═══════════════════════════════════════════ */}
      <div className="relative z-10 flex-1 flex flex-col justify-center lg:min-h-screen">
        <div className="container-ico py-8 sm:py-12 md:py-20 lg:py-32">
          <div className="max-w-[640px]">

            {/* Badge */}
            <div className="mb-4 sm:mb-6">
              <Badge variant="primary">
                <Car className="w-3 h-3" aria-hidden="true" />
                {t('hero.badge')}
              </Badge>
            </div>

            {/* Headline */}
            <h1
              className="mb-4 sm:mb-6"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
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
              className="text-base md:text-lg mb-8 sm:mb-10"
              style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: '44ch' }}
            >
              {t('hero.subtitle')}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8 sm:mb-12">
              <Button
                as={Link}
                to="/boeken"
                variant="primary"
                size="lg"
                leftIcon={<Car className="w-4 h-4" />}
                className="w-full sm:w-auto justify-center"
              >
                {t('hero.cta_book')}
              </Button>
              <Button
                as={Link}
                to="/diensten"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto justify-center"
              >
                {t('hero.cta_services')}
              </Button>
            </div>

            {/* Scheidingslijn */}
            <div
              className="w-12 mb-6 sm:mb-8"
              style={{ height: '1px', backgroundColor: 'rgba(196,130,111,0.3)' }}
              aria-hidden="true"
            />

            {/* Social proof */}
            <div className="flex items-center gap-4">
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
                <div className="flex items-center gap-0.5 mb-0.5" aria-hidden="true">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--color-primary)' }}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  100+ tevreden klanten in heel Vlaanderen
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Scroll indicator — alleen desktop */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden lg:block"
        aria-hidden="true"
      >
        <ChevronDown className="w-6 h-6" style={{ color: 'var(--color-text-muted)' }} />
      </div>
    </section>
  )
}
