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
		<div role='alert' className='mb-3 flex items-center gap-2 rounded-xl border border-zeno-danger/40 bg-zeno-danger-soft p-4 text-sm text-zeno-danger'>
			<AlertCircle className='h-4 w-4 shrink-0' />
			<span className='flex-1'>{message}</span>
			{onRetry && (
				<button
					type='button'
					onClick={onRetry}
					className='inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-zeno-danger hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber'
				>
					<RefreshCw className='h-4 w-4' />
					{retryLabel}
				</button>
			)}
		</div>
	)
}
