import { Link, useLocation } from 'react-router-dom'
import { Car, MessageCircle } from '@/lib/icons'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { whatsappLink } from '@/lib/utils'

export default function MobileActionBar() {
  const { pathname } = useLocation()

  if (pathname.startsWith('/admin')) return null
  if (pathname.startsWith('/boeken')) return null

  const waHref = whatsappLink(WHATSAPP_NUMBER, 'Hallo Team ICO, ik heb een vraag.')

  return (
    <div
      className="fixed left-0 right-0 lg:hidden"
      style={{
        bottom: 'max(0.75rem, env(safe-area-inset-bottom))',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        zIndex: 'var(--z-sticky)',
      }}
      aria-label="Snelle acties"
    >
      <div
        className="mx-auto flex max-w-sm items-center gap-2 rounded-[var(--radius-xl)] border border-[rgba(184,111,92,0.38)] bg-[rgba(14,12,11,0.92)] p-2 shadow-[var(--shadow-lg)] backdrop-blur-md"
      >
        <Link
          to="/boeken"
          className="btn-shell btn-primary min-h-11 flex-1 px-3 text-sm"
        >
          <Car className="h-4 w-4" aria-hidden="true" />
          Boek afspraak
        </Link>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Stuur ons een WhatsApp bericht"
          className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)] border border-[rgba(123,174,130,0.42)] bg-[rgba(123,174,130,0.13)] text-[var(--signal-go)] transition-all hover:bg-[rgba(123,174,130,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(123,174,130,0.45)]"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
