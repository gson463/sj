import { redirect } from 'next/navigation'

type SearchParams = Record<string, string | string[] | undefined>

function buildQuery(searchParams: SearchParams): string {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      value.forEach((v) => qs.append(key, v))
    } else {
      qs.set(key, value)
    }
  }
  return qs.toString()
}

/** Legacy `/products` URL — the storefront catalog lives at `/shop`. */
export default async function ProductsCatalogRedirect({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const q = buildQuery(sp)
  redirect(q ? `/shop?${q}` : '/shop')
}
