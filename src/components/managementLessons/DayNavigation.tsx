import { FC } from 'react'

interface DayNavigationProps {
	days: { key: string; label: string; hebrew: string }[]
	selectedDay: string
	setSelectedDay: (day: string) => void
	t: (key: string) => string
}

const DayNavigation: FC<DayNavigationProps> = ({
	days,
	selectedDay,
	setSelectedDay,
	t,
}) => (
	<div className='mb-8'>
		<div className='flex flex-wrap gap-2 justify-center'>
			{days.map(day => (
				<button
					key={day.key}
					onClick={() => setSelectedDay(day.key)}
					className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
						selectedDay === day.key
							? 'bg-blue-600 text-white'
							: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
					}`}
				>
					<span className='hidden sm:inline'>{t(`days.${day.key}`)}</span>
					<span className='sm:hidden'>{day.hebrew}</span>
				</button>
			))}
		</div>
	</div>
)

export default DayNavigation
