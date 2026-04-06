'use client'

import { Smartphone, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/lib/i18n/language-context'

const CHECKLIST = [
  'Sidebar and tables scroll horizontally on small screens.',
  'Touch targets are at least 44px for primary actions.',
  'Language switcher persists in the admin header.',
  'Use the mobile menu (hamburger) for full navigation on phones.',
]

export function AdminMobileSettingsContent() {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('admin.placeholders.mobile.title')}</h1>
        <p className="text-muted-foreground">{t('admin.placeholders.mobile.body')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Responsive admin
          </CardTitle>
          <CardDescription>
            This admin is built mobile-first: layouts reflow, navigation moves to a sheet, and data tables
            stay scrollable.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {CHECKLIST.map((item) => (
            <div key={item} className="flex gap-3 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{item}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
