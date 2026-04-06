'use client'

import { useCallback, useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { Coupon } from '@/lib/types'
import { formatTZS } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

export function AdminCouponsContent() {
  const { t } = useLanguage()
  const [rows, setRows] = useState<Coupon[]>([])
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    code: '',
    description: '',
    discount_type: 'percent' as 'percent' | 'fixed',
    discount_value: '',
    min_order_amount: '0',
    max_uses: '',
    expires_at: '',
  })

  const load = useCallback(async () => {
    setError(null)
    const res = await fetch('/api/admin/coupons')
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Could not load coupons. Run scripts/005_admin_store.sql in Supabase.')
      return
    }
    setRows(data)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function createCoupon() {
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: form.code,
        description: form.description || null,
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        min_order_amount: Number(form.min_order_amount) || 0,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        expires_at: form.expires_at || null,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Create failed')
      return
    }
    setOpen(false)
    setForm({
      code: '',
      description: '',
      discount_type: 'percent',
      discount_value: '',
      min_order_amount: '0',
      max_uses: '',
      expires_at: '',
    })
    load()
  }

  async function toggleActive(c: Coupon, active: boolean) {
    await fetch(`/api/admin/coupons/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    })
    load()
  }

  async function remove(id: string) {
    if (!confirm('Delete this coupon?')) return
    await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('admin.placeholders.coupons.title')}</h1>
          <p className="text-muted-foreground">{t('admin.placeholders.coupons.body')}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create coupon</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div className="grid gap-2">
                <Label>Code</Label>
                <Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="coupon-discount-type">Type</Label>
                  <select
                    id="coupon-discount-type"
                    className="border-input h-9 rounded-md border px-2 text-sm"
                    aria-label={t('admin.placeholders.coupons.discountType')}
                    value={form.discount_type}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, discount_type: e.target.value as 'percent' | 'fixed' }))
                    }
                  >
                    <option value="percent">Percent</option>
                    <option value="fixed">Fixed (TZS)</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Value</Label>
                  <Input
                    type="number"
                    value={form.discount_value}
                    onChange={(e) => setForm((f) => ({ ...f, discount_value: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Min order (TZS)</Label>
                  <Input
                    type="number"
                    value={form.min_order_amount}
                    onChange={(e) => setForm((f) => ({ ...f, min_order_amount: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Max uses (empty = unlimited)</Label>
                  <Input
                    value={form.max_uses}
                    onChange={(e) => setForm((f) => ({ ...f, max_uses: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Expires (optional)</Label>
                <Input
                  type="datetime-local"
                  value={form.expires_at}
                  onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={createCoupon}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Active codes</CardTitle>
          <CardDescription>Apply at checkout when the integration is wired to this table.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Code</th>
                <th className="pb-2 pr-4 font-medium">Discount</th>
                <th className="pb-2 pr-4 font-medium">Uses</th>
                <th className="pb-2 pr-4 font-medium">Active</th>
                <th className="pb-2 font-medium"> </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((c) => (
                <tr key={c.id}>
                  <td className="py-2 pr-4 font-mono font-semibold">{c.code}</td>
                  <td className="py-2 pr-4">
                    {c.discount_type === 'percent' ? `${c.discount_value}%` : formatTZS(Number(c.discount_value))}
                  </td>
                  <td className="py-2 pr-4 tabular-nums">
                    {c.uses_count}
                    {c.max_uses != null ? ` / ${c.max_uses}` : ''}
                  </td>
                  <td className="py-2 pr-4">
                    <Switch checked={c.active} onCheckedChange={(v) => toggleActive(c, v)} />
                  </td>
                  <td className="py-2">
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => remove(c.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
