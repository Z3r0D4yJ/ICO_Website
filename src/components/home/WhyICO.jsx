import { MapPin, Users, Sparkles, ShieldCheck, Clock, Star } from '@/lib/icons'

const FEATURES = [
  {
    icon: MapPin,
    title: 'Wij komen naar u',
    desc: 'Geen gedoe met rijden naar een wasstraat. Onze Washbus komt naar uw thuis of werkplek in heel Vlaanderen.',
  },
  {
    icon: Users,
    title: 'Team van twee',
    desc: 'Rico & Nico werken steeds samen. Twee paar handen betekent sneller klaar en dubbel zo grondig.',
  },
  {
    icon: Sparkles,
    title: 'CleanTech producten',
    desc: 'Wij werken uitsluitend met onze eigen professionele producten — dezelfde die wij ook in onze shop verkopen.',
  },
  {
    icon: ShieldCheck,
    title: 'Kwaliteitsgarantie',
    desc: 'Niet tevreden? Wij komen terug. Uw tevredenheid is onze prioriteit, altijd en zonder discussie.',
  },
  {
    icon: Clock,
    title: 'Flexibele tijdslots',
    desc: 'Kies zelf wanneer het u past — 4 tijdslots per dag van maandag tot zaterdag.',
  },
  {
    icon: Star,
    title: 'Premium resultaat',
    desc: 'Elk voertuig behandelen wij met de zorg die het verdient. Van kleintje tot groot — steeds tiptop.',
  },
]

export default function WhyICO() {
  return (
    <section
      className="section-padding"
      style={{ backgroundColor: 'var(--color-surface-elevated)' }}
      aria-labelledby="why-ico-title"
    >
      <div className="container-ico">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Links — tekst */}
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--color-primary)' }}
            >
              Waarom Team ICO?
            </p>
            <h2
              id="why-ico-title"
              className="mb-5"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                color: 'var(--color-text-primary)',
                letterSpacing: '0.03em',
                lineHeight: 1.1,
              }}
            >
              MOBILITEIT ONTMOET{' '}
              <span style={{ color: 'var(--color-primary)' }}>VAKMANSCHAP</span>
            </h2>
            <div className="divider-gold mb-5" style={{ marginLeft: 0 }} aria-hidden="true" />
            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Team ICO is opgericht door Rico en Nico met één doel: premium car detailing
              toegankelijk maken voor iedereen in Vlaanderen. Met onze volledig uitgeruste
              Washbus brengen wij de was naar u toe — professioneel, stipt en met passie voor
              elk detail.
            </p>

            {/* Stat blokjes */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '100+', label: 'Tevreden klanten' },
                { value: '2', label: 'Man sterk' },
                { value: '5★', label: 'Gemiddelde score' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="text-center p-4 rounded-xl"
                  style={{
                    backgroundColor: 'var(--color-surface-overlay)',
                    border: '1px solid rgba(196,130,111,0.2)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.75rem',
                      color: 'var(--color-primary)',
                      lineHeight: 1,
                    }}
                  >
                    {value}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Rechts — feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 p-5 rounded-xl transition-all duration-250 hover:-translate-y-0.5"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid rgba(196,130,111,0.2)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: 'rgba(196,130,111,0.1)' }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: 'var(--color-primary)' }}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p
                    className="font-semibold text-sm mb-1"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {title}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
