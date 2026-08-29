'use client'

import { useTranslations } from 'next-intl'
import { CircleCheck, Clock, UserPlus } from 'lucide-react'
import type { ManagementStudent } from '@/lib/api-contracts'

interface StudentTableProps {
	students: ManagementStudent[]
	selectedStudents: string[]
	onSelectStudent: (uid: string) => void
	onSelectAll: () => void
	routeNameMap: Record<string, string>
}

export default function StudentTable({
	students,
	selectedStudents,
	onSelectStudent,
	onSelectAll,
	routeNameMap,
}: StudentTableProps) {
	const t = useTranslations('Students')

	return (
		<table className='min-w-full divide-y divide-gray-200'>
			<thead className='bg-gray-50'>
				<tr>
					<th className='px-6 py-3 text-start'>
						<input
							type='checkbox'
							checked={selectedStudents.length === students.length && students.length > 0}
							onChange={onSelectAll}
							aria-label={t('selectAll')}
							className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
						/>
					</th>
					<th className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('name')}
					</th>
					<th className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('grade')}
					</th>
					<th className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('route')}
					</th>
					<th className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('stop')}
					</th>
					<th className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('departure')}
					</th>
					<th className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('guardian')}
					</th>
				</tr>
			</thead>
			<tbody className='bg-white divide-y divide-gray-200'>
				{students.map(student => {
					const routeName = student.routeId
						? routeNameMap[student.routeId] ?? student.routeId
						: null
					return (
						<tr
							key={student.uid}
							className='hover:bg-gray-50 transition-colors duration-150'
						>
							<td className='px-6 py-4 whitespace-nowrap'>
								<input
									type='checkbox'
									checked={selectedStudents.includes(student.uid)}
									onChange={() => onSelectStudent(student.uid)}
									aria-label={`${student.firstName} ${student.lastName}`}
									className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
								/>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-sm font-medium text-gray-900'>
									{student.firstName} {student.lastName}
								</div>
								{student.today?.friendPending && (
									<span
										className='mt-0.5 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200'
										title={t('statusFriendPending')}
									>
										<UserPlus className='h-3 w-3' />
										{t('friendBadge')}
									</span>
								)}
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
								{student.grade || '—'}
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
								{routeName ?? '—'}
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
								{student.stopId ?? '—'}
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								{student.departureTime ? (
									student.today?.submitted ? (
										<span
											className='inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700'
											title={t('statusSubmitted')}
										>
											<CircleCheck className='h-4 w-4 text-emerald-600' />
											<span className='tabular-nums'>{student.departureTime}</span>
										</span>
									) : (
										<span
											className='inline-flex items-center gap-1.5 text-sm font-medium text-gray-700'
											title={t('statusNotMarked')}
										>
											<Clock className='h-4 w-4 text-gray-400' />
											<span className='tabular-nums'>{student.departureTime}</span>
										</span>
									)
								) : (
									<span className='text-sm text-gray-400'>—</span>
								)}
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-sm text-gray-900'>{student.guardian || '—'}</div>
								{student.phone && (
									<a
										href={`tel:${student.phone}`}
										className='text-xs text-gray-500 hover:text-gray-700'
									>
										{student.phone}
									</a>
								)}
							</td>
						</tr>
					)
				})}
			</tbody>
		</table>
	)
}
