/**
 * Product category featured images (`categories.image_url`): home “Shop by category” tiles use a
 * fixed 4:3 frame (`aspect-4/3` in `categories-section`). Source assets should match this ratio.
 */
export const CATEGORY_CARD_IMAGE = {
  aspectLabel: '4:3',
  recommendedPx: { w: 800, h: 600 },
} as const
