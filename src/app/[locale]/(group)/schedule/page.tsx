import { getTranslations } from 'next-intl/server'
import {
	MapPin,
	Clock,
	Calendar,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react'
import StopTimeline from '@/components/schedule/StopTimeline'
import DayNavigation from '@/components/schedule/DayNavigation'
import type { WeekDay, Stop } from '@/types/schedule'
import DayScheduleClient from '@/components/schedule/DayScheduleClient'

export default async function SchedulePage() {
	const t = await getTranslations('Schedule')

	const days: WeekDay[] = [
		{ key: 'Sunday', name: t('days.sunday'), shortName: t('daysShort.sun') },
		{ key: 'Monday', name: t('days.monday'), shortName: t('daysShort.mon') },
		{ key: 'Tuesday', name: t('days.tuesday'), shortName: t('daysShort.tue') },
		{
			key: 'Wednesday',
			name: t('days.wednesday'),
			shortName: t('daysShort.wed'),
		},
		{
			key: 'Thursday',
			name: t('days.thursday'),
			shortName: t('daysShort.thu'),
		},
		{ key: 'Friday', name: t('days.friday'), shortName: t('daysShort.fri') },
		{
			key: 'Saturday',
			name: t('days.saturday'),
			shortName: t('daysShort.sat'),
		},
	]

	// scheduleData и currentTime можно получать с сервера или мокать здесь
	const scheduleData: Record<string, { morning: Stop[]; afternoon: Stop[] }> = {
		Monday: {
			morning: [
				{
					type: 'stop',
					time: '7:30',
					label: 'Maple Street & Oak Ave',
					address: '123 Maple Street',
					duration: 2,
				},
				{
					type: 'stop',
					time: '7:45',
					label: 'Pine Grove Residential',
					address: '456 Pine Grove Dr',
					duration: 3,
				},
				{
					type: 'stop',
					time: '7:52',
					label: 'Community Center',
					address: '789 Main Street',
					duration: 2,
				},
				{
					type: 'school',
					time: '8:00',
					label: 'Lincoln Elementary School',
					address: '100 School Drive',
				},
			],
			afternoon: [
				{
					type: 'school',
					time: '15:30',
					label: 'Lincoln Elementary School',
					address: '100 School Drive',
				},
				{
					type: 'stop',
					time: '15:42',
					label: 'Community Center',
					address: '789 Main Street',
					duration: 2,
				},
				{
					type: 'stop',
					time: '15:50',
					label: 'Pine Grove Residential',
					address: '456 Pine Grove Dr',
					duration: 3,
				},
				{
					type: 'stop',
					time: '16:00',
					label: 'Maple Street & Oak Ave',
					address: '123 Maple Street',
				},
			],
		},
		Tuesday: {
			morning: [
				{
					type: 'stop',
					time: '7:35',
					label: 'Elm Street Station',
					address: '234 Elm Street',
					duration: 2,
				},
				{
					type: 'stop',
					time: '7:48',
					label: 'Birch Lane Complex',
					address: '567 Birch Lane',
					duration: 3,
				},
				{
					type: 'school',
					time: '8:05',
					label: 'Lincoln Elementary School',
					address: '100 School Drive',
				},
			],
			afternoon: [
				{
					type: 'school',
					time: '7:00',
					label: 'Lincoln Elementary School',
					address: '100 School Drive',
				},
				{
					type: 'stop',
					time: '15:45',
					label: 'Birch Lane Complex',
					address: '567 Birch Lane',
					duration: 3,
				},
				{
					type: 'stop',
					time: '2:58',
					label: 'Elm Street Station',
					address: '234 Elm Street',
				},
			],
		},
		Wednesday: {
			morning: [
				{
					type: 'stop',
					time: '7:30',
					label: 'Maple Street & Oak Ave',
					address: '123 Maple Street',
					duration: 2,
				},
				{
					type: 'stop',
					time: '7:45',
					label: 'Pine Grove Residential',
					address: '456 Pine Grove Dr',
					duration: 3,
				},
				{
					type: 'stop',
					time: '7:52',
					label: 'Community Center',
					address: '789 Main Street',
					duration: 2,
				},
				{
					type: 'school',
					time: '8:00',
					label: 'Lincoln Elementary School',
					address: '100 School Drive',
				},
			],
			afternoon: [
				{
					type: 'school',
					time: '15:30',
					label: 'Lincoln Elementary School',
					address: '100 School Drive',
				},
				{
					type: 'stop',
					time: '15:42',
					label: 'Community Center',
					address: '789 Main Street',
					duration: 2,
				},
				{
					type: 'stop',
					time: '15:50',
					label: 'Pine Grove Residential',
					address: '456 Pine Grove Dr',
					duration: 3,
				},
				{
					type: 'stop',
					time: '16:00',
					label: 'Maple Street & Oak Ave',
					address: '123 Maple Street',
				},
			],
		},
		Thursday: {
			morning: [
				{
					type: 'stop',
					time: '7:35',
					label: 'Elm Street Station',
					address: '234 Elm Street',
					duration: 2,
				},
				{
					type: 'stop',
					time: '7:48',
					label: 'Birch Lane Complex',
					address: '567 Birch Lane',
					duration: 3,
				},
				{
					type: 'school',
					time: '8:05',
					label: 'Lincoln Elementary School',
					address: '100 School Drive',
				},
			],
			afternoon: [
				{
					type: 'school',
					time: '15:30',
					label: 'Lincoln Elementary School',
					address: '100 School Drive',
				},
				{
					type: 'stop',
					time: '15:45',
					label: 'Birch Lane Complex',
					address: '567 Birch Lane',
					duration: 3,
				},
				{
					type: 'stop',
					time: '15:58',
					label: 'Elm Street Station',
					address: '234 Elm Street',
				},
			],
		},
		Friday: {
			morning: [
				{
					type: 'stop',
					time: '7:30',
					label: 'Maple Street & Oak Ave',
					address: '123 Maple Street',
					duration: 2,
				},
				{
					type: 'stop',
					time: '7:45',
					label: 'Pine Grove Residential',
					address: '456 Pine Grove Dr',
					duration: 3,
				},
				{
					type: 'school',
					time: '8:00',
					label: 'Lincoln Elementary School',
					address: '100 School Drive',
				},
			],
			afternoon: [
				{
					type: 'school',
					time: '14:30',
					label: 'Lincoln Elementary School',
					address: '100 School Drive',
				},
				{
					type: 'stop',
					time: '14:45',
					label: 'Pine Grove Residential',
					address: '456 Pine Grove Dr',
					duration: 3,
				},
				{
					type: 'stop',
					time: '14:55',
					label: 'Maple Street & Oak Ave',
					address: '123 Maple Street',
				},
			],
		},
	}
	const currentTime = '14:25'

	// SSR: по умолчанию показываем сегодня
	const today = new Date().toLocaleString('en-US', { weekday: 'long' })
	const defaultDay = days.find(d => d.key === today) ? today : 'Monday'

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Header */}
				<div className='mb-8'>
					<div className='flex items-center justify-between mb-6'>
						<div>
							<h1 className='text-3xl font-bold text-gray-900 mb-2'>
								{t('title')}
							</h1>
							<p className='text-gray-600'>
								{t('currentTime')}: {currentTime}
							</p>
						</div>
						<div className='flex items-center space-x-2'>
							<div className='w-2 h-2 bg-green-500 rounded-full'></div>
							<span className='text-sm text-green-600 font-medium'>
								{t('activeRoutes')}
							</span>
						</div>
					</div>
					{/* DayNavigation и DayScheduleClient */}
					<DayScheduleClient
						days={days}
						defaultDay={defaultDay}
						scheduleData={scheduleData}
						currentTime={currentTime}
					/>
				</div>
			</div>
		</div>
	)
}
