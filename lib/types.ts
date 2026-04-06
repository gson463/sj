// Database Types for SIMU JIJI

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  address: string | null
  city: string | null
  role: 'customer' | 'admin' | 'vendor'
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  /** Product category featured image — home “Shop by category” tiles (4:3). */
  image_url: string | null
  created_at: string
}

/** One configurable banner (image is usually a Supabase Storage public URL after upload). */
export type CmsBannerSlotContent = {
  image_url: string | null
  link_url: string | null
  alt: string | null
  enabled?: boolean
}

/** Singleton row `id = 1` — editable in Admin → CMS */
export interface CmsSiteSettings {
  id: number
  auth_modal_ad_image_url: string | null
  auth_modal_ad_link_url: string | null
  auth_modal_ad_alt: string | null
  /** Keyed by slot id — see `lib/cms-banner-slots.ts` */
  banner_slots?: Record<string, CmsBannerSlotContent> | null
  updated_at: string
}

export interface ProductSpecs {
  ram?: string
  storage?: string
  battery?: string
  display?: string
  camera?: string
  sim?: string
  [key: string]: string | undefined
}

export type TaxClass = 'standard' | 'exempt' | 'zero'
export type StockStatus = 'in_stock' | 'out_of_stock' | 'on_backorder'

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  /** Short line for cards / excerpts */
  short_description?: string | null
  sku?: string | null
  barcode?: string | null
  price: number
  compare_price: number | null
  /** Internal cost (admin only) */
  cost_price?: number | null
  tax_class?: TaxClass | null
  /** Minimum selling price guard (optional) */
  minimum_price?: number | null
  category_id: string | null
  /** Marketplace seller (profile id); null = platform listing */
  seller_id?: string | null
  brand: string | null
  stock: number
  low_stock_threshold?: number | null
  stock_status?: StockStatus | null
  sort_order?: number | null
  specs: ProductSpecs
  images: string[]
  /** Index in `images` used as primary/OG */
  featured_image_index?: number | null
  meta_title?: string | null
  meta_description?: string | null
  og_image?: string | null
  canonical_url?: string | null
  featured: boolean
  active: boolean
  created_at: string
  updated_at: string
  category?: Category
  tags?: Tag[]
  variants?: ProductVariant[]
}

export interface Tag {
  id: string
  name: string
  slug: string
  created_at?: string
}

export interface ProductVariant {
  id: string
  product_id: string
  sku: string | null
  title: string
  attributes: Record<string, string>
  price: number
  compare_price: number | null
  stock: number
  images: string[]
  sort_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface ProductStockMovement {
  id: string
  product_id: string
  variant_id: string | null
  qty_delta: number
  reason: 'adjustment' | 'sale' | 'return' | 'import' | 'duplicate' | 'initial'
  ref: string | null
  created_by: string | null
  created_at: string
}

export type PaymentType = 'cash' | 'lipa_kidogo'
export type OrderStatus = 'pending' | 'partial' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type DeliveryMethod = 'pickup' | 'delivery'

export interface Order {
  id: string
  user_id: string
  product_id: string
  payment_type: PaymentType
  total_price: number
  amount_paid: number
  status: OrderStatus
  delivery_method: DeliveryMethod
  delivery_address: string | null
  notes: string | null
  created_at: string
  updated_at: string
  product?: Product
}

export type PaymentMethod = 'mpesa' | 'tigopesa' | 'airtelmoney' | 'halopesa' | 'bank' | 'card' | 'cash'
export type PaymentStatus = 'pending' | 'completed' | 'failed'

export interface Payment {
  id: string
  order_id: string
  user_id: string
  amount: number
  payment_method: PaymentMethod
  transaction_ref: string | null
  status: PaymentStatus
  created_at: string
  order?: Order
}

export type WalletStatus = 'active' | 'completed' | 'cancelled'

export interface CustomerWallet {
  id: string
  user_id: string
  order_id: string | null
  product_id: string | null
  target_amount: number
  current_balance: number
  status: WalletStatus
  created_at: string
  updated_at: string
  product?: Product
  order?: Order
}

export type NotificationType = 'info' | 'payment' | 'order' | 'reminder' | 'promo'

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  created_at: string
}

export interface Wishlist {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export type CouponDiscountType = 'percent' | 'fixed'

export interface Coupon {
  id: string
  code: string
  description: string | null
  discount_type: CouponDiscountType
  discount_value: number
  min_order_amount: number
  max_uses: number | null
  uses_count: number
  starts_at: string | null
  expires_at: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface AdminStoreSettings {
  id: number
  shipping_zones: unknown[]
  shipping_methods: unknown[]
  tax_rates: unknown[]
  payment_gateways: Record<string, { enabled?: boolean; label?: string; notes?: string }>
  email_templates: Record<string, { subject?: string; body?: string }>
  updated_at: string
}

// Utility function to format Tanzanian Shillings
export function formatTZS(amount: number): string {
  return new Intl.NumberFormat('sw-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Calculate progress percentage for Lipa Kidogo Kidogo
export function calculateProgress(current: number, target: number): number {
  if (target <= 0) return 0
  return Math.min(Math.round((current / target) * 100), 100)
}
