'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { VendorBusinessDetails } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'

const BUSINESS_TYPES: { value: VendorBusinessDetails['business_type']; key: string }[] = [
  { value: 'individual', key: 'sellerApply.businessTypeIndividual' },
  { value: 'registered_company', key: 'sellerApply.businessTypeCompany' },
  { value: 'partnership', key: 'sellerApply.businessTypePartnership' },
  { value: 'other', key: 'sellerApply.businessTypeOther' },
]

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitted: () => void
}

export function VendorApplyModal({ open, onOpenChange, onSubmitted }: Props) {
  const { t } = useLanguage()
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState<VendorBusinessDetails['business_type']>('individual')
  const [registrationOrTin, setRegistrationOrTin] = useState('')
  const [businessEmail, setBusinessEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [physicalAddress, setPhysicalAddress] = useState('')
  const [city, setCity] = useState('')
  const [region, setRegion] = useState('')
  const [brandsCategories, setBrandsCategories] = useState('')
  const [yearsInBusiness, setYearsInBusiness] = useState('')
  const [websiteOrSocial, setWebsiteOrSocial] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setError(null)
  }, [open])

  function reset() {
    setBusinessName('')
    setBusinessType('individual')
    setRegistrationOrTin('')
    setBusinessEmail('')
    setContactPhone('')
    setPhysicalAddress('')
    setCity('')
    setRegion('')
    setBrandsCategories('')
    setYearsInBusiness('')
    setWebsiteOrSocial('')
    setAdditionalNotes('')
    setError(null)
  }

  function handleClose(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const business_details: VendorBusinessDetails = {
      business_type: businessType,
      registration_or_tin: registrationOrTin.trim() || null,
      business_email: businessEmail.trim(),
      physical_address: physicalAddress.trim(),
      city: city.trim(),
      region: region.trim(),
      brands_categories: brandsCategories.trim(),
      years_in_business: yearsInBusiness.trim() || null,
      website_or_social: websiteOrSocial.trim() || null,
    }
    try {
      const res = await fetch('/api/vendor/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: businessName.trim(),
          contact_phone: contactPhone.trim(),
          message: additionalNotes.trim() || null,
          business_details,
        }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (j.error === 'pending_exists' || res.status === 409) {
          setError(t('sellerApply.errorPending'))
        } else if (j.error === 'only_customers') {
          setError(t('sellerApply.errorRole'))
        } else if (
          j.error === 'missing_fields' ||
          j.error === 'invalid_business_details'
        ) {
          setError(t('sellerApply.errorValidation'))
        } else {
          setError(t('sellerApply.errorGeneric'))
        }
        return
      }
      reset()
      onOpenChange(false)
      onSubmitted()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton
        className="flex max-h-[min(92vh,800px)] w-[calc(100%-1.5rem)] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <DialogHeader className="shrink-0 border-b px-6 py-4 text-left">
            <DialogTitle>{t('sellerApply.modalTitle')}</DialogTitle>
            <DialogDescription>{t('sellerApply.modalSubtitle')}</DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            {error ? (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <div className="space-y-6">
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">{t('sellerApply.sectionIdentity')}</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="va-business-name">{t('sellerApply.businessName')} *</Label>
                    <Input
                      id="va-business-name"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder={t('sellerApply.businessPlaceholder')}
                      autoComplete="organization"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>{t('sellerApply.businessType')} *</Label>
                    <Select value={businessType} onValueChange={(v) => setBusinessType(v as VendorBusinessDetails['business_type'])}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BUSINESS_TYPES.map(({ value, key }) => (
                          <SelectItem key={value} value={value}>
                            {t(key)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="va-tin">{t('sellerApply.registrationTin')}</Label>
                    <Input
                      id="va-tin"
                      value={registrationOrTin}
                      onChange={(e) => setRegistrationOrTin(e.target.value)}
                      placeholder={t('sellerApply.registrationTinPlaceholder')}
                    />
                    <p className="text-xs text-muted-foreground">{t('sellerApply.registrationTinHint')}</p>
                  </div>
                </div>
              </section>

              <Separator />

              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">{t('sellerApply.sectionLocation')}</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="va-address">{t('sellerApply.physicalAddress')} *</Label>
                    <Input
                      id="va-address"
                      required
                      value={physicalAddress}
                      onChange={(e) => setPhysicalAddress(e.target.value)}
                      placeholder={t('sellerApply.physicalAddressPlaceholder')}
                      autoComplete="street-address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="va-city">{t('sellerApply.city')} *</Label>
                    <Input
                      id="va-city"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder={t('sellerApply.cityPlaceholder')}
                      autoComplete="address-level2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="va-region">{t('sellerApply.region')} *</Label>
                    <Input
                      id="va-region"
                      required
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder={t('sellerApply.regionPlaceholder')}
                    />
                  </div>
                </div>
              </section>

              <Separator />

              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">{t('sellerApply.sectionContact')}</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="va-phone">{t('sellerApply.contactPhone')} *</Label>
                    <Input
                      id="va-phone"
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder={t('sellerApply.phonePlaceholder')}
                      autoComplete="tel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="va-email">{t('sellerApply.businessEmail')} *</Label>
                    <Input
                      id="va-email"
                      type="email"
                      required
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      placeholder={t('sellerApply.businessEmailPlaceholder')}
                      autoComplete="email"
                    />
                  </div>
                </div>
              </section>

              <Separator />

              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">{t('sellerApply.sectionOperations')}</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="va-brands">{t('sellerApply.brandsCategories')} *</Label>
                    <Textarea
                      id="va-brands"
                      required
                      value={brandsCategories}
                      onChange={(e) => setBrandsCategories(e.target.value)}
                      placeholder={t('sellerApply.brandsCategoriesPlaceholder')}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">{t('sellerApply.brandsCategoriesHint')}</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="va-years">{t('sellerApply.yearsInBusiness')}</Label>
                      <Input
                        id="va-years"
                        value={yearsInBusiness}
                        onChange={(e) => setYearsInBusiness(e.target.value)}
                        placeholder={t('sellerApply.yearsInBusinessPlaceholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="va-web">{t('sellerApply.websiteOrSocial')}</Label>
                      <Input
                        id="va-web"
                        value={websiteOrSocial}
                        onChange={(e) => setWebsiteOrSocial(e.target.value)}
                        placeholder={t('sellerApply.websiteOrSocialPlaceholder')}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="va-notes">{t('sellerApply.additionalNotes')}</Label>
                    <Textarea
                      id="va-notes"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder={t('sellerApply.additionalNotesPlaceholder')}
                      rows={3}
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          <DialogFooter className="shrink-0 border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={submitting}>
              {t('sellerApply.modalCancel')}
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('sellerApply.submitting')}
                </>
              ) : (
                t('sellerApply.submit')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
