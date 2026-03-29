import { Image } from '@/lib/icons'

// Supabase Storage media library komt in stap 9/12
export default function MediaLibraryPage() {
  return (
    <div className="space-y-5">
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.75rem',
          color: 'var(--color-text-primary)',
          letterSpacing: '0.03em',
        }}
      >
        MEDIA LIBRARY
      </h1>

      <div
        className="rounded-xl p-10 flex flex-col items-center gap-4 text-center"
        style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: 'rgba(196,130,111,0.1)', border: '1px solid rgba(196,130,111,0.2)' }}
        >
          <Image className="w-7 h-7" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
        </div>
        <div>
          <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Media library komt binnenkort
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Upload en beheer foto's via Supabase Storage. Volgt in een latere stap.
          </p>
        </div>
      </div>
    </div>
  )
}
