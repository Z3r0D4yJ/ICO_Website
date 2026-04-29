import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Menu, ShoppingBag } from '@/lib/icons'
import { useTranslation } from 'react-i18next'
import { useUiStore } from '@/stores/uiStore'
import { useCartStore } from '@/stores/cartStore'
import LanguageSwitcher from './LanguageSwitcher'
import MobileMenu from './MobileMenu'

const NAV_LINKS = [
  { to: '/diensten', labelKey: 'nav.services' },
  { to: '/shop', labelKey: 'nav.shop' },
  { to: '/projecten', labelKey: 'nav.projects' },
  { to: '/over-ons', labelKey: 'nav.about' },
  { to: '/faq', labelKey: 'nav.faq' },
  { to: '/contact', labelKey: 'nav.contact' },
]

export default function Header() {
  const { t } = useTranslation()
  const { openMobileMenu, openCart } = useUiStore()
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0))
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const showSolid = scrolled || !isHome

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 transition-all duration-300"
        style={{
          zIndex: 'var(--z-sticky)',
          backgroundColor: showSolid ? 'rgba(14,12,11,0.88)' : 'transparent',
          backdropFilter: showSolid ? 'blur(14px)' : 'none',
          WebkitBackdropFilter: showSolid ? 'blur(14px)' : 'none',
          borderBottom: `1px solid ${showSolid ? 'var(--ink-300)' : 'transparent'}`,
        }}
      >
        <div className="container-ico flex h-16 items-center justify-between gap-6">
          <Link
            to="/"
            aria-label="ICO - Intensive Cleaning Organization"
            className="flex min-w-0 flex-shrink-0 items-center gap-3 rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(216,158,140,0.45)]"
          >
            <img
              src="/images/logo.png"
              alt=""
              className="h-9 w-auto flex-shrink-0 object-contain"
              style={{ filter: 'drop-shadow(0 8px 18px rgba(184,111,92,0.22))' }}
            />
            <span className="hidden truncate font-display text-base italic text-[var(--bone-000)] xl:inline">
              Intense Cleaning Organization
            </span>
          </Link>

          <nav aria-label="Hoofdnavigatie" className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map(({ to, labelKey }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `edit-nav-link${isActive ? ' is-active' : ''}`}
              >
                {t(labelKey)}
              </NavLink>
            ))}
          </nav>

          <div className="flex flex-shrink-0 items-center gap-3">
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Winkelwagen${itemCount > 0 ? `, ${itemCount} item${itemCount > 1 ? 's' : ''}` : ' leeg'}`}
              className="relative rounded-[var(--radius-lg)] border border-transparent p-2 text-[var(--bone-200)] transition-all hover:border-[var(--color-border)] hover:bg-[rgba(250,246,241,0.04)] hover:text-[var(--copper-200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(216,158,140,0.45)]"
            >
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {itemCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--copper-400)] px-1 font-mono text-[10px] text-[var(--ink-000)]"
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            <Link to="/boeken" className="edit-btn edit-btn-primary edit-btn-sm hidden lg:inline-flex">
              {t('common.bookNow')}
              <span className="edit-arrow" aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={openMobileMenu}
              aria-label="Menu openen"
              aria-controls="mobile-menu"
              className="rounded-[var(--radius-lg)] border border-transparent p-2 text-[var(--bone-200)] transition-all hover:border-[var(--color-border)] hover:bg-[rgba(250,246,241,0.04)] hover:text-[var(--copper-200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(216,158,140,0.45)] lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu />
      {!isHome && <div className="h-16" aria-hidden="true" />}
    </>
  )
}
