import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Image, Car, ArrowRight } from '@/lib/icons'
import { useTranslation } from 'react-i18next'
import { useProjects } from '@/hooks/useProjects'
import Skeleton from '@/components/ui/Skeleton'
import { SERVICE_CATEGORIES } from '@/lib/constants'

function ProjectCard({ project, lang }) {
  const title = (lang === 'en' && project.title_en) ? project.title_en : project.title_nl
  const description = (lang === 'en' && project.description_en) ? project.description_en : project.description_nl

  return (
    <Link
      to={`/projecten/${project.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
      style={{
        backgroundColor: 'var(--color-surface-elevated)',
        border: '1px solid rgba(196,130,111,0.18)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = '1px solid rgba(196,130,111,0.35)'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = '1px solid rgba(196,130,111,0.18)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Cover image */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ aspectRatio: '16/9' }}>
        {project.cover_image_url ? (
          <img
            src={project.cover_image_url}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-surface) 100%)' }}
            aria-hidden="true"
          >
            <Image className="w-10 h-10 opacity-30" style={{ color: 'var(--color-primary)' }} />
          </div>
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)' }}
          aria-hidden="true"
        />
        {project.service_type && (
          <div className="absolute bottom-3 left-3">
            <span
              className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
            >
              {SERVICE_CATEGORIES.find((c) => c.value === project.service_type)?.label_nl ?? project.service_type}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {(project.vehicle_brand || project.vehicle_type) && (
          <div className="flex items-center gap-1.5 mb-2">
            <Car className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {[project.vehicle_brand, project.vehicle_type].filter(Boolean).join(' · ')}
            </span>
          </div>
        )}

        <h2
          className="mb-2 line-clamp-2"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            color: 'var(--color-text-primary)',
            letterSpacing: '0.02em',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h2>

        {description && (
          <p
            className="text-sm leading-relaxed flex-1 line-clamp-2 mb-4"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {description}
          </p>
        )}

        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-2 py-0.5 rounded-full capitalize"
                style={{ backgroundColor: 'rgba(196,130,111,0.1)', color: 'var(--color-primary)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div
          className="flex items-center justify-end pt-3 border-t mt-auto"
          style={{ borderColor: 'rgba(196,130,111,0.15)' }}
        >
          <div
            className="flex items-center gap-1.5 text-xs font-medium transition-all duration-150 group-hover:gap-2.5"
            style={{ color: 'var(--color-primary)' }}
          >
            Bekijk project
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </div>
        </div>
      </div>
    </Link>
  )
}

function ProjectCardSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.18)' }}
    >
      <Skeleton variant="rect" style={{ aspectRatio: '16/9', width: '100%' }} />
      <div className="p-5 space-y-3">
        <Skeleton variant="line" width="40%" height="14px" />
        <Skeleton variant="line" width="80%" height="22px" />
        <Skeleton variant="rect" height="40px" />
        <Skeleton variant="line" width="100%" height="1px" />
        <Skeleton variant="line" width="30%" height="14px" />
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  const { i18n } = useTranslation()
  const lang = i18n.language?.slice(0, 2) || 'nl'
  const [activeType, setActiveType] = useState(null)
  const { projects, loading } = useProjects({ serviceType: activeType })

  return (
    <>
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, var(--color-secondary) 0%, var(--color-surface) 100%)',
          borderBottom: '1px solid rgba(196,130,111,0.2)',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, var(--color-primary) 0, var(--color-primary) 1px, transparent 1px, transparent 64px),' +
              'repeating-linear-gradient(90deg, var(--color-primary) 0, var(--color-primary) 1px, transparent 1px, transparent 64px)',
          }}
        />
        <div className="container-ico py-14 md:py-20 relative z-10 text-center">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--color-primary)' }}
          >
            Portfolio
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
              color: 'var(--color-text-primary)',
              letterSpacing: '0.03em',
              lineHeight: 1.0,
            }}
          >
            ONZE PROJECTEN
          </h1>
          <div className="divider-gold mt-4 mb-4" aria-hidden="true" />
          <p
            className="max-w-lg mx-auto text-base"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Voor en na — ontdek de transformaties die wij elke dag realiseren voor onze klanten in Vlaanderen.
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container-ico">
          {/* Service type filters */}
          <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter op dienst">
            <button
              onClick={() => setActiveType(null)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
              style={
                activeType === null
                  ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }
                  : { backgroundColor: 'var(--color-surface-elevated)', color: 'var(--color-text-secondary)', border: '1px solid rgba(196,130,111,0.2)' }
              }
            >
              Alle
            </button>
            {SERVICE_CATEGORIES.map(({ value, label_nl }) => (
              <button
                key={value}
                onClick={() => setActiveType(value === activeType ? null : value)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                style={
                  activeType === value
                    ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }
                    : { backgroundColor: 'var(--color-surface-elevated)', color: 'var(--color-text-secondary)', border: '1px solid rgba(196,130,111,0.2)' }
                }
              >
                {label_nl}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => <ProjectCardSkeleton key={i} />)}
            </div>
          ) : projects.length === 0 ? (
            <div
              className="flex flex-col items-center gap-4 py-20 rounded-2xl text-center"
              style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.15)' }}
            >
              <Image className="w-12 h-12" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
              <div>
                <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {activeType ? `Geen projecten gevonden voor "${SERVICE_CATEGORIES.find(c => c.value === activeType)?.label_nl ?? activeType}"` : 'Nog geen projecten gepubliceerd'}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                  Kom binnenkort terug — we zijn druk bezig!
                </p>
              </div>
              {activeType && (
                <button
                  onClick={() => setActiveType(null)}
                  className="text-sm font-medium cursor-pointer"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Toon alle projecten
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop grid */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} lang={lang} />
                ))}
              </div>

              {/* Mobile — horizontaal scroll */}
              <div
                className="sm:hidden -mx-4 overflow-x-auto snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', scrollPaddingInline: '1.5rem' }}
              >
                <div className="flex gap-4 px-4" role="list" aria-label="Projecten">
                  {projects.map((project) => (
                    <div key={project.id} className="snap-start flex-shrink-0 w-[calc(100vw-3rem)]" role="listitem">
                      <ProjectCard project={project} lang={lang} />
                    </div>
                  ))}
                  <div className="flex-shrink-0 w-1" aria-hidden="true" />
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
