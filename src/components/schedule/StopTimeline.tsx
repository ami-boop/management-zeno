'use client'
import { MapPin, Clock, Calendar } from 'lucide-react'
import type { Stop } from '@/types/schedule'
import { useTranslations } from 'next-intl'

interface StopTimelineProps {
	stops: Stop[]
	currentTime: string
}

export default function StopTimeline({
	stops,
	currentTime,
}: StopTimelineProps) {
	const t = useTranslations('Schedule')
	if (!stops || stops.length === 0) {
		return (
			<div className='bg-gray-50 rounded-lg p-6 text-center'>
				<Calendar className='mx-auto h-12 w-12 text-gray-400 mb-3' />
				<p className='text-gray-600 text-base'>{t('noSchedule')}</p>
			</div>
		)
	}

	const getNextStop = (stops: Stop[], currentTime: string) => {
		const current = currentTime.replace(':', '')
		for (const stop of stops) {
			const stopTime = stop.time.replace(':', '')
			if (stopTime > current) {
				return stop
			}
		}
		return null
	}

	const isStopActive = (stop: Stop, currentTime: string) => {
		const current = currentTime.replace(':', '')
		const stopTime = stop.time.replace(':', '')
		return stopTime <= current
	}

	const isCurrentStop = (
		stop: Stop,
		currentTime: string,
		nextStop: Stop | null
	) => {
		return nextStop && stop.time === nextStop.time
	}

	const nextStop = getNextStop(stops, currentTime)
	const totalDuration =
		stops.length > 1
			? parseInt(stops[stops.length - 1].time.replace(':', '')) -
			  parseInt(stops[0].time.replace(':', ''))
			: 0

	return (
		<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
			{/* Route Header */}
			<div className='bg-gray-50 px-4 py-3 border-b border-gray-200'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-2'>
						<Clock className='h-4 w-4 text-gray-500' />
						<span className='text-sm font-medium text-gray-700'>
							{stops[0]?.time} - {stops[stops.length - 1]?.time}
						</span>
					</div>
					<div className='text-sm text-gray-500'>
						{Math.floor(totalDuration / 100)}h {totalDuration % 100}m
					</div>
				</div>
			</div>
			{/* Stops Timeline */}
			<div className='p-4'>
				{stops.map((stop, index) => {
					const isLast = index === stops.length - 1
					const isActive = isStopActive(stop, currentTime)
					const isCurrent = isCurrentStop(stop, currentTime, nextStop)
					const isSchool = stop.type === 'school'
					return (
						<div key={index} className='flex items-start space-x-4 relative'>
							{/* Timeline Line */}
							{!isLast && (
								<div className='absolute left-4 top-10 w-0.5 h-16 bg-gray-200'></div>
							)}
							{/* Timeline Dot */}
							<div className='flex-shrink-0 mt-1'>
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
										isCurrent
											? 'bg-blue-500 border-blue-500 shadow-lg shadow-blue-200'
											: isActive
											? 'bg-green-500 border-green-500'
											: 'bg-white border-gray-300'
									}`}
								>
									{isSchool ? (
										<MapPin
											className={`h-4 w-4 ${
												isCurrent || isActive ? 'text-white' : 'text-gray-400'
											}`}
										/>
									) : (
										<div
											className={`w-2 h-2 rounded-full ${
												isCurrent || isActive ? 'bg-white' : 'bg-gray-400'
											}`}
										></div>
									)}
								</div>
							</div>
							{/* Stop Info */}
							<div className='flex-1 min-w-0 pb-8'>
								<div className='flex items-start justify-between'>
									<div className='flex-1 min-w-0'>
										<div className='flex items-center space-x-2 mb-1'>
											<p
												className={`text-base font-semibold ${
													isCurrent
														? 'text-blue-600'
														: isActive
														? 'text-green-600'
														: 'text-gray-900'
												}`}
											>
												{stop.time}
											</p>
											{isCurrent && (
												<span className='px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full'>
													{t('nextStop')}
												</span>
											)}
											{stop.duration && (
												<span className='text-xs text-gray-500'>
													{stop.duration} min
												</span>
											)}
										</div>
										<h3
											className={`text-sm font-medium mb-1 ${
												isCurrent ? 'text-blue-900' : 'text-gray-900'
											}`}
										>
											{stop.label}
										</h3>
										{stop.address && (
											<p className='text-sm text-gray-600'>{stop.address}</p>
										)}
									</div>
								</div>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
