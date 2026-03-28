import { forwardRef } from 'react'
import { Loader2 } from '@/lib/icons'
import { cn } from '@/lib/utils'

/**
 * ICO Button component
 *
 * @param {'primary'|'secondary'|'ghost'|'danger'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} loading
 * @param {boolean} fullWidth
 * @param {React.ReactNode} leftIcon
 * @param {React.ReactNode} rightIcon
 */
const Button = forwardRef(function Button(
  {
    as: Tag = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    disabled,
    children,
    className,
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading

  const base = [
    'inline-flex items-center justify-center gap-2.5',
    'font-semibold rounded-xl',
    'cursor-pointer select-none',
    'transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'active:scale-[0.98]',
    fullWidth ? 'w-full' : '',
  ]

  // Colors defined in globals.css as .btn-* classes — CSS variables work reliably there
  const variantClasses = {
    primary: 'btn-primary focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-[var(--color-surface)]',
    secondary: 'btn-secondary focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-[var(--color-surface)]',
    ghost: 'btn-ghost focus-visible:ring-[rgba(196,130,111,0.4)] focus-visible:ring-offset-[var(--color-surface)]',
    danger: 'btn-danger focus-visible:ring-[var(--color-error)] focus-visible:ring-offset-[var(--color-surface)]',
  }

  const sizes = {
    sm: 'h-9 px-4 text-xs min-w-[44px]',
    md: 'h-10 px-5 text-sm min-w-[44px]',
    lg: 'h-12 px-6 text-sm min-w-[44px]',
  }

  return (
    <Tag
      ref={ref}
      disabled={Tag === 'button' ? isDisabled : undefined}
      aria-busy={loading || undefined}
      className={cn(base, variantClasses[variant], sizes[size], className)}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" weight="bold" aria-hidden="true" />
      ) : leftIcon ? (
        <span className="flex items-center justify-center flex-shrink-0 leading-none" aria-hidden="true">{leftIcon}</span>
      ) : null}

      <span className="leading-none">{children}</span>

      {!loading && rightIcon && (
        <span className="flex items-center justify-center flex-shrink-0 leading-none" aria-hidden="true">{rightIcon}</span>
      )}
    </Tag>
  )
})

export default Button
