'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, ArrowRight, ShoppingBag, Wallet, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatTZS, type Order, type Product } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

export default function CheckoutSuccessPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  const [order, setOrder] = useState<(Order & { product: Product }) | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return
      
      const supabase = createClient()
      const { data } = await supabase
        .from('orders')
        .select('*, product:products(*)')
        .eq('id', orderId)
        .single()

      if (data) {
        setOrder(data as Order & { product: Product })
      }
      setLoading(false)
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="mx-auto flex max-w-lg items-center justify-center px-4 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-muted-foreground">{t("common.error")}</p>
        <Button className="mt-4" asChild>
          <Link href="/shop">{t("checkout.continueShopping")}</Link>
        </Button>
      </div>
    )
  }

  const isLipaKidogo = order.payment_type === 'lipa_kidogo'
  const remaining = order.total_price - order.amount_paid

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">{t("checkout.congratulations")}</CardTitle>
          <CardDescription>
            {t("checkout.orderAccepted")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Details */}
          <div className="rounded-lg bg-muted p-4 text-left">
            <p className="text-sm text-muted-foreground">{t("checkout.orderNumber")}</p>
            <p className="font-mono font-bold text-foreground">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>

          <div className="space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("checkout.phone_label")}</span>
              <span className="font-medium text-foreground">{order.product?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("checkout.price")}</span>
              <span className="font-medium text-foreground">{formatTZS(order.total_price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("checkout.youPaid")}</span>
              <span className="font-medium text-green-600">{formatTZS(order.amount_paid)}</span>
            </div>
            {isLipaKidogo && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("checkout.remaining")}</span>
                <span className="font-medium text-foreground">{formatTZS(remaining)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("checkout.paymentMethod_label")}</span>
              <span className="font-medium text-foreground">
                {isLipaKidogo ? 'Lipa Kidogo Kidogo' : 'Cash'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("checkout.receiving")}</span>
              <span className="font-medium text-foreground">
                {order.delivery_method === 'pickup' ? t("checkout.storePickup") : t("checkout.homeDelivery")}
              </span>
            </div>
          </div>

          {isLipaKidogo ? (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Wallet className="h-5 w-5" />
                <span className="font-semibold">{t("checkout.nextStepsTitle")}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("checkout.nextStepsLipaKidogo").replace('{amount}', formatTZS(order.total_price))}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                {t("checkout.nextStepsCash")}
                {order.delivery_method === 'pickup' ? t("checkout.forPickup") : t("checkout.forDelivery")}.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {isLipaKidogo ? (
              <Button asChild>
                <Link href="/dashboard/wallets">
                  <Wallet className="mr-2 h-4 w-4" />
                  {t("checkout.viewMySavings")}
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/dashboard/orders">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  {t("checkout.viewMyOrders")}
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/shop">
                {t("checkout.continueShopping")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
