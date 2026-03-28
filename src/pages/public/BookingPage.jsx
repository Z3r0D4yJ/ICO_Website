import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Check, Plus, CheckCircle2 } from '@/lib/icons'
import { useServices } from '@/hooks/useServices'
import { createBooking } from '@/api/bookings'
import { useUiStore } from '@/stores/uiStore'
import { useRateLimit } from '@/hooks/useRateLimit'
import { SERVICE_INCLUDED_EXTRAS } from '@/lib/constants'
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
function StepIndicator({ currentStep }) {
  const idx = currentStep - 1
  const total = STEPS.length - 1
  const pct = (idx / total) * 100

  return (
    <div className="mb-8" role="list" aria-label="Boekingsstappen">
      <div className="relative" style={{ height: 88 }}>
        {/* Track achtergrond */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 48,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: 'rgba(196,130,111,0.2)',
          }}
        />
        {/* Progressie */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 48,
            left: 0,
            height: 1,
            width: `${pct}%`,
            backgroundColor: 'var(--color-primary)',
            transition: 'width 0.5s ease-in-out',
          }}
        />

        {/* Auto */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 12,
            left: `${pct}%`,
            transform: 'translateX(-50%)',
            color: 'var(--color-primary)',
            transition: 'left 0.5s ease-in-out',
            zIndex: 20,
          }}
        >
          <CarSVG />
        </div>

        {/* Stap-cirkels + labels */}
        {STEPS.map((step, i) => {
          const isDone = step.id < currentStep
          const isCurrent = step.id === currentStep
          const dotPct = (i / total) * 100
          return (
            <div
              key={step.id}
              role="listitem"
              aria-current={isCurrent ? 'step' : undefined}
              style={{
                position: 'absolute',
                top: 32,
                left: `${dotPct}%`,
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                zIndex: 10,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  transition: 'all 0.3s',
                  backgroundColor: isDone
                    ? 'var(--color-success)'
                    : isCurrent
                    ? 'var(--color-primary)'
                    : 'var(--color-surface-elevated)',
                  color: isDone || isCurrent ? '#fff' : 'var(--color-text-muted)',
                  border: isDone || isCurrent ? 'none' : '1px solid rgba(196,130,111,0.2)',
                }}
              >
                {isDone ? <Check size={14} weight="bold" aria-hidden="true" /> : step.id}
              </div>
              <span
                className="hidden sm:block"
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  color: isCurrent ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                }}
              >
                {step.label}
              </span>
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
    extra_ids: [],          // array van extra dienst-IDs
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

  const preselectedService = services.find((s) => s.slug === dienstSlug) || null
  const selectedServiceId = booking.service_id || preselectedService?.id || ''
  const selectedService = services.find((s) => s.id === selectedServiceId) || preselectedService

  // Eénmalig extra's pre-invullen vanuit URL
  const [extrasInited, setExtrasInited] = useState(false)
  useEffect(() => {
    if (extrasInited || !extraParam || services.length === 0) return
    const slugs = extraParam.split(',').filter(Boolean)
    const ids = slugs.map((slug) => services.find((s) => s.slug === slug)?.id).filter(Boolean)
    if (ids.length > 0) {
      setBooking((b) => ({ ...b, extra_ids: ids }))
    }
    setExtrasInited(true)
  }, [services, extraParam, extrasInited])

  // Diensten per categorie
  const washServices = services.filter((s) => s.service_category === 'wash')
  const extraServices = services.filter((s) => s.service_category === 'extra')

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
      service_id: service.id,
      vehicle_type: '',
      extra_ids: b.extra_ids.filter((id) => !newIncludedIds.includes(id)),
    }))
  }

  const step1Valid = selectedServiceId && booking.preferred_date && booking.preferred_time_slot
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
      const result = await createBooking({
        ...booking,
        service_id: selectedServiceId,
      })
      navigate(`/boeken/bevestiging?nummer=${result.booking_number}`)
    } catch (err) {
      showError('Er ging iets mis. Probeer opnieuw of contacteer ons via WhatsApp.')
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

            {/* Wasbeurten (radio — kies één) */}
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
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
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

            {/* Extra's (checkbox — kies meerdere) */}
            {!servicesLoading && extraServices.length > 0 && (
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
                          className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
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
              <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-muted)' }}>
                Kies een datum
              </h2>
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
                Kies een tijdslot
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
                className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
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
