import { useState } from 'react'
import { ShoppingBag } from '@/lib/icons'
import { useProducts } from '@/hooks/useProducts'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import ProductCard from '@/components/shop/ProductCard'
import { SkeletonCard } from '@/components/ui/Skeleton'
import CTASection from '@/components/home/CTASection'
import PageHero from '@/components/ui/PageHero'

const ALL_CATEGORIES = [{ value: '', label_nl: 'Alles' }, ...PRODUCT_CATEGORIES]

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('')
  const { products, loading } = useProducts({ category: activeCategory || null })

  return (
    <>
      <PageHero
        label="CleanTech producten"
        title="Shop voor"
        titleAccent="vakwerk."
        subtitle="Een compacte selectie producten die Rico en Nico zelf gebruiken: droogdoeken, coatings, reinigers en accessoires zonder winkelrek-ruis."
        image="/images/ceramixmax.jpg"
        align="left"
      />

      <section className="section-padding bg-[var(--ink-050)]">
        <div className="container-ico">
          <div className="mb-10 flex flex-col gap-5 border-b border-[var(--color-border)] pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="edit-sec-num">CleanTech / selectie</p>
              <h2 className="mt-3 font-display text-4xl text-[var(--bone-000)]">
                Producten die wij zelf durven gebruiken.
              </h2>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Categorie filter">
              {ALL_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.value
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setActiveCategory(cat.value)}
                    aria-pressed={isActive}
                    className={`filter-chip ${isActive ? 'is-active' : ''}`}
                  >
                    {cat.label_nl}
                  </button>
                )
              })}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="ico-panel flex flex-col items-center gap-4 py-20 text-center">
              <ShoppingBag className="h-12 w-12 text-[var(--bone-300)]" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-[var(--bone-000)]">Geen producten gevonden</p>
                <p className="mt-1 text-sm text-[var(--bone-300)]">Kies een andere categorie of bekijk later opnieuw.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>

              <div className="sm:hidden -mx-4 overflow-x-auto snap-x snap-mandatory" style={{ scrollbarWidth: 'none', scrollPaddingInline: '1.5rem' }}>
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
