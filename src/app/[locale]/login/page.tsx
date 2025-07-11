'use client'

import { useState } from 'react'

// Имитация компонента Header
function Header() {
	return (
		<div className='px-8 py-4 border-b border-gray-200 bg-white'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<div className='w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white text-sm font-bold'>
						Z
					</div>
					<span className='text-lg font-semibold text-gray-900'>
						Zeno Administrator
					</span>
				</div>
			</div>
		</div>
	)
}

export default function AdminLoginPage() {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)

	// Имитация функции перевода
	const t = key => {
		const translations = {
			title: 'Administrator Access',
			subtitle: 'Sign in to manage system settings and users',
			usernameLabel: 'Username',
			passwordLabel: 'Password',
			signInButton: 'Sign In as Administrator',
			signingIn: 'Signing in...',
			usernamePlaceholder: 'Enter your username',
			passwordPlaceholder: 'Enter your password',
		}
		return translations[key] || key
	}

	const handleSubmit = async () => {
		setIsSubmitting(true)

		// Имитация отправки
		await new Promise(resolve => setTimeout(resolve, 1500))

		setIsSubmitting(false)
		// Здесь можно добавить логику перенаправления
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<Header />
			<div className='flex justify-center py-12 px-4'>
				<div className='max-w-md w-full'>
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
						{/* Header */}
						<div className='text-center mb-8'>
							<div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
								<svg
									className='w-8 h-8 text-red-600'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
									/>
								</svg>
							</div>
							<h1 className='text-2xl font-bold text-gray-900 mb-2'>
								{t('title')}
							</h1>
							<p className='text-gray-600 text-sm'>{t('subtitle')}</p>
						</div>

						{/* Login Form */}
						<div className='space-y-6'>
							{/* Username Field */}
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									{t('usernameLabel')}
								</label>
								<input
									type='text'
									value={username}
									onChange={e => setUsername(e.target.value)}
									placeholder={t('usernamePlaceholder')}
									className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500'
								/>
							</div>

							{/* Password Field */}
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									{t('passwordLabel')}
								</label>
								<div className='relative'>
									<input
										type={showPassword ? 'text' : 'password'}
										value={password}
										onChange={e => setPassword(e.target.value)}
										placeholder={t('passwordPlaceholder')}
										className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 pr-10'
									/>
									<button
										type='button'
										onClick={() => setShowPassword(!showPassword)}
										className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600'
									>
										{showPassword ? (
											<svg
												className='w-4 h-4'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
												/>
											</svg>
										) : (
											<svg
												className='w-4 h-4'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
												/>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
												/>
											</svg>
										)}
									</button>
								</div>
							</div>

							{/* Submit Button */}
							<button
								onClick={handleSubmit}
								disabled={isSubmitting || !username || !password}
								className={`w-full py-3 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
									isSubmitting || !username || !password
										? 'bg-gray-400 text-white cursor-not-allowed'
										: 'bg-red-600 text-white hover:bg-red-700'
								}`}
							>
								{isSubmitting ? (
									<div className='flex items-center justify-center'>
										<svg
											className='animate-spin -ml-1 mr-3 h-4 w-4 text-white'
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'
										>
											<circle
												className='opacity-25'
												cx='12'
												cy='12'
												r='10'
												stroke='currentColor'
												strokeWidth='4'
											></circle>
											<path
												className='opacity-75'
												fill='currentColor'
												d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
											></path>
										</svg>
										{t('signingIn')}
									</div>
								) : (
									t('signInButton')
								)}
							</button>
						</div>

						{/* Security Notice */}
						<div className='mt-6 p-3 bg-red-50 border border-red-200 rounded-md'>
							<div className='flex'>
								<svg
									className='w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5'
									fill='currentColor'
									viewBox='0 0 20 20'
								>
									<path
										fillRule='evenodd'
										d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
										clipRule='evenodd'
									/>
								</svg>
								<p className='text-sm text-red-800'>
									Administrator access requires elevated privileges. All actions
									are logged and monitored.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
