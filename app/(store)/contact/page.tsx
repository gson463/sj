'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/i18n/language-context'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactFormDialog } from '@/components/contact/contact-form-dialog'

export default function ContactPage() {
  const { locale } = useLanguage()
  const [formOpen, setFormOpen] = useState(false)

  const content = locale === 'en' ? {
    title: 'Contact Us',
    subtitle: 'We are here to help you. Reach out or visit our marketplace hub.',
    openForm: 'Send a message',
    form: {
      title: 'Send us a message',
      description: 'We will get back to you as soon as possible.',
      name: 'Your Name',
      email: 'Email Address',
      phone: 'Phone Number',
      subject: 'Subject',
      message: 'Your Message',
      send: 'Send Message',
      sending: 'Sending...',
      success: 'Thank you! We have received your message and will respond soon.',
      dismiss: 'Close',
    },
    info: {
      title: 'Contact Information',
      phone: '+255 123 456 789',
      whatsapp: '+255 123 456 789',
      email: 'info@simujiji.co.tz',
      address: 'Kariakoo, Dar es Salaam, Tanzania',
    },
    hours: {
      title: 'Working Hours',
      weekdays: 'Monday - Friday: 8:00 AM - 6:00 PM',
      saturday: 'Saturday: 9:00 AM - 4:00 PM',
      sunday: 'Sunday: Closed',
    },
    whatsapp: 'Chat on WhatsApp',
  } : {
    title: 'Wasiliana Nasi',
    subtitle: 'Tuko hapa kukusaidia. Wasiliana nasi au tembelea kituo chetu.',
    openForm: 'Tuma ujumbe',
    form: {
      title: 'Tutumie ujumbe',
      description: 'Tutakujibu haraka iwezekanavyo.',
      name: 'Jina Lako',
      email: 'Barua Pepe',
      phone: 'Nambari ya Simu',
      subject: 'Mada',
      message: 'Ujumbe Wako',
      send: 'Tuma Ujumbe',
      sending: 'Inatuma...',
      success: 'Asante! Tumepokea ujumbe wako na tutajibu hivi karibuni.',
      dismiss: 'Funga',
    },
    info: {
      title: 'Taarifa za Mawasiliano',
      phone: '+255 123 456 789',
      whatsapp: '+255 123 456 789',
      email: 'info@simujiji.co.tz',
      address: 'Kariakoo, Dar es Salaam, Tanzania',
    },
    hours: {
      title: 'Masaa ya Kazi',
      weekdays: 'Jumatatu - Ijumaa: 8:00 AM - 6:00 PM',
      saturday: 'Jumamosi: 9:00 AM - 4:00 PM',
      sunday: 'Jumapili: Tumefunga',
    },
    whatsapp: 'Ongea WhatsApp',
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground">{content.title}</h1>
          <p className="mt-4 text-muted-foreground">{content.subtitle}</p>
          <Button className="mt-6" size="lg" type="button" onClick={() => setFormOpen(true)}>
            {content.openForm}
          </Button>
        </div>

        <ContactFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          copy={{
            title: content.form.title,
            description: content.form.description,
            name: content.form.name,
            email: content.form.email,
            phone: content.form.phone,
            subject: content.form.subject,
            message: content.form.message,
            send: content.form.send,
            sending: content.form.sending,
            success: content.form.success,
            dismiss: content.form.dismiss,
          }}
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{content.info.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{content.info.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{content.info.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{content.info.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{content.hours.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-1 text-sm">
                    <p className="text-foreground">{content.hours.weekdays}</p>
                    <p className="text-foreground">{content.hours.saturday}</p>
                    <p className="text-muted-foreground">{content.hours.sunday}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              asChild
            >
              <a
                href="https://wa.me/255123456789"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                {content.whatsapp}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
