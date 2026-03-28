import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HelpCircle, MessageCircle, Car } from '@/lib/icons'
import { Link } from 'react-router-dom'
import { useFAQ } from '@/hooks/useFAQ'
import { FAQ_CATEGORIES } from '@/lib/constants'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { whatsappLink } from '@/lib/utils'
import PageHero from '@/components/ui/PageHero'
import Accordion from '@/components/ui/Accordion'
import Button from '@/components/ui/Button'
import { SkeletonText } from '@/components/ui/Skeleton'
import CTASection from '@/components/home/CTASection'

// Statische fallback FAQ items als Supabase nog leeg is
const STATIC_FAQ = [
  {
    id: 's1',
    category: 'diensten',
    question_nl: 'Hoe lang duurt een DetailWash?',
    answer_nl: 'Een DetailWash duurt gemiddeld 2 à 3 uur, afhankelijk van de staat en het type van uw voertuig. Grotere voertuigen zoals SUV\'s of bestelwagens hebben iets meer tijd nodig.',
  },
  {
    id: 's2',
    category: 'diensten',
    question_nl: 'Werken jullie alleen of met twee personen?',
    answer_nl: 'Wij werken als team van twee — Rico & Nico. Dit zorgt voor een efficiënte en kwalitatieve wasbeurt. Zo is uw voertuig sneller klaar zonder in te boeten op kwaliteit.',
  },
  {
    id: 's3',
    category: 'diensten',
    question_nl: 'Kan ik een Dieptereiniging apart boeken zonder DetailWash?',
    answer_nl: 'Ja, een Dieptereiniging is apart te boeken. We raden het echter aan om deze te combineren met een DetailWash voor het beste resultaat — een proper interieur vraagt immers ook een proper exterieur.',
  },
  {
    id: 's4',
    category: 'diensten',
    question_nl: 'Is het Interieurpakket inbegrepen bij de Dieptereiniging?',
    answer_nl: 'Ja, het Interieurpakket is standaard inbegrepen bij de Dieptereiniging. U hoeft dit dus niet apart toe te voegen bij uw boeking.',
  },
  {
    id: 's5',
    category: 'diensten',
    question_nl: 'Wat is Paint Protection Film (PPF)?',
    answer_nl: 'PPF is een transparante, zelfherstellende folie die op de lak van uw voertuig wordt aangebracht. Het beschermt tegen steenslag, krassen, insecten en weersinvloeden — onzichtbaar maar zeer effectief.',
  },
  {
    id: 's6',
    category: 'boekingen',
    question_nl: 'Hoe maak ik een afspraak?',
    answer_nl: 'U kunt eenvoudig online boeken via onze boekingspagina. Kies uw dienst, selecteer een datum en tijdslot, vul uw adresgegevens in en bevestig. U ontvangt een bevestigingsmail en we nemen indien nodig contact op.',
  },
  {
    id: 's7',
    category: 'boekingen',
    question_nl: 'Kan ik mijn afspraak annuleren of verplaatsen?',
    answer_nl: 'Annuleren of verplaatsen kan kosteloos tot 24 uur voor de afspraak. Neem contact met ons op via WhatsApp of e-mail om uw afspraak te wijzigen.',
  },
  {
    id: 's8',
    category: 'boekingen',
    question_nl: 'Wat is het werkgebied van ICO?',
    answer_nl: 'Wij bedienen heel Vlaanderen. Of u nu in Antwerpen, Gent, Leuven of Brugge woont — wij komen naar u toe. Twijfelt u of uw locatie in ons werkgebied ligt? Neem gerust contact op.',
  },
  {
    id: 's9',
    category: 'boekingen',
    question_nl: 'Hoeveel op voorhand moet ik boeken?',
    answer_nl: 'Wij vragen minimaal 24 uur op voorhand te boeken. Voor weekends en drukke periodes raden we aan om tijdig te reserveren. Dringende aanvragen kunnen besproken worden via WhatsApp.',
  },
  {
    id: 's10',
    category: 'webshop',
    question_nl: 'Welke betaalmethoden accepteren jullie in de webshop?',
    answer_nl: 'In de webshop kunt u betalen via Bancontact, iDEAL, Visa, Mastercard en andere veelgebruikte betaalmethoden via ons veilig betalingssysteem (Mollie).',
  },
  {
    id: 's11',
    category: 'webshop',
    question_nl: 'Hoe snel worden mijn producten geleverd?',
    answer_nl: 'Bestellingen worden binnen 1-2 werkdagen verzonden. De levertijd bedraagt gemiddeld 2-3 werkdagen na verzending. U ontvangt een bevestigingsmail met trackinginformatie zodra uw bestelling is verzonden.',
  },
  {
    id: 's12',
    category: 'algemeen',
    question_nl: 'Hoe kan ik contact opnemen met ICO?',
    answer_nl: 'U kunt ons bereiken via het contactformulier op onze website, per e-mail, of via WhatsApp. WhatsApp is onze snelste communicatiekanaal — Rico & Nico reageren doorgaans binnen het uur tijdens werkdagen.',
  },
  {
    id: 's13',
    category: 'algemeen',
    question_nl: 'Zijn jullie verzekerd?',
    answer_nl: 'Ja, ICO is volledig verzekerd voor beroepsaansprakelijkheid. U kunt ons vertrouwen voor een professionele behandeling van uw voertuig.',
  },
]

