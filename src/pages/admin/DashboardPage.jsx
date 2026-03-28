import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarDays,
  CalendarClock,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ClipboardText,
} from '@/lib/icons'
import { supabase } from '@/config/supabase'
import { countNewQuotes } from '@/api/quotes'
import { useAuth } from '@/hooks/useAuth'
import { formatPrice } from '@/lib/utils'
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from '@/lib/constants'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'

// Helper: datum range
function todayRange() {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  return { start: start.toISOString(), end: end.toISOString() }
}

function weekRange() {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date()
  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return { start: start.toISOString(), end: end.toISOString() }
}

function monthRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
  return { start: start.toISOString(), end: end.toISOString() }
}

function StatCard({ icon: Icon, label, value, sub, loading, color = 'var(--color-primary)' }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: 'var(--color-surface-elevated)',
        border: '1px solid rgba(196,130,111,0.2)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'rgba(196,130,111,0.1)', border: '1px solid rgba(196,130,111,0.2)' }}
        >
          <Icon className="w-5 h-5" style={{ color }} aria-hidden="true" />
        </div>
      </div>
      {loading ? (
        <Skeleton variant="line" width="60px" height="32px" className="mb-1" />
      ) : (
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            color: 'var(--color-text-primary)',
            lineHeight: 1,
          }}
        >
          {value}
        </p>
      )}
      <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
        {label}
      </p>
      {sub && (
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          {sub}
        </p>
      )}
    </div>
  )
}

function BookingRow({ booking }) {
  const statusLabel = BOOKING_STATUS_LABELS[booking.status]?.nl || booking.status
  const statusVariant = BOOKING_STATUS_COLORS[booking.status] || 'neutral'

  const date = new Date(booking.preferred_date + 'T12:00:00').toLocaleDateString('nl-BE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  return (
    <Link
      to={`/admin/boekingen/${booking.id}`}
      className="flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-150 hover:bg-[var(--color-surface-overlay)] cursor-pointer"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
          {booking.customer_name}
        </p>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {booking.booking_number} · {date} · {booking.preferred_time_slot}
        </p>
      </div>
      <div className="flex items-center gap-3 ml-3 flex-shrink-0">
        <Badge variant={statusVariant} size="sm">
          {statusLabel}
        </Badge>
        <ArrowRight className="w-3.5 h-3.5" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
      </div>
    </Link>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    todayCount: 0,
    weekCount: 0,
    monthRevenue: null,
    pendingCount: 0,
    newQuotes: 0,
  })
  const [recentBookings, setRecentBookings] = useState([])

  useEffect(() => {
    async function loadDashboard() {
      try {
        const today = todayRange()
        const week = weekRange()
        const month = monthRange()

        const [todayRes, weekRes, monthRes, pendingRes, recentRes, newQuotesCount] = await Promise.all([
          // Boekingen vandaag
          supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .gte('preferred_date', new Date().toISOString().slice(0, 10))
            .lte('preferred_date', new Date().toISOString().slice(0, 10)),

          // Boekingen deze week
          supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .gte('preferred_date', week.start.slice(0, 10))
            .lte('preferred_date', week.end.slice(0, 10)),

          // Omzet deze maand (completed boekingen)
          supabase
            .from('bookings')
            .select('total_price')
            .eq('status', 'completed')
            .gte('created_at', month.start)
            .lte('created_at', month.end),

          // Openstaande boekingen (pending)
          supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending'),

          // Recente boekingen
          supabase
            .from('bookings')
            .select('id, booking_number, customer_name, preferred_date, preferred_time_slot, status, total_price')
            .order('created_at', { ascending: false })
            .limit(8),

          // Nieuwe offerte-aanvragen
          countNewQuotes(),
        ])

        const monthRevenue = (monthRes.data || []).reduce(
          (sum, b) => sum + (b.total_price || 0),
          0
        )

        setStats({
          todayCount: todayRes.count || 0,
          weekCount: weekRes.count || 0,
          monthRevenue,
          pendingCount: pendingRes.count || 0,
          newQuotes: newQuotesCount,
        })
        setRecentBookings(recentRes.data || [])
      } catch (err) {
        console.error('Dashboard load error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const firstName = user?.email?.split('@')[0] || 'Admin'

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Welkom */}
      <div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            color: 'var(--color-text-primary)',
            letterSpacing: '0.03em',
          }}
        >
          WELKOM, {firstName.toUpperCase()}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          {new Date().toLocaleDateString('nl-BE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stat kaarten */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={CalendarDays}
          label="Boekingen vandaag"
          value={stats.todayCount}
          loading={loading}
        />
        <StatCard
          icon={CalendarClock}
          label="Boekingen deze week"
          value={stats.weekCount}
          loading={loading}
        />
        <StatCard
          icon={TrendingUp}
          label="Omzet deze maand"
          value={stats.monthRevenue !== null ? formatPrice(stats.monthRevenue) : '—'}
          sub="Enkel voltooide boekingen"
          loading={loading}
        />
        <StatCard
          icon={Clock}
          label="Wacht op bevestiging"
          value={stats.pendingCount}
          loading={loading}
          color={stats.pendingCount > 0 ? 'var(--color-warning)' : 'var(--color-success)'}
        />
        <StatCard
          icon={ClipboardText}
          label="Nieuwe offertes"
          value={stats.newQuotes}
          loading={loading}
          color={stats.newQuotes > 0 ? 'var(--color-warning)' : 'var(--color-success)'}
        />
      </div>

      {/* Recente boekingen */}
      <div
        className="rounded-xl"
        style={{
          backgroundColor: 'var(--color-surface-elevated)',
          border: '1px solid rgba(196,130,111,0.2)',
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'rgba(196,130,111,0.15)' }}
        >
          <h2
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Recente boekingen
          </h2>
          <Link
            to="/admin/boekingen"
            className="flex items-center gap-1 text-xs font-medium transition-colors duration-150 hover:opacity-80 cursor-pointer"
            style={{ color: 'var(--color-primary)' }}
          >
            Alle bekijken
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="p-2">
          {loading ? (
            <div className="space-y-2 p-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="line" height="48px" className="rounded-lg" />
              ))}
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10">
              <CheckCircle2
                className="w-8 h-8"
                style={{ color: 'var(--color-text-muted)' }}
                aria-hidden="true"
              />
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Nog geen boekingen
              </p>
            </div>
          ) : (
            recentBookings.map((booking) => (
              <BookingRow key={booking.id} booking={booking} />
            ))
          )}
        </div>
      </div>

      {/* Snelle acties */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/admin/boekingen"
          className="flex items-center justify-between p-4 rounded-xl transition-all duration-150 cursor-pointer group"
          style={{
            backgroundColor: 'var(--color-surface-elevated)',
            border: '1px solid rgba(196,130,111,0.2)',
          }}
        >
          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                Boekingen beheren
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Status updaten, details bekijken
              </p>
            </div>
          </div>
          <ArrowRight
            className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1"
            style={{ color: 'var(--color-text-muted)' }}
            aria-hidden="true"
          />
        </Link>

        <Link
          to="/admin/diensten"
          className="flex items-center justify-between p-4 rounded-xl transition-all duration-150 cursor-pointer group"
          style={{
            backgroundColor: 'var(--color-surface-elevated)',
            border: '1px solid rgba(196,130,111,0.2)',
          }}
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                Diensten & prijzen
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Prijzen en beschrijvingen aanpassen
              </p>
            </div>
          </div>
          <ArrowRight
            className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1"
            style={{ color: 'var(--color-text-muted)' }}
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  )
}
