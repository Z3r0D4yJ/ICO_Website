import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from '@/lib/icons'
import { useUiStore } from '@/stores/uiStore'

function ToastItem({ id, type = 'info', title, message, duration = 5000 }) {
  const removeToast = useUiStore((s) => s.removeToast)
  const progressRef = useRef(null)

  const config = {
    success: { icon: CheckCircle2, color: 'var(--signal-go)', border: 'rgba(123,174,130,0.35)' },
    error: { icon: AlertCircle, color: 'var(--signal-stop)', border: 'rgba(194,101,90,0.35)' },
    warning: { icon: AlertTriangle, color: 'var(--signal-wait)', border: 'rgba(201,162,107,0.35)' },
    info: { icon: Info, color: 'var(--signal-info)', border: 'rgba(143,167,170,0.35)' },
  }

  const { icon: Icon, color, border } = config[type] || config.info

  useEffect(() => {
    if (duration <= 0 || !progressRef.current) return
    const el = progressRef.current
    el.style.transition = 'none'
    el.style.width = '100%'
    void el.offsetWidth
    el.style.transition = `width ${duration}ms linear`
    el.style.width = '0%'
  }, [duration])

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className="relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-[var(--radius-xl)] px-4 py-3.5 shadow-[var(--shadow-lg)] animate-slide-in-right"
      style={{
        background: 'linear-gradient(180deg, rgba(250,246,241,0.04), transparent), var(--ink-100)',
        border: `1px solid ${border}`,
      }}
    >
      <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color }} aria-hidden="true" />

      <div className="min-w-0 flex-1">
        {title && <p className="text-sm font-semibold leading-snug text-[var(--bone-000)]">{title}</p>}
        {message && <p className="mt-0.5 text-sm leading-snug text-[var(--bone-200)]">{message}</p>}
      </div>

      <button
        type="button"
        onClick={() => removeToast(id)}
        aria-label="Notificatie sluiten"
        className="flex-shrink-0 rounded-[var(--radius-sm)] p-1 text-[var(--bone-300)] transition-colors hover:bg-[var(--ink-200)] hover:text-[var(--bone-000)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(216,158,140,0.45)]"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>

      {duration > 0 && (
        <div ref={progressRef} className="absolute bottom-0 left-0 h-0.5" style={{ backgroundColor: color, width: '100%' }} aria-hidden="true" />
      )}
    </div>
  )
}

export default function ToastContainer() {
  const toasts = useUiStore((s) => s.toasts)
  if (!toasts.length) return null

  return createPortal(
    <div
      aria-label="Notificaties"
      className="fixed bottom-4 right-4 flex flex-col gap-3 sm:bottom-6 sm:right-6"
      style={{ zIndex: 'var(--z-toast)' }}
    >
      {toasts.map((toast) => <ToastItem key={toast.id} {...toast} />)}
    </div>,
    document.body
  )
}

export { ToastItem }
