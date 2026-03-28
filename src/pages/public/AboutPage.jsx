import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight, MapPin, Star, Car, Users, Sparkle, MessageCircle, Image } from '@/lib/icons'
import Button from '@/components/ui/Button'
import CTASection from '@/components/home/CTASection'
import { WHATSAPP_NUMBER, SERVICE_CATEGORIES } from '@/lib/constants'
import { whatsappLink } from '@/lib/utils'
import { useProjects } from '@/hooks/useProjects'

// ── ICO eigen foto's ────────────────────────────────────────────────────────────
const PHOTOS = {
  hero:    '/images/porsche-taycan-zonsondergang.jpg',
  team:    '/images/rico-interieur-reiniging.jpg',
  rico:    '/images/rico-interieur-reiniging.jpg',
  nico:    '/images/nico-exterieur-behandeling.jpg',
  washbus: '/images/washbus.webp',
}

const STATS = [
  { value: '500+', label: 'Wagens gereinigd' },
  { value: '98%', label: 'Tevreden klanten' },
  { value: '2',   label: 'Man sterk team' },
  { value: 'Vlndrn', label: 'Werkgebied' },
]

const VALUES = [
  { icon: Star,       title: 'Kwaliteit boven alles', desc: 'Elk detail telt. We nemen de tijd die het nodig heeft — niet meer, niet minder.' },
  { icon: Car,        title: 'Mobiel & flexibel',     desc: 'Wij komen naar jou. Thuis, op het werk, overal in Vlaanderen.' },
  { icon: Users,      title: 'Persoonlijke service',  desc: 'Je werkt altijd rechtstreeks met Rico of Nico. Geen tussenpersonen.' },
  { icon: Sparkle,    title: 'Premium producten',     desc: 'Alleen de beste CleanTech producten — dezelfde die wij zelf ook vertrouwen.' },
]

const WASHBUS_FEATURES = [
  'Eigen watervoorraad — geen aansluiting nodig',
  'Professionele extractiemachine aan boord',
  'Stille generator voor stroom op elke locatie',
  'Volledig CleanTech productensortiment mee',
  'Dubbelwandige laadruimte voor materiaal',
  'GPS-tracking voor optimale routeplanning',
]

function serviceLabel(value) {
  return SERVICE_CATEGORIES.find((c) => c.value === value)?.label_nl ?? value
}

