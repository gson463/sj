'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/i18n/language-context'
import type { CmsSiteSettings } from '@/lib/types'
import { CmsSlotBanner } from '@/components/cms/cms-slot-banner'
import { Users, Shield, Truck, Award, Heart } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'

export default function AboutPage() {
  const { t, locale } = useLanguage()
  const [cms, setCms] = useState<CmsSiteSettings | null>(null)

  useEffect(() => {
    fetch('/api/site-settings')
      .then((r) => r.json())
      .then((j) => setCms(j as CmsSiteSettings))
      .catch(() => setCms(null))
  }, [])

  const content = locale === 'en' ? {
    title: 'About SIMU JIJI',
    subtitle: 'Your trusted partner for mobile phones in Tanzania',
    story: {
      title: 'Our Story',
      text: 'SIMU JIJI is a multivendor marketplace: verified sellers list phones and accessories alongside our own offers, so you can compare and choose with confidence. We started with a simple mission — make quality smartphones accessible to every Tanzanian — and our "Lipa Kidogo Kidogo" program lets you pay in small installments without interest or hidden fees.'
    },
    mission: {
      title: 'Our Mission',
      text: 'To empower Tanzanians with access to quality mobile technology through flexible and affordable payment solutions.'
    },
    vision: {
      title: 'Our Vision',
      text: 'To be Tanzania’s leading mobile marketplace — where many trusted vendors and buyers meet — known for trust, affordability, and excellent service.'
    },
    values: [
      { icon: Shield, title: 'Trust', text: 'We build lasting relationships based on honesty and transparency.' },
      { icon: Heart, title: 'Customer First', text: 'Your satisfaction is our top priority in everything we do.' },
      { icon: Award, title: 'Quality', text: 'We only sell genuine products from authorized distributors.' },
      { icon: Truck, title: 'Convenience', text: 'Easy ordering, flexible payments, and reliable delivery.' },
    ],
    team: {
      title: 'Why Choose Us?',
      points: [
        'No interest on Lipa Kidogo Kidogo plans',
        'Genuine phones with manufacturer warranty',
        'Delivery across all of Tanzania',
        'Friendly customer support in Swahili and English',
        'Secure payment methods including M-Pesa, Tigo Pesa, and more',
      ]
    }
  } : {
    title: 'Kuhusu SIMU JIJI',
    subtitle: 'Mshirika wako wa kuamini kwa simu za mkononi Tanzania',
    story: {
      title: 'Historia Yetu',
      text: 'SIMU JIJI ni soko la wauzaji wengi: wauzaji waliohakikiwa wanapakia simu na vifaa pamoja na matoleo yetu, ili ulinganishe na uchague kwa uaminifu. Tulianza kwa lengo rahisi — kufanya simu bora zipatikane kwa kila Mtanzania — na mpango wetu wa "Lipa Kidogo Kidogo" hukuruhusu kulipa kidogo kidogo bila riba au ada zilizofichwa.'
    },
    mission: {
      title: 'Dhamira Yetu',
      text: 'Kuwawezesha Watanzania kupata teknolojia bora ya simu kupitia njia za malipo rahisi na nafuu.'
    },
    vision: {
      title: 'Maono Yetu',
      text: 'Kuwa soko kuu la simu Tanzania — ambapo wauzaji na wanunuzi wengi wa kuaminika wanakutana — lilojulikana kwa uaminifu, bei nafuu, na huduma bora.'
    },
    values: [
      { icon: Shield, title: 'Uaminifu', text: 'Tunajenga uhusiano wa kudumu unaotegemea uaminifu na uwazi.' },
      { icon: Heart, title: 'Mteja Kwanza', text: 'Kuridhika kwako ni kipaumbele chetu katika kila tunalofanya.' },
      { icon: Award, title: 'Ubora', text: 'Tunauza bidhaa halisi kutoka kwa wasambazaji walioruhusiwa.' },
      { icon: Truck, title: 'Urahisi', text: 'Kuagiza rahisi, malipo ya kubadilika, na delivery ya kuaminika.' },
    ],
    team: {
      title: 'Kwa Nini Utuchague?',
      points: [
        'Hakuna riba kwenye mipango ya Lipa Kidogo Kidogo',
        'Simu halisi zenye dhamana ya mtengenezaji',
        'Delivery kote Tanzania',
        'Huduma ya wateja kwa Kiswahili na Kiingereza',
        'Njia salama za malipo ikiwa ni pamoja na M-Pesa, Tigo Pesa, na zaidi',
      ]
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <CmsSlotBanner cms={cms} slotId="about_top" />
      {/* Hero Section */}
      <section className="bg-primary/5 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="mx-auto mb-6 flex justify-center">
            <BrandLogo size={96} />
          </div>
          <h1 className="text-4xl font-bold text-foreground md:text-5xl">{content.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{content.subtitle}</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-4 text-2xl font-bold text-foreground">{content.story.title}</h2>
          <p className="text-muted-foreground leading-relaxed">{content.story.text}</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl bg-background p-8 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-foreground">{content.mission.title}</h2>
              <p className="text-muted-foreground">{content.mission.text}</p>
            </div>
            <div className="rounded-xl bg-background p-8 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-foreground">{content.vision.title}</h2>
              <p className="text-muted-foreground">{content.vision.text}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {content.values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-primary/5 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground">{content.team.title}</h2>
          <ul className="space-y-4">
            {content.team.points.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {index + 1}
                </div>
                <span className="text-muted-foreground">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
