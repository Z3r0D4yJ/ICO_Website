import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { ShoppingBag, Plus, Minus, ArrowLeft, CheckCircle2, Truck } from '@/lib/icons'
import { useProduct, useProducts } from '@/hooks/useProducts'
import { useCartStore } from '@/stores/cartStore'
import { useUiStore } from '@/stores/uiStore'
import { formatPrice } from '@/lib/utils'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants'
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
      <div className="container-ico section-padding">
        <Skeleton variant="line" width="200px" height="20px" className="mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton variant="rect" className="rounded-2xl aspect-square" />
          <div><SkeletonText lines={8} /></div>
        </div>
      </div>
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
      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'var(--color-surface-elevated)', borderBottom: '1px solid rgba(196,130,111,0.2)' }}>
        <div className="container-ico">
          <Breadcrumb items={[
            { label: 'Shop', to: '/shop' },
            { label: product.name },
          ]} />
        </div>
      </div>

      <section className="section-padding" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container-ico">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

            {/* Afbeeldingen */}
            <div className="space-y-3">
              <div
                className="rounded-2xl overflow-hidden aspect-square"
                style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
              >
                {images.length > 0 ? (
                  <img
                    src={images[activeImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-20 h-20" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className="w-16 h-16 rounded-lg overflow-hidden cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                      style={{
                        border: idx === activeImage
                          ? '2px solid var(--color-primary)'
                          : '1px solid rgba(196,130,111,0.18)',
                      }}
                      aria-label={`Afbeelding ${idx + 1}`}
                      aria-pressed={idx === activeImage}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="space-y-6">
              {product.category && (
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>
                  {product.category}
                </p>
              )}

              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  color: 'var(--color-text-primary)',
                  letterSpacing: '0.02em',
                  lineHeight: 1.1,
                }}
              >
                {product.name}
              </h1>

              {/* Prijs */}
              <div className="flex items-baseline gap-3">
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.25rem',
                    color: 'var(--color-primary)',
                    lineHeight: 1,
                  }}
                >
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-lg line-through" style={{ color: 'var(--color-text-muted)' }}>
                      {formatPrice(product.compare_at_price)}
                    </span>
                    <span
                      className="text-sm font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--color-error)', color: '#fff' }}
                    >
                      -{discountPct}%
                    </span>
                  </>
                )}
              </div>

              {/* Beschrijving */}
              {product.description_nl && (
                <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                  {product.description_nl}
                </p>
              )}

              {/* Voordelen */}
              <ul className="space-y-2">
                {[
                  'Professionele kwaliteit',
                  'Zelfde product als gebruikt door Team ICO',
                  'Snelle verzending in België',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Gratis verzending melding */}
              <div
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: 'rgba(34,197,94,0.07)',
                  border: '1px solid rgba(34,197,94,0.2)',
                }}
              >
                <Truck className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Gratis verzending bij bestelling vanaf{' '}
                  <strong style={{ color: 'var(--color-text-primary)' }}>{formatPrice(FREE_SHIPPING_THRESHOLD)}</strong>
                </p>
              </div>

              {/* Voorraad */}
              {!inStock ? (
                <p className="text-sm font-medium" style={{ color: 'var(--color-error)' }}>
                  Tijdelijk uitverkocht
                </p>
              ) : (
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Nog {product.stock_quantity} op voorraad
                </p>
              )}

              {/* Aantal + In winkelwagen */}
              {inStock && (
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Quantity stepper */}
                  <div
                    className="flex items-center gap-3 rounded-xl px-4 py-2"
                    style={{
                      backgroundColor: 'var(--color-surface-elevated)',
                      border: '1px solid rgba(196,130,111,0.2)',
                    }}
                  >
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Minder"
                      className="cursor-pointer transition-opacity hover:opacity-70 focus-visible:outline-none"
                      disabled={quantity <= 1}
                      style={{ color: 'var(--color-text-secondary)', opacity: quantity <= 1 ? 0.3 : 1 }}
                    >
                      <Minus className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <span className="w-8 text-center font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                      aria-label="Meer"
                      className="cursor-pointer transition-opacity hover:opacity-70 focus-visible:outline-none"
                      disabled={quantity >= product.stock_quantity}
                      style={{ color: 'var(--color-text-secondary)', opacity: quantity >= product.stock_quantity ? 0.3 : 1 }}
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleAddToCart}
                    leftIcon={<ShoppingBag className="w-4 h-4" />}
                  >
                    In winkelwagen
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gerelateerde producten */}
      {related.length > 0 && (
        <section
          className="section-padding"
          style={{ backgroundColor: 'var(--color-surface-elevated)' }}
        >
          <div className="container-ico">
            <h2
              className="mb-8 text-center"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                color: 'var(--color-text-primary)',
                letterSpacing: '0.03em',
              }}
            >
              GERELATEERDE PRODUCTEN
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
