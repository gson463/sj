import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/lib/i18n/language-context'
import { AppProviders } from '@/components/app-providers'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: {
    default: 'SIMU JIJI - Lipa Kidogo Kidogo',
    template: '%s | SIMU JIJI',
  },
  description:
    'Multivendor phone marketplace in Tanzania: sellers list phones and accessories; buy cash or with Lipa Kidogo Kidogo. Soko la simu na wauzaji mbalimbali.',
  keywords: [
    'simu',
    'phone',
    'tanzania',
    'lipa kidogo',
    'mobile',
    'smartphone',
    'deposit',
    'payment plan',
    'marketplace',
    'multivendor',
  ],
  authors: [{ name: 'SIMU JIJI' }],
  creator: 'SIMU JIJI',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1a539b' },
    { media: '(prefers-color-scheme: dark)', color: '#2d6bb8' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <LanguageProvider>
          <AppProviders>{children}</AppProviders>
        </LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
