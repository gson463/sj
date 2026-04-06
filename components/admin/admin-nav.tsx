'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SheetClose } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { ADMIN_NAV_GROUPS, isAdminNavChildActive } from '@/lib/admin-nav'
import type { AdminNavSection } from '@/lib/admin-nav'

type TFn = (key: string) => string

interface AdminNavProps {
  pathname: string
  t: TFn
  sheetMode?: boolean
}

export function AdminNav({ pathname, t, sheetMode }: AdminNavProps) {
  return (
    <ScrollArea className="h-full min-h-0 flex-1">
      <nav className="flex flex-col gap-0 pb-4" aria-label={t('admin.adminDashboard')}>
        {ADMIN_NAV_GROUPS.map((group, gi) => (
          <section
            key={group.id}
            className={cn(gi > 0 && 'mt-5 border-t border-sidebar-border/70 pt-4')}
            aria-labelledby={`admin-nav-group-${group.id}`}
          >
            <h2
              id={`admin-nav-group-${group.id}`}
              className="text-sidebar-foreground/50 mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-[0.14em]"
            >
              {t(group.labelKey)}
            </h2>
            <div className="flex flex-col gap-0.5">
              {group.sections.map((section) => (
                <AdminNavSection
                  key={section.id}
                  section={section}
                  pathname={pathname}
                  t={t}
                  sheetMode={sheetMode}
                />
              ))}
            </div>
          </section>
        ))}
      </nav>
    </ScrollArea>
  )
}

function AdminNavSection({
  section,
  pathname,
  t,
  sheetMode,
}: {
  section: AdminNavSection
  pathname: string
  t: TFn
  sheetMode?: boolean
}) {
  const childActive = section.children.some((c) =>
    isAdminNavChildActive(pathname, c.href, section.children),
  )
  const [open, setOpen] = useState(childActive)

  useEffect(() => {
    if (childActive) setOpen(true)
  }, [childActive, pathname])

  const Icon = section.icon

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        className={cn(
          'group flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors',
          childActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground',
        )}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-sidebar-border/80 bg-sidebar/80 text-sidebar-foreground/90 shadow-sm',
              childActive && 'border-sidebar-primary/40 bg-sidebar-primary/15 text-sidebar-primary',
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </span>
          <span className="truncate tracking-tight">{t(section.labelKey)}</span>
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-sidebar-foreground/50 transition-transform duration-200',
            open && 'rotate-180',
          )}
          aria-hidden
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=closed]:animate-none">
        <ul
          className="border-sidebar-border/70 ml-3 mt-1 space-y-0.5 border-l py-1 pl-3"
          role="list"
        >
          {section.children.map((child) => {
            const active = isAdminNavChildActive(pathname, child.href, section.children)
            const className = cn(
              'block rounded-md py-1.5 pl-2.5 pr-2 text-[13px] leading-snug transition-colors',
              active
                ? 'border-sidebar-primary bg-sidebar-primary/15 text-sidebar-primary border-l-2 font-medium [-ml-px] pl-[calc(0.625rem-2px)]'
                : 'text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
            )
            const label = t(child.labelKey)
            const link = (
              <Link href={child.href} className={className}>
                {label}
              </Link>
            )
            return (
              <li key={child.href}>
                {sheetMode ? <SheetClose asChild>{link}</SheetClose> : link}
              </li>
            )
          })}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}
