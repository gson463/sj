import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Browse phones and accessories from trusted sellers on SIMU JIJI — filter, search, and shop with Lipa Kidogo.',
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}
