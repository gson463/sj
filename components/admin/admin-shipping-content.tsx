'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Plus, Save } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLanguage } from '@/lib/i18n/language-context'

export type ShipZone = {
  id: string
  name: string
  regions: string
  flat_rate_tzs: number
  free_above_tzs: number | null
}

export type ShipMethod = {
  id: string
  title: string
  kind: 'flat' | 'pickup' | 'free'
  note: string
}

function newId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`
}

interface Props {
  initialTab: 'zones' | 'methods'
}

export function AdminShippingContent({ initialTab }: Props) {
  const { t } = useLanguage()
  const [zones, setZones] = useState<ShipZone[]>([])
  const [methods, setMethods] = useState<ShipMethod[]>([])
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/store-config')
    const data = await res.json()
    if (data.shipping_zones && Array.isArray(data.shipping_zones)) {
      setZones(data.shipping_zones as ShipZone[])
    }
    if (data.shipping_methods && Array.isArray(data.shipping_methods)) {
      setMethods(data.shipping_methods as ShipMethod[])
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function save() {
    setSaving(true)
    await fetch('/api/admin/store-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shipping_zones: zones, shipping_methods: methods }),
    })
    setSaving(false)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {initialTab === 'zones'
              ? t('admin.placeholders.shipping.title')
              : t('admin.placeholders.shippingMethods.title')}
          </h1>
          <p className="text-muted-foreground">
            {initialTab === 'zones'
              ? t('admin.placeholders.shipping.body')
              : t('admin.placeholders.shippingMethods.body')}
          </p>
        </div>
        <Button onClick={save} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </div>

      <Tabs defaultValue={initialTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="zones" asChild>
            <Link href="/admin/shipping">Zones & rates</Link>
          </TabsTrigger>
          <TabsTrigger value="methods" asChild>
            <Link href="/admin/shipping/methods">Methods</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="zones">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Shipping zones</CardTitle>
                <CardDescription>Flat rates and free-shipping thresholds per zone.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setZones((z) => [
                    ...z,
                    {
                      id: newId(),
                      name: 'New zone',
                      regions: 'Dar es Salaam',
                      flat_rate_tzs: 5000,
                      free_above_tzs: null,
                    },
                  ])
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add zone
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {zones.length === 0 && (
                <p className="text-sm text-muted-foreground">No zones yet. Add your first delivery region.</p>
              )}
              {zones.map((zone, i) => (
                <div key={zone.id} className="grid gap-3 rounded-lg border p-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Zone name</Label>
                    <Input
                      value={zone.name}
                      onChange={(e) => {
                        const next = [...zones]
                        next[i] = { ...zone, name: e.target.value }
                        setZones(next)
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Regions / coverage</Label>
                    <Input
                      value={zone.regions}
                      onChange={(e) => {
                        const next = [...zones]
                        next[i] = { ...zone, regions: e.target.value }
                        setZones(next)
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Flat rate (TZS)</Label>
                    <Input
                      type="number"
                      value={zone.flat_rate_tzs}
                      onChange={(e) => {
                        const next = [...zones]
                        next[i] = { ...zone, flat_rate_tzs: Number(e.target.value) }
                        setZones(next)
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Free shipping above (TZS, optional)</Label>
                    <Input
                      type="number"
                      value={zone.free_above_tzs ?? ''}
                      placeholder="Leave empty for none"
                      onChange={(e) => {
                        const v = e.target.value
                        const next = [...zones]
                        next[i] = {
                          ...zone,
                          free_above_tzs: v === '' ? null : Number(v),
                        }
                        setZones(next)
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Methods</CardTitle>
                <CardDescription>Pickup, flat courier, or free shipping labels for checkout.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setMethods((m) => [
                    ...m,
                    { id: newId(), title: 'Standard delivery', kind: 'flat', note: '' },
                  ])
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add method
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {methods.map((method, i) => (
                <div key={method.id} className="grid gap-3 rounded-lg border p-4 md:grid-cols-3">
                  <div className="grid gap-2 md:col-span-2">
                    <Label>Title</Label>
                    <Input
                      value={method.title}
                      onChange={(e) => {
                        const next = [...methods]
                        next[i] = { ...method, title: e.target.value }
                        setMethods(next)
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label id={`ship-method-kind-label-${method.id}`} htmlFor={`ship-method-kind-${method.id}`}>
                      Type
                    </Label>
                    <select
                      id={`ship-method-kind-${method.id}`}
                      aria-labelledby={`ship-method-kind-label-${method.id}`}
                      title="Shipping method type"
                      className="border-input bg-background h-9 w-full rounded-md border px-2 text-sm"
                      value={method.kind}
                      onChange={(e) => {
                        const next = [...methods]
                        next[i] = { ...method, kind: e.target.value as ShipMethod['kind'] }
                        setMethods(next)
                      }}
                    >
                      <option value="flat">Flat / courier</option>
                      <option value="pickup">Local pickup</option>
                      <option value="free">Free shipping</option>
                    </select>
                  </div>
                  <div className="grid gap-2 md:col-span-3">
                    <Label>Customer-facing note</Label>
                    <Input
                      value={method.note}
                      onChange={(e) => {
                        const next = [...methods]
                        next[i] = { ...method, note: e.target.value }
                        setMethods(next)
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
