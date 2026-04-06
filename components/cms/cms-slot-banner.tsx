'use client'

import { getBannerSlot } from '@/lib/cms-resolve'
import type { CmsSiteSettings } from '@/lib/types'
import { CmsBannerView } from '@/components/cms/cms-banner-view'

type Props = {
  cms: CmsSiteSettings | null | undefined
  slotId: string
  /** wide strip vs compact */
  variant?: 'wide' | 'compact'
  priority?: boolean
}

export function CmsSlotBanner({ cms, slotId, variant = 'wide', priority }: Props) {
  const row = cms && 'banner_slots' in cms ? cms : null
  const slot = row ? getBannerSlot(row as CmsSiteSettings, slotId) : null
  if (!slot) return null

  const aspect =
    variant === 'wide' ? 'aspect-[21/9] max-h-[min(420px,38vh)]' : 'aspect-[3/1] max-h-40'

  return (
    <div className="w-full px-3 py-2 sm:px-4">
      <CmsBannerView
        slot={slot}
        aspectClassName={aspect}
        className="rounded-xl shadow-sm"
        priority={priority}
      />
    </div>
  )
}
