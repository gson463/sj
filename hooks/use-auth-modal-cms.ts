'use client'

import { useEffect, useState } from 'react'

export type AuthModalCmsPayload = {
  auth_modal_ad_image_url: string | null
  auth_modal_ad_link_url: string | null
  auth_modal_ad_alt: string | null
}

export function useAuthModalCms() {
  const [data, setData] = useState<AuthModalCmsPayload | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/site-settings')
      .then((r) => r.json())
      .then((j: AuthModalCmsPayload) => {
        if (cancelled) return
        setData({
          auth_modal_ad_image_url: j.auth_modal_ad_image_url ?? null,
          auth_modal_ad_link_url: j.auth_modal_ad_link_url ?? null,
          auth_modal_ad_alt: j.auth_modal_ad_alt ?? null,
        })
      })
      .catch(() => {
        if (!cancelled) {
          setData({
            auth_modal_ad_image_url: null,
            auth_modal_ad_link_url: null,
            auth_modal_ad_alt: null,
          })
        }
      })
      .finally(() => {
        if (!cancelled) setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { data, loaded }
}
