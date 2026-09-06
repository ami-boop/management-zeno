'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CalendarClock, Users } from 'lucide-react'
import ClassEndTimes, { type GroupedClassOptions } from './ClassEndTimes'
import RouteTimeline from './RouteTimeline'
import getMegamaNames from '@/app/actions/getMegamaNames'

export interface ClassOption {
	id: string
	label: string
}

export interface RouteOption {
	id: string
	name: string
}

export interface TodayInfo {
	date: string
	dayIndex: number
}

export default function Client({
	classGroups,
	routes,
	today,
}: {
	classGroups: GroupedClassOptions
	routes: RouteOption[]
	today: TodayInfo
}) {
	const t = useTranslations('Schedule')
	const [megamaNames, setMegamaNames] = useState<Record<string, string>>({})

	useEffect(() => {
		const ids = [...new Set(classGroups.megamasByParallel.flatMap(m => m.megamaIds))]
		if (ids.length === 0) return
		let cancelled = false
		// One server-action round-trip; parallel backend fetches happen server-side.
		void getMegamaNames(ids).then(names => {
			if (!cancelled) setMegamaNames(names)
		})
		return () => {
			cancelled = true
		}
	}, [classGroups])

	return (
		<div className='mx-auto max-w-[1600px] space-y-8 px-4 py-8 sm:px-6 lg:px-8'>
			<div className='flex items-center gap-3'>
				<span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white'>
					<CalendarClock className='h-6 w-6' />
				</span>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>{t('title')}</h1>
					<p className='text-sm text-gray-500'>{t('pageHint')}</p>
				</div>
			</div>

			<section className='rounded-2xl border border-gray-200 bg-white shadow-sm'>
				<div className='flex items-start gap-3 border-b border-gray-100 px-5 py-4'>
					<span className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700'>
						<Users className='h-5 w-5' />
					</span>
					<div>
						<h2 className='text-lg font-semibold text-gray-900'>{t('whoFinishes')}</h2>
						<p className='text-sm text-gray-500'>{t('whoFinishesHint')}</p>
					</div>
				</div>
				<div className='p-5'>
					<ClassEndTimes classGroups={classGroups} megamaNames={megamaNames} today={today} />
				</div>
			</section>

			<section className='rounded-2xl border border-gray-200 bg-white shadow-sm'>
				<div className='flex items-start gap-3 border-b border-gray-100 px-5 py-4'>
					<span className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700'>
						<CalendarClock className='h-5 w-5' />
					</span>
					<div>
						<h2 className='text-lg font-semibold text-gray-900'>{t('timeline')}</h2>
						<p className='text-sm text-gray-500'>{t('timelineHint')}</p>
					</div>
				</div>
				<div className='p-5'>
					<RouteTimeline classGroups={classGroups} megamaNames={megamaNames} routes={routes} today={today} />
				</div>
			</section>
		</div>
	)
}
