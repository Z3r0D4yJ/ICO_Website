import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarDays,
  Wrench,
  ShoppingBag,
  ClipboardText,
  Image,
  Settings,
  LogOut,
  X,
} from '@/lib/icons'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/boekingen', label: 'Boekingen', icon: CalendarDays },
  { to: '/admin/offertes', label: 'Offertes', icon: ClipboardText },
  { to: '/admin/diensten', label: 'Diensten', icon: Wrench },
  { to: '/admin/producten', label: 'Producten', icon: ShoppingBag },
  { to: '/admin/projecten', label: 'Projecten', icon: Image },
  { to: '/admin/media', label: 'Media', icon: Image },
  { to: '/admin/instellingen', label: 'Instellingen', icon: Settings },
]

/**
 * AdminSidebar — navigatie voor het admin paneel.
 *
 * @param {boolean} isOpen - Of de sidebar open is op mobiel
 * @param {function} onClose - Sluit de sidebar op mobiel
 */
export default function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { signOut, user } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-5 border-b"
        style={{ borderColor: 'rgba(196,130,111,0.15)' }}
      >
        <div>
          <img
            src="/images/logo.png"
            alt="ICO"
            className="h-16 w-auto object-contain rounded mb-1"
          />
          <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
            {user?.email}
          </p>
        </div>
        {/* Sluitknop (alleen mobiel) */}
        <button
          onClick={onClose}
          className="lg:hidden cursor-pointer p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
          aria-label="Sluit menu"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigatie */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Admin navigatie">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40',
                isActive
                  ? 'cursor-default'
                  : 'cursor-pointer hover:bg-[var(--color-surface-overlay)]'
              )
            }
            style={({ isActive }) =>
              isActive
                ? {
                    backgroundColor: 'rgba(196,130,111,0.12)',
                    color: 'var(--color-primary)',
                  }
                : { color: 'var(--color-text-secondary)' }
            }
            aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
          >
            {({ isActive }) => (
              <>
                <Icon
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                  aria-hidden="true"
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Uitloggen */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(196,130,111,0.15)' }}>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer hover:bg-[var(--color-surface-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          Uitloggen
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-56 flex-shrink-0"
        style={{
          backgroundColor: 'var(--color-surface-elevated)',
          borderRight: '1px solid rgba(196,130,111,0.2)',
          minHeight: '100vh',
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobiel overlay + sidebar */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 lg:hidden"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 'var(--z-overlay)' }}
            onClick={onClose}
            aria-hidden="true"
          />
          <aside
            className="fixed top-0 left-0 bottom-0 w-64 max-w-[80vw] flex flex-col lg:hidden"
            style={{
              backgroundColor: 'var(--color-surface-elevated)',
              borderRight: '1px solid rgba(196,130,111,0.2)',
              zIndex: 'var(--z-modal)',
            }}
          >
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}
