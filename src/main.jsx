import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './config/i18n.js'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* i18n laadt vertalingen async — Suspense toont fallback tijdens laden */}
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface)' }}>
          <div className="text-center">
            <div className="text-4xl font-display mb-2" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>ICO</div>
            <div style={{ color: 'var(--color-text-muted)' }}>Laden...</div>
          </div>
        </div>
      }>
        <App />
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
)
