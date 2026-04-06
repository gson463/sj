/**
 * Supabase may infer `tags` as object or array for nested selects on product_tags.
 */
export function tagNamesFromJoinRows(
  rows: { tags: unknown }[] | null | undefined,
): string[] {
  const names: string[] = []
  for (const row of rows || []) {
    const t = row.tags
    if (t == null) continue
    if (Array.isArray(t)) {
      for (const x of t) {
        if (x && typeof x === 'object' && 'name' in x) {
          const n = (x as { name: string }).name
          if (typeof n === 'string' && n) names.push(n)
        }
      }
    } else if (typeof t === 'object' && 'name' in t) {
      const n = (t as { name: string }).name
      if (typeof n === 'string' && n) names.push(n)
    }
  }
  return [...new Set(names)]
}
