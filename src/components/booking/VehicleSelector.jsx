import { Car, Truck } from '@/lib/icons'
import { VEHICLE_TYPES } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'

const ICONS = { Car, Truck }

/**
 * VehicleSelector — grid van voertuigtypes als klikbare kaarten.
 *
 * @param {string|null} selected - Geselecteerd voertuigtype (value)
 * @param {function} onSelect - Callback met geselecteerde voertuigtype value
 * @param {Array|null} pricingTiers - pricing_tiers van de geselecteerde dienst (optional)
 */
export default function VehicleSelector({ selected, onSelect, pricingTiers = null }) {
  // Maak lookup: vehicle_type → price
  const priceByType = pricingTiers
    ? Object.fromEntries(pricingTiers.map((t) => [t.vehicle_type, t.price]))
    : null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {VEHICLE_TYPES.map((type) => {
        const isSelected = selected === type.value
        const Icon = ICONS[type.icon] || Car
        const price = priceByType?.[type.value]

        return (
          <button
            key={type.value}
            type="button"
            onClick={() => onSelect(type.value)}
            aria-pressed={isSelected}
            aria-label={type.label_nl}
            className={cn(
              'flex items-center gap-3 px-4 py-3.5 rounded-xl text-left',
              'transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
              'cursor-pointer',
              isSelected ? 'border-2' : 'border'
            )}
            style={
              isSelected
                ? {
                    backgroundColor: 'rgba(196,130,111,0.12)',
                    borderColor: 'var(--color-primary)',
                    boxShadow: '0 0 0 1px var(--color-primary)',
                  }
                : {
                    backgroundColor: 'var(--color-surface-elevated)',
                    borderColor: 'rgba(196,130,111,0.15)',
                  }
            }
          >
            {/* Icon */}
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: isSelected
                  ? 'rgba(196,130,111,0.2)'
                  : 'rgba(196,130,111,0.08)',
                border: '1px solid rgba(196,130,111,0.2)',
              }}
            >
              <Icon
                className="w-4 h-4"
                style={{ color: 'var(--color-primary)' }}
                aria-hidden="true"
              />
            </div>

            {/* Label + voorbeelden */}
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold leading-tight"
                style={{ color: isSelected ? 'var(--color-primary)' : 'var(--color-text-primary)' }}
              >
                {type.label_nl}
              </p>
              <p className="text-xs leading-tight mt-0.5 truncate" style={{ color: 'var(--color-text-muted)' }}>
                {type.examples_nl}
              </p>
            </div>

            {/* Prijs (als beschikbaar) */}
            {price != null && (
              <span
                className="text-sm font-bold flex-shrink-0"
                style={{ color: 'var(--color-primary)' }}
              >
                {formatPrice(price)}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
