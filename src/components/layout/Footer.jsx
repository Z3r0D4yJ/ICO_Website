import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Instagram, Facebook, Car, MessageCircle } from '@/lib/icons'
import { useTranslation } from 'react-i18next'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { whatsappLink } from '@/lib/utils'

const DIENSTEN_LINKS = [
  { to: '/diensten/detailwash', label: 'DetailWash' },
  { to: '/diensten/dieptereiniging', label: 'Dieptereiniging' },
  { to: '/diensten/combo-pakket', label: 'Combo Pakket' },
  { to: '/shop', label: 'CleanTech Shop' },
]

const NUTTIGE_LINKS = [
  { to: '/boeken', label: 'Afspraak Maken' },
  { to: '/over-ons', label: 'Over Team ICO' },
  { to: '/projecten', label: 'Onze Projecten' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy', label: 'Privacybeleid' },
  { to: '/voorwaarden', label: 'Algemene Voorwaarden' },
]

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer style={{ backgroundColor: 'var(--color-surface-elevated)', borderTop: '1px solid rgba(196,130,111,0.2)' }}>

      {/* WhatsApp CTA balk */}
      <div
        className="py-4 text-center"
        style={{ background: 'linear-gradient(90deg, rgba(196,130,111,0.08) 0%, rgba(196,130,111,0.15) 50%, rgba(196,130,111,0.08) 100%)', borderBottom: '1px solid rgba(196,130,111,0.2)' }}
      >
        <div className="container-ico flex flex-col sm:flex-row items-center justify-center gap-3">
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Liever direct chatten? Wij zijn bereikbaar via WhatsApp.
          </p>
          <a
            href={whatsappLink(WHATSAPP_NUMBER, 'Hallo, ik heb een vraag over ICO car detailing.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold cursor-pointer transition-all duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            WhatsApp Ons
          </a>
        </div>
      </div>

      {/* Hoofd footer content */}
      <div className="container-ico py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Kolom 1 — Brand */}
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="inline-block mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40 rounded-lg"
              aria-label="ICO homepage"
            >
              <img
                src="/images/logo.png"
                alt="ICO — Intensive Cleaning Organization"
                className="h-14 w-auto object-contain rounded-md"
              />
            </Link>
            <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
              {t('footer.tagline')}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {t('footer.workArea')}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ICO op Instagram"
                className="p-2 rounded-md transition-colors duration-150 hover:bg-[var(--color-surface-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40 cursor-pointer"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ICO op Facebook"
                className="p-2 rounded-md transition-colors duration-150 hover:bg-[var(--color-surface-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40 cursor-pointer"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <Facebook className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Kolom 2 — Diensten */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {t('footer.servicesTitle')}
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {DIENSTEN_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm transition-colors duration-150 hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:text-[var(--color-primary)]"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3 — Nuttige links */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {t('footer.usefulTitle')}
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {NUTTIGE_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm transition-colors duration-150 hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:text-[var(--color-primary)]"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4 — Contact */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {t('footer.contactTitle')}
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              <li>
                <a
                  href="tel:+32000000000"
                  className="flex items-start gap-3 text-sm transition-colors duration-150 hover:text-[var(--color-primary)] cursor-pointer focus-visible:outline-none focus-visible:text-[var(--color-primary)]"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" style={{ color: 'var(--color-primary)' }} />
                  +32 (0)000 000 000
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@ico-detailing.be"
                  className="flex items-start gap-3 text-sm transition-colors duration-150 hover:text-[var(--color-primary)] cursor-pointer focus-visible:outline-none focus-visible:text-[var(--color-primary)]"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" style={{ color: 'var(--color-primary)' }} />
                  info@ico-detailing.be
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" style={{ color: 'var(--color-primary)' }} />
                  <span>Regio Vlaanderen<br /><span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Mobiel — wij komen naar u</span></span>
                </div>
              </li>
              <li>
                <a
                  href={whatsappLink(WHATSAPP_NUMBER)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm transition-colors duration-150 hover:text-[var(--color-primary)] cursor-pointer focus-visible:outline-none focus-visible:text-[var(--color-primary)]"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <Car className="w-4 h-4 flex-shrink-0" aria-hidden="true" style={{ color: 'var(--color-primary)' }} />
                  WhatsApp Ons
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t"
        style={{ borderColor: 'rgba(196,130,111,0.15)' }}
      >
        <div className="container-ico py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            © {year} ICO — Intensive Cleaning Organization. {t('footer.rights')}.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="text-xs transition-colors duration-150 hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:text-[var(--color-primary)]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {t('footer.privacy')}
            </Link>
            <Link
              to="/voorwaarden"
              className="text-xs transition-colors duration-150 hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:text-[var(--color-primary)]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
