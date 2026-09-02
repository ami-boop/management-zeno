'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CalendarDays, Info } from 'lucide-react'
import getClassSchedule from '@/app/actions/getClassSchedule'
import getCalendarException from '@/app/actions/getCalendarException'
import type { CalendarException, LessonsSchedule } from '@/lib/api-contracts'
import { resolveManagementEndTime } from '@/lib/schedule-times'
import type { ClassOption, TodayInfo } from './Client'

export interface GroupedClassOptions {
	classes: ClassOption[]
	megamas: ClassOption[]
}

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const

const selectClass = 'w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'

export default function ClassEndTimes({
	classGroups,
	today,
}: {
	classGroups: GroupedClassOptions
	today: TodayInfo
}) {
	const t = useTranslations('Schedule')
	const [classId, setClassId] = useState('')
	const [schedule, setSchedule] = useState<LessonsSchedule | null>(null)
	const [exception, setException] = useState<CalendarException | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleClassChange = async (value: string) => {
		setClassId(value)
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

	const exceptionText = exception
		? exception.type === 'holiday'
			? t('exceptionHoliday')
			: exception.type === 'half_day'
				? t('exceptionHalfDay')
				: t('exceptionSpecial')
		: null

	return (
		<section className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
			<div className='mb-4 flex items-center gap-2'>
				<CalendarDays className='h-5 w-5 text-blue-600' />
				<h2 className='text-lg font-semibold text-gray-900'>{t('whoFinishes')}</h2>
			</div>

			<div className='max-w-md'>
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
					<optgroup label={t('classesGroup')}>
						{classGroups.classes.map(option => (
							<option key={option.id} value={option.id}>
								{option.label}
							</option>
						))}
					</optgroup>
					<optgroup label={t('megamasGroup')}>
						{classGroups.megamas.map(option => (
							<option key={option.id} value={option.id}>
								{option.label}
							</option>
						))}
					</optgroup>
				</select>
			</div>

			{exception && exceptionText && (
				<div className='mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800'>
					<Info className='mt-0.5 h-4 w-4 shrink-0' />
					<span>
						{exceptionText}
						{exception?.note ? `: ${exception.note}` : ''}
					</span>
				</div>
			)}

			{loading && <p className='mt-4 text-sm text-gray-500'>{t('loading')}</p>}
			{!loading && error && <p className='mt-4 text-sm text-red-600'>{error}</p>}

			{!loading && !error && schedule && (
				<div className='mt-5 overflow-hidden rounded-xl border border-gray-200'>
					<table className='w-full text-sm'>
						<thead className='bg-gray-50'>
							<tr>
								<th className='px-4 py-2.5 text-start font-medium text-gray-500'>{t('dayColumn')}</th>
								<th className='px-4 py-2.5 text-start font-medium text-gray-500'>{t('endTimeColumn')}</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-gray-100'>
							{DAY_KEYS.map((key, index) => {
								const isToday = index === today.dayIndex
								// Зеркало resolveEndTime: базовый класс — только его расписание,
								// мегама — расписание мегамы (override half_day ищется по выбранному id).
								const resolved =
									schedule.type === 'megama'
										? resolveManagementEndTime(index, null, schedule, isToday ? exception : null, schedule.id, schedule.id)
										: resolveManagementEndTime(index, schedule, null, isToday ? exception : null, schedule.id, null)
								return (
									<tr key={key} className={isToday ? 'bg-blue-50/60' : undefined}>
										<td className='px-4 py-2.5 font-medium text-gray-700'>
											{t(`days.${key}`)}
											{isToday && (
												<span className='ms-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700'>
													{t('today')}
												</span>
											)}
										</td>
										<td className='px-4 py-2.5 text-gray-900'>
											{resolved.time ?? <span className='text-gray-400'>{t('noSchool')}</span>}
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			)}
		</section>
	)
}
