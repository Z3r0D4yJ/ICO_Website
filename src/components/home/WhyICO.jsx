const PRINCIPLES = [
  {
    num: '01',
    title: 'Wij komen naar jou.',
    body:
      'Een Washbus die parkeert op je oprit. Geen wateraansluiting, geen stopcontact nodig. Jij rijdt niet, wij wel — overal in Vlaanderen.',
  },
  {
    num: '02',
    title: 'Altijd Rico & Nico.',
    body:
      'Geen wisselende ploegen. Hetzelfde duo bij elke afspraak — twee paar handen, dubbel zo grondig, en ze kennen je wagen na de tweede beurt.',
  },
  {
    num: '03',
    title: 'Eigen CleanTech producten.',
    body:
      'We werken uitsluitend met onze eigen professionele CleanTech-lijn — dezelfde producten die we ook in onze webshop verkopen.',
  },
  {
    num: '04',
    title: 'Vlaams, direct, vakmanschap.',
    body:
      'Korte lijnen via WhatsApp. Heldere prijzen, BTW inbegrepen. Geen kleine lettertjes — wel auto\'s die behandeld worden alsof het de onze zijn.',
  },
]

export default function WhyICO() {
  return (
    <section
      aria-labelledby="why-ico-title"
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
            02 / Houding
          </div>
          <div>
            <h2 id="why-ico-title" className="edit-sec-title">
              Vier <em>principes</em>
            </h2>
            <p className="edit-sec-sub">
              De DNA-strands waar elke beslissing op terugvalt — van de keuze van een product
              tot de manier waarop we een lederen zetel afwerken.
            </p>
          </div>
        </header>

        {/* Principles grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRINCIPLES.map(({ num, title, body }) => (
            <article
              key={num}
              style={{
                paddingTop: 24,
                borderTop: '1px solid var(--copper-700)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  color: 'var(--copper-400)',
                  margin: '0 0 16px',
                }}
              >
                — {num}
              </p>
              <h3
                style={{
                  fontFamily: 'var(--font-fraunces)',
                  fontWeight: 400,
                  fontSize: 26,
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em',
                  color: 'var(--bone-000)',
                  margin: '0 0 12px',
                  textWrap: 'balance',
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-geist)',
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: 'var(--bone-200)',
                  margin: 0,
                }}
              >
                {body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
