'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'

const wrapClass = 'block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'

/**
 * Wraps children in a link when `href` is set. Supports https, internal paths (/shop), hash (#id), mailto, tel.
 */
export function CmsOptionalLink({
  href,
  className,
  children,
}: {
  href: string | null | undefined
  className?: string
  children: ReactNode
}) {
  const raw = href?.trim()
  if (!raw) return <>{children}</>

  const cn = [wrapClass, className].filter(Boolean).join(' ')

  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return (
      <a href={raw} target="_blank" rel="noopener noreferrer" className={cn}>
        {children}
      </a>
    )
  }
  if (raw.startsWith('/') || raw.startsWith('#')) {
    return (
      <Link href={raw} className={cn}>
        {children}
      </Link>
    )
  }
  if (raw.startsWith('mailto:') || raw.startsWith('tel:')) {
    return (
      <a href={raw} className={cn}>
        {children}
      </a>
    )
  }

  return <>{children}</>
}
