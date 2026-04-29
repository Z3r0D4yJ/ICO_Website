import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Menu, ShoppingBag } from '@/lib/icons'
import { useTranslation } from 'react-i18next'
import { useUiStore } from '@/stores/uiStore'
import { useCartStore } from '@/stores/cartStore'
import LanguageSwitcher from './LanguageSwitcher'
import MobileMenu from './MobileMenu'

const NAV_LINKS = [
  { to: '/diensten',  labelKey: 'nav.services' },
  { to: '/shop',      labelKey: 'nav.shop' },
  { to: '/projecten', labelKey: 'nav.projects' },
  { to: '/over-ons',  labelKey: 'nav.about' },
  { to: '/faq',       labelKey: 'nav.faq' },
  { to: '/contact',   labelKey: 'nav.contact' },
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

  // On home, header sits over the hero (transparent until scroll). Elsewhere, always solid.
  const showSolid = scrolled || !isHome

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 transition-colors duration-300"
        style={{
          zIndex: 'var(--z-sticky)',
          backgroundColor: showSolid ? 'rgba(14,12,11,0.88)' : 'transparent',
          backdropFilter: showSolid ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: showSolid ? 'blur(12px)' : 'none',
          borderBottom: `1px solid ${showSolid ? 'var(--ink-400)' : 'transparent'}`,
        }}
      >
        <div className="container-ico h-16 flex items-center justify-between gap-6">
          {/* Logo + italic wordmark */}
          <Link
            to="/"
            aria-label="ICO — Intensive Cleaning Organization"
            className="flex items-center gap-3 flex-shrink-0 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(184,111,92,0.45)]/40 rounded"
          >
            <img
              src="/images/logo.png"
              alt=""
              className="h-9 w-auto object-contain flex-shrink-0"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(184,111,92,0.25))' }}
            />
            <span
              className="hidden xl:inline truncate"
              style={{
                fontFamily: 'var(--font-fraunces)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 16,
                letterSpacing: '-0.01em',
                color: 'var(--bone-000)',
              }}
            >
              Intense Cleaning Organization
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Hoofdnavigatie" className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(({ to, labelKey }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `edit-nav-link${isActive ? ' is-active' : ''}`
                }
              >
                {t(labelKey)}
              </NavLink>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>

            <button
              onClick={openCart}
              aria-label={`Winkelwagen${itemCount > 0 ? `, ${itemCount} item${itemCount > 1 ? 's' : ''}` : ' (leeg)'}`}
              className="relative p-2 rounded transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(184,111,92,0.45)]/40"
              style={{ color: 'var(--bone-200)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--copper-200)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--bone-200)' }}
            >
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              {itemCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    backgroundColor: 'var(--copper-400)',
                    color: 'var(--ink-000)',
                  }}
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            <Link
              to="/boeken"
              className="hidden lg:inline-flex edit-btn edit-btn-primary edit-btn-sm"
            >
              {t('common.bookNow')}
              <span className="edit-arrow" aria-hidden="true" />
            </Link>

            <button
              onClick={openMobileMenu}
              aria-label="Menu openen"
              aria-controls="mobile-menu"
              className="lg:hidden p-2 rounded transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(184,111,92,0.45)]/40"
              style={{ color: 'var(--bone-200)' }}
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu />

      {/* Spacer — only on non-home pages, since home hero is full-bleed under the transparent header */}
      {!isHome && <div className="h-16" aria-hidden="true" />}
    </>
  )
}
