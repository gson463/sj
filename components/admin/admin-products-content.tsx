'use client'

import { useState, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Plus,
  Edit,
  Eye,
  Trash2,
  Search,
  Loader2,
  Copy,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/lib/i18n/language-context'
import { formatTZS, type Product, type Category } from '@/lib/types'
import type { ProductListFilters } from '@/lib/admin/build-products-query'
import { adminProductsHref } from '@/lib/admin/build-products-query'

interface AdminProductsContentProps {
  products: (Product & { category: Category | null })[]
  categories: Category[]
  brands: string[]
  total: number
  page: number
  limit: number
  totalPages: number
  filters: ProductListFilters
  stats: { totalProducts: number; activeProducts: number }
}

export function AdminProductsContent({
  products: initialProducts,
  categories,
  brands,
  total,
  page,
  limit,
  totalPages,
  filters,
  stats,
}: AdminProductsContentProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)
  const [dupLoading, setDupLoading] = useState<string | null>(null)
  const importRef = useRef<HTMLInputElement>(null)

  const filteredProducts = useMemo(() => {
    const q = filters.q?.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        product.brand?.toLowerCase().includes(q) ||
        (product.sku && product.sku.toLowerCase().includes(q)),
    )
  }, [products, filters.q])

  const toggleSelect = (id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const selectAll = (checked: boolean) => {
    if (checked) {
      setSelected(new Set(filteredProducts.map((p) => p.id)))
    } else {
      setSelected(new Set())
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/products/${deleteId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== deleteId))
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const runBulk = async (action: 'delete' | 'activate' | 'deactivate' | 'feature' | 'unfeature') => {
    const ids = [...selected]
    if (ids.length === 0) return
    setBulkLoading(true)
    try {
      const res = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, action }),
      })
      if (res.ok) {
        setSelected(new Set())
        router.refresh()
      }
    } finally {
      setBulkLoading(false)
    }
  }

  const duplicate = async (id: string) => {
    setDupLoading(id)
    try {
      const res = await fetch(`/api/admin/products/${id}/duplicate`, { method: 'POST' })
      if (res.ok) router.refresh()
    } finally {
      setDupLoading(null)
    }
  }

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const res = await fetch('/api/admin/products/import', {
      method: 'POST',
      headers: { 'Content-Type': 'text/csv' },
      body: text,
    })
    if (res.ok) {
      router.refresh()
    }
    e.target.value = ''
  }

  const lowStockWarning = (p: Product) => {
    const th = p.low_stock_threshold ?? 5
    return p.stock > 0 && p.stock <= th
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.products')}</h1>
          <p className="text-muted-foreground">{t('adminProducts.manageInventory')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/api/admin/products/export" download>
              <Download className="mr-2 h-4 w-4" />
              {t('adminProducts.exportCsv')}
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => importRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {t('adminProducts.importCsv')}
          </Button>
          <input
            ref={importRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            aria-label={t('adminProducts.importCsv')}
            onChange={onImport}
          />
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              {t('adminProducts.addProduct')}
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="py-3">
            <CardDescription>{t('adminProducts.statTotal')}</CardDescription>
            <CardTitle className="text-2xl">{stats.totalProducts}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardDescription>{t('adminProducts.statActive')}</CardDescription>
            <CardTitle className="text-2xl">{stats.activeProducts}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardDescription>{t('adminProducts.statPage')}</CardDescription>
            <CardTitle className="text-2xl">
              {total === 0 ? 0 : (page - 1) * limit + 1}–
              {Math.min(page * limit, total)} / {total}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('adminProducts.filters')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Select
            value={filters.category_id || '__all__'}
            onValueChange={(v) =>
              router.push(
                adminProductsHref(filters, {
                  category_id: v === '__all__' ? undefined : v,
                  page: 1,
                }),
              )
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('adminProducts.category')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">{t('adminProducts.allCategories')}</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.brand || '__all__'}
            onValueChange={(v) =>
              router.push(
                adminProductsHref(filters, {
                  brand: v === '__all__' ? undefined : v,
                  page: 1,
                }),
              )
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">{t('adminProducts.allBrands')}</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={
              filters.featured === undefined
                ? '__all__'
                : filters.featured
                  ? 'true'
                  : 'false'
            }
            onValueChange={(v) =>
              router.push(
                adminProductsHref(filters, {
                  featured:
                    v === '__all__' ? undefined : v === 'true' ? true : false,
                  page: 1,
                }),
              )
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">{t('adminProducts.filterFeaturedAll')}</SelectItem>
              <SelectItem value="true">{t('adminProducts.featured')}</SelectItem>
              <SelectItem value="false">{t('adminProducts.notFeatured')}</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={
              filters.active === undefined ? '__all__' : filters.active ? 'true' : 'false'
            }
            onValueChange={(v) =>
              router.push(
                adminProductsHref(filters, {
                  active: v === '__all__' ? undefined : v === 'true' ? true : false,
                  page: 1,
                }),
              )
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">{t('adminProducts.filterActiveAll')}</SelectItem>
              <SelectItem value="true">{t('adminProducts.active')}</SelectItem>
              <SelectItem value="false">{t('adminProducts.inactive')}</SelectItem>
            </SelectContent>
          </Select>
          <Input
            className="max-w-[100px]"
            type="number"
            placeholder="≤ stock"
            aria-label={t('adminProducts.stockMaxFilter')}
            defaultValue={filters.stock_max ?? ''}
            onBlur={(e) => {
              const v = e.target.value
              router.push(
                adminProductsHref(filters, {
                  stock_max: v ? parseInt(v, 10) : undefined,
                  page: 1,
                }),
              )
            }}
          />
          <Select
            value={filters.sort}
            onValueChange={(sort) =>
              router.push(adminProductsHref(filters, { sort, page: 1 }))
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">{t('adminProducts.sortDate')}</SelectItem>
              <SelectItem value="name">{t('adminProducts.sortName')}</SelectItem>
              <SelectItem value="price">{t('adminProducts.sortPrice')}</SelectItem>
              <SelectItem value="stock">{t('adminProducts.sortStock')}</SelectItem>
              <SelectItem value="sort_order">{t('adminProducts.sortManual')}</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.orderAsc ? 'asc' : 'desc'}
            onValueChange={(order) =>
              router.push(
                adminProductsHref(filters, { orderAsc: order === 'asc', page: 1 }),
              )
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">{t('adminProducts.orderDesc')}</SelectItem>
              <SelectItem value="asc">{t('adminProducts.orderAsc')}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 p-3">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <Button
            size="sm"
            variant="outline"
            disabled={bulkLoading}
            onClick={() => runBulk('activate')}
          >
            {t('adminProducts.bulkActivate')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={bulkLoading}
            onClick={() => runBulk('deactivate')}
          >
            {t('adminProducts.bulkDeactivate')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={bulkLoading}
            onClick={() => runBulk('feature')}
          >
            {t('adminProducts.bulkFeature')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={bulkLoading}
            onClick={() => runBulk('unfeature')}
          >
            {t('adminProducts.bulkUnfeature')}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            disabled={bulkLoading}
            onClick={() => runBulk('delete')}
          >
            {t('adminProducts.bulkDelete')}
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>{t('adminProducts.allProducts')}</CardTitle>
              <CardDescription>
                {filteredProducts.length} {t('adminProducts.productsInInventory')}
              </CardDescription>
            </div>
            <form
              className="relative w-full sm:w-64"
              onSubmit={(e) => {
                e.preventDefault()
                const fd = new FormData(e.currentTarget)
                const q = (fd.get('q') as string) || ''
                router.push(adminProductsHref(filters, { q: q.trim() || undefined, page: 1 }))
              }}
            >
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={filters.q || ''}
                placeholder={t('adminProducts.searchProduct')}
                className="pl-9"
              />
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">{t('adminProducts.noProducts')}</p>
              <Button asChild className="mt-4">
                <Link href="/admin/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('adminProducts.addFirstProduct')}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={
                          filteredProducts.length > 0 &&
                          filteredProducts.every((p) => selected.has(p.id))
                        }
                        onCheckedChange={(c) => selectAll(c === true)}
                      />
                    </TableHead>
                    <TableHead>{t('adminProducts.product')}</TableHead>
                    <TableHead className="hidden md:table-cell">{t('adminProducts.sku')}</TableHead>
                    <TableHead>{t('adminProducts.category')}</TableHead>
                    <TableHead>{t('adminProducts.price')}</TableHead>
                    <TableHead>{t('adminProducts.stock')}</TableHead>
                    <TableHead>{t('adminProducts.status')}</TableHead>
                    <TableHead className="text-right">{t('adminProducts.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selected.has(product.id)}
                          onCheckedChange={(c) => toggleSelect(product.id, c === true)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={product.images?.[0] || '/placeholder.svg'}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.brand}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden max-w-[120px] truncate font-mono text-xs md:table-cell">
                        {product.sku || '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {product.category?.name || t('adminProducts.uncategorized')}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{formatTZS(product.price)}</TableCell>
                      <TableCell>
                        <span
                          className={
                            product.stock <= 0
                              ? 'text-red-600'
                              : lowStockWarning(product)
                                ? 'text-amber-600 font-medium'
                                : 'text-green-600'
                          }
                        >
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.active ? 'default' : 'secondary'}>
                          {product.active ? t('adminProducts.active') : t('adminProducts.inactive')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/products/${product.slug}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            disabled={dupLoading === product.id}
                            onClick={() => duplicate(product.id)}
                            title={t('adminProducts.duplicate')}
                          >
                            {dupLoading === product.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(product.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <Button variant="outline" size="sm" disabled={page <= 1} asChild>
                <Link href={adminProductsHref(filters, { page: page - 1 })}>
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  {t('common.previous')}
                </Link>
              </Button>
              <span className="text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} asChild>
                <Link href={adminProductsHref(filters, { page: page + 1 })}>
                  {t('common.next')}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('adminProducts.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('adminProducts.deleteConfirmDesc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.deleting')}
                </>
              ) : (
                t('common.delete')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
