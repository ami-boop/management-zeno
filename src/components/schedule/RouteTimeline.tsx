'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { MapPin, School } from 'lucide-react'
import getClassSchedule from '@/app/actions/getClassSchedule'
import getRouteStops from '@/app/actions/getRouteStops'
import getCalendarException from '@/app/actions/getCalendarException'
import type { CalendarException, LessonsSchedule, RouteStopsData } from '@/lib/api-contracts'
import {
	buildAfternoonTimeline,
	buildMorningTimeline,
	parallelOfClassId,
	resolveManagementEndTime,
} from '@/lib/schedule-times'
import type { GroupedClassOptions } from './ClassEndTimes'
import type { RouteOption, TodayInfo } from './Client'

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const

const selectClass = 'w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'

const humanizeStopId = (stopId: string) => stopId.replace(/_/g, ' ')

export default function RouteTimeline({
	classGroups,
	megamaNames,
	routes,
	today,
}: {
	classGroups: GroupedClassOptions
	megamaNames: Record<string, string>
	routes: RouteOption[]
	today: TodayInfo
}) {
	const t = useTranslations('Schedule')
	const [routeId, setRouteId] = useState('')
	const [classId, setClassId] = useState('')
	const [megamaId, setMegamaId] = useState('')
	const [dayIndex, setDayIndex] = useState(today.dayIndex)
	const [stops, setStops] = useState<RouteStopsData | null>(null)
	const [schedule, setSchedule] = useState<LessonsSchedule | null>(null)
	const [megamaSchedule, setMegamaSchedule] = useState<LessonsSchedule | null>(null)
	const [exception, setException] = useState<CalendarException | null>(null)
	const [stopsError, setStopsError] = useState<string | null>(null)
	const [scheduleError, setScheduleError] = useState<string | null>(null)
	// Latest-interaction-wins: any newer selector change invalidates in-flight responses.
	const seqRef = useRef(0)

	const megamaOptions = useMemo(() => {
		if (!classId) return []
		const parallel = parallelOfClassId(classId)
		const ids = classGroups.megamasByParallel.find(m => m.parallel === parallel)?.megamaIds ?? []
		return ids.map(id => ({ id, label: megamaNames[id] ?? id }))
	}, [classId, classGroups, megamaNames])

	useEffect(() => {
		let cancelled = false
		void (async () => {
			const res = await getCalendarException(today.date)
			if (!cancelled && res.ok) setException(res.exception)
		})()
		return () => {
			cancelled = true
		}
	}, [today.date])

	const handleRouteChange = async (value: string) => {
		const seq = ++seqRef.current
		setRouteId(value)
		setStops(null)
		setStopsError(null)
		if (!value) return
		const res = await getRouteStops(value)
		if (seq !== seqRef.current) return
		if (res.ok) {
			setStops(res.stops)
		} else {
			setStopsError(res.error === 'not_found' ? t('noSchedule') : t('errorLoading'))
		}
	}

	const handleClassChange = async (value: string) => {
		const seq = ++seqRef.current
		setClassId(value)
		setMegamaId('')
		setMegamaSchedule(null)
		setSchedule(null)
		setScheduleError(null)
		if (!value) return
		const res = await getClassSchedule(value)
		if (seq !== seqRef.current) return
		if (res.ok) {
			setSchedule(res.schedule)
		} else {
			setScheduleError(res.error === 'not_found' ? t('noSchedule') : t('errorLoading'))
		}
	}

	const handleMegamaChange = async (value: string) => {
		const seq = ++seqRef.current
		setMegamaId(value)
		setMegamaSchedule(null)
		setScheduleError(null)
		if (!value) return
		const res = await getClassSchedule(value)
		if (seq !== seqRef.current) return
		if (res.ok) {
			setMegamaSchedule(res.schedule)
		} else {
			setScheduleError(res.error === 'not_found' ? t('noSchedule') : t('errorLoading'))
		}
	}

	const useException = dayIndex === today.dayIndex ? exception : null
	const departureTime =
		classId || megamaId
			? resolveManagementEndTime(
					dayIndex,
					schedule,
					megamaSchedule,
					useException,
					classId,
					megamaId || null
				).time
			: null
	const afternoon = buildAfternoonTimeline(stops?.stopsAfternoon ?? [], departureTime)
	const morning = buildMorningTimeline(stops?.stopsMorning ?? [])

	return (
		<div>
			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				<div>
					<label htmlFor='timeline-route' className='mb-2 block text-sm font-medium text-gray-700'>
						{t('selectRoute')}
					</label>
					<select
						id='timeline-route'
						value={routeId}
						onChange={e => void handleRouteChange(e.target.value)}
						className={selectClass}
					>
						<option value=''>{t('selectRoutePlaceholder')}</option>
						{routes.map(option => (
							<option key={option.id} value={option.id}>
								{option.name}
							</option>
						))}
					</select>
				</div>
				<div>
					<label htmlFor='timeline-class' className='mb-2 block text-sm font-medium text-gray-700'>
						{t('selectClass')}
					</label>
					<select
						id='timeline-class'
						value={classId}
						onChange={e => void handleClassChange(e.target.value)}
						className={selectClass}
					>
						<option value=''>{t('selectClassPlaceholder')}</option>
						{classGroups.classes.map(option => (
							<option key={option.id} value={option.id}>
								{option.label}
							</option>
						))}
					</select>
				</div>
				{megamaOptions.length > 0 && (
					<div>
						<label htmlFor='timeline-megama' className='mb-2 block text-sm font-medium text-gray-700'>
							{t('megamaOfParallel')}
						</label>
						<select
							id='timeline-megama'
							value={megamaId}
							onChange={e => void handleMegamaChange(e.target.value)}
							className={selectClass}
						>
							<option value=''>{t('noMegama')}</option>
							{megamaOptions.map(option => (
								<option key={option.id} value={option.id}>
									{option.label}
								</option>
							))}
						</select>
					</div>
				)}
				<div>
					<label htmlFor='timeline-day' className='mb-2 block text-sm font-medium text-gray-700'>
						{t('selectDay')}
					</label>
					<select
						id='timeline-day'
						value={dayIndex}
						onChange={e => setDayIndex(Number(e.target.value))}
						className={selectClass}
					>
						{DAY_KEYS.map((key, index) => (
							<option key={key} value={index}>
								{t(`days.${key}`)}
							</option>
						))}
					</select>
				</div>
			</div>

			{stopsError && <p className='mt-4 text-sm text-red-600'>{stopsError}</p>}
			{scheduleError && <p className='mt-4 text-sm text-red-600'>{scheduleError}</p>}

			{stops && (
				<div className='mt-6 grid gap-6 lg:grid-cols-2'>
					<div>
						<h3 className='mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900'>
							<span className='h-3 w-3 rounded-full bg-yellow-400' />
							{t('morningRoute')}
						</h3>
						{morning.length === 0 ? (
							<p className='rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500'>{t('noSchedule')}</p>
						) : (
							<ol className='space-y-2'>
								{morning.map(stop => (
									<li
										key={`m-${stop.order}-${stop.stopId}`}
										className='flex items-center justify-between rounded-xl border border-gray-200 px-4 py-2.5 text-sm'
									>
										<span className='flex items-center gap-2 text-gray-800'>
											<MapPin className='h-4 w-4 text-gray-400' />
											{humanizeStopId(stop.stopId)}
										</span>
										<span className='font-medium text-gray-600'>
											+{stop.offsetMin} {t('minutesShort')}
										</span>
									</li>
								))}
							</ol>
						)}
					</div>
					<div>
						<h3 className='mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900'>
							<span className='h-3 w-3 rounded-full bg-orange-400' />
							{t('afternoonRoute')}
						</h3>
						{afternoon.entries.length === 0 ? (
							<p className='rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500'>{t('noSchedule')}</p>
						) : (
							<ol className='space-y-2'>
								<li className='flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm'>
									<span className='flex items-center gap-2 font-medium text-blue-900'>
										<School className='h-4 w-4' />
										{t('departure')}
									</span>
									<span className='font-bold text-blue-900'>{afternoon.departureTime}</span>
								</li>
								{afternoon.entries.map(entry => (
									<li
										key={`a-${entry.order}-${entry.stopId}`}
										className='flex items-center justify-between rounded-xl border border-gray-200 px-4 py-2.5 text-sm'
									>
										<span className='flex items-center gap-2 text-gray-800'>
											<MapPin className='h-4 w-4 text-gray-400' />
											{humanizeStopId(entry.stopId)}
										</span>
										<span className='font-medium text-gray-900'>{entry.time}</span>
									</li>
								))}
							</ol>
						)}
					</div>
				</div>
			)}
		</div>
	)
}
