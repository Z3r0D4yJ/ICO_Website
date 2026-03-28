import { Link, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft, Calendar, User, BookOpen } from '@/lib/icons'
import { useTranslation } from 'react-i18next'
import DOMPurify from 'dompurify'
import { useBlogPost, useBlogPosts } from '@/hooks/useBlog'
import Skeleton, { SkeletonText } from '@/components/ui/Skeleton'
import Breadcrumb from '@/components/ui/Breadcrumb'

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'blockquote', 'img', 'hr', 'code', 'pre', 'span', 'div',
  ],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel', 'class', 'id'],
  ALLOW_DATA_ATTR: false,
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('nl-BE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function BlogPostSkeleton() {
  return (
    <div className="container-ico section-padding max-w-3xl mx-auto">
      <Skeleton variant="line" width="200px" height="20px" className="mb-8" />
      <Skeleton variant="rect" style={{ aspectRatio: '16/9', width: '100%' }} className="rounded-2xl mb-8" />
      <SkeletonText lines={2} className="mb-4" />
      <Skeleton variant="line" width="200px" height="16px" className="mb-8" />
      <SkeletonText lines={8} />
    </div>
  )
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const { i18n } = useTranslation()
  const lang = i18n.language?.slice(0, 2) || 'nl'

  const { post, loading, error } = useBlogPost(slug)
  const { posts: relatedPosts } = useBlogPosts()

  const title = post ? ((lang === 'en' && post.title_en) ? post.title_en : post.title_nl) : ''
  const content = post ? ((lang === 'en' && post.content_en) ? post.content_en : post.content_nl) : ''
  const excerpt = post ? ((lang === 'en' && post.excerpt_en) ? post.excerpt_en : post.excerpt_nl) : ''

  const related = relatedPosts.filter((p) => p.slug !== slug).slice(0, 2)

  if (loading) return <BlogPostSkeleton />
  if (error || !post) return <Navigate to="/blog" replace />

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'var(--color-surface-elevated)', borderBottom: '1px solid rgba(196,130,111,0.2)' }}>
        <div className="container-ico">
          <Breadcrumb items={[
            { label: 'Blog', to: '/blog' },
            { label: title },
          ]} />
        </div>
      </div>

      {/* Artikel */}
      <article style={{ backgroundColor: 'var(--color-surface)' }}>

        {/* Cover image */}
        {post.cover_image_url && (
          <div
            className="relative overflow-hidden"
            style={{ maxHeight: '520px' }}
          >
            <img
              src={post.cover_image_url}
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

        {/* Content container */}
        <div className="container-ico py-12 md:py-16">
          <div className="max-w-3xl mx-auto">

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full cursor-pointer transition-opacity hover:opacity-80"
                    style={{
                      backgroundColor: 'rgba(196,130,111,0.1)',
                      color: 'var(--color-primary)',
                      border: '1px solid rgba(196,130,111,0.2)',
                    }}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Titel */}
            <h1
              className="mb-5"
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

            {/* Excerpt */}
            {excerpt && (
              <p
                className="text-lg leading-relaxed mb-6"
                style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}
              >
                {excerpt}
              </p>
            )}

            {/* Meta */}
            <div
              className="flex flex-wrap items-center gap-4 mb-10 pb-8 border-b"
              style={{ borderColor: 'rgba(196,130,111,0.2)' }}
            >
              {post.author && (
                <span className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: 'rgba(196,130,111,0.15)', color: 'var(--color-primary)' }}
                    aria-hidden="true"
                  >
                    {post.author[0].toUpperCase()}
                  </div>
                  {post.author}
                </span>
              )}
              {post.published_at && (
                <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  {formatDate(post.published_at)}
                </span>
              )}
            </div>

            {/* Artikel body */}
            <div
              className="prose-blog"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content, SANITIZE_CONFIG) }}
            />

            {/* Back link */}
            <div
              className="mt-12 pt-8 border-t"
              style={{ borderColor: 'rgba(196,130,111,0.2)' }}
            >
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer transition-opacity hover:opacity-80"
                style={{ color: 'var(--color-primary)' }}
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Terug naar alle artikels
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Gerelateerde posts */}
      {related.length > 0 && (
        <section
          className="section-padding"
          style={{ backgroundColor: 'var(--color-surface-elevated)', borderTop: '1px solid rgba(196,130,111,0.15)' }}
          aria-labelledby="related-posts-title"
        >
          <div className="container-ico">
            <h2
              id="related-posts-title"
              className="text-center mb-8"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                color: 'var(--color-text-primary)',
                letterSpacing: '0.03em',
              }}
            >
              MEER ARTIKELS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {related.map((p) => {
                const t = (lang === 'en' && p.title_en) ? p.title_en : p.title_nl
                const ex = (lang === 'en' && p.excerpt_en) ? p.excerpt_en : p.excerpt_nl
                return (
                  <Link
                    key={p.id}
                    to={`/blog/${p.slug}`}
                    className="group flex flex-col rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                    style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
                  >
                    {p.cover_image_url ? (
                      <div className="overflow-hidden" style={{ aspectRatio: '16/9' }}>
                        <img
                          src={p.cover_image_url}
                          alt={t}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div
                        className="flex items-center justify-center"
                        style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-surface) 100%)' }}
                        aria-hidden="true"
                      >
                        <BookOpen className="w-8 h-8 opacity-20" style={{ color: 'var(--color-primary)' }} />
                      </div>
                    )}
                    <div className="p-5">
                      <h3
                        className="mb-2 line-clamp-2"
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
                      {ex && (
                        <p className="text-sm line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                          {ex}
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
