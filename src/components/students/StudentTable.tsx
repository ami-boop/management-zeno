'use client'
import type { Student } from '@/app/[locale]/management/students/page'

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
						{t('studentStatus')}
					</th>
					<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('route')} / {t('bus')}
					</th>
					<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('schedule')}
					</th>
					<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('guardian')}
					</th>
					<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('actions')}
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
							<div className='text-sm text-gray-500'>ID: {student.id}</div>
						</td>
						<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
							{student.grade}
						</td>
						<td className='px-6 py-4 whitespace-nowrap'>
							<div
								className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
									student.status
								)}`}
							>
								<div
									className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(
										student.status
									)}`}
								></div>
								{t(`status.${student.status}`)}
							</div>
						</td>
						<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
							<div>{student.route}</div>
							<div className='text-xs text-gray-500'>{student.bus}</div>
						</td>
						<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
							<div className='text-xs'>
								<div>
									{t('pickup')}: {student.pickupTime}
								</div>
								<div>
									{t('dropoff')}: {student.dropoffTime}
								</div>
							</div>
						</td>
						<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
							<div>{student.guardian}</div>
							<div className='text-xs text-gray-500'>{student.phone}</div>
						</td>
						<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
							<div className='flex space-x-2'>
								<button className='text-blue-600 hover:text-blue-900'>
									{t('edit')}
								</button>
								<button className='text-green-600 hover:text-green-900'>
									{t('contact')}
								</button>
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}

function getStatusColor(status: Student['status']) {
	switch (status) {
		case 'onboard':
			return 'bg-green-50 text-green-800 border-green-200'
		case 'boarding':
			return 'bg-blue-50 text-blue-800 border-blue-200'
		case 'absent':
			return 'bg-red-50 text-red-800 border-red-200'
		case 'dropped':
			return 'bg-gray-50 text-gray-800 border-gray-200'
		default:
			return 'bg-gray-50 text-gray-800 border-gray-200'
	}
}

function getStatusDot(status: Student['status']) {
	switch (status) {
		case 'onboard':
			return 'bg-green-500'
		case 'boarding':
			return 'bg-blue-500'
		case 'absent':
			return 'bg-red-500'
		case 'dropped':
			return 'bg-gray-500'
		default:
			return 'bg-gray-500'
	}
}
