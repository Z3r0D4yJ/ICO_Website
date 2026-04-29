import { cn } from '@/lib/utils'

const VARIANTS = {
  primary: {
    bg: 'rgba(184, 111, 92, 0.14)',
    color: 'var(--copper-200)',
    border: 'rgba(184, 111, 92, 0.36)',
  },
  success: {
    bg: 'rgba(123, 174, 130, 0.14)',
    color: 'var(--signal-go)',
    border: 'rgba(123, 174, 130, 0.34)',
  },
  warning: {
    bg: 'rgba(201, 162, 107, 0.14)',
    color: 'var(--signal-wait)',
    border: 'rgba(201, 162, 107, 0.34)',
  },
  error: {
    bg: 'rgba(194, 101, 90, 0.14)',
    color: 'var(--signal-stop)',
    border: 'rgba(194, 101, 90, 0.34)',
  },
  info: {
    bg: 'rgba(143, 167, 170, 0.14)',
    color: 'var(--signal-info)',
    border: 'rgba(143, 167, 170, 0.34)',
  },
  neutral: {
    bg: 'rgba(250, 246, 241, 0.045)',
    color: 'var(--bone-200)',
    border: 'var(--color-border)',
  },
}

export default function Badge({
  variant = 'neutral',
  size = 'md',
  dot = false,
  className,
  children,
  ...props
}) {
  const style = VARIANTS[variant] || VARIANTS.neutral
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border font-mono font-medium uppercase tracking-[0.16em] whitespace-nowrap',
        sizes[size] || sizes.md,
        className
      )}
      style={{
        backgroundColor: style.bg,
        borderColor: style.border,
        color: style.color,
      }}
      {...props}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: style.color }} aria-hidden="true" />
      )}
      {children}
    </span>
  )
}

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
