import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

// Layout componenten (eager load — altijd nodig)
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AdminLayout from '@/components/layout/AdminLayout'
import ToastContainer from '@/components/ui/Toast'
import CartDrawer from '@/components/shop/CartDrawer'
import ErrorBoundary from '@/components/ui/ErrorBoundary'

// Publieke pagina's (lazy loaded per route)
const HomePage = lazy(() => import('@/pages/public/HomePage'))
const ServicesPage = lazy(() => import('@/pages/public/ServicesPage'))
const ServiceDetailPage = lazy(() => import('@/pages/public/ServiceDetailPage'))
const BookingPage = lazy(() => import('@/pages/public/BookingPage'))
const BookingConfirmation = lazy(() => import('@/pages/public/BookingConfirmation'))
const BookingTrackingPage = lazy(() => import('@/pages/public/BookingTrackingPage'))
const ShopPage = lazy(() => import('@/pages/public/ShopPage'))
const ProductDetailPage = lazy(() => import('@/pages/public/ProductDetailPage'))
const CartPage = lazy(() => import('@/pages/public/CartPage'))
const CheckoutPage = lazy(() => import('@/pages/public/CheckoutPage'))
const OrderConfirmation = lazy(() => import('@/pages/public/OrderConfirmation'))
const BlogPage = lazy(() => import('@/pages/public/BlogPage'))
const BlogPostPage = lazy(() => import('@/pages/public/BlogPostPage'))
const ProjectsPage = lazy(() => import('@/pages/public/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('@/pages/public/ProjectDetailPage'))
const AboutPage = lazy(() => import('@/pages/public/AboutPage'))
const ContactPage = lazy(() => import('@/pages/public/ContactPage'))
const FAQPage = lazy(() => import('@/pages/public/FAQPage'))
const PrivacyPage = lazy(() => import('@/pages/public/PrivacyPage'))
const TermsPage = lazy(() => import('@/pages/public/TermsPage'))

// Admin pagina's (aparte chunk — niet geladen voor publieke bezoekers)
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'))
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'))
const BookingsListPage = lazy(() => import('@/pages/admin/BookingsListPage'))
const BookingDetailPage = lazy(() => import('@/pages/admin/BookingDetailPage'))
const ServicesManagePage = lazy(() => import('@/pages/admin/ServicesManagePage'))
const ProductsManagePage = lazy(() => import('@/pages/admin/ProductsManagePage'))
const BlogManagePage = lazy(() => import('@/pages/admin/BlogManagePage'))
const BlogEditorPage = lazy(() => import('@/pages/admin/BlogEditorPage'))
const ProjectsManagePage = lazy(() => import('@/pages/admin/ProjectsManagePage'))
const ProjectEditorPage = lazy(() => import('@/pages/admin/ProjectEditorPage'))
const MediaLibraryPage = lazy(() => import('@/pages/admin/MediaLibraryPage'))
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage'))
const QuotesPage = lazy(() => import('@/pages/admin/QuotesPage'))

// Auth guard
const AuthGuard = lazy(() => import('@/components/admin/AuthGuard'))

// Loading fallback
// Loading fallback met een draaiend autowiel
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        {/* Container voor het wiel */}
        <div 
          className="w-12 h-12 mx-auto mb-4 animate-spin"
          style={{ color: 'var(--color-primary)' }}
        >
          {/* SVG van een autowiel met velg */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full"
          >
            {/* Buitenband */}
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            {/* Velgrand */}
            <circle cx="12" cy="12" r="7" />
            {/* Naaf / Centrum */}
            <circle cx="12" cy="12" r="2" />
            {/* Spaken */}
            <line x1="12" y1="5" x2="12" y2="10" />
            <line x1="12" y1="14" x2="12" y2="19" />
            <line x1="5" y1="12" x2="10" y2="12" />
            <line x1="14" y1="12" x2="19" y2="12" />
            <line x1="7.05" y1="7.05" x2="10.5" y2="10.5" />
            <line x1="13.5" y1="13.5" x2="16.95" y2="16.95" />
            <line x1="7.05" y1="16.95" x2="10.5" y2="13.5" />
            <line x1="13.5" y1="10.5" x2="16.95" y2="7.05" />
          </svg>
        </div>
        
        <p style={{ color: 'var(--color-text-muted)' }} className="font-medium tracking-wide">
          Aan het polijsten...
        </p>
      </div>
    </div>
  )
}

// Skip to main content link (accessibility)
function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
      style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
    >
      Naar hoofdinhoud
    </a>
  )
}

