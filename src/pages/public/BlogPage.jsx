import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Calendar, User } from '@/lib/icons'
import { useTranslation } from 'react-i18next'
import { useBlogPosts } from '@/hooks/useBlog'
import Skeleton from '@/components/ui/Skeleton'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('nl-BE', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function BlogCard({ post, lang }) {
  const title = (lang === 'en' && post.title_en) ? post.title_en : post.title_nl
  const excerpt = (lang === 'en' && post.excerpt_en) ? post.excerpt_en : post.excerpt_nl

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      style={{
        backgroundColor: 'var(--color-surface-elevated)',
        border: '1px solid rgba(196,130,111,0.18)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = '1px solid rgba(196,130,111,0.45)'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = '1px solid rgba(196,130,111,0.18)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Cover image */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ aspectRatio: '16/9' }}
      >
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-surface) 100%)' }}
            aria-hidden="true"
          >
            <BookOpen
              className="w-10 h-10 opacity-30"
              style={{ color: 'var(--color-primary)' }}
            />
          </div>
        )}
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)' }}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: 'rgba(196,130,111,0.1)',
                  color: 'var(--color-primary)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2
          className="mb-3 line-clamp-2"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.375rem',
            color: 'var(--color-text-primary)',
            letterSpacing: '0.02em',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h2>

        {/* Excerpt */}
        {excerpt && (
          <p
            className="text-sm leading-relaxed flex-1 line-clamp-3 mb-5"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {excerpt}
          </p>
        )}

        {/* Footer: meta + lees meer */}
        <div
          className="flex items-center justify-between pt-4 border-t mt-auto"
          style={{ borderColor: 'rgba(196,130,111,0.15)' }}
        >
          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {post.author && (
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" aria-hidden="true" />
                {post.author}
              </span>
            )}
            {post.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                {formatDate(post.published_at)}
              </span>
            )}
          </div>
          <div
            className="flex items-center gap-1.5 text-xs font-medium transition-all duration-150 group-hover:gap-2.5"
            style={{ color: 'var(--color-primary)' }}
          >
            Lees meer
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </div>
        </div>
      </div>
    </Link>
  )
}

function BlogCardSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.18)' }}
    >
      <Skeleton variant="rect" style={{ aspectRatio: '16/9', width: '100%' }} />
      <div className="p-6 space-y-3">
        <Skeleton variant="line" width="60px" height="20px" />
        <Skeleton variant="line" width="85%" height="24px" />
        <Skeleton variant="line" width="70%" height="24px" />
        <Skeleton variant="rect" height="60px" />
        <Skeleton variant="line" width="100%" height="1px" />
        <Skeleton variant="line" width="50%" height="16px" />
      </div>
    </div>
  )
}

export default function BlogPage() {
  const { i18n } = useTranslation()
  const lang = i18n.language?.slice(0, 2) || 'nl'
  const [activeTag, setActiveTag] = useState(null)
  const { posts, loading } = useBlogPosts(activeTag)

  // Verzamel alle unieke tags uit gepubliceerde posts
  const allTags = [...new Set(posts.flatMap((p) => p.tags || []))].sort()

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
            ICO Magazine
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
            BLOG &amp; NIEUWS
          </h1>
          <div className="divider-gold mt-4 mb-4" aria-hidden="true" />
          <p
            className="max-w-lg mx-auto text-base"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Tips, nieuws en achter de schermen bij Team ICO — alles over auto detailing en lakbescherming.
          </p>
        </div>
      </div>

      {/* Content */}
      <section
        className="section-padding"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="container-ico">
          {/* Tag filters */}
          {allTags.length > 0 && (
            <div
              className="flex flex-wrap gap-2 mb-10"
              role="group"
              aria-label="Filter op tag"
            >
              <button
                onClick={() => setActiveTag(null)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 cursor-pointer"
                style={
                  activeTag === null
                    ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }
                    : { backgroundColor: 'rgba(196,130,111,0.08)', color: 'var(--color-text-secondary)', border: '1px solid rgba(196,130,111,0.2)' }
                }
              >
                Alle
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 cursor-pointer capitalize"
                  style={
                    activeTag === tag
                      ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }
                      : { backgroundColor: 'rgba(196,130,111,0.08)', color: 'var(--color-text-secondary)', border: '1px solid rgba(196,130,111,0.2)' }
                  }
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => <BlogCardSkeleton key={i} />)}
            </div>
          ) : posts.length === 0 ? (
            <div
              className="flex flex-col items-center gap-4 py-20 rounded-2xl text-center"
              style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.15)' }}
            >
              <BookOpen
                className="w-12 h-12"
                style={{ color: 'var(--color-text-muted)' }}
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {activeTag ? `Geen artikels gevonden voor "${activeTag}"` : 'Nog geen artikels gepubliceerd'}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                  Kom binnenkort terug — we zijn druk aan het schrijven!
                </p>
              </div>
              {activeTag && (
                <button
                  onClick={() => setActiveTag(null)}
                  className="text-sm font-medium cursor-pointer"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Toon alle artikels
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop grid */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} lang={lang} />
                ))}
              </div>

              {/* Mobile — horizontaal scroll */}
              <div
                className="sm:hidden -mx-4 overflow-x-auto snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', scrollPaddingInline: '1.5rem' }}
              >
                <div className="flex gap-4 px-4" role="list" aria-label="Blog artikels">
                  {posts.map((post) => (
                    <div key={post.id} className="snap-start flex-shrink-0 w-[calc(100vw-3rem)]" role="listitem">
                      <BlogCard post={post} lang={lang} />
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
