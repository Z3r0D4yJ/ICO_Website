import { forwardRef, useId } from 'react'
import { AlertCircle, CheckCircle2 } from '@/lib/icons'
import { cn } from '@/lib/utils'

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
  const uid = useId()
  const inputId = id || `input-${uid}`
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`
  const hasError = Boolean(error)
  const hasSuccess = Boolean(success && !hasError)

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="ico-label">
          {label}
          {required && <span className="ml-1 text-[var(--signal-stop)]" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: hasError ? 'var(--signal-stop)' : 'var(--bone-300)' }}
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
          aria-required={required || undefined}
          aria-invalid={hasError || undefined}
          aria-describedby={cn(error ? errorId : '', hint ? hintId : '').trim() || undefined}
          className={cn(
            'ico-field text-sm placeholder:text-[var(--bone-300)] disabled:opacity-50 disabled:cursor-not-allowed',
            leftIcon ? 'pl-10' : 'pl-3.5',
            rightIcon || hasError || hasSuccess ? 'pr-10' : 'pr-3.5',
            hasError && 'border-[var(--signal-stop)] focus:border-[var(--signal-stop)] focus:ring-[rgba(194,101,90,0.18)]',
            hasSuccess && 'border-[var(--signal-go)] focus:border-[var(--signal-go)] focus:ring-[rgba(123,174,130,0.18)]',
            className
          )}
          {...props}
        />

        {(hasError || hasSuccess || rightIcon) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" aria-hidden="true">
            {hasError && <AlertCircle style={{ color: 'var(--signal-stop)' }} className="w-4 h-4" />}
            {hasSuccess && <CheckCircle2 style={{ color: 'var(--signal-go)' }} className="w-4 h-4" />}
            {!hasError && !hasSuccess && rightIcon && (
              <span style={{ color: 'var(--bone-300)' }}>{rightIcon}</span>
            )}
          </div>
        )}
      </div>

      {hasError && (
        <p id={errorId} role="alert" className="flex items-center gap-1.5 text-xs text-[var(--signal-stop)]">
          <AlertCircle className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {hint && !hasError && (
        <p id={hintId} className="text-xs text-[var(--bone-300)]">
          {hint}
        </p>
      )}
    </div>
  )
})

export const Textarea = forwardRef(function Textarea(
  { label, error, hint, required, disabled, rows = 4, className, id, ...props },
  ref
) {
  const uid = useId()
  const inputId = id || `textarea-${uid}`
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`
  const hasError = Boolean(error)

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="ico-label">
          {label}
          {required && <span className="ml-1 text-[var(--signal-stop)]" aria-hidden="true">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        disabled={disabled}
        required={required}
        aria-required={required || undefined}
        aria-invalid={hasError || undefined}
        aria-describedby={cn(error ? errorId : '', hint ? hintId : '').trim() || undefined}
        className={cn(
          'ico-field min-h-[8rem] px-3.5 py-3 text-sm resize-y placeholder:text-[var(--bone-300)] disabled:opacity-50 disabled:cursor-not-allowed',
          hasError && 'border-[var(--signal-stop)] focus:border-[var(--signal-stop)] focus:ring-[rgba(194,101,90,0.18)]',
          className
        )}
        {...props}
      />

      {hasError && (
        <p id={errorId} role="alert" className="flex items-center gap-1.5 text-xs text-[var(--signal-stop)]">
          <AlertCircle className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {hint && !hasError && (
        <p id={hintId} className="text-xs text-[var(--bone-300)]">
          {hint}
        </p>
      )}
    </div>
  )
})

export default Input
