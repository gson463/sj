'use client'

import { useCallback, useEffect, useState } from 'react'
import { Plus, Save } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useLanguage } from '@/lib/i18n/language-context'

export type TaxRate = {
  id: string
  name: string
  rate_percent: number
  region: string
}

function newId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`
}

export function AdminTaxContent() {
  const { t } = useLanguage()
  const [rates, setRates] = useState<TaxRate[]>([])
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
    const raw = data.tax_rates
    if (Array.isArray(raw)) setRates(raw as TaxRate[])
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function save() {
    setSaving(true)
    await fetch('/api/admin/store-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tax_rates: rates }),
    })
    setSaving(false)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('admin.placeholders.tax.title')}</h1>
          <p className="text-muted-foreground">{t('admin.placeholders.tax.body')}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              setRates((r) => [
                ...r,
                { id: newId(), name: 'VAT', rate_percent: 18, region: 'Tanzania' },
              ])
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add rate
          </Button>
          <Button onClick={save} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Tax rates</CardTitle>
          <CardDescription>Percentages shown to finance; checkout still uses product tax_class today.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {rates.length === 0 && (
            <p className="text-sm text-muted-foreground">No rates yet. Add VAT or exempt regions.</p>
          )}
          {rates.map((row, i) => (
            <div key={row.id} className="grid gap-3 rounded-lg border p-4 md:grid-cols-3">
              <div className="grid gap-2">
                <Label>Label</Label>
                <Input
                  value={row.name}
                  onChange={(e) => {
                    const next = [...rates]
                    next[i] = { ...row, name: e.target.value }
                    setRates(next)
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label>Rate (percent)</Label>
                <Input
                  type="number"
                  value={row.rate_percent}
                  onChange={(e) => {
                    const next = [...rates]
                    next[i] = { ...row, rate_percent: Number(e.target.value) }
                    setRates(next)
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label>Region / note</Label>
                <Input
                  value={row.region}
                  onChange={(e) => {
                    const next = [...rates]
                    next[i] = { ...row, region: e.target.value }
                    setRates(next)
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
