import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      aria-label="Hero — Intense Cleaning Organization"
      style={{
        backgroundColor: 'var(--ink-050)',
        color: 'var(--bone-100)',
      }}
    >
      {/* Copper radials — top-right warm glow + bottom-left deep tint */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 70% 35%, rgba(184,111,92,0.18) 0%, transparent 60%),' +
            'radial-gradient(ellipse 60% 80% at 15% 90%, rgba(110,52,40,0.30) 0%, transparent 60%),' +
            'linear-gradient(180deg, #0E0C0B 0%, #0a0807 100%)',
        }}
      />

      {/* Right-side photo (Rico & Nico) — desktop only, full bleed with editorial fades */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden lg:block"
        style={{ width: '52%' }}
      >
        <img
          src="/images/test.jpeg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: 'saturate(0.85) contrast(1.05)' }}
        />
        {/* Left-edge fade into charcoal */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, var(--ink-050) 0%, rgba(14,12,11,0.6) 18%, transparent 45%)',
          }}
        />
        {/* Top + bottom fade for full-bleed feel */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, var(--ink-050) 0%, transparent 12%, transparent 82%, var(--ink-050) 100%)',
          }}
        />
        {/* Copper bloom */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 70% 55%, rgba(216,158,140,0.25) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Mobile photo — top band */}
      <div
        aria-hidden="true"
        className="relative lg:hidden"
        style={{ height: '38vh', minHeight: 240, maxHeight: 360 }}
      >
        <img
          src="/images/rico&nico.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: 'saturate(0.85) contrast(1.05)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, transparent 30%, var(--ink-050) 95%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(216,158,140,0.30) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Film grain — subtle overlay */}
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

      {/* Content grid */}
      <div className="relative z-10">
        <div
          className="container-ico"
          style={{
            paddingTop: 'clamp(48px, 9vw, 128px)',
            paddingBottom: 'clamp(48px, 9vw, 128px)',
          }}
        >
          <div className="grid lg:grid-cols-2 lg:items-end" style={{ minHeight: 'min(720px, calc(100vh - 64px))' }}>
            <div className="max-w-[640px]">
              {/* Eyebrow */}
              <p className="edit-eyebrow mb-6 sm:mb-8">
                Mobiele cardetailing · Regio Vlaanderen
              </p>

              {/* Display headline */}
              <h1
                style={{
                  fontFamily: 'var(--font-fraunces)',
                  fontWeight: 300,
                  fontSize: 'clamp(56px, 7.5vw, 112px)',
                  lineHeight: 0.92,
                  letterSpacing: 0,
                  color: 'var(--bone-000)',
                  margin: 0,
                  textWrap: 'balance',
                }}
              >
                De wasstraat<br />
                komt{' '}
                <em
                  style={{
                    fontStyle: 'italic',
                    fontWeight: 400,
                    color: 'var(--copper-200)',
                  }}
                >
                  naar jou.
                </em>
              </h1>

              {/* Deck */}
              <p
                style={{
                  fontFamily: 'var(--font-geist)',
                  fontSize: 'clamp(16px, 1.6vw, 19px)',
                  lineHeight: 1.5,
                  color: 'var(--bone-200)',
                  maxWidth: '52ch',
                  margin: '24px 0 40px',
                }}
              >
                Rico &amp; Nico komen met een volledig uitgeruste Washbus naar je oprit, je werk
                of een parking. Twee uur, met de hand, met de zorg die jouw wagen verdient.
                Coating en PPF in onze garage in Hamme.
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-4 mb-12">
                <Link to="/boeken" className="edit-btn edit-btn-primary edit-btn-lg">
                  Boek een DetailWash
                  <span className="edit-arrow" aria-hidden="true" />
                </Link>
                <Link to="/diensten" className="edit-btn edit-btn-secondary edit-btn-lg">
                  Bekijk de pakketten
                </Link>
              </div>
            </div>

            {/* Spacer column for desktop — image lives behind */}
            <div aria-hidden="true" className="hidden lg:block" />
          </div>

          {/* Stats strip — bottom rule */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-6"
            style={{ borderTop: '1px solid var(--ink-400)' }}
          >
            {[
              ['02:00 u', 'gemiddelde duur'],
              ['2 vakmannen', 'per behandeling'],
              ['0 km', 'jij rijdt niet'],
              ['100+', 'tevreden klanten'],
            ].map(([value, label]) => (
              <div key={label} className="flex flex-col gap-1">
                <span
                  style={{
                    fontFamily: 'var(--font-fraunces)',
                    fontWeight: 400,
                    fontSize: '20px',
                    color: 'var(--bone-000)',
                    letterSpacing: 0,
                  }}
                >
                  {value}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: 'var(--bone-300)',
                  }}
                >
                  — {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
