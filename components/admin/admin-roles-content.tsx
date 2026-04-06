'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/lib/i18n/language-context'

const MATRIX: { role: string; label: string; capabilities: string[] }[] = [
  {
    role: 'admin',
    label: 'Administrator',
    capabilities: ['Full catalog & orders', 'Payments & reports', 'CMS & store config', 'User management'],
  },
  {
    role: 'vendor',
    label: 'Vendor',
    capabilities: [
      'Vendor dashboard at /vendor',
      'Listings & orders for products assigned (seller_id)',
      'Notifications & profile settings',
    ],
  },
  {
    role: 'customer',
    label: 'Customer',
    capabilities: ['Shop & Lipa Kidogo', 'Own orders & profile', 'No admin access'],
  },
]

export function AdminRolesContent() {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('admin.placeholders.roles.title')}</h1>
        <p className="text-muted-foreground">{t('admin.placeholders.roles.body')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role model</CardTitle>
          <CardDescription>
            Stored on <code className="rounded bg-muted px-1 py-0.5 text-xs">profiles.role</code>. Expand with a
            dedicated permissions table when you need fine-grained rules.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {MATRIX.map((row) => (
            <div
              key={row.role}
              className="flex flex-col gap-2 rounded-lg border border-border/80 bg-card p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={row.role === 'admin' ? 'default' : 'secondary'}>{row.role}</Badge>
                  <span className="font-semibold">{row.label}</span>
                </div>
                <ul className="text-muted-foreground list-inside list-disc text-sm">
                  {row.capabilities.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
