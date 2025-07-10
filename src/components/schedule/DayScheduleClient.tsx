'use client'
import { useState } from 'react'
import DayNavigation from './DayNavigation'
import StopTimeline from './StopTimeline'
import type { WeekDay, Stop } from '@/types/schedule'
import { useTranslations } from 'next-intl'

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

	function InfoBlock({ stops }: { stops: Stop[] }) {
		if (!stops.length) return null
		return (
			<div className='mb-4 bg-gray-50 border border-gray-200 rounded-lg p-4'>
				<div className='text-sm text-gray-700 mb-2'>
					{t('totalStops')}: <b>{stops.length}</b>
				</div>
				<div className='flex flex-wrap gap-4'>
					<div>
						<div className='font-medium text-gray-600'>{t('firstStop')}</div>
						<div className='text-gray-900'>{stops[0]?.label}</div>
						{stops[0]?.address && (
							<div className='text-xs text-gray-500'>{stops[0].address}</div>
						)}
						<div className='text-xs text-gray-400'>{stops[0]?.time}</div>
					</div>
					<div>
						<div className='font-medium text-gray-600'>{t('lastStop')}</div>
						<div className='text-gray-900'>
							{stops[stops.length - 1]?.label}
						</div>
						{stops[stops.length - 1]?.address && (
							<div className='text-xs text-gray-500'>
								{stops[stops.length - 1].address}
							</div>
						)}
						<div className='text-xs text-gray-400'>
							{stops[stops.length - 1]?.time}
						</div>
					</div>
				</div>
				<div className='mt-2'>
					<div className='font-medium text-gray-600 mb-1'>{t('allStops')}</div>
					<ul className='list-disc pl-5 text-sm text-gray-800'>
						{stops.map((stop, idx) => (
							<li key={idx}>
								<span className='font-semibold'>{stop.label}</span>
								{stop.address && (
									<span className='text-xs text-gray-500 ml-1'>
										({stop.address})
									</span>
								)}
								<span className='ml-2 text-xs text-gray-400'>{stop.time}</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		)
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
