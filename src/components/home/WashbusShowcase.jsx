import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight } from '@/lib/icons'
import Button from '@/components/ui/Button'

const WASHBUS_FEATURES = [
  'Eigen watervoorraad — geen aansluiting nodig',
  'Generator aan boord — stroom op elke locatie',
  'Professionele extractiemachine voor dieptereiniging',
  'Coating & PPF: in onze garage in Hamme',
  'Eigen CleanTech productlijn — exclusief bij ICO',
  'Auto\'s, SUV\'s, bestelwagens én motoren welkom',
  'Actief in heel Vlaanderen — 6 dagen op 7',
]

export default function WashbusShowcase() {
  return (
    <section
      className="section-padding"
      style={{ backgroundColor: 'var(--color-surface)' }}
      aria-labelledby="washbus-title"
    >
      <div className="container-ico">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Links — afbeelding placeholder */}
          <div className="order-2 lg:order-1">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                aspectRatio: '4/3',
                border: '1px solid rgba(196,130,111,0.2)',
              }}
            >
              {/* Washbus foto */}
              <img
                src="/images/Washbus_full.jpg"
                alt="De ICO Washbus — volledig uitgerust mobiel detailing voertuig"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />

              {/* Subtle dark gradient overlay for depth */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 60%, rgba(196,130,111,0.15) 100%)' }}
                aria-hidden="true"
              />

              {/* Gouden glow corner */}
              <div
                className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full pointer-events-none opacity-25"
                aria-hidden="true"
                style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }}
              />
            </div>
          </div>

          {/* Rechts — tekst */}
          <div className="order-1 lg:order-2">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--color-primary)' }}
            >
              Ons geheim wapen
            </p>
            <h2
              id="washbus-title"
              className="mb-5"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                color: 'var(--color-text-primary)',
                letterSpacing: '0.03em',
                lineHeight: 1.1,
              }}
            >
              DE <span style={{ color: 'var(--color-primary)' }}>WASHBUS</span>
            </h2>
            <div
              className="divider-gold mb-5"
              style={{ marginLeft: 0 }}
              aria-hidden="true"
            />
            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              De Washbus is het hart van Team ICO — volledig uitgerust voor
              wasbeurten aan huis in heel Vlaanderen. Geen wateraansluiting,
              geen stopcontact nodig. Voor keramische coating en PPF werken
              Rico & Nico vanuit hun professionele garage in Hamme, waar
              perfect licht en een gecontroleerde omgeving het verschil maken.
            </p>

            {/* Feature lijst */}
            <ul className="flex flex-col gap-3 mb-8" role="list">
              {WASHBUS_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <CheckCircle2
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: 'var(--color-success)' }}
                    aria-hidden="true"
                  />
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              as={Link}
              to="/over-ons"
              variant="secondary"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Meer over Team ICO
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
