'use client'

import { useLanguage } from '@/lib/i18n/language-context'
import { RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function ReturnsPage() {
  const { locale } = useLanguage()

  const content = locale === 'en' ? {
    title: 'Return Policy',
    subtitle: 'We want you to be completely satisfied with your purchase',
    sections: [
      {
        title: 'Return Period',
        text: 'You can return a product within 7 days of receiving it if it is defective or not as described.',
        icon: Clock,
      },
      {
        title: 'Eligible for Return',
        icon: CheckCircle,
        items: [
          'Products with manufacturing defects',
          'Products that do not match the description',
          'Products damaged during delivery',
          'Products with missing accessories',
        ]
      },
      {
        title: 'Not Eligible for Return',
        icon: XCircle,
        items: [
          'Products with physical damage caused by the customer',
          'Products with water damage',
          'Products that have been repaired by unauthorized service centers',
          'Products without original packaging',
          'Products purchased more than 7 days ago',
        ]
      },
    ],
    process: {
      title: 'How to Return',
      steps: [
        { step: '1', title: 'Contact Us', text: 'Call us at +255 123 456 789 or email returns@simujiji.co.tz within 7 days of receiving your product.' },
        { step: '2', title: 'Get Return Authorization', text: 'We will provide a return authorization number and instructions.' },
        { step: '3', title: 'Ship the Product', text: 'Pack the product with all original accessories and ship it to our address.' },
        { step: '4', title: 'Receive Replacement/Refund', text: 'Once we verify the issue, we will send a replacement or process a refund within 5-7 business days.' },
      ]
    },
    lipaKidogo: {
      title: 'Lipa Kidogo Kidogo Cancellation',
      text: 'If you wish to cancel your Lipa Kidogo Kidogo plan before receiving your phone:',
      items: [
        'Contact us to request cancellation',
        'A 5% administrative fee will be deducted from your refund',
        'Refunds are processed within 14 business days',
        'Refund will be sent to your original payment method',
      ]
    }
  } : {
    title: 'Sera ya Kurudisha',
    subtitle: 'Tunataka uridhike kabisa na ununuzi wako',
    sections: [
      {
        title: 'Muda wa Kurudisha',
        text: 'Unaweza kurudisha bidhaa ndani ya siku 7 tangu uipokee ikiwa ina kasoro au si kama ilivyoelezwa.',
        icon: Clock,
      },
      {
        title: 'Zinazostahiki Kurudishwa',
        icon: CheckCircle,
        items: [
          'Bidhaa zenye kasoro za utengenezaji',
          'Bidhaa ambazo hazilingani na maelezo',
          'Bidhaa zilizoharibiwa wakati wa usafirishaji',
          'Bidhaa zenye vifaa vinavyokosekana',
        ]
      },
      {
        title: 'Hazistahiki Kurudishwa',
        icon: XCircle,
        items: [
          'Bidhaa zenye uharibifu wa kimwili uliosababishwa na mteja',
          'Bidhaa zenye uharibifu wa maji',
          'Bidhaa ambazo zimerekebishwa na vituo visivyoidhinishwa',
          'Bidhaa bila ufungaji wa asili',
          'Bidhaa zilizununuliwa zaidi ya siku 7 zilizopita',
        ]
      },
    ],
    process: {
      title: 'Jinsi ya Kurudisha',
      steps: [
        { step: '1', title: 'Wasiliana Nasi', text: 'Tupigie simu +255 123 456 789 au tuma email returns@simujiji.co.tz ndani ya siku 7 tangu upokee bidhaa yako.' },
        { step: '2', title: 'Pata Idhini ya Kurudisha', text: 'Tutakupa namba ya idhini ya kurudisha na maelekezo.' },
        { step: '3', title: 'Tuma Bidhaa', text: 'Funga bidhaa na vifaa vyote vya asili na utume kwa anwani yetu.' },
        { step: '4', title: 'Pokea Badiliko/Rudisha Pesa', text: 'Mara tutakapothibitisha tatizo, tutatuma badiliko au kushughulikia rudisha pesa ndani ya siku 5-7 za kazi.' },
      ]
    },
    lipaKidogo: {
      title: 'Kughairi Lipa Kidogo Kidogo',
      text: 'Ukitaka kughairi mpango wako wa Lipa Kidogo Kidogo kabla ya kupokea simu yako:',
      items: [
        'Wasiliana nasi kuomba kughairi',
        'Ada ya utawala ya 5% itakatwa kutoka kwenye rudisha pesa yako',
        'Rudisha pesa zinashughulikiwa ndani ya siku 14 za kazi',
        'Rudisha pesa itatumwa kwa njia yako ya malipo ya asili',
      ]
    }
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <RotateCcw className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">{content.title}</h1>
          <p className="mt-4 text-muted-foreground">{content.subtitle}</p>
        </div>

        {/* Main Sections */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {content.sections.map((section, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <section.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3 font-bold text-foreground">{section.title}</h3>
                {'text' in section ? (
                  <p className="text-sm text-muted-foreground">{section.text}</p>
                ) : (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {section.items?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">{content.process.title}</h2>
          <div className="space-y-4">
            {content.process.steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lipa Kidogo Section */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="mb-3 font-bold text-foreground">{content.lipaKidogo.title}</h3>
            <p className="mb-4 text-sm text-muted-foreground">{content.lipaKidogo.text}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {content.lipaKidogo.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
