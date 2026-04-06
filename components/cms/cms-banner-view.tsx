'use client'

import Image from 'next/image'
import type { CmsBannerSlotContent } from '@/lib/types'
import { cn } from '@/lib/utils'
import { CmsOptionalLink } from '@/components/cms/cms-optional-link'

type Props = {
  slot: CmsBannerSlotContent | null
  className?: string
  /** e.g. "aspect-[21/9] max-h-[420px]" */
  aspectClassName?: string
  priority?: boolean
}

export function CmsBannerView({ slot, className, aspectClassName, priority }: Props) {
  if (!slot?.image_url?.trim()) return null

  const url = slot.image_url.trim()
  const link = slot.link_url?.trim()
  const alt = slot.alt?.trim() || 'Banner'

  const inner = (
    <div className={cn('relative w-full overflow-hidden rounded-xl bg-muted', aspectClassName, className)}>
      <Image
        src={url}
        alt={alt}
        width={1600}
        height={420}
        className="h-full w-full object-cover"
        priority={priority}
        sizes="100vw"
      />
    </div>
  )

  return (
    <CmsOptionalLink href={link} className="block rounded-xl">
      {inner}
    </CmsOptionalLink>
  )
}
