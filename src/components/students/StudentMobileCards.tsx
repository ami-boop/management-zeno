'use client'
import type { Student } from '@/app/[locale]/(group)/students/page'

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
								<p className='text-sm text-gray-500'>{student.grade}</p>
							</div>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-4 mb-4'>
						<div>
							<dt className='text-sm font-medium text-gray-500'>
								{t('route')}
							</dt>
							<dd className='text-sm text-gray-900'>{student.route}</dd>
						</div>
						<div>
							<dt className='text-sm font-medium text-gray-500'>{t('stop')}</dt>
							<dd className='text-sm text-gray-900'>{student.stop}</dd>
						</div>
					</div>

					<div className='grid grid-cols-1 gap-4'>
						<div>
							<dt className='text-sm font-medium text-gray-500'>
								{t('guardian')}
							</dt>
							<dd className='text-sm text-gray-900'>{student.guardian}</dd>
							<dd className='text-xs text-gray-500'>{student.phone}</dd>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
