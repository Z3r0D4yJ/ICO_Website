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
  ClipboardText,
} from '@/lib/icons'
import { supabase } from '@/config/supabase'
import { countNewQuotes } from '@/api/quotes'
import { useAuth } from '@/hooks/useAuth'
import { formatPrice } from '@/lib/utils'
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS, SERVICE_CATEGORIES } from '@/lib/constants'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area,
  PieChart, Pie, Cell,
} from 'recharts'

// ── Helpers ──

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

function getLast6Months() {
  const months = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('nl-BE', { month: 'short' }),
      start: d.toISOString(),
      end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999).toISOString(),
    })
  }
  return months
}

// ── Chart theming ──

const CHART_COLORS = {
  primary: 'rgba(196,130,111,1)',
  primaryLight: 'rgba(196,130,111,0.5)',
  primaryFill: 'rgba(196,130,111,0.15)',
  grid: 'rgba(196,130,111,0.1)',
  text: 'var(--color-text-muted)',
  surface: 'var(--color-surface-overlay)',
}

const STATUS_CHART_COLORS = {
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  dropped_off: '#3B82F6',
  in_progress: '#C4826F',
  curing: '#C4826F',
  ready_for_pickup: '#22C55E',
  completed: '#22C55E',
  picked_up: '#6B6B85',
  cancelled: '#EF4444',
}

