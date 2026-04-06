'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/i18n/language-context'
import { Settings, Bell, Lock, Globe, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'
import { LanguageSwitcher } from '@/components/language-switcher'

interface SettingsContentProps {
  user: SupabaseUser
  profile: Profile | null
}

export function SettingsContent({ user, profile }: SettingsContentProps) {
  const { locale } = useLanguage()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    city: profile?.city || '',
  })
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    promotions: false,
  })

  const content = locale === 'en' ? {
    title: 'Settings',
    subtitle: 'Manage your account settings',
    profile: {
      title: 'Profile Information',
      description: 'Update your personal information',
      name: 'Full Name',
      phone: 'Phone Number',
      address: 'Address',
      city: 'City',
      email: 'Email',
      save: 'Save Changes',
      saving: 'Saving...',
      saved: 'Changes saved successfully',
    },
    notifications: {
      title: 'Notifications',
      description: 'Choose how you want to be notified',
      email: 'Email Notifications',
      emailDesc: 'Receive order updates via email',
      sms: 'SMS Notifications',
      smsDesc: 'Receive payment reminders via SMS',
      promotions: 'Promotional Messages',
      promotionsDesc: 'Receive offers and discounts',
    },
    language: {
      title: 'Language',
      description: 'Choose your preferred language',
      current: 'Current Language',
    },
    security: {
      title: 'Security',
      description: 'Manage your account security',
      changePassword: 'Change Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm New Password',
      update: 'Update Password',
    },
  } : {
    title: 'Mipangilio',
    subtitle: 'Dhibiti mipangilio ya akaunti yako',
    profile: {
      title: 'Taarifa za Wasifu',
      description: 'Sasisha taarifa zako binafsi',
      name: 'Jina Kamili',
      phone: 'Nambari ya Simu',
      address: 'Anwani',
      city: 'Jiji',
      email: 'Barua Pepe',
      save: 'Hifadhi Mabadiliko',
      saving: 'Inahifadhi...',
      saved: 'Mabadiliko yamehifadhiwa',
    },
    notifications: {
      title: 'Arifa',
      description: 'Chagua jinsi unavyotaka kuarifiwa',
      email: 'Arifa za Email',
      emailDesc: 'Pokea sasisho za agizo kupitia email',
      sms: 'Arifa za SMS',
      smsDesc: 'Pokea vikumbusho vya malipo kupitia SMS',
      promotions: 'Ujumbe wa Matangazo',
      promotionsDesc: 'Pokea ofa na punguzo',
    },
    language: {
      title: 'Lugha',
      description: 'Chagua lugha unayopendelea',
      current: 'Lugha ya Sasa',
    },
    security: {
      title: 'Usalama',
      description: 'Dhibiti usalama wa akaunti yako',
      changePassword: 'Badilisha Nenosiri',
      currentPassword: 'Nenosiri la Sasa',
      newPassword: 'Nenosiri Jipya',
      confirmPassword: 'Thibitisha Nenosiri Jipya',
      update: 'Sasisha Nenosiri',
    },
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase
      .from('profiles')
      .update(formData)
      .eq('id', user.id)
    setSaving(false)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{content.title}</h1>
        <p className="text-muted-foreground">{content.subtitle}</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>{content.profile.title}</CardTitle>
          </div>
          <CardDescription>{content.profile.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">{content.profile.name}</label>
              <Input 
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">{content.profile.phone}</label>
              <Input 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">{content.profile.address}</label>
              <Input 
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">{content.profile.city}</label>
              <Input 
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">{content.profile.email}</label>
            <Input value={user.email || ''} disabled className="bg-muted" />
          </div>
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? content.profile.saving : content.profile.save}
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle>{content.notifications.title}</CardTitle>
          </div>
          <CardDescription>{content.notifications.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{content.notifications.email}</p>
              <p className="text-sm text-muted-foreground">{content.notifications.emailDesc}</p>
            </div>
            <Switch 
              checked={notifications.email} 
              onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{content.notifications.sms}</p>
              <p className="text-sm text-muted-foreground">{content.notifications.smsDesc}</p>
            </div>
            <Switch 
              checked={notifications.sms} 
              onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{content.notifications.promotions}</p>
              <p className="text-sm text-muted-foreground">{content.notifications.promotionsDesc}</p>
            </div>
            <Switch 
              checked={notifications.promotions} 
              onCheckedChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <CardTitle>{content.language.title}</CardTitle>
          </div>
          <CardDescription>{content.language.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="font-medium">{content.language.current}</p>
            <LanguageSwitcher />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <CardTitle>{content.security.title}</CardTitle>
          </div>
          <CardDescription>{content.security.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">{content.security.currentPassword}</label>
            <Input type="password" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">{content.security.newPassword}</label>
            <Input type="password" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">{content.security.confirmPassword}</label>
            <Input type="password" />
          </div>
          <Button variant="outline">{content.security.update}</Button>
        </CardContent>
      </Card>
    </div>
  )
}
