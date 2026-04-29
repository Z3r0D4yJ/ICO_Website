import { forwardRef, useId } from 'react'
import { ChevronDown, AlertCircle } from '@/lib/icons'
import { cn } from '@/lib/utils'

const Select = forwardRef(function Select(
  {
    label,
    error,
    hint,
    required,
    disabled,
    placeholder = 'Selecteer een optie',
    options = [],
    className,
    id,
    ...props
  },
  ref
) {
  const uid = useId()
  const inputId = id || `select-${uid}`
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

      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          aria-required={required || undefined}
          aria-invalid={hasError || undefined}
          aria-describedby={cn(error ? errorId : '', hint ? hintId : '').trim() || undefined}
          className={cn(
            'ico-field h-11 pl-3.5 pr-10 text-sm appearance-none disabled:opacity-50 disabled:cursor-not-allowed',
            hasError && 'border-[var(--signal-stop)] focus:border-[var(--signal-stop)] focus:ring-[rgba(194,101,90,0.18)]',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4" aria-hidden="true">
          {hasError ? (
            <AlertCircle className="w-4 h-4 text-[var(--signal-stop)]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[var(--bone-300)]" />
          )}
        </div>
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

export default Select
