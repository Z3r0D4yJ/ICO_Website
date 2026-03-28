import { Link } from 'react-router-dom'
import PageHero from '@/components/ui/PageHero'

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2
        className="mb-4"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.5rem',
          color: 'var(--color-text-primary)',
          letterSpacing: '0.02em',
        }}
      >
        {title}
      </h2>
      <div
        className="space-y-3 text-sm leading-relaxed"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {children}
      </div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <>
      <PageHero
        label="Juridisch"
        title="ALGEMENE VOORWAARDEN"
        subtitle="Voorwaarden voor het gebruik van onze diensten en webshop."
        size="sm"
      />

      <section
        className="section-padding"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="container-ico">
          <div
            className="max-w-3xl mx-auto rounded-2xl p-6 md:p-10"
            style={{
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid rgba(196,130,111,0.15)',
            }}
          >
            <p className="text-xs mb-8" style={{ color: 'var(--color-text-muted)' }}>
              Laatste update: januari 2025
            </p>

            <Section title="1. Identiteit van de onderneming">
              <p>
                <strong style={{ color: 'var(--color-text-primary)' }}>ICO — Intensive Cleaning Organization</strong><br />
                Gevestigd in Vlaanderen, België<br />
                E-mail: <a href="mailto:info@ico-detailing.be" className="underline" style={{ color: 'var(--color-primary)' }}>info@ico-detailing.be</a>
              </p>
            </Section>

            <Section title="2. Toepasselijkheid">
              <p>
                Deze algemene voorwaarden zijn van toepassing op alle diensten, offertes, boekingen en
                aankopen via de website van ICO. Door gebruik te maken van onze diensten of onze website,
                aanvaardt u deze voorwaarden.
              </p>
              <p>
                ICO behoudt zich het recht voor deze voorwaarden te wijzigen. De meest recente versie
                is altijd beschikbaar op deze pagina.
              </p>
            </Section>

            <Section title="3. Diensten en boekingen">
              <p>
                <strong style={{ color: 'var(--color-text-primary)' }}>3.1 Aanbod</strong><br />
                Alle vermelde diensten en prijzen zijn onder voorbehoud van beschikbaarheid. Prijzen zijn
                inclusief BTW tenzij anders vermeld.
              </p>
              <p>
                <strong style={{ color: 'var(--color-text-primary)' }}>3.2 Totstandkoming overeenkomst</strong><br />
                Een boeking is geldig zodra u een bevestigingsmail ontvangt van ICO. Wij behouden ons het
                recht voor een boeking te weigeren zonder opgave van reden.
              </p>
              <p>
                <strong style={{ color: 'var(--color-text-primary)' }}>3.3 Annulering door de klant</strong><br />
                Kosteloos annuleren is mogelijk tot 24 uur voor de afgesproken datum. Bij annulering binnen
                24 uur kan ICO een annuleringsvergoeding van 50% van de dienstprijs aanrekenen.
              </p>
              <p>
                <strong style={{ color: 'var(--color-text-primary)' }}>3.4 Annulering door ICO</strong><br />
                ICO behoudt zich het recht voor een afspraak te annuleren wegens overmacht (extreme weersomstandigheden,
                ziekte, etc.). Wij contacteren u zo vroeg mogelijk en stellen een alternatieve datum voor.
              </p>
              <p>
                <strong style={{ color: 'var(--color-text-primary)' }}>3.5 Klantverplichtingen</strong><br />
                De klant zorgt ervoor dat ICO toegang heeft tot water en elektriciteit op de locatie van de wasbeurt.
                Indien dit niet beschikbaar is, kan ICO de dienst uitstellen of annuleren.
              </p>
            </Section>

            <Section title="4. Prijzen en betaling">
              <p>
                <strong style={{ color: 'var(--color-text-primary)' }}>4.1 Prijsindicaties</strong><br />
                Vermelde prijzen zijn indicatief. De definitieve prijs wordt bepaald na inspectie van het voertuig
                en gecommuniceerd voor de start van de werkzaamheden.
              </p>
              <p>
                <strong style={{ color: 'var(--color-text-primary)' }}>4.2 Betaling diensten</strong><br />
                Betaling voor detailing-diensten gebeurt ter plaatse na uitvoering, contant of via overschrijving,
                tenzij anders overeengekomen.
              </p>
              <p>
                <strong style={{ color: 'var(--color-text-primary)' }}>4.3 Betaling webshop</strong><br />
                Betalingen in de webshop worden verwerkt via Mollie. Uw bestelling wordt verwerkt zodra de
                betaling is bevestigd.
              </p>
            </Section>

            <Section title="5. Webshop">
              <p>
                <strong style={{ color: 'var(--color-text-primary)' }}>5.1 Herroepingsrecht</strong><br />
                Als consument heeft u het recht uw aankoop binnen 14 dagen na ontvangst te annuleren zonder
                opgave van reden (Wet Marktpraktijken). Producten moeten ongebruikt en in originele verpakking
                worden teruggestuurd.
              </p>
              <p>
                <strong style={{ color: 'var(--color-text-primary)' }}>5.2 Levering</strong><br />
                Wij streven naar levering binnen 3-5 werkdagen na bevestiging. ICO is niet aansprakelijk voor
                vertragingen door de vervoerder.
              </p>
              <p>
                <strong style={{ color: 'var(--color-text-primary)' }}>5.3 Beschadigde producten</strong><br />
                Bij ontvangst van beschadigde producten meldt u dit binnen 48 uur via{' '}
                <a href="mailto:info@ico-detailing.be" className="underline" style={{ color: 'var(--color-primary)' }}>info@ico-detailing.be</a>.
                Wij streven naar een snelle oplossing.
              </p>
            </Section>

            <Section title="6. Aansprakelijkheid">
              <p>
                ICO voert haar werkzaamheden professioneel en zorgvuldig uit. Eventuele schade aan het voertuig
                als gevolg van nalatigheid door ICO wordt vergoed na vaststelling en beoordeling.
              </p>
              <p>
                ICO is niet aansprakelijk voor:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Pre-existente schade aan het voertuig (rook, deuken, lakschade)</li>
                <li>Verlies of schade aan voorwerpen achtergelaten in het voertuig</li>
                <li>Indirecte of gevolgschade</li>
              </ul>
              <p>
                Wij raden aan waardevolle voorwerpen voor de wasbeurt uit het voertuig te verwijderen.
              </p>
            </Section>

            <Section title="7. Klachten">
              <p>
                Klachten over onze diensten of producten kunt u indienen via{' '}
                <a href="mailto:info@ico-detailing.be" className="underline" style={{ color: 'var(--color-primary)' }}>info@ico-detailing.be</a>{' '}
                of via WhatsApp. Wij streven naar een oplossing binnen 5 werkdagen.
              </p>
              <p>
                Als wij er samen niet uitkomen, kunt u een klacht indienen bij de Belgische
                consumentenombudsdienst:{' '}
                <a
                  href="https://www.ombudsman.be"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                  style={{ color: 'var(--color-primary)' }}
                >
                  www.ombudsman.be
                </a>
              </p>
            </Section>

            <Section title="8. Toepasselijk recht">
              <p>
                Deze voorwaarden zijn onderworpen aan het Belgisch recht. Geschillen worden voorgelegd aan
                de rechtbanken van het arrondissement waar ICO gevestigd is.
              </p>
            </Section>

            <div
              className="mt-8 pt-6 flex flex-wrap gap-4"
              style={{ borderTop: '1px solid rgba(196,130,111,0.15)' }}
            >
              <Link
                to="/privacy"
                className="text-sm underline transition-colors duration-150"
                style={{ color: 'var(--color-primary)' }}
              >
                Privacybeleid
              </Link>
              <Link
                to="/contact"
                className="text-sm underline transition-colors duration-150"
                style={{ color: 'var(--color-primary)' }}
              >
                Contact opnemen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
