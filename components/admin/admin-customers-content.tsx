'use client'

import { Users, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatTZS, type Profile } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

interface CustomerWithStats extends Profile {
  ordersCount: number
  totalSpent: number
}

interface AdminCustomersContentProps {
  customers: CustomerWithStats[]
}

export function AdminCustomersContent({ customers }: AdminCustomersContentProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("admin.customers")}</h1>
          <p className="text-muted-foreground">{t("admin.customersList")}</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t("admin.searchCustomer")} className="pl-9" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin.totalCustomers")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{customers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin.activeCustomers")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {customers.filter(c => c.ordersCount > 0).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin.totalPaid")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatTZS(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers List */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.customerList")}</CardTitle>
          <CardDescription>{customers.length} {t("admin.registeredCustomers")}</CardDescription>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="font-medium text-foreground">{t("admin.noCustomersYet")}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("admin.customersWillAppear")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {customers.map((customer) => {
                const initials = customer.full_name
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) || 'U'

                return (
                  <div key={customer.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{customer.full_name || t("admin.noName")}</p>
                        <p className="text-sm text-muted-foreground">{customer.phone || t("admin.noPhone")}</p>
                        <p className="text-xs text-muted-foreground">{customer.city || t("admin.noCity")}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{formatTZS(customer.totalSpent)}</p>
                      <div className="flex items-center justify-end gap-2">
                        <Badge variant="secondary">{customer.ordersCount} {t("admin.ordersLabel")}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t("admin.joined")} {new Date(customer.created_at).toLocaleDateString('en-US')}
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
