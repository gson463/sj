'use client'

import { LanguageSwitcher } from '@/components/language-switcher'

/** Fixed position so login/sign-up/error pages can switch locale without the store Header. */
export function AuthLanguageBar() {
  return (
    <div className="fixed right-4 top-4 z-50">
      <LanguageSwitcher />
    </div>
  )
}
