import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Check, Plus, CheckCircle2, MapPin, Wrench } from '@/lib/icons'
import { useServices } from '@/hooks/useServices'
import { createBooking } from '@/api/bookings'
import { useUiStore } from '@/stores/uiStore'
import { useRateLimit } from '@/hooks/useRateLimit'
import { SERVICE_INCLUDED_EXTRAS, GARAGE_SERVICE_CATEGORIES, GARAGE_ADDRESS } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import Button from '@/components/ui/Button'
import BookingCalendar from '@/components/booking/BookingCalendar'
import TimeSlotPicker from '@/components/booking/TimeSlotPicker'
import VehicleSelector from '@/components/booking/VehicleSelector'
import BookingForm from '@/components/booking/BookingForm'
import BookingSummary from '@/components/booking/BookingSummary'
import { DynamicIcon } from '@/lib/icons'

const STEPS = [
  { id: 1, label: 'Dienst & datum' },
  { id: 2, label: 'Voertuig' },
  { id: 3, label: 'Gegevens' },
  { id: 4, label: 'Bevestigen' },
]

// Vertaalt Supabase/Postgres error codes naar duidelijke NL berichten.
function mapBookingError(err) {
  const code = err?.code || err?.details?.code
  const hint = err?.hint || err?.details?.hint
  const msg  = (err?.message || '').toLowerCase()

  if (hint === 'BOOKING_SLOT_TAKEN' || code === '23505' || msg.includes('net geboekt')) {
    return 'Dit tijdslot is net door iemand anders geboekt. Kies een ander tijdstip.'
  }
  if (code === '22023' || msg.includes('verplicht') || msg.includes('ongeldig')) {
    return err?.message || 'Niet alle velden zijn correct ingevuld.'
  }
  if (msg.includes('failed to fetch') || msg.includes('network')) {
    return 'Geen verbinding met de server. Controleer je internet en probeer opnieuw.'
  }
  return 'Er ging iets mis bij het maken van je boeking. Probeer opnieuw of stuur ons een WhatsApp.'
}

// Wat is inbegrepen per wasbeurt — visuele bullet-lijst op de keuzekaart
const WASH_INCLUDES = {
  'easywash': [
    'Karosserie handwas',
    'Velgen & banden',
    'Ramen buiten',
    'Dorpels gereinigd',
  ],
  'detailwash': [
    'Alles van EasyWash',
    'Interieur gestofzuigd',
    'Dashboard & kunststoffen',
    'Ramen van binnen',
    'Geuren geneutraliseerd',
  ],
}

// ── Kleine auto SVG ────────────────────────────────────────────────────────────
function CarSVG() {
  return (
    <svg width="44" height="20" viewBox="0 0 44 20" fill="none" aria-hidden="true">
      <rect x="1" y="10" width="42" height="8" rx="2.5" fill="currentColor" />
      <path d="M9 10L13.5 3.5H30.5L35 10H9Z" fill="currentColor" />
      <path d="M14.5 9.5L17.5 5H27L29.5 9.5H14.5Z" fill="var(--color-surface)" fillOpacity="0.55" />
      <circle cx="12" cy="18" r="2.5" fill="var(--color-surface-elevated)" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="32" cy="18" r="2.5" fill="var(--color-surface-elevated)" stroke="currentColor" strokeWidth="1.5" />
      <rect x="40" y="12" width="2.5" height="4" rx="1.25" fill="#FEF08A" fillOpacity="0.9" />
      <rect x="1" y="13" width="2" height="3" rx="1" fill="#F87171" fillOpacity="0.7" />
    </svg>
  )
}

