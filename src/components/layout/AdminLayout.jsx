import { useState } from 'react'
import { Menu } from '@/lib/icons'
import AdminSidebar from '@/components/admin/AdminSidebar'

/**
 * AdminLayout — wrapper voor alle admin pagina's.
 * Sidebar links (desktop) of slide-in (mobiel).
 */
export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div
      className="flex w-full min-h-screen"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Hoofd content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobiele topbalk */}
        <header
          className="lg:hidden flex items-center gap-3 px-4 py-3 border-b"
          style={{
            backgroundColor: 'var(--color-surface-elevated)',
            borderColor: 'rgba(196,130,111,0.15)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="cursor-pointer p-2.5 -ml-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              color: 'var(--color-primary)',
              letterSpacing: '0.05em',
            }}
          >
            ICO ADMIN
          </span>
        </header>

        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
