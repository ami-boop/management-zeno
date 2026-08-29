'use client'

import { useTranslations } from 'next-intl'
import { CircleCheck, Clock, UserPlus } from 'lucide-react'
import type { ManagementStudent } from '@/lib/api-contracts'

interface StudentMobileCardsProps {
	students: ManagementStudent[]
	selectedStudents: string[]
	onSelectStudent: (uid: string) => void
	routeNameMap: Record<string, string>
}

export default function StudentMobileCards({
	students,
	selectedStudents,
	onSelectStudent,
	routeNameMap,
}: StudentMobileCardsProps) {
	const t = useTranslations('Students')

	return (
		<div className='lg:hidden divide-y divide-gray-200'>
			{students.map(student => {
				const routeName = student.routeId
					? routeNameMap[student.routeId] ?? student.routeId
					: null
				return (
					<div key={student.uid} className='p-4'>
						<div className='flex items-start justify-between gap-3 mb-3'>
							<div className='flex items-start gap-3'>
								<input
									type='checkbox'
									checked={selectedStudents.includes(student.uid)}
									onChange={() => onSelectStudent(student.uid)}
									aria-label={`${student.firstName} ${student.lastName}`}
									className='mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
								/>
								<div>
									<h3 className='text-base font-medium text-gray-900'>
										{student.firstName} {student.lastName}
									</h3>
									<p className='text-sm text-gray-500'>{student.grade}</p>
									{student.today?.friendPending && (
										<span className='mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200'>
											<UserPlus className='h-3 w-3' />
											{t('statusFriendPending')}
										</span>
									)}
								</div>
							</div>
							{student.departureTime ? (
								student.today?.submitted ? (
									<span
										className='inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-emerald-700'
										title={t('statusSubmitted')}
									>
										<CircleCheck className='h-4 w-4 text-emerald-600' />
										<span className='tabular-nums'>{student.departureTime}</span>
									</span>
								) : (
									<span
										className='inline-flex shrink-0 items-center gap-1 text-sm font-medium text-gray-700'
										title={t('statusNotMarked')}
									>
										<Clock className='h-4 w-4 text-gray-400' />
										<span className='tabular-nums'>{student.departureTime}</span>
									</span>
								)
							) : (
								<span className='text-sm text-gray-400'>—</span>
							)}
						</div>

						<div className='grid grid-cols-2 gap-3'>
							<div>
								<dt className='text-xs font-medium text-gray-500'>{t('route')}</dt>
								<dd className='text-sm text-gray-900'>{routeName ?? '—'}</dd>
							</div>
							<div>
								<dt className='text-xs font-medium text-gray-500'>{t('stop')}</dt>
								<dd className='text-sm text-gray-900'>{student.stopId ?? '—'}</dd>
							</div>
							<div>
								<dt className='text-xs font-medium text-gray-500'>{t('guardian')}</dt>
								<dd className='text-sm font-medium text-gray-900'>
									{student.guardian || '—'}
								</dd>
								{student.phone && (
									<dd className='mt-0.5 text-xs text-gray-500'>{student.phone}</dd>
								)}
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}
