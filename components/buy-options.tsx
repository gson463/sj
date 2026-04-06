'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Wallet, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { type Product, formatTZS } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

interface BuyOptionsProps {
  product: Product
}

export function BuyOptions({ product }: BuyOptionsProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const [paymentType, setPaymentType] = useState<'cash' | 'lipa_kidogo'>('lipa_kidogo')
  const [isLoading, setIsLoading] = useState(false)

  const minDeposit = Math.round(product.price * 0.1) // 10% minimum deposit

  const handleBuy = async () => {
    setIsLoading(true)
    router.push(`/checkout?product=${product.id}&type=${paymentType}`)
  }

  return (
    <div className="space-y-4">
      <RadioGroup
        value={paymentType}
        onValueChange={(value) => setPaymentType(value as 'cash' | 'lipa_kidogo')}
        className="space-y-3"
      >
        {/* Lipa Kidogo Option */}
        <div
          className={`relative flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
            paymentType === 'lipa_kidogo' ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground/50'
          }`}
          onClick={() => setPaymentType('lipa_kidogo')}
        >
          <RadioGroupItem value="lipa_kidogo" id="lipa_kidogo" className="mt-1" />
          <Label htmlFor="lipa_kidogo" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">{t('buy.lipaKidogo')}</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {t("buy.recommended")}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("buy.lipaKidogoDescription").replace('{amount}', formatTZS(minDeposit))}
            </p>
            <div className="mt-2 flex items-center gap-4 text-sm">
              <span className="font-medium text-foreground">{t("buy.deposit")}: {formatTZS(minDeposit)}</span>
              <span className="text-muted-foreground">{t("buy.noInterest")}</span>
            </div>
          </Label>
        </div>

        {/* Cash/Full Payment Option */}
        <div
          className={`relative flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
            paymentType === 'cash' ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground/50'
          }`}
          onClick={() => setPaymentType('cash')}
        >
          <RadioGroupItem value="cash" id="cash" className="mt-1" />
          <Label htmlFor="cash" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-foreground" />
              <span className="font-semibold text-foreground">{t("buy.payCash")}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("buy.cashDescription")}
            </p>
            <div className="mt-2 text-sm">
              <span className="font-medium text-foreground">{t("buy.total")}: {formatTZS(product.price)}</span>
            </div>
          </Label>
        </div>
      </RadioGroup>

      {/* Buy Button */}
      <Button
        size="lg"
        className="w-full"
        disabled={product.stock <= 0 || isLoading}
        onClick={handleBuy}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : paymentType === 'lipa_kidogo' ? (
          <Wallet className="mr-2 h-5 w-5" />
        ) : (
          <ShoppingCart className="mr-2 h-5 w-5" />
        )}
        {paymentType === 'lipa_kidogo'
          ? `${t("buy.startLipaKidogo")} - ${formatTZS(minDeposit)}`
          : `${t("buy.buyNow")} - ${formatTZS(product.price)}`}
      </Button>

      {product.stock <= 0 && (
        <p className="text-center text-sm text-destructive">
          {t("buy.notAvailable")}
        </p>
      )}
    </div>
  )
}
