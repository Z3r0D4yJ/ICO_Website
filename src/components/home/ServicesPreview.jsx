import { Link } from 'react-router-dom'
import { ArrowRight, Drop, Shield, Layers, Sparkle, Home } from '@/lib/icons'

const CATEGORIES = [
  {
    key: 'wash',
    icon: Drop,
    label: 'Wassen',
    title: 'Wasbeurt',
    description:
      'EasyWash of DetailWash — professionele handwas aan huis voor auto\'s, SUV\'s en bestelwagens. Exterieur én interieur behandeld door Rico & Nico, gemiddeld in 2 uur.',
    price: 'Vanaf €55',
    cta: 'Bekijk & boek',
    href: '/diensten?categorie=wash',
  },
  {
    key: 'coating',
    icon: Shield,
    label: 'Coaten',
    title: 'Keramische Coating',
    description:
      'Langdurige lakbescherming met Diamond Infused Ceramic Coating. Uitgevoerd in onze professionele garage in Hamme — optimaal licht, gecontroleerde omgeving. Prijzen inclusief 21% BTW.',
    price: 'Vanaf €200',
    cta: 'Meer info',
    href: '/diensten?categorie=coating',
  },
  {
    key: 'ppf',
    icon: Layers,
    label: 'PPF',
    title: 'Paint Protection Film',
    description:
      'Transparante, zelfherstellende folie tegen steenslag, krassen en insecten. Geplaatst in onze garage in Hamme voor een perfect resultaat. Van koplampen tot volledige carrosserie — ook voor woninginterieurs.',
    price: 'Vanaf €75',
    cta: 'Meer info',
    href: '/diensten?categorie=ppf',
  },
  {
    key: 'extra',
    icon: Sparkle,
    label: "Extra's",
    title: "Add-ons & Extra's",
    description:
      "Dieptereiniging met extractiemachine, stoomreiniging, 3-staps polijstbehandeling, airco reiniging en hydrofobe ruitenvloeistof — combineer naar keuze.",
    price: 'Vanaf €10',
    cta: 'Bekijk',
    href: '/diensten?categorie=extra',
  },
  {
    key: 'homecare',
    icon: Home,
    label: 'HomeCare',
    title: 'Home Care',
    description:
      'Beschermende PPF-oplossingen voor interieurs van woningen én unieke diensten zoals het wrappen van keukens. Schoonmaken en beschermen — niet alleen voor uw wagen.',
    price: 'Op maat',
    cta: 'Ontdek',
    href: '/diensten?categorie=homecare',
  },
]

export default function ServicesPreview() {
  return (
    <section
      className="section-padding"
      style={{ backgroundColor: 'var(--color-surface)' }}
      aria-labelledby="services-preview-title"
    >
      <div className="container-ico">

        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--color-primary)' }}
          >
            Wat wij doen
          </p>
          <h2
            id="services-preview-title"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: 'var(--color-text-primary)',
              letterSpacing: '0.03em',
            }}
          >
            ONZE DIENSTEN
          </h2>
          <div className="divider-gold mt-4 mb-4" aria-hidden="true" />
          <p className="max-w-lg mx-auto text-base" style={{ color: 'var(--color-text-secondary)' }}>
            Wassen aan huis in heel Vlaanderen — coating en PPF in onze professionele garage in Hamme.
          </p>
        </div>

        {/* Categorie-kaarten */}
        {(() => {
          const cardContent = CATEGORIES.map(({ key, icon: Icon, label, title, description, price, cta, href }) => (
            <Link
              key={key}
              to={href}
              className="group flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
              style={{
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid rgba(196,130,111,0.18)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = '1px solid rgba(196,130,111,0.35)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = '1px solid rgba(196,130,111,0.18)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              aria-label={`${title} — bekijk alle ${label} diensten`}
            >
              {/* Kaart body */}
              <div className="p-7 flex flex-col flex-1">

                {/* Icon + categorie label */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: 'rgba(196,130,111,0.1)',
                      border: '1px solid rgba(196,130,111,0.25)',
                    }}
                  >
                    <Icon
                      className="w-6 h-6"
                      weight="duotone"
                      style={{ color: 'var(--color-primary)' }}
                      aria-hidden="true"
                    />
                  </div>
                  <span
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {label}
                  </span>
                </div>

                {/* Titel */}
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.75rem',
                    color: 'var(--color-text-primary)',
                    letterSpacing: '0.02em',
                    lineHeight: 1.1,
                  }}
                >
                  {title}
                </h3>

                {/* Beschrijving */}
                <p
                  className="text-sm flex-1 leading-relaxed mb-6"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {description}
                </p>

                {/* Footer: prijs + pijl */}
                <div
                  className="flex items-center justify-between pt-5 border-t"
                  style={{ borderColor: 'rgba(196,130,111,0.15)' }}
                >
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: 'var(--color-text-muted)' }}>Prijs</p>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.375rem',
                        color: 'var(--color-primary)',
                        lineHeight: 1,
                      }}
                    >
                      {price}
                    </p>
                  </div>

                  <div
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    <span>{cta}</span>
                    <ArrowRight className="w-4 h-4" weight="bold" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </Link>
          ))

          return (
            <>
              {/* Desktop grid */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {cardContent}
              </div>

              {/* Mobile — horizontaal scroll */}
              <div
                className="sm:hidden -mx-4 overflow-x-auto snap-x snap-mandatory mb-10"
                style={{ scrollbarWidth: 'none', scrollPaddingInline: '1.5rem' }}
              >
                <div className="flex gap-4 px-4" role="list" aria-label="Diensten categorieën">
                {CATEGORIES.map(({ key, icon: Icon, label, title, description, price, cta, href }, idx) => (
                  <div key={key} className="snap-start flex-shrink-0 w-[calc(100vw-3rem)]" role="listitem">
                    <Link
                      to={href}
                      className="group flex flex-col h-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                      style={{
                        backgroundColor: 'var(--color-surface-elevated)',
                        border: '1px solid rgba(196,130,111,0.18)',
                      }}
                      aria-label={`${title} — bekijk alle ${label} diensten`}
                    >
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-5">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: 'rgba(196,130,111,0.1)', border: '1px solid rgba(196,130,111,0.25)' }}
                          >
                            <Icon className="w-5 h-5" weight="duotone" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>{label}</span>
                        </div>
                        <h3 className="mb-2" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-text-primary)', letterSpacing: '0.02em', lineHeight: 1.1 }}>
                          {title}
                        </h3>
                        <p className="text-sm flex-1 leading-relaxed mb-5" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
                        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'rgba(196,130,111,0.15)' }}>
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-primary)', lineHeight: 1 }}>{price}</p>
                          <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                            <span>{cta}</span>
                            <ArrowRight className="w-4 h-4" weight="bold" aria-hidden="true" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
                <div className="flex-shrink-0 w-1" aria-hidden="true" />
                </div>
              </div>
            </>
          )
        })()}

        {/* Alle diensten CTA */}
        <div className="text-center">
          <Link
            to="/diensten"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-150"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
          >
            Alle diensten bekijken
            <ArrowRight className="w-3.5 h-3.5" weight="bold" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
