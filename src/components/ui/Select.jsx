import { forwardRef } from 'react'
import { ChevronDown, AlertCircle } from '@/lib/icons'
import { cn } from '@/lib/utils'

/**
 * ICO Select component
 * Custom gestyled `<select>` — zelfde look als Input.
 *
 * @param {string} label
 * @param {string} error
 * @param {string} placeholder - Disabled eerste optie
 * @param {Array<{value: string, label: string}>} options
 */
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
  const inputId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).slice(2)}`
  const errorId = `${inputId}-error`
  const hasError = Boolean(error)

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
        <select
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'w-full h-10 pl-3 pr-10 rounded-md text-sm appearance-none',
            'bg-[var(--color-surface-overlay)]',
            'border',
            'text-[var(--color-text-primary)]',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-offset-1',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'cursor-pointer',
            hasError
              ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/30'
              : 'border-[rgba(196,130,111,0.2)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/30',
            'focus:ring-offset-[var(--color-surface)]',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled style={{ color: 'var(--color-text-muted)' }}>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              style={{
                backgroundColor: 'var(--color-surface-overlay)',
                color: 'var(--color-text-primary)',
              }}
            >
              {opt.label}
            </option>
          ))}
        </select>

        {/* Chevron icoon */}
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4"
          aria-hidden="true"
        >
          {hasError
            ? <AlertCircle className="w-4 h-4" style={{ color: 'var(--color-error)' }} />
            : <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
          }
        </div>
      </div>

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

export default Select
