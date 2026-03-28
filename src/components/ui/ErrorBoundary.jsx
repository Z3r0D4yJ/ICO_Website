import { Component } from 'react'
import { ArrowLeft } from '@/lib/icons'

/**
 * ErrorBoundary — vangt onverwachte React render-fouten op.
 * Toont een gebruiksvriendelijke fallback in plaats van een wit scherm.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-[60vh] flex items-center justify-center px-6"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <div className="text-center max-w-md">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{
                backgroundColor: 'rgba(196,130,111,0.1)',
                border: '1px solid rgba(196,130,111,0.3)',
              }}
            >
              <span className="text-2xl" role="img" aria-label="Fout">⚠</span>
            </div>
            <h2
              className="mb-3"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.75rem',
                color: 'var(--color-text-primary)',
                letterSpacing: '0.02em',
              }}
            >
              Er ging iets mis
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              Er is een onverwachte fout opgetreden. Probeer de pagina te vernieuwen.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
              >
                Pagina vernieuwen
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                  window.history.back()
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                style={{
                  backgroundColor: 'var(--color-surface-overlay)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid rgba(196,130,111,0.2)',
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Terug
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
