import { cn } from '@/lib/utils'

export default function Skeleton({
  variant = 'rect',
  width,
  height,
  className,
  style,
  ...props
}) {
  const variants = {
    line: 'rounded-[var(--radius-sm)] h-4',
    circle: 'rounded-full',
    rect: 'rounded-[var(--radius-xl)]',
  }

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Laden"
      className={cn('animate-skeleton-pulse', variants[variant], className)}
      style={{
        background:
          'linear-gradient(90deg, rgba(250,246,241,0.045), rgba(250,246,241,0.09), rgba(250,246,241,0.045))',
        backgroundSize: '220% 100%',
        width: width || (variant === 'circle' ? '40px' : '100%'),
        height: height || (variant === 'circle' ? '40px' : variant === 'line' ? undefined : '120px'),
        ...style,
      }}
      {...props}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="ico-panel overflow-hidden" aria-busy="true" role="status" aria-label="Kaart laden">
      <Skeleton variant="rect" height="180px" className="rounded-none" />
      <div className="p-5">
        <Skeleton variant="line" width="52%" className="mb-3" />
        <Skeleton variant="line" width="88%" className="mb-2" />
        <Skeleton variant="line" width="70%" className="mb-5" />
        <Skeleton variant="line" width="44%" height="36px" />
      </div>
    </div>
  )
}

export function SkeletonText({ lines = 3, lastLineWidth = '60%', className }) {
  return (
    <div className={cn('flex flex-col gap-2', className)} role="status" aria-busy="true" aria-label="Tekst laden">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="line" width={i === lines - 1 ? lastLineWidth : '100%'} />
      ))}
    </div>
  )
}

export function SkeletonRow({ cols = 4 }) {
  return (
    <div className="flex items-center gap-4 py-3" role="status" aria-busy="true">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} variant="line" width={i === 0 ? '120px' : '100%'} />
      ))}
    </div>
  )
}
