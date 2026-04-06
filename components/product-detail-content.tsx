"use client"

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Heart, Share2, Truck, ShieldCheck, RefreshCw, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type Product, formatTZS } from '@/lib/types'
import { BuyOptions } from '@/components/buy-options'
import { useLanguage } from '@/lib/i18n/language-context'

interface ProductDetailContentProps {
  product: Product & { category: { name: string; slug: string } | null }
  relatedProducts: Product[]
}

export function ProductDetailContent({ product, relatedProducts }: ProductDetailContentProps) {
  const { t } = useLanguage()
  
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        <Link href="/shop" className="flex shrink-0 items-center gap-1 hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          {t('products.backToShop')}
        </Link>
        {product.category && (
          <>
            <span className="shrink-0">/</span>
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="min-w-0 max-w-[40vw] truncate hover:text-foreground sm:max-w-none"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span className="shrink-0">/</span>
        <span className="min-w-0 max-w-full truncate text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            {discount > 0 && (
              <Badge variant="destructive" className="absolute left-4 top-4 z-10">
                -{discount}%
              </Badge>
            )}
            <Image
              src={product.images[0] || '/placeholder.svg'}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`${t('products.viewImage')} ${index + 1}: ${product.name}`}
                  title={`${t('products.viewImage')} ${index + 1}`}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 border-transparent hover:border-primary"
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand & Name */}
          <div>
            {product.brand && (
              <p className="mb-1 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                {product.brand}
              </p>
            )}
            <h1 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              {product.name}
            </h1>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                {formatTZS(product.price)}
              </span>
              {product.compare_price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatTZS(product.compare_price)}
                </span>
              )}
            </div>
            
            {/* Lipa Kidogo Highlight */}
            <div className="rounded-lg bg-primary/10 p-4">
              <div className="flex items-center gap-2 text-primary">
                <Zap className="h-5 w-5" />
                <span className="font-semibold">{t('buy.lipaKidogo')}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("products.startFrom")} {formatTZS(Math.round(product.price * 0.1))} {t("products.only")} (10%)
              </p>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm text-green-600">
                  {t("products.available")} ({product.stock} {t("products.remaining")})
                </span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-sm text-red-600">{t("products.notAvailable")}</span>
              </>
            )}
          </div>

          {/* Buy Options */}
          <BuyOptions product={product} />

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="icon">
              <Heart className="h-5 w-5" />
              <span className="sr-only">{t("products.addToWishlistSr")}</span>
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-5 w-5" />
              <span className="sr-only">{t("products.share")}</span>
            </Button>
          </div>

          {/* Features */}
          <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">{t("products.delivery")}</p>
                <p className="text-xs text-muted-foreground">{t("products.allTanzania")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">{t("products.warranty")}</p>
                <p className="text-xs text-muted-foreground">12 {t("products.months")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">{t("products.returns")}</p>
                <p className="text-xs text-muted-foreground">7 {t("products.days")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12 min-w-0">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="h-auto w-full max-w-full flex-wrap justify-start gap-1 overflow-x-auto sm:w-fit sm:flex-nowrap">
            <TabsTrigger value="description" className="shrink-0">
              {t("products.description")}
            </TabsTrigger>
            <TabsTrigger value="specs" className="shrink-0">
              {t("products.specs")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <div className="prose prose-neutral max-w-none">
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          </TabsContent>
          <TabsContent value="specs" className="mt-4">
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[280px] text-sm sm:text-base">
                <tbody>
                  {Object.entries(product.specs || {}).map(([key, value]) => (
                    <tr key={key} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium text-foreground capitalize">{key}</td>
                      <td className="px-4 py-3 text-muted-foreground">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-foreground">{t("products.relatedProducts")}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relProduct) => (
              <Link
                key={relProduct.id}
                href={`/products/${relProduct.slug}`}
                className="group rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                  <Image
                    src={relProduct.images[0] || '/placeholder.svg'}
                    alt={relProduct.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <h3 className="mt-3 font-medium text-foreground">{relProduct.name}</h3>
                <p className="mt-1 font-semibold text-primary">{formatTZS(relProduct.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
