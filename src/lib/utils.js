// ===========================================
// ICO — Hulpfuncties
// ===========================================

/**
 * Formatteer een prijs naar Belgisch formaat (€ XX,XX)
 * @param {number} amount - Bedrag in EUR
 * @param {string} [locale='nl-BE'] - Locale voor opmaak
 * @returns {string} Geformatteerde prijs
 */
export function formatPrice(amount, locale = 'nl-BE') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Converteer tekst naar URL-veilige slug
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Verwijder diacrieten
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Genereer een booking referentienummer
 * @param {number} sequence - Volgnummer
 * @returns {string} ICO-YYYY-NNN formaat
 */
export function generateBookingNumber(sequence) {
  const year = new Date().getFullYear()
  const paddedSeq = String(sequence).padStart(3, '0')
  return `ICO-${year}-${paddedSeq}`
}

/**
 * Formatteer een datum naar leesbaar formaat
 * @param {string|Date} date
 * @param {string} [locale='nl-BE']
 * @returns {string}
 */
export function formatDate(date, locale = 'nl-BE') {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

/**
 * Formatteer datum kort (DD/MM/YYYY)
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateShort(date) {
  return new Intl.DateTimeFormat('nl-BE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

/**
 * Formatteer datum en tijd
 * @param {string|Date} datetime
 * @param {string} [locale='nl-BE']
 * @returns {string}
 */
export function formatDateTime(datetime, locale = 'nl-BE') {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(datetime))
}

/**
 * Relatieve tijdweergave ("2 uur geleden", "gisteren")
 * @param {string|Date} date
 * @param {string} [locale='nl-BE']
 * @returns {string}
 */
export function formatRelativeTime(date, locale = 'nl-BE') {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const now = new Date()
  const target = new Date(date)
  const diffMs = target - now
  const diffSecs = Math.round(diffMs / 1000)
  const diffMins = Math.round(diffSecs / 60)
  const diffHours = Math.round(diffMins / 60)
  const diffDays = Math.round(diffHours / 24)

  if (Math.abs(diffDays) >= 1) return rtf.format(diffDays, 'day')
  if (Math.abs(diffHours) >= 1) return rtf.format(diffHours, 'hour')
  if (Math.abs(diffMins) >= 1) return rtf.format(diffMins, 'minute')
  return rtf.format(diffSecs, 'second')
}

/**
 * Controleer of een datum in de toekomst is (min. X uur vooruit)
 * @param {Date} date
 * @param {number} [minHours=24]
 * @returns {boolean}
 */
export function isDateAvailable(date, minHours = 24) {
  const minDate = new Date()
  minDate.setHours(minDate.getHours() + minHours)
  return date >= minDate
}

/**
 * Trunceer tekst met ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

/**
 * Genereer een WhatsApp click-to-chat URL
 * @param {string} phoneNumber - Belgisch formaat (32xxx)
 * @param {string} [message] - Optioneel vooraf ingevulde bericht
 * @returns {string}
 */
export function whatsappLink(phoneNumber, message = '') {
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phoneNumber}${message ? `?text=${encodedMessage}` : ''}`
}

/**
 * Classnames samenvoegen — ondersteunt strings én arrays
 * @param {...(string|string[]|boolean|undefined)} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes.flat(Infinity).filter(Boolean).join(' ')
}
