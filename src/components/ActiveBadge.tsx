import type { ReactNode } from 'react'

interface ActiveBadgeProps {
	active: boolean
	activeLabel: ReactNode
	inactiveLabel: ReactNode
}

/** Sage/gray active pill used across entity lists. */
export default function ActiveBadge({ active, activeLabel, inactiveLabel }: ActiveBadgeProps) {
	return (
		<span
			className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
				active ? 'bg-zeno-sage-soft text-zeno-sage' : 'bg-zeno-paper-soft text-zeno-muted'
			}`}
		>
			{active ? activeLabel : inactiveLabel}
		</span>
	)
}
