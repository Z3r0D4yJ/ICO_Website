import { cn } from '@/lib/utils'

/**
 * ICO Card component
 *
 * @param {'default'|'elevated'|'glass'|'highlight'} variant
 * @param {boolean} hoverable - Lift effect op hover
 * @param {boolean} clickable - cursor-pointer + hover states
 */
export default function Card({
  variant = 'default',
  hoverable = false,
  clickable = false,
  padding = true,
  className,
  children,
  ...props
}) {
  const base = [
    'rounded-xl overflow-hidden',
    'transition-all duration-250',
  ]

  const variants = {
    default: [
      'bg-[var(--color-surface-elevated)]',
      'border border-[rgba(196,130,111,0.18)]',
    ],
    elevated: [
      'bg-[var(--color-surface-elevated)]',
      'border border-[rgba(196,130,111,0.18)]',
      'shadow-[var(--shadow-md)]',
    ],
    glass: [
      'bg-[var(--color-surface-elevated)]/80',
      'backdrop-blur-md',
      'border border-[rgba(196,130,111,0.2)]',
    ],
    highlight: [
      'bg-[var(--color-surface-elevated)]',
      'border border-[var(--color-primary)]',
      'shadow-[0_0_20px_rgba(196,130,111,0.15)]',
    ],
  }

  const hoverClass = hoverable || clickable
    ? [
        'hover:-translate-y-0.5',
        'hover:shadow-[var(--shadow-lg)]',
        'hover:border-[rgba(196,130,111,0.4)]',
        clickable ? 'cursor-pointer' : '',
      ]
    : []

  return (
    <div
      className={cn(base, variants[variant], hoverClass, padding ? 'p-6' : '', className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Sub-componenten voor gestructureerde card inhoud
Card.Header = function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

Card.Body = function CardBody({ className, children, ...props }) {
  return (
    <div className={cn('flex-1', className)} {...props}>
      {children}
    </div>
  )
}

Card.Footer = function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-[rgba(196,130,111,0.2)]', className)} {...props}>
      {children}
    </div>
  )
}
