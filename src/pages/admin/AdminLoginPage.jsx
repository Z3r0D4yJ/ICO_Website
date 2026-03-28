import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn, Eye, EyeOff } from '@/lib/icons'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema } from '@/lib/validators'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) })

  const onSubmit = async ({ email, password }) => {
    setServerError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setServerError('Ongeldig e-mailadres of wachtwoord.')
    } else {
      navigate('/admin')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      <div className="w-full max-w-sm">

        {/* Logo / titel */}
        <div className="text-center mb-8">
          <div
            className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4"
            style={{
              backgroundColor: 'rgba(196,130,111,0.12)',
              border: '1px solid rgba(196,130,111,0.3)',
            }}
          >
            <LogIn className="w-6 h-6" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              color: 'var(--color-text-primary)',
              letterSpacing: '0.05em',
            }}
          >
            ICO ADMIN
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Intensive Cleaning Organization
          </p>
        </div>

        {/* Formulier */}
        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor: 'var(--color-surface-elevated)',
            border: '1px solid rgba(196,130,111,0.2)',
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <Input
              label="E-mailadres"
              type="email"
              autoComplete="email"
              placeholder="rico@ico-detailing.be"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Wachtwoord"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              error={errors.password?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Verberg wachtwoord' : 'Toon wachtwoord'}
                  className="cursor-pointer focus-visible:outline-none"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              {...register('password')}
            />

            {serverError && (
              <p
                className="text-sm px-3 py-2 rounded-lg"
                role="alert"
                style={{
                  backgroundColor: 'rgba(239,68,68,0.1)',
                  color: 'var(--color-error)',
                  border: '1px solid rgba(239,68,68,0.2)',
                }}
              >
                {serverError}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
              disabled={loading}
              leftIcon={<LogIn className="w-4 h-4" />}
            >
              Inloggen
            </Button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--color-text-muted)' }}>
          Geen toegang? Contacteer de beheerder.
        </p>
      </div>
    </div>
  )
}
