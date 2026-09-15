import type { ReactNode } from 'react'

/** Centered placeholder for empty lists. */
export default function EmptyState({ message }: { message: ReactNode }) {
	return (
		<p className='rounded-xl border border-zeno-line bg-zeno-surface p-8 text-center text-sm text-zeno-muted'>
			{message}
		</p>
	)
}
