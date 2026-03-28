import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input, { Textarea } from '@/components/ui/Input'

// Alleen de contactgegevens (stap 3 van het boekingsformulier)
const contactStep = z.object({
  customer_name: z.string().min(2, 'Naam moet minstens 2 tekens zijn').max(100),
  customer_email: z.string().email('Ongeldig e-mailadres'),
  customer_phone: z
    .string()
    .min(9, 'Telefoonnummer te kort')
    .regex(
      /^(\+32|0032|0)[1-9][0-9]{7,8}$/,
      'Ongeldig Belgisch telefoonnummer (bv. 0495 123 456)'
    ),
  customer_address: z.string().min(5, 'Vul uw straat en huisnummer in').max(200),
  customer_city: z.string().min(2, 'Vul uw gemeente in').max(100),
  customer_postal_code: z
    .string()
    .regex(/^\d{4}$/, 'Postcode moet 4 cijfers zijn'),
  notes: z.string().max(500, 'Maximum 500 tekens').optional(),
})

/**
 * BookingForm — contactgegevens formulier (stap 3).
 *
 * @param {object} defaultValues - Vooraf ingevulde waarden
 * @param {function} onSubmit - Callback met gevalideerde data
 * @param {object} submitRef - Ref voor de verborgen submit-knop (activeer vanuit parent)
 */
export default function BookingForm({ defaultValues, onSubmit, submitRef }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactStep),
    defaultValues: defaultValues || {},
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Naam */}
      <Input
        label="Naam *"
        placeholder="Jan Janssen"
        error={errors.customer_name?.message}
        {...register('customer_name')}
      />

      {/* E-mail + Telefoon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="E-mailadres *"
          type="email"
          placeholder="jan@voorbeeld.be"
          error={errors.customer_email?.message}
          {...register('customer_email')}
        />
        <Input
          label="Telefoonnummer *"
          type="tel"
          placeholder="0495 123 456"
          error={errors.customer_phone?.message}
          {...register('customer_phone')}
        />
      </div>

      {/* Adres */}
      <Input
        label="Straat en huisnummer *"
        placeholder="Hoofdstraat 1"
        error={errors.customer_address?.message}
        {...register('customer_address')}
      />

      {/* Gemeente + Postcode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Gemeente *"
          placeholder="Gent"
          error={errors.customer_city?.message}
          {...register('customer_city')}
        />
        <Input
          label="Postcode *"
          placeholder="9000"
          maxLength={4}
          error={errors.customer_postal_code?.message}
          {...register('customer_postal_code')}
        />
      </div>

      {/* Opmerkingen */}
      <Textarea
        label="Opmerkingen (optioneel)"
        placeholder="Extra informatie over uw voertuig of situatie..."
        rows={3}
        hint="Maximum 500 tekens"
        error={errors.notes?.message}
        {...register('notes')}
      />

      <button ref={submitRef} type="submit" className="hidden" aria-hidden="true" />
    </form>
  )
}
