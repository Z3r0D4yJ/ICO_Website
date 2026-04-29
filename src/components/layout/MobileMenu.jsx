import { useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { X, ShoppingBag } from '@/lib/icons'
import { useTranslation } from 'react-i18next'
import { useUiStore } from '@/stores/uiStore'
import { useCartStore } from '@/stores/cartStore'
import LanguageSwitcher from './LanguageSwitcher'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { num: '01', to: '/diensten',  labelKey: 'nav.services' },
  { num: '02', to: '/shop',      labelKey: 'nav.shop' },
  { num: '03', to: '/projecten', labelKey: 'nav.projects' },
  { num: '04', to: '/over-ons',  labelKey: 'nav.about' },
  { num: '05', to: '/faq',       labelKey: 'nav.faq' },
  { num: '06', to: '/contact',   labelKey: 'nav.contact' },
]

export default function MobileMenu() {
  const { t } = useTranslation()
  const { isMobileMenuOpen, closeMobileMenu } = useUiStore()
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0))
  const menuRef = useRef(null)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => closeButtonRef.current?.focus())
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeMobileMenu() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [closeMobileMenu])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 transition-opacity duration-300 lg:hidden',
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{
          zIndex: 'var(--z-overlay)',
          background: 'rgba(8,7,6,0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        aria-hidden="true"
        onClick={closeMobileMenu}
      />

      {/* Panel */}
      <nav
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigatiemenu"
        className={cn(
          'fixed top-0 right-0 h-full w-[85vw] max-w-md',
          'flex flex-col',
          'transition-transform duration-300 ease-out lg:hidden',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{
          backgroundColor: 'var(--ink-050)',
          borderLeft: '1px solid var(--ink-400)',
          zIndex: 'var(--z-modal)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 h-16 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--ink-300)' }}
        >
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(184,111,92,0.45)]/40 rounded"
            aria-label="ICO homepage"
          >
            <img
              src="/images/logo.png"
              alt=""
              className="h-9 w-auto object-contain"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(184,111,92,0.25))' }}
            />
            <span
              style={{
                fontFamily: 'var(--font-fraunces)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 15,
                letterSpacing: 0,
                color: 'var(--bone-000)',
              }}
            >
              ICO
            </span>
          </Link>

          <button
            ref={closeButtonRef}
            onClick={closeMobileMenu}
            aria-label="Menu sluiten"
            className="p-2 rounded transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(184,111,92,0.45)]/40"
            style={{ color: 'var(--bone-200)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--copper-200)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--bone-200)' }}
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Section label */}
        <div
          className="px-6 py-5 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--ink-300)' }}
        >
          <span className="edit-eyebrow">Navigatie</span>
        </div>

        {/* Nav links — editorial: number + Fraunces label */}
        <div className="flex-1 overflow-y-auto">
          <ul className="flex flex-col" role="list">
            {NAV_ITEMS.map(({ num, to, labelKey }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={closeMobileMenu}
                  end={to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-baseline gap-5 px-6 py-5 transition-colors duration-150 cursor-pointer',
                      'focus-visible:outline-none focus-visible:bg-[var(--ink-100)]'
                    )
                  }
                  style={({ isActive }) => ({
                    borderBottom: '1px solid var(--ink-300)',
                    color: isActive ? 'var(--bone-000)' : 'var(--bone-100)',
                    backgroundColor: isActive ? 'var(--ink-100)' : 'transparent',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          letterSpacing: '0.2em',
                          color: isActive ? 'var(--copper-400)' : 'var(--bone-300)',
                          flexShrink: 0,
                          minWidth: 24,
                        }}
                      >
                        {num}
                      </span>
                      <span
                        className="flex-1"
                        style={{
                          fontFamily: 'var(--font-fraunces)',
                          fontWeight: 400,
                          fontSize: 26,
                          lineHeight: 1.1,
                          letterSpacing: 0,
                          color: 'inherit',
                        }}
                      >
                        {t(labelKey)}
                      </span>
                      <span
                        className="edit-arrow"
                        aria-hidden="true"
                        style={{ color: isActive ? 'var(--copper-200)' : 'var(--ink-500)' }}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Cart link */}
          {itemCount > 0 && (
            <NavLink
              to="/shop/winkelwagen"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-6 py-5 transition-colors duration-150 cursor-pointer"
              style={{
                borderBottom: '1px solid var(--ink-300)',
                fontFamily: 'var(--font-geist)',
                fontSize: 14,
                color: 'var(--bone-100)',
              }}
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              Winkelwagen
              <span
                className="ml-auto"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  padding: '2px 8px',
                  background: 'var(--copper-400)',
                  color: 'var(--ink-000)',
                  borderRadius: 999,
                }}
              >
                {itemCount}
              </span>
            </NavLink>
          )}
        </div>

        {/* Footer — Boek CTA + lang switcher */}
        <div
          className="flex-shrink-0 px-6 py-5"
          style={{ borderTop: '1px solid var(--ink-300)' }}
        >
          <Link
            to="/boeken"
            onClick={closeMobileMenu}
            className="edit-btn edit-btn-primary w-full"
            style={{ width: '100%' }}
          >
            {t('common.bookNow')}
            <span className="edit-arrow" aria-hidden="true" />
          </Link>
          <div className="mt-5 flex justify-center">
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    </>
  )
}
