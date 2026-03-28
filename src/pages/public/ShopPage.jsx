import { useState } from 'react'
import { ShoppingBag } from '@/lib/icons'
import { useProducts } from '@/hooks/useProducts'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import ProductCard from '@/components/shop/ProductCard'
import { SkeletonCard } from '@/components/ui/Skeleton'
import CTASection from '@/components/home/CTASection'

const ALL_CATEGORIES = [{ value: '', label_nl: 'Alles' }, ...PRODUCT_CATEGORIES]

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('')
  const { products, loading } = useProducts({ category: activeCategory || null })

  return (
    <>
      {/* Hero */}
      <div
        className="relative py-14 md:py-20 border-b overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, var(--color-secondary) 0%, var(--color-surface) 100%)',
          borderColor: 'rgba(196,130,111,0.15)',
        }}
      >
        {/* Grid patroon */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, var(--color-primary) 0, var(--color-primary) 1px, transparent 1px, transparent 64px),' +
              'repeating-linear-gradient(90deg, var(--color-primary) 0, var(--color-primary) 1px, transparent 1px, transparent 64px)',
          }}
        />
        <div className="container-ico relative z-10 text-center">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--color-primary)' }}
          >
            CleanTech Producten
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
              color: 'var(--color-text-primary)',
              letterSpacing: '0.03em',
              lineHeight: 1,
            }}
          >
            ONZE SHOP
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-base" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            Premium auto-verzorgingsproducten van het merk CleanTech — dezelfde producten die wij gebruiken bij elke wasbeurt.
          </p>
        </div>
      </div>

      <section className="section-padding" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container-ico">

          {/* Categorie filters */}
          <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Categorie filter">
            {ALL_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.value
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  aria-pressed={isActive}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                  style={
                    isActive
                      ? {
                          backgroundColor: 'var(--color-primary)',
                          color: 'var(--color-text-inverse)',
                        }
                      : {
                          backgroundColor: 'var(--color-surface-elevated)',
                          color: 'var(--color-text-secondary)',
                          border: '1px solid rgba(196,130,111,0.2)',
                        }
                  }
                >
                  {cat.label_nl}
                </button>
              )
            })}
          </div>

          {/* Product grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
              <p className="text-base font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Geen producten gevonden in deze categorie.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop grid */}
              <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Mobile — horizontaal scroll */}
              <div
                className="sm:hidden -mx-4 overflow-x-auto snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', scrollPaddingInline: '1.5rem' }}
              >
                <div className="flex gap-4 px-4" role="list" aria-label="Producten">
                  {products.map((product) => (
                    <div key={product.id} className="snap-start flex-shrink-0 w-[calc(100vw-3rem)]" role="listitem">
                      <ProductCard product={product} />
                    </div>
                  ))}
                  <div className="flex-shrink-0 w-1" aria-hidden="true" />
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <CTASection />
    </>
  )
}
