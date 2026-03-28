import { cn } from '@/lib/utils'

/**
 * ICO Badge component
 * Gebruikt voor boeking-statussen, product labels, tags.
 *
 * @param {'primary'|'success'|'warning'|'error'|'info'|'neutral'} variant
 * @param {'sm'|'md'} size
 * @param {boolean} dot - Kleine kleur-dot links
 */
export default function Badge({
  variant = 'neutral',
  size = 'md',
  dot = false,
  className,
  children,
  ...props
}) {
  const base = [
    'inline-flex items-center gap-1.5',
    'font-semibold rounded-full uppercase tracking-wide',
    'whitespace-nowrap',
  ]

  const variants = {
    primary: {
      bg: 'rgba(196, 130, 111, 0.15)',
      color: 'var(--color-primary)',
      border: '1px solid rgba(196, 130, 111, 0.4)',
    },
    success: {
      bg: 'rgba(34, 197, 94, 0.12)',
      color: 'var(--color-success)',
      border: '1px solid rgba(34, 197, 94, 0.35)',
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.12)',
      color: 'var(--color-warning)',
      border: '1px solid rgba(245, 158, 11, 0.35)',
    },
    error: {
      bg: 'rgba(239, 68, 68, 0.12)',
      color: 'var(--color-error)',
      border: '1px solid rgba(239, 68, 68, 0.35)',
    },
    info: {
      bg: 'rgba(59, 130, 246, 0.12)',
      color: 'var(--color-info)',
      border: '1px solid rgba(59, 130, 246, 0.35)',
    },
    neutral: {
      bg: 'var(--color-surface-overlay)',
      color: 'var(--color-text-secondary)',
      border: '1px solid rgba(196,130,111,0.2)',
    },
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  }

  const style = variants[variant]

  return (
    <span
      className={cn(base, sizes[size], className)}
      style={{
        backgroundColor: style.bg,
        color: style.color,
        border: style.border,
      }}
      {...props}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: style.color }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}

// Helper: booking status → badge variant
export const BOOKING_STATUS_VARIANT = {
  pending: 'warning',
  confirmed: 'info',
  in_progress: 'primary',
  completed: 'success',
  cancelled: 'error',
}

export const BOOKING_STATUS_NL = {
  pending: 'In afwachting',
  confirmed: 'Bevestigd',
  in_progress: 'Bezig',
  completed: 'Voltooid',
  cancelled: 'Geannuleerd',
}
