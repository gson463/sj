'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatTZS, type Product } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'
import { Package } from 'lucide-react'

type Props = {
  products: Product[]
}

export function VendorProductsContent({ products }: Props) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('vendor.myProducts')}</h1>
        <p className="text-muted-foreground">{t('vendor.statsProducts')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" aria-hidden />
            {t('vendor.myProducts')}
          </CardTitle>
          <CardDescription>{products.length} listing{products.length !== 1 ? 's' : ''}</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-medium text-foreground">{t('vendor.noProducts')}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t('vendor.noProductsHint')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">{t('vendor.tableProduct')}</th>
                    <th className="pb-2 pr-4 font-medium">{t('vendor.tablePrice')}</th>
                    <th className="pb-2 pr-4 font-medium">{t('vendor.tableStock')}</th>
                    <th className="pb-2 font-medium">{t('vendor.tableStatus')}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-border/60">
                      <td className="py-3 pr-4 font-medium text-foreground">{p.name}</td>
                      <td className="py-3 pr-4">{formatTZS(Number(p.price))}</td>
                      <td className="py-3 pr-4">{p.stock}</td>
                      <td className="py-3">
                        <Badge variant={p.active ? 'default' : 'secondary'}>
                          {p.active ? t('vendor.active') : t('vendor.inactive')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
