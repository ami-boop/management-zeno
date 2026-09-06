'use client'

import { Link } from '@/i18n/navigation'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
	BedDouble,
	CircleCheck,
	CircleX,
	Clock,
	Home,
	Route,
	UserPlus,
} from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { overrideFriendRequest } from '@/app/actions/friend-requests'
import type { FriendTripRequest, FriendTripsData } from '@/lib/api-contracts'

interface FriendTripsProps {
	initial: FriendTripsData | null
}

export default function Client({ initial }: FriendTripsProps) {
	const t = useTranslations('FriendTrips')
	const [requests, setRequests] = useState<FriendTripRequest[]>(initial?.requests ?? [])
	const [busyUid, setBusyUid] = useState<string | null>(null)
	const [errorUid, setErrorUid] = useState<string | null>(null)

	const pending = requests.filter(request => request.parentStatus === 'pending')
	const decided = requests.filter(request => request.parentStatus !== 'pending')

	const decide = async (uid: string, action: 'approve' | 'reject') => {
		setBusyUid(uid)
		setErrorUid(null)
		const response = await overrideFriendRequest(uid, action)
		if (response.ok) {
			const status = action === 'approve' ? 'manager_approved' : 'manager_rejected'
			setRequests(prev =>
				prev.map(request => (request.uid === uid ? { ...request, parentStatus: status } : request))
			)
		} else {
			setErrorUid(uid)
		}
		setBusyUid(null)
	}

	const card = (request: FriendTripRequest, showActions: boolean) => (
		<div
			key={request.uid}
			className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'
		>
			<div className='flex flex-wrap items-start justify-between gap-3'>
				<div>
					<Link
						href={`/students/${request.uid}`}
						className='text-base font-semibold text-gray-900 hover:text-blue-700'
					>
						{request.studentName ?? request.uid}
					</Link>
					<div className='mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600'>
						<span className='inline-flex items-center gap-1.5'>
							<Route className='h-3.5 w-3.5 text-gray-400' />
							{request.toRouteName ?? request.toRouteId ?? '—'}
							{request.toStopName ?? request.toStopId ? ` · ${request.toStopName ?? request.toStopId}` : ''}
						</span>
						{request.friendName && (
							<span className='inline-flex items-center gap-1.5'>
								<UserPlus className='h-3.5 w-3.5 text-gray-400' />
								{request.friendName}
							</span>
						)}
						{request.time && (
							<span className='inline-flex items-center gap-1.5 tabular-nums'>
								<Clock className='h-3.5 w-3.5 text-gray-400' />
								{request.time}
							</span>
						)}
						{request.sleepover && (
							<span className='inline-flex items-center gap-1.5'>
								<BedDouble className='h-3.5 w-3.5 text-gray-400' />
								{t('sleepover')}
							</span>
						)}
					</div>
					{(request.fromRouteName || request.fromStopName) && (
						<div className='mt-1 inline-flex items-center gap-1.5 text-xs text-gray-400'>
							<Home className='h-3 w-3' />
							{t('defaultRoute')}:{' '}
							{request.fromRouteName ?? request.fromRouteId ?? '—'}
							{request.fromStopName ?? request.fromStopId
								? ` · ${request.fromStopName ?? request.fromStopId}`
								: ''}
						</div>
					)}
					{request.note && <p className='mt-2 text-sm text-gray-600'>{request.note}</p>}
				</div>
				<div className='flex flex-col items-end gap-2'>
					<StatusBadge status={request.parentStatus} />
					{showActions && (
						<div className='flex items-center gap-2'>
							<button
								type='button'
								disabled={busyUid === request.uid}
								onClick={() => decide(request.uid, 'approve')}
								className='inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50'
							>
								<CircleCheck className='h-4 w-4' />
								{t('approve')}
							</button>
							<button
								type='button'
								disabled={busyUid === request.uid}
								onClick={() => decide(request.uid, 'reject')}
								className='inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50'
							>
								<CircleX className='h-4 w-4' />
								{t('reject')}
							</button>
						</div>
					)}
					{errorUid === request.uid && (
						<span className='text-xs text-red-600'>{t('actionFailed')}</span>
					)}
				</div>
			</div>
		</div>
	)

	return (
		<div className='bg-gray-50'>
			<div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='mb-6'>
					<h1 className='text-3xl font-bold text-gray-900'>{t('title')}</h1>
					{initial?.date && <p className='mt-1 text-sm text-gray-500 font-mono'>{initial.date}</p>}
				</div>

				{requests.length === 0 ? (
					<div className='rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500'>
						<UserPlus className='mx-auto mb-3 h-8 w-8 text-gray-300' />
						{t('empty')}
					</div>
				) : (
					<div className='space-y-8'>
						<section>
							<h2 className='mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500'>
								{t('pendingSection')} ({pending.length})
							</h2>
							{pending.length === 0 ? (
								<p className='text-sm text-gray-400'>{t('noPending')}</p>
							) : (
								<div className='grid gap-4 lg:grid-cols-2'>
									{pending.map(request => card(request, true))}
								</div>
							)}
						</section>

						{decided.length > 0 && (
							<section>
								<h2 className='mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500'>
									{t('decidedSection')} ({decided.length})
								</h2>
								<div className='grid gap-4 lg:grid-cols-2'>
									{decided.map(request => card(request, false))}
								</div>
							</section>
						)}
					</div>
				)}
			</div>
		</div>
	)
}