import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Car, CheckCircle2, Clock, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from '@/lib/icons'
import { useRateLimit } from '@/hooks/useRateLimit'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { whatsappLink } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input, { Textarea } from '@/components/ui/Input'
import PageHero from '@/components/ui/PageHero'
import CTASection from '@/components/home/CTASection'

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
    label: 'WhatsApp',
    value: 'Snelste antwoord',
    href: whatsappLink(WHATSAPP_NUMBER, 'Hallo Rico en Nico, ik heb een vraag via de website.'),
    external: true,
  },
  {
    icon: Mail,
    label: 'E-mail',
    value: 'info@ico-detailing.be',
    href: 'mailto:info@ico-detailing.be',
  },
  {
    icon: MapPin,
    label: 'Werkgebied',
    value: 'Mobiel in Vlaanderen, garage in Hamme',
  },
  {
    icon: Clock,
    label: 'Bereikbaar',
    value: 'Ma tot za, 08:00 tot 19:00',
  },
]

const SOCIAL_LINKS = [
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/ico_detailing' },
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/icodetailing' },
  { icon: MessageCircle, label: 'WhatsApp', href: whatsappLink(WHATSAPP_NUMBER, 'Hallo Rico en Nico, ik kom via de website.') },
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
  } = useForm({ resolver: zodResolver(contactSchema) })

  const onSubmit = async () => {
    if (!checkLimit()) return
    setSubmitting(true)
    recordAttempt()
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setSubmitted(true)
    setSubmitting(false)
    reset()
  }

  return (
    <>
      <PageHero
        label="Contact"
        title="Praat met"
        titleAccent="Rico & Nico"
        subtitle="Een vraag over een behandeling, offerte of CleanTech product? WhatsApp is het snelst, het formulier is er voor iets uitgebreidere aanvragen."
        image="/images/rico&nico.webp"
        align="left"
      />

      <section className="section-padding bg-[var(--color-surface)]">
        <div className="container-ico">
          <div className="grid gap-8 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.15fr)]">
            <aside className="space-y-5">
              <div className="ico-panel p-6">
                <p className="edit-eyebrow">Direct contact</p>
                <h2 className="mt-3 font-display text-3xl text-[var(--bone-000)]">WhatsApp eerst, formulier als het meer uitleg vraagt.</h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--bone-300)]">
                  Stuur gerust een foto van je wagen mee. Dan kunnen Rico & Nico sneller inschatten welke behandeling of productkeuze klopt.
                </p>
                <Button
                  as="a"
                  href={whatsappLink(WHATSAPP_NUMBER, 'Hallo Rico en Nico, ik heb een vraag over ICO.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  fullWidth
                  className="mt-6"
                  leftIcon={<MessageCircle className="h-4 w-4" />}
                >
                  Open WhatsApp
                </Button>
                <Button
                  as={Link}
                  to="/boeken"
                  variant="secondary"
                  fullWidth
                  className="mt-3"
                  leftIcon={<Car className="h-4 w-4" />}
                >
                  Boek direct
                </Button>
              </div>

              <div className="ico-panel p-6">
                <p className="edit-eyebrow">Gegevens</p>
                <ul className="mt-5 space-y-4">
                  {INFO_ITEMS.map(({ icon: Icon, label, value, href, external }) => (
                    <li key={label} className="flex gap-3">
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[rgba(250,246,241,0.035)] text-[var(--copper-300)]">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-xs text-[var(--bone-400)]">{label}</p>
                        {href ? (
                          <a
                            href={href}
                            target={external ? '_blank' : undefined}
                            rel={external ? 'noopener noreferrer' : undefined}
                            className="text-sm font-medium text-[var(--bone-000)] transition-colors hover:text-[var(--copper-200)]"
                          >
                            {value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-[var(--bone-000)]">{value}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex gap-2">
                  {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--bone-300)] transition-colors hover:border-[rgba(184,111,92,0.45)] hover:text-[var(--copper-200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(216,158,140,0.45)]"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            </aside>

            <section className="ico-panel p-5 sm:p-8">
              {submitted ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-[var(--radius-lg)] border border-[rgba(123,174,130,0.28)] bg-[rgba(123,174,130,0.08)] text-[var(--signal-go)]">
                    <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
                  </span>
                  <h2 className="font-display text-3xl text-[var(--bone-000)]">Bericht verzonden</h2>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--bone-300)]">
                    Bedankt. Rico of Nico neemt zo snel mogelijk contact met je op.
                  </p>
                  <Button variant="secondary" className="mt-7" onClick={() => setSubmitted(false)}>
                    Nieuw bericht
                  </Button>
                </div>
              ) : (
                <>
                  <p className="edit-eyebrow">Aanvraag</p>
                  <h2 className="mt-3 font-display text-3xl text-[var(--bone-000)]">Stuur ons de details</h2>
                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input label="Naam" required placeholder="Jan Janssen" error={errors.name?.message} {...register('name')} />
                      <Input label="E-mail" required type="email" placeholder="jan@voorbeeld.be" error={errors.email?.message} {...register('email')} />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input label="Telefoonnummer" type="tel" placeholder="+32 499 00 00 00" hint="Optioneel" error={errors.phone?.message} {...register('phone')} />
                      <Input label="Onderwerp" required placeholder="Offerte, boeking of productvraag" error={errors.subject?.message} {...register('subject')} />
                    </div>
                    <Textarea
                      label="Bericht"
                      required
                      rows={7}
                      placeholder="Vertel kort over je wagen, locatie en wat je graag wil laten doen."
                      error={errors.message?.message}
                      {...register('message')}
                    />

                    {blocked && (
                      <p className="rounded-[var(--radius-md)] border border-[rgba(199,89,79,0.28)] bg-[rgba(199,89,79,0.08)] px-4 py-3 text-sm text-[var(--signal-stop)]">
                        Te veel pogingen. Wacht nog {Math.ceil(cooldown / 1000)} seconden.
                      </p>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      loading={submitting}
                      disabled={submitting || blocked}
                      leftIcon={<MessageCircle className="h-4 w-4" />}
                    >
                      Bericht verzenden
                    </Button>
                  </form>
                </>
              )}
            </section>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
