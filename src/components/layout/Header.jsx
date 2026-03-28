import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, ShoppingBag, Car } from '@/lib/icons'
import { useTranslation } from 'react-i18next'
import { useUiStore } from '@/stores/uiStore'
import { useCartStore } from '@/stores/cartStore'
import LanguageSwitcher from './LanguageSwitcher'
import MobileMenu from './MobileMenu'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { to: '/diensten', labelKey: 'nav.services' },
  { to: '/shop',     labelKey: 'nav.shop' },
  { to: '/projecten', labelKey: 'nav.projects' },
  { to: '/over-ons', labelKey: 'nav.about' },
  { to: '/faq',      labelKey: 'nav.faq' },
  { to: '/contact',  labelKey: 'nav.contact' },
]

export default function Header() {
  const { t } = useTranslation()
  const { openMobileMenu } = useUiStore()
  const { openCart } = useUiStore()
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0))

  // Scrolled state voor backdrop blur
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-[200]',
          'transition-all duration-300',
          scrolled
            ? 'backdrop-blur-md border-b'
            : 'border-b border-transparent'
        )}
        style={{
          backgroundColor: scrolled ? 'rgba(17, 16, 16, 0.92)' : 'transparent',
          borderColor: scrolled ? 'rgba(196,130,111,0.3)' : 'transparent',
        }}
      >
        <div className="container-ico h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link
            to="/"
            aria-label="ICO — Intensive Cleaning Organization, ga naar homepage"
            className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40 rounded-lg"
          >
            <img
              src="/images/logo.png"
              alt="ICO — Intensive Cleaning Organization"
              className="h-10 w-auto object-contain rounded-md"
            />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Hoofdnavigatie" className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ to, labelKey }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => cn(
                  'px-3 py-2 rounded-md text-sm font-medium',
                  'transition-colors duration-150 cursor-pointer',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40',
                  isActive
                    ? 'text-[var(--color-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                )}
              >
                {t(labelKey)}
              </NavLink>
            ))}
          </nav>

          {/* Rechts: taal + cart + boek CTA + hamburger */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Taalwisselaar — desktop */}
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>

            {/* Winkelwagen icoon */}
            <button
              onClick={openCart}
              aria-label={`Winkelwagen${itemCount > 0 ? `, ${itemCount} item${itemCount > 1 ? 's' : ''}` : ' (leeg)'}`}
              className="relative p-2 rounded-md cursor-pointer transition-colors duration-150 hover:bg-[var(--color-surface-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              {itemCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold px-1"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Boek Nu CTA — desktop */}
            <div className="hidden lg:block">
              <Button
                as={Link}
                to="/boeken"
                variant="primary"
                size="sm"
                leftIcon={<Car className="w-3.5 h-3.5" />}
              >
                {t('common.bookNow')}
              </Button>
            </div>

            {/* Hamburger — mobile */}
            <button
              onClick={openMobileMenu}
              aria-label="Menu openen"
              aria-expanded={false}
              aria-controls="mobile-menu"
              className="lg:hidden p-2 rounded-md cursor-pointer transition-colors duration-150 hover:bg-[var(--color-surface-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu (buiten header zodat z-index correct is) */}
      <MobileMenu />

      {/* Spacer zodat content niet achter fixed header zit */}
      <div className="h-16" aria-hidden="true" />
    </>
  )
}
