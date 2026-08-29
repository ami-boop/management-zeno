'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Check, MoonStar, Phone, StickyNote, UserPlus, X } from 'lucide-react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import type { TripStudent } from '@/lib/api-contracts'
import getTripStudents from '@/app/actions/getTripStudents'
import overrideFriendRequest from '@/app/actions/overrideFriendRequest'

interface FriendPendingDialogProps {
	tripId: string
	open: boolean
	onOpenChange: (open: boolean) => void
	routeNameMap: Record<string, string>
}

export default function FriendPendingDialog({
	tripId,
	open,
	onOpenChange,
	routeNameMap,
}: FriendPendingDialogProps) {
	const t = useTranslations('Dashboard')
	const router = useRouter()
	const [students, setStudents] = useState<TripStudent[]>([])
	const [loading, setLoading] = useState(false)
	const [actingUid, setActingUid] = useState<string | null>(null)
	const [, startTransition] = useTransition()

	const pending = students.filter((s) => s.friendPending)

	const load = useCallback(async () => {
		setLoading(true)
		try {
			setStudents(await getTripStudents(tripId))
		} finally {
			setLoading(false)
		}
	}, [tripId])

	useEffect(() => {
		if (open) void load()
		else setStudents([])
	}, [open, load])

	const respond = (uid: string, action: 'approve' | 'reject') => {
		startTransition(async () => {
			setActingUid(uid)
			try {
				await overrideFriendRequest(uid, action)
				await load()
				router.refresh()
			} finally {
				setActingUid(null)
			}
		})
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-md'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2 text-zeno-ink'>
						<UserPlus className='h-4 w-4 text-zeno-sage' />
						{t('friendDialogTitle')}
					</DialogTitle>
					<DialogDescription>{t('friendDialogDescription')}</DialogDescription>
				</DialogHeader>

				{loading ? (
					<div className='py-8 text-center text-sm text-zeno-muted'>{t('friendDialogLoading')}</div>
				) : pending.length === 0 ? (
					<div className='py-8 text-center text-sm text-zeno-muted'>{t('friendDialogEmpty')}</div>
				) : (
					<ul className='max-h-80 space-y-3 overflow-y-auto pr-1'>
						{pending.map((student) => {
							const routeName = routeNameMap[student.friendRoute!.toRouteId] ?? student.friendRoute!.toRouteId
							return (
								<li
									key={student.uid}
									className='rounded-xl border border-zeno-line bg-white p-3'
									data-testid='friend-request-item'
								>
									<p className='text-sm font-semibold text-zeno-ink'>
										{student.firstName} {student.lastName}
									</p>
									<p className='mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zeno-muted'>
										<span>{t('friendDialogTo')}:</span>
										<span className='font-medium text-zeno-ink-soft'>{routeName}</span>
										{student.friendRoute!.sleepover && (
											<span
												className='inline-flex items-center gap-1 rounded-full bg-zeno-sage-soft px-1.5 py-0.5 font-medium text-zeno-sage'
												title={t('friendSleepover')}
											>
												<MoonStar className='h-3 w-3' />
											</span>
										)}
									</p>
									{student.friendRoute!.note && (
										<p className='mt-1.5 flex items-start gap-1 rounded-lg bg-zeno-paper-soft px-2 py-1 text-xs text-zeno-ink-soft'>
											<StickyNote className='mt-0.5 h-3 w-3 shrink-0 text-zeno-muted' />
											{student.friendRoute!.note}
										</p>
									)}
									{student.parentPhone && (
										<p className='mt-1.5 flex items-center gap-1.5 text-xs text-zeno-ink-soft'>
											<Phone className='h-3 w-3 shrink-0 text-zeno-muted' />
											<a
												href={`tel:${student.parentPhone}`}
												className='font-medium text-zeno-ink underline-offset-2 hover:underline'
												data-testid='parent-phone'
											>
												{student.parentPhone}
											</a>
											{student.parentName && (
												<span className='text-zeno-muted'>· {student.parentName}</span>
											)}
										</p>
									)}
									<div className='mt-3 flex gap-2'>
										<button
											type='button'
											data-testid={`approve-${student.uid}`}
											disabled={actingUid !== null}
											onClick={() => respond(student.uid, 'approve')}
											className='inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-zeno-sage px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-50'
										>
											<Check className='h-3.5 w-3.5' />
											{t('approve')}
										</button>
										<button
											type='button'
											disabled={actingUid !== null}
											onClick={() => respond(student.uid, 'reject')}
											className='inline-flex items-center justify-center gap-1.5 rounded-xl border border-zeno-danger/40 px-3 py-2 text-xs font-semibold text-zeno-danger transition hover:bg-zeno-danger-soft disabled:pointer-events-none disabled:opacity-50'
										>
											<X className='h-3.5 w-3.5' />
											{t('reject')}
										</button>
									</div>
								</li>
							)
						})}
					</ul>
				)}
			</DialogContent>
		</Dialog>
	)
}
