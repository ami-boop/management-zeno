'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { UserPlus } from 'lucide-react'
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
										<Link
											href={`/students/${student.uid}`}
											className='hover:text-blue-700'
										>
											{student.firstName} {student.lastName}
										</Link>
									</h3>
									<p className='text-sm text-gray-500'>{student.grade}</p>
								</div>
							</div>
							{student.departureTime ? (
								<span className='inline-flex shrink-0 items-center gap-1 text-sm text-gray-700'>
									{student.today?.friendPending && (
										<span title={t('statusFriendPending')}>
											<UserPlus className='h-4 w-4 text-amber-500' />
										</span>
									)}
									<span className='tabular-nums'>{student.departureTime}</span>
								</span>
							) : student.today?.friendPending ? (
								<span title={t('statusFriendPending')} className='shrink-0'>
									<UserPlus className='h-4 w-4 text-amber-500' />
								</span>
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
