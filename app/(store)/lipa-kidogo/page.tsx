"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, CreditCard, PiggyBank, Shield, Smartphone, Target, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import { useAuthModal } from "@/components/auth/auth-modal-provider"

export default function LipaKidogoPage() {
  const { locale, t } = useLanguage()
  const { openSignUp } = useAuthModal()
  const isEn = locale === "en"

  const steps = [
    {
      icon: Smartphone,
      title: { en: "Choose Your Phone", sw: "Chagua Simu Yako" },
      description: {
        en: "Browse our catalog and select the phone you want",
        sw: "Tazama orodha yetu na uchague simu unayotaka",
      },
    },
    {
      icon: PiggyBank,
      title: { en: "Make Initial Deposit", sw: "Fanya Amana ya Kwanza" },
      description: {
        en: "Pay at least 30% of the phone price as your first deposit",
        sw: "Lipa angalau 30% ya bei ya simu kama amana yako ya kwanza",
      },
    },
    {
      icon: TrendingUp,
      title: { en: "Continue Saving", sw: "Endelea Kuweka Akiba" },
      description: {
        en: "Make weekly or monthly deposits at your own pace",
        sw: "Fanya amana za kila wiki au mwezi kwa kasi yako mwenyewe",
      },
    },
    {
      icon: Target,
      title: { en: "Complete & Collect", sw: "Kamilisha na Chukua" },
      description: {
        en: "Once you reach 100%, collect your brand new phone!",
        sw: "Unapofikia 100%, chukua simu yako mpya kabisa!",
      },
    },
  ]

  const benefits = [
    {
      icon: Shield,
      title: { en: "No Interest Charges", sw: "Hakuna Riba" },
      description: {
        en: "Pay only the phone price - no hidden fees or interest",
        sw: "Lipa bei ya simu tu - hakuna ada za siri au riba",
      },
    },
    {
      icon: CreditCard,
      title: { en: "Flexible Payments", sw: "Malipo Rahisi" },
      description: {
        en: "Pay via M-Pesa, Tigo Pesa, Airtel Money, or Bank",
        sw: "Lipa kupitia M-Pesa, Tigo Pesa, Airtel Money, au Benki",
      },
    },
    {
      icon: Users,
      title: { en: "Build Credit History", sw: "Jenga Historia ya Mkopo" },
      description: {
        en: "Your payment history helps you qualify for better deals",
        sw: "Historia yako ya malipo inakusaidia kupata ofa bora zaidi",
      },
    },
  ]

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <section className="bg-linear-to-br from-primary/10 via-primary/5 to-background px-3 py-12 sm:px-4 md:py-24">
        <div className="container mx-auto text-center">
          <h1 className="mb-6 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            {t("nav.lipaKidogo")}
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-base text-muted-foreground sm:text-xl md:text-2xl">
            {isEn
              ? "Own your dream phone by saving little by little. No loans, no interest - just smart saving!"
              : "Miliki simu yako ya ndoto kwa kuweka akiba kidogo kidogo. Hakuna mikopo, hakuna riba - ni kuweka akiba kwa busara!"}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="px-8 text-lg">
              <Link href="/shop">{t("common.startSaving")}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              type="button"
              className="border-sky-200 bg-sky-50/80 px-8 text-lg hover:bg-sky-100/80"
              onClick={openSignUp}
            >
              {t("common.createAccount")}
            </Button>
          </div>
        </div>
      </section>

      <section className="overflow-x-clip py-12 md:py-24">
        <div className="container mx-auto px-3 sm:px-4">
          <h2 className="mb-4 text-center text-2xl font-bold sm:text-3xl md:text-4xl">{t("common.howItWorks")}</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            {isEn ? "Get your phone in 4 simple steps" : "Pata simu yako kwa hatua 4 rahisi"}
          </p>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Card key={index} className="relative overflow-visible border-2 text-center transition-colors hover:border-primary">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                  <CardTitle className="text-xl">{isEn ? step.title.en : step.title.sw}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {isEn ? step.description.en : step.description.sw}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-x-clip bg-muted/30 py-12 md:py-24">
        <div className="container mx-auto px-3 sm:px-4">
          <h2 className="mb-4 text-center text-2xl font-bold sm:text-3xl md:text-4xl">
            {isEn ? `Why Choose ${t("nav.lipaKidogo")}?` : `Kwa Nini Uchague ${t("nav.lipaKidogo")}?`}
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            {isEn
              ? "Smart savings, no debt, your dream phone"
              : "Akiba ya busara, hakuna deni, simu yako ya ndoto"}
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <benefit.icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{isEn ? benefit.title.en : benefit.title.sw}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {isEn ? benefit.description.en : benefit.description.sw}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-x-clip py-12 md:py-24">
        <div className="container mx-auto px-3 sm:px-4">
          <h2 className="mb-12 text-center text-2xl font-bold sm:text-3xl md:text-4xl">
            {isEn ? "Example: Samsung Galaxy A54" : "Mfano: Samsung Galaxy A54"}
          </h2>
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                {isEn ? "Phone Price: TZS 850,000" : "Bei ya Simu: TZS 850,000"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b py-3">
                <span className="text-muted-foreground">
                  {isEn ? "Initial Deposit (30%)" : "Amana ya Kwanza (30%)"}
                </span>
                <span className="font-semibold">TZS 255,000</span>
              </div>
              <div className="flex items-center justify-between border-b py-3">
                <span className="text-muted-foreground">{isEn ? "Remaining Balance" : "Kiasi Kilichobaki"}</span>
                <span className="font-semibold">TZS 595,000</span>
              </div>
              <div className="flex items-center justify-between border-b py-3">
                <span className="text-muted-foreground">
                  {isEn ? "Weekly Deposits (12 weeks)" : "Amana za Kila Wiki (wiki 12)"}
                </span>
                <span className="font-semibold">TZS 49,583/week</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-primary/10 px-4 py-3">
                <span className="font-semibold">{isEn ? "Total Interest" : "Jumla ya Riba"}</span>
                <span className="text-xl font-bold text-primary">TZS 0</span>
              </div>
              <div className="space-y-2 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  {isEn ? "No hidden fees" : "Hakuna ada za siri"}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  {isEn ? "Pay at your own pace" : "Lipa kwa kasi yako mwenyewe"}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  {isEn ? "Phone reserved for you" : "Simu imehifadhiwa kwako"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="overflow-x-clip bg-primary px-3 py-12 text-primary-foreground sm:px-4 md:py-24">
        <div className="container mx-auto text-center">
          <h2 className="mb-6 text-2xl font-bold sm:text-3xl md:text-4xl">
            {isEn ? "Ready to Start Saving?" : "Tayari Kuanza Kuweka Akiba?"}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
            {isEn
              ? `Join thousands of Tanzanians who have gotten their dream phones through ${t("nav.lipaKidogo")}`
              : `Jiunge na maelfu ya Watanzania ambao wamepata simu zao za ndoto kupitia ${t("nav.lipaKidogo")}`}
          </p>
          <Button size="lg" variant="secondary" asChild className="px-8 text-lg">
            <Link href="/shop">{t("hero.cta_browse")}</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
