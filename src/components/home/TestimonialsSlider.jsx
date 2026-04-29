import { useTestimonials } from '@/hooks/useTestimonials'
import { useTranslation } from 'react-i18next'

function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('')
}

function TestimonialCard({ testimonial, lang }) {
  const content =
    lang === 'en' && testimonial.content_en ? testimonial.content_en : testimonial.content_nl

  return (
    <article
      className="relative flex flex-col h-full"
      style={{
        background: 'var(--ink-100)',
        border: '1px solid var(--ink-400)',
        borderRadius: 14,
        padding: 32,
      }}
    >
      {/* Big copper quote glyph */}
      <div
        aria-hidden="true"
        style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: 80,
          lineHeight: 0.6,
          color: 'var(--copper-700)',
          height: 32,
          letterSpacing: 0,
          marginBottom: 16,
        }}
      >
        “
      </div>

      <blockquote
        style={{
          fontFamily: 'var(--font-fraunces)',
          fontWeight: 300,
          fontStyle: 'italic',
          fontSize: 22,
          lineHeight: 1.35,
          color: 'var(--bone-000)',
          margin: 0,
          letterSpacing: 0,
          textWrap: 'pretty',
        }}
      >
        {content}
      </blockquote>

      {/* Author */}
      <footer
        className="grid items-center gap-3 mt-auto pt-5"
        style={{
          gridTemplateColumns: '36px 1fr',
          borderTop: '1px solid var(--ink-400)',
          marginTop: 24,
        }}
      >
        <div
          aria-hidden="true"
          className="rounded-full flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            background: 'var(--ink-300)',
            border: '1px solid var(--copper-700)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--copper-200)',
          }}
        >
          {initials(testimonial.customer_name)}
        </div>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-geist)',
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--bone-000)',
            }}
          >
            {testimonial.customer_name}
          </div>
          {testimonial.vehicle && (
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--bone-300)',
              }}
            >
              {testimonial.vehicle}
            </div>
          )}
        </div>
      </footer>
    </article>
  )
}

function SkeletonCard() {
  return (
    <div
      style={{
        background: 'var(--ink-100)',
        border: '1px solid var(--ink-400)',
        borderRadius: 14,
        padding: 32,
        height: 280,
      }}
    >
      <div style={{ height: 16, width: 32, background: 'var(--ink-300)', marginBottom: 24 }} />
      <div style={{ height: 14, width: '90%', background: 'var(--ink-300)', marginBottom: 8 }} />
      <div style={{ height: 14, width: '80%', background: 'var(--ink-300)', marginBottom: 8 }} />
      <div style={{ height: 14, width: '60%', background: 'var(--ink-300)', marginBottom: 24 }} />
      <div style={{ height: 36, width: 120, background: 'var(--ink-300)' }} />
    </div>
  )
}

export default function TestimonialsSlider() {
  const { i18n } = useTranslation()
  const lang = i18n.language?.slice(0, 2) || 'nl'
  const { testimonials, loading } = useTestimonials({ featuredOnly: true })

  return (
    <section
      aria-labelledby="testimonials-title"
      style={{
        backgroundColor: 'var(--ink-050)',
        padding: '128px 0',
        borderTop: '1px solid var(--ink-300)',
      }}
    >
      <div className="container-ico">
        {/* Section head */}
        <header
          className="grid gap-6 md:gap-10 mb-12 pb-4"
          style={{
            gridTemplateColumns: '80px 1fr',
            borderBottom: '1px solid var(--ink-300)',
            alignItems: 'baseline',
          }}
        >
          <div className="edit-sec-num" style={{ paddingTop: 12 }}>
            03 / Stem
          </div>
          <div>
            <h2 id="testimonials-title" className="edit-sec-title">
              Wat klanten <em>zeggen</em>
            </h2>
            <p className="edit-sec-sub">
              Geen sterren, geen formulier — wel echte woorden van mensen die ons twee uur
              op hun oprit hebben laten werken.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* Desktop grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((t) => (
                <TestimonialCard key={t.id} testimonial={t} lang={lang} />
              ))}
            </div>

            {/* Mobile — horizontal snap */}
            <div
              className="md:hidden -mx-4 overflow-x-auto snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', scrollPaddingInline: '1.5rem' }}
            >
              <div className="flex gap-4 px-4" role="list" aria-label="Klantenreviews">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="snap-start flex-shrink-0 w-[calc(100vw-3rem)]"
                    role="listitem"
                  >
                    <TestimonialCard testimonial={t} lang={lang} />
                  </div>
                ))}
                <div className="flex-shrink-0 w-1" aria-hidden="true" />
              </div>
            </div>
          </>
        )}

        {/* Bottom rule with rating note */}
        <div
          className="mt-12 pt-6 flex flex-wrap items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--ink-300)' }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--bone-300)',
            }}
          >
            — 100+ wagens behandeld in heel Vlaanderen
          </span>
          <span
            style={{
              fontFamily: 'var(--font-fraunces)',
              fontWeight: 400,
              fontStyle: 'italic',
              fontSize: 22,
              color: 'var(--bone-000)',
              letterSpacing: 0,
            }}
          >
            5,0 <span style={{ color: 'var(--copper-200)' }}>/</span>{' '}
            <span style={{ color: 'var(--bone-300)' }}>5</span>
          </span>
        </div>
      </div>
    </section>
  )
}
