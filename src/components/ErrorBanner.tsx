'use client'

import type { ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorBannerProps {
	message: ReactNode
	onRetry?: () => void
	retryLabel?: ReactNode
}

/** Red load-failure banner, optionally with a retry button. */
export default function ErrorBanner({ message, onRetry, retryLabel }: ErrorBannerProps) {
	return (
		<div className='mb-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
			<AlertCircle className='h-4 w-4 shrink-0' />
			<span className='flex-1'>{message}</span>
			{onRetry && (
				<button
					type='button'
					onClick={onRetry}
					className='inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-red-800 hover:text-red-900'
				>
					<RefreshCw className='h-4 w-4' />
					{retryLabel}
				</button>
			)}
		</div>
	)
}
