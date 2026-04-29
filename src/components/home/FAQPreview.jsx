import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFAQ } from '@/hooks/useFAQ'

const FALLBACK_FAQ = [
  {
    id: 'f1',
    question_nl: 'Hoe lang duurt een DetailWash?',
    answer_nl:
      "Gemiddeld nemen onze behandelingen zo'n 2 uur in beslag, afhankelijk van de staat van het voertuig. We werken steeds met twee personen om de tijd zo efficiënt mogelijk te houden.",
  },
  {
    id: 'f2',
    question_nl: 'Wat is inbegrepen bij een dieptereiniging?',
    answer_nl:
      'Bij een dieptereiniging reinigen we de zetels en tapijten grondig met een extractiemachine — vuil, vlekken én geuren weg. Best gecombineerd met een DetailWash voor het beste resultaat.',
  },
  {
    id: 'f3',
    question_nl: 'Hoe boek ik een afspraak?',
    answer_nl:
      'Via de boekingspagina, of stuur ons een berichtje op WhatsApp. Vermeld het type voertuig en de gewenste dienst — Rico & Nico antwoorden meestal binnen het uur.',
  },
  {
    id: 'f4',
    question_nl: 'Komen jullie bij mij thuis of moet ik naar jullie komen?',
    answer_nl:
      'Voor wasbeurten komt de Washbus naar jou — thuis, op het werk, of waar je auto staat. Coating en PPF voeren we uit in onze garage in Hamme, voor een vlekkeloos resultaat.',
  },
  {
    id: 'f5',
    question_nl: 'Mijn vraag staat hier niet bij.',
    answer_nl:
      'Stuur ons een berichtje via WhatsApp of het contactformulier — we helpen je vrijblijvend met al je vragen.',
  },
]

function FAQRow({ item, isOpen, onToggle }) {
  return (
    <div style={{ borderBottom: '1px solid var(--ink-300)' }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-baseline gap-6 text-left transition-colors duration-150"
        style={{
          padding: '24px 0',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.2em',
            color: 'var(--copper-400)',
            flexShrink: 0,
            paddingTop: 8,
            minWidth: 32,
          }}
        >
          {String(item._idx + 1).padStart(2, '0')}
        </span>
        <span
          className="flex-1"
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontWeight: 400,
            fontSize: 'clamp(20px, 2.2vw, 26px)',
            lineHeight: 1.2,
            letterSpacing: 0,
            color: 'var(--bone-000)',
          }}
        >
          {item.question_nl}
        </span>
        <span
          aria-hidden="true"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 18,
            color: 'var(--copper-400)',
            transition: 'transform 200ms ease',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
            paddingTop: 6,
          }}
        >
          +
        </span>
      </button>
      {isOpen && (
        <div
          style={{
            padding: '0 0 24px 56px',
            fontFamily: 'var(--font-geist)',
            fontSize: 16,
            lineHeight: 1.6,
            color: 'var(--bone-200)',
            maxWidth: '70ch',
          }}
        >
          {item.answer_nl}
        </div>
      )}
    </div>
  )
}

export default function FAQPreview() {
  const { items: dbItems } = useFAQ()
  const items = (dbItems.length > 0 ? dbItems : FALLBACK_FAQ).slice(0, 5)
  const [openId, setOpenId] = useState(items[0]?.id ?? null)

  return (
    <section
      aria-labelledby="faq-preview-title"
      style={{
        backgroundColor: 'var(--ink-100)',
        padding: '128px 0',
        borderTop: '1px solid var(--ink-300)',
      }}
    >
      <div className="container-ico">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left rail — section head */}
          <div className="lg:col-span-4">
            <p className="edit-sec-num">04 / Vragen</p>
            <h2
              id="faq-preview-title"
              className="edit-sec-title mt-4"
              style={{ fontSize: 'clamp(36px, 4vw, 56px)' }}
            >
              Wat je nog<br />
              wil <em>weten.</em>
            </h2>
            <p className="edit-sec-sub">
              De meest gestelde vragen, kort beantwoord. Voor de rest:
              een bericht op WhatsApp werkt het snelst.
            </p>
            <Link to="/faq" className="edit-btn edit-btn-ghost mt-8">
              Alle veelgestelde vragen
              <span className="edit-arrow ml-3" aria-hidden="true" />
            </Link>
          </div>

          {/* Right — accordion list */}
          <div className="lg:col-span-8" style={{ borderTop: '1px solid var(--ink-300)' }}>
            {items.map((item, idx) => (
              <FAQRow
                key={item.id}
                item={{ ...item, _idx: idx }}
                isOpen={openId === item.id}
                onToggle={() => setOpenId(openId === item.id ? null : item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
