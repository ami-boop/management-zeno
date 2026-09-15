import type { ReactNode } from 'react'

interface ActiveBadgeProps {
	active: boolean
	activeLabel: ReactNode
	inactiveLabel: ReactNode
}

/** Green/gray active pill used across entity lists. */
export default function ActiveBadge({ active, activeLabel, inactiveLabel }: ActiveBadgeProps) {
	return (
		<span
			className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
				active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
			}`}
		>
			{active ? activeLabel : inactiveLabel}
		</span>
	)
}
