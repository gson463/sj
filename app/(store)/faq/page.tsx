'use client'

import { useLanguage } from '@/lib/i18n/language-context'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { HelpCircle } from 'lucide-react'

export default function FAQPage() {
  const { locale } = useLanguage()

  const content = locale === 'en' ? {
    title: 'Frequently Asked Questions',
    subtitle: 'Find answers to the most common questions about SIMU JIJI',
    categories: [
      {
        title: 'Lipa Kidogo Kidogo',
        faqs: [
          {
            q: 'What is Lipa Kidogo Kidogo?',
            a: 'Lipa Kidogo Kidogo is our flexible payment plan that allows you to buy a phone by paying in small installments. You start with a minimum deposit of 10% and continue paying any amount at any time until you complete the full price.'
          },
          {
            q: 'Is there any interest or hidden fees?',
            a: 'No! There is absolutely no interest or hidden fees. You only pay the phone price, nothing more.'
          },
          {
            q: 'What is the minimum deposit?',
            a: 'The minimum deposit is 10% of the phone price. For example, for a phone costing TZS 500,000, the minimum deposit is TZS 50,000.'
          },
          {
            q: 'How long do I have to complete payment?',
            a: 'There is no time limit! You can pay at your own pace. However, phone prices may change over time, and your locked price is valid for 6 months.'
          },
          {
            q: 'When do I receive my phone?',
            a: 'You receive your phone once you have completed the full payment. We will notify you and arrange for pickup or delivery.'
          },
        ]
      },
      {
        title: 'Payments',
        faqs: [
          {
            q: 'What payment methods do you accept?',
            a: 'We accept M-Pesa, Tigo Pesa, Airtel Money, Halopesa, bank transfers (CRDB, NMB), and cards (Visa, MasterCard).'
          },
          {
            q: 'How do I make a payment?',
            a: 'You can make payments through our website by logging into your account and selecting "Make Payment". You can also pay via mobile money by following the instructions on your dashboard.'
          },
          {
            q: 'Can I pay more than the minimum amount?',
            a: 'Yes! You can pay any amount at any time. The more you pay, the faster you get your phone.'
          },
        ]
      },
      {
        title: 'Orders & Delivery',
        faqs: [
          {
            q: 'Do you deliver across Tanzania?',
            a: 'Yes, we deliver to all regions in Tanzania. Delivery fees vary by location.'
          },
          {
            q: 'How long does delivery take?',
            a: 'Delivery within Dar es Salaam takes 1-2 business days. Other regions take 3-5 business days.'
          },
          {
            q: 'Can I pick up my phone from your store?',
            a: 'Yes! You can choose store pickup at checkout. Our store is located in Kariakoo, Dar es Salaam.'
          },
        ]
      },
      {
        title: 'Products & Warranty',
        faqs: [
          {
            q: 'Are the phones genuine?',
            a: 'Yes, all our phones are 100% genuine and sourced from authorized distributors. We do not sell refurbished or fake products.'
          },
          {
            q: 'What warranty do you offer?',
            a: 'All phones come with a minimum 12-month manufacturer warranty. Some phones have extended warranties.'
          },
          {
            q: 'What if I receive a defective phone?',
            a: 'If you receive a defective phone, contact us within 7 days for a replacement. We have a hassle-free return policy.'
          },
        ]
      },
    ]
  } : {
    title: 'Maswali Yanayoulizwa Mara kwa Mara',
    subtitle: 'Pata majibu ya maswali ya kawaida kuhusu SIMU JIJI',
    categories: [
      {
        title: 'Lipa Kidogo Kidogo',
        faqs: [
          {
            q: 'Lipa Kidogo Kidogo ni nini?',
            a: 'Lipa Kidogo Kidogo ni mpango wetu wa malipo ya kubadilika unaokupa fursa ya kununua simu kwa kulipa kidogo kidogo. Unaanza na amana ya chini ya 10% na kuendelea kulipa kiasi chochote wakati wowote hadi ukamilishe bei kamili.'
          },
          {
            q: 'Je, kuna riba au ada zilizofichwa?',
            a: 'Hapana! Hakuna riba wala ada zilizofichwa kabisa. Unalipa bei ya simu tu, hakuna kingine.'
          },
          {
            q: 'Amana ya chini ni kiasi gani?',
            a: 'Amana ya chini ni 10% ya bei ya simu. Kwa mfano, kwa simu ya bei TZS 500,000, amana ya chini ni TZS 50,000.'
          },
          {
            q: 'Nina muda gani wa kumaliza malipo?',
            a: 'Hakuna kikomo cha muda! Unaweza kulipa kwa kasi yako mwenyewe. Hata hivyo, bei za simu zinaweza kubadilika, na bei yako iliyofungwa ni halali kwa miezi 6.'
          },
          {
            q: 'Nitapata simu yangu lini?',
            a: 'Utapata simu yako mara tu utakapokamilisha malipo yote. Tutakujulisha na kupanga kuchukua au delivery.'
          },
        ]
      },
      {
        title: 'Malipo',
        faqs: [
          {
            q: 'Mnakubali njia gani za malipo?',
            a: 'Tunakubali M-Pesa, Tigo Pesa, Airtel Money, Halopesa, uhamisho wa benki (CRDB, NMB), na kadi (Visa, MasterCard).'
          },
          {
            q: 'Ninafanya malipo vipi?',
            a: 'Unaweza kufanya malipo kupitia tovuti yetu kwa kuingia kwenye akaunti yako na kuchagua "Fanya Malipo". Unaweza pia kulipa kupitia simu kwa kufuata maelekezo kwenye dashibodi yako.'
          },
          {
            q: 'Je, naweza kulipa zaidi ya kiwango cha chini?',
            a: 'Ndiyo! Unaweza kulipa kiasi chochote wakati wowote. Kadri unavyolipa zaidi, ndivyo unavyopata simu yako haraka.'
          },
        ]
      },
      {
        title: 'Maagizo na Delivery',
        faqs: [
          {
            q: 'Je, mnapeleka simu Tanzania nzima?',
            a: 'Ndiyo, tunapeleka mikoa yote Tanzania. Ada za delivery zinatofautiana kulingana na eneo.'
          },
          {
            q: 'Delivery inachukua muda gani?',
            a: 'Delivery ndani ya Dar es Salaam inachukua siku 1-2 za kazi. Mikoa mingine inachukua siku 3-5 za kazi.'
          },
          {
            q: 'Je, naweza kuchukua simu yangu dukani?',
            a: 'Ndiyo! Unaweza kuchagua kuchukua dukani wakati wa checkout. Duka letu liko Kariakoo, Dar es Salaam.'
          },
        ]
      },
      {
        title: 'Bidhaa na Dhamana',
        faqs: [
          {
            q: 'Je, simu ni halisi?',
            a: 'Ndiyo, simu zetu zote ni halisi 100% na zinatoka kwa wasambazaji walioruhusiwa. Hatuuzi bidhaa zilizorekebishwa au bandia.'
          },
          {
            q: 'Mnatoa dhamana gani?',
            a: 'Simu zote zinakuja na dhamana ya mtengenezaji ya angalau miezi 12. Baadhi ya simu zina dhamana ya muda mrefu zaidi.'
          },
          {
            q: 'Je, nikipokea simu yenye kasoro?',
            a: 'Ukipokea simu yenye kasoro, wasiliana nasi ndani ya siku 7 kupata simu mpya. Tuna sera rahisi ya kurudisha.'
          },
        ]
      },
    ]
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">{content.title}</h1>
          <p className="mt-4 text-muted-foreground">{content.subtitle}</p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {content.categories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="mb-4 text-xl font-bold text-foreground">{category.title}</h2>
              <Accordion type="single" collapsible className="w-full">
                {category.faqs.map((faq, faqIndex) => (
                  <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`}>
                    <AccordionTrigger className="text-left">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
