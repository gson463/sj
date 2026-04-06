'use client'

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/lib/i18n/language-context'

export default function AuthErrorPage() {
  const { t } = useLanguage()

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <BrandLogo href="/" size={80} priority />
      <Card className="w-full text-center">
      <CardHeader>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <CardTitle className="text-2xl">{t("auth.errorTitle")}</CardTitle>
        <CardDescription>
          {t("auth.errorDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {t("auth.errorExplanation")}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button className="w-full" asChild>
          <Link href="/auth/login">
            {t("auth.tryLoginAgain")}
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
