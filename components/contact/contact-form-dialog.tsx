'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export type ContactFormCopy = {
  title: string
  description: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  send: string
  sending: string
  success: string
  dismiss: string
}

type ContactFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  copy: ContactFormCopy
}

export function ContactFormDialog({ open, onOpenChange, copy }: ContactFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  const handleClose = (next: boolean) => {
    if (!next) {
      setSubmitted(false)
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[min(90vh,640px)] gap-0 overflow-y-auto border-sky-200/70 p-0 sm:max-w-lg">
        <div className="border-b border-sky-100/80 bg-sky-50/50 px-6 py-4">
          <DialogHeader>
            <DialogTitle>{copy.title}</DialogTitle>
            <DialogDescription>{copy.description}</DialogDescription>
          </DialogHeader>
        </div>
        <div className="px-6 py-5">
          {submitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <Send className="h-7 w-7 text-green-600" />
              </div>
              <p className="font-medium text-foreground">{copy.success}</p>
              <Button type="button" className="mt-6" onClick={() => handleClose(false)}>
                {copy.dismiss}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {copy.name}
                  </label>
                  <Input required placeholder={copy.name} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {copy.email}
                  </label>
                  <Input type="email" required placeholder={copy.email} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {copy.phone}
                  </label>
                  <Input type="tel" placeholder="+255 xxx xxx xxx" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {copy.subject}
                  </label>
                  <Input required placeholder={copy.subject} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {copy.message}
                </label>
                <Textarea required placeholder={copy.message} rows={5} />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? copy.sending : copy.send}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
