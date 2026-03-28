import { useState, useRef, useId } from 'react'
import { ChevronDown } from '@/lib/icons'
import { cn } from '@/lib/utils'

/**
 * ICO Accordion component — voor FAQ pagina
 *
 * Gebruik:
 * ```jsx
 * <Accordion>
 *   <Accordion.Item title="Vraag hier">Antwoord hier</Accordion.Item>
 *   <Accordion.Item title="Andere vraag">Ander antwoord</Accordion.Item>
 * </Accordion>
 *
 * // Of als standalone met items array:
 * <AccordionGroup items={[{ question, answer }]} />
 * ```
 */
export default function Accordion({ children, className }) {
  return (
    <div
      className={cn('flex flex-col divide-y', className)}
      style={{ borderColor: 'rgba(196,130,111,0.15)' }}
    >
      {children}
    </div>
  )
}

/**
 * Enkel accordion item
 * @param {string} title
 * @param {boolean} defaultOpen
 * @param {React.ReactNode} children
 */
Accordion.Item = function AccordionItem({ title, defaultOpen = false, className, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentRef = useRef(null)
  const uid = useId()
  const headerId = `accordion-header-${uid}`
  const panelId = `accordion-panel-${uid}`

  return (
    <div
      className={cn('', className)}
      style={{ borderColor: 'rgba(196,130,111,0.15)' }}
    >
      {/* Trigger */}
      <button
        id={headerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex items-center justify-between w-full py-5 text-left',
          'cursor-pointer',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
          'group',
        )}
        style={{
          color: isOpen ? 'var(--color-primary)' : 'var(--color-text-primary)',
          '--tw-ring-color': 'var(--color-primary)',
        }}
      >
        <span
          className="text-base font-medium pr-4 group-hover:text-[var(--color-primary)] transition-colors duration-150"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {title}
        </span>

        {/* Chevron */}
        <ChevronDown
          className={cn(
            'w-5 h-5 flex-shrink-0 transition-transform duration-300',
            isOpen ? 'rotate-180' : 'rotate-0'
          )}
          style={{ color: isOpen ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
          aria-hidden="true"
        />
      </button>

      {/* Panel — animatie via max-height */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        ref={contentRef}
        className="overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight || 1000}px` : '0px',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div
          className="pb-5 text-sm leading-relaxed"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * Convenience component — geeft een lijst van items mee als prop
 * @param {Array<{question: string, answer: string, category?: string}>} items
 */
export function AccordionGroup({ items = [], className }) {
  return (
    <Accordion className={cn('border-t border-b', className)} style={{ borderColor: 'rgba(196,130,111,0.15)' }}>
      {items.map((item, i) => (
        <Accordion.Item key={i} title={item.question}>
          {item.answer}
        </Accordion.Item>
      ))}
    </Accordion>
  )
}
