'use client'

import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface SubmitButtonProps {
	isSubmitting: boolean
	isDisabled: boolean
}

export default function SubmitButton({
	isSubmitting,
	isDisabled,
}: SubmitButtonProps) {
	const t = useTranslations('Login')

	return (
		<button
			type='submit'
			disabled={isDisabled}
			className={`w-full py-3 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
				isDisabled
					? 'bg-gray-400 text-white cursor-not-allowed'
					: 'bg-red-600 text-white hover:bg-red-700'
			}`}
		>
			{isSubmitting ? (
				<div className='flex items-center justify-center'>
					<Loader2 className='animate-spin -ml-1 mr-3 h-4 w-4 text-white' />
					{t('signingIn')}
				</div>
			) : (
				t('signInButton')
			)}
		</button>
	)
}
