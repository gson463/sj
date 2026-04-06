import { AdminShippingContent } from '@/components/admin/admin-shipping-content'

export const metadata = {
  title: 'Shipping methods | Admin',
}

export default function AdminShippingMethodsPage() {
  return <AdminShippingContent initialTab="methods" />
}
