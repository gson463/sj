'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Profile } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

interface Props {
  profiles: Profile[]
}

const roleVariant = (role: string) => {
  if (role === 'admin') return 'default' as const
  if (role === 'vendor') return 'secondary' as const
  return 'outline' as const
}

export function AdminUsersContent({ profiles }: Props) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('admin.placeholders.users.title')}</h1>
        <p className="text-muted-foreground">{t('admin.placeholders.users.body')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All profiles</CardTitle>
          <CardDescription>Customers, vendors, and administrators.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Name</th>
                <th className="pb-2 pr-4 font-medium">Phone</th>
                <th className="pb-2 pr-4 font-medium">City</th>
                <th className="pb-2 pr-4 font-medium">Role</th>
                <th className="pb-2 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {profiles.map((p) => (
                <tr key={p.id}>
                  <td className="py-2 pr-4 font-medium">{p.full_name || '—'}</td>
                  <td className="py-2 pr-4">{p.phone || '—'}</td>
                  <td className="py-2 pr-4">{p.city || '—'}</td>
                  <td className="py-2 pr-4">
                    <Badge variant={roleVariant(p.role)}>{p.role}</Badge>
                  </td>
                  <td className="py-2 text-muted-foreground whitespace-nowrap">
                    {new Date(p.created_at).toLocaleDateString()}
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
