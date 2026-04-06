'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ProductStockMovement } from '@/lib/types'

export function ProductStockHistory({ productId }: { productId: string }) {
  const [rows, setRows] = useState<ProductStockMovement[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/admin/products/${productId}/movements`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          if (data.error) setError(data.error)
          else setRows(data.movements || [])
        }
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load')
      })
    return () => {
      cancelled = true
    }
  }, [productId])

  if (error) {
    return <p className="text-sm text-muted-foreground">{error}</p>
  }

  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">No stock movements yet.</p>
  }

  return (
    <div className="max-h-64 overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Δ Qty</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Ref</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((m) => (
            <TableRow key={m.id}>
              <TableCell className="whitespace-nowrap text-xs">
                {new Date(m.created_at).toLocaleString()}
              </TableCell>
              <TableCell>{m.qty_delta}</TableCell>
              <TableCell>{m.reason}</TableCell>
              <TableCell className="max-w-[120px] truncate text-xs">{m.ref || '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
