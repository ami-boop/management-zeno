'use client'

import { useState } from 'react'
import LoginHeader from './LoginHeader'
import SecurityNotice from './SecurityNotice'
import UsernameField from './UsernameField'
import PasswordField from './PasswordField'
import SubmitButton from './SubmitButton'
import { validateEmail, validatePassword } from '@/lib/validation'
import { useTranslations } from 'use-intl'
import { loginAction } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
	const t = useTranslations('Login')
	const router = useRouter()
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
			const formData = new FormData()
			formData.append('email', email)
			formData.append('password', password)

			const result = await loginAction({}, formData)

			if (result.error) {
				setError(t(`errors.${result.error}`) || result.error)
			}
			if (result.success) {
				router.push('/dashboard')
			}
		} catch (_e: any) {
			console.log(_e.message)
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
						<LoginHeader />

						{error && (
							<div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
								<p className='text-sm text-red-800'>{error}</p>
							</div>
						)}

						<form onSubmit={e => handleSubmit(e)} className='space-y-6'>
							<UsernameField
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

						<SecurityNotice />
					</div>
				</div>
			</div>
		</div>
	)
}
