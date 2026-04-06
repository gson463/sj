import type { CmsBannerSlotContent } from '@/lib/types'

/** Declares where each banner appears and recommended creative size (for admin UI). */
export type CmsBannerSlotMeta = {
  id: string
  /** Short label for admins */
  labelEn: string
  labelSw: string
  /** Where it shows on the site */
  placementEn: string
  placementSw: string
  /** Recommended pixel size (design guide) */
  sizeHint: string
  /** e.g. "16 / 9" for layout hint */
  aspectHint?: string
}

export const CMS_BANNER_SLOTS: CmsBannerSlotMeta[] = [
  {
    id: 'auth_modal',
    labelEn: 'Login & sign-up modal',
    labelSw: 'Modal ya kuingia na kujisajili',
    placementEn: 'Left panel on auth dialog (desktop); top on mobile',
    placementSw: 'Paneli ya kushoto kwenye dirisha la kuingia (desktop); juu kwenye simu',
    sizeHint: '900 × 1100 px (portrait) or 1200 × 800 px',
    aspectHint: '4 / 5',
  },
  {
    id: 'home_hero_wide',
    labelEn: 'Home — wide banner (top)',
    labelSw: 'Nyumbani — bango pana (juu)',
    placementEn: 'First full-width strip on homepage (below header)',
    placementSw: 'Mstari wa kwanza wa pana ukurasa wa nyumbani (chini ya header)',
    sizeHint: '1600 × 420 px',
    aspectHint: '21 / 9',
  },
  {
    id: 'home_hero_side',
    labelEn: 'Home — hero image (beside headline)',
    labelSw: 'Nyumbani — picha ya hero (kando ya kichwa)',
    placementEn: 'Large image on the right of the hero text (split layout on desktop)',
    placementSw: 'Picha kubwa upande wa kulia wa maandishi ya hero (desktop)',
    sizeHint: '600 × 600 px (square)',
    aspectHint: '1 / 1',
  },
  {
    id: 'home_promo_left',
    labelEn: 'Home — promo card (left)',
    labelSw: 'Nyumbani — kadi ya matangazo (kushoto)',
    placementEn: 'Left card in the two-column promo row (Lipa Kidogo area)',
    placementSw: 'Kadi ya kushoto kwenye safu ya matangazo mawili',
    sizeHint: '640 × 360 px',
    aspectHint: '16 / 9',
  },
  {
    id: 'home_promo_right',
    labelEn: 'Home — promo card (right)',
    labelSw: 'Nyumbani — kadi ya matangazo (kulia)',
    placementEn: 'Right card in the two-column promo row',
    placementSw: 'Kadi ya kulia kwenye safu ya matangazo mawili',
    sizeHint: '640 × 360 px',
    aspectHint: '16 / 9',
  },
  {
    id: 'shop_top',
    labelEn: 'Shop page — top banner',
    labelSw: 'Ukurasa wa duka — bango juu',
    placementEn: 'Above search and filters on /shop',
    placementSw: 'Juu ya utafutaji na vichujio kwenye /shop',
    sizeHint: '1400 × 240 px',
    aspectHint: '6 / 1',
  },
  {
    id: 'about_top',
    labelEn: 'About page — top banner',
    labelSw: 'Kuhusu — bango juu',
    placementEn: 'Top of /about below header',
    placementSw: 'Juu ya /about chini ya header',
    sizeHint: '1200 × 400 px',
    aspectHint: '3 / 1',
  },
]

export function emptySlot(): CmsBannerSlotContent {
  return {
    image_url: null,
    link_url: null,
    alt: null,
    enabled: true,
  }
}

export function normalizeSlot(raw: unknown): CmsBannerSlotContent {
  if (!raw || typeof raw !== 'object') return emptySlot()
  const o = raw as Record<string, unknown>
  return {
    image_url: typeof o.image_url === 'string' ? o.image_url : null,
    link_url: typeof o.link_url === 'string' ? o.link_url : null,
    alt: typeof o.alt === 'string' ? o.alt : null,
    enabled: o.enabled === false ? false : true,
  }
}
