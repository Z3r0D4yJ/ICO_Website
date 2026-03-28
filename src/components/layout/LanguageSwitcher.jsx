import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

/**
 * LanguageSwitcher — NL / EN toggle
 * Taal wordt opgeslagen in localStorage ('ico-lang').
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
      className={cn('flex items-center gap-0.5 rounded-md p-0.5', className)}
      style={{ backgroundColor: 'var(--color-surface-overlay)' }}
      role="group"
      aria-label="Taal kiezen"
    >
      {['nl', 'en'].map((lang) => {
        const isActive = currentLang === lang
        return (
          <button
            key={lang}
            onClick={() => toggle(lang)}
            aria-pressed={isActive}
            aria-label={lang === 'nl' ? 'Nederlands' : 'English'}
            className={cn(
              'px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider',
              'transition-all duration-150 cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
              isActive
                ? 'text-[var(--color-text-inverse)]'
                : 'hover:text-[var(--color-text-primary)]'
            )}
            style={
              isActive
                ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }
                : { color: 'var(--color-text-muted)' }
            }
          >
            {lang.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
