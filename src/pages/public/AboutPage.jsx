import { Link } from 'react-router-dom'
import { ArrowRight, Car, CheckCircle2, Image, MapPin, MessageCircle, Sparkle, Star, Users } from '@/lib/icons'
import { SERVICE_CATEGORIES, WHATSAPP_NUMBER } from '@/lib/constants'
import { whatsappLink } from '@/lib/utils'
import { useProjects } from '@/hooks/useProjects'
import Button from '@/components/ui/Button'
import CTASection from '@/components/home/CTASection'

const PHOTOS = {
  hero: '/images/rico&nico_copy.jpg',
  team: '/images/rico-interieur-reiniging.jpg',
  rico: '/images/rico-interieur-reiniging.jpg',
  nico: '/images/nico-exterieur-behandeling.jpg',
  washbus: '/images/washbus.webp',
}

const STATS = [
  { value: '500+', label: 'Wagens behandeld' },
  { value: '2', label: 'Vaste vakmensen' },
  { value: '6/7', label: 'Dagen onderweg' },
  { value: 'Vlaanderen', label: 'Werkgebied' },
]

const VALUES = [
  {
    icon: Star,
    title: 'Rustige perfectie',
    desc: 'Geen haastwerk. Elke wagen krijgt de aandacht die de lak, velgen en het interieur vragen.',
  },
  {
    icon: Car,
    title: 'Mobiel waar het kan',
    desc: 'Met de Washbus komen Rico & Nico naar thuis, werk of bedrijfslocatie wanneer de behandeling dat toelaat.',
  },
  {
    icon: Users,
    title: 'Altijd persoonlijk',
    desc: 'Je spreekt rechtstreeks met de mensen die de behandeling uitvoeren. Dat houdt afspraken helder.',
  },
  {
    icon: Sparkle,
    title: 'Producten met reden',
    desc: 'CleanTech producten worden gekozen vanuit dagelijks gebruik, niet omdat ze mooi in een rek staan.',
  },
]

const WASHBUS_FEATURES = [
  'Eigen materiaal en professionele producten aan boord',
  'Mobiele behandelingen op locatie in Vlaanderen',
  'Interieurreiniging, handwas en onderhoud op maat',
  'Duidelijke voorbereiding voor coating, PPF en garagewerk',
]

function serviceLabel(value) {
  return SERVICE_CATEGORIES.find((c) => c.value === value)?.label_nl ?? value
}

