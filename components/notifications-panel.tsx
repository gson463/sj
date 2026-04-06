'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n/language-context'
import { Bell, Check, CreditCard, Package, Info, Megaphone } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'payment' | 'order' | 'reminder' | 'promo'
  read: boolean
  created_at: string
}

const typeIcons = {
  info: Info,
  payment: CreditCard,
  order: Package,
  reminder: Bell,
  promo: Megaphone,
}

export function NotificationsPanel() {
  const { t } = useLanguage()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    async function loadNotifications() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (data) {
          setNotifications(data)
        }
      }
      setLoading(false)
    }
    loadNotifications()
  }, [supabase])

  async function markAsRead(id: string) {
    await supabase.from('notifications').update({ read: true }).eq('id', id)

    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  async function markAllAsRead() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false)

      setNotifications(notifications.map((n) => ({ ...n, read: true })))
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard.notifications')}</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            All Notifications
          </CardTitle>
          <CardDescription>
            {notifications.length} total notification{notifications.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => {
                const Icon = typeIcons[notification.type] || Info
                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
                      notification.read ? 'bg-background' : 'border-primary/20 bg-primary/5'
                    }`}
                  >
                    <div
                      className={`rounded-full p-2 ${notification.read ? 'bg-muted' : 'bg-primary/10'}`}
                    >
                      <Icon
                        className={`h-5 w-5 ${notification.read ? 'text-muted-foreground' : 'text-primary'}`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`font-medium ${notification.read ? '' : 'text-foreground'}`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                            Mark as read
                          </Button>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