export default function AboutPage() {
  const { projects } = useProjects()
  const recentProjects = projects.slice(0, 6)
  return (
    <>
      {/* ── Hero met foto-achtergrond ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '70vh', display: 'flex', alignItems: 'flex-end' }}>
        {/* Achtergrond foto */}
        <div className="absolute inset-0">
          <img
            src={PHOTOS.hero}
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
            aria-hidden="true"
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, var(--color-surface) 15%, rgba(17,16,16,0.65) 60%, rgba(17,16,16,0.4) 100%)' }}
          />
        </div>

        {/* Content */}
        <div className="container-ico relative z-10 pb-16 md:pb-24 pt-32">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
            Leer ons kennen
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              color: '#fff',
              letterSpacing: '0.03em',
              lineHeight: 1.0,
            }}
          >
            OVER <span style={{ color: 'var(--color-primary)' }}>TEAM ICO</span>
          </h1>
          <p
            className="mt-4 max-w-xl text-base md:text-lg"
            style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.65 }}
          >
            Premium mobile car detailing door Rico & Nico — twee gedreven vakmensen die van elke wasbeurt een belevenis maken.
          </p>
        </div>
      </section>

      {/* ── Ons verhaal ── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container-ico">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Foto */}
            <div className="relative">
              <div
                className="rounded-2xl overflow-hidden"
                style={{ aspectRatio: '4/3', border: '1px solid rgba(196,130,111,0.2)' }}
              >
                <img
                  src={PHOTOS.team}
                  alt="Rico en Nico aan het werk"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Gouden accent */}
              <div
                className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl -z-10"
                aria-hidden="true"
                style={{ backgroundColor: 'rgba(196,130,111,0.15)', border: '1px solid rgba(196,130,111,0.3)' }}
              />
            </div>

            {/* Tekst */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
                Ons verhaal
              </p>
              <h2
                className="mb-6"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--color-text-primary)', letterSpacing: '0.03em', lineHeight: 1.1 }}
              >
                PASSIE VOOR <span style={{ color: 'var(--color-primary)' }}>PERFECTIE</span>
              </h2>
              <div className="divider-gold mb-6" style={{ marginLeft: 0 }} aria-hidden="true" />

              <div className="space-y-4 text-base" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.75 }}>
                <p>
                  ICO — Intensive Cleaning Organization — is ontstaan vanuit een gedeelde passie voor auto's en een obsessie met detail. Rico en Nico, twee vrienden uit Vlaanderen, begonnen in hun vrije tijd met het detailen van wagens in de buurt. Wat als hobby startte, groeide snel uit tot een serieuze onderneming.
                </p>
                <p>
                  Vandaag rijden ze met hun volledig uitgeruste Washbus door heel Vlaanderen en brengen ze een premium wasbeurt rechtstreeks naar de klant. Geen wasstraat, geen gedoe — gewoon vakmanschap aan huis.
                </p>
                <p>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Hun motto?</strong> Elke auto verdient de beste behandeling. Of het nu een dagelijkse rijder is of een exclusieve sportwagen — ze geven altijd 100%.
                </p>
              </div>

              <div className="mt-8 flex gap-4">
                <Button
                  as={Link}
                  to="/boeken"
                  variant="primary"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Maak een afspraak
                </Button>
                <Button
                  as="a"
                  href={whatsappLink(WHATSAPP_NUMBER, 'Hallo, ik wil graag meer info over jullie diensten.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="ghost"
                  leftIcon={<MessageCircle className="w-4 h-4" />}
                >
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ backgroundColor: 'var(--color-surface-elevated)', borderTop: '1px solid rgba(196,130,111,0.15)', borderBottom: '1px solid rgba(196,130,111,0.15)' }}>
        <div className="container-ico py-10 md:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'var(--color-primary)', lineHeight: 1, letterSpacing: '0.02em' }}
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Het team ── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container-ico">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              De mensen achter ICO
            </p>
            <h2
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--color-text-primary)', letterSpacing: '0.03em' }}
            >
              MAAK KENNIS MET HET <span style={{ color: 'var(--color-primary)' }}>TEAM</span>
            </h2>
            <div className="divider-gold mt-4" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Rico */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
            >
              <div className="w-full" style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                <img
                  src={PHOTOS.rico}
                  alt="Rico — medeoprichter ICO"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--color-text-primary)', letterSpacing: '0.02em' }}>Rico</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(196,130,111,0.12)', color: 'var(--color-primary)' }}>Co-founder</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                  Rico is de perfectionist van het duo. Gespecialiseerd in coating, PPF en alles wat met lakbehandeling te maken heeft. Hij staat erop dat elk detail klopt voor de klant vertrekt.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  <span>Actief in heel Vlaanderen</span>
                </div>
              </div>
            </div>

            {/* Nico */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
            >
              <div className="w-full" style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                <img
                  src={PHOTOS.nico}
                  alt="Nico — medeoprichter ICO"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--color-text-primary)', letterSpacing: '0.02em' }}>Nico</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(196,130,111,0.12)', color: 'var(--color-primary)' }}>Co-founder</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                  Nico is de organisator en klantencontact. Hij zorgt dat elke boeking vlot verloopt en dat klanten altijd weten wat ze kunnen verwachten. Specialiteit: interieur reiniging en dieptereiniging.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  <span>Actief in heel Vlaanderen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── De Washbus ── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
        <div className="container-ico">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Tekst links */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
                Ons geheim wapen
              </p>
              <h2
                className="mb-5"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--color-text-primary)', letterSpacing: '0.03em', lineHeight: 1.1 }}
              >
                DE <span style={{ color: 'var(--color-primary)' }}>WASHBUS</span>
              </h2>
              <div className="divider-gold mb-6" style={{ marginLeft: 0 }} aria-hidden="true" />
              <p className="text-base mb-8" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.75 }}>
                Onze volledig uitgeruste Washbus is meer dan een bestelwagen — het is ons rijdend laboratorium. Geen wateraansluiting nodig, geen stopcontact. Wij brengen alles mee voor een perfecte wasbeurt, waar je ook bent in Vlaanderen.
              </p>

              <ul className="space-y-3 mb-8" role="list">
                {WASHBUS_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Foto rechts */}
            <div className="relative">
              <div
                className="rounded-2xl overflow-hidden"
                style={{ aspectRatio: '4/3', border: '1px solid rgba(196,130,111,0.2)' }}
              >
                <img
                  src={PHOTOS.washbus}
                  alt="De ICO Washbus"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(17,16,16,0.4) 0%, transparent 50%)' }}
                  aria-hidden="true"
                />
              </div>
              {/* Gouden accent */}
              <div
                className="absolute -top-4 -left-4 w-32 h-32 rounded-2xl -z-10"
                aria-hidden="true"
                style={{ backgroundColor: 'rgba(196,130,111,0.1)', border: '1px solid rgba(196,130,111,0.25)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Onze waarden ── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container-ico">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Waar wij voor staan
            </p>
            <h2
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--color-text-primary)', letterSpacing: '0.03em' }}
            >
              ONZE <span style={{ color: 'var(--color-primary)' }}>WAARDEN</span>
            </h2>
            <div className="divider-gold mt-4" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl p-6"
                style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'rgba(196,130,111,0.1)', border: '1px solid rgba(196,130,111,0.25)' }}
                >
                  <Icon className="w-6 h-6" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
                </div>
                <h3
                  className="mb-2"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-text-primary)', letterSpacing: '0.02em' }}
                >
                  {title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projecten galerij ── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
        <div className="container-ico">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Ons werk spreekt voor zich
            </p>
            <h2
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--color-text-primary)', letterSpacing: '0.03em' }}
            >
              RECENTE <span style={{ color: 'var(--color-primary)' }}>PROJECTEN</span>
            </h2>
            <div className="divider-gold mt-4" aria-hidden="true" />
          </div>

          {recentProjects.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {recentProjects.map((project, i) => {
                const label = [
                  project.service_type ? serviceLabel(project.service_type) : null,
                  project.vehicle_brand,
                ].filter(Boolean).join(' — ')
                return (
                  <Link
                    key={project.id}
                    to={`/projecten/${project.slug}`}
                    className="group relative rounded-xl overflow-hidden"
                    style={{
                      aspectRatio: i % 5 === 0 || i % 5 === 3 ? '3/4' : '4/3',
                      border: '1px solid rgba(196,130,111,0.2)',
                    }}
                  >
                    {project.cover_image_url ? (
                      <img
                        src={project.cover_image_url}
                        alt={project.title_nl}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-surface) 100%)' }}
                        aria-hidden="true"
                      >
                        <Image className="w-10 h-10 opacity-20" style={{ color: 'var(--color-primary)' }} />
                      </div>
                    )}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end"
                      style={{ background: 'linear-gradient(to top, rgba(17,16,16,0.85) 0%, transparent 60%)' }}
                    >
                      <p className="p-4 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                        {label || project.title_nl}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          <div className="text-center mt-10">
            <Button
              as={Link}
              to="/projecten"
              variant="secondary"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Bekijk alle projecten
            </Button>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
