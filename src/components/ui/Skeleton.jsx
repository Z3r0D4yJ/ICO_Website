import { cn } from '@/lib/utils'

/**
 * ICO Skeleton loader
 * Gebruik als placeholder tijdens het laden van async content.
 *
 * @param {'line'|'circle'|'rect'} variant
 * @param {string} width
 * @param {string} height
 */
export default function Skeleton({
  variant = 'rect',
  width,
  height,
  className,
  style,
  ...props
}) {
  const base = 'animate-skeleton-pulse'

  const variants = {
    line: 'rounded-md h-4',
    circle: 'rounded-full',
    rect: 'rounded-lg',
  }

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Laden..."
      className={cn(base, variants[variant], className)}
      style={{
        backgroundColor: 'var(--color-surface-overlay)',
        width: width || (variant === 'circle' ? '40px' : '100%'),
        height: height || (variant === 'circle' ? '40px' : variant === 'line' ? undefined : '120px'),
        ...style,
      }}
      {...props}
    />
  )
}

// Skeleton card — voor dienst/product kaarten
export function SkeletonCard() {
  return (
    <div
      className="rounded-xl p-6 border"
      style={{ backgroundColor: 'var(--color-surface-elevated)', borderColor: 'rgba(196,130,111,0.15)' }}
      aria-busy="true"
      role="status"
      aria-label="Kaart laden..."
    >
      <Skeleton variant="rect" height="160px" className="mb-4" />
      <Skeleton variant="line" width="60%" className="mb-2" />
      <Skeleton variant="line" width="90%" className="mb-2" />
      <Skeleton variant="line" width="75%" className="mb-4" />
      <Skeleton variant="line" width="40%" height="36px" className="rounded-md" />
    </div>
  )
}

// Skeleton tekst blok — meerdere regels
export function SkeletonText({ lines = 3, lastLineWidth = '60%' }) {
  return (
    <div className="flex flex-col gap-2" role="status" aria-busy="true" aria-label="Tekst laden...">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="line"
          width={i === lines - 1 ? lastLineWidth : '100%'}
        />
      ))}
    </div>
  )
}

// Skeleton tabel rij
export function SkeletonRow({ cols = 4 }) {
  return (
    <div className="flex items-center gap-4 py-3" role="status" aria-busy="true">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} variant="line" width={i === 0 ? '120px' : '100%'} />
      ))}
    </div>
  )
}
