'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CreditCard, Smartphone, MapPin, Truck, Store } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type Product, type Profile, formatTZS, type PaymentMethod } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

interface CheckoutFormProps {
  product: Product
  paymentType: 'cash' | 'lipa_kidogo'
  profile: Profile | null
  userId: string
}

export function CheckoutForm({ product, paymentType, profile, userId }: CheckoutFormProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup')
  const [address, setAddress] = useState(profile?.address || '')
  const [city, setCity] = useState(profile?.city || '')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa')
  const [notes, setNotes] = useState('')

  const minDeposit = Math.round(product.price * 0.1)
  const amountToPay = paymentType === 'lipa_kidogo' ? minDeposit : product.price

  const paymentMethods: { value: PaymentMethod; label: string; icon: typeof Smartphone }[] = [
    { value: 'mpesa', label: t("payment.mpesa"), icon: Smartphone },
    { value: 'tigopesa', label: t("payment.tigopesa"), icon: Smartphone },
    { value: 'airtelmoney', label: t("payment.airtelmoney"), icon: Smartphone },
    { value: 'halopesa', label: t("payment.halopesa"), icon: Smartphone },
    { value: 'bank', label: t("payment.bank"), icon: CreditCard },
    { value: 'card', label: t("payment.card"), icon: CreditCard },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!fullName || !phone) {
      setError(t("checkout.fillNameAndPhone"))
      setIsLoading(false)
      return
    }

    if (deliveryMethod === 'delivery' && (!address || !city)) {
      setError(t("checkout.fillDeliveryAddress"))
      setIsLoading(false)
      return
    }

    if (product.stock <= 0 || product.stock_status === 'out_of_stock') {
      setError(t('checkout.outOfStock'))
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()

      // Update profile if needed
      await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone,
          address: address || null,
          city: city || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          product_id: product.id,
          payment_type: paymentType,
          total_price: product.price,
          amount_paid: amountToPay,
          status: paymentType === 'lipa_kidogo' ? 'partial' : 'paid',
          delivery_method: deliveryMethod,
          delivery_address: deliveryMethod === 'delivery' ? `${address}, ${city}` : null,
          notes: notes || null,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: order.id,
          user_id: userId,
          amount: amountToPay,
          payment_method: paymentMethod,
          transaction_ref: `PAY-${Date.now()}`,
          status: 'completed',
        })

      if (paymentError) throw paymentError

      // If Lipa Kidogo, create wallet entry
      if (paymentType === 'lipa_kidogo') {
        const { error: walletError } = await supabase
          .from('customer_wallets')
          .insert({
            user_id: userId,
            order_id: order.id,
            product_id: product.id,
            target_amount: product.price,
            current_balance: amountToPay,
            status: 'active',
          })

        if (walletError) throw walletError
      }

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: t("checkout.orderSuccess"),
          message: `${product.name} - ${formatTZS(amountToPay)}`,
          type: 'order',
        })

      // Redirect to success page
      router.push(`/checkout/success?order=${order.id}`)
    } catch (err) {
      console.error('Checkout error:', err)
      setError(t("checkout.errorOccurred"))
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>{t("checkout.customerDetails")}</CardTitle>
          <CardDescription>{t("checkout.yourContactInfo")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t("auth.fullName")}</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("auth.phone")}</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+255 XXX XXX XXX"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Method */}
      <Card>
        <CardHeader>
          <CardTitle>{t("checkout.howToGetPhone")}</CardTitle>
          <CardDescription>{t("checkout.chooseDelivery")}</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={deliveryMethod}
            onValueChange={(value) => setDeliveryMethod(value as 'pickup' | 'delivery')}
            className="grid gap-4 sm:grid-cols-2"
          >
            <div
              className={`relative flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
                deliveryMethod === 'pickup' ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => setDeliveryMethod('pickup')}
            >
              <RadioGroupItem value="pickup" id="pickup" className="mt-1" />
              <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  <span className="font-medium">{t("checkout.pickup")}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("checkout.pickupDescription")}
                </p>
              </Label>
            </div>

            <div
              className={`relative flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
                deliveryMethod === 'delivery' ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => setDeliveryMethod('delivery')}
            >
              <RadioGroupItem value="delivery" id="delivery" className="mt-1" />
              <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="font-medium">{t("checkout.delivery")}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("checkout.deliveryDescription")}
                </p>
              </Label>
            </div>
          </RadioGroup>

          {deliveryMethod === 'delivery' && (
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">{t("checkout.address")}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t("checkout.addressPlaceholder")}
                    className="pl-9"
                    required={deliveryMethod === 'delivery'}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">{t("checkout.cityRegion")}</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Dar es Salaam"
                  required={deliveryMethod === 'delivery'}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>{t("checkout.selectPaymentMethod")}</CardTitle>
          <CardDescription>{t("checkout.choosePayment")} {formatTZS(amountToPay)}</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {paymentMethods.map((method) => (
              <div
                key={method.value}
                className={`relative flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                  paymentMethod === method.value ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => setPaymentMethod(method.value)}
              >
                <RadioGroupItem value={method.value} id={method.value} />
                <Label htmlFor={method.value} className="flex cursor-pointer items-center gap-2">
                  <method.icon className="h-4 w-4 text-muted-foreground" />
                  {method.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>{t("checkout.additionalNotes")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("checkout.notesPlaceholder")}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Submit */}
      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <CreditCard className="mr-2 h-5 w-5" />
        )}
        {t("checkout.completeOrder")} - {formatTZS(amountToPay)}
      </Button>
    </form>
  )
}
