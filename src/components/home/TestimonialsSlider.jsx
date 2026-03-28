import { useTranslation } from 'react-i18next'
import { useTestimonials } from '@/hooks/useTestimonials'
import Skeleton from '@/components/ui/Skeleton'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} van 5 sterren`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className="w-3.5 h-3.5"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
          style={{ color: i < rating ? 'var(--color-primary)' : 'rgba(196,130,111,0.2)' }}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial, lang }) {
  const content =
    lang === 'en' && testimonial.content_en
      ? testimonial.content_en
      : testimonial.content_nl

  return (
    <div
      className="relative flex flex-col h-full rounded-2xl p-7 overflow-hidden"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid rgba(196,130,111,0.2)',
      }}
    >
      {/* Decoratief aanhalingsteken achtergrond */}
      <div
        className="absolute top-4 right-5 select-none pointer-events-none"
        aria-hidden="true"
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: '7rem',
          lineHeight: 1,
          color: 'var(--color-primary)',
          opacity: 0.06,
        }}
      >
        "
      </div>

      {/* Sterren */}
      <div className="mb-4">
        <StarRating rating={testimonial.rating || 5} />
      </div>

      {/* Quote tekst */}
      <p
        className="text-sm leading-relaxed flex-1 mb-6 relative z-10"
        style={{ color: 'var(--color-text-secondary)', lineHeight: 1.75 }}
      >
        "{content}"
      </p>

      {/* Scheidingslijn */}
      <div
        className="w-8 mb-5"
        style={{ height: '1px', backgroundColor: 'rgba(196,130,111,0.3)' }}
        aria-hidden="true"
      />

      {/* Auteur */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(196,130,111,0.25) 0%, rgba(196,130,111,0.1) 100%)',
            color: 'var(--color-primary)',
            border: '1px solid rgba(196,130,111,0.3)',
          }}
          aria-hidden="true"
        >
          {testimonial.customer_name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            {testimonial.customer_name}
          </p>
          {testimonial.vehicle && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              {testimonial.vehicle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsSlider() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.slice(0, 2) || 'nl'
  const { testimonials, loading } = useTestimonials({ featuredOnly: true })

  return (
    <section
      className="section-padding"
      style={{ backgroundColor: 'var(--color-surface-elevated)' }}
      aria-labelledby="testimonials-title"
    >
      <div className="container-ico">

        {/* Header */}
        <div className="text-center mb-14">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--color-primary)' }}
          >
            Reviews
          </p>
          <h2
            id="testimonials-title"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: 'var(--color-text-primary)',
              letterSpacing: '0.03em',
            }}
          >
            {t('testimonials.title')}
          </h2>
          <div className="divider-gold mt-4 mb-4" aria-hidden="true" />
          <p className="max-w-md mx-auto text-sm" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-7"
                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid rgba(196,130,111,0.2)' }}
              >
                <Skeleton variant="line" width="80px" height="14px" className="mb-5 rounded" />
                <Skeleton variant="line" className="mb-2" />
                <Skeleton variant="line" className="mb-2" />
                <Skeleton variant="line" width="70%" className="mb-6" />
                <div className="flex items-center gap-3 mt-6">
                  <Skeleton variant="circle" width="40px" height="40px" />
                  <div className="flex-1">
                    <Skeleton variant="line" width="55%" className="mb-1.5" />
                    <Skeleton variant="line" width="35%" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} lang={lang} />
              ))}
            </div>

            {/* Mobile — horizontaal scroll */}
            <div
              className="md:hidden -mx-4 overflow-x-auto snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', scrollPaddingInline: '1.5rem' }}
            >
              <div className="flex gap-4 px-4" role="list" aria-label="Klantenreviews">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="snap-start flex-shrink-0 w-[calc(100vw-3rem)]"
                    role="listitem"
                  >
                    <TestimonialCard testimonial={testimonial} lang={lang} />
                  </div>
                ))}
                <div className="flex-shrink-0 w-1" aria-hidden="true" />
              </div>
            </div>
          </>
        )}

        {/* Onderste badge */}
        <div className="flex justify-center mt-10">
          <div
            className="inline-flex items-center gap-3 px-5 py-3 rounded-full text-sm"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid rgba(196,130,111,0.2)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <div className="flex items-center gap-0.5" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--color-primary)' }}>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span>
              <strong style={{ color: 'var(--color-text-primary)' }}>5.0</strong> · 100+ tevreden klanten in heel Vlaanderen
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}
