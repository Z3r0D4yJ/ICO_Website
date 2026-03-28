import { useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { X, Car, Sparkles, ShoppingBag, BookOpen, Users, Phone, HelpCircle } from '@/lib/icons'
import { useTranslation } from 'react-i18next'
import { useUiStore } from '@/stores/uiStore'
import { useCartStore } from '@/stores/cartStore'
import LanguageSwitcher from './LanguageSwitcher'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/diensten',  labelKey: 'nav.services', icon: Car },
  { to: '/shop',      labelKey: 'nav.shop',     icon: ShoppingBag },
  { to: '/blog',      labelKey: 'nav.blog',     icon: BookOpen },
  { to: '/over-ons',  labelKey: 'nav.about',    icon: Users },
  { to: '/contact',   labelKey: 'nav.contact',  icon: Phone },
  { to: '/faq',       labelKey: 'nav.faq',      icon: HelpCircle },
]

export default function MobileMenu() {
  const { t } = useTranslation()
  const { isMobileMenuOpen, closeMobileMenu } = useUiStore()
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0))
  const menuRef = useRef(null)
  const closeButtonRef = useRef(null)

  // Focus eerste element bij open, scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => closeButtonRef.current?.focus())
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  // Sluit bij Escape
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
          'fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{ zIndex: 'var(--z-overlay)' }}
        aria-hidden="true"
        onClick={closeMobileMenu}
      />

      {/* Menu panel — slide van rechts */}
      <nav
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigatiemenu"
        className={cn(
          'fixed top-0 right-0 h-full w-80 max-w-[85vw]',
          'flex flex-col',
          'transition-transform duration-300 ease-out lg:hidden',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{
          backgroundColor: 'var(--color-surface-elevated)',
          borderLeft: '1px solid rgba(196,130,111,0.2)',
          zIndex: 'var(--z-modal)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: 'rgba(196,130,111,0.15)' }}
        >
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-lg"
          >
            <img
              src="/images/logo.png"
              alt="ICO — Intensive Cleaning Organization"
              className="h-10 w-auto object-contain rounded-md"
            />
          </Link>

          <button
            ref={closeButtonRef}
            onClick={closeMobileMenu}
            aria-label="Menu sluiten"
            className="p-2 rounded-md cursor-pointer transition-colors duration-150 hover:bg-[var(--color-surface-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="flex flex-col gap-1" role="list">
            {NAV_ITEMS.map(({ to, labelKey, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={closeMobileMenu}
                  className={({ isActive }) => cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium',
                    'transition-colors duration-150 cursor-pointer',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
                    isActive
                      ? 'text-[var(--color-primary)] bg-[rgba(196,130,111,0.1)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-overlay)]'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  {t(labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Cart link */}
          {itemCount > 0 && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(196,130,111,0.15)' }}>
              <NavLink
                to="/shop/winkelwagen"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-150 cursor-pointer hover:bg-[var(--color-surface-overlay)]"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                Winkelwagen
                <span
                  className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
                >
                  {itemCount}
                </span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Footer — Boek Nu CTA + language switcher */}
        <div
          className="flex-shrink-0 px-6 py-5 border-t space-y-3"
          style={{ borderColor: 'rgba(196,130,111,0.15)' }}
        >
          <Button
            as={Link}
            to="/boeken"
            variant="primary"
            fullWidth
            leftIcon={<Car className="w-4 h-4" />}
            onClick={closeMobileMenu}
          >
            {t('common.bookNow')}
          </Button>
          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    </>
  )
}
