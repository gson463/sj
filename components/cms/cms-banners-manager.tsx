'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Loader2, Upload, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useLanguage } from '@/lib/i18n/language-context'
import type { CmsBannerSlotContent, CmsSiteSettings } from '@/lib/types'
import { CMS_BANNER_SLOTS, emptySlot, normalizeSlot } from '@/lib/cms-banner-slots'

function mergeLoaded(slots: Record<string, CmsBannerSlotContent> | null | undefined): Record<string, CmsBannerSlotContent> {
  const out: Record<string, CmsBannerSlotContent> = {}
  for (const meta of CMS_BANNER_SLOTS) {
    out[meta.id] = normalizeSlot(slots?.[meta.id])
  }
  return out
}

export function CmsBannersManager() {
  const { t, locale } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<'idle' | 'saved' | 'error'>('idle')
  const [loadError, setLoadError] = useState(false)
  const [slots, setSlots] = useState<Record<string, CmsBannerSlotContent>>(() => {
    const o: Record<string, CmsBannerSlotContent> = {}
    for (const m of CMS_BANNER_SLOTS) o[m.id] = emptySlot()
    return o
  })

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/site-settings')
      .then((r) => {
        if (!r.ok) throw new Error('load')
        return r.json()
      })
      .then((d: CmsSiteSettings) => {
        if (cancelled || !d) return
        setSlots(mergeLoaded(d.banner_slots))
      })
      .catch(() => {
        if (!cancelled) setLoadError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const updateSlot = (id: string, patch: Partial<CmsBannerSlotContent>) => {
    setSlots((prev) => ({
      ...prev,
      [id]: { ...emptySlot(), ...prev[id], ...patch },
    }))
  }

  const upload = async (slotId: string, file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('slotId', slotId)
    const res = await fetch('/api/admin/cms/upload', { method: 'POST', body: fd })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      throw new Error(j.error || 'Upload failed')
    }
    const { url } = (await res.json()) as { url: string }
    updateSlot(slotId, { image_url: url })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('idle')
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banner_slots: slots }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'save')
      }
      setMessage('saved')
      setLoadError(false)
    } catch {
      setMessage('error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>{t('admin.cmsSaving')}</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {loadError && <p className="text-sm text-destructive">{t('admin.cmsLoadError')}</p>}

      <p className="text-sm text-muted-foreground max-w-3xl">
        {locale === 'en'
          ? 'Upload images directly (stored in Supabase Storage). Each slot shows where the banner appears and the recommended size for designers.'
          : 'Pakia picha moja kwa moja (zinahifadhiwa kwenye Supabase Storage). Kila nafasi inaonyesha mahali patakatifu na ukubwa unaopendekezwa.'}
      </p>

      {CMS_BANNER_SLOTS.map((meta) => {
        const s = slots[meta.id] ?? emptySlot()
        const label = locale === 'sw' ? meta.labelSw : meta.labelEn
        const placement = locale === 'sw' ? meta.placementSw : meta.placementEn

        return (
          <Card key={meta.id}>
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-lg">{label}</CardTitle>
                  <CardDescription className="mt-1 space-y-1">
                    <span className="block">{placement}</span>
                    <span className="block font-medium text-foreground/90">
                      {locale === 'en' ? 'Recommended size:' : 'Ukubwa unaopendekezwa:'} {meta.sizeHint}
                      {meta.aspectHint ? ` · ${locale === 'en' ? 'Aspect' : 'Uwiano'} ~ ${meta.aspectHint}` : ''}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`en-${meta.id}`} className="text-sm">
                    {t('admin.cmsSlotEnabled')}
                  </Label>
                  <Switch
                    id={`en-${meta.id}`}
                    checked={s.enabled !== false}
                    onCheckedChange={(c) => updateSlot(meta.id, { enabled: c })}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button type="button" variant="secondary" size="sm" asChild>
                  <label className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    {t('admin.cmsUpload')}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="sr-only"
                      onChange={async (e) => {
                        const f = e.target.files?.[0]
                        e.target.value = ''
                        if (!f) return
                        try {
                          await upload(meta.id, f)
                        } catch {
                          setMessage('error')
                        }
                      }}
                    />
                  </label>
                </Button>
                {s.image_url && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => updateSlot(meta.id, { image_url: null })}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('admin.cmsRemoveImage')}
                  </Button>
                )}
              </div>

              {s.image_url && (
                <div className="relative max-h-48 max-w-md overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={s.image_url}
                    alt={s.alt || ''}
                    width={800}
                    height={400}
                    className="h-auto w-full object-contain"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor={`url-${meta.id}`}>{t('admin.cmsPasteUrl')}</Label>
                <Input
                  id={`url-${meta.id}`}
                  type="url"
                  placeholder="https://"
                  value={s.image_url ?? ''}
                  onChange={(e) => updateSlot(meta.id, { image_url: e.target.value.trim() || null })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`link-${meta.id}`}>{t('admin.cmsLinkUrl')}</Label>
                  <p className="text-xs text-muted-foreground">{t('admin.cmsLinkUrlHint')}</p>
                  <Input
                    id={`link-${meta.id}`}
                    type="text"
                    inputMode="url"
                    autoComplete="off"
                    placeholder="https://… or /shop"
                    value={s.link_url ?? ''}
                    onChange={(e) => updateSlot(meta.id, { link_url: e.target.value.trim() || null })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`alt-${meta.id}`}>{t('admin.cmsAltText')}</Label>
                  <Input
                    id={`alt-${meta.id}`}
                    value={s.alt ?? ''}
                    onChange={(e) => updateSlot(meta.id, { alt: e.target.value.trim() || null })}
                    maxLength={200}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {saving ? t('admin.cmsSaving') : t('admin.cmsSave')}
        </Button>
        {message === 'saved' && <span className="text-sm text-green-600">{t('admin.cmsSaved')}</span>}
        {message === 'error' && <span className="text-sm text-destructive">{t('admin.cmsSaveError')}</span>}
      </div>
    </form>
  )
}
