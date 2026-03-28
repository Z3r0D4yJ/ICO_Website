import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Clock } from '@/lib/icons'
import { useTranslation } from 'react-i18next'
import { useServices } from '@/hooks/useServices'
import { SERVICE_CATEGORIES } from '@/lib/constants'
import { DynamicIcon } from '@/lib/icons'
import { formatPrice } from '@/lib/utils'
import PageHero from '@/components/ui/PageHero'
import Button from '@/components/ui/Button'
import { SkeletonCard } from '@/components/ui/Skeleton'
import CTASection from '@/components/home/CTASection'

const BOOKABLE_CATEGORIES = ['wash', 'extra']

const CATEGORY_TITLES = {
  wash: 'WASBEURTEN',
  extra: "EXTRA'S",
  coating: 'COATING',
  ppf: 'PAINT PROTECTION FILM',
  homecare: 'HOME CARE',
}

export default function ServicesPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.slice(0, 2) || 'nl'
  const { services, loading } = useServices()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Scroll naar categorie als ?categorie= meegegeven is (bv. vanuit homepage)
  useEffect(() => {
    if (loading) return
    const cat = searchParams.get('categorie')
    if (!cat) return
    // Kleine delay zodat de DOM opgebouwd is
    const t = setTimeout(() => {
      const el = document.getElementById(`sectie-${cat}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    return () => clearTimeout(t)
  }, [loading, searchParams])

  const getTitle = (s) => (lang === 'en' && s.title_en) ? s.title_en : s.title_nl
  const getShortDesc = (s) => (lang === 'en' && s.short_description_en) ? s.short_description_en : s.short_description_nl
  const getDesc = (s) => (lang === 'en' && s.description_en) ? s.description_en : s.description_nl

  const grouped = SERVICE_CATEGORIES.map((cat) => ({
    ...cat,
    services: services
      .filter((s) => s.service_category === cat.value)
      .sort((a, b) => a.sort_order - b.sort_order),
  })).filter((cat) => cat.services.length > 0)

  const getMinPrice = (service) => {
    if (service.pricing_tiers?.length > 0) {
      return Math.min(...service.pricing_tiers.map((t) => t.price))
    }
    return service.price_from
  }

  return (
    <>
      <PageHero
        label="Wat wij aanbieden"
        title={t('services.title')}
        subtitle={t('services.subtitle')}
      />

      <div style={{ backgroundColor: 'var(--color-surface)' }}>
        {loading ? (
          <section className="section-padding">
            <div className="container-ico">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            </div>
          </section>
        ) : (
          grouped.map((cat) => (
            <section
              key={cat.value}
              id={`sectie-${cat.value}`}
              className="section-padding"
              aria-labelledby={`cat-${cat.value}`}
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              <div className="container-ico">
                {/* Categorie header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <div>
                    <p
                      className="text-sm font-semibold uppercase tracking-widest mb-2"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {lang === 'en' ? cat.label_en : cat.label_nl}
                    </p>
                    <h2
                      id={`cat-${cat.value}`}
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                        color: 'var(--color-text-primary)',
                        letterSpacing: '0.03em',
                        lineHeight: 1.1,
                      }}
                    >
                      {CATEGORY_TITLES[cat.value] || cat.label_nl.toUpperCase()}
                    </h2>
                  </div>
                  {cat.value === 'wash' && (
                    <p className="text-sm max-w-xs sm:text-right hidden sm:block" style={{ color: 'var(--color-text-muted)' }}>
                      Prijs afhankelijk van voertuigtype — selecteer bij boeking
                    </p>
                  )}
                </div>

                {/* Services — desktop grid + mobile horizontal scroll */}
                {(() => {
                  const serviceCard = (service) => {
                    const minPrice = getMinPrice(service)
                    const isBookable = BOOKABLE_CATEGORIES.includes(service.service_category)
                    const hasPricingTiers = !!service.pricing_tiers?.length

                    return (
                      <Link
                        key={service.id}
                        to={`/diensten/${service.slug}`}
                        className="group flex flex-col h-full rounded-xl overflow-hidden transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                        style={{
                          backgroundColor: 'var(--color-surface-elevated)',
                          border: '1px solid rgba(196,130,111,0.25)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(196,130,111,0.5)'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(196,130,111,0.25)'
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        {/* Afbeelding / icon */}
                        <div
                          className="relative overflow-hidden flex-shrink-0"
                          style={{
                            aspectRatio: '16/9',
                            backgroundColor: 'var(--color-surface-overlay)',
                          }}
                        >
                          {service.image_url ? (
                            <img
                              src={service.image_url}
                              alt={getTitle(service)}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <DynamicIcon
                                name={service.icon || 'Sparkle'}
                                weight="thin"
                                className="w-16 h-16"
                                style={{ color: 'var(--color-primary)', opacity: 0.3 }}
                                aria-hidden="true"
                              />
                            </div>
                          )}

                          {/* Icon badge */}
                          <div
                            className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{
                              backgroundColor: 'rgba(17,16,16,0.88)',
                              border: '1px solid rgba(196,130,111,0.4)',
                              backdropFilter: 'blur(4px)',
                            }}
                          >
                            <DynamicIcon
                              name={service.icon || 'Sparkle'}
                              weight="regular"
                              className="w-5 h-5"
                              style={{ color: 'var(--color-primary)' }}
                              aria-hidden="true"
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col flex-1 p-6">
                          <h3
                            className="mb-3"
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '1.5rem',
                              letterSpacing: '0.02em',
                              color: 'var(--color-text-primary)',
                              lineHeight: 1.15,
                            }}
                          >
                            {getTitle(service)}
                          </h3>

                          <p
                            className="text-sm leading-relaxed flex-1 mb-5 line-clamp-3"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            {getShortDesc(service) || getDesc(service)}
                          </p>

                          {/* Prijs + duur */}
                          <div
                            className="flex items-end justify-between py-4 mb-5"
                            style={{
                              borderTop: '1px solid rgba(196,130,111,0.15)',
                              borderBottom: '1px solid rgba(196,130,111,0.15)',
                            }}
                          >
                            <div>
                              {minPrice ? (
                                <>
                                  <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
                                    {hasPricingTiers ? 'Vanaf' : t('services.priceFrom')}
                                  </p>
                                  <p
                                    style={{
                                      fontFamily: 'var(--font-display)',
                                      fontSize: '2rem',
                                      color: 'var(--color-primary)',
                                      lineHeight: 1,
                                    }}
                                  >
                                    {formatPrice(minPrice)}
                                  </p>
                                  {hasPricingTiers && (
                                    <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                                      per voertuigtype
                                    </p>
                                  )}
                                </>
                              ) : (
                                <p className="text-sm italic" style={{ color: 'var(--color-text-muted)' }}>
                                  Op aanvraag
                                </p>
                              )}
                            </div>

                            {service.duration_minutes && (
                              <div className="flex items-center gap-1.5 text-right">
                                <Clock
                                  className="w-4 h-4 flex-shrink-0"
                                  style={{ color: 'var(--color-text-muted)' }}
                                  aria-hidden="true"
                                />
                                <div>
                                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                    {t('services.duration')}
                                  </p>
                                  <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                    ~{Math.floor(service.duration_minutes / 60)}u
                                    {service.duration_minutes % 60 > 0 && `${service.duration_minutes % 60}min`}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Actie */}
                          <div onClick={(e) => e.stopPropagation()}>
                            {isBookable ? (
                              <Button
                                variant="primary"
                                size="sm"
                                fullWidth
                                onClick={(e) => { e.stopPropagation(); navigate(`/boeken?dienst=${service.slug}`) }}
                              >
                                {t('common.bookNow')}
                              </Button>
                            ) : (
                              <Button
                                variant="secondary"
                                size="sm"
                                fullWidth
                                onClick={(e) => { e.stopPropagation(); navigate('/contact') }}
                              >
                                Offerte aanvragen
                              </Button>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  }

                  return (
                    <>
                      {/* Desktop grid */}
                      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cat.services.map(serviceCard)}
                      </div>

                      {/* Mobile — horizontaal scroll */}
                      <div
                        className="sm:hidden -mx-4 overflow-x-auto snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none', scrollPaddingInline: '1.5rem' }}
                      >
                        <div className="flex gap-4 px-4" role="list" aria-label={`${CATEGORY_TITLES[cat.value] || cat.label_nl} diensten`}>
                          {cat.services.map((service) => (
                            <div key={service.id} className="snap-start flex-shrink-0 w-[calc(100vw-3rem)]" role="listitem">
                              {serviceCard(service)}
                            </div>
                          ))}
                          <div className="flex-shrink-0 w-1" aria-hidden="true" />
                        </div>
                      </div>
                    </>
                  )
                })()}

                {/* Scheidingslijn tussen categorieën */}
                <div
                  className="mt-16"
                  style={{ borderBottom: '1px solid rgba(196,130,111,0.12)' }}
                  aria-hidden="true"
                />
              </div>
            </section>
          ))
        )}
      </div>

      {/* Info blok */}
      {!loading && (
        <section className="section-padding" style={{ backgroundColor: 'var(--color-surface)' }}>
          <div className="container-ico">
            <div
              className="rounded-xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              style={{
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid rgba(196,130,111,0.25)',
              }}
            >
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text-primary)' }}>
                  Prijs op maat nodig?
                </p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Heeft u een bijzonder voertuig of speciale wensen? Neem contact op voor een persoonlijke offerte.
                </p>
              </div>
              <Button
                as={Link}
                to="/contact"
                variant="secondary"
                size="sm"
                className="flex-shrink-0"
              >
                Vraag Offerte
              </Button>
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </>
  )
}
