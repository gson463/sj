'use client'

import { useCallback, useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/lib/i18n/language-context'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const KEYS = ['mpesa', 'tigopesa', 'airtelmoney', 'halopesa', 'bank', 'card'] as const

export function AdminPaymentGatewaysContent() {
  const { t } = useLanguage()
  const [gateways, setGateways] = useState<Record<string, { enabled?: boolean; label?: string; notes?: string }>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setError(null)
    const res = await fetch('/api/admin/store-config')
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Could not load settings')
      return
    }
    setGateways((data.payment_gateways || {}) as typeof gateways)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function save() {
    setSaving(true)
    setError(null)
    const res = await fetch('/api/admin/store-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_gateways: gateways }),
    })
    const data = await res.json()
    if (!res.ok) setError(data.error || 'Save failed')
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('admin.placeholders.paymentGateways.title')}</h1>
          <p className="text-muted-foreground">{t('admin.placeholders.paymentGateways.body')}</p>
        </div>
        <Button onClick={save} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {KEYS.map((key) => {
          const g = gateways[key] || { enabled: false, label: key, notes: '' }
          return (
            <Card key={key}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base capitalize">{g.label || key}</CardTitle>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`sw-${key}`} className="text-muted-foreground text-sm">
                    Enabled
                  </Label>
                  <Switch
                    id={`sw-${key}`}
                    checked={!!g.enabled}
                    onCheckedChange={(checked) =>
                      setGateways((prev) => ({
                        ...prev,
                        [key]: { ...g, enabled: checked },
                      }))
                    }
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2">
                  <Label>Display label</Label>
                  <Input
                    value={g.label || ''}
                    onChange={(e) =>
                      setGateways((prev) => ({
                        ...prev,
                        [key]: { ...g, label: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Internal notes</Label>
                  <Input
                    value={g.notes || ''}
                    placeholder="e.g. Settlement account, API ref"
                    onChange={(e) =>
                      setGateways((prev) => ({
                        ...prev,
                        [key]: { ...g, notes: e.target.value },
                      }))
                    }
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  Checkout integration can read enabled flags from this config.
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
