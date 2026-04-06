import type { CmsBannerSlotContent, CmsSiteSettings } from '@/lib/types'
import { normalizeSlot } from '@/lib/cms-banner-slots'

/** Auth modal fields: prefer `banner_slots.auth_modal`, fallback to legacy columns. */
export function resolveAuthModalCms(row: CmsSiteSettings | null | undefined): {
  auth_modal_ad_image_url: string | null
  auth_modal_ad_link_url: string | null
  auth_modal_ad_alt: string | null
} {
  const slot = row?.banner_slots?.auth_modal
    ? normalizeSlot(row.banner_slots.auth_modal)
    : null
  const img = slot?.image_url?.trim() || row?.auth_modal_ad_image_url?.trim() || null
  const link = slot?.link_url?.trim() || row?.auth_modal_ad_link_url?.trim() || null
  const alt = slot?.alt?.trim() || row?.auth_modal_ad_alt?.trim() || null
  return {
    auth_modal_ad_image_url: img,
    auth_modal_ad_link_url: link,
    auth_modal_ad_alt: alt,
  }
}

export function getBannerSlot(
  row: CmsSiteSettings | null | undefined,
  slotId: string,
): CmsBannerSlotContent | null {
  if (!row?.banner_slots?.[slotId]) return null
  const s = normalizeSlot(row.banner_slots[slotId])
  if (s.enabled === false) return null
  if (!s.image_url?.trim()) return null
  return s
}

/** Slot when enabled, even if image is empty (e.g. hero fallback image + CMS link only). */
export function getBannerSlotEnabled(
  row: CmsSiteSettings | null | undefined,
  slotId: string,
): CmsBannerSlotContent | null {
  if (!row?.banner_slots?.[slotId]) return null
  const s = normalizeSlot(row.banner_slots[slotId])
  if (s.enabled === false) return null
  return s
}
