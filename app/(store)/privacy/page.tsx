'use client'

import { useLanguage } from '@/lib/i18n/language-context'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
  const { locale } = useLanguage()

  const content = locale === 'en' ? {
    title: 'Privacy Policy',
    lastUpdated: 'Last Updated: January 2024',
    sections: [
      {
        title: '1. Information We Collect',
        text: 'We collect information you provide when creating an account, making purchases, or contacting us:\n\n• Personal information: name, email, phone number, address\n• Payment information: payment method details (processed securely by our payment partners)\n• Transaction history: orders, payments, and delivery information'
      },
      {
        title: '2. How We Use Your Information',
        text: 'We use your information to:\n\n• Process your orders and payments\n• Deliver products to you\n• Send order confirmations and payment reminders\n• Provide customer support\n• Improve our services\n• Comply with legal requirements'
      },
      {
        title: '3. Information Sharing',
        text: 'We do not sell your personal information. We share information only with:\n\n• Payment processors to complete transactions\n• Delivery partners to fulfill orders\n• Legal authorities when required by law'
      },
      {
        title: '4. Data Security',
        text: 'We implement appropriate security measures to protect your information against unauthorized access, alteration, or destruction. However, no internet transmission is 100% secure.'
      },
      {
        title: '5. Your Rights',
        text: 'You have the right to:\n\n• Access your personal information\n• Correct inaccurate information\n• Request deletion of your data\n• Opt out of marketing communications'
      },
      {
        title: '6. Cookies',
        text: 'We use cookies to improve your experience on our website. You can control cookie settings in your browser.'
      },
      {
        title: '7. Changes to This Policy',
        text: 'We may update this policy periodically. Changes will be posted on this page with an updated revision date.'
      },
      {
        title: '8. Contact Us',
        text: 'For privacy-related questions, contact us at privacy@simujiji.co.tz or call +255 123 456 789.'
      },
    ]
  } : {
    title: 'Sera ya Faragha',
    lastUpdated: 'Imesasishwa: Januari 2024',
    sections: [
      {
        title: '1. Taarifa Tunazokusanya',
        text: 'Tunakusanya taarifa unazotoa unapounda akaunti, kununua, au kuwasiliana nasi:\n\n• Taarifa binafsi: jina, email, namba ya simu, anwani\n• Taarifa za malipo: maelezo ya njia ya malipo (yanashughulikiwa kwa usalama na washirika wetu wa malipo)\n• Historia ya manunuzi: maagizo, malipo, na taarifa za delivery'
      },
      {
        title: '2. Jinsi Tunavyotumia Taarifa Zako',
        text: 'Tunatumia taarifa zako:\n\n• Kushughulikia maagizo na malipo yako\n• Kukupelekea bidhaa\n• Kutuma uthibitisho wa agizo na vikumbusho vya malipo\n• Kutoa msaada wa wateja\n• Kuboresha huduma zetu\n• Kufuata mahitaji ya kisheria'
      },
      {
        title: '3. Kushiriki Taarifa',
        text: 'Hatuuzi taarifa zako binafsi. Tunashiriki taarifa na:\n\n• Washughulikiaji wa malipo kukamilisha manunuzi\n• Washirika wa delivery kutimiza maagizo\n• Mamlaka za kisheria zinapohitajika na sheria'
      },
      {
        title: '4. Usalama wa Data',
        text: 'Tunatekeleza hatua zinazofaa za usalama kulinda taarifa zako dhidi ya upatikanaji usioidhinishwa, kubadilishwa, au kuharibiwa. Hata hivyo, hakuna uwasilishaji wa intaneti ulio salama 100%.'
      },
      {
        title: '5. Haki Zako',
        text: 'Una haki ya:\n\n• Kupata taarifa zako binafsi\n• Kurekebisha taarifa zisizo sahihi\n• Kuomba kufutwa kwa data yako\n• Kujiondoa katika mawasiliano ya masoko'
      },
      {
        title: '6. Vidakuzi (Cookies)',
        text: 'Tunatumia vidakuzi kuboresha uzoefu wako kwenye tovuti yetu. Unaweza kudhibiti mipangilio ya vidakuzi kwenye kivinjari chako.'
      },
      {
        title: '7. Mabadiliko ya Sera Hii',
        text: 'Tunaweza kusasisha sera hii mara kwa mara. Mabadiliko yatawekwa kwenye ukurasa huu na tarehe iliyosasishwa.'
      },
      {
        title: '8. Wasiliana Nasi',
        text: 'Kwa maswali yanayohusiana na faragha, wasiliana nasi kwa privacy@simujiji.co.tz au piga simu +255 123 456 789.'
      },
    ]
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">{content.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">{content.lastUpdated}</p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {content.sections.map((section, index) => (
            <div key={index}>
              <h2 className="mb-3 text-xl font-bold text-foreground">{section.title}</h2>
              <p className="whitespace-pre-line text-muted-foreground leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