// ── Stap-indicator met rijdende auto ──────────────────────────────────────────
// Verticale layout (px van top van container):
//   y=3–29  : cirkels (26px diameter, center op y=16)
//   y=29–56 : verticale tick-lijnen (verbinden cirkel met weg)
//   y=56    : weg (horizontale lijn, 3px dik)
//   y=36–56 : auto (20px hoog, wielen raken weg op y=56)
//   y=62–76 : labels (tekst onder de weg)
//   Totaal  : 80px
function StepIndicator({ currentStep }) {
  const idx = currentStep - 1
  const total = STEPS.length - 1
  const pct = (idx / total) * 100

  const ROAD_Y     = 56   // y van de weg
  const CIRCLE_CY  = 16   // y van cirkel-centrum
  const CIRCLE_R   = 13   // straal → diameter 26px
  const CAR_H      = 20   // hoogte CarSVG
  // auto top = ROAD_Y - CAR_H = 36 → cirkel bottom = 29 → 7px lucht ✓

  return (
    <div className="mb-8" role="list" aria-label="Boekingsstappen">
      <div className="relative" style={{ height: 80 }}>

        {/* ── Weg achtergrond ── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: ROAD_Y,
            left: 0, right: 0,
            height: 3,
            borderRadius: 2,
            backgroundColor: 'rgba(196,130,111,0.18)',
          }}
        />

        {/* ── Weg progressie ── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: ROAD_Y,
            left: 0,
            height: 3,
            borderRadius: 2,
            width: `${pct}%`,
            backgroundColor: 'var(--color-primary)',
            transition: 'width 0.55s ease-in-out',
          }}
        />

        {/* ── Auto rijdt over de weg ── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: ROAD_Y - CAR_H,
            left: `${pct}%`,
            transform: 'translateX(-50%)',
            color: 'var(--color-primary)',
            transition: 'left 0.55s ease-in-out',
            zIndex: 30,
            filter: 'drop-shadow(0 1px 3px rgba(196,130,111,0.4))',
          }}
        >
          <CarSVG />
        </div>

        {/* ── Step markers ── */}
        {STEPS.map((step, i) => {
          const isDone    = step.id < currentStep
          const isCurrent = step.id === currentStep
          const dotPct    = (i / total) * 100
          const accentColor = isDone || isCurrent ? 'var(--color-primary)' : 'rgba(196,130,111,0.2)'

          return (
            <div key={step.id} role="listitem" aria-current={isCurrent ? 'step' : undefined}>

              {/* Cirkel boven de weg */}
              <div
                style={{
                  position: 'absolute',
                  top: CIRCLE_CY - CIRCLE_R,
                  left: `${dotPct}%`,
                  transform: 'translateX(-50%)',
                  width: CIRCLE_R * 2,
                  height: CIRCLE_R * 2,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  zIndex: 10,
                  transition: 'all 0.3s',
                  backgroundColor: isDone
                    ? 'var(--color-success)'
                    : isCurrent
                    ? 'var(--color-primary)'
                    : 'var(--color-surface-elevated)',
                  color: isDone || isCurrent ? '#fff' : 'var(--color-text-muted)',
                  border: isDone || isCurrent ? 'none' : '1px solid rgba(196,130,111,0.2)',
                  boxShadow: isCurrent ? '0 0 0 3px rgba(196,130,111,0.2)' : 'none',
                }}
              >
                {isDone ? <Check size={12} weight="bold" aria-hidden="true" /> : step.id}
              </div>

              {/* Tick-lijn: van cirkel-onderkant tot weg */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: CIRCLE_CY + CIRCLE_R,
                  left: `${dotPct}%`,
                  transform: 'translateX(-50%)',
                  width: 1,
                  height: ROAD_Y - (CIRCLE_CY + CIRCLE_R),
                  backgroundColor: accentColor,
                  transition: 'background-color 0.3s',
                }}
              />

              {/* Label onder de weg */}
              <div
                className="hidden sm:block"
                style={{
                  position: 'absolute',
                  top: ROAD_Y + 8,
                  left: `${dotPct}%`,
                  transform: 'translateX(-50%)',
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  color: isCurrent
                    ? 'var(--color-primary)'
                    : isDone
                    ? 'var(--color-text-secondary)'
                    : 'var(--color-text-muted)',
                  transition: 'color 0.3s',
                }}
              >
                {step.label}
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Hoofd pagina-component ─────────────────────────────────────────────────────
export default function BookingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const showError = useUiStore((s) => s.showError)
  const { services, loading: servicesLoading } = useServices()
  const { cooldown, blocked, checkLimit, recordAttempt } = useRateLimit({ cooldownMs: 10000, maxAttempts: 3, windowMs: 120000 })
  const formRef = useRef(null)

  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  const [booking, setBooking] = useState({
    service_id: '',
    extra_ids: [],
    ppf_ids: [],              // PPF — meerdere delen mogelijk
    booking_type: 'mobiel',   // 'mobiel' | 'garage'
    preferred_date: null,
    preferred_time_slot: null,
    vehicle_type: '',
    vehicle_brand: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    customer_city: '',
    customer_postal_code: '',
    notes: '',
  })

  // URL params
  const dienstSlug = searchParams.get('dienst')
  const extraParam = searchParams.get('extra')

  const selectedServiceId = booking.service_id
  const selectedService = services.find((s) => s.id === selectedServiceId) || null

  // Eénmalig pre-invullen vanuit URL (dienst + extra's) zodra services geladen zijn
  const [serviceInited, setServiceInited] = useState(false)
  useEffect(() => {
    if (serviceInited || services.length === 0) return

    const preselected = dienstSlug ? services.find((s) => s.slug === dienstSlug) : null
    const extraSlugs = extraParam ? extraParam.split(',').filter(Boolean) : []
    const extraIds = extraSlugs.map((slug) => services.find((s) => s.slug === slug)?.id).filter(Boolean)

    if (preselected) {
      const isPPF = preselected.service_category === 'ppf'
      const isGarageCat = GARAGE_SERVICE_CATEGORIES.includes(preselected.service_category)

      setBooking((b) => ({
        ...b,
        booking_type: isGarageCat ? 'garage' : 'mobiel',
        service_id:   isPPF ? '' : preselected.id,
        ppf_ids:      isPPF ? [preselected.id] : [],
        extra_ids:    extraIds,
      }))
    } else if (extraIds.length > 0) {
      setBooking((b) => ({ ...b, extra_ids: extraIds }))
    }

    setServiceInited(true)
  }, [services, dienstSlug, extraParam, serviceInited])

  // Diensten per categorie
  const washServices   = services.filter((s) => s.service_category === 'wash')
  const extraServices  = services.filter((s) => s.service_category === 'extra')
  const ppfServices    = services.filter((s) => s.service_category === 'ppf')
  const garageServices = services.filter((s) => GARAGE_SERVICE_CATEGORIES.includes(s.service_category) && s.service_category !== 'ppf')
  const isGarage       = booking.booking_type === 'garage'

  // Extra's die al inbegrepen zijn bij de geselecteerde wasbeurt
  const includedExtraSlugs = SERVICE_INCLUDED_EXTRAS[selectedService?.slug] || []
  const includedExtras = extraServices.filter((s) => includedExtraSlugs.includes(s.slug))
  const availableExtras = extraServices.filter((s) => !includedExtraSlugs.includes(s.slug))

  // Alle geselecteerde extra-service objecten
  const selectedExtras = services.filter((s) => booking.extra_ids.includes(s.id))

  const toggleExtra = (serviceId) => {
    setBooking((b) => ({
      ...b,
      extra_ids: b.extra_ids.includes(serviceId)
        ? b.extra_ids.filter((id) => id !== serviceId)
        : [...b.extra_ids, serviceId],
    }))
  }

  // Selecteer een wasbeurt + verwijder extra's die nu inbegrepen zijn
  const selectWashService = (service) => {
    const newIncludedSlugs = SERVICE_INCLUDED_EXTRAS[service.slug] || []
    const newIncludedIds = services
      .filter((s) => newIncludedSlugs.includes(s.slug))
      .map((s) => s.id)
    setBooking((b) => ({
      ...b,
      booking_type: 'mobiel',
      service_id: service.id,
      vehicle_type: '',
      extra_ids: b.extra_ids.filter((id) => !newIncludedIds.includes(id)),
    }))
  }

  // Selecteer een garage dienst (coating/homecare — single select)
  const selectGarageService = (service) => {
    setBooking((b) => ({
      ...b,
      booking_type: 'garage',
      service_id: service.id,
      ppf_ids: [],
      vehicle_type: '',
      extra_ids: [],
    }))
  }

  // Toggle een PPF-deel (multi-select)
  const togglePpf = (serviceId) => {
    setBooking((b) => ({
      ...b,
      service_id: '',           // geen andere garage dienst actief
      ppf_ids: b.ppf_ids.includes(serviceId)
        ? b.ppf_ids.filter((id) => id !== serviceId)
        : [...b.ppf_ids, serviceId],
    }))
  }

  // Wissel afspraaktype
  const switchBookingType = (type) => {
    setBooking((b) => ({
      ...b,
      booking_type: type,
      service_id: '',
      extra_ids: [],
      ppf_ids: [],
      vehicle_type: '',
      preferred_date: null,
      preferred_time_slot: null,
    }))
  }

  const garageServiceSelected = isGarage ? (!!selectedServiceId || booking.ppf_ids.length > 0) : !!selectedServiceId
  const step1Valid = garageServiceSelected && booking.preferred_date && booking.preferred_time_slot
  const step2Valid = !!booking.vehicle_type

  const canGoNext = () => {
    if (step === 1) return !!step1Valid
    if (step === 2) return !!step2Valid
    return true
  }

  const goNext = () => {
    if (step === 3) {
      formRef.current?.click()
      return
    }
    setStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goPrev = () => {
    setStep((s) => Math.max(1, s - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFormSubmit = (contactData) => {
    setBooking((prev) => ({ ...prev, ...contactData }))
    setStep(4)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleConfirm = async () => {
    if (!checkLimit()) {
      showError('Te veel pogingen. Wacht even en probeer opnieuw.')
      return
    }
    setSubmitting(true)
    recordAttempt()
    try {
      // PPF: gebruik eerste ppf_id als service_id, rest in notes
      const effectiveServiceId = selectedServiceId || booking.ppf_ids[0] || ''
      const ppfServices_ = services.filter((s) => booking.ppf_ids.includes(s.id))
      const ppfNote = ppfServices_.length > 0
        ? `PPF delen: ${ppfServices_.map((s) => s.title_nl).join(', ')}`
        : ''
      const result = await createBooking({
        ...booking,
        service_id: effectiveServiceId,
        notes: [ppfNote, booking.notes].filter(Boolean).join('\n'),
      })
      navigate(`/boeken/bevestiging?nummer=${result.booking_number}`)
    } catch (err) {
      showError(mapBookingError(err))
      console.error('Booking error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  // Helper voor dienst-knop stijl
  const serviceButtonStyle = (isSelected) =>
    isSelected
      ? {
          backgroundColor: 'rgba(196,130,111,0.12)',
          border: '2px solid var(--color-primary)',
          boxShadow: '0 0 0 1px var(--color-primary)',
        }
      : {
          backgroundColor: 'var(--color-surface-overlay)',
          border: '1px solid rgba(196,130,111,0.2)',
        }

  return (
    <div className="section-padding" style={{ backgroundColor: 'var(--color-surface)', minHeight: '80vh' }}>
      <div className="container-ico max-w-3xl">

        {/* Paginatitel */}
        <div className="text-center mb-8">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-2"
            style={{ color: 'var(--color-primary)' }}
          >
            Online Boeking
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: 'var(--color-text-primary)',
              letterSpacing: '0.03em',
            }}
          >
            MAAK EEN AFSPRAAK
          </h1>
        </div>

        <StepIndicator currentStep={step} />

        {/* ===== STAP 1: Dienst + Datum + Tijdslot ===== */}
        {step === 1 && (
          <div className="space-y-6">

            {/* Afspraaktype switcher */}
            <section
              className="rounded-xl p-5"
              style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>
                Kies uw afspraaktype
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    type: 'mobiel',
                    icon: MapPin,
                    title: 'Wassen aan huis',
                    sub: 'De Washbus komt naar u toe in heel Vlaanderen',
                    badge: 'Mobiel',
                  },
                  {
                    type: 'garage',
                    icon: Wrench,
                    title: 'Coating & PPF',
                    sub: 'U brengt uw wagen naar onze garage in Hamme',
                    badge: 'Garage',
                  },
                ].map(({ type, icon: Icon, title, sub, badge }) => {
                  const sel = booking.booking_type === type
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => switchBookingType(type)}
                      aria-pressed={sel}
                      className="flex items-start gap-3 p-4 rounded-xl text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                      style={serviceButtonStyle(sel)}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: sel ? 'rgba(196,130,111,0.2)' : 'rgba(196,130,111,0.08)', border: '1px solid rgba(196,130,111,0.2)' }}
                      >
                        <Icon className="w-4 h-4" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-sm block mb-0.5" style={{ color: sel ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>
                          {title}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{sub}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Wasbeurten (radio — kies één) — alleen voor mobiel */}
            {!isGarage && (
            <section
              className="rounded-xl p-5"
              style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>
                Kies uw wasbeurt
              </h2>
              <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>Selecteer één type wasbeurt</p>

              {servicesLoading ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-16 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--color-surface-overlay)' }} />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {washServices.map((service) => {
                    const isSelected = selectedServiceId === service.id
                    const priceFrom = service.pricing_tiers?.[0]?.price ?? service.price_from
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => selectWashService(service)}
                        aria-pressed={isSelected}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                        style={serviceButtonStyle(isSelected)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: isSelected ? 'rgba(196,130,111,0.2)' : 'rgba(196,130,111,0.08)',
                              border: '1px solid rgba(196,130,111,0.2)',
                            }}
                          >
                            <DynamicIcon name={service.icon || 'Sparkle'} className="w-4 h-4" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
                          </div>
                          <div className="text-left">
                            <span className="font-medium text-sm block" style={{ color: isSelected ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>
                              {service.title_nl}
                            </span>
                            {service.short_description_nl && (
                              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{service.short_description_nl}</span>
                            )}
                            {WASH_INCLUDES[service.slug] && (
                              <ul className="mt-1.5 space-y-0.5">
                                {WASH_INCLUDES[service.slug].slice(0, 4).map((item) => (
                                  <li key={item} className="flex items-center gap-1">
                                    <CheckCircle2
                                      size={11}
                                      style={{ color: 'var(--color-success)', flexShrink: 0 }}
                                      aria-hidden="true"
                                    />
                                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {priceFrom && (
                            <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                              {service.pricing_tiers ? `Vanaf ${formatPrice(priceFrom)}` : formatPrice(priceFrom)}
                            </span>
                          )}
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                              border: isSelected ? 'none' : '2px solid rgba(196,130,111,0.3)',
                              transition: 'all 0.15s',
                            }}
                          >
                            {isSelected && <Check size={11} weight="bold" style={{ color: '#fff' }} aria-hidden="true" />}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </section>

            )} {/* einde !isGarage was-sectie */}

            {/* Garage diensten (coating / PPF / HomeCare) */}
            {isGarage && (
              <section
                className="rounded-xl p-5"
                style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
              >
                <h2 className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>
                  Kies uw behandeling
                </h2>
                <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
                  Uitgevoerd in onze garage in Hamme — klaar in enkele dagen
                </p>
                {servicesLoading ? (
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-16 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--color-surface-overlay)' }} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {garageServices.map((service) => {
                      const isSelected = selectedServiceId === service.id
                      const priceFrom  = service.pricing_tiers?.[0]?.price ?? service.price_from
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => selectGarageService(service)}
                          aria-pressed={isSelected}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                          style={serviceButtonStyle(isSelected)}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: isSelected ? 'rgba(196,130,111,0.2)' : 'rgba(196,130,111,0.08)', border: '1px solid rgba(196,130,111,0.2)' }}
                            >
                              <DynamicIcon name={service.icon || 'Shield'} className="w-4 h-4" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
                            </div>
                            <div className="text-left">
                              <span className="font-medium text-sm block" style={{ color: isSelected ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>
                                {service.title_nl}
                              </span>
                              {service.short_description_nl && (
                                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{service.short_description_nl}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {priceFrom && (
                              <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                                {service.pricing_tiers ? `Vanaf ${formatPrice(priceFrom)}` : formatPrice(priceFrom)}
                              </span>
                            )}
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent', border: isSelected ? 'none' : '2px solid rgba(196,130,111,0.3)', transition: 'all 0.15s' }}
                            >
                              {isSelected && <Check size={11} weight="bold" style={{ color: '#fff' }} aria-hidden="true" />}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* PPF — multi-select */}
                {ppfServices.length > 0 && (
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(196,130,111,0.15)' }}>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>
                      Paint Protection Film — kies uw delen
                    </p>
                    <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
                      Meerdere delen combineren mogelijk — prijs wordt op maat berekend
                    </p>
                    <div className="space-y-2">
                      {ppfServices.map((service) => {
                        const isSelected = booking.ppf_ids.includes(service.id)
                        const priceFrom = service.pricing_tiers?.[0]?.price ?? service.price_from
                        return (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => togglePpf(service.id)}
                            aria-pressed={isSelected}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                            style={serviceButtonStyle(isSelected)}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: isSelected ? 'rgba(196,130,111,0.2)' : 'rgba(196,130,111,0.08)', border: '1px solid rgba(196,130,111,0.2)' }}
                              >
                                <DynamicIcon name={service.icon || 'Shield'} className="w-4 h-4" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
                              </div>
                              <div className="text-left">
                                <span className="font-medium text-sm block" style={{ color: isSelected ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>
                                  {service.title_nl}
                                </span>
                                {service.short_description_nl && (
                                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{service.short_description_nl}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              {priceFrom && (
                                <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                                  {service.pricing_tiers ? `Vanaf ${formatPrice(priceFrom)}` : formatPrice(priceFrom)}
                                </span>
                              )}
                              {/* Checkbox stijl */}
                              <div
                                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent', border: isSelected ? 'none' : '2px solid rgba(196,130,111,0.3)', transition: 'all 0.15s' }}
                              >
                                {isSelected && <Check size={11} weight="bold" style={{ color: '#fff' }} aria-hidden="true" />}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                    {booking.ppf_ids.length > 0 && (
                      <p className="mt-2 text-xs" style={{ color: 'var(--color-primary)' }}>
                        {booking.ppf_ids.length} deel{booking.ppf_ids.length > 1 ? 'en' : ''} geselecteerd — exacte prijs wordt berekend na inspectie
                      </p>
                    )}
                  </div>
                )}

                {/* Garage info banner */}
                <div
                  className="mt-4 px-4 py-3 rounded-xl flex items-start gap-3"
                  style={{ backgroundColor: 'rgba(196,130,111,0.07)', border: '1px solid rgba(196,130,111,0.2)' }}
                >
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    U brengt uw wagen naar onze garage in{' '}
                    <strong style={{ color: 'var(--color-text-primary)' }}>{GARAGE_ADDRESS}</strong>.
                    Wij contacteren u wanneer uw wagen klaar is voor afhaling — u volgt de voortgang via uw persoonlijke trackingpagina.
                  </p>
                </div>
              </section>
            )}

            {/* Extra's (checkbox — kies meerdere) — alleen voor mobiel */}
            {!isGarage && !servicesLoading && extraServices.length > 0 && (
              <section
                className="rounded-xl p-5"
                style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
              >
                <h2 className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>
                  Extra's toevoegen
                </h2>
                <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
                  Extra's zijn optioneel. Ze worden gecombineerd met uw gekozen wasbeurt in één afspraak.
                </p>

                {/* Inbegrepen extra's — toon alleen als geselecteerde wasbeurt ze bevat */}
                {includedExtras.length > 0 && (
                  <div
                    className="flex flex-wrap gap-2 mb-4 px-3 py-2.5 rounded-lg"
                    style={{ backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
                  >
                    <p className="w-full text-xs font-medium mb-1" style={{ color: 'var(--color-success)' }}>
                      Al inbegrepen bij {selectedService?.title_nl}:
                    </p>
                    {includedExtras.map((extra) => (
                      <span
                        key={extra.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                        style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: 'var(--color-success)' }}
                      >
                        <Check size={10} weight="bold" aria-hidden="true" />
                        {extra.title_nl}
                      </span>
                    ))}
                  </div>
                )}

                {/* Beschikbare extra's om toe te voegen */}
                {availableExtras.length > 0 ? (
                  <div className="space-y-2">
                    {availableExtras.map((service) => {
                      const isSelected = booking.extra_ids.includes(service.id)
                      const priceFrom = service.pricing_tiers?.[0]?.price ?? service.price_from
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => toggleExtra(service.id)}
                          aria-pressed={isSelected}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                          style={serviceButtonStyle(isSelected)}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{
                                backgroundColor: isSelected ? 'rgba(196,130,111,0.2)' : 'rgba(196,130,111,0.08)',
                                border: '1px solid rgba(196,130,111,0.2)',
                              }}
                            >
                              <DynamicIcon name={service.icon || 'Sparkle'} className="w-4 h-4" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
                            </div>
                            <div className="text-left">
                              <span className="font-medium text-sm block" style={{ color: isSelected ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>
                                {service.title_nl}
                              </span>
                              {service.short_description_nl && (
                                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{service.short_description_nl}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {priceFrom && (
                              <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                                {service.pricing_tiers ? `Vanaf ${formatPrice(priceFrom)}` : formatPrice(priceFrom)}
                              </span>
                            )}
                            <div
                              className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                              style={{
                                backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                                border: isSelected ? 'none' : '2px solid rgba(196,130,111,0.3)',
                                transition: 'all 0.15s',
                              }}
                            >
                              {isSelected
                                ? <Check size={11} weight="bold" style={{ color: '#fff' }} aria-hidden="true" />
                                : <Plus size={10} weight="bold" style={{ color: 'rgba(196,130,111,0.6)' }} aria-hidden="true" />
                              }
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-xs italic" style={{ color: 'var(--color-text-muted)' }}>
                    Alle extra's zijn al inbegrepen bij uw geselecteerde pakket.
                  </p>
                )}

                {/* Geselecteerde extra's samenvatting */}
                {booking.extra_ids.length > 0 && (
                  <p className="mt-3 text-xs" style={{ color: 'var(--color-primary)' }}>
                    {booking.extra_ids.length} extra{booking.extra_ids.length > 1 ? "'s" : ''} geselecteerd
                  </p>
                )}
              </section>
            )}

            {/* Kalender */}
            <section
              className="rounded-xl p-5"
              style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>
                {isGarage ? 'Kies uw inbrengdatum' : 'Kies een datum'}
              </h2>
              {isGarage && (
                <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
                  Wanneer brengt u uw wagen naar onze garage in Hamme?
                </p>
              )}
              <BookingCalendar
                selected={booking.preferred_date}
                onSelect={(date) => setBooking((b) => ({ ...b, preferred_date: date, preferred_time_slot: null }))}
              />
            </section>

            {/* Tijdslots */}
            <section
              className="rounded-xl p-5"
              style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-muted)' }}>
                {isGarage ? 'Kies uw inbrengtijdslot' : 'Kies een tijdslot'}
              </h2>
              <TimeSlotPicker
                date={booking.preferred_date}
                selected={booking.preferred_time_slot}
                onSelect={(slot) => setBooking((b) => ({ ...b, preferred_time_slot: slot }))}
              />
            </section>
          </div>
        )}

        {/* ===== STAP 2: Voertuig ===== */}
        {step === 2 && (
          <div className="space-y-6">
            <section
              className="rounded-xl p-5"
              style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>
                Type voertuig *
              </h2>
              {selectedService?.pricing_tiers && (
                <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
                  De prijs voor <strong style={{ color: 'var(--color-text-secondary)' }}>{selectedService.title_nl}</strong> wordt bepaald door uw voertuigtype.
                </p>
              )}
              {!selectedService?.pricing_tiers && <div className="mb-4" />}
              <VehicleSelector
                selected={booking.vehicle_type}
                onSelect={(type) => setBooking((b) => ({ ...b, vehicle_type: type }))}
                pricingTiers={selectedService?.pricing_tiers ?? null}
              />
            </section>

            <section
              className="rounded-xl p-5"
              style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-muted)' }}>
                Merk (optioneel)
              </h2>
              <input
                type="text"
                placeholder="bv. BMW, Volkswagen, Toyota..."
                value={booking.vehicle_brand}
                onChange={(e) => setBooking((b) => ({ ...b, vehicle_brand: e.target.value }))}
                maxLength={50}
                className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                style={{
                  backgroundColor: 'var(--color-surface-overlay)',
                  border: '1px solid rgba(196,130,111,0.2)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </section>
          </div>
        )}

        {/* ===== STAP 3: Contactgegevens ===== */}
        {step === 3 && (
          <section
            className="rounded-xl p-5"
            style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
          >
            <h2 className="text-sm font-semibold uppercase tracking-widest mb-5" style={{ color: 'var(--color-text-muted)' }}>
              Uw contactgegevens
            </h2>
            {isGarage && (
              <div
                className="mb-4 px-4 py-3 rounded-xl flex items-start gap-3"
                style={{ backgroundColor: 'rgba(196,130,111,0.07)', border: '1px solid rgba(196,130,111,0.2)' }}
              >
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  Garage boeking — u brengt uw wagen naar <strong style={{ color: 'var(--color-text-primary)' }}>{GARAGE_ADDRESS}</strong>.
                  Geen thuisadres vereist.
                </p>
              </div>
            )}
            <BookingForm
              defaultValues={{
                customer_name: booking.customer_name,
                customer_email: booking.customer_email,
                customer_phone: booking.customer_phone,
                customer_address: booking.customer_address,
                customer_city: booking.customer_city,
                customer_postal_code: booking.customer_postal_code,
                notes: booking.notes,
              }}
              onSubmit={handleFormSubmit}
              submitRef={formRef}
              isGarage={isGarage}
            />
          </section>
        )}

        {/* ===== STAP 4: Overzicht ===== */}
        {step === 4 && (
          <section
            className="rounded-xl p-5"
            style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
          >
            <h2 className="text-sm font-semibold uppercase tracking-widest mb-5" style={{ color: 'var(--color-text-muted)' }}>
              Controleer uw boeking
            </h2>
            <BookingSummary
              data={booking}
              service={selectedService}
              extras={selectedExtras}
              ppfParts={services.filter((s) => booking.ppf_ids.includes(s.id))}
            />
          </section>
        )}

        {/* Navigatieknoppen */}
        <div className="flex items-center justify-between mt-8 gap-4">
          <Button
            variant="ghost"
            onClick={goPrev}
            disabled={step === 1 || submitting}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Vorige
          </Button>

          {step < 4 ? (
            <Button
              variant="primary"
              onClick={goNext}
              disabled={!canGoNext()}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              {step === 3 ? 'Naar overzicht' : 'Volgende'}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={handleConfirm}
              loading={submitting}
              disabled={submitting}
            >
              Boeking bevestigen
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
