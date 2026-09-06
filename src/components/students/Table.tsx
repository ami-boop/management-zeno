'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { UserPlus } from 'lucide-react'
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
								<Link
									href={`/students/${student.uid}`}
									className='text-sm font-medium text-gray-900 hover:text-blue-700'
								>
									{student.firstName} {student.lastName}
								</Link>
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
									<span className='inline-flex items-center gap-1.5 text-sm text-gray-700'>
										{student.today?.friendPending && (
											<span title={t('statusFriendPending')}>
												<UserPlus className='h-4 w-4 text-amber-500' />
											</span>
										)}
										<span className='tabular-nums'>{student.departureTime}</span>
									</span>
								) : student.today?.friendPending ? (
									<span title={t('statusFriendPending')}>
										<UserPlus className='h-4 w-4 text-amber-500' />
									</span>
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
