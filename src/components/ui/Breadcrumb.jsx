import { Link } from 'react-router-dom'
import { ChevronRight, Home } from '@/lib/icons'
import { cn } from '@/lib/utils'

/**
 * Breadcrumb navigatie — WCAG compliant met aria-label en structured data.
 *
 * @param {Array<{label: string, to?: string}>} items
 *   Laatste item is de huidige pagina (geen `to` nodig).
 */
export default function Breadcrumb({ items = [], className }) {
  return (
    <nav aria-label="Kruimelpad" className={cn('py-3', className)}>
      <ol
        className="flex items-center gap-1.5 flex-wrap text-sm"
        role="list"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {/* Home */}
        <li
          className="flex items-center gap-1.5"
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <Link
            to="/"
            aria-label="Home"
            className="transition-colors duration-150 hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:text-[var(--color-primary)]"
            style={{ color: 'var(--color-text-muted)' }}
            itemProp="item"
          >
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
            <span itemProp="name" className="sr-only">Home</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const position = index + 2

          return (
            <li
              key={index}
              className="flex items-center gap-1.5"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <ChevronRight
                className="w-3.5 h-3.5 flex-shrink-0"
                style={{ color: 'var(--color-border-light)' }}
                aria-hidden="true"
              />

              {isLast || !item.to ? (
                <span
                  className="font-medium"
                  style={{ color: 'var(--color-text-primary)' }}
                  aria-current="page"
                  itemProp="name"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="transition-colors duration-150 hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:text-[var(--color-primary)]"
                  style={{ color: 'var(--color-text-muted)' }}
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(position)} />
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
