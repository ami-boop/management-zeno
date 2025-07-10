'use client'
import type { Student } from '@/app/[locale]/management/students/page'

interface StudentMobileCardsProps {
	students: Student[]
	selectedStudents: number[]
	onSelectStudent: (id: number) => void
	t: (key: string) => string
}

export default function StudentMobileCards({
	students,
	selectedStudents,
	onSelectStudent,
	t,
}: StudentMobileCardsProps) {
	return (
		<div className='lg:hidden divide-y divide-gray-200'>
			{students.map(student => (
				<div key={student.id} className='p-6'>
					<div className='flex items-start justify-between mb-4'>
						<div className='flex items-center space-x-3'>
							<input
								type='checkbox'
								checked={selectedStudents.includes(student.id)}
								onChange={() => onSelectStudent(student.id)}
								className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
							/>
							<div>
								<h3 className='text-lg font-medium text-gray-900'>
									{student.name}
								</h3>
								<p className='text-sm text-gray-500'>
									{student.grade} • ID: {student.id}
								</p>
							</div>
						</div>
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
					</div>

					<div className='grid grid-cols-2 gap-4 mb-4'>
						<div>
							<dt className='text-sm font-medium text-gray-500'>
								{t('route')}
							</dt>
							<dd className='text-sm text-gray-900'>{student.route}</dd>
							<dd className='text-xs text-gray-500'>{student.bus}</dd>
						</div>
						<div>
							<dt className='text-sm font-medium text-gray-500'>
								{t('guardian')}
							</dt>
							<dd className='text-sm text-gray-900'>{student.guardian}</dd>
							<dd className='text-xs text-gray-500'>{student.phone}</dd>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-4 mb-4'>
						<div>
							<dt className='text-sm font-medium text-gray-500'>
								{t('pickup')}
							</dt>
							<dd className='text-sm text-gray-900'>{student.pickupTime}</dd>
						</div>
						<div>
							<dt className='text-sm font-medium text-gray-500'>
								{t('dropoff')}
							</dt>
							<dd className='text-sm text-gray-900'>{student.dropoffTime}</dd>
						</div>
					</div>

					<div className='flex space-x-4 pt-4 border-t border-gray-200'>
						<button className='text-sm text-blue-600 hover:text-blue-900 font-medium'>
							{t('edit')}
						</button>
						<button className='text-sm text-green-600 hover:text-green-900 font-medium'>
							{t('contact')}
						</button>
					</div>
				</div>
			))}
		</div>
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
