'use client'

import { MapPin, Clock, Calendar } from 'lucide-react'
import type { Stop } from '@/types/schedule'
import { useTranslations } from 'next-intl'
import React from 'react'

interface StopTimelineProps {
	stops: Stop[]
	currentTime: string
}

export default function StopTimeline({ stops }: StopTimelineProps) {
	const t = useTranslations('Schedule')

	if (!stops || stops.length === 0) {
		return (
			<div className='bg-gray-50 rounded-lg p-6 text-center'>
				<Calendar className='mx-auto h-12 w-12 text-gray-400 mb-3' />
				<p className='text-gray-600 text-base'>{t('noSchedule')}</p>
			</div>
		)
	}

	return (
		<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
			{/* Route Header */}
			<div className='bg-gray-50 px-4 py-3 border-b border-gray-200'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-2'>
						<Clock className='h-4 w-4 text-gray-500' />
						<span className='text-sm font-medium text-gray-700'>
							{t('stopsCount')}: {stops.length}
						</span>
					</div>
				</div>
			</div>

			{/* Stops Timeline */}
			<div className='p-4'>
				{stops.map((stop, index) => {
					const isLast = index === stops.length - 1
					const isSchool = stop.type === 'school'

					return (
						<div key={index} className='flex items-start space-x-4 relative'>
							{/* Timeline Line */}
							{!isLast && (
								<div className='absolute left-4 top-10 w-0.5 h-16 bg-gray-200'></div>
							)}
							{/* Timeline Dot */}
							<div className='flex-shrink-0 mt-1'>
								<div className='w-8 h-8 rounded-full flex items-center justify-center border-2 bg-blue-500 border-blue-500 shadow-lg shadow-blue-200'>
									{isSchool ? (
										<MapPin className='h-4 w-4 text-white' />
									) : (
										<div className='w-2 h-2 rounded-full bg-white'></div>
									)}
								</div>
							</div>
							{/* Stop Info */}
							<div className='flex-1 min-w-0 pb-8'>
								<div className='flex items-start justify-between'>
									<div className='flex-1 min-w-0'>
										<div className='flex items-center space-x-2 mb-1'>
											<p className='text-base font-semibold text-blue-600'>
												{stop.label}
											</p>
											{stop.duration && (
												<span className='text-xs text-gray-500'>
													{stop.duration} {t('minutes')}
												</span>
											)}
										</div>
										{/* Убираю повторный вывод label, оставляю только адрес */}
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
