import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Minus, Plus, ShoppingBag, Truck } from '@/lib/icons'
import { useProduct, useProducts } from '@/hooks/useProducts'
import { useCartStore } from '@/stores/cartStore'
import { useUiStore } from '@/stores/uiStore'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Button from '@/components/ui/Button'
import Skeleton, { SkeletonText } from '@/components/ui/Skeleton'
import ProductCard from '@/components/shop/ProductCard'

export default function ProductDetailPage() {
  const { productSlug } = useParams()
  const { product, loading, error } = useProduct(productSlug)
  const { products: allProducts } = useProducts()
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useUiStore((s) => s.openCart)
  const showSuccess = useUiStore((s) => s.showSuccess)

  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  if (loading) {
    return (
      <main className="container-ico section-padding">
        <Skeleton variant="line" width="220px" height="20px" className="mb-8" />
        <div className="grid gap-10 lg:grid-cols-2">
          <Skeleton variant="rect" className="aspect-square rounded-[var(--radius-xl)]" />
          <SkeletonText lines={8} />
        </div>
      </main>
    )
  }

  if (error || !product) return <Navigate to="/shop" replace />

  const images = [product.image_url, ...(product.images || [])].filter(Boolean)
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
  const discountPct = hasDiscount
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0
  const inStock = product.stock_quantity > 0
  const related = allProducts.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)

  const handleAddToCart = () => {
    addItem(product, quantity)
    showSuccess(`${product.name} toegevoegd aan winkelwagen.`)
    openCart()
  }

  return (
    <>
      <div className="border-b border-[var(--color-border)] bg-[var(--ink-100)]">
        <div className="container-ico">
          <Breadcrumb items={[{ label: 'Shop', to: '/shop' }, { label: product.name }]} />
        </div>
      </div>

      <main className="section-padding bg-[var(--color-surface)]">
        <div className="container-ico">
          <Link
            to="/shop"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--bone-300)] transition-colors hover:text-[var(--copper-200)]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Terug naar shop
          </Link>

          <section className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-start">
            <div className="space-y-3">
              <div className="ico-media aspect-square overflow-hidden rounded-[var(--radius-xl)] bg-[var(--ink-200)]">
                {images.length > 0 ? (
                  <img
                    src={images[activeImage]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[var(--bone-400)]">
                    <ShoppingBag className="h-20 w-20" aria-hidden="true" />
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Productafbeeldingen">
                  {images.map((img, idx) => (
                    <button
                      key={`${img}-${idx}`}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      aria-label={`Afbeelding ${idx + 1}`}
                      aria-pressed={idx === activeImage}
                      className={[
                        'h-20 w-20 flex-shrink-0 overflow-hidden rounded-[var(--radius-md)] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(216,158,140,0.45)]',
                        idx === activeImage ? 'border-[var(--copper-300)]' : 'border-[var(--color-border)] hover:border-[rgba(184,111,92,0.45)]',
                      ].join(' ')}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <aside className="ico-panel p-5 sm:p-7 lg:sticky lg:top-28">
              <p className="edit-eyebrow">{product.category || 'CleanTech selectie'}</p>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] text-[var(--bone-000)] sm:text-5xl">
                {product.name}
              </h1>

              <div className="mt-6 flex flex-wrap items-end gap-3">
                <p className="font-display text-4xl leading-none text-[var(--copper-200)]">
                  {formatPrice(product.price)}
                </p>
                {hasDiscount && (
                  <>
                    <p className="text-base line-through text-[var(--bone-400)]">{formatPrice(product.compare_at_price)}</p>
                    <span className="rounded-[var(--radius-sm)] bg-[var(--signal-stop)] px-2.5 py-1 font-mono text-xs font-semibold text-[var(--bone-000)]">
                      -{discountPct}%
                    </span>
                  </>
                )}
              </div>

              {product.description_nl && (
                <p className="mt-6 text-base leading-relaxed text-[var(--bone-200)]">
                  {product.description_nl}
                </p>
              )}

              <ul className="mt-6 grid gap-3 text-sm text-[var(--bone-200)]">
                {[
                  'Professionele kwaliteit, gekozen uit dagelijks gebruik',
                  'Geschikt voor zorgvuldig onderhoud tussen behandelingen',
                  'Persoonlijke selectie van Rico & Nico',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--signal-go)]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-[var(--radius-lg)] border border-[rgba(123,174,130,0.25)] bg-[rgba(123,174,130,0.08)] p-4">
                <div className="flex gap-3 text-sm leading-relaxed text-[var(--bone-200)]">
                  <Truck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--signal-go)]" aria-hidden="true" />
                  <p>
                    Gratis verzending vanaf <strong className="text-[var(--bone-000)]">{formatPrice(FREE_SHIPPING_THRESHOLD)}</strong>.
                    Bestellingen worden met zorg verpakt.
                  </p>
                </div>
              </div>

              <p className={['mt-5 text-sm', inStock ? 'text-[var(--bone-300)]' : 'text-[var(--signal-stop)]'].join(' ')}>
                {inStock ? `Nog ${product.stock_quantity} op voorraad` : 'Tijdelijk uitverkocht'}
              </p>

              {inStock && (
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <div className="flex w-full items-center justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[rgba(250,246,241,0.035)] sm:w-36">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Minder"
                      className="flex h-12 w-12 items-center justify-center text-[var(--bone-300)] transition-colors hover:text-[var(--copper-200)] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(216,158,140,0.45)]"
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <span className="font-mono text-sm text-[var(--bone-000)]">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Meer"
                      className="flex h-12 w-12 items-center justify-center text-[var(--bone-300)] transition-colors hover:text-[var(--copper-200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(216,158,140,0.45)]"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    leftIcon={<ShoppingBag className="h-4 w-4" />}
                  >
                    In winkelwagen
                  </Button>
                </div>
              )}
            </aside>
          </section>

          <section className="mt-16 grid gap-4 md:grid-cols-3">
            {[
              ['Gebruik', 'Breng aan op een koele ondergrond en werk in kleine zones voor de meeste controle.'],
              ['Onderhoud', 'Combineer met zachte microvezel en vermijd agressieve reinigers.'],
              ['Advies', 'Twijfel je over toepassing? Stuur Rico & Nico even een foto via WhatsApp.'],
            ].map(([title, text]) => (
              <div key={title} className="ico-panel p-5">
                <p className="edit-eyebrow">{title}</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--bone-300)]">{text}</p>
              </div>
            ))}
          </section>
        </div>
      </main>

      {related.length > 0 && (
        <section className="section-padding bg-[var(--ink-100)]">
          <div className="container-ico">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="edit-eyebrow">Ook interessant</p>
                <h2 className="edit-sec-title mt-3">Meer uit dezelfde selectie</h2>
              </div>
              <Button as={Link} to="/shop" variant="secondary">
                Bekijk alles
              </Button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
