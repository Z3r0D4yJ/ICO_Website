import { Link, useLocation } from 'react-router-dom'
import { Car, MessageCircle } from '@/lib/icons'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { whatsappLink } from '@/lib/utils'

// Mobile-only floating action bar.
// Twee CTA's altijd binnen duimbereik: Boek Nu + WhatsApp.
// Verbergt zichzelf op /boeken (anders dubbel) en op alle /admin routes.
export default function MobileActionBar() {
  const { pathname } = useLocation()

  if (pathname.startsWith('/admin')) return null
  if (pathname.startsWith('/boeken')) return null

  const waHref = whatsappLink(WHATSAPP_NUMBER, 'Hallo Team ICO, ik heb een vraag.')

  return (
    <div
      className="lg:hidden fixed left-0 right-0 z-[150]"
      style={{
        bottom: 'max(0.75rem, env(safe-area-inset-bottom))',
        paddingLeft: '1rem',
        paddingRight: '1rem',
      }}
      aria-label="Snelle acties"
    >
      <div
        className="mx-auto flex items-center gap-2 p-2 rounded-full shadow-lg backdrop-blur-md"
        style={{
          maxWidth: '24rem',
          backgroundColor: 'rgba(17, 16, 16, 0.92)',
          border: '1px solid rgba(196, 130, 111, 0.35)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}
      >
        <Link
          to="/boeken"
          className="flex-1 flex items-center justify-center gap-2 h-11 rounded-full text-sm font-semibold transition-colors"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-inverse)',
          }}
        >
          <Car className="w-4 h-4" aria-hidden="true" />
          Boek Nu
        </Link>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Stuur ons een WhatsApp bericht"
          className="flex items-center justify-center w-11 h-11 rounded-full transition-colors"
          style={{
            backgroundColor: '#25D366',
            color: '#fff',
          }}
        >
          <MessageCircle className="w-5 h-5" aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
