import { cn } from '@/lib/utils'

/**
 * Korte pagina-hero — voor alle interne pagina's (niet fullscreen zoals homepage).
 * Gebruik op: Diensten, Shop, Blog, Over Ons, Contact, FAQ, ...
 *
 * @param {string} label - Klein label boven de titel (optioneel)
 * @param {string} title - Hoofdtitel (Bebas Neue)
 * @param {string} titleAccent - Deel van de titel in goud (optioneel, wordt achter title geplaatst)
 * @param {string} subtitle - Beschrijving onder de titel
 * @param {React.ReactNode} children - Extra content (badges, knoppen, ...)
 * @param {'center'|'left'} align
 * @param {'sm'|'md'|'lg'} size
 */
export default function PageHero({
  label,
  title,
  titleAccent,
  subtitle,
  children,
  align = 'center',
  size = 'md',
  className,
}) {
  const sizes = {
    sm: 'py-12 md:py-16',
    md: 'py-14 md:py-20',
    lg: 'py-16 md:py-24',
  }

  const alignClass = align === 'center' ? 'text-center' : 'text-left'
  const maxWidthClass = align === 'center' ? 'mx-auto' : ''

  return (
    <section
      className={cn('relative overflow-hidden', sizes[size], className)}
      style={{
        background: 'linear-gradient(180deg, var(--color-secondary) 0%, var(--color-surface) 100%)',
        borderBottom: '1px solid rgba(196,130,111,0.2)',
      }}
    >
      {/* Subtiele grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, var(--color-primary) 0, var(--color-primary) 1px, transparent 1px, transparent 64px),' +
            'repeating-linear-gradient(90deg, var(--color-primary) 0, var(--color-primary) 1px, transparent 1px, transparent 64px)',
        }}
      />

      <div className="container-ico relative z-10">
        <div className={cn('max-w-2xl', alignClass, maxWidthClass)}>
          {label && (
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--color-primary)' }}
            >
              {label}
            </p>
          )}

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.25rem, 6vw, 4rem)',
              color: 'var(--color-text-primary)',
              letterSpacing: '0.03em',
              lineHeight: 1.05,
            }}
          >
            {title}
            {titleAccent && (
              <>
                {' '}
                <span style={{ color: 'var(--color-primary)' }}>{titleAccent}</span>
              </>
            )}
          </h1>

          {subtitle && (
            <p
              className="mt-4 text-base md:text-lg"
              style={{ color: 'var(--color-text-secondary)', lineHeight: 1.65 }}
            >
              {subtitle}
            </p>
          )}

          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
    </section>
  )
}
