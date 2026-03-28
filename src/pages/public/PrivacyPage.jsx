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

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        label="Juridisch"
        title="PRIVACYBELEID"
        subtitle="Hoe ICO omgaat met uw persoonsgegevens."
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

            <Section title="1. Verantwoordelijke voor de verwerking">
              <p>
                ICO — Intensive Cleaning Organization, gevestigd in Vlaanderen, België, is verantwoordelijk
                voor de verwerking van persoonsgegevens zoals beschreven in dit privacybeleid.
              </p>
              <p>
                Contact: <a href="mailto:info@ico-detailing.be" className="underline" style={{ color: 'var(--color-primary)' }}>info@ico-detailing.be</a>
              </p>
            </Section>

            <Section title="2. Welke gegevens verzamelen wij?">
              <p>Wij verzamelen de volgende persoonsgegevens:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Naam en voornaam</li>
                <li>E-mailadres</li>
                <li>Telefoonnummer</li>
                <li>Adresgegevens (voor de wasbeurt aan huis)</li>
                <li>Voertuiggegevens (type, merk)</li>
                <li>Betalingsinformatie (verwerkt via Mollie — wij slaan geen betaalgegevens op)</li>
                <li>Communicatiegeschiedenis (e-mail, WhatsApp)</li>
              </ul>
            </Section>

            <Section title="3. Waarvoor gebruiken wij uw gegevens?">
              <p>Uw persoonsgegevens worden gebruikt voor:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Het verwerken en bevestigen van boekingen</li>
                <li>Het afhandelen van bestellingen in onze webshop</li>
                <li>Communicatie over uw afspraak of bestelling</li>
                <li>Het sturen van een bevestigingsmail na boeking of aankoop</li>
                <li>Klantenservice en het beantwoorden van uw vragen</li>
                <li>Wettelijke verplichtingen (facturatie, BTW)</li>
              </ul>
            </Section>

            <Section title="4. Wettelijke grondslag">
              <p>
                Wij verwerken uw gegevens op basis van de volgende rechtsgrondslagen (AVG/GDPR):
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong style={{ color: 'var(--color-text-primary)' }}>Uitvoering van een overeenkomst</strong> — voor het verwerken van boekingen en bestellingen</li>
                <li><strong style={{ color: 'var(--color-text-primary)' }}>Wettelijke verplichting</strong> — voor facturatie en belastingaangifte</li>
                <li><strong style={{ color: 'var(--color-text-primary)' }}>Toestemming</strong> — voor marketingcommunicatie (indien van toepassing)</li>
                <li><strong style={{ color: 'var(--color-text-primary)' }}>Gerechtvaardigd belang</strong> — voor klantenservice</li>
              </ul>
            </Section>

            <Section title="5. Bewaartermijn">
              <p>
                Wij bewaren uw persoonsgegevens niet langer dan nodig is voor de doeleinden waarvoor ze
                zijn verzameld:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Boeking- en ordergegevens: 7 jaar (wettelijke bewaarplicht voor boekhouding)</li>
                <li>Contactformuliergegevens: 1 jaar na laatste contact</li>
                <li>Marketinglijsten: tot u zich uitschrijft of toestemming intrekt</li>
              </ul>
            </Section>

            <Section title="6. Delen met derden">
              <p>
                Wij delen uw gegevens niet met derden, behalve:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong style={{ color: 'var(--color-text-primary)' }}>Mollie</strong> — voor het verwerken van betalingen</li>
                <li><strong style={{ color: 'var(--color-text-primary)' }}>Supabase</strong> — als hostingprovider van onze database (servers in de EU)</li>
                <li><strong style={{ color: 'var(--color-text-primary)' }}>Resend</strong> — voor het verzenden van transactionele e-mails</li>
                <li>Overheidsinstanties, indien wettelijk verplicht</li>
              </ul>
              <p>
                Alle derde partijen zijn GDPR-conform en verwerken uw gegevens uitsluitend op onze instructies.
              </p>
            </Section>

            <Section title="7. Uw rechten">
              <p>Onder de AVG heeft u de volgende rechten:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong style={{ color: 'var(--color-text-primary)' }}>Recht op inzage</strong> — u kunt opvragen welke gegevens wij van u hebben</li>
                <li><strong style={{ color: 'var(--color-text-primary)' }}>Recht op rectificatie</strong> — onjuiste gegevens laten corrigeren</li>
                <li><strong style={{ color: 'var(--color-text-primary)' }}>Recht op verwijdering</strong> — uw gegevens laten wissen ("recht om vergeten te worden")</li>
                <li><strong style={{ color: 'var(--color-text-primary)' }}>Recht op beperking</strong> — verwerking beperken in bepaalde gevallen</li>
                <li><strong style={{ color: 'var(--color-text-primary)' }}>Recht op overdraagbaarheid</strong> — uw gegevens in een leesbaar formaat ontvangen</li>
                <li><strong style={{ color: 'var(--color-text-primary)' }}>Recht van bezwaar</strong> — bezwaar maken tegen verwerking</li>
              </ul>
              <p>
                Om een van deze rechten uit te oefenen, neemt u contact op via{' '}
                <a href="mailto:info@ico-detailing.be" className="underline" style={{ color: 'var(--color-primary)' }}>info@ico-detailing.be</a>.
                Wij reageren binnen 30 dagen.
              </p>
            </Section>

            <Section title="8. Cookies">
              <p>
                Onze website gebruikt functionele cookies voor het correct werken van de site (o.a. taalvoorkeur,
                winkelwagen). Wij gebruiken geen tracking- of advertentiecookies van derden.
              </p>
            </Section>

            <Section title="9. Beveiliging">
              <p>
                Wij nemen passende technische en organisatorische maatregelen om uw gegevens te beschermen
                tegen ongeautoriseerde toegang, verlies of misbruik. Onze website maakt gebruik van HTTPS-versleuteling.
              </p>
            </Section>

            <Section title="10. Klachten">
              <p>
                Heeft u een klacht over de manier waarop wij uw persoonsgegevens verwerken? U kunt een klacht
                indienen bij de Gegevensbeschermingsautoriteit (GBA):
              </p>
              <p>
                <a
                  href="https://www.gegevensbeschermingsautoriteit.be"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                  style={{ color: 'var(--color-primary)' }}
                >
                  www.gegevensbeschermingsautoriteit.be
                </a>
              </p>
            </Section>

            <Section title="11. Wijzigingen">
              <p>
                Wij kunnen dit privacybeleid van tijd tot tijd wijzigen. De meest recente versie is altijd
                beschikbaar op deze pagina. Bij ingrijpende wijzigingen informeren wij u per e-mail.
              </p>
            </Section>

            <div
              className="mt-8 pt-6 flex flex-wrap gap-4"
              style={{ borderTop: '1px solid rgba(196,130,111,0.15)' }}
            >
              <Link
                to="/voorwaarden"
                className="text-sm underline transition-colors duration-150"
                style={{ color: 'var(--color-primary)' }}
              >
                Algemene voorwaarden
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