const CATEGORY_LABELS = {
  diensten: 'Diensten',
  boekingen: 'Boekingen',
  webshop: 'Webshop',
  algemeen: 'Algemeen',
}

function FAQSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <div className="h-6 w-32 rounded mb-4" style={{ backgroundColor: 'var(--color-surface-overlay)' }} />
          <SkeletonText lines={4} />
        </div>
      ))}
    </div>
  )
}

export default function FAQPage() {
  const { t } = useTranslation()
  const { items: dbItems, loading } = useFAQ()
  const [activeCategory, setActiveCategory] = useState('all')

  // Gebruik DB items als beschikbaar, anders statische fallback
  const allItems = dbItems.length > 0 ? dbItems : STATIC_FAQ

  // Filter op categorie
  const filtered = activeCategory === 'all'
    ? allItems
    : allItems.filter((item) => item.category === activeCategory)

  // Groepeer per categorie voor weergave
  const grouped = FAQ_CATEGORIES
    .map((cat) => ({
      ...cat,
      items: filtered.filter((item) => item.category === cat.value),
    }))
    .filter((cat) => cat.items.length > 0)

  // Als "all" geselecteerd tonen we categoriegroepen; anders platte lijst
  const showGrouped = activeCategory === 'all'

  return (
    <>
      <PageHero
        label="Antwoorden op uw vragen"
        title="VEELGESTELDE"
        titleAccent="VRAGEN"
        subtitle="Alles wat u moet weten over onze diensten, boekingen en producten."
      />

      <section
        className="section-padding"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="container-ico">
          <div className="max-w-3xl mx-auto">

            {/* Categorie filter */}
            <div
              className="flex flex-wrap gap-2 mb-10"
              role="tablist"
              aria-label="FAQ categorieën"
            >
              <button
                role="tab"
                aria-selected={activeCategory === 'all'}
                onClick={() => setActiveCategory('all')}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 cursor-pointer"
                style={{
                  backgroundColor: activeCategory === 'all' ? 'var(--color-primary)' : 'var(--color-surface-overlay)',
                  color: activeCategory === 'all' ? '#fff' : 'var(--color-text-secondary)',
                  border: activeCategory === 'all' ? 'none' : '1px solid rgba(196,130,111,0.2)',
                }}
              >
                Alle vragen
              </button>
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  role="tab"
                  aria-selected={activeCategory === cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 cursor-pointer"
                  style={{
                    backgroundColor: activeCategory === cat.value ? 'var(--color-primary)' : 'var(--color-surface-overlay)',
                    color: activeCategory === cat.value ? '#fff' : 'var(--color-text-secondary)',
                    border: activeCategory === cat.value ? 'none' : '1px solid rgba(196,130,111,0.2)',
                  }}
                >
                  {cat.label_nl}
                </button>
              ))}
            </div>

            {/* FAQ Content */}
            {loading ? (
              <FAQSkeleton />
            ) : showGrouped ? (
              // Gegroepeerde weergave (alle categorieën)
              <div className="space-y-10">
                {grouped.map((cat) => (
                  <div key={cat.value}>
                    <div className="flex items-center gap-3 mb-4">
                      <HelpCircle
                        className="w-4 h-4"
                        style={{ color: 'var(--color-primary)' }}
                        aria-hidden="true"
                      />
                      <h2
                        className="text-sm font-semibold uppercase tracking-widest"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        {CATEGORY_LABELS[cat.value] || cat.label_nl}
                      </h2>
                    </div>
                    <div
                      className="rounded-xl overflow-hidden"
                      style={{
                        border: '1px solid rgba(196,130,111,0.15)',
                        backgroundColor: 'var(--color-surface-elevated)',
                      }}
                    >
                      <Accordion>
                        {cat.items.map((item) => (
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
                  </div>
                ))}
              </div>
            ) : (
              // Platte weergave (één categorie gefilterd)
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  border: '1px solid rgba(196,130,111,0.15)',
                  backgroundColor: 'var(--color-surface-elevated)',
                }}
              >
                <Accordion>
                  {filtered.map((item) => (
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
            )}

            {/* Geen resultaten */}
            {!loading && filtered.length === 0 && (
              <div className="text-center py-16">
                <HelpCircle
                  className="w-12 h-12 mx-auto mb-4"
                  style={{ color: 'var(--color-text-muted)', opacity: 0.4 }}
                  aria-hidden="true"
                />
                <p className="text-base" style={{ color: 'var(--color-text-secondary)' }}>
                  Geen vragen gevonden in deze categorie.
                </p>
              </div>
            )}

            {/* Nog een vraag? */}
            <div
              className="mt-14 rounded-xl px-6 py-7 text-center"
              style={{
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid rgba(196,130,111,0.2)',
              }}
            >
              <p
                className="text-base font-semibold mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Staat uw vraag er niet bij?
              </p>
              <p className="text-sm mb-5" style={{ color: 'var(--color-text-secondary)' }}>
                Neem contact op via WhatsApp of ons contactformulier. Wij antwoorden zo snel mogelijk.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  as="a"
                  href={whatsappLink(WHATSAPP_NUMBER, 'Hallo! Ik heb een vraag over jullie diensten.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="sm"
                  leftIcon={<MessageCircle className="w-4 h-4" />}
                >
                  Stel via WhatsApp
                </Button>
                <Button
                  as={Link}
                  to="/contact"
                  variant="secondary"
                  size="sm"
                  leftIcon={<Car className="w-4 h-4" />}
                >
                  Contactformulier
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
