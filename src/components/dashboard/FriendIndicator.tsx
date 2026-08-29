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
				className='inline-flex items-center gap-1.5 rounded-xl border border-zeno-amber/50 bg-zeno-cream px-3 py-1.5 text-xs font-semibold text-zeno-amber-ink transition hover:bg-zeno-amber/20'
			>
				<UserPlus className='h-3.5 w-3.5' />
				{count}
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
