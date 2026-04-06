'use client'

import { useCallback, useEffect, useState } from 'react'
import { Check, Loader2, RefreshCw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useLanguage } from '@/lib/i18n/language-context'

type Row = {
  id: string
  user_id: string
  business_name: string
  contact_phone: string
  message: string | null
  status: 'pending' | 'approved' | 'rejected'
  reviewed_at: string | null
  created_at: string
  applicant_name: string | null
  applicant_phone: string | null
}

export function AdminVendorApplicationsContent() {
  const { t, locale } = useLanguage()
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'pending' | 'all'>('pending')
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/vendor-applications')
      const j = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof j.error === 'string' ? j.error : t('admin.vendorApps.loadError'))
        return
      }
      setRows(Array.isArray(j) ? j : [])
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    load()
  }, [load])

  async function patch(id: string, action: 'approve' | 'reject') {
    setBusyId(id)
    try {
      const res = await fetch(`/api/admin/vendor-applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (res.ok) await load()
    } finally {
      setBusyId(null)
    }
  }

  const visible = filter === 'pending' ? rows.filter((r) => r.status === 'pending') : rows

  function statusLabel(status: Row['status']) {
    if (status === 'pending') return t('admin.vendorApps.statusPending')
    if (status === 'approved') return t('admin.vendorApps.statusApproved')
    return t('admin.vendorApps.statusRejected')
  }

  function statusVariant(status: Row['status']): 'default' | 'secondary' | 'destructive' {
    if (status === 'pending') return 'secondary'
    if (status === 'approved') return 'default'
    return 'destructive'
  }

  const dateLocale = locale === 'sw' ? 'sw-TZ' : 'en-TZ'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('admin.vendorApps.title')}</h1>
        <p className="text-muted-foreground">{t('admin.vendorApps.subtitle')}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={filter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pending')}
        >
          {t('admin.vendorApps.filterPending')}
        </Button>
        <Button
          type="button"
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          {t('admin.vendorApps.filterAll')}
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => load()} disabled={loading} title="Refresh">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.vendorApps.title')}</CardTitle>
          <CardDescription>
            {filter === 'pending' ? t('admin.vendorApps.filterPending') : t('admin.vendorApps.filterAll')}
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading && rows.length === 0 ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : visible.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">{t('admin.vendorApps.empty')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.vendorApps.applicant')}</TableHead>
                  <TableHead>{t('admin.vendorApps.business')}</TableHead>
                  <TableHead>{t('admin.vendorApps.phone')}</TableHead>
                  <TableHead>{t('admin.vendorApps.message')}</TableHead>
                  <TableHead>{t('admin.vendorApps.status')}</TableHead>
                  <TableHead>{t('admin.vendorApps.submitted')}</TableHead>
                  <TableHead className="text-right">{t('admin.vendorApps.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((r) => {
                  const name = r.applicant_name || '—'
                  const phone = r.contact_phone || r.applicant_phone || '—'
                  const submitted = new Date(r.created_at).toLocaleString(dateLocale, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="max-w-[140px] font-medium">{name}</TableCell>
                      <TableCell className="max-w-[180px]">{r.business_name}</TableCell>
                      <TableCell className="whitespace-nowrap">{phone}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground" title={r.message || undefined}>
                        {r.message || '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(r.status)}>{statusLabel(r.status)}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{submitted}</TableCell>
                      <TableCell className="text-right">
                        {r.status === 'pending' ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="default"
                              className="gap-1"
                              disabled={busyId === r.id}
                              onClick={() => patch(r.id, 'approve')}
                            >
                              {busyId === r.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                              {t('admin.vendorApps.approve')}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="gap-1"
                              disabled={busyId === r.id}
                              onClick={() => patch(r.id, 'reject')}
                            >
                              <X className="h-4 w-4" />
                              {t('admin.vendorApps.reject')}
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
