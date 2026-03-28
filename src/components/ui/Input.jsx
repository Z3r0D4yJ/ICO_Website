import { forwardRef } from 'react'
import { AlertCircle, CheckCircle2 } from '@/lib/icons'
import { cn } from '@/lib/utils'

/**
 * ICO Input component
 * Altijd met label — nooit alleen placeholder.
 *
 * @param {string} label - Zichtbaar label (verplicht)
 * @param {string} error - Foutmelding
 * @param {string} hint - Hint tekst onder het veld
 * @param {boolean} success - Groen checkmark state
 * @param {React.ReactNode} leftIcon - Lucide icon links in het veld
 * @param {React.ReactNode} rightIcon - Lucide icon rechts in het veld
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    success,
    required,
    leftIcon,
    rightIcon,
    disabled,
    className,
    id,
    ...props
  },
  ref
) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).slice(2)}`
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`

  const hasError = Boolean(error)
  const hasSuccess = success && !hasError

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {label}
          {required && (
            <span className="ml-1" style={{ color: 'var(--color-error)' }} aria-hidden="true">*</span>
          )}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: hasError ? 'var(--color-error)' : 'var(--color-text-muted)' }}
            aria-hidden="true"
          >
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={cn(
            error ? errorId : '',
            hint ? hintId : ''
          ).trim() || undefined}
          className={cn(
            'w-full h-10 rounded-md text-sm',
            'transition-colors duration-150',
            'placeholder:text-[var(--color-text-muted)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'focus:outline-none focus:ring-2 focus:ring-offset-1',
            leftIcon ? 'pl-10' : 'pl-3',
            rightIcon || hasError || hasSuccess ? 'pr-10' : 'pr-3',
            // Default state
            !hasError && !hasSuccess && [
              'bg-[var(--color-surface-overlay)]',
              'border border-[rgba(196,130,111,0.2)]',
              'text-[var(--color-text-primary)]',
              'focus:border-[var(--color-primary)]',
              'focus:ring-[var(--color-primary)]/30',
              'focus:ring-offset-[var(--color-surface)]',
            ],
            // Error state
            hasError && [
              'bg-[var(--color-surface-overlay)]',
              'border border-[var(--color-error)]',
              'text-[var(--color-text-primary)]',
              'focus:ring-[var(--color-error)]/30',
              'focus:ring-offset-[var(--color-surface)]',
            ],
            // Success state
            hasSuccess && [
              'bg-[var(--color-surface-overlay)]',
              'border border-[var(--color-success)]',
              'text-[var(--color-text-primary)]',
              'focus:ring-[var(--color-success)]/30',
              'focus:ring-offset-[var(--color-surface)]',
            ],
            className
          )}
          {...props}
        />

        {/* Status icons rechts */}
        {(hasError || hasSuccess || rightIcon) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" aria-hidden="true">
            {hasError && <AlertCircle style={{ color: 'var(--color-error)' }} className="w-4 h-4" />}
            {hasSuccess && <CheckCircle2 style={{ color: 'var(--color-success)' }} className="w-4 h-4" />}
            {!hasError && !hasSuccess && rightIcon && (
              <span style={{ color: 'var(--color-text-muted)' }}>{rightIcon}</span>
            )}
          </div>
        )}
      </div>

      {/* Foutmelding */}
      {hasError && (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-xs"
          style={{ color: 'var(--color-error)' }}
        >
          <AlertCircle className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {/* Hint tekst */}
      {hint && !hasError && (
        <p id={hintId} className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {hint}
        </p>
      )}
    </div>
  )
})

// Textarea variant
export const Textarea = forwardRef(function Textarea(
  { label, error, hint, required, disabled, rows = 4, className, id, ...props },
  ref
) {
  const inputId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).slice(2)}`
  const errorId = `${inputId}-error`
  const hasError = Boolean(error)

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {label}
          {required && <span className="ml-1" style={{ color: 'var(--color-error)' }} aria-hidden="true">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        disabled={disabled}
        required={required}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'w-full px-3 py-2.5 rounded-md text-sm resize-y',
          'bg-[var(--color-surface-overlay)]',
          'border',
          'text-[var(--color-text-primary)]',
          'placeholder:text-[var(--color-text-muted)]',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          hasError
            ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/30'
            : 'border-[rgba(196,130,111,0.2)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/30',
          'focus:ring-offset-[var(--color-surface)]',
          className
        )}
        {...props}
      />

      {hasError && (
        <p id={errorId} role="alert" className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-error)' }}>
          <AlertCircle className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {hint && !hasError && (
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{hint}</p>
      )}
    </div>
  )
})

export default Input
