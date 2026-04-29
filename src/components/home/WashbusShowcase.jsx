import { Link } from 'react-router-dom'

const FEATURES = [
  'Eigen watervoorraad — geen aansluiting nodig',
  'Generator aan boord — stroom op elke locatie',
  'Professionele extractiemachine voor dieptereiniging',
  'Eigen CleanTech-productlijn',
  "Auto's, SUV's, bestelwagens én motoren welkom",
  'Coating en PPF in onze garage in Hamme',
]

export default function WashbusShowcase() {
  return (
    <section
      aria-labelledby="washbus-title"
      style={{
        backgroundColor: 'var(--ink-100)',
        padding: '128px 0',
        borderTop: '1px solid var(--ink-300)',
      }}
    >
      <div className="container-ico">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Image — left, 7 columns */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <figure
              className="relative overflow-hidden"
              style={{
                aspectRatio: '4/3',
                borderRadius: '24px',
                border: '1px solid var(--ink-400)',
                background: 'var(--ink-200)',
              }}
            >
              <img
                src="/images/Washbus_full.jpg"
                alt="De ICO Washbus — volledig uitgerust mobiel detailing voertuig"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                style={{ filter: 'saturate(0.85) contrast(1.05)' }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(0,0,0,0.25) 0%, transparent 40%, rgba(110,52,40,0.2) 100%)',
                }}
                aria-hidden="true"
              />
              {/* Caption tag — bottom-left */}
              <figcaption
                className="absolute"
                style={{
                  left: 24,
                  bottom: 24,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.25em',
                  color: 'var(--bone-000)',
                  padding: '6px 12px',
                  background: 'rgba(8,7,6,0.6)',
                  border: '1px solid var(--ink-400)',
                  borderRadius: 999,
                  backdropFilter: 'blur(8px)',
                }}
              >
                — De Washbus
              </figcaption>
            </figure>
          </div>

          {/* Text — right, 5 columns */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <p className="edit-eyebrow mb-6">Ons gereedschap</p>

            <h2
              id="washbus-title"
              style={{
                fontFamily: 'var(--font-fraunces)',
                fontWeight: 400,
                fontSize: 'var(--t-h1-edit)',
                lineHeight: 1,
                letterSpacing: 0,
                color: 'var(--bone-000)',
                margin: 0,
                textWrap: 'balance',
              }}
            >
              Een wasstraat,<br />
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'var(--copper-200)',
                }}
              >
                op wielen.
              </em>
            </h2>

            <p
              className="mt-6"
              style={{
                fontFamily: 'var(--font-geist)',
                fontSize: 18,
                lineHeight: 1.55,
                color: 'var(--bone-200)',
                margin: '24px 0 0',
                maxWidth: '52ch',
              }}
            >
              De Washbus is het hart van Team ICO. Volledig uitgerust voor wasbeurten aan huis —
              geen wateraansluiting, geen stopcontact nodig. Voor coating en PPF werken Rico &amp; Nico
              in hun garage in Hamme, waar perfect licht en gecontroleerde omstandigheden het verschil maken.
            </p>

            {/* Feature list — copper dashes */}
            <ul className="mt-8 flex flex-col gap-3 list-none p-0 m-0">
              {FEATURES.map((feature) => (
                <li
                  key={feature}
                  style={{
                    fontFamily: 'var(--font-geist)',
                    fontSize: 15,
                    color: 'var(--bone-100)',
                    paddingLeft: 22,
                    position: 'relative',
                    lineHeight: 1.55,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 11,
                      width: 12,
                      height: 1,
                      background: 'var(--copper-400)',
                    }}
                  />
                  {feature}
                </li>
              ))}
            </ul>

            <Link to="/over-ons" className="edit-btn edit-btn-ghost mt-10">
              Lees het verhaal achter ICO
              <span className="edit-arrow ml-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
