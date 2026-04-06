'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/lib/i18n/language-context'
import { Heart, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface WishlistItem {
  id: string
  created_at: string
  products: {
    id: string
    name: string
    slug: string
    price: number
    images: string[]
    brand: string
    stock: number
  } | null
}

interface WishlistContentProps {
  wishlistItems: WishlistItem[]
}

export function WishlistContent({ wishlistItems }: WishlistContentProps) {
  const { locale } = useLanguage()
  const router = useRouter()
  const [removing, setRemoving] = useState<string | null>(null)

  const content = locale === 'en' ? {
    title: 'My Wishlist',
    subtitle: 'Phones you saved for later',
    empty: 'Your wishlist is empty',
    emptyText: 'Start browsing phones and add them to your wishlist',
    browsePhones: 'Browse Phones',
    remove: 'Remove',
    buyNow: 'Buy Now',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
  } : {
    title: 'Wishlist Yangu',
    subtitle: 'Simu ulizohifadhi kwa baadaye',
    empty: 'Wishlist yako haina chochote',
    emptyText: 'Anza kutazama simu na uziongeze kwenye wishlist yako',
    browsePhones: 'Angalia Simu',
    remove: 'Ondoa',
    buyNow: 'Nunua Sasa',
    inStock: 'Inapatikana',
    outOfStock: 'Haipatikani',
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleRemove = async (wishlistId: string) => {
    setRemoving(wishlistId)
    const supabase = createClient()
    await supabase.from('wishlist').delete().eq('id', wishlistId)
    router.refresh()
    setRemoving(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{content.title}</h1>
        <p className="text-muted-foreground">{content.subtitle}</p>
      </div>

      {wishlistItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">{content.empty}</h3>
            <p className="mb-6 text-center text-sm text-muted-foreground">{content.emptyText}</p>
            <Button asChild>
              <Link href="/shop">
                <ShoppingBag className="mr-2 h-4 w-4" />
                {content.browsePhones}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlistItems.map((item) => {
            if (!item.products) return null
            const product = item.products
            return (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative aspect-square bg-muted">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="mb-1 font-semibold text-foreground hover:text-primary">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="mb-2 font-bold text-primary">{formatPrice(product.price)}</p>
                  <p className={`mb-4 text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? content.inStock : content.outOfStock}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleRemove(item.id)}
                      disabled={removing === item.id}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      {content.remove}
                    </Button>
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={`/products/${product.slug}`}>
                        {content.buyNow}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
