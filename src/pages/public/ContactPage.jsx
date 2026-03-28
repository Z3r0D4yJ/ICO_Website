import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Car,
  CheckCircle2,
  Facebook,
  Instagram,
  Clock,
} from '@/lib/icons'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { whatsappLink } from '@/lib/utils'
import { useRateLimit } from '@/hooks/useRateLimit'
import PageHero from '@/components/ui/PageHero'
import Input, { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import CTASection from '@/components/home/CTASection'

// Validatieschema
const contactSchema = z.object({
  name: z.string().min(2, 'Naam is verplicht (min. 2 tekens)'),
  email: z.string().email('Voer een geldig e-mailadres in'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Onderwerp is verplicht'),
  message: z.string().min(10, 'Bericht is te kort (min. 10 tekens)'),
})

const INFO_ITEMS = [
  {
    icon: Phone,
    label: 'Telefoon / WhatsApp',
    value: '+32 000 00 00 00',
    href: whatsappLink(WHATSAPP_NUMBER, 'Hallo! Ik neem contact op via de website.'),
    external: true,
  },
  {
    icon: Mail,
    label: 'E-mail',
    value: 'info@ico-detailing.be',
    href: 'mailto:info@ico-detailing.be',
    external: false,
  },
  {
    icon: MapPin,
    label: 'Werkgebied',
    value: 'Heel Vlaanderen — mobiele service',
    href: null,
  },
  {
    icon: Clock,
    label: 'Bereikbaar',
    value: 'Ma–Za, 08:00–19:00',
    href: null,
  },
]

const SOCIAL_LINKS = [
  {
    icon: Instagram,
    label: 'Instagram',
    href: 'https://instagram.com/ico_detailing',
  },
  {
    icon: Facebook,
    label: 'Facebook',
    href: 'https://facebook.com/icodetailing',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    href: whatsappLink(WHATSAPP_NUMBER, 'Hallo! Ik neem contact op via de website.'),
  },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { cooldown, blocked, checkLimit, recordAttempt } = useRateLimit({ cooldownMs: 5000, maxAttempts: 3, windowMs: 60000 })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data) => {
    if (!checkLimit()) return
    setSubmitting(true)
    recordAttempt()
    // Simuleer verzenden — integreer later met Resend/Supabase Edge Function
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setSubmitted(true)
    setSubmitting(false)
    reset()
  }

  return (
    <>
      <PageHero
        label="Neem contact op"
        title="CONTACT"
        subtitle="Heeft u een vraag, speciale wens of wilt u een offerte aanvragen? Wij helpen u graag verder."
      />

      <section
        className="section-padding"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="container-ico">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Links — contactinfo */}
            <div className="lg:col-span-2 space-y-8">

              <div>
                <h2
                  className="mb-6"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.75rem',
                    color: 'var(--color-text-primary)',
                    letterSpacing: '0.02em',
                  }}
                >
                  Gegevens
                </h2>

                <ul className="space-y-5">
                  {INFO_ITEMS.map(({ icon: Icon, label, value, href, external }) => (
                    <li key={label} className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: 'rgba(196,130,111,0.1)',
                          border: '1px solid rgba(196,130,111,0.2)',
                        }}
                      >
                        <Icon
                          className="w-4 h-4"
                          style={{ color: 'var(--color-primary)' }}
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: 'var(--color-text-muted)' }}>
                          {label}
                        </p>
                        {href ? (
                          <a
                            href={href}
                            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            className="text-sm font-medium transition-colors duration-150 cursor-pointer"
                            style={{ color: 'var(--color-text-primary)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)' }}
                          >
                            {value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                            {value}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sociale media */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-muted)' }}>
                  Volg ons
                </p>
                <div className="flex gap-3">
                  {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer"
                      style={{
                        backgroundColor: 'var(--color-surface-overlay)',
                        border: '1px solid rgba(196,130,111,0.2)',
                        color: 'var(--color-text-secondary)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(196,130,111,0.12)'
                        e.currentTarget.style.borderColor = 'rgba(196,130,111,0.4)'
                        e.currentTarget.style.color = 'var(--color-primary)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-surface-overlay)'
                        e.currentTarget.style.borderColor = 'rgba(196,130,111,0.2)'
                        e.currentTarget.style.color = 'var(--color-text-secondary)'
                      }}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>

              {/* WhatsApp highlight */}
              <div
                className="rounded-xl p-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(196,130,111,0.1) 0%, rgba(196,130,111,0.04) 100%)',
                  border: '1px solid rgba(196,130,111,0.25)',
                }}
              >
                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  Snelste weg: WhatsApp
                </p>
                <p className="text-xs mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  Rico & Nico reageren doorgaans binnen het uur via WhatsApp tijdens werkdagen.
                </p>
                <Button
                  as="a"
                  href={whatsappLink(WHATSAPP_NUMBER, 'Hallo! Ik neem contact op via de website.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="sm"
                  fullWidth
                  leftIcon={<MessageCircle className="w-4 h-4" />}
                >
                  Open WhatsApp
                </Button>
              </div>

            </div>

            {/* Rechts — contactformulier */}
            <div className="lg:col-span-3">
              <div
                className="rounded-2xl p-6 md:p-8"
                style={{
                  backgroundColor: 'var(--color-surface-elevated)',
                  border: '1px solid rgba(196,130,111,0.2)',
                }}
              >
                {submitted ? (
                  // Bevestiging na verzenden
                  <div className="flex flex-col items-center text-center py-10">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                      style={{
                        backgroundColor: 'rgba(196,130,111,0.1)',
                        border: '1px solid rgba(196,130,111,0.3)',
                      }}
                    >
                      <CheckCircle2
                        className="w-7 h-7"
                        style={{ color: 'var(--color-success)' }}
                        aria-hidden="true"
                      />
                    </div>
                    <h3
                      className="mb-2"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.75rem',
                        color: 'var(--color-text-primary)',
                        letterSpacing: '0.02em',
                      }}
                    >
                      Bericht verzonden!
                    </h3>
                    <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                      Bedankt voor uw bericht. Wij nemen zo snel mogelijk contact met u op.
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSubmitted(false)}
                    >
                      Nieuw bericht
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2
                      className="mb-6"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.75rem',
                        color: 'var(--color-text-primary)',
                        letterSpacing: '0.02em',
                      }}
                    >
                      Stuur ons een bericht
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                          label="Naam"
                          required
                          placeholder="Jan Janssen"
                          error={errors.name?.message}
                          {...register('name')}
                        />
                        <Input
                          label="E-mail"
                          required
                          type="email"
                          placeholder="jan@voorbeeld.be"
                          error={errors.email?.message}
                          {...register('email')}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                          label="Telefoonnummer"
                          type="tel"
                          placeholder="+32 499 00 00 00"
                          hint="Optioneel"
                          error={errors.phone?.message}
                          {...register('phone')}
                        />
                        <Input
                          label="Onderwerp"
                          required
                          placeholder="bv. Offerte PPF, Vraag over boeking"
                          error={errors.subject?.message}
                          {...register('subject')}
                        />
                      </div>

                      <Textarea
                        label="Bericht"
                        required
                        rows={5}
                        placeholder="Schrijf hier uw vraag of opmerking..."
                        error={errors.message?.message}
                        {...register('message')}
                      />

                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        Door dit formulier in te dienen gaat u akkoord met ons{' '}
                        <Link
                          to="/privacy"
                          className="underline transition-colors duration-150"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          privacybeleid
                        </Link>
                        .
                      </p>

                      {blocked && (
                        <p className="text-xs font-medium" style={{ color: 'var(--color-error)' }}>
                          Te veel pogingen. Probeer het later opnieuw.
                        </p>
                      )}

                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        fullWidth
                        loading={submitting}
                        disabled={submitting || cooldown || blocked}
                        leftIcon={<Mail className="w-4 h-4" />}
                      >
                        {blocked ? 'Even geduld...' : cooldown ? 'Even wachten...' : submitting ? 'Verzenden...' : 'Bericht verzenden'}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
