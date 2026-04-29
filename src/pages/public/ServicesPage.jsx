import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useServices } from '@/hooks/useServices'
import { SERVICE_CATEGORIES, GARAGE_SERVICE_CATEGORIES } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import CTASection from '@/components/home/CTASection'

const BOOKABLE_CATEGORIES = ['wash', 'extra']

const CATEGORY_META = {
  wash: {
    num: '01',
    title: 'Wasbeurten',
    titleAccent: 'op locatie',
    intro:
      'Hand-wash aan huis, op het werk, of waar je auto staat. EasyWash voor onderhoud, DetailWash voor de volle behandeling. Twee uur, twee personen, één staat van perfectie.',
    location: 'Mobiel · Heel Vlaanderen',
  },
  coating: {
    num: '02',
    title: 'Keramische coating',
    titleAccent: 'die blijft.',
    intro:
      'Diamond Infused Ceramic Coating in onze garage in Hamme. Lakwerk dat jaren beschermd blijft tegen UV, vuil en lichte krassen. Inclusief decontaminatie en lichte polish.',
    location: 'Garage · Hamme',
  },
  ppf: {
    num: '03',
    title: 'Paint Protection Film',
    titleAccent: 'onzichtbaar.',
    intro:
      'Transparante, zelfherstellende folie tegen steenslag, krassen en insecten. Van koplampen tot volledige carrosserie — geplaatst in optimale omstandigheden.',
    location: 'Garage · Hamme',
  },
  extra: {
    num: '04',
    title: "Extra's & add-ons",
    titleAccent: 'naar wens.',
    intro:
      'Dieptereiniging met extractiemachine, stoomreiniging, 3-staps polijstbehandeling, airco-ontsmetting, hydrofobe ruitenvloeistof. Combineer wat je wagen nodig heeft.',
    location: 'Mobiel · op locatie of garage',
  },
  homecare: {
    num: '05',
    title: 'HomeCare',
    titleAccent: 'voor binnen.',
    intro:
      'PPF-bescherming voor woninginterieurs en unieke services zoals het wrappen van keukens. Schoonmaken en beschermen — niet alleen voor je wagen.',
    location: 'Op aanvraag',
  },
}

function EditorialPageHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: 'var(--ink-050)' }}
    >
      {/* Copper radials */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 80% 30%, rgba(184,111,92,0.14) 0%, transparent 60%),' +
            'radial-gradient(ellipse 50% 80% at 10% 100%, rgba(110,52,40,0.22) 0%, transparent 60%)',
        }}
      />
      {/* Film grain */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.04,
          mixBlendMode: 'overlay',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div
        className="container-ico relative z-10"
        style={{ paddingTop: 'clamp(64px, 9vw, 128px)', paddingBottom: 'clamp(48px, 7vw, 96px)' }}
      >
        <p className="edit-eyebrow mb-8">Wat wij aanbieden</p>

        <h1
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
          Diensten &amp;{' '}
          <em
            style={{
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'var(--copper-200)',
            }}
          >
            pakketten.
          </em>
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-geist)',
            fontSize: 'clamp(16px, 1.6vw, 19px)',
            lineHeight: 1.55,
            color: 'var(--bone-200)',
            margin: '32px 0 0',
            maxWidth: '54ch',
          }}
        >
          Wassen aan huis in heel Vlaanderen. Coating en PPF in onze professionele garage in Hamme.
          Alle prijzen inclusief 21% BTW — geen verrassingen achteraf.
        </p>
      </div>

      {/* Bottom rule */}
      <div className="container-ico relative z-10">
        <div style={{ borderBottom: '1px solid var(--ink-400)' }} />
      </div>
    </section>
  )
}

function CategoryNav({ categories, activeCat }) {
  return (
    <nav
      aria-label="Categorieën"
      className="sticky top-16 z-20"
      style={{
        backgroundColor: 'rgba(14,12,11,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--ink-400)',
      }}
    >
      <div className="container-ico">
        <div
          className="flex gap-8 overflow-x-auto"
          style={{
            paddingTop: 18,
            paddingBottom: 18,
            scrollbarWidth: 'none',
          }}
        >
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat.value] || {}
            const isActive = activeCat === cat.value
            return (
              <a
                key={cat.value}
                href={`#sectie-${cat.value}`}
                onClick={(e) => {
                  e.preventDefault()
                  const el = document.getElementById(`sectie-${cat.value}`)
                  if (el) {
                    const top = el.getBoundingClientRect().top + window.scrollY - 120
                    window.scrollTo({ top, behavior: 'smooth' })
                  }
                }}
                className="flex items-center gap-3 whitespace-nowrap transition-colors duration-150"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: isActive ? 'var(--copper-200)' : 'var(--bone-300)',
                  paddingBottom: 6,
                  borderBottom: isActive ? '1px solid var(--copper-400)' : '1px solid transparent',
                }}
              >
                <span
                  style={{
                    color: isActive ? 'var(--copper-400)' : 'var(--bone-300)',
                  }}
                >
                  {meta.num || '—'}
                </span>
                <span>{cat.label_nl}</span>
              </a>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

