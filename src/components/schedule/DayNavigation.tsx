'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { WeekDay } from '@/types/schedule'
import { useState, useEffect } from 'react'
import React from 'react'

interface DayNavigationProps {
	days: WeekDay[]
	activeDay: string
	onChangeDay?: (dayKey: string) => void
}

export default React.memo(function DayNavigation({
	days,
	activeDay,
	onChangeDay,
}: DayNavigationProps) {
	const [selectedDay, setSelectedDay] = useState(activeDay)
	useEffect(() => {
		setSelectedDay(activeDay)
	}, [activeDay])
	const currentDayIndex = days.findIndex(day => day.key === selectedDay)
	const canGoPrev = currentDayIndex > 0
	const canGoNext = currentDayIndex < days.length - 1

	const goToPreviousDay = () => {
		if (canGoPrev) {
			const prev = days[currentDayIndex - 1].key
			setSelectedDay(prev)
			onChangeDay?.(prev)
		}
	}

	const goToNextDay = () => {
		if (canGoNext) {
			const next = days[currentDayIndex + 1].key
			setSelectedDay(next)
			onChangeDay?.(next)
		}
	}

	return (
		<div className='flex items-center justify-between mb-6'>
			<button
				onClick={goToPreviousDay}
				disabled={!canGoPrev}
				className={`p-2 rounded-lg border ${
					canGoPrev
						? 'border-gray-300 hover:bg-gray-50 text-gray-700'
						: 'border-gray-200 text-gray-400 cursor-not-allowed'
				}`}
			>
				<ChevronLeft className='h-5 w-5' />
			</button>
			<div className='flex space-x-1 bg-white rounded-lg border border-gray-200 p-1'>
				{days.map(day => (
					<button
						key={day.key}
						onClick={() => {
							setSelectedDay(day.key)
							onChangeDay?.(day.key)
						}}
						className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
							day.key === selectedDay
								? 'bg-blue-600 text-white shadow-sm'
								: 'text-gray-700 hover:bg-gray-100'
						}`}
					>
						<span className='hidden sm:inline'>{day.name}</span>
						<span className='sm:hidden'>{day.shortName}</span>
					</button>
				))}
			</div>
			<button
				onClick={goToNextDay}
				disabled={!canGoNext}
				className={`p-2 rounded-lg border ${
					canGoNext
						? 'border-gray-300 hover:bg-gray-50 text-gray-700'
						: 'border-gray-200 text-gray-400 cursor-not-allowed'
				}`}
			>
				<ChevronRight className='h-5 w-5' />
			</button>
		</div>
	)
})
