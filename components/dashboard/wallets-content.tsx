"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Wallet, Plus, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { formatTZS, calculateProgress, type CustomerWallet, type Product } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

interface WalletsContentProps {
  wallets: (CustomerWallet & { product: Product })[]
}

export function WalletsContent({ wallets }: WalletsContentProps) {
  const { t } = useLanguage()

  const activeWallets = wallets.filter(w => w.status === 'active')
  const completedWallets = wallets.filter(w => w.status === 'completed')

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("dashboard.myWallets")}</h1>
          <p className="text-muted-foreground">{t("dashboard.phonesLipaKidogo")}</p>
        </div>
        <Button asChild>
          <Link href="/shop">
            <Plus className="mr-2 h-4 w-4" />
            {t("dashboard.addNewPhone")}
          </Link>
        </Button>
      </div>

      {/* Active Wallets */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          {t("dashboard.inProgress")} ({activeWallets.length})
        </h2>
        
        {activeWallets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="font-medium text-foreground">{t("dashboard.noActiveSavings")}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("dashboard.startFirstPhone")}
              </p>
              <Button className="mt-4" asChild>
                <Link href="/shop">{t("dashboard.viewPhones")}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {activeWallets.map((wallet) => {
              const progress = calculateProgress(wallet.current_balance, wallet.target_amount)
              const remaining = wallet.target_amount - wallet.current_balance

              return (
                <Card key={wallet.id} className="overflow-hidden">
                  <div className="flex">
                    {/* Product Image */}
                    <div className="relative h-auto w-32 shrink-0 bg-muted">
                      <Image
                        src={wallet.product?.images?.[0] || '/placeholder.svg'}
                        alt={wallet.product?.name || 'Phone'}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{wallet.product?.name}</p>
                          <p className="text-sm text-muted-foreground">{wallet.product?.brand}</p>
                        </div>
                        <Badge variant="secondary">{progress}%</Badge>
                      </div>

                      <Progress value={progress} className="my-2 h-2" />

                      <div className="mb-3 flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {t("checkout.youPaid")}: {formatTZS(wallet.current_balance)}
                        </span>
                        <span className="font-medium text-foreground">
                          {t("dashboard.remainingAmount")}: {formatTZS(remaining)}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" asChild>
                          <Link href={`/dashboard/wallets/${wallet.id}/pay`}>
                            {t("dashboard.payNow")}
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/dashboard/wallets/${wallet.id}`}>
                            {t("dashboard.details")}
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Completed Wallets */}
      {completedWallets.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            {t("dashboard.fullyPaid")} ({completedWallets.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedWallets.map((wallet) => (
              <Card key={wallet.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{wallet.product?.name}</CardTitle>
                    <Badge className="bg-green-100 text-green-700">{t("wallet.completed")}</Badge>
                  </div>
                  <CardDescription>{wallet.product?.brand}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold text-foreground">
                    {formatTZS(wallet.target_amount)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.youCompleted")} {new Date(wallet.updated_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
