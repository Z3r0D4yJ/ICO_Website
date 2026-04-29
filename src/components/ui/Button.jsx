import { forwardRef } from 'react'
import { Loader2 } from '@/lib/icons'
import { cn } from '@/lib/utils'

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

  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }

  const sizes = {
    sm: 'min-h-9 px-3.5 text-xs',
    md: 'min-h-11 px-5 text-sm',
    lg: 'min-h-14 px-6 text-base',
  }

  return (
    <Tag
      ref={ref}
      disabled={Tag === 'button' ? isDisabled : undefined}
      aria-busy={loading || undefined}
      aria-disabled={Tag !== 'button' && isDisabled ? true : undefined}
      className={cn(
        'btn-shell',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth && 'w-full',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(216,158,140,0.5)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink-050)]',
        'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" weight="bold" aria-hidden="true" />
      ) : leftIcon ? (
        <span className="flex items-center justify-center flex-shrink-0 leading-none" aria-hidden="true">
          {leftIcon}
        </span>
      ) : null}

      <span className="leading-none">{children}</span>

      {!loading && rightIcon && (
        <span className="flex items-center justify-center flex-shrink-0 leading-none" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </Tag>
  )
})

export default Button
