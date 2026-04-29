import { Link } from 'react-router-dom'

const PACKAGES = [
  {
    key: 'detailwash',
    ribbon: 'Basis',
    title: 'DetailWash',
    intro:
      "Hand-wash exterieur en interieur. De standaard. Gemiddeld 2 uur, met twee personen aan jouw wagen.",
    items: [
      'Voorwas, hand-wash, drogen',
      'Velgen en banden',
      'Interieur stofzuigen + oppervlakken',
      'Ramen binnen en buiten',
    ],
    priceFrom: '€55',
    cta: 'Boek DetailWash',
    href: '/diensten?categorie=wash',
    variant: 'secondary',
  },
  {
    key: 'detailwash-interieur',
    ribbon: 'Aanbevolen',
    title: 'DetailWash + Interieur',
    intro:
      'Inclusief dieptereiniging met extractiemachine. Verwijdert jaren aan vuil, vocht en geuren uit zetels en tapijten.',
    items: [
      'Alles uit DetailWash',
      'Extractie van zetels en tapijten',
      'Behandeling kunststof & leder',
      'Geur-neutralisatie',
    ],
    priceFrom: '€155',
    cta: 'Boek dit pakket',
    href: '/diensten?categorie=wash',
    variant: 'primary',
    accent: true,
  },
  {
    key: 'coating-ppf',
    ribbon: 'Premium',
    title: 'Coating & PPF',
    intro:
      'Keramische coating of Paint Protection Film, in onze garage in Hamme. Bescherming die de waarde van je wagen behoudt.',
    items: [
      'Decontaminatie + lichte polish',
      'Diamond Infused Ceramic Coating',
      'Optioneel: PPF op kwetsbare zones',
      'Onderhoudskit inbegrepen',
    ],
    priceFrom: '€200',
    cta: 'Vraag offerte',
    href: '/diensten?categorie=coating',
    variant: 'secondary',
  },
]

function ServiceCard({ pkg }) {
  const accent = pkg.accent
  return (
    <article
      className="relative flex flex-col overflow-hidden transition-colors duration-200 group"
      style={{
        background: accent
          ? 'linear-gradient(180deg, rgba(184,111,92,0.06), transparent 60%), var(--ink-100)'
          : 'var(--ink-100)',
        border: `1px solid ${accent ? 'var(--copper-700)' : 'var(--ink-400)'}`,
        borderRadius: '14px',
        padding: '32px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--copper-400)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = accent ? 'var(--copper-700)' : 'var(--ink-400)'
      }}
    >
      {/* Copper left rail */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0 transition-colors duration-200"
        style={{
          width: 2,
          background: accent ? 'var(--copper-400)' : 'var(--copper-700)',
        }}
      />

      {/* Ribbon */}
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: accent ? 'var(--copper-200)' : 'var(--copper-400)',
          margin: 0,
        }}
      >
        — {pkg.ribbon}
      </p>

      {/* Title */}
      <h3
        className="mt-3"
        style={{
          fontFamily: 'var(--font-fraunces)',
          fontWeight: 400,
          fontSize: 32,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          color: 'var(--bone-000)',
          margin: 0,
          textWrap: 'balance',
        }}
      >
        {pkg.title}
      </h3>

      {/* Intro */}
      <p
        className="mt-4"
        style={{
          fontFamily: 'var(--font-geist)',
          fontSize: 14,
          lineHeight: 1.55,
          color: 'var(--bone-200)',
          margin: 0,
        }}
      >
        {pkg.intro}
      </p>

      {/* Bullet list */}
      <ul className="mt-5 flex flex-col gap-2 list-none p-0 m-0">
        {pkg.items.map((item) => (
          <li
            key={item}
            style={{
              fontFamily: 'var(--font-geist)',
              fontSize: 14,
              color: 'var(--bone-200)',
              paddingLeft: 18,
              position: 'relative',
              lineHeight: 1.55,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 0,
                top: 9,
                width: 8,
                height: 1,
                background: 'var(--copper-400)',
              }}
            />
            {item}
          </li>
        ))}
      </ul>

      {/* Price */}
      <div
        className="mt-6 pt-4 flex items-baseline gap-2"
        style={{ borderTop: '1px solid var(--ink-400)' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: 'var(--bone-300)',
          }}
        >
          vanaf
        </span>
        <span
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontWeight: 400,
            fontSize: 36,
            color: 'var(--bone-000)',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          {pkg.priceFrom}
          <sup
            style={{
              fontSize: 16,
              color: 'var(--copper-200)',
              marginLeft: 2,
              top: '-0.6em',
              position: 'relative',
            }}
          >
            ,—
          </sup>
        </span>
      </div>

      {/* CTA — pinned to bottom */}
      <Link
        to={pkg.href}
        className={`mt-6 ${pkg.variant === 'primary' ? 'edit-btn edit-btn-primary' : 'edit-btn edit-btn-secondary'}`}
        style={{ alignSelf: 'flex-start', marginTop: 'auto', paddingTop: 14 }}
      >
        {pkg.cta}
        <span className="edit-arrow" aria-hidden="true" />
      </Link>
    </article>
  )
}

export default function ServicesPreview() {
  return (
    <section
      aria-labelledby="services-preview-title"
      style={{ backgroundColor: 'var(--ink-050)', padding: '128px 0' }}
    >
      <div className="container-ico">
        {/* Section head — editorial style with mono number */}
        <header
          className="grid gap-6 md:gap-10 mb-12 pb-4"
          style={{
            gridTemplateColumns: '80px 1fr',
            borderBottom: '1px solid var(--ink-300)',
            alignItems: 'baseline',
          }}
        >
          <div className="edit-sec-num" style={{ paddingTop: 12 }}>
            01 / Pakketten
          </div>
          <div>
            <h2 id="services-preview-title" className="edit-sec-title">
              Drie pakketten.<br />
              Eén <em>standaard</em>.
            </h2>
            <p className="edit-sec-sub">
              Wassen aan huis in heel Vlaanderen — coating en PPF in onze professionele garage in Hamme.
              Eén prijs, geen verrassingen, alles inbegrepen.
            </p>
          </div>
        </header>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PACKAGES.map((pkg) => (
            <ServiceCard key={pkg.key} pkg={pkg} />
          ))}
        </div>

        {/* Footer link */}
        <div className="mt-12 flex justify-end">
          <Link to="/diensten" className="edit-btn edit-btn-ghost">
            Alle diensten en add-ons
            <span className="edit-arrow ml-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
