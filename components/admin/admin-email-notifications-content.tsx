'use client'

import { useCallback, useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useLanguage } from '@/lib/i18n/language-context'

const KEYS = ['order_confirmation', 'shipping_update', 'refund_notice'] as const

const LABELS: Record<(typeof KEYS)[number], string> = {
  order_confirmation: 'Order confirmation',
  shipping_update: 'Shipping update',
  refund_notice: 'Refund notice',
}

export function AdminEmailNotificationsContent() {
  const { t } = useLanguage()
  const [templates, setTemplates] = useState<
    Record<string, { subject?: string; body?: string }>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setError(null)
    const res = await fetch('/api/admin/store-config')
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Could not load')
      return
    }
    setTemplates((data.email_templates || {}) as typeof templates)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function save() {
    setSaving(true)
    await fetch('/api/admin/store-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_templates: templates }),
    })
    setSaving(false)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('admin.placeholders.emailNotifications.title')}</h1>
          <p className="text-muted-foreground">{t('admin.placeholders.emailNotifications.body')}</p>
        </div>
        <Button onClick={save} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving…' : 'Save templates'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {KEYS.map((key) => {
          const tpl = templates[key] || { subject: '', body: '' }
          return (
            <Card key={key}>
              <CardHeader>
                <CardTitle>{LABELS[key]}</CardTitle>
                <CardDescription>
                  Placeholders: {'{{name}}'}, {'{{order_id}}'}, {'{{total}}'}, {'{{amount}}'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2">
                  <Label>Subject</Label>
                  <Input
                    value={tpl.subject || ''}
                    onChange={(e) =>
                      setTemplates((prev) => ({
                        ...prev,
                        [key]: { ...tpl, subject: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Body</Label>
                  <Textarea
                    rows={5}
                    value={tpl.body || ''}
                    onChange={(e) =>
                      setTemplates((prev) => ({
                        ...prev,
                        [key]: { ...tpl, body: e.target.value },
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
