import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X } from '@/lib/icons'
import { cn } from '@/lib/utils'

/**
 * ICO Modal component
 * - Focus trap binnen modal
 * - Escape toets sluit modal
 * - Scroll lock op body
 * - Slide-up animatie
 *
 * @param {boolean} isOpen
 * @param {function} onClose
 * @param {string} title
 * @param {'sm'|'md'|'lg'|'xl'|'full'} size
 */
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

  // Scroll lock + focus management
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement
      document.body.style.overflow = 'hidden'

      // Focus eerste focusbaar element in modal
      requestAnimationFrame(() => {
        const focusable = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable?.length) focusable[0].focus()
      })
    } else {
      document.body.style.overflow = ''
      // Geef focus terug aan eerder gefocust element
      previouslyFocusedRef.current?.focus()
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Focus trap
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

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }, [isOpen, onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 'var(--z-overlay)' }}
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        aria-hidden="true"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Modal container */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={cn(
          'relative w-full rounded-xl shadow-[var(--shadow-lg)]',
          'animate-slide-up',
          'border border-[rgba(196,130,111,0.2)]',
          sizes[size],
          className
        )}
        style={{
          backgroundColor: 'var(--color-surface-overlay)',
          zIndex: 'var(--z-modal)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(196,130,111,0.15)' }}>
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold"
                style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '0.03em' }}
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                aria-label="Modal sluiten"
                className="p-1.5 rounded-md cursor-pointer transition-colors duration-150 hover:bg-[var(--color-surface-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                style={{ color: 'var(--color-text-muted)', marginLeft: 'auto' }}
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

// Subcomponenten
Modal.Footer = function ModalFooter({ className, children }) {
  return (
    <div className={cn('flex items-center justify-end gap-3 mt-6 pt-4 border-t', className)} style={{ borderColor: 'rgba(196,130,111,0.15)' }}>
      {children}
    </div>
  )
}