// Publieke layout wrapper
function PublicLayout({ children }) {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      <ScrollToTop />
      <Routes>
        {/* ===== Publieke routes ===== */}
        <Route path="/" element={
          <PublicLayout><HomePage /></PublicLayout>
        } />
        <Route path="/diensten" element={
          <PublicLayout><ServicesPage /></PublicLayout>
        } />
        <Route path="/diensten/:slug" element={
          <PublicLayout><ServiceDetailPage /></PublicLayout>
        } />
        <Route path="/boeken" element={
          <PublicLayout><BookingPage /></PublicLayout>
        } />
        <Route path="/boeken/bevestiging" element={
          <PublicLayout><BookingConfirmation /></PublicLayout>
        } />
        <Route path="/mijn-boeking/:token" element={
          <PublicLayout><BookingTrackingPage /></PublicLayout>
        } />
        <Route path="/shop" element={
          <PublicLayout><ShopPage /></PublicLayout>
        } />
        <Route path="/shop/:productSlug" element={
          <PublicLayout><ProductDetailPage /></PublicLayout>
        } />
        <Route path="/shop/winkelwagen" element={
          <PublicLayout><CartPage /></PublicLayout>
        } />
        <Route path="/shop/afrekenen" element={
          <PublicLayout><CheckoutPage /></PublicLayout>
        } />
        <Route path="/shop/bevestiging" element={
          <PublicLayout><OrderConfirmation /></PublicLayout>
        } />
        <Route path="/blog" element={
          <PublicLayout><BlogPage /></PublicLayout>
        } />
        <Route path="/blog/:slug" element={
          <PublicLayout><BlogPostPage /></PublicLayout>
        } />
        <Route path="/projecten" element={
          <PublicLayout><ProjectsPage /></PublicLayout>
        } />
        <Route path="/projecten/:slug" element={
          <PublicLayout><ProjectDetailPage /></PublicLayout>
        } />
        <Route path="/over-ons" element={
          <PublicLayout><AboutPage /></PublicLayout>
        } />
        <Route path="/contact" element={
          <PublicLayout><ContactPage /></PublicLayout>
        } />
        <Route path="/faq" element={
          <PublicLayout><FAQPage /></PublicLayout>
        } />
        <Route path="/privacy" element={
          <PublicLayout><PrivacyPage /></PublicLayout>
        } />
        <Route path="/voorwaarden" element={
          <PublicLayout><TermsPage /></PublicLayout>
        } />

        {/* ===== Admin routes ===== */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={
          <AuthGuard>
            <AdminLayout><DashboardPage /></AdminLayout>
          </AuthGuard>
        } />
        <Route path="/admin/boekingen" element={
          <AuthGuard>
            <AdminLayout><BookingsListPage /></AdminLayout>
          </AuthGuard>
        } />
        <Route path="/admin/boekingen/:id" element={
          <AuthGuard>
            <AdminLayout><BookingDetailPage /></AdminLayout>
          </AuthGuard>
        } />
        <Route path="/admin/offertes" element={
          <AuthGuard>
            <AdminLayout><QuotesPage /></AdminLayout>
          </AuthGuard>
        } />
        <Route path="/admin/diensten" element={
          <AuthGuard>
            <AdminLayout><ServicesManagePage /></AdminLayout>
          </AuthGuard>
        } />
        <Route path="/admin/producten" element={
          <AuthGuard>
            <AdminLayout><ProductsManagePage /></AdminLayout>
          </AuthGuard>
        } />
        <Route path="/admin/blog" element={
          <AuthGuard>
            <AdminLayout><BlogManagePage /></AdminLayout>
          </AuthGuard>
        } />
        <Route path="/admin/blog/nieuw" element={
          <AuthGuard>
            <AdminLayout><BlogEditorPage /></AdminLayout>
          </AuthGuard>
        } />
        <Route path="/admin/blog/:id/edit" element={
          <AuthGuard>
            <AdminLayout><BlogEditorPage /></AdminLayout>
          </AuthGuard>
        } />
        <Route path="/admin/projecten" element={
          <AuthGuard>
            <AdminLayout><ProjectsManagePage /></AdminLayout>
          </AuthGuard>
        } />
        <Route path="/admin/projecten/nieuw" element={
          <AuthGuard>
            <AdminLayout><ProjectEditorPage /></AdminLayout>
          </AuthGuard>
        } />
        <Route path="/admin/projecten/:id/edit" element={
          <AuthGuard>
            <AdminLayout><ProjectEditorPage /></AdminLayout>
          </AuthGuard>
        } />
        <Route path="/admin/media" element={
          <AuthGuard>
            <AdminLayout><MediaLibraryPage /></AdminLayout>
          </AuthGuard>
        } />
        <Route path="/admin/instellingen" element={
          <AuthGuard>
            <AdminLayout><SettingsPage /></AdminLayout>
          </AuthGuard>
        } />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Toast notificaties — altijd beschikbaar */}
      <ToastContainer />
      {/* Cart drawer — altijd beschikbaar */}
      <CartDrawer />
    </Suspense>
    </ErrorBoundary>
  )
}
