'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type BrandLogoProps = {
  /** Link target; omit for non-clickable logo */
  href?: string
  /** Square size in pixels (circular logo) */
  size?: number
  className?: string
  imgClassName?: string
  priority?: boolean
  /** Optional text beside the logo (e.g. “Admin”) */
  label?: ReactNode
}

export function BrandLogo({
  href,
  size = 44,
  className,
  imgClassName,
  priority,
  label,
}: BrandLogoProps) {
  const img = (
    <Image
      src="/logo.png"
      alt="SIMU JIJII — Home of Smart Phones"
      width={size}
      height={size}
      className={cn('shrink-0 object-contain', imgClassName)}
      style={{ width: size, height: size, maxWidth: '100%', maxHeight: '100%' }}
      priority={priority}
      sizes={`${size}px`}
    />
  )

  const inner = (
    <span className={cn('inline-flex items-center gap-2', className)}>
      {img}
      {label != null ? (
        <span className="font-bold leading-tight text-foreground">{label}</span>
      ) : null}
    </span>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center">
        {inner}
      </Link>
    )
  }

  return inner
}
