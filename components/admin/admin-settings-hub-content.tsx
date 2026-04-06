'use client'

import Link from 'next/link'
import { PanelsTopLeft, Package, ShoppingBag, Store } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n/language-context'

export function AdminSettingsHubContent() {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('admin.settingsTitle')}</h1>
        <p className="text-muted-foreground">{t('admin.settingsSubtitle')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PanelsTopLeft className="h-5 w-5" />
              {t('admin.settingsCmsCard')}
            </CardTitle>
            <CardDescription>{t('admin.settingsCmsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/cms">{t('admin.settingsOpenCms')}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Store className="h-5 w-5" />
              {t('admin.settingsStoreCard')}
            </CardTitle>
            <CardDescription>{t('admin.settingsStoreDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild variant="default">
              <Link href="/shop">{t('admin.settingsViewShop')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/products">
                <Package className="mr-2 h-4 w-4" />
                {t('admin.settingsManageProducts')}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/orders">
                <ShoppingBag className="mr-2 h-4 w-4" />
                {t('admin.settingsManageOrders')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <p className="text-sm text-muted-foreground">{t('admin.settingsSupportHint')}</p>
    </div>
  )
}
