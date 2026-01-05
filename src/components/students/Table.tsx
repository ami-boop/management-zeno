'use client'

import type { Student } from '@/app/[locale]/(group)/students/page'
import { CircleCheck, CircleX } from 'lucide-react'

interface StudentTableProps {
	students: Student[]
	selectedStudents: number[]
	onSelectStudent: (id: number) => void
	onSelectAll: () => void
	t: (key: string) => string
}

export default function StudentTable({
	students,
	selectedStudents,
	onSelectStudent,
	onSelectAll,
	t,
}: StudentTableProps) {
	return (
		<table className='min-w-full divide-y divide-gray-200'>
			<thead className='bg-gray-50'>
				<tr>
					<th className='px-6 py-3 text-left'>
						<input
							type='checkbox'
							checked={
								selectedStudents.length === students.length &&
								students.length > 0
							}
							onChange={onSelectAll}
							className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
						/>
					</th>
					<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('name')}
					</th>
					<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('grade')}
					</th>
					<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('stop')}
					</th>
					<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('route')}
					</th>
					<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('submittedTime')}
					</th>
					<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('guardian')}
					</th>
				</tr>
			</thead>
			<tbody className='bg-white divide-y divide-gray-200'>
				{students.map(student => (
					<tr
						key={student.id}
						className='hover:bg-gray-50 transition-colors duration-150'
					>
						<td className='px-6 py-4 whitespace-nowrap'>
							<input
								type='checkbox'
								checked={selectedStudents.includes(student.id)}
								onChange={() => onSelectStudent(student.id)}
								className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
							/>
						</td>
						<td className='px-6 py-4 whitespace-nowrap'>
							<div className='text-sm font-medium text-gray-900'>
								{student.name}
							</div>
						</td>
						<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
							{student.grade}
						</td>
						<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
							{student.stop}
						</td>
						<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
							{student.route}
						</td>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							{/* {student.submited ? (
								<CircleCheck color='green' />
							) : (
								<CircleX color='red' />
							)} */}
							{student.submited}
						</th>
						<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
							<div>{student.guardian}</div>
							<div className='text-xs text-gray-500'>{student.phone}</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
