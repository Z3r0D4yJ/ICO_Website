import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X } from '@/lib/icons'
import { cn } from '@/lib/utils'

export default function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnBackdrop = true,
  showCloseButton = true,
  className,
  children,
}) {
  const modalRef = useRef(null)
  const previouslyFocusedRef = useRef(null)

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-4xl',
  }

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => {
        const focusable = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable?.length) focusable[0].focus()
      })
    } else {
      document.body.style.overflow = ''
      previouslyFocusedRef.current?.focus()
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return
    if (e.key === 'Escape') {
      onClose?.()
      return
    }
    if (e.key !== 'Tab') return

    const focusable = modalRef.current?.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    if (!focusable?.length) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }, [isOpen, onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 flex items-end justify-center p-0 sm:items-center sm:p-4"
      style={{ zIndex: 'var(--z-overlay)' }}
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-[rgba(8,7,6,0.72)] backdrop-blur-sm animate-fade-in"
        aria-hidden="true"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={cn(
          'relative w-full max-h-[90vh] overflow-y-auto rounded-t-[var(--radius-2xl)] border border-[var(--color-border)] shadow-[var(--shadow-lg)] animate-slide-up sm:rounded-[var(--radius-2xl)]',
          sizes[size] || sizes.md,
          className
        )}
        style={{
          background:
            'radial-gradient(circle at 100% 0%, rgba(184,111,92,0.10), transparent 18rem), var(--ink-100)',
          zIndex: 'var(--z-modal)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pb-0 pt-2 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-[rgba(233,225,215,0.16)]" />
        </div>

        {(title || showCloseButton) && (
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-4 sm:px-6">
            {title && (
              <h2 id="modal-title" className="font-display text-2xl text-[var(--bone-000)]">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Modal sluiten"
                className="ml-auto rounded-[var(--radius-sm)] p-2 text-[var(--bone-300)] transition-colors hover:bg-[var(--ink-200)] hover:text-[var(--bone-000)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(216,158,140,0.45)]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        <div className="px-4 py-5 sm:px-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

Modal.Footer = function ModalFooter({ className, children }) {
  return (
    <div className={cn('mt-6 flex flex-col-reverse items-stretch justify-end gap-2 border-t border-[var(--color-border)] pt-4 sm:flex-row sm:items-center sm:gap-3', className)}>
      {children}
    </div>
  )
}
