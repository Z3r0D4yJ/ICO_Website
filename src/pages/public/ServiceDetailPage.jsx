import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { Clock, CheckCircle2, ArrowRight, AlertCircle, Car, Truck, ClipboardText, Phone, Mail } from '@/lib/icons'
import { useTranslation } from 'react-i18next'
import { useService, useServices } from '@/hooks/useServices'
import { DynamicIcon } from '@/lib/icons'
import { formatPrice } from '@/lib/utils'
import { VEHICLE_TYPES } from '@/lib/constants'
import { createQuoteRequest } from '@/api/quotes'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Skeleton, { SkeletonText } from '@/components/ui/Skeleton'
import Modal from '@/components/ui/Modal'
import Input, { Textarea } from '@/components/ui/Input'
import CTASection from '@/components/home/CTASection'

const CATEGORIES_WITH_QUOTE = ['coating', 'ppf']

function QuoteModal({ service, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', vehicle_brand: '', vehicle_type: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim() || form.name.length < 2) e.name = 'Naam is verplicht (min. 2 tekens)'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Geldig e-mailadres verplicht'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSubmitting(true)
    try {
      await createQuoteRequest({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        vehicle_brand: form.vehicle_brand.trim() || null,
        vehicle_type: form.vehicle_type || null,
        message: form.message.trim() || null,
        service_interest: service.title_nl,
      })
      setSuccess(true)
    } catch (err) {
      console.error('Quote error:', err)
      setErrors({ submit: 'Er is iets misgegaan. Probeer het opnieuw.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen onClose={onClose} title="Vrijblijvende offerte aanvragen" size="lg">
      {success ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(196,130,111,0.12)', border: '1px solid rgba(196,130,111,0.3)' }}
          >
            <CheckCircle2 className="w-7 h-7" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-base mb-1" style={{ color: 'var(--color-text-primary)' }}>
              Aanvraag ontvangen!
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Wij nemen zo snel mogelijk contact met u op via e-mail of telefoon.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={onClose}>Sluiten</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <p className="text-sm mb-5" style={{ color: 'var(--color-text-secondary)' }}>
            Vul uw gegevens in voor een vrijblijvende offerte voor <strong style={{ color: 'var(--color-text-primary)' }}>{service.title_nl}</strong>.
            Wij contacteren u binnen de 24 uur.
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Naam"
                required
                value={form.name}
                onChange={set('name')}
                error={errors.name}
                placeholder="Uw naam"
              />
              <Input
                label="E-mail"
                type="email"
                required
                value={form.email}
                onChange={set('email')}
                error={errors.email}
                placeholder="uw@email.com"
                leftIcon={<Mail className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Telefoon"
                type="tel"
                value={form.phone}
                onChange={set('phone')}
                placeholder="+32 4xx xx xx xx"
                leftIcon={<Phone className="w-4 h-4" />}
              />
              <Input
                label="Merk voertuig"
                value={form.vehicle_brand}
                onChange={set('vehicle_brand')}
                placeholder="bv. BMW, Audi, Mercedes"
                leftIcon={<Car className="w-4 h-4" />}
              />
            </div>

            <div>
              <label
                htmlFor="quote-vehicle-type"
                className="text-sm font-medium mb-1.5 block"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Type voertuig
              </label>
              <select
                id="quote-vehicle-type"
                value={form.vehicle_type}
                onChange={set('vehicle_type')}
                className="w-full h-10 px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                style={{
                  backgroundColor: 'var(--color-surface-overlay)',
                  border: '1px solid rgba(196,130,111,0.2)',
                  color: form.vehicle_type ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                }}
              >
                <option value="">Selecteer type...</option>
                {VEHICLE_TYPES.map((vt) => (
                  <option key={vt.value} value={vt.value}>{vt.label_nl}</option>
                ))}
              </select>
            </div>

            <Textarea
              label="Bericht (optioneel)"
              rows={3}
              value={form.message}
              onChange={set('message')}
              placeholder="Extra info, wensen, vragen..."
            />

            {errors.submit && (
              <p className="text-sm" style={{ color: 'var(--color-error)' }}>{errors.submit}</p>
            )}
          </div>

          <Modal.Footer>
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Annuleren
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={submitting}>
              {submitting ? 'Verzenden...' : 'Aanvraag versturen'}
            </Button>
          </Modal.Footer>
        </form>
      )}
    </Modal>
  )
}

// Wat is inbegrepen per dienst
const SERVICE_INCLUDES = {
  easywash: [
    'Exterieur grondig gewassen',
    'Velgen en banden gereinigd',
    'Ramen gereinigd (buiten)',
    'Deurrubbers afgestoft',
    'Banden behandeld',
  ],
  detailwash: [
    'Grondige exterieur reiniging',
    'Velgen en banden gereinigd',
    'Ramen gepolijst (inside & outside)',
    'Interieur gestofzuigd en afgestoft',
    'Dashboard en kunststoffen behandeld',
    'Geuren geneutraliseerd',
    'Afgewerkt met beschermend product',
  ],
  'extra-dieptereiniging': [
    'Professionele extractiereiniging zetels',
    'Tapijten en vloermatten behandeld',
    'Hardnekkige vlekken verwijderd',
    'Geuren geneutraliseerd',
    'Portieren en zijpanelen gereinigd',
    'Droogtijd: 2-4 uur na behandeling',
  ],
}

// Icon voor voertuigtype in prijstabel
function VehicleIcon({ type }) {
  const isTruck = type.startsWith('bestelwagen')
  const Icon = isTruck ? Truck : Car
  return <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
}

function ServiceDetailSkeleton() {
  return (
    <div className="container-ico section-padding">
      <Skeleton variant="line" width="200px" height="20px" className="mb-8" />
      <Skeleton variant="rect" height="320px" className="rounded-2xl mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SkeletonText lines={6} />
        </div>
        <div>
          <Skeleton variant="rect" height="300px" className="rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export default function ServiceDetailPage() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.slice(0, 2) || 'nl'
  const { service, loading, error } = useService(slug)
  const { services: allServices } = useServices()
  const [quoteOpen, setQuoteOpen] = useState(false)

  const getTitle = (s) => (lang === 'en' && s.title_en) ? s.title_en : s.title_nl
  const getDesc = (s) => (lang === 'en' && s.description_en) ? s.description_en : s.description_nl

  // Gerelateerde diensten — de andere twee
  const related = allServices.filter((s) => s.slug !== slug).slice(0, 2)
  const includes = SERVICE_INCLUDES[slug] || []

  if (loading) return <ServiceDetailSkeleton />
  if (error || !service) return <Navigate to="/diensten" replace />

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'var(--color-surface-elevated)', borderBottom: '1px solid rgba(196,130,111,0.2)' }}>
        <div className="container-ico">
          <Breadcrumb items={[
            { label: t('nav.services'), to: '/diensten' },
            { label: getTitle(service) },
          ]} />
        </div>
      </div>

      {/* Hero banner */}
      <div
        className="relative overflow-hidden"
        style={{
          minHeight: '280px',
          background: 'linear-gradient(180deg, var(--color-secondary) 0%, var(--color-surface) 100%)',
          borderBottom: '1px solid rgba(196,130,111,0.2)',
        }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, var(--color-primary) 0, var(--color-primary) 1px, transparent 1px, transparent 64px),' +
              'repeating-linear-gradient(90deg, var(--color-primary) 0, var(--color-primary) 1px, transparent 1px, transparent 64px)',
          }}
        />

        {service.image_url && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${service.image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.15,
            }}
            aria-hidden="true"
          />
        )}

        <div className="container-ico relative z-10 py-14 md:py-20">
          <div className="flex items-start gap-5">
            {/* Icon */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: 'rgba(196,130,111,0.12)',
                border: '1px solid rgba(196,130,111,0.3)',
              }}
            >
              <DynamicIcon
                name={service.icon || 'Sparkles'}
                className="w-8 h-8"
                style={{ color: 'var(--color-primary)' }}
                aria-hidden="true"
              />
            </div>

            <div>
              <p
                className="text-sm font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'var(--color-primary)' }}
              >
                {t('nav.services')}
              </p>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.25rem, 6vw, 4rem)',
                  color: 'var(--color-text-primary)',
                  letterSpacing: '0.03em',
                  lineHeight: 1.05,
                }}
              >
                {getTitle(service)}
              </h1>
              {service.duration_minutes && (
                <div className="flex items-center gap-2 mt-3">
                  <Clock className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Gemiddeld ~{Math.floor(service.duration_minutes / 60)}u
                    {service.duration_minutes % 60 > 0 && ` ${service.duration_minutes % 60}min`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hoofdcontent */}
      <section
        className="section-padding"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="container-ico">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

            {/* Links — beschrijving + inclusief */}
            <div className="lg:col-span-2 space-y-10">

              {/* Beschrijving */}
              <div>
                <h2
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.75rem',
                    color: 'var(--color-text-primary)',
                    letterSpacing: '0.02em',
                  }}
                >
                  Wat houdt dit in?
                </h2>
                <div
                  className="prose-ico space-y-3"
                  style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}
                >
                  {getDesc(service).split('\n').filter(Boolean).map((paragraph, i) => (
                    <p key={i} className="text-base">{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Wat is inbegrepen */}
              {includes.length > 0 && (
                <div>
                  <h2
                    className="mb-5"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.75rem',
                      color: 'var(--color-text-primary)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    Wat is inbegrepen?
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
                    {includes.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2
                          className="w-5 h-5 flex-shrink-0 mt-0.5"
                          style={{ color: 'var(--color-success)' }}
                          aria-hidden="true"
                        />
                        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Opmerking */}
              <div
                className="flex gap-4 p-5 rounded-xl"
                style={{
                  backgroundColor: 'rgba(196,130,111,0.07)',
                  border: '1px solid rgba(196,130,111,0.2)',
                }}
                role="note"
              >
                <AlertCircle
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: 'var(--color-primary)' }}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                    Opmerking over de prijs
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    De vermelde prijs is een startprijs. De uiteindelijke prijs hangt af van het type en de staat van uw voertuig.
                    Wij communiceren altijd transparant over de prijs voor de start van de wasbeurt.
                  </p>
                </div>
              </div>
            </div>

            {/* Rechts — sticky boek-sidebar */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-4">
                <Card variant="highlight" className="space-y-5">
                  {/* Prijstabel (pricing_tiers) of enkelvoudige prijs */}
                  {service.pricing_tiers?.length > 0 ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>
                        Prijs per voertuigtype
                      </p>
                      <ul className="space-y-1.5">
                        {service.pricing_tiers.map((tier) => (
                          <li
                            key={tier.vehicle_type}
                            className="flex items-center justify-between gap-2 py-1.5 border-b last:border-b-0"
                            style={{ borderColor: 'rgba(196,130,111,0.15)' }}
                          >
                            <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                              <VehicleIcon type={tier.vehicle_type} />
                              <span className="text-sm">{tier.label}</span>
                            </div>
                            <span
                              className="font-semibold text-sm flex-shrink-0"
                              style={{ color: 'var(--color-primary)' }}
                            >
                              {formatPrice(tier.price)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
                        {service.price_from ? t('services.priceFrom') : 'Prijs'}
                      </p>
                      {service.price_from ? (
                        <p
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '2.75rem',
                            color: 'var(--color-primary)',
                            lineHeight: 1,
                          }}
                        >
                          {formatPrice(service.price_from)}
                        </p>
                      ) : (
                        <p className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                          Op aanvraag
                        </p>
                      )}
                      {service.price_note_nl && (
                        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                          {lang === 'en' && service.price_note_en
                            ? service.price_note_en
                            : service.price_note_nl}
                        </p>
                      )}
                    </div>
                  )}

                  {service.duration_minutes && (
                    <div
                      className="flex items-center gap-2 py-3 border-y"
                      style={{ borderColor: 'rgba(196,130,111,0.15)' }}
                    >
                      <Clock className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
                      <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        ~{Math.floor(service.duration_minutes / 60)} uur{' '}
                        {service.duration_minutes % 60 > 0 && `${service.duration_minutes % 60} min`}
                      </span>
                    </div>
                  )}

                  <Button
                    as={Link}
                    to={`/boeken?dienst=${service.slug}`}
                    variant="primary"
                    fullWidth
                    size="lg"
                  >
                    {t('services.bookService')}
                  </Button>

                  <div className="text-center">
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      Gratis annuleren tot 24u op voorhand
                    </p>
                  </div>
                </Card>

                {/* Offerte aanvragen — coating / ppf */}
                {CATEGORIES_WITH_QUOTE.includes(service.service_category) && (
                  <Card
                    className="space-y-3"
                    style={{ backgroundColor: 'rgba(196,130,111,0.06)', border: '1px solid rgba(196,130,111,0.2)' }}
                  >
                    <div className="flex items-center gap-2">
                      <ClipboardText
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: 'var(--color-primary)' }}
                        aria-hidden="true"
                      />
                      <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                        Offerte aanvragen
                      </p>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      Niet zeker welk pakket bij u past? Vraag een vrijblijvende offerte aan — wij contacteren u binnen 24u.
                    </p>
                    <Button
                      variant="secondary"
                      fullWidth
                      size="sm"
                      onClick={() => setQuoteOpen(true)}
                      leftIcon={<ClipboardText className="w-4 h-4" />}
                    >
                      Vrijblijvende offerte
                    </Button>
                  </Card>
                )}

                {/* Alle diensten link */}
                <Button
                  as={Link}
                  to="/diensten"
                  variant="ghost"
                  fullWidth
                  size="sm"
                >
                  Alle diensten bekijken
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Gerelateerde diensten */}
      {related.length > 0 && (
        <section
          className="section-padding"
          style={{ backgroundColor: 'var(--color-surface-elevated)' }}
          aria-labelledby="related-services-title"
        >
          <div className="container-ico">
            <h2
              id="related-services-title"
              className="mb-8 text-center"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                color: 'var(--color-text-primary)',
                letterSpacing: '0.03em',
              }}
            >
              ANDERE DIENSTEN
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/diensten/${rel.slug}`}
                  className="group flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                  style={{
                    backgroundColor: 'var(--color-surface-elevated)',
                    border: '1px solid rgba(196,130,111,0.2)',
                  }}
                >
                  <div className="p-5 flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'rgba(196,130,111,0.1)', border: '1px solid rgba(196,130,111,0.2)' }}
                      >
                        <DynamicIcon
                          name={rel.icon || 'Sparkles'}
                          className="w-4 h-4"
                          style={{ color: 'var(--color-primary)' }}
                          aria-hidden="true"
                        />
                      </div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.25rem',
                          color: 'var(--color-text-primary)',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {getTitle(rel)}
                      </h3>
                    </div>
                    <p className="text-sm line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                      {rel.short_description_nl}
                    </p>
                  </div>
                  <div
                    className="px-5 py-4 border-t flex items-center justify-between"
                    style={{ borderColor: 'rgba(196,130,111,0.15)' }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.25rem',
                        color: 'var(--color-primary)',
                      }}
                    >
                      {formatPrice(rel.price_from)}
                    </span>
                    <ArrowRight
                      className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5"
                      style={{ color: 'var(--color-primary)' }}
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />

      {/* Offerte modal */}
      {quoteOpen && (
        <QuoteModal service={service} onClose={() => setQuoteOpen(false)} />
      )}
    </>
  )
}
