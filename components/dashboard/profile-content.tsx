'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { User as UserIcon, Mail, Phone, MapPin, Save, CalendarDays, BadgeCheck } from 'lucide-react'

type Props = {
  user: User
  initialProfile: Profile | null
}

export function ProfileContent({ user, initialProfile }: Props) {
  const { t, locale } = useLanguage()
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    full_name: initialProfile?.full_name ?? '',
    phone: initialProfile?.phone ?? '',
    address: initialProfile?.address ?? '',
    city: initialProfile?.city ?? '',
  })

  const email = user.email ?? ''
  const memberSince = initialProfile?.created_at
    ? new Intl.DateTimeFormat(locale === 'sw' ? 'sw-TZ' : 'en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(initialProfile.created_at))
    : null

  async function handleSave() {
    setSaving(true)
    try {
      const fields = {
        full_name: form.full_name.trim() || null,
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
        city: form.city.trim() || null,
        updated_at: new Date().toISOString(),
      }

      const { data: existing } = await supabase.from('profiles').select('id').eq('id', user.id).maybeSingle()

      let error = null as { message: string } | null
      if (existing) {
        const res = await supabase.from('profiles').update(fields).eq('id', user.id)
        error = res.error
      } else {
        const res = await supabase.from('profiles').insert({
          id: user.id,
          role: 'customer' as const,
          ...fields,
        })
        error = res.error
      }

      if (error) {
        console.error(error)
        toast.error(t('dashboard.profilePage.saveError'))
        return
      }

      toast.success(t('dashboard.profilePage.saved'))
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {t('dashboard.profilePage.title')}
        </h1>
        <p className="mt-1 text-muted-foreground">{t('dashboard.profilePage.subtitle')}</p>
      </div>

      <Card className="border-primary/15 bg-primary/[0.03]">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-primary" aria-hidden />
            <CardTitle className="text-lg">{t('dashboard.profilePage.accountTitle')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4 shrink-0" aria-hidden />
            <span className="font-medium text-foreground">{email || '—'}</span>
          </div>
          {memberSince ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
              <span>
                {t('dashboard.profilePage.memberSince')}:{' '}
                <span className="font-medium text-foreground">{memberSince}</span>
              </span>
            </div>
          ) : null}
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserIcon className="h-4 w-4 shrink-0" aria-hidden />
            <span>
              {t('dashboard.profilePage.roleLabel')}:{' '}
              <span className="font-medium text-foreground">{t('dashboard.profilePage.roleCustomer')}</span>
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserIcon className="h-5 w-5 text-primary" aria-hidden />
              {t('dashboard.profilePage.personalTitle')}
            </CardTitle>
            <CardDescription>{t('dashboard.profilePage.personalDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-full-name">{t('dashboard.profilePage.fullName')}</Label>
              <Input
                id="profile-full-name"
                autoComplete="name"
                value={form.full_name}
                onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                placeholder={t('dashboard.profilePage.placeholders.name')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">{t('dashboard.profilePage.email')}</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                <Input id="profile-email" value={email} disabled className="bg-muted" readOnly />
              </div>
              <p className="text-xs text-muted-foreground">{t('dashboard.profilePage.emailHint')}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-phone">{t('dashboard.profilePage.phone')}</Label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                <Input
                  id="profile-phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder={t('dashboard.profilePage.placeholders.phone')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-primary" aria-hidden />
              {t('dashboard.profilePage.addressTitle')}
            </CardTitle>
            <CardDescription>{t('dashboard.profilePage.addressDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-city">{t('dashboard.profilePage.city')}</Label>
              <Input
                id="profile-city"
                autoComplete="address-level2"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                placeholder={t('dashboard.profilePage.placeholders.city')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-address">{t('dashboard.profilePage.address')}</Label>
              <Textarea
                id="profile-address"
                autoComplete="street-address"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder={t('dashboard.profilePage.placeholders.address')}
                rows={4}
                className="min-h-[120px] resize-y"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end border-t pt-4">
        <Button type="button" size="lg" onClick={() => void handleSave()} disabled={saving}>
          <Save className="mr-2 h-4 w-4" aria-hidden />
          {saving ? t('dashboard.profilePage.saving') : t('dashboard.profilePage.save')}
        </Button>
      </div>
    </div>
  )
}
