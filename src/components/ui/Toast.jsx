import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/stores/uiStore'

/**
 * Enkel toast item
 */
function ToastItem({ id, type = 'info', title, message, duration = 5000 }) {
  const removeToast = useUiStore((s) => s.removeToast)
  const progressRef = useRef(null)

  const config = {
    success: {
      icon: CheckCircle2,
      color: 'var(--color-success)',
      bg: 'rgba(34, 197, 94, 0.12)',
      border: 'rgba(34, 197, 94, 0.3)',
    },
    error: {
      icon: AlertCircle,
      color: 'var(--color-error)',
      bg: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.3)',
    },
    warning: {
      icon: AlertTriangle,
      color: 'var(--color-warning)',
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.3)',
    },
    info: {
      icon: Info,
      color: 'var(--color-info)',
      bg: 'rgba(59, 130, 246, 0.12)',
      border: 'rgba(59, 130, 246, 0.3)',
    },
  }

  const { icon: Icon, color, bg, border } = config[type] || config.info

  // Progress bar animatie
  useEffect(() => {
    if (duration <= 0 || !progressRef.current) return
    const el = progressRef.current
    el.style.transition = 'none'
    el.style.width = '100%'
    // Force reflow
    void el.offsetWidth
    el.style.transition = `width ${duration}ms linear`
    el.style.width = '0%'
  }, [duration])

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className="relative flex items-start gap-3 w-full max-w-sm rounded-xl px-4 py-3.5 shadow-[var(--shadow-lg)] animate-slide-in-right overflow-hidden"
      style={{
        backgroundColor: 'var(--color-surface-overlay)',
        border: `1px solid ${border}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Kleur-accent balk links */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />

      {/* Icon */}
      <Icon
        className="w-5 h-5 flex-shrink-0 mt-0.5"
        style={{ color }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--color-text-primary)' }}>
            {title}
          </p>
        )}
        {message && (
          <p className="text-sm mt-0.5 leading-snug" style={{ color: 'var(--color-text-secondary)' }}>
            {message}
          </p>
        )}
      </div>

      {/* Sluit button */}
      <button
        onClick={() => removeToast(id)}
        aria-label="Notificatie sluiten"
        className="flex-shrink-0 p-1 rounded cursor-pointer transition-colors duration-150 hover:bg-[var(--color-surface-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>

      {/* Progress bar */}
      {duration > 0 && (
        <div
          ref={progressRef}
          className="absolute bottom-0 left-0 h-0.5 rounded-bl-xl"
          style={{ backgroundColor: color, width: '100%' }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

/**
 * Toast container — plaatst alle toasts onderaan rechts (desktop) / onderaan midden (mobile)
 * Voeg toe aan App.jsx root niveau.
 */
export default function ToastContainer() {
  const toasts = useUiStore((s) => s.toasts)

  if (!toasts.length) return null

  return createPortal(
    <div
      aria-label="Notificaties"
      className={cn(
        'fixed flex flex-col gap-3',
        // Desktop: rechtsonder | Mobile: ondermidden
        'bottom-4 right-4',
        'sm:bottom-6 sm:right-6',
      )}
      style={{ zIndex: 'var(--z-toast)' }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>,
    document.body
  )
}

export { ToastItem }
