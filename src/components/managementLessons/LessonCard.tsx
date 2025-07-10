import { FC } from 'react'

interface LessonCardProps {
	lesson: { name: string; teacher: string; color: string } | null
	index: number
	getLessonTime: (index: number) => string
	t: (key: string) => string
}

const LessonCard: FC<LessonCardProps> = ({
	lesson,
	index,
	getLessonTime,
	t,
}) => {
	if (index === 0) return null
	return (
		<div
			className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${
				!lesson ? 'opacity-50' : ''
			}`}
		>
			<div className='flex items-center gap-4'>
				{/* Lesson Number */}
				<div className='flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center'>
					<span className='text-lg font-bold text-gray-700'>{index}</span>
				</div>
				{/* Time */}
				<div className='flex-shrink-0 w-32'>
					<span className='text-sm font-medium text-gray-600'>
						{getLessonTime(index)}
					</span>
				</div>
				{/* Lesson Content */}
				<div className='flex-grow'>
					{lesson ? (
						<div className='flex items-center gap-3'>
							{/* Color Strip */}
							<div
								className='w-1 h-12 rounded-full'
								style={{ backgroundColor: lesson.color }}
							></div>
							{/* Lesson Info */}
							<div>
								<h3 className='text-lg font-semibold text-gray-900 mb-1'>
									{lesson.name}
								</h3>
								<p className='text-sm text-gray-600'>{lesson.teacher}</p>
							</div>
						</div>
					) : (
						<div className='flex items-center gap-3'>
							<div className='w-1 h-12 rounded-full bg-gray-300'></div>
							<div>
								<h3 className='text-lg font-semibold text-gray-400 mb-1'>
									{t('freePeriod')}
								</h3>
								<p className='text-sm text-gray-400'>
									{t('noLessonScheduled')}
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default LessonCard
