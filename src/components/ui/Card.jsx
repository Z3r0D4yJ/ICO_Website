import { cn } from '@/lib/utils'

export default function Card({
  variant = 'default',
  hoverable = false,
  clickable = false,
  padding = true,
  className,
  children,
  ...props
}) {
  const variants = {
    default: 'ico-panel',
    elevated: 'ico-panel',
    glass: 'ico-panel-soft',
    highlight: 'ico-panel-copper',
  }

  return (
    <div
      className={cn(
        'overflow-hidden transition-all duration-300 ease-[var(--ease-out)]',
        variants[variant] || variants.default,
        padding && 'p-5 md:p-6',
        (hoverable || clickable) && 'hover:-translate-y-0.5 hover:border-[rgba(184,111,92,0.45)]',
        clickable && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

Card.Header = function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('mb-5', className)} {...props}>
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
    <div className={cn('mt-5 pt-5 border-t border-[var(--color-border)]', className)} {...props}>
      {children}
    </div>
  )
}
