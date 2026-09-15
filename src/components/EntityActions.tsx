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
		<div className='flex items-center gap-1 border-t border-gray-100 pt-2'>
			<button
				type='button'
				className='inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700'
				onClick={onEdit}
			>
				<Pencil className='h-3.5 w-3.5' />
				{editLabel}
			</button>
			<button
				type='button'
				className='inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40'
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
