'use client'

import { Pencil, PowerOff, RotateCcw } from 'lucide-react'

interface EntityActionsProps {
	onEdit: () => void
	onToggle: () => void
	active: boolean
	busy?: boolean
	editLabel: string
	deactivateLabel: string
	activateLabel: string
}

/** Edit + activate/deactivate row buttons shared by entity lists. */
export default function EntityActions({
	onEdit,
	onToggle,
	active,
	busy,
	editLabel,
	deactivateLabel,
	activateLabel,
}: EntityActionsProps) {
	return (
		<div className='flex items-center gap-1 border-t border-zeno-line pt-2'>
			<button
				type='button'
				className='inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-zeno-ink-soft hover:bg-zeno-sage-soft hover:text-zeno-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber disabled:opacity-40'
				onClick={onEdit}
				disabled={busy}
			>
				<Pencil className='h-3.5 w-3.5' />
				{editLabel}
			</button>
			<button
				type='button'
				className='inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-zeno-ink-soft hover:bg-zeno-cream-surface hover:text-zeno-amber-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber disabled:opacity-40'
				disabled={busy}
				onClick={onToggle}
			>
				{active ? (
					<>
						<PowerOff className='h-3.5 w-3.5' />
						{deactivateLabel}
					</>
				) : (
					<>
						<RotateCcw className='h-3.5 w-3.5' />
						{activateLabel}
					</>
				)}
			</button>
		</div>
	)
}