const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs shadow-lg"
      style={{
        backgroundColor: 'var(--color-surface-overlay)',
        border: '1px solid rgba(196,130,111,0.2)',
        color: 'var(--color-text-primary)',
      }}
    >
      <p className="font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || CHART_COLORS.primary }}>
          {p.name}: {formatter ? formatter(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

// ── Section wrapper ──

function ChartCard({ title, children, loading: isLoading }) {
  return (
    <div
      className="rounded-xl"
      style={{
        backgroundColor: 'var(--color-surface-elevated)',
        border: '1px solid rgba(196,130,111,0.2)',
      }}
    >
      <div
        className="px-4 sm:px-5 py-3 sm:py-4 border-b"
        style={{ borderColor: 'rgba(196,130,111,0.15)' }}
      >
        <h2
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {title}
        </h2>
      </div>
      <div className="p-3 sm:p-5">
        {isLoading ? (
          <Skeleton variant="rect" height="200px" className="rounded-lg" />
        ) : (
          children
        )}
      </div>
    </div>
  )
}

// ── Stat Card ──

function StatCard({ icon: Icon, label, value, sub, loading, color = 'var(--color-primary)' }) {
  return (
    <div
      className="rounded-xl p-3 sm:p-5"
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
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
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

// ── Booking Row ──

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
      className="flex items-center justify-between gap-2 px-3 sm:px-4 py-3 rounded-lg transition-colors duration-150 hover:bg-[var(--color-surface-overlay)] cursor-pointer"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
          {booking.customer_name}
        </p>
        <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
          <Badge variant={statusVariant} size="sm">
            {statusLabel}
          </Badge>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {date} · {booking.preferred_time_slot}
          </p>
        </div>
      </div>
      <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
    </Link>
  )
}

// ── Main Dashboard ──

export default function DashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [chartsLoading, setChartsLoading] = useState(true)
  const [stats, setStats] = useState({
    todayCount: 0,
    weekCount: 0,
    monthRevenue: null,
    pendingCount: 0,
    newQuotes: 0,
  })
  const [recentBookings, setRecentBookings] = useState([])

  // Chart data
  const [revenueByMonth, setRevenueByMonth] = useState([])
  const [bookingsByService, setBookingsByService] = useState([])
  const [bookingsByStatus, setBookingsByStatus] = useState([])
  const [customersByMonth, setCustomersByMonth] = useState([])

  // Load stat cards + recent bookings
  useEffect(() => {
    async function loadDashboard() {
      try {
        const week = weekRange()
        const month = monthRange()

        const [todayRes, weekRes, monthRes, pendingRes, recentRes, newQuotesCount] = await Promise.all([
          supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .gte('preferred_date', new Date().toISOString().slice(0, 10))
            .lte('preferred_date', new Date().toISOString().slice(0, 10)),

          supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .gte('preferred_date', week.start.slice(0, 10))
            .lte('preferred_date', week.end.slice(0, 10)),

          supabase
            .from('bookings')
            .select('total_price')
            .eq('status', 'completed')
            .gte('created_at', month.start)
            .lte('created_at', month.end),

          supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending'),

          supabase
            .from('bookings')
            .select('id, booking_number, customer_name, preferred_date, preferred_time_slot, status, total_price')
            .order('created_at', { ascending: false })
            .limit(8),

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

  // Load chart data
  useEffect(() => {
    async function loadCharts() {
      try {
        const months = getLast6Months()
        const sixMonthsAgo = months[0].start

        // Alle boekingen van de laatste 6 maanden
        const { data: allBookings } = await supabase
          .from('bookings')
          .select('id, status, total_price, created_at, service_id, customer_email')
          .gte('created_at', sixMonthsAgo)
          .neq('status', 'cancelled')

        // Alle services ophalen voor namen
        const { data: services } = await supabase
          .from('services')
          .select('id, title_nl, service_category')

        const bookings = allBookings || []
        const serviceMap = Object.fromEntries((services || []).map((s) => [s.id, s]))

        // 1. Omzet per maand (enkel completed)
        const revByMonth = months.map((m) => {
          const monthBookings = bookings.filter((b) => {
            const d = b.created_at?.slice(0, 7)
            return d === m.key && b.status === 'completed'
          })
          const revenue = monthBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
          return { name: m.label, omzet: revenue }
        })
        setRevenueByMonth(revByMonth)

        // 2. Unieke klanten per maand
        const custByMonth = months.map((m) => {
          const monthBookings = bookings.filter((b) => b.created_at?.slice(0, 7) === m.key)
          const uniqueEmails = new Set(monthBookings.map((b) => b.customer_email).filter(Boolean))
          return { name: m.label, klanten: uniqueEmails.size }
        })
        setCustomersByMonth(custByMonth)

        // 3. Boekingen per dienst (top services)
        const serviceCounts = {}
        bookings.forEach((b) => {
          if (b.service_id && serviceMap[b.service_id]) {
            const name = serviceMap[b.service_id].title_nl
            serviceCounts[name] = (serviceCounts[name] || 0) + 1
          }
        })
        const byService = Object.entries(serviceCounts)
          .map(([name, count]) => ({ name, boekingen: count }))
          .sort((a, b) => b.boekingen - a.boekingen)
          .slice(0, 6)
        setBookingsByService(byService)

        // 4. Boekingen per status (alle)
        const statusCounts = {}
        bookings.forEach((b) => {
          const label = BOOKING_STATUS_LABELS[b.status]?.nl || b.status
          statusCounts[b.status] = statusCounts[b.status] || { name: label, value: 0, status: b.status }
          statusCounts[b.status].value++
        })
        setBookingsByStatus(Object.values(statusCounts).filter((s) => s.value > 0))

      } catch (err) {
        console.error('Charts load error:', err)
      } finally {
        setChartsLoading(false)
      }
    }

    loadCharts()
  }, [])

  const firstName = user?.email?.split('@')[0] || 'Admin'

  return (
    <div className="space-y-6">

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
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
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

      {/* Grafieken rij 1: Omzet + Klanten */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Omzet per maand — bar chart */}
        <ChartCard title="Omzet per maand" loading={chartsLoading}>
          {revenueByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueByMonth} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6B6B85', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#6B6B85', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `€${v}`}
                />
                <Tooltip content={<CustomTooltip formatter={(v) => formatPrice(v)} />} cursor={{ fill: 'rgba(196,130,111,0.06)' }} />
                <Bar
                  dataKey="omzet"
                  name="Omzet"
                  fill={CHART_COLORS.primary}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-center py-8" style={{ color: 'var(--color-text-muted)' }}>Nog geen data</p>
          )}
        </ChartCard>

        {/* Klanten per maand — area chart */}
        <ChartCard title="Unieke klanten per maand" loading={chartsLoading}>
          {customersByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={customersByMonth} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="colorKlanten" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6B6B85', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#6B6B85', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(196,130,111,0.2)' }} />
                <Area
                  type="monotone"
                  dataKey="klanten"
                  name="Klanten"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2}
                  fill="url(#colorKlanten)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-center py-8" style={{ color: 'var(--color-text-muted)' }}>Nog geen data</p>
          )}
        </ChartCard>
      </div>

      {/* Grafieken rij 2: Per dienst + Per status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Boekingen per dienst — horizontal bar */}
        <ChartCard title="Boekingen per dienst" loading={chartsLoading}>
          {bookingsByService.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(180, bookingsByService.length * 40)}>
              <BarChart data={bookingsByService} layout="vertical" margin={{ top: 0, right: 5, bottom: 0, left: 0 }}>
                <XAxis
                  type="number"
                  tick={{ fill: '#6B6B85', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#B0B0C0', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={120}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(196,130,111,0.06)' }} />
                <Bar
                  dataKey="boekingen"
                  name="Boekingen"
                  fill={CHART_COLORS.primary}
                  radius={[0, 4, 4, 0]}
                  maxBarSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-center py-8" style={{ color: 'var(--color-text-muted)' }}>Nog geen data</p>
          )}
        </ChartCard>

        {/* Boekingen per status — donut */}
        <ChartCard title="Boekingen per status" loading={chartsLoading}>
          {bookingsByStatus.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <ResponsiveContainer width="100%" height={200} className="flex-shrink-0" style={{ maxWidth: 200 }}>
                <PieChart>
                  <Pie
                    data={bookingsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {bookingsByStatus.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_CHART_COLORS[entry.status] || '#6B6B85'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legenda */}
              <div className="flex flex-wrap sm:flex-col gap-2 sm:gap-1.5 justify-center">
                {bookingsByStatus.map((entry) => (
                  <div key={entry.status} className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: STATUS_CHART_COLORS[entry.status] || '#6B6B85' }}
                    />
                    <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      {entry.name}
                      <span className="ml-1 font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                        {entry.value}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-center py-8" style={{ color: 'var(--color-text-muted)' }}>Nog geen data</p>
          )}
        </ChartCard>
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
          className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b"
          style={{ borderColor: 'rgba(196,130,111,0.15)' }}
        >
          <h2
            className="text-xs font-semibold uppercase tracking-widest"
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
