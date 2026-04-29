import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Instagram, Facebook, MessageCircle } from '@/lib/icons'
import { useTranslation } from 'react-i18next'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { whatsappLink } from '@/lib/utils'

const DIENSTEN_LINKS = [
  { to: '/diensten?categorie=wash',    label: 'Wasbeurten' },
  { to: '/diensten?categorie=coating', label: 'Keramische coating' },
  { to: '/diensten?categorie=ppf',     label: 'Paint Protection Film' },
  { to: '/diensten?categorie=extra',   label: "Extra's & add-ons" },
  { to: '/shop',                        label: 'CleanTech shop' },
]

const NUTTIGE_LINKS = [
  { to: '/boeken',     label: 'Afspraak maken' },
  { to: '/over-ons',   label: 'Over Team ICO' },
  { to: '/projecten',  label: 'Onze projecten' },
  { to: '/faq',        label: 'Veelgestelde vragen' },
  { to: '/contact',    label: 'Contact' },
]

const LEGAL_LINKS = [
  { to: '/privacy',     labelKey: 'footer.privacy' },
  { to: '/voorwaarden', labelKey: 'footer.terms' },
]

function FooterColumn({ num, title, children }) {
  return (
    <div>
      <div className="flex items-baseline gap-3 mb-6 pb-3" style={{ borderBottom: '1px solid var(--ink-400)' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.2em',
            color: 'var(--copper-400)',
          }}
        >
          {num}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--bone-200)',
          }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

