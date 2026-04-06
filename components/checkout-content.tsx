'use client'

import * as React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { type Product, type Profile, formatTZS } from '@/lib/types'
import { CheckoutForm } from '@/components/checkout-form'
import { useLanguage } from '@/lib/i18n/language-context'

interface CheckoutContentProps {
  product: Product
  paymentType: 'cash' | 'lipa_kidogo'
  profile: Profile | null
  userId: string
}

export function CheckoutContent({ product, paymentType, profile, userId }: CheckoutContentProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const minDeposit = Math.round(product.price * 0.1)
  const [open, setOpen] = React.useState(true)

  const backToProduct = () => {
    router.push(`/products/${product.slug}`)
  }

  const handleDialogOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      backToProduct()
    }
  }

  return (
    <div className="min-h-[50vh] px-3 py-6 sm:px-4 sm:py-8">
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent
          showCloseButton
          className="max-h-[min(95vh,920px)] w-full max-w-[calc(100vw-2rem)] gap-0 overflow-y-auto border-sky-200/70 p-0 sm:max-w-4xl"
        >
          <div className="border-b border-sky-100/80 bg-sky-50/50 px-4 py-3 sm:px-6 sm:py-4">
            <DialogHeader className="text-left">
              <DialogTitle>{t('checkout.title')}</DialogTitle>
              <DialogDescription>{t('checkout.reviewOrder')}</DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-4 py-4 sm:px-6 sm:py-6">
            <button
              type="button"
              onClick={backToProduct}
              className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('checkout.backToProduct')}
            </button>

            <div className="grid gap-8 lg:grid-cols-5">
              {/* Order Summary */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('checkout.orderSummary')}</CardTitle>
                    <CardDescription>{t('checkout.reviewOrder')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Product */}
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={product.images[0] || '/placeholder.svg'}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                        <Badge variant="secondary" className="mt-1">
                          {paymentType === 'lipa_kidogo' ? t('buy.lipaKidogo') : t('admin.cash')}
                        </Badge>
                      </div>
                    </div>

                    <hr />

                    {/* Price Breakdown */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t('checkout.phonePrice')}</span>
                        <span className="text-foreground">{formatTZS(product.price)}</span>
                      </div>

                      {paymentType === 'lipa_kidogo' && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{t('checkout.minDeposit')}</span>
                            <span className="text-foreground">{formatTZS(minDeposit)}</span>
                          </div>
                          <div className="rounded-lg bg-primary/10 p-3">
                            <div className="flex items-center gap-2 text-primary">
                              <Zap className="h-4 w-4" />
                              <span className="text-sm font-medium">{t('buy.lipaKidogo')}</span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {t('checkout.payDepositToday').replace(
                                '{amount}',
                                formatTZS(minDeposit),
                              )}
                            </p>
                          </div>
                        </>
                      )}

                      <hr />

                      <div className="flex justify-between font-semibold">
                        <span className="text-foreground">
                          {paymentType === 'lipa_kidogo'
                            ? t('checkout.payToday')
                            : t('checkout.total')}
                        </span>
                        <span className="text-lg text-primary">
                          {formatTZS(paymentType === 'lipa_kidogo' ? minDeposit : product.price)}
                        </span>
                      </div>
                    </div>

                    {/* Payment Info */}
                    {paymentType === 'lipa_kidogo' && (
                      <div className="rounded-lg border p-3">
                        <p className="text-sm font-medium text-foreground">{t('checkout.howItWorks')}</p>
                        <ol className="mt-2 list-inside list-decimal space-y-1 text-xs text-muted-foreground">
                          <li>
                            {t('checkout.step1Pay').replace('{amount}', formatTZS(minDeposit))}
                          </li>
                          <li>{t('checkout.step2Continue')}</li>
                          <li>
                            {t('checkout.step3GetPhone').replace(
                              '{amount}',
                              formatTZS(product.price),
                            )}
                          </li>
                        </ol>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Checkout Form */}
              <div className="lg:col-span-3">
                <CheckoutForm
                  product={product}
                  paymentType={paymentType}
                  profile={profile}
                  userId={userId}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
