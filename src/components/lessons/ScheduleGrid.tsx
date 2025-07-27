import { FC } from 'react'
import LessonCard from './LessonCard'

interface ScheduleGridProps {
	currentLessons: ({ name: string; teacher: string; color: string } | null)[]
	getLessonTime: (index: number) => string
	t: (key: string) => string
}

const ScheduleGrid: FC<ScheduleGridProps> = ({
	currentLessons,
	getLessonTime,
	t,
}) => (
	<div className='space-y-4'>
		{currentLessons.map((lesson, index) => (
			<LessonCard
				key={index}
				lesson={lesson}
				index={index}
				getLessonTime={getLessonTime}
				t={t}
			/>
		))}
	</div>
)

export default ScheduleGrid
