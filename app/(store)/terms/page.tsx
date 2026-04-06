'use client'

import { useLanguage } from '@/lib/i18n/language-context'
import { FileText } from 'lucide-react'

export default function TermsPage() {
  const { locale } = useLanguage()

  const content = locale === 'en' ? {
    title: 'Terms and Conditions',
    lastUpdated: 'Last Updated: January 2024',
    sections: [
      {
        title: '1. Introduction',
        text: 'Welcome to SIMU JIJI. By using our website and services, you agree to these terms and conditions. Please read them carefully before making any purchase or using our Lipa Kidogo Kidogo payment plan.'
      },
      {
        title: '2. Lipa Kidogo Kidogo Terms',
        text: 'The Lipa Kidogo Kidogo plan allows customers to purchase phones through installment payments. Key terms include:\n\n• Minimum deposit of 10% of the phone price is required to start a plan\n• No interest or hidden fees are charged\n• Payments can be made at any time in any amount\n• The phone price is locked for 6 months from the date of first deposit\n• The phone is released only after full payment is completed\n• Refunds are available minus a 5% administrative fee if you cancel before receiving the phone'
      },
      {
        title: '3. Payments',
        text: 'We accept payments through M-Pesa, Tigo Pesa, Airtel Money, Halopesa, bank transfers, and card payments. All payments are processed securely through our payment partners. Customers are responsible for ensuring correct payment details.'
      },
      {
        title: '4. Product Warranty',
        text: 'All phones sold come with manufacturer warranty of at least 12 months. Warranty covers manufacturing defects only. Physical damage, water damage, and unauthorized repairs void the warranty.'
      },
      {
        title: '5. Delivery',
        text: 'We deliver across Tanzania. Delivery times vary by location: 1-2 business days for Dar es Salaam, 3-5 business days for other regions. Customers must be available to receive delivery and verify the product condition upon receipt.'
      },
      {
        title: '6. Returns and Refunds',
        text: 'Products can be returned within 7 days if defective. Refund requests for Lipa Kidogo Kidogo plans are processed within 14 business days. A 5% administrative fee applies to cancelled payment plans.'
      },
      {
        title: '7. Privacy',
        text: 'We collect and use your personal information as described in our Privacy Policy. By using our services, you consent to our data practices.'
      },
      {
        title: '8. Changes to Terms',
        text: 'We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated revision date.'
      },
      {
        title: '9. Contact',
        text: 'For questions about these terms, contact us at info@simujiji.co.tz or call +255 123 456 789.'
      },
    ]
  } : {
    title: 'Masharti na Vigezo',
    lastUpdated: 'Imesasishwa: Januari 2024',
    sections: [
      {
        title: '1. Utangulizi',
        text: 'Karibu SIMU JIJI. Kwa kutumia tovuti yetu na huduma zetu, unakubali masharti na vigezo hivi. Tafadhali yasome kwa makini kabla ya kununua au kutumia mpango wetu wa Lipa Kidogo Kidogo.'
      },
      {
        title: '2. Masharti ya Lipa Kidogo Kidogo',
        text: 'Mpango wa Lipa Kidogo Kidogo unaruhusu wateja kununua simu kwa malipo ya awamu. Masharti muhimu ni:\n\n• Amana ya chini ya 10% ya bei ya simu inahitajika kuanza mpango\n• Hakuna riba au ada zilizofichwa\n• Malipo yanaweza kufanywa wakati wowote kwa kiasi chochote\n• Bei ya simu inafungwa kwa miezi 6 tangu tarehe ya amana ya kwanza\n• Simu inatolewa tu baada ya malipo yote kukamilika\n• Rudisha pesa zinapatikana ukipunguza ada ya utawala ya 5% ukighairi kabla ya kupokea simu'
      },
      {
        title: '3. Malipo',
        text: 'Tunakubali malipo kupitia M-Pesa, Tigo Pesa, Airtel Money, Halopesa, uhamisho wa benki, na malipo ya kadi. Malipo yote yanashughulikiwa kwa usalama kupitia washirika wetu wa malipo. Wateja wana wajibu wa kuhakikisha maelezo sahihi ya malipo.'
      },
      {
        title: '4. Dhamana ya Bidhaa',
        text: 'Simu zote zinazouzwa zinakuja na dhamana ya mtengenezaji ya angalau miezi 12. Dhamana inashughulikia kasoro za utengenezaji pekee. Uharibifu wa kimwili, uharibifu wa maji, na marekebisho yasiyoruhusiwa yanabatilisha dhamana.'
      },
      {
        title: '5. Delivery',
        text: 'Tunapeleka Tanzania nzima. Muda wa delivery unatofautiana kwa eneo: siku 1-2 za kazi kwa Dar es Salaam, siku 3-5 za kazi kwa mikoa mingine. Wateja lazima wawepo kupokea delivery na kuthibitisha hali ya bidhaa wakati wa kupokea.'
      },
      {
        title: '6. Kurudisha na Rudisha Pesa',
        text: 'Bidhaa zinaweza kurudishwa ndani ya siku 7 zikiwa na kasoro. Maombi ya kurudisha pesa kwa mipango ya Lipa Kidogo Kidogo yanashughulikiwa ndani ya siku 14 za kazi. Ada ya utawala ya 5% inatumika kwa mipango ya malipo iliyoghairiwa.'
      },
      {
        title: '7. Faragha',
        text: 'Tunakusanya na kutumia taarifa zako binafsi kama ilivyoelezwa katika Sera yetu ya Faragha. Kwa kutumia huduma zetu, unakubali mazoea yetu ya data.'
      },
      {
        title: '8. Mabadiliko ya Masharti',
        text: 'Tunajihifadhi haki ya kubadilisha masharti haya wakati wowote. Mabadiliko yatawekwa kwenye ukurasa huu na tarehe iliyosasishwa.'
      },
      {
        title: '9. Mawasiliano',
        text: 'Kwa maswali kuhusu masharti haya, wasiliana nasi kwa info@simujiji.co.tz au piga simu +255 123 456 789.'
      },
    ]
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <FileText className="h-8 w-8 text-primary" />
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
