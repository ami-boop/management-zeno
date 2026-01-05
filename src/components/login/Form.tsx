'use client'

import { useState } from 'react'
import Header from './Header'
import EmailField from './EmailField'
import PasswordField from './PasswordField'
import SubmitButton from './SubmitButton'
import { validateEmail, validatePassword } from '@/lib/validation'
import { useTranslations } from 'use-intl'
import { loginAction } from '@/app/actions/auth'
import inputValidation from '@/app/actions/inputValidation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { AlertCircle } from 'lucide-react'

export default function Form() {
  const t = useTranslations('Login')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    if (!validateEmail(email)) {
      setError(t('errors.invalidEmail'))
      return
    }

    if (!validatePassword(password)) {
      setError(t('errors.invalidPassword'))
      return
    }

    setIsSubmitting(true)

    try {
      const { sanitizedEmail, sanitizedPassword } = await inputValidation(
        email,
        password
      )

      const userCredential = await signInWithEmailAndPassword(
        auth,
        sanitizedEmail!,
        sanitizedPassword!
      )

      const result = await loginAction(
        await userCredential.user.getIdToken(true)
      )

      if (result?.error) {
				setError(t(`errors.${result.error}`) || result.error)
				auth.signOut()
			}
			// Если success, то redirect уже произошел на сервере
    } catch (_e: any) {
      setError(t('errors.genericError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='flex justify-center items-center h-screen'>
        <div className='max-w-md w-full'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
            <Header />

            {error && (
              <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
                <p className='text-sm text-red-800' data-testid='error'>{error}</p>
              </div>
            )}

            <form onSubmit={e => handleSubmit(e)} className='space-y-6'>
              <EmailField
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <PasswordField
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <SubmitButton
                isSubmitting={isSubmitting}
                isDisabled={isSubmitting || !email || !password}
              />
            </form>

            <div className='mt-6 p-3 bg-red-50 border border-red-200 rounded-md'>
              <div className='flex'>
                <AlertCircle className='w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5' />
                <p className='text-sm text-red-800'>{t('securityNotice')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
