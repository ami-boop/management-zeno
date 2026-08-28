'use client'

import { useState } from 'react'
import Header from './Header'
import EmailField from './EmailField'
import PasswordField from './PasswordField'
import SubmitButton from './SubmitButton'
import { useLocale, useTranslations } from 'next-intl'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { ensureServiceWorkerReady } from '@/lib/service-worker'
import { navigate } from '@/utils/navigate'
import { AlertCircle } from 'lucide-react'

const LOGIN_ERROR_KEYS: Record<string, string> = {
	'auth/invalid-email': 'invalidEmail',
	'auth/invalid-credential': 'invalidCredential',
	'auth/user-not-found': 'userNotFound',
	'auth/wrong-password': 'wrongPassword',
	'auth/too-many-requests': 'tooManyRequests',
	'auth/user-disabled': 'userDisabled',
	'auth/network-request-failed': 'networkError',
}

const getErrorCode = (error: unknown): string => {
	if (typeof error === 'object' && error !== null && 'code' in error) {
		const code = (error as { code?: unknown }).code
		if (typeof code === 'string') return code
	}
	return ''
}

export default function Form() {
  const t = useTranslations('Login')
  const locale = useLocale()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      const tokenResult = await userCredential.user.getIdTokenResult()
      if (tokenResult.claims.role !== 'admin') {
        await auth.signOut()
        setError(t('errors.accessDenied'))
        return
      }

      const swReady = await ensureServiceWorkerReady()
      if (!swReady) {
        setError(t('errors.genericError'))
        return
      }

      navigate(`/${locale}/dashboard`)
    } catch (error) {
      const key = LOGIN_ERROR_KEYS[getErrorCode(error)] ?? 'genericError'
      setError(t(`errors.${key}`))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen bg-zeno-paper'>
      <div className='flex min-h-screen items-center justify-center px-4 py-10'>
        <div className='w-full max-w-md'>
          <div className='zeno-card px-8 py-9'>
            <Header />

            {error && (
              <div className='mb-4 rounded-lg border border-zeno-danger/30 bg-zeno-danger-soft px-4 py-3'>
                <p className='text-sm text-zeno-danger' data-testid='error'>
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-5'>
              <EmailField value={email} onChange={(e) => setEmail(e.target.value)} />
              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <SubmitButton
                isSubmitting={isSubmitting}
                isDisabled={isSubmitting || !email || !password}
              />
            </form>

            <div className='mt-6 flex gap-1.5 rounded-lg border border-zeno-amber/30 bg-zeno-cream px-4 py-3'>
              <AlertCircle className='mt-0.5 h-4 w-4 shrink-0 text-zeno-amber-ink' />
              <p className='text-sm text-zeno-amber-ink'>{t('securityNotice')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
