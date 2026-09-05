'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
	ArrowLeft,
	Baby,
	BedDouble,
	CircleCheck,
	Clock,
	Home,
	MapPin,
	Phone,
	Route as RouteIcon,
	UserPlus,
	Users,
} from 'lucide-react'
import type { ManagementStudentDetail } from '@/lib/api-contracts'

interface StudentDetailProps {
	detail: ManagementStudentDetail
	routeNameMap: Record<string, string>
	stopNameMap: Record<string, string>
}

export default function Client({ detail, routeNameMap, stopNameMap }: StudentDetailProps) {
	const t = useTranslations('Students')
	const { student, parents, friendRoute } = detail
	const fullName = `${student.firstName} ${student.lastName}`.trim() || student.uid
	const today = student.today
	const parentStatusLabel =
		friendRoute?.parentStatus === 'approved'
			? t('parentStatusApproved')
			: friendRoute?.parentStatus === 'rejected'
				? t('parentStatusRejected')
				: t('parentStatusPending')

	const infoRows: { label: string; value: string | null; icon: React.ReactNode; href?: string }[] = [
		{ label: t('grade'), value: student.grade || null, icon: <Users className='h-4 w-4' /> },
		{ label: t('megama'), value: student.megamaId, icon: <Baby className='h-4 w-4' /> },
		{
			label: t('route'),
			value: student.routeId ? routeNameMap[student.routeId] ?? student.routeId : null,
			icon: <RouteIcon className='h-4 w-4' />,
			href: student.routeId ? `/routes/${student.routeId}` : undefined,
		},
		{
			label: t('stop'),
			value: student.stopId ? stopNameMap[student.stopId] ?? student.stopId : null,
			icon: <MapPin className='h-4 w-4' />,
			href: student.stopId ? `/stops/${student.stopId}` : undefined,
		},
		{
			label: t('departure'),
			value: student.departureTime,
			icon: <Clock className='h-4 w-4' />,
		},
	]

	return (
		<div className='bg-gray-50'>
			<div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<Link
					href='/students'
					className='mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-700'
				>
					<ArrowLeft className='h-4 w-4' />
					{t('backToList')}
				</Link>

				<div className='mb-6 flex flex-wrap items-end justify-between gap-4'>
					<div>
						<h1 className='text-3xl font-bold text-gray-900'>{fullName}</h1>
						<p className='mt-1 text-sm text-gray-500 font-mono'>{student.uid}</p>
					</div>
					{today?.friendPending && (
						<span
							className='inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700 border border-amber-200'
							title={t('statusFriendPending')}
						>
							<UserPlus className='h-4 w-4' />
							{t('statusFriendPending')}
						</span>
					)}
				</div>

				<div className='grid gap-6 lg:grid-cols-3'>
					<div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
						<h2 className='mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500'>
							{t('studentInfo')}
						</h2>
						<dl className='space-y-3 text-sm'>
							{infoRows.map(row => (
								<div key={row.label} className='flex justify-between gap-4'>
									<dt className='flex items-center gap-2 text-gray-500'>
										<span className='text-gray-400'>{row.icon}</span>
										{row.label}
									</dt>
									<dd className='text-end font-medium text-gray-900'>
										{row.value == null ? (
											<span className='text-gray-300'>—</span>
										) : row.href ? (
											<Link href={row.href} className='hover:text-blue-700'>
												{row.value}
											</Link>
										) : (
											row.value
										)}
									</dd>
								</div>
							))}
						</dl>
					</div>

					<div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
						<h2 className='mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500'>
							{t('statusToday')}
						</h2>
						{today ? (
							<div className='space-y-3 text-sm'>
								<div className='flex justify-between gap-4'>
									<span className='text-gray-500'>{t('studentStatus')}</span>
									<span className='font-medium text-gray-900'>
										{today.submitted ? (
											<span className='inline-flex items-center gap-1.5 text-emerald-700'>
												<CircleCheck className='h-4 w-4 text-emerald-600' />
												{t('statusSubmitted')}
											</span>
										) : (
											<span className='inline-flex items-center gap-1.5 text-gray-500'>
												<Clock className='h-4 w-4 text-gray-400' />
												{t('statusNotMarked')}
											</span>
										)}
									</span>
								</div>
								<div className='flex justify-between gap-4'>
									<span className='text-gray-500'>{t('departure')}</span>
									<span className='font-medium text-gray-900 tabular-nums'>
										{today.time ?? '—'}
									</span>
								</div>
							</div>
						) : (
							<p className='text-sm text-gray-400'>{t('statusNotMarked')}</p>
						)}
					</div>

					<div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
						<h2 className='mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500'>
							{t('parentsSection')}
						</h2>
						{parents.length > 0 ? (
							<ul className='space-y-4 text-sm'>
								{parents.map((parent, index) => (
									<li key={index}>
										<div className='font-medium text-gray-900'>{parent.name || '—'}</div>
										<div className='text-xs text-gray-500'>
											{parent.relationship}
											{parent.isPrimary ? ` · ${t('primaryParent')}` : ''}
										</div>
										{parent.phone && (
											<a
												href={`tel:${parent.phone}`}
												className='mt-0.5 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700'
											>
												<Phone className='h-3 w-3' />
												{parent.phone}
											</a>
										)}
									</li>
								))}
							</ul>
						) : (
							<p className='text-sm text-gray-400'>{student.guardian || '—'}</p>
						)}
					</div>
				</div>

				{friendRoute && (
					<div className='mt-6 rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm'>
						<h2 className='mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-amber-700'>
							<UserPlus className='h-4 w-4' />
							{t('friendRouteSection')}
						</h2>
						<dl className='grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4'>
							<div>
								<dt className='text-xs text-gray-500'>{t('friendStudent')}</dt>
								<dd className='font-medium text-gray-900'>
									{friendRoute.friendName ?? friendRoute.friendUid ?? '—'}
								</dd>
							</div>
							<div>
								<dt className='flex items-center gap-1.5 text-xs text-gray-500'>
									<RouteIcon className='h-3.5 w-3.5' />
									{t('toRoute')}
								</dt>
								<dd className='font-medium text-gray-900'>
									{friendRoute.toRouteId
										? routeNameMap[friendRoute.toRouteId] ?? friendRoute.toRouteId
										: '—'}
									{friendRoute.toStopId
										? ` · ${stopNameMap[friendRoute.toStopId] ?? friendRoute.toStopId}`
										: ''}
								</dd>
							</div>
							<div>
								<dt className='flex items-center gap-1.5 text-xs text-gray-500'>
									<Home className='h-3.5 w-3.5' />
									{t('defaultRoute')}
								</dt>
								<dd className='font-medium text-gray-900'>
									{friendRoute.fromRouteId
										? routeNameMap[friendRoute.fromRouteId] ?? friendRoute.fromRouteId
										: '—'}
									{friendRoute.fromStopId
										? ` · ${stopNameMap[friendRoute.fromStopId] ?? friendRoute.fromStopId}`
										: ''}
								</dd>
							</div>
							<div>
								<dt className='text-xs text-gray-500'>{t('parentDecision')}</dt>
								<dd className='font-medium text-gray-900'>
									{parentStatusLabel}
									{friendRoute.sleepover ? (
										<span className='ms-2 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-gray-600 border border-gray-200'>
											<BedDouble className='h-3 w-3' />
											{t('sleepover')}
										</span>
									) : null}
								</dd>
							</div>
						</dl>
						{friendRoute.note && (
							<p className='mt-3 border-t border-amber-100 pt-3 text-sm text-gray-600'>
								{friendRoute.note}
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	)
}
