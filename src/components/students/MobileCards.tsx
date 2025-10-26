'use client'
import type { Student } from '@/app/[locale]/(group)/students/page'
import { CircleCheck, CircleX } from 'lucide-react'

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

					<div className='grid grid-cols-2 gap-4'>
						<div className='flex items-center space-x-3 p-2'>
							<div>
								<dt className='text-xs font-medium text-gray-500'>
									{t('submited')}
								</dt>
							</div>
							<div className='flex-shrink-0'>
								{student.submited ? (
									<CircleCheck className='text-green-500' size={24} />
								) : (
									<CircleX className='text-red-500' size={24} />
								)}
							</div>
						</div>

						<div className='p-2'>
							<dt className='text-xs font-medium text-gray-500'>
								{t('guardian')}
							</dt>
							<dd className='text-sm font-medium text-gray-900'>
								{student.guardian}
							</dd>
							<dd className='mt-1 text-xs text-gray-500 flex items-center'>
								<svg
									className='w-3 h-3 mr-1'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
									/>
								</svg>
								{student.phone}
							</dd>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