function ServiceCard({ service, lang, t, isBookable, navigate }) {
  const minPrice = service.pricing_tiers?.length
    ? Math.min(...service.pricing_tiers.map((tier) => tier.price))
    : service.price_from
  const hasPricingTiers = !!service.pricing_tiers?.length

  const title = lang === 'en' && service.title_en ? service.title_en : service.title_nl
  const desc =
    lang === 'en' && service.short_description_en
      ? service.short_description_en
      : service.short_description_nl ||
        (lang === 'en' && service.description_en
          ? service.description_en
          : service.description_nl)

  return (
    <Link
      to={`/diensten/${service.slug}`}
      className="group flex flex-col h-full overflow-hidden transition-all duration-200 focus-visible:outline-none focus-visible:ring-2"
      style={{
        background: 'var(--ink-100)',
        border: '1px solid var(--ink-400)',
        borderRadius: 14,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--copper-400)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--ink-400)'
      }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: '4/3',
          backgroundColor: 'var(--ink-200)',
        }}
      >
        {service.image_url ? (
          <img
            src={service.image_url}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            style={{ filter: 'saturate(0.9) contrast(1.05)' }}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(184,111,92,0.15) 0%, transparent 60%), var(--ink-200)',
            }}
          />
        )}

        {/* Overlay gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, transparent 50%, rgba(8,7,6,0.7) 100%)',
          }}
        />

        {/* Duration tag — bottom-left */}
        {service.duration_minutes && (
          <span
            className="absolute"
            style={{
              left: 16,
              bottom: 16,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--bone-000)',
              padding: '4px 10px',
              background: 'rgba(8,7,6,0.6)',
              border: '1px solid var(--ink-400)',
              borderRadius: 999,
              backdropFilter: 'blur(8px)',
            }}
          >
            ~{Math.floor(service.duration_minutes / 60)}u
            {service.duration_minutes % 60 > 0 && ` ${service.duration_minutes % 60}min`}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6">
        <h3
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontWeight: 400,
            fontSize: 26,
            lineHeight: 1.1,
            letterSpacing: '-0.015em',
            color: 'var(--bone-000)',
            margin: 0,
            textWrap: 'balance',
          }}
        >
          {title}
        </h3>

        {desc && (
          <p
            className="mt-3"
            style={{
              fontFamily: 'var(--font-geist)',
              fontSize: 14,
              lineHeight: 1.55,
              color: 'var(--bone-200)',
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {desc}
          </p>
        )}

        {/* Price block */}
        <div
          className="mt-6 pt-4 flex items-baseline justify-between"
          style={{ borderTop: '1px solid var(--ink-400)' }}
        >
          {minPrice ? (
            <div className="flex items-baseline gap-2">
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  color: 'var(--bone-300)',
                }}
              >
                {hasPricingTiers ? 'vanaf' : t('services.priceFrom')}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-fraunces)',
                  fontWeight: 400,
                  fontSize: 32,
                  color: 'var(--bone-000)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                {formatPrice(minPrice).replace('€', '€')}
              </span>
              {hasPricingTiers && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--bone-300)',
                    marginLeft: 4,
                  }}
                >
                  /voertuig
                </span>
              )}
            </div>
          ) : (
            <span
              style={{
                fontFamily: 'var(--font-fraunces)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 22,
                color: 'var(--copper-200)',
                letterSpacing: '-0.01em',
              }}
            >
              op aanvraag
            </span>
          )}
        </div>

        {/* CTA */}
        <div
          className="mt-5"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (isBookable) {
              navigate(`/boeken?dienst=${service.slug}`)
            } else {
              navigate('/contact')
            }
          }}
        >
          <span
            className={isBookable ? 'edit-btn edit-btn-primary' : 'edit-btn edit-btn-secondary'}
            style={{ width: '100%', display: 'inline-flex' }}
          >
            {isBookable ? t('common.bookNow') : 'Vraag offerte'}
            <span className="edit-arrow" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function CategorySection({ cat, lang, t, navigate }) {
  const meta = CATEGORY_META[cat.value] || {}
  const isGarage = GARAGE_SERVICE_CATEGORIES.includes(cat.value)

  return (
    <section
      id={`sectie-${cat.value}`}
      aria-labelledby={`cat-${cat.value}`}
      style={{
        backgroundColor: 'var(--ink-050)',
        padding: 'clamp(64px, 8vw, 128px) 0',
        borderTop: '1px solid var(--ink-300)',
        scrollMarginTop: 120,
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
            {meta.num || '—'} / {cat.label_nl}
          </div>
          <div>
            <h2 id={`cat-${cat.value}`} className="edit-sec-title">
              {meta.title || cat.label_nl}{' '}
              {meta.titleAccent && (
                <em>{meta.titleAccent}</em>
              )}
            </h2>
            {meta.intro && <p className="edit-sec-sub">{meta.intro}</p>}

            {/* Location chip */}
            <div className="mt-5 flex items-center gap-3">
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'var(--bone-200)',
                  padding: '6px 12px',
                  background: 'var(--ink-100)',
                  border: `1px solid ${isGarage ? 'var(--copper-700)' : 'var(--ink-400)'}`,
                  borderRadius: 999,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: isGarage ? 'var(--copper-400)' : 'var(--signal-go)',
                  }}
                />
                {meta.location}
              </span>
            </div>
          </div>
        </header>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cat.services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              lang={lang}
              t={t}
              isBookable={BOOKABLE_CATEGORIES.includes(service.service_category)}
              navigate={navigate}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function SkeletonGrid() {
  return (
    <section
      style={{
        backgroundColor: 'var(--ink-050)',
        padding: 'clamp(64px, 8vw, 128px) 0',
      }}
    >
      <div className="container-ico">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: 'var(--ink-100)',
                border: '1px solid var(--ink-400)',
                borderRadius: 14,
                overflow: 'hidden',
              }}
            >
              <div style={{ aspectRatio: '4/3', background: 'var(--ink-200)' }} />
              <div style={{ padding: 24 }}>
                <div style={{ height: 24, width: '70%', background: 'var(--ink-300)', marginBottom: 16 }} />
                <div style={{ height: 14, width: '95%', background: 'var(--ink-300)', marginBottom: 8 }} />
                <div style={{ height: 14, width: '80%', background: 'var(--ink-300)', marginBottom: 24 }} />
                <div style={{ height: 36, width: '100%', background: 'var(--ink-300)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CustomQuoteBlock() {
  return (
    <section
      style={{
        backgroundColor: 'var(--ink-100)',
        padding: 'clamp(64px, 8vw, 128px) 0',
        borderTop: '1px solid var(--ink-300)',
      }}
    >
      <div className="container-ico">
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          style={{
            background:
              'radial-gradient(ellipse 50% 100% at 100% 50%, rgba(184,111,92,0.10) 0%, transparent 60%), var(--ink-050)',
            border: '1px solid var(--ink-400)',
            borderRadius: 24,
            padding: 'clamp(32px, 5vw, 64px)',
          }}
        >
          <div className="lg:col-span-7">
            <p className="edit-eyebrow mb-6">Buiten het pakket</p>
            <h2
              style={{
                fontFamily: 'var(--font-fraunces)',
                fontWeight: 400,
                fontSize: 'clamp(28px, 3.5vw, 44px)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: 'var(--bone-000)',
                margin: 0,
                textWrap: 'balance',
              }}
            >
              Een{' '}
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'var(--copper-200)',
                }}
              >
                bijzondere wagen
              </em>
              {' '}of speciale wens?
            </h2>
            <p
              className="mt-5"
              style={{
                fontFamily: 'var(--font-geist)',
                fontSize: 16,
                lineHeight: 1.6,
                color: 'var(--bone-200)',
                margin: 0,
                maxWidth: '52ch',
              }}
            >
              Klassiekers, sportwagens, oldtimers, motorfietsen — elk voertuig krijgt z'n
              eigen aanpak. Stuur ons een bericht en we maken een offerte op maat.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-wrap gap-4 lg:justify-end">
            <Link to="/contact" className="edit-btn edit-btn-secondary">
              Vraag offerte
              <span className="edit-arrow" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ServicesPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.slice(0, 2) || 'nl'
  const { services, loading } = useServices()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeCat, setActiveCat] = useState(null)

  // Group services by category, preserving SERVICE_CATEGORIES order
  const grouped = SERVICE_CATEGORIES.map((cat) => ({
    ...cat,
    services: services
      .filter((s) => s.service_category === cat.value)
      .sort((a, b) => a.sort_order - b.sort_order),
  })).filter((cat) => cat.services.length > 0)

  // Scroll to category when ?categorie= present
  useEffect(() => {
    if (loading) return
    const cat = searchParams.get('categorie')
    if (!cat) return
    const timer = setTimeout(() => {
      const el = document.getElementById(`sectie-${cat}`)
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 120
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [loading, searchParams])

  // Track active category in viewport for sticky nav
  useEffect(() => {
    if (loading || grouped.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) {
          const id = visible.target.id.replace('sectie-', '')
          setActiveCat(id)
        }
      },
      { rootMargin: '-130px 0px -60% 0px', threshold: [0, 0.1, 0.5] }
    )
    grouped.forEach((cat) => {
      const el = document.getElementById(`sectie-${cat.value}`)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [loading, grouped])

  return (
    <div style={{ backgroundColor: 'var(--ink-050)' }}>
      <EditorialPageHero />

      {!loading && grouped.length > 1 && (
        <CategoryNav categories={grouped} activeCat={activeCat || grouped[0]?.value} />
      )}

      {loading ? (
        <SkeletonGrid />
      ) : (
        grouped.map((cat) => (
          <CategorySection
            key={cat.value}
            cat={cat}
            lang={lang}
            t={t}
            navigate={navigate}
          />
        ))
      )}

      {!loading && <CustomQuoteBlock />}

      <CTASection />
    </div>
  )
}
