'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Loader2, Plus, Pencil, Trash2, Upload } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Category } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

export function AdminCategoriesContent() {
  const { t } = useLanguage()
  const [rows, setRows] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [edit, setEdit] = useState<Category | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [createName, setCreateName] = useState('')
  const [createDesc, setCreateDesc] = useState('')
  const [createImageUrl, setCreateImageUrl] = useState('')
  const [createFile, setCreateFile] = useState<File | null>(null)
  const [createPreviewBlob, setCreatePreviewBlob] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/categories')
    const data = await res.json()
    if (Array.isArray(data)) setRows(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!createFile) {
      setCreatePreviewBlob(null)
      return
    }
    const u = URL.createObjectURL(createFile)
    setCreatePreviewBlob(u)
    return () => URL.revokeObjectURL(u)
  }, [createFile])

  function resetCreateForm() {
    setCreateName('')
    setCreateDesc('')
    setCreateImageUrl('')
    setCreateFile(null)
  }

  async function uploadCategoryImageForId(
    categoryId: string,
    file: File,
    onUpdated?: (cat: Category) => void,
    options?: { manageLoading?: boolean },
  ) {
    const manageLoading = options?.manageLoading !== false
    if (manageLoading) setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('categoryId', categoryId)
      const up = await fetch('/api/admin/categories/upload', { method: 'POST', body: fd })
      const j = await up.json()
      if (!up.ok) {
        alert(j.error || 'Upload failed')
        return
      }
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: j.url }),
      })
      if (!res.ok) {
        alert('Could not save image URL')
        return
      }
      const updated = (await res.json()) as Category
      setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
      onUpdated?.(updated)
    } finally {
      if (manageLoading) setUploading(false)
    }
  }

  async function handleCreate() {
    if (!createName.trim()) return
    setUploading(true)
    try {
      const imageUrlForPost = createFile ? null : createImageUrl.trim() || null
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createName.trim(),
          description: createDesc.trim() || null,
          image_url: imageUrlForPost,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        alert(typeof data.error === 'string' ? data.error : 'Could not create category')
        return
      }
      const cat = data as Category
      if (createFile) {
        await uploadCategoryImageForId(cat.id, createFile, undefined, { manageLoading: false })
      }
      setCreateOpen(false)
      resetCreateForm()
      await load()
    } finally {
      setUploading(false)
    }
  }

  async function saveEdit() {
    if (!edit) return
    const res = await fetch(`/api/admin/categories/${edit.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: edit.name,
        description: edit.description,
        image_url: edit.image_url,
      }),
    })
    if (res.ok) {
      setEdit(null)
      load()
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this category?')) return
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    if (res.ok) load()
  }

  const createPreviewSrc = createPreviewBlob || createImageUrl.trim() || null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('admin.placeholders.categories.title')}</h1>
        <p className="text-muted-foreground">{t('admin.placeholders.categories.body')}</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Product categories: group catalog items. Each category has a <strong>featured image</strong> for the home
              page &quot;Shop by category&quot; tiles (4:3; recommended 800×600 px).
            </CardDescription>
          </div>
          <Button type="button" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add category
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">{t('admin.categoryFeaturedColumn')}</th>
                  <th className="pb-2 pr-4 font-medium">Name</th>
                  <th className="pb-2 pr-4 font-medium">Slug</th>
                  <th className="pb-2 pr-4 font-medium">Description</th>
                  <th className="w-24 pb-2 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2 pr-4 align-middle">
                      {c.image_url?.trim() ? (
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                          <Image
                            src={c.image_url.trim()}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      ) : (
                        <span
                          className="inline-flex h-12 w-16 items-center justify-center rounded-md border border-dashed bg-muted/40 px-1 text-center text-[10px] leading-tight text-muted-foreground"
                          title={t('admin.categoryFeaturedEmpty')}
                        >
                          {t('admin.categoryFeaturedEmpty')}
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-4 font-medium">{c.name}</td>
                    <td className="py-2 pr-4 font-mono text-xs text-muted-foreground">{c.slug}</td>
                    <td className="max-w-xs truncate py-2 pr-4 text-muted-foreground">{c.description || '—'}</td>
                    <td className="py-2">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEdit(c)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => remove(c.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Add — same layout as Edit */}
      <Dialog
        open={createOpen}
        onOpenChange={(o) => {
          setCreateOpen(o)
          if (!o) resetCreateForm()
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('admin.categoryCreateTitle')}</DialogTitle>
            <DialogDescription>{t('admin.categoryCreateDescription')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="cat-create-name">Name</Label>
              <Input
                id="cat-create-name"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cat-create-desc">Description</Label>
              <Textarea
                id="cat-create-desc"
                value={createDesc}
                onChange={(e) => setCreateDesc(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t('admin.categoryImageTitle')}</Label>
              <p className="text-xs text-muted-foreground">{t('admin.categoryImageHint')}</p>
              {createPreviewSrc ? (
                <div className="relative aspect-4/3 w-full max-w-xs overflow-hidden rounded-md border bg-muted">
                  <Image src={createPreviewSrc} alt="" fill className="object-cover" sizes="320px" />
                </div>
              ) : null}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={uploading}
                  onClick={() => document.getElementById('category-image-file-create')?.click()}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('admin.categoryImageUploading')}
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      {t('admin.cmsUpload')}
                    </>
                  )}
                </Button>
                {createFile ? (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setCreateFile(null)}>
                    {t('admin.cmsRemoveImage')}
                  </Button>
                ) : null}
                <input
                  id="category-image-file-create"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  aria-label={t('admin.cmsUpload')}
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null
                    e.target.value = ''
                    setCreateFile(f)
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cat-create-image-url">{t('admin.categoryImageUrlOptional')}</Label>
                <Input
                  id="cat-create-image-url"
                  value={createImageUrl}
                  onChange={(e) => setCreateImageUrl(e.target.value)}
                  placeholder="https://"
                  disabled={!!createFile}
                />
                {createFile ? (
                  <p className="text-xs text-muted-foreground">{t('admin.categoryCreateUrlWhileFile')}</p>
                ) : null}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="button" disabled={uploading || !createName.trim()} onClick={() => void handleCreate()}>
              {t('admin.categoryCreateSubmit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('admin.categoryEditTitle')}</DialogTitle>
            <DialogDescription>{t('admin.categoryEditDescription')}</DialogDescription>
          </DialogHeader>
          {edit && (
            <>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="cat-edit-name">Name</Label>
                  <Input
                    id="cat-edit-name"
                    value={edit.name}
                    onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cat-edit-desc">Description</Label>
                  <Textarea
                    id="cat-edit-desc"
                    value={edit.description || ''}
                    onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t('admin.categoryImageTitle')}</Label>
                  <p className="text-xs text-muted-foreground">{t('admin.categoryImageHint')}</p>
                  {edit.image_url ? (
                    <div className="relative aspect-4/3 w-full max-w-xs overflow-hidden rounded-md border bg-muted">
                      <Image src={edit.image_url} alt="" fill className="object-cover" sizes="320px" />
                    </div>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={uploading}
                      onClick={() => document.getElementById('category-image-file-edit')?.click()}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('admin.categoryImageUploading')}
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          {t('admin.cmsUpload')}
                        </>
                      )}
                    </Button>
                    <input
                      id="category-image-file-edit"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="sr-only"
                      aria-label={t('admin.cmsUpload')}
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        e.target.value = ''
                        if (f && edit) void uploadCategoryImageForId(edit.id, f, (u) => setEdit(u))
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cat-edit-image-url">{t('admin.categoryImageUrlOptional')}</Label>
                    <Input
                      id="cat-edit-image-url"
                      value={edit.image_url || ''}
                      onChange={(e) => setEdit({ ...edit, image_url: e.target.value || null })}
                      placeholder="https://"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEdit(null)}>
                  {t('common.cancel')}
                </Button>
                <Button type="button" onClick={saveEdit}>
                  {t('common.save')}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
