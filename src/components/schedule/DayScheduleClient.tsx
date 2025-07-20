'use client'

import { useState } from 'react'
import DayNavigation from './DayNavigation'
import StopTimeline from './StopTimeline'
import type { WeekDay, Stop } from '@/types/schedule'
import { useTranslations } from 'next-intl'
import InfoBlock from './InfoBlock'

interface DayScheduleClientProps {
	days: WeekDay[]
	defaultDay: string
	scheduleData: Record<string, { morning: Stop[]; afternoon: Stop[] }>
	currentTime: string
}

export default function DayScheduleClient({
	days,
	defaultDay,
	scheduleData,
	currentTime,
}: DayScheduleClientProps) {
	const [activeDay, setActiveDay] = useState(defaultDay)
	const t = useTranslations('Schedule')
	const currentSchedule = scheduleData[activeDay] || {
		morning: [],
		afternoon: [],
	}

	return (
		<>
			<DayNavigation
				days={days}
				activeDay={activeDay}
				onChangeDay={setActiveDay}
			/>
			<div className='space-y-8'>
				<div>
					<h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2'>
						<div className='w-3 h-3 bg-yellow-400 rounded-full'></div>
						<span>{t('morningRoute')}</span>
					</h2>
					<InfoBlock stops={currentSchedule.morning} />
					<StopTimeline
						stops={currentSchedule.morning}
						currentTime={currentTime}
					/>
				</div>
				<div>
					<h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2'>
						<div className='w-3 h-3 bg-orange-400 rounded-full'></div>
						<span>{t('afternoonRoute')}</span>
					</h2>
					<InfoBlock stops={currentSchedule.afternoon} />
					<StopTimeline
						stops={currentSchedule.afternoon}
						currentTime={currentTime}
					/>
				</div>
			</div>
		</>
	)
}
