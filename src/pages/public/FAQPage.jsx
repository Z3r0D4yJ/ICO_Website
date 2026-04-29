import { useState } from 'react'
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
    answer_nl: 'Gemiddeld nemen onze behandelingen zo\'n 2 uur in beslag, afhankelijk van de staat van het voertuig. We proberen steeds met twee personen te werken om de tijd zo efficiënt mogelijk te houden — twee paar handen = sneller klaar én dubbel zo grondig.',
  },
  {
    id: 's2',
    category: 'diensten',
    question_nl: 'Wat is inbegrepen bij een Dieptereiniging?',
    answer_nl: 'Bij een dieptereiniging reinigen we de zetels en tapijten grondig met een professionele extractiemachine om vuil, vlekken en geuren te verwijderen. Voor het beste resultaat raden we aan dit te combineren met een DetailWash — een proper interieur verdient ook een proper exterieur.',
  },
  {
    id: 's3',
    category: 'diensten',
    question_nl: 'Wat is Paint Protection Film (PPF)?',
    answer_nl: 'PPF is een transparante, zelfherstellende folie die op de lak van uw voertuig wordt aangebracht. Het beschermt tegen steenslag, krassen, insecten en weersinvloeden. PPF wordt uitsluitend aangebracht in onze garage in Hamme, waar de ideale omstandigheden (licht, stofvrij, temperatuur) een perfect resultaat garanderen. Ook voor woninginterieurs zoals keukens.',
  },
  {
    id: 's4',
    category: 'diensten',
    question_nl: 'Welke voertuigen behandelen jullie?',
    answer_nl: 'Wij behandelen auto\'s (sedan, hatchback, coupé), SUV\'s, bestelwagens én motoren. Voor elk voertuigtype passen we de aanpak en prijszetting aan. Twijfelt u? Stuur ons een berichtje en we helpen u vrijblijvend verder.',
  },
  {
    id: 's5',
    category: 'diensten',
    question_nl: 'Wat is Home Care bij ICO?',
    answer_nl: 'Naast voertuigen behandelen wij ook woninginterieurs. Denk aan PPF-bescherming voor meubeloppervlakken of het volledig wrappen van een keuken. Een unieke dienst die wij als één van de weinigen in België aanbieden.',
  },
  {
    id: 's6',
    category: 'boekingen',
    question_nl: 'Hoe maak ik een afspraak bij ICO?',
    answer_nl: 'Neem contact op via het contactformulier op onze website of via onze socials (Instagram, Facebook of WhatsApp). Vermeld zeker het type voertuig en de gewenste dienst, dan helpen Rico & Nico je zo snel mogelijk verder.',
  },
  {
    id: 's7',
    category: 'boekingen',
    question_nl: 'Komen jullie bij mij thuis of moet ik naar jullie komen?',
    answer_nl: 'Dat hangt af van de dienst. Voor wasbeurten (DetailWash, Dieptereiniging) komt de Washbus naar u toe — thuis, op het werk of elke locatie in Vlaanderen. Voor keramische coating en PPF moet u naar onze garage in Hamme komen. Daar hebben we professionele verlichting en een gecontroleerde omgeving voor een vlekkeloos resultaat.',
  },
  {
    id: 's8',
    category: 'boekingen',
    question_nl: 'Kan ik mijn afspraak annuleren of verplaatsen?',
    answer_nl: 'Annuleren of verplaatsen kan kosteloos tot 24 uur voor de afspraak. Neem contact met ons op via WhatsApp of e-mail om uw afspraak te wijzigen.',
  },
  {
    id: 's9',
    category: 'boekingen',
    question_nl: 'Wat is het werkgebied van ICO?',
    answer_nl: 'Wij zijn actief in heel Vlaanderen — 6 dagen op 7. Of u nu in Antwerpen, Gent, Leuven of Brugge woont, wij komen naar u toe. Twijfelt u of uw locatie in ons werkgebied ligt? Stuur ons gerust een berichtje.',
  },
  {
    id: 's10',
    category: 'webshop',
    question_nl: 'Welke betaalmethoden accepteren jullie in de webshop?',
    answer_nl: 'In de webshop kunt u betalen via Bancontact, Visa, Mastercard en andere veelgebruikte betaalmethoden via ons veilig betalingssysteem. Alle prijzen zijn inclusief 21% BTW — geen verrassingen achteraf.',
  },
  {
    id: 's11',
    category: 'webshop',
    question_nl: 'Wat zijn de CleanTech producten?',
    answer_nl: 'CleanTech is onze eigen professionele productlijn — dezelfde producten die Rico & Nico dagelijks gebruiken bij hun klanten. Van keramische coating tot microvezel droogdoeken: beschikbaar via onze webshop.',
  },
  {
    id: 's12',
    category: 'algemeen',
    question_nl: 'Hoe kan ik contact opnemen met ICO?',
    answer_nl: 'Bereik ons via het contactformulier op onze website, of direct via Instagram, Facebook of WhatsApp. WhatsApp is ons snelste kanaal — Rico & Nico reageren doorgaans snel tijdens werkdagen.',
  },
  {
    id: 's13',
    category: 'algemeen',
    question_nl: 'Zijn alle prijzen inclusief BTW?',
    answer_nl: 'Ja! Alle weergegeven prijzen op onze website zijn inclusief 21% BTW. Geen verborgen kosten, geen verrassingen achteraf — wat u ziet is wat u betaalt.',
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
        title="Veelgestelde"
        titleAccent="vragen"
        subtitle="Praktische antwoorden over behandelingen, boekingen, CleanTech producten en de manier waarop Rico & Nico werken."
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
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                style={
                  activeCategory === 'all'
                    ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }
                    : { backgroundColor: 'var(--color-surface-elevated)', color: 'var(--color-text-secondary)', border: '1px solid rgba(196,130,111,0.2)' }
                }
              >
                Alle vragen
              </button>
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  role="tab"
                  aria-selected={activeCategory === cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                  style={
                    activeCategory === cat.value
                      ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }
                      : { backgroundColor: 'var(--color-surface-elevated)', color: 'var(--color-text-secondary)', border: '1px solid rgba(196,130,111,0.2)' }
                  }
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
