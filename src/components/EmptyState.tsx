import type { ReactNode } from 'react'

/** Centered gray placeholder for empty lists. */
export default function EmptyState({ message }: { message: ReactNode }) {
	return (
		<p className='rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500'>
			{message}
		</p>
	)
}