function FooterLink({ to, children, external }) {
  const Tag = external ? 'a' : Link
  const props = external
    ? { href: to, target: '_blank', rel: 'noopener noreferrer' }
    : { to }
  return (
    <Tag
      {...props}
      className="block transition-colors duration-150 focus-visible:outline-none focus-visible:text-[var(--copper-200)]"
      style={{
        fontFamily: 'var(--font-geist)',
        fontSize: 15,
        lineHeight: 1.4,
        color: 'var(--bone-100)',
        padding: '6px 0',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--copper-200)' }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--bone-100)' }}
    >
      {children}
    </Tag>
  )
}

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        backgroundColor: 'var(--ink-100)',
        borderTop: '1px solid var(--ink-300)',
      }}
    >
      {/* WhatsApp banner */}
      <div
        style={{
          background:
            'radial-gradient(ellipse 50% 100% at 80% 50%, rgba(184,111,92,0.18) 0%, transparent 60%), var(--ink-050)',
          borderBottom: '1px solid var(--ink-300)',
        }}
      >
        <div className="container-ico py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                color: 'var(--copper-400)',
              }}
            >
              — Direct contact
            </span>
            <span
              style={{
                fontFamily: 'var(--font-fraunces)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 'clamp(20px, 2.2vw, 26px)',
                color: 'var(--bone-000)',
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
              }}
            >
              Liever direct chatten?
            </span>
          </div>
          <a
            href={whatsappLink(WHATSAPP_NUMBER, 'Hallo, ik heb een vraag over ICO car detailing.')}
            target="_blank"
            rel="noopener noreferrer"
            className="edit-btn edit-btn-primary edit-btn-sm"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            WhatsApp ons
            <span className="edit-arrow" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container-ico" style={{ paddingTop: 96, paddingBottom: 64 }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          {/* Brand — 4 cols */}
          <div className="md:col-span-4 lg:col-span-4">
            <Link
              to="/"
              className="inline-flex items-center gap-3 mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(184,111,92,0.45)]/40 rounded"
              aria-label="ICO homepage"
            >
              <img
                src="/images/logo.png"
                alt=""
                className="h-12 w-auto object-contain"
                style={{ filter: 'drop-shadow(0 4px 12px rgba(184,111,92,0.25))' }}
              />
            </Link>

            <p
              style={{
                fontFamily: 'var(--font-fraunces)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 22,
                lineHeight: 1.3,
                letterSpacing: '-0.01em',
                color: 'var(--bone-000)',
                margin: '0 0 16px',
                maxWidth: '24ch',
                textWrap: 'balance',
              }}
            >
              Premium services voor premium klanten.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-geist)',
                fontSize: 14,
                lineHeight: 1.55,
                color: 'var(--bone-200)',
                margin: 0,
                maxWidth: '36ch',
              }}
            >
              Mobiele cardetailing in heel Vlaanderen — coating en PPF in onze garage in Hamme.
              Door Rico &amp; Nico, met de hand.
            </p>

            {/* Social */}
            <div className="mt-8 flex items-center gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ICO op Instagram"
                className="p-2 rounded transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(184,111,92,0.45)]/40"
                style={{ color: 'var(--bone-200)', border: '1px solid var(--ink-400)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--copper-200)'
                  e.currentTarget.style.borderColor = 'var(--copper-400)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--bone-200)'
                  e.currentTarget.style.borderColor = 'var(--ink-400)'
                }}
              >
                <Instagram className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ICO op Facebook"
                className="p-2 rounded transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(184,111,92,0.45)]/40"
                style={{ color: 'var(--bone-200)', border: '1px solid var(--ink-400)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--copper-200)'
                  e.currentTarget.style.borderColor = 'var(--copper-400)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--bone-200)'
                  e.currentTarget.style.borderColor = 'var(--ink-400)'
                }}
              >
                <Facebook className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Diensten — 3 cols */}
          <div className="md:col-span-4 lg:col-span-3">
            <FooterColumn num="01" title="Diensten">
              <ul className="flex flex-col" role="list">
                {DIENSTEN_LINKS.map(({ to, label }) => (
                  <li key={to}>
                    <FooterLink to={to}>{label}</FooterLink>
                  </li>
                ))}
              </ul>
            </FooterColumn>
          </div>

          {/* Nuttig — 3 cols */}
          <div className="md:col-span-4 lg:col-span-2">
            <FooterColumn num="02" title="Nuttig">
              <ul className="flex flex-col" role="list">
                {NUTTIGE_LINKS.map(({ to, label }) => (
                  <li key={to}>
                    <FooterLink to={to}>{label}</FooterLink>
                  </li>
                ))}
              </ul>
            </FooterColumn>
          </div>

          {/* Contact — 3 cols */}
          <div className="md:col-span-12 lg:col-span-3">
            <FooterColumn num="03" title="Contact">
              <ul className="flex flex-col gap-4" role="list">
                <li>
                  <a
                    href="tel:+32000000000"
                    className="flex items-start gap-3 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:text-[var(--copper-200)]"
                    style={{
                      fontFamily: 'var(--font-geist)',
                      fontSize: 15,
                      color: 'var(--bone-100)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--copper-200)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--bone-100)' }}
                  >
                    <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" style={{ color: 'var(--copper-400)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, letterSpacing: '0.02em' }}>
                      +32 (0)000 000 000
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@ico-detailing.be"
                    className="flex items-start gap-3 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:text-[var(--copper-200)]"
                    style={{
                      fontFamily: 'var(--font-geist)',
                      fontSize: 15,
                      color: 'var(--bone-100)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--copper-200)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--bone-100)' }}
                  >
                    <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" style={{ color: 'var(--copper-400)' }} />
                    info@ico-detailing.be
                  </a>
                </li>
                <li
                  className="flex items-start gap-3"
                  style={{
                    fontFamily: 'var(--font-geist)',
                    fontSize: 15,
                    color: 'var(--bone-100)',
                  }}
                >
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" style={{ color: 'var(--copper-400)' }} />
                  <div>
                    Regio Vlaanderen
                    <br />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--bone-300)' }}>
                      — Mobiel · garage in Hamme
                    </span>
                  </div>
                </li>
              </ul>
            </FooterColumn>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--ink-300)' }}>
        <div className="container-ico py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--bone-300)',
              margin: 0,
            }}
          >
            — © {year} · Intense Cleaning Organization
          </p>
          <div className="flex items-center gap-8">
            {LEGAL_LINKS.map(({ to, labelKey }) => (
              <Link
                key={to}
                to={to}
                className="transition-colors duration-150 focus-visible:outline-none focus-visible:text-[var(--copper-200)]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'var(--bone-300)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--copper-200)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--bone-300)' }}
              >
                {t(labelKey)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
