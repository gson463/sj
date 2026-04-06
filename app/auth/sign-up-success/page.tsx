'use client'

import Link from 'next/link'
import { Mail, ArrowRight } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/lib/i18n/language-context'

export default function SignUpSuccessPage() {
  const { t } = useLanguage()

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <BrandLogo href="/" size={80} priority />
      <Card className="w-full text-center">
      <CardHeader>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">{t("auth.checkEmail")}</CardTitle>
        <CardDescription>
          {t("auth.confirmationSent")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t("auth.clickLinkToConfirm")}
        </p>
        <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">{t("auth.nextSteps")}</p>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-left">
            <li>{t("auth.step1OpenEmail")}</li>
            <li>{t("auth.step2ClickLink")}</li>
            <li>{t("auth.step3StartShopping")}</li>
          </ol>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/auth/login">
            {t("auth.goToLogin")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" className="w-full" asChild>
          <Link href="/">
            {t("auth.backToHome")}
          </Link>
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}
