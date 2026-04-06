'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useLanguage } from '@/lib/i18n/language-context'

export type LoginFormProps = {
  variant?: 'page' | 'modal'
  /** After login, go here (e.g. `/checkout?...`) */
  redirectTo?: string | null
  onSuccess?: () => void
  onRequestSignUp?: () => void
}

export function LoginForm({
  variant = 'page',
  redirectTo,
  onSuccess,
  onRequestSignUp,
}: LoginFormProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const { data, error: signError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signError) {
      setError(t('auth.invalidCredentials'))
      setIsLoading(false)
      return
    }

    onSuccess?.()

    if (redirectTo) {
      router.push(redirectTo)
      router.refresh()
      return
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profile?.role === 'admin') {
        router.push('/admin')
      } else if (profile?.role === 'vendor') {
        router.push('/vendor')
      } else {
        router.push('/dashboard')
      }
    } else {
      router.push('/dashboard')
    }
    router.refresh()
  }

  const fields = (
    <>
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor={variant === 'modal' ? 'modal-email' : 'email'}>
          {t('auth.email')}
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={variant === 'modal' ? 'modal-email' : 'email'}
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-sky-100 bg-sky-50/40 pl-9 focus-visible:ring-primary/30"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={variant === 'modal' ? 'modal-password' : 'password'}>
            {t('auth.password')}
          </Label>
          <Link
            href="/auth/forgot-password"
            className="text-xs text-primary hover:underline"
          >
            {t('auth.forgotPassword')}
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={variant === 'modal' ? 'modal-password' : 'password'}
            type={showPassword ? 'text' : 'password'}
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-sky-100 bg-sky-50/40 pl-9 pr-9 focus-visible:ring-primary/30"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </>
  )

  const footer = (
    <p className="text-center text-sm text-muted-foreground">
      {t('auth.noAccount')}{' '}
      {onRequestSignUp ? (
        <button
          type="button"
          className="font-medium text-primary hover:underline"
          onClick={onRequestSignUp}
        >
          {t('auth.signUpNow')}
        </button>
      ) : (
        <Link href="/auth/sign-up" className="font-medium text-primary hover:underline">
          {t('auth.signUpNow')}
        </Link>
      )}
    </p>
  )

  if (variant === 'modal') {
    return (
      <form onSubmit={handleLogin} className="space-y-4">
        {fields}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('auth.login')}
        </Button>
        {footer}
      </form>
    )
  }

  return (
    <Card className="w-full max-w-md border-sky-100/80 bg-linear-to-b from-sky-50/50 to-card shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t('auth.welcomeBack')}</CardTitle>
        <CardDescription>{t('auth.loginToContinue')}</CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">{fields}</CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('auth.login')}
          </Button>
          {footer}
        </CardFooter>
      </form>
    </Card>
  )
}
