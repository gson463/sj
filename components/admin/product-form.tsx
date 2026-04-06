'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Save, Loader2, Plus, X, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'
import { slugify } from '@/lib/slug'
import type { Product, Category, ProductVariant, TaxClass, StockStatus } from '@/lib/types'
import { ProductStockHistory } from '@/components/admin/product-stock-history'

export interface ProductFormProps {
  product?: Product & { category: Category | null }
  categories: Category[]
  /** Marketplace sellers (profiles with role vendor) — for seller_id assignment */
  vendors?: { id: string; full_name: string | null }[]
  tagNames?: string[]
  relatedProductIds?: string[]
  upsellProductIds?: string[]
  variants?: ProductVariant[]
  allProductsForPick?: { id: string; name: string }[]
}

type VariantDraft = {
  title: string
  price: string
  stock: string
  sku: string
}

export function ProductForm({
  product,
  categories,
  vendors = [],
  tagNames = [],
  relatedProductIds = [],
  upsellProductIds = [],
  variants = [],
  allProductsForPick = [],
}: ProductFormProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!product

  const [name, setName] = useState(product?.name || '')
  const [slug, setSlug] = useState(product?.slug || '')
  const [sku, setSku] = useState(product?.sku || '')
  const [barcode, setBarcode] = useState(product?.barcode || '')
  const [description, setDescription] = useState(product?.description || '')
  const [shortDescription, setShortDescription] = useState(product?.short_description || '')
  const [price, setPrice] = useState(product?.price?.toString() || '')
  const [comparePrice, setComparePrice] = useState(product?.compare_price?.toString() || '')
  const [costPrice, setCostPrice] = useState(product?.cost_price?.toString() || '')
  const [minimumPrice, setMinimumPrice] = useState(product?.minimum_price?.toString() || '')
  const [taxClass, setTaxClass] = useState<TaxClass>((product?.tax_class as TaxClass) || 'standard')
  const [categoryId, setCategoryId] = useState(product?.category_id || '')
  const [brand, setBrand] = useState(product?.brand || '')
  const [sellerId, setSellerId] = useState(product?.seller_id || '')
  const [stock, setStock] = useState(product?.stock?.toString() || '0')
  const [lowStockThreshold, setLowStockThreshold] = useState(
    product?.low_stock_threshold?.toString() || '5',
  )
  const [stockStatus, setStockStatus] = useState<StockStatus>(
    (product?.stock_status as StockStatus) || 'in_stock',
  )
  const [sortOrder, setSortOrder] = useState(product?.sort_order?.toString() || '0')
  const [featured, setFeatured] = useState(product?.featured || false)
  const [active, setActive] = useState(product?.active !== false)
  const [images, setImages] = useState<string[]>(
    product?.images?.length ? product.images : [''],
  )
  const [featuredImageIndex, setFeaturedImageIndex] = useState(
    product?.featured_image_index?.toString() || '0',
  )
  const [metaTitle, setMetaTitle] = useState(product?.meta_title || '')
  const [metaDescription, setMetaDescription] = useState(product?.meta_description || '')
  const [ogImage, setOgImage] = useState(product?.og_image || '')
  const [canonicalUrl, setCanonicalUrl] = useState(product?.canonical_url || '')

  const [ram, setRam] = useState((product?.specs as Record<string, string>)?.ram || '')
  const [storage, setStorage] = useState((product?.specs as Record<string, string>)?.storage || '')
  const [battery, setBattery] = useState((product?.specs as Record<string, string>)?.battery || '')
  const [display, setDisplay] = useState((product?.specs as Record<string, string>)?.display || '')
  const [camera, setCamera] = useState((product?.specs as Record<string, string>)?.camera || '')

  const [tagsInput, setTagsInput] = useState(tagNames.join(', '))
  const [relatedIds, setRelatedIds] = useState<string[]>(relatedProductIds)
  const [upsellIds, setUpsellIds] = useState<string[]>(upsellProductIds)

  const [variantDrafts, setVariantDrafts] = useState<VariantDraft[]>([
    { title: '', price: '', stock: '0', sku: '' },
  ])

  const pickOthers = allProductsForPick.filter((p) => !product || p.id !== product.id)

  const toggleRelated = (id: string, checked: boolean) => {
    setRelatedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id),
    )
  }
  const toggleUpsell = (id: string, checked: boolean) => {
    setUpsellIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id),
    )
  }

  const moveImage = (index: number, dir: -1 | 1) => {
    const next = index + dir
    if (next < 0 || next >= images.length) return
    const copy = [...images]
    const t = copy[index]
    copy[index] = copy[next]
    copy[next] = t
    setImages(copy)
  }

  const buildPayload = () => {
    const specs = Object.fromEntries(
      Object.entries({
        ram: ram || undefined,
        storage: storage || undefined,
        battery: battery || undefined,
        display: display || undefined,
        camera: camera || undefined,
      }).filter(([, v]) => v !== undefined),
    )

    const filteredImages = images.filter((img) => img.trim() !== '')
    const slugOut = (slug.trim() ? slugify(slug) : slugify(name)) || 'product'

    return {
      name,
      slug: slugOut,
      sku: sku.trim() || null,
      barcode: barcode.trim() || null,
      description: description || null,
      short_description: shortDescription || null,
      price: parseFloat(price),
      compare_price: comparePrice ? parseFloat(comparePrice) : null,
      cost_price: costPrice ? parseFloat(costPrice) : null,
      minimum_price: minimumPrice ? parseFloat(minimumPrice) : null,
      tax_class: taxClass,
      category_id: categoryId || null,
      brand: brand || null,
      stock: parseInt(stock, 10) || 0,
      low_stock_threshold: parseInt(lowStockThreshold, 10) || 5,
      stock_status: stockStatus,
      sort_order: parseInt(sortOrder, 10) || 0,
      specs,
      images: filteredImages,
      featured,
      active,
      featured_image_index: Math.min(
        filteredImages.length - 1,
        Math.max(0, parseInt(featuredImageIndex, 10) || 0),
      ),
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      og_image: ogImage || null,
      canonical_url: canonicalUrl || null,
      tag_names: tagsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      related_product_ids: relatedIds,
      upsell_product_ids: upsellIds,
      seller_id: sellerId || null,
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const payload = buildPayload() as Record<string, unknown>

    if (!isEditing) {
      const vRows = variantDrafts.filter(
        (v) => v.title.trim() && v.price !== '',
      )
      if (vRows.length > 0) {
        payload.variants = vRows.map((v) => ({
          title: v.title.trim(),
          price: parseFloat(v.price),
          stock: parseInt(v.stock, 10) || 0,
          sku: v.sku.trim() || null,
          attributes: {},
          images: [],
          sort_order: 0,
          active: true,
        }))
      }
    }

    try {
      const url = isEditing ? `/api/admin/products/${product!.id}` : '/api/admin/products'
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save product')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const addImageField = () => setImages([...images, ''])
  const removeImageField = (index: number) => setImages(images.filter((_, i) => i !== index))
  const updateImage = (index: number, value: string) => {
    const next = [...images]
    next[index] = value
    setImages(next)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? t('adminProducts.editProduct') : t('adminProducts.addProduct')}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? t('adminProducts.editProductDesc') : t('adminProducts.addProductDesc')}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4 flex h-auto flex-wrap gap-1">
            <TabsTrigger value="general">{t('adminProducts.tabGeneral')}</TabsTrigger>
            <TabsTrigger value="pricing">{t('adminProducts.tabPricing')}</TabsTrigger>
            <TabsTrigger value="inventory">{t('adminProducts.tabInventory')}</TabsTrigger>
            <TabsTrigger value="seo">{t('adminProducts.tabSeo')}</TabsTrigger>
            <TabsTrigger value="specs">{t('adminProducts.specifications')}</TabsTrigger>
            <TabsTrigger value="variants">{t('adminProducts.tabVariants')}</TabsTrigger>
            <TabsTrigger value="related">{t('adminProducts.tabRelated')}</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('adminProducts.basicInfo')}</CardTitle>
                  <CardDescription>{t('adminProducts.basicInfoDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('adminProducts.productName')} *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">{t('adminProducts.slug')}</Label>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="auto from name if empty"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sku">{t('adminProducts.sku')}</Label>
                      <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="barcode">{t('adminProducts.barcode')}</Label>
                      <Input id="barcode" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">{t('adminProducts.brand')}</Label>
                    <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('adminProducts.sellerListing')}</Label>
                    <Select value={sellerId || '__none'} onValueChange={(v) => setSellerId(v === '__none' ? '' : v)}>
                      <SelectTrigger id="seller_id">
                        <SelectValue placeholder={t('adminProducts.platformListing')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">{t('adminProducts.platformListing')}</SelectItem>
                        {vendors.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.full_name?.trim() || a.id.slice(0, 8)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">{t('adminProducts.sellerListingHint')}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('adminProducts.category')}</Label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('adminProducts.selectCategory')} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">{t('adminProducts.shortDescription')}</Label>
                    <Textarea
                      id="shortDescription"
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">{t('adminProducts.description')}</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">{t('adminProducts.tags')}</Label>
                    <Input
                      id="tags"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder={t('adminProducts.tagsPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sortOrder">{t('adminProducts.sortOrder')}</Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <Label htmlFor="featured">{t('adminProducts.featured')}</Label>
                      <p className="text-sm text-muted-foreground">{t('adminProducts.featuredHint')}</p>
                    </div>
                    <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <Label htmlFor="active">{t('adminProducts.activeStatus')}</Label>
                      <p className="text-sm text-muted-foreground">{t('adminProducts.activeHint')}</p>
                    </div>
                    <Switch id="active" checked={active} onCheckedChange={setActive} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <Card className="max-w-xl">
              <CardHeader>
                <CardTitle>{t('adminProducts.pricingStock')}</CardTitle>
                <CardDescription>{t('adminProducts.pricingExtendedDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">{t('adminProducts.price')} (TZS) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comparePrice">{t('adminProducts.comparePrice')} (TZS)</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    value={comparePrice}
                    onChange={(e) => setComparePrice(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">{t('adminProducts.comparePriceHint')}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costPrice">{t('adminProducts.costPrice')}</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimumPrice">{t('adminProducts.minimumPrice')}</Label>
                  <Input
                    id="minimumPrice"
                    type="number"
                    value={minimumPrice}
                    onChange={(e) => setMinimumPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('adminProducts.taxClass')}</Label>
                  <Select value={taxClass} onValueChange={(v) => setTaxClass(v as TaxClass)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (VAT)</SelectItem>
                      <SelectItem value="exempt">Exempt</SelectItem>
                      <SelectItem value="zero">Zero-rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <Card className="max-w-xl">
              <CardHeader>
                <CardTitle>{t('adminProducts.inventory')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">{t('adminProducts.stock')}</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowStock">{t('adminProducts.lowStockThreshold')}</Label>
                  <Input
                    id="lowStock"
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('adminProducts.stockStatus')}</Label>
                  <Select value={stockStatus} onValueChange={(v) => setStockStatus(v as StockStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_stock">{t('adminProducts.stockInStock')}</SelectItem>
                      <SelectItem value="out_of_stock">{t('adminProducts.stockOut')}</SelectItem>
                      <SelectItem value="on_backorder">{t('adminProducts.stockBackorder')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            {isEditing && product && (
              <Card className="max-w-xl">
                <CardHeader>
                  <CardTitle>{t('adminProducts.stockHistory')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductStockHistory productId={product.id} />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('adminProducts.seo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">{t('adminProducts.metaTitle')}</Label>
                    <Input id="metaTitle" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">{t('adminProducts.metaDescription')}</Label>
                    <Textarea
                      id="metaDescription"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ogImage">{t('adminProducts.ogImage')}</Label>
                    <Input id="ogImage" value={ogImage} onChange={(e) => setOgImage(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="canonicalUrl">{t('adminProducts.canonicalUrl')}</Label>
                    <Input
                      id="canonicalUrl"
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t('adminProducts.images')}</CardTitle>
                  <CardDescription>{t('adminProducts.imagesDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {images.map((img, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={img}
                        onChange={(e) => updateImage(index, e.target.value)}
                        placeholder="https://..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => moveImage(index, -1)}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => moveImage(index, 1)}
                        disabled={index === images.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      {images.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeImageField(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addImageField}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('adminProducts.addImage')}
                  </Button>
                  <div className="space-y-2">
                    <Label htmlFor="featuredImageIndex">{t('adminProducts.featuredImageIndex')}</Label>
                    <Input
                      id="featuredImageIndex"
                      type="number"
                      min={0}
                      value={featuredImageIndex}
                      onChange={(e) => setFeaturedImageIndex(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="specs">
            <Card className="max-w-xl">
              <CardHeader>
                <CardTitle>{t('adminProducts.specifications')}</CardTitle>
                <CardDescription>{t('adminProducts.specificationsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ram">RAM</Label>
                  <Input id="ram" value={ram} onChange={(e) => setRam(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storage">{t('products.storage')}</Label>
                  <Input id="storage" value={storage} onChange={(e) => setStorage(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="battery">{t('products.battery')}</Label>
                  <Input id="battery" value={battery} onChange={(e) => setBattery(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display">{t('products.display')}</Label>
                  <Input id="display" value={display} onChange={(e) => setDisplay(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="camera">{t('products.camera')}</Label>
                  <Input id="camera" value={camera} onChange={(e) => setCamera(e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="variants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('adminProducts.tabVariants')}</CardTitle>
                <CardDescription>{t('adminProducts.variantsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isEditing && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{t('adminProducts.variantsNewHint')}</p>
                    {variantDrafts.map((row, i) => (
                      <div
                        key={i}
                        className="grid gap-2 rounded-lg border p-3 sm:grid-cols-2 lg:grid-cols-4"
                      >
                        <Input
                          placeholder={t('adminProducts.variantTitle')}
                          value={row.title}
                          onChange={(e) => {
                            const next = [...variantDrafts]
                            next[i] = { ...next[i], title: e.target.value }
                            setVariantDrafts(next)
                          }}
                        />
                        <Input
                          placeholder="Price"
                          type="number"
                          value={row.price}
                          onChange={(e) => {
                            const next = [...variantDrafts]
                            next[i] = { ...next[i], price: e.target.value }
                            setVariantDrafts(next)
                          }}
                        />
                        <Input
                          placeholder="Stock"
                          type="number"
                          value={row.stock}
                          onChange={(e) => {
                            const next = [...variantDrafts]
                            next[i] = { ...next[i], stock: e.target.value }
                            setVariantDrafts(next)
                          }}
                        />
                        <Input
                          placeholder="SKU"
                          value={row.sku}
                          onChange={(e) => {
                            const next = [...variantDrafts]
                            next[i] = { ...next[i], sku: e.target.value }
                            setVariantDrafts(next)
                          }}
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setVariantDrafts([
                          ...variantDrafts,
                          { title: '', price: '', stock: '0', sku: '' },
                        ])
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {t('adminProducts.addVariantRow')}
                    </Button>
                  </div>
                )}
                {isEditing && product && (
                  <VariantManager productId={product.id} initialVariants={variants} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="related">
            <Card>
              <CardHeader>
                <CardTitle>{t('adminProducts.tabRelated')}</CardTitle>
                <CardDescription>{t('adminProducts.relatedDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-8 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-medium">{t('adminProducts.relatedProducts')}</h4>
                  <div className="max-h-56 space-y-2 overflow-y-auto rounded-md border p-2">
                    {pickOthers.length === 0 ? (
                      <p className="text-sm text-muted-foreground">—</p>
                    ) : (
                      pickOthers.map((p) => (
                        <label
                          key={p.id}
                          className="flex cursor-pointer items-center gap-2 text-sm"
                        >
                          <Checkbox
                            checked={relatedIds.includes(p.id)}
                            onCheckedChange={(c) => toggleRelated(p.id, c === true)}
                          />
                          <span className="truncate">{p.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 font-medium">{t('adminProducts.upsellProducts')}</h4>
                  <div className="max-h-56 space-y-2 overflow-y-auto rounded-md border p-2">
                    {pickOthers.length === 0 ? (
                      <p className="text-sm text-muted-foreground">—</p>
                    ) : (
                      pickOthers.map((p) => (
                        <label
                          key={p.id}
                          className="flex cursor-pointer items-center gap-2 text-sm"
                        >
                          <Checkbox
                            checked={upsellIds.includes(p.id)}
                            onCheckedChange={(c) => toggleUpsell(p.id, c === true)}
                          />
                          <span className="truncate">{p.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/products">{t('common.cancel')}</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('common.saving')}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? t('adminProducts.updateProduct') : t('adminProducts.createProduct')}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

function VariantManager({
  productId,
  initialVariants,
}: {
  productId: string
  initialVariants: ProductVariant[]
}) {
  const { t } = useLanguage()
  const router = useRouter()
  const [rows, setRows] = useState<ProductVariant[]>(initialVariants)
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    setRows(initialVariants)
  }, [initialVariants])

  const refresh = () => {
    router.refresh()
    fetch(`/api/admin/products/${productId}/variants`)
      .then((r) => r.json())
      .then((d) => setRows(d.variants || []))
  }

  const remove = async (vid: string) => {
    setLoading(vid)
    await fetch(`/api/admin/products/${productId}/variants/${vid}`, { method: 'DELETE' })
    setLoading(null)
    refresh()
  }

  const [draft, setDraft] = useState({
    title: '',
    price: '',
    stock: '0',
    sku: '',
  })

  const addVariant = async () => {
    if (!draft.title.trim() || draft.price === '') return
    setLoading('new')
    await fetch(`/api/admin/products/${productId}/variants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: draft.title.trim(),
        price: parseFloat(draft.price),
        stock: parseInt(draft.stock, 10) || 0,
        sku: draft.sku.trim() || null,
        attributes: {},
        images: [],
      }),
    })
    setLoading(null)
    setDraft({ title: '', price: '', stock: '0', sku: '' })
    refresh()
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2 rounded-lg border p-3 sm:grid-cols-2 lg:grid-cols-5">
        <Input
          placeholder={t('adminProducts.variantTitle')}
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Price"
          value={draft.price}
          onChange={(e) => setDraft({ ...draft, price: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Stock"
          value={draft.stock}
          onChange={(e) => setDraft({ ...draft, stock: e.target.value })}
        />
        <Input
          placeholder="SKU"
          value={draft.sku}
          onChange={(e) => setDraft({ ...draft, sku: e.target.value })}
        />
        <Button type="button" onClick={addVariant} disabled={loading === 'new'}>
          {t('adminProducts.addVariant')}
        </Button>
      </div>
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="p-2">Title</th>
              <th className="p-2">SKU</th>
              <th className="p-2">Price</th>
              <th className="p-2">Stock</th>
              <th className="p-2 w-24" />
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => (
              <tr key={v.id} className="border-b">
                <td className="p-2">{v.title}</td>
                <td className="p-2">{v.sku || '—'}</td>
                <td className="p-2">{v.price}</td>
                <td className="p-2">{v.stock}</td>
                <td className="p-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(v.id)}
                    disabled={loading === v.id}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