export default function AboutPage() {
  const { projects } = useProjects()
  const recentProjects = projects.slice(0, 6)

  return (
    <>
      <section className="relative flex min-h-[72vh] items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={PHOTOS.hero} alt="" className="h-full w-full object-cover" loading="eager" aria-hidden="true" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-surface)_8%,rgba(8,7,6,0.72)_58%,rgba(8,7,6,0.35)_100%)]" />
        </div>

        <div className="container-ico relative z-10 pb-16 pt-32 md:pb-24">
          <p className="edit-eyebrow">Rico & Nico</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[0.98] text-[var(--bone-000)] sm:text-6xl lg:text-7xl">
            De handen achter ICO.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--bone-200)] md:text-lg">
            Twee vakmensen met een gedeelde obsessie voor nette lijnen, eerlijke uitleg en auto&apos;s die weer verzorgd aanvoelen.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button as={Link} to="/boeken" variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Boek een behandeling
            </Button>
            <Button
              as="a"
              href={whatsappLink(WHATSAPP_NUMBER, 'Hallo Rico en Nico, ik wil graag meer weten over ICO.')}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              leftIcon={<MessageCircle className="h-4 w-4" />}
            >
              Stel je vraag
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[var(--color-surface)]">
        <div className="container-ico grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
          <div className="relative">
            <div className="ico-media aspect-[4/3] overflow-hidden rounded-[var(--radius-xl)]">
              <img src={PHOTOS.team} alt="Rico en Nico aan het werk" className="h-full w-full object-cover" loading="lazy" />
            </div>
          </div>

          <div>
            <p className="edit-eyebrow">Ons verhaal</p>
            <h2 className="edit-sec-title mt-4">Passie zonder afstand.</h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--bone-200)]">
              <p>
                ICO is begonnen vanuit liefde voor wagens en het plezier van zichtbaar resultaat. Rico en Nico merkten dat klanten niet alleen een propere auto zoeken, maar ook iemand die uitlegt wat er gebeurt en waarom.
              </p>
              <p>
                Vandaag combineren ze mobiele service met garagebehandelingen in Hamme. De Washbus maakt onderhoud makkelijk op locatie, terwijl coating, PPF en intensiever werk in een gecontroleerde omgeving gebeuren.
              </p>
              <p className="font-medium text-[var(--bone-000)]">
                Het doel blijft simpel: premium verzorging die warm, duidelijk en persoonlijk blijft.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--color-border)] bg-[var(--ink-100)]">
        <div className="container-ico grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl text-[var(--copper-200)] md:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm text-[var(--bone-300)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding bg-[var(--color-surface)]">
        <div className="container-ico">
          <div className="mb-10 max-w-2xl">
            <p className="edit-eyebrow">Het team</p>
            <h2 className="edit-sec-title mt-4">Twee gezichten, een standaard.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                name: 'Rico',
                role: 'Lak, coating en afwerking',
                image: PHOTOS.rico,
                text: 'Rico kijkt naar het oppervlak: glans, bescherming, voorbereiding en de kleine details die een behandeling echt strak maken.',
              },
              {
                name: 'Nico',
                role: 'Interieur, planning en klantcontact',
                image: PHOTOS.nico,
                text: 'Nico bewaakt de flow van aanvraag tot oplevering en houdt behandelingen praktisch, duidelijk en netjes uitgevoerd.',
              },
            ].map((member) => (
              <article key={member.name} className="ico-panel overflow-hidden">
                <div className="ico-media aspect-[4/3] overflow-hidden bg-[var(--ink-200)]">
                  <img src={member.image} alt={`${member.name} van ICO`} className="h-full w-full object-cover object-top" loading="lazy" />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display text-3xl text-[var(--bone-000)]">{member.name}</h3>
                      <p className="mt-1 text-sm text-[var(--copper-200)]">{member.role}</p>
                    </div>
                    <span className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--bone-300)]">
                      ICO
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--bone-300)]">{member.text}</p>
                  <p className="mt-5 flex items-center gap-2 text-xs text-[var(--bone-400)]">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    Actief in Vlaanderen
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-[var(--ink-100)]">
        <div className="container-ico grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="edit-eyebrow">De Washbus</p>
            <h2 className="edit-sec-title mt-4">Een atelier op wielen.</h2>
            <p className="mt-5 text-base leading-relaxed text-[var(--bone-200)]">
              Voor mobiele behandelingen brengt ICO de werkomgeving mee. Zo blijft de afspraak makkelijk voor de klant en blijft de uitvoering professioneel.
            </p>
            <ul className="mt-7 grid gap-3">
              {WASHBUS_FEATURES.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm text-[var(--bone-200)]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--signal-go)]" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="ico-media aspect-[4/3] overflow-hidden rounded-[var(--radius-xl)]">
            <img src={PHOTOS.washbus} alt="De ICO Washbus" className="h-full w-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="section-padding bg-[var(--color-surface)]">
        <div className="container-ico">
          <div className="mb-10 max-w-2xl">
            <p className="edit-eyebrow">Waar ICO voor staat</p>
            <h2 className="edit-sec-title mt-4">Premium, maar nooit kil.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <article key={title} className="ico-panel p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[rgba(250,246,241,0.035)] text-[var(--copper-300)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-2xl text-[var(--bone-000)]">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--bone-300)]">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {recentProjects.length > 0 && (
        <section className="section-padding bg-[var(--ink-100)]">
          <div className="container-ico">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="edit-eyebrow">Recent werk</p>
                <h2 className="edit-sec-title mt-4">Resultaten uit de praktijk.</h2>
              </div>
              <Button as={Link} to="/projecten" variant="secondary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Alle projecten
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {recentProjects.map((project, index) => {
                const label = [
                  project.service_type ? serviceLabel(project.service_type) : null,
                  project.vehicle_brand,
                ].filter(Boolean).join(' - ')

                return (
                  <Link
                    key={project.id}
                    to={`/projecten/${project.slug}`}
                    className="group ico-media relative overflow-hidden rounded-[var(--radius-lg)]"
                    style={{ aspectRatio: index % 5 === 0 || index % 5 === 3 ? '3/4' : '4/3' }}
                  >
                    {project.cover_image_url ? (
                      <img src={project.cover_image_url} alt={project.title_nl} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-[var(--ink-200)] text-[var(--bone-400)]">
                        <Image className="h-10 w-10" aria-hidden="true" />
                      </span>
                    )}
                    <span className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(8,7,6,0.82),transparent)] p-4 text-sm font-medium text-[var(--bone-000)] opacity-0 transition-opacity group-hover:opacity-100">
                      {label || project.title_nl}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </>
  )
}
