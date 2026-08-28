'use client'

import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import FriendPendingDialog from './FriendPendingDialog'

interface FriendIndicatorProps {
	tripId: string
	count: number
	routeNameMap: Record<string, string>
}

export default function FriendIndicator({ tripId, count, routeNameMap }: FriendIndicatorProps) {
	const [open, setOpen] = useState(false)

	if (count <= 0) return null

	return (
		<>
			<button
				type='button'
				data-testid='friend-pending-badge'
				onClick={() => setOpen(true)}
				className='mt-1 inline-flex items-center gap-1 rounded-full bg-zeno-sage-soft px-2 py-0.5 text-[11px] font-semibold text-zeno-sage transition hover:bg-zeno-sage/20'
			>
				<UserPlus className='h-3 w-3' />
				<span className='tabular-nums'>{count}</span>
			</button>
			<FriendPendingDialog
				tripId={tripId}
				open={open}
				onOpenChange={setOpen}
				routeNameMap={routeNameMap}
			/>
		</>
	)
}
