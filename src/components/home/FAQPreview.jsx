import { Link } from 'react-router-dom'
import { HelpCircle, ArrowRight } from '@/lib/icons'
import { useFAQ } from '@/hooks/useFAQ'
import Accordion from '@/components/ui/Accordion'
import Button from '@/components/ui/Button'

// Statische fallback — meest gestelde vragen
const FALLBACK_FAQ = [
  { id: 'f1', question_nl: 'Hoe lang duurt een DetailWash?', answer_nl: 'Een DetailWash duurt gemiddeld 2 à 3 uur, afhankelijk van de staat en het type van uw voertuig.' },
  { id: 'f2', question_nl: 'Wat is het werkgebied van ICO?', answer_nl: 'Wij bedienen heel Vlaanderen. Of u nu in Antwerpen, Gent, Leuven of Brugge woont — wij komen naar u toe.' },
  { id: 'f3', question_nl: 'Hoe maak ik een afspraak?', answer_nl: 'U kunt eenvoudig online boeken via onze boekingspagina. Kies uw dienst, selecteer een datum en tijdslot, vul uw gegevens in en bevestig.' },
  { id: 'f4', question_nl: 'Kan ik mijn afspraak annuleren of verplaatsen?', answer_nl: 'Annuleren of verplaatsen kan kosteloos tot 24 uur voor de afspraak. Neem contact met ons op via WhatsApp of e-mail.' },
]

export default function FAQPreview() {
  const { items: dbItems } = useFAQ()
  const faqItems = (dbItems.length > 0 ? dbItems : FALLBACK_FAQ).slice(0, 5)

  return (
    <section
      className="section-padding"
      style={{ backgroundColor: 'var(--color-surface)' }}
      aria-labelledby="faq-preview-title"
    >
      <div className="container-ico">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
              style={{
                backgroundColor: 'rgba(196,130,111,0.08)',
                color: 'var(--color-primary)',
                border: '1px solid rgba(196,130,111,0.2)',
              }}
            >
              <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
              FAQ
            </div>
            <h2
              id="faq-preview-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                color: 'var(--color-text-primary)',
                letterSpacing: '0.03em',
                lineHeight: 1.1,
              }}
            >
              VEELGESTELDE{' '}
              <span style={{ color: 'var(--color-primary)' }}>VRAGEN</span>
            </h2>
            <p
              className="mt-3 text-base max-w-xl mx-auto"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              De antwoorden op de meest gestelde vragen over onze diensten.
            </p>
          </div>

          {/* Accordion */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid rgba(196,130,111,0.15)',
            }}
          >
            <Accordion>
              {faqItems.map((item) => (
                <Accordion.Item
                  key={item.id}
                  title={item.question_nl}
                  className="px-5"
                >
                  {item.answer_nl}
                </Accordion.Item>
              ))}
            </Accordion>
          </div>

          {/* CTA naar volledige FAQ */}
          <div className="text-center mt-8">
            <Button
              as={Link}
              to="/faq"
              variant="secondary"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Alle veelgestelde vragen
            </Button>
          </div>

        </div>
      </div>
    </section>
  )
}
