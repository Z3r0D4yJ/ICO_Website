import { cn } from '@/lib/utils'

export default function PageHero({
  label,
  eyebrow,
  title,
  titleAccent,
  subtitle,
  children,
  align = 'center',
  size = 'md',
  image,
  imageAlt = '',
  variant = 'default',
  className,
}) {
  const sizes = {
    sm: 'py-12 md:py-16',
    md: 'py-16 md:py-24',
    lg: 'py-20 md:py-32',
  }

  const isCenter = align === 'center'
  const heroLabel = eyebrow || label

  return (
    <section
      className={cn(
        'relative overflow-hidden border-b border-[var(--ink-300)]',
        sizes[size] || sizes.md,
        variant === 'compact' && 'py-12 md:py-16',
        className
      )}
      style={{ backgroundColor: 'var(--ink-050)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 82% 20%, rgba(184,111,92,0.13) 0%, transparent 62%), radial-gradient(ellipse 55% 70% at 8% 100%, rgba(106,46,34,0.22) 0%, transparent 60%)',
        }}
      />

      {image && (
        <div className="absolute inset-y-0 right-0 hidden lg:block w-[46%]" aria-hidden={imageAlt ? undefined : true}>
          <img src={image} alt={imageAlt} className="absolute inset-0 w-full h-full object-cover" loading="eager" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, var(--ink-050) 0%, rgba(14,12,11,0.72) 22%, transparent 58%), linear-gradient(to bottom, var(--ink-050) 0%, transparent 18%, var(--ink-050) 100%)',
            }}
          />
        </div>
      )}

      <div className="container-ico relative z-10">
        <div
          className={cn(
            'max-w-3xl',
            isCenter && !image ? 'mx-auto text-center' : 'text-left'
          )}
        >
          {heroLabel && (
            <p className={cn('edit-eyebrow mb-6', isCenter && !image && 'justify-center')}>
              {heroLabel}
            </p>
          )}

          <h1 className="font-display text-[2.75rem] md:text-[4.5rem] leading-none text-[var(--bone-000)]">
            {title}
            {titleAccent && (
              <>
                {' '}
                <em className="not-italic text-[var(--copper-200)]">{titleAccent}</em>
              </>
            )}
          </h1>

          {subtitle && (
            <p className={cn('ico-lede mt-6', isCenter && !image && 'mx-auto')}>
              {subtitle}
            </p>
          )}

          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  )
}
