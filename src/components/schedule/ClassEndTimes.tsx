'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Info } from 'lucide-react'
import getClassSchedule from '@/app/actions/getClassSchedule'
import getCalendarException from '@/app/actions/getCalendarException'
import type { CalendarException, LessonsSchedule } from '@/lib/api-contracts'
import {
	parallelOfClassId,
	resolveManagementEndTime,
} from '@/lib/schedule-times'
import type { ClassOption, TodayInfo } from './Client'

export interface GroupedClassOptions {
	classes: ClassOption[]
	megamasByParallel: { parallel: string; megamaIds: string[] }[]
}

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const

const selectClass = 'w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'

export default function ClassEndTimes({
	classGroups,
	megamaNames,
	today,
}: {
	classGroups: GroupedClassOptions
	megamaNames: Record<string, string>
	today: TodayInfo
}) {
	const t = useTranslations('Schedule')
	const [classId, setClassId] = useState('')
	const [megamaId, setMegamaId] = useState('')
	const [schedule, setSchedule] = useState<LessonsSchedule | null>(null)
	const [megamaSchedule, setMegamaSchedule] = useState<LessonsSchedule | null>(null)
	const [exception, setException] = useState<CalendarException | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const megamaOptions = useMemo(() => {
		if (!classId) return []
		const parallel = parallelOfClassId(classId)
		const ids = classGroups.megamasByParallel.find(m => m.parallel === parallel)?.megamaIds ?? []
		return ids.map(id => ({ id, label: megamaNames[id] ?? id }))
	}, [classId, classGroups, megamaNames])

	const handleClassChange = async (value: string) => {
		setClassId(value)
		setMegamaId('')
		setMegamaSchedule(null)
		setSchedule(null)
		setException(null)
		setError(null)
		if (!value) return
		setLoading(true)
		const [scheduleRes, exceptionRes] = await Promise.all([
			getClassSchedule(value),
			getCalendarException(today.date),
		])
		if (scheduleRes.ok) {
			setSchedule(scheduleRes.schedule)
		} else {
			setError(scheduleRes.error === 'not_found' ? t('noSchedule') : t('errorLoading'))
		}
		if (exceptionRes.ok) setException(exceptionRes.exception)
		setLoading(false)
	}

	const handleMegamaChange = async (value: string) => {
		setMegamaId(value)
		setMegamaSchedule(null)
		if (!value) return
		const res = await getClassSchedule(value)
		if (res.ok) setMegamaSchedule(res.schedule)
	}

	const exceptionText = exception
		? exception.type === 'holiday'
			? t('exceptionHoliday')
			: exception.type === 'no_transport'
				? t('exceptionNoTransport')
				: exception.type === 'half_day'
					? t('exceptionHalfDay')
					: exception.type === 'special_schedule'
						? t('exceptionSpecial')
						: null
		: null

	const rows = DAY_KEYS.map((key, index) => {
		const isToday = index === today.dayIndex
		const useException = isToday ? exception : null
		const resolved = resolveManagementEndTime(
			index,
			schedule,
			megamaSchedule,
			useException,
			classId,
			megamaId || null
		)
		const classTime = schedule?.endTimes[String(index)] ?? null
		const megamaTime = megamaSchedule?.endTimes[String(index)] ?? null
		return { key, isToday, resolved, classTime, megamaTime }
	})

	return (
		<div>
			<div className='grid gap-4 sm:grid-cols-2 lg:max-w-2xl'>
				<div>
					<label htmlFor='schedule-class' className='mb-2 block text-sm font-medium text-gray-700'>
						{t('selectClass')}
					</label>
					<select
						id='schedule-class'
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
						<label htmlFor='schedule-megama' className='mb-2 block text-sm font-medium text-gray-700'>
							{t('megamaOfParallel')}
						</label>
						<select
							id='schedule-megama'
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
			</div>

			{megamaOptions.length > 0 && (
				<p className='mt-3 flex items-center gap-1.5 text-xs text-gray-500 lg:max-w-2xl'>
					<Info className='h-3.5 w-3.5 shrink-0' />
					{t('megamaHint')}
				</p>
			)}

			{exception && exceptionText && (
				<div className='mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800'>
					<Info className='mt-0.5 h-4 w-4 shrink-0' />
					<span>
						{exceptionText}
						{exception.note ? `: ${exception.note}` : ''}
					</span>
				</div>
			)}

			{loading && <p className='mt-4 text-sm text-gray-500'>{t('loading')}</p>}
			{!loading && error && <p className='mt-4 text-sm text-red-600'>{error}</p>}

			{!loading && !error && schedule && (
				<div className='mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
					{rows.map(row => (
						<div
							key={row.key}
							className={`rounded-xl border px-4 py-3 ${
								row.isToday ? 'border-blue-300 bg-blue-50/70' : 'border-gray-200'
							}`}
						>
							<div className='flex items-center justify-between'>
								<span className='text-sm font-medium text-gray-700'>{t(`days.${row.key}`)}</span>
								{row.isToday && (
									<span className='rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700'>
										{t('today')}
									</span>
								)}
							</div>
							<p className='mt-1 text-lg font-bold text-gray-900'>
								{row.resolved.time ?? <span className='text-base font-medium text-gray-400'>{t('noSchool')}</span>}
							</p>
							{megamaSchedule && row.megamaTime && row.megamaTime !== row.resolved.time && (
								<p className='mt-0.5 text-xs text-gray-500'>
									{t('megamaColumn')}: {row.megamaTime}
								</p>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	)
}
