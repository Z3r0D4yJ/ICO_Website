import { Calendar, Clock, Car, User, Mail, Phone, MapPin, FileText } from '@/lib/icons'
import { VEHICLE_TYPES, TIME_SLOTS } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'

function SummaryRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-b-0" style={{ borderColor: 'rgba(196,130,111,0.15)' }}>
      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-xs mb-0.5" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{value}</p>
      </div>
    </div>
  )
}

/**
 * BookingSummary — overzicht van alle boekingsgegevens vóór verzending.
 *
 * @param {object} data - Alle boekingsgegevens
 * @param {object|null} service - Hoofddienst (wasbeurt)
 * @param {object[]} extras - Extra geselecteerde diensten
 */
export default function BookingSummary({ data, service, extras = [] }) {
  const vehicleType = VEHICLE_TYPES.find((v) => v.value === data.vehicle_type)
  const timeSlot = TIME_SLOTS.find((t) => t.value === data.preferred_time_slot)

  const formattedDate = data.preferred_date
    ? new Date(data.preferred_date + 'T12:00:00').toLocaleDateString('nl-BE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  // Bereken prijs op basis van pricing_tiers + voertuigtype
  const exactPrice = (() => {
    if (!service?.pricing_tiers || !data.vehicle_type) return null
    const tier = service.pricing_tiers.find((t) => t.vehicle_type === data.vehicle_type)
    return tier?.price ?? null
  })()

  const displayPrice = exactPrice ?? service?.price_from ?? null
  const priceLabel = exactPrice ? 'Prijs' : (service?.price_from ? 'Vanaf' : null)

  return (
    <div className="space-y-4">
      {/* Diensten overzicht */}
      <div
        className="rounded-xl p-4 space-y-3"
        style={{ backgroundColor: 'rgba(196,130,111,0.07)', border: '1px solid rgba(196,130,111,0.2)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>
          Geselecteerde diensten
        </p>

        {/* Hoofddienst */}
        {service && (
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{service.title_nl}</p>
              {service.duration_minutes && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  ~{Math.floor(service.duration_minutes / 60)}u{service.duration_minutes % 60 > 0 && ` ${service.duration_minutes % 60}min`}
                </p>
              )}
            </div>
            {displayPrice && priceLabel && (
              <div className="text-right flex-shrink-0">
                <p className="text-xs mb-0.5" style={{ color: 'var(--color-text-muted)' }}>{priceLabel}</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', color: 'var(--color-primary)', lineHeight: 1 }}>
                  {formatPrice(displayPrice)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Extra's */}
        {extras.map((extra) => {
          const extraPrice = extra.price_from
          return (
            <div
              key={extra.id}
              className="flex items-start justify-between gap-4 pt-2 border-t"
              style={{ borderColor: 'rgba(196,130,111,0.15)' }}
            >
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{extra.title_nl}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Extra</p>
              </div>
              {extraPrice && (
                <div className="text-right flex-shrink-0">
                  <p className="text-xs mb-0.5" style={{ color: 'var(--color-text-muted)' }}>Vanaf</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--color-primary)', lineHeight: 1 }}>
                    {formatPrice(extraPrice)}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Datum & tijd */}
      <div
        className="rounded-xl"
        style={{
          backgroundColor: 'var(--color-surface-elevated)',
          border: '1px solid rgba(196,130,111,0.2)',
        }}
      >
        <div className="px-4 pt-4">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Planning
          </p>
        </div>
        <div className="px-4 pb-4">
          <SummaryRow icon={Calendar} label="Datum" value={formattedDate} />
          <SummaryRow icon={Clock} label="Tijdslot" value={timeSlot?.label} />
        </div>
      </div>

      {/* Voertuig */}
      <div
        className="rounded-xl p-4"
        style={{
          backgroundColor: 'var(--color-surface-elevated)',
          border: '1px solid rgba(196,130,111,0.2)',
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
          Voertuig
        </p>
        <SummaryRow icon={Car} label="Type" value={vehicleType?.label_nl} />
        <SummaryRow icon={Car} label="Merk" value={data.vehicle_brand} />
      </div>

      {/* Contactgegevens */}
      <div
        className="rounded-xl p-4"
        style={{
          backgroundColor: 'var(--color-surface-elevated)',
          border: '1px solid rgba(196,130,111,0.2)',
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
          Contactgegevens
        </p>
        <SummaryRow icon={User} label="Naam" value={data.customer_name} />
        <SummaryRow icon={Mail} label="E-mail" value={data.customer_email} />
        <SummaryRow icon={Phone} label="Telefoon" value={data.customer_phone} />
        <SummaryRow
          icon={MapPin}
          label="Adres"
          value={
            data.customer_address
              ? `${data.customer_address}, ${data.customer_postal_code} ${data.customer_city}`
              : null
          }
        />
        <SummaryRow icon={FileText} label="Opmerkingen" value={data.notes} />
      </div>

      {/* Prijsopmerking */}
      <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
        {exactPrice
          ? 'Prijs is berekend op basis van uw voertuigtype. Gratis annuleren tot 24u voor de afspraak.'
          : 'De vermelde prijs is een startprijs. De definitieve prijs wordt bevestigd na inspectie van het voertuig. Gratis annuleren tot 24u voor de afspraak.'
        }
      </p>
    </div>
  )
}
