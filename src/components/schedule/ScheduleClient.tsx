'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import DayScheduleClient from './DayScheduleClient'
import type { WeekDay, Stop } from '@/types/schedule'

interface RouteOption {
	id: string
	name: string
}

interface ScheduleClientProps {
	days: WeekDay[]
	routes: RouteOption[]
}

export default function ScheduleClient({ days, routes }: ScheduleClientProps) {
	const t = useTranslations('Schedule')
	const [isModalOpen, setIsModalOpen] = useState(true)
	const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null)
	const [scheduleData, setScheduleData] = useState<{
		morning: Stop[]
		afternoon: Stop[]
	} | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSelectRoute = async (route: RouteOption) => {
		setSelectedRoute(route)
		setIsModalOpen(false)
		setLoading(true)
		setError(null)
		try {
			const res = await fetch('/api/schedule', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ routeId: route.id }),
			})
			if (!res.ok) throw new Error('Failed to fetch schedule')
			const data = await res.json()
			setScheduleData(data.schedule)
		} catch (e: any) {
			setError(t('noSchedule'))
			setScheduleData(null)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			{isModalOpen && (
				<div className='fixed inset-0 z-50 flex items-center justify-center'>
					<div className='absolute inset-0 bg-black/30' />
					<div className='relative z-10 mx-auto max-w-md w-full rounded-lg bg-white p-8 shadow-lg'>
						<div className='text-lg font-semibold mb-4'>{t('selectRoute')}</div>
						<div className='space-y-2'>
							{routes.map(route => (
								<button
									key={route.id}
									onClick={() => handleSelectRoute(route)}
									className='w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-50 hover:bg-blue-100 text-gray-900 text-left font-medium transition-colors duration-150'
								>
									{route.name}
								</button>
							))}
						</div>
					</div>
				</div>
			)}
			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{selectedRoute && (
					<div className='mb-8 flex items-center justify-between'>
						<div>
							<h1 className='text-3xl font-bold text-gray-900 mb-2'>
								{t('title')}
							</h1>
							<p className='text-gray-600'>{selectedRoute.name}</p>
						</div>
						<button
							onClick={() => {
								setIsModalOpen(true)
								setSelectedRoute(null)
								setScheduleData(null)
								setError(null)
							}}
							className='ml-4 px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-blue-50 text-blue-700 font-medium transition-colors duration-150'
						>
							{t('changeRoute') || 'Change route'}
						</button>
					</div>
				)}
				{loading && (
					<div className='flex flex-col items-center justify-center py-12'>
						<div className='w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4'></div>
						<div className='text-gray-500'>{t('loading') || 'Loading...'}</div>
					</div>
				)}
				{error && <div className='text-center py-12 text-red-500'>{error}</div>}
				{scheduleData && selectedRoute && !loading && !error && (
					<DayScheduleClient
						days={days}
						defaultDay={days[0].key}
						scheduleData={{ [days[0].key]: scheduleData }} // wrap in a record
						currentTime={new Date().toLocaleTimeString('en-GB', {
							hour: '2-digit',
							minute: '2-digit',
						})}
					/>
				)}
			</div>
		</div>
	)
}
