import { AdminShippingContent } from '@/components/admin/admin-shipping-content'

export const metadata = {
  title: 'Shipping zones | Admin',
}

export default function AdminShippingPage() {
  return <AdminShippingContent initialTab="zones" />
}
