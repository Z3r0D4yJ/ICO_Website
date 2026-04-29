import { useState, useRef, useId } from 'react'
import { ChevronDown } from '@/lib/icons'
import { cn } from '@/lib/utils'

export default function Accordion({ children, className }) {
  return (
    <div className={cn('flex flex-col divide-y divide-[var(--color-border)]', className)}>
      {children}
    </div>
  )
}

Accordion.Item = function AccordionItem({ title, defaultOpen = false, className, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentRef = useRef(null)
  const uid = useId()
  const headerId = `accordion-header-${uid}`
  const panelId = `accordion-panel-${uid}`

  return (
    <div className={cn('', className)}>
      <button
        id={headerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex w-full items-start justify-between gap-5 py-5 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[rgba(216,158,140,0.45)]"
      >
        <span className="font-display text-xl leading-snug text-[var(--bone-000)] transition-colors group-hover:text-[var(--copper-200)]">
          {title}
        </span>
        <span className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--copper-300)] transition-all group-hover:border-[rgba(184,111,92,0.45)]">
          <ChevronDown
            className={cn('w-4 h-4 transition-transform duration-300', isOpen && 'rotate-180')}
            aria-hidden="true"
          />
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        ref={contentRef}
        className="overflow-hidden transition-[max-height,opacity] duration-300 ease-[var(--ease-out)]"
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight || 1000}px` : '0px',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="pb-5 pr-8 text-sm leading-relaxed text-[var(--bone-200)]">
          {children}
        </div>
      </div>
    </div>
  )
}

export function AccordionGroup({ items = [], className }) {
  return (
    <Accordion className={cn('border-y border-[var(--color-border)]', className)}>
      {items.map((item, i) => (
        <Accordion.Item key={item.id || i} title={item.question}>
          {item.answer}
        </Accordion.Item>
      ))}
    </Accordion>
  )
}
