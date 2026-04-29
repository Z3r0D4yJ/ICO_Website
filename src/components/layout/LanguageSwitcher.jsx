import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

/**
 * LanguageSwitcher — minimal mono NL/EN toggle.
 * Saved in localStorage ('ico-lang').
 */
export default function LanguageSwitcher({ className }) {
  const { i18n } = useTranslation()
  const currentLang = i18n.language?.slice(0, 2) || 'nl'

  const toggle = (lang) => {
    if (lang !== currentLang) {
      i18n.changeLanguage(lang)
    }
  }

  return (
    <div
      className={cn('inline-flex items-center', className)}
      role="group"
      aria-label="Taal kiezen"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--bone-300)',
      }}
    >
      {['nl', 'en'].map((lang, idx) => {
        const isActive = currentLang === lang
        return (
          <span key={lang} className="flex items-center">
            {idx > 0 && (
              <span aria-hidden="true" style={{ color: 'var(--ink-500)', margin: '0 8px' }}>
                /
              </span>
            )}
            <button
              type="button"
              onClick={() => toggle(lang)}
              aria-pressed={isActive}
              aria-label={lang === 'nl' ? 'Nederlands' : 'English'}
              className="cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(184,111,92,0.45)]/40"
              style={{
                background: 'transparent',
                border: 'none',
                padding: '4px 0',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                letterSpacing: 'inherit',
                textTransform: 'inherit',
                color: isActive ? 'var(--copper-200)' : 'var(--bone-300)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--bone-100)'
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--bone-300)'
              }}
            >
              {lang.toUpperCase()}
            </button>
          </span>
        )
      })}
    </div>
  )
}
