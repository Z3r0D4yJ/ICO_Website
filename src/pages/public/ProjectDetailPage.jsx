import { Link, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft, Car, Image } from '@/lib/icons'
import { useTranslation } from 'react-i18next'
import { useProject, useProjects } from '@/hooks/useProjects'
import Skeleton, { SkeletonText } from '@/components/ui/Skeleton'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { SERVICE_CATEGORIES } from '@/lib/constants'

function serviceLabel(value) {
  return SERVICE_CATEGORIES.find((c) => c.value === value)?.label_nl ?? value
}

function ProjectDetailSkeleton() {
  return (
    <div className="container-ico section-padding max-w-4xl mx-auto">
      <Skeleton variant="line" width="200px" height="20px" className="mb-8" />
      <Skeleton variant="rect" style={{ aspectRatio: '16/9', width: '100%' }} className="rounded-2xl mb-8" />
      <SkeletonText lines={3} className="mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rect" style={{ aspectRatio: '4/3' }} className="rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const { i18n } = useTranslation()
  const lang = i18n.language?.slice(0, 2) || 'nl'

  const { project, loading, error } = useProject(slug)
  const { projects: relatedProjects } = useProjects()

  if (loading) return <ProjectDetailSkeleton />
  if (error || !project) return <Navigate to="/projecten" replace />

  const title = (lang === 'en' && project.title_en) ? project.title_en : project.title_nl
  const description = (lang === 'en' && project.description_en) ? project.description_en : project.description_nl
  const related = relatedProjects.filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'var(--color-surface-elevated)', borderBottom: '1px solid rgba(196,130,111,0.2)' }}>
        <div className="container-ico">
          <Breadcrumb items={[
            { label: 'Projecten', to: '/projecten' },
            { label: title },
          ]} />
        </div>
      </div>

      {/* Cover image */}
      {project.cover_image_url && (
        <div className="relative overflow-hidden" style={{ maxHeight: '520px' }}>
          <img
            src={project.cover_image_url}
            alt={title}
            className="w-full object-cover"
            style={{ maxHeight: '520px' }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent 50%, var(--color-surface) 100%)' }}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Content */}
      <article style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container-ico py-10 md:py-14">
          <div className="max-w-4xl mx-auto">

            {/* Service type + tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {project.service_type && (
                <span
                  className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
                >
                  {serviceLabel(project.service_type)}
                </span>
              )}
              {project.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1 rounded-full capitalize"
                  style={{
                    backgroundColor: 'rgba(196,130,111,0.1)',
                    color: 'var(--color-primary)',
                    border: '1px solid rgba(196,130,111,0.2)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1
              className="mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                color: 'var(--color-text-primary)',
                letterSpacing: '0.03em',
                lineHeight: 1.1,
              }}
            >
              {title}
            </h1>

            {/* Vehicle info */}
            {(project.vehicle_brand || project.vehicle_type) && (
              <div
                className="flex items-center gap-2 mb-6 pb-6 border-b"
                style={{ borderColor: 'rgba(196,130,111,0.2)' }}
              >
                <Car className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {[project.vehicle_brand, project.vehicle_type].filter(Boolean).join(' — ')}
                </span>
              </div>
            )}

            {/* Description */}
            {description && (
              <p
                className="text-base md:text-lg leading-relaxed mb-10"
                style={{ color: 'var(--color-text-secondary)', lineHeight: 1.75 }}
              >
                {description}
              </p>
            )}

            {/* Gallery */}
            {project.images?.length > 0 && (
              <div className="mb-10">
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Foto&apos;s
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {project.images.map((url, index) => (
                    <div key={index} className="rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                      <img
                        src={url}
                        alt={`${title} — foto ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back link */}
            <div className="pt-6 border-t" style={{ borderColor: 'rgba(196,130,111,0.2)' }}>
              <Link
                to="/projecten"
                className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer transition-opacity hover:opacity-80"
                style={{ color: 'var(--color-primary)' }}
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Terug naar alle projecten
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related projects */}
      {related.length > 0 && (
        <section
          className="section-padding"
          style={{ backgroundColor: 'var(--color-surface-elevated)', borderTop: '1px solid rgba(196,130,111,0.15)' }}
          aria-labelledby="related-title"
        >
          <div className="container-ico">
            <h2
              id="related-title"
              className="text-center mb-8"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                color: 'var(--color-text-primary)',
                letterSpacing: '0.03em',
              }}
            >
              MEER PROJECTEN
            </h2>
            <div className="divider-gold mt-4 mb-8" aria-hidden="true" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {related.map((p) => {
                const t = (lang === 'en' && p.title_en) ? p.title_en : p.title_nl
                return (
                  <Link
                    key={p.id}
                    to={`/projecten/${p.slug}`}
                    className="group flex flex-col rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                    style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
                  >
                    {p.cover_image_url ? (
                      <div className="overflow-hidden" style={{ aspectRatio: '16/9' }}>
                        <img
                          src={p.cover_image_url}
                          alt={t}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div
                        className="flex items-center justify-center"
                        style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-surface) 100%)' }}
                        aria-hidden="true"
                      >
                        <Image className="w-8 h-8 opacity-20" style={{ color: 'var(--color-primary)' }} />
                      </div>
                    )}
                    <div className="p-4">
                      {p.service_type && (
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--color-primary)' }}>
                          {serviceLabel(p.service_type)}
                        </p>
                      )}
                      <h3
                        className="line-clamp-2"
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.125rem',
                          color: 'var(--color-text-primary)',
                          letterSpacing: '0.02em',
                          lineHeight: 1.25,
                        }}
                      >
                        {t}
                      </h3>
                      {p.vehicle_brand && (
                        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                          {p.vehicle_brand}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
