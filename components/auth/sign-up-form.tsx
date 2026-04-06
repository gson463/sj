'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Mail, Lock, User, Phone } from 'lucide-react'
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

export type SignUpFormProps = {
  variant?: 'page' | 'modal'
  onSuccess?: () => void
  onRequestLogin?: () => void
}

export function SignUpForm({
  variant = 'page',
  onSuccess,
  onRequestLogin,
}: SignUpFormProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const id = (base: string) => (variant === 'modal' ? `modal-${base}` : base)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password.length < 6) {
      setError(t('auth.passwordMinLength'))
      setIsLoading(false)
      return
    }

    const supabase = createClient()
    const { error: signError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${window.location.origin}/dashboard`,
        data: {
          full_name: fullName,
          phone: phone,
        },
      },
    })

    if (signError) {
      if (signError.message.includes('already registered')) {
        setError(t('auth.emailAlreadyUsed'))
      } else {
        setError(t('auth.genericError'))
      }
      setIsLoading(false)
      return
    }

    onSuccess?.()
    router.push('/auth/sign-up-success')
  }

  const inputClass =
    'border-sky-100 bg-sky-50/40 focus-visible:ring-primary/30'

  const fields = (
    <>
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor={id('fullName')}>{t('auth.fullName')}</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={id('fullName')}
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`pl-9 ${inputClass}`}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={id('phone')}>{t('auth.phone')}</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={id('phone')}
            type="tel"
            placeholder="+255 XXX XXX XXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`pl-9 ${inputClass}`}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={id('email')}>{t('auth.email')}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={id('email')}
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`pl-9 ${inputClass}`}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={id('password')}>{t('auth.password')}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={id('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder={t('auth.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`pl-9 pr-9 ${inputClass}`}
            required
            minLength={6}
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

      <p className="text-xs text-muted-foreground">
        {t('auth.termsAgreement')}{' '}
        <Link href="/terms" className="text-primary hover:underline">
          {t('auth.termsAndConditions')}
        </Link>{' '}
        {t('auth.and')}{' '}
        <Link href="/privacy" className="text-primary hover:underline">
          {t('auth.privacyPolicy')}
        </Link>
      </p>
    </>
  )

  const footer = (
    <p className="text-center text-sm text-muted-foreground">
      {t('auth.hasAccount')}{' '}
      {onRequestLogin ? (
        <button
          type="button"
          className="font-medium text-primary hover:underline"
          onClick={onRequestLogin}
        >
          {t('auth.loginHere')}
        </button>
      ) : (
        <Link href="/auth/login" className="font-medium text-primary hover:underline">
          {t('auth.loginHere')}
        </Link>
      )}
    </p>
  )

  if (variant === 'modal') {
    return (
      <form onSubmit={handleSignUp} className="space-y-4">
        {fields}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('auth.signupButton')}
        </Button>
        {footer}
      </form>
    )
  }

  return (
    <Card className="w-full max-w-md border-sky-100/80 bg-linear-to-b from-sky-50/50 to-card shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t('auth.signup')}</CardTitle>
        <CardDescription>{t('auth.signupDescription')}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSignUp}>
        <CardContent className="space-y-4">{fields}</CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('auth.signupButton')}
          </Button>
          {footer}
        </CardFooter>
      </form>
    </Card>
  )
}
