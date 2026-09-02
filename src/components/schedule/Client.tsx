'use client'

import { useTranslations } from 'next-intl'
import ClassEndTimes, { type GroupedClassOptions } from './ClassEndTimes'
import RouteTimeline from './RouteTimeline'

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

	return (
		<div className='mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8 space-y-8'>
			<h1 className='text-2xl font-bold text-gray-900'>{t('title')}</h1>
			<ClassEndTimes classGroups={classGroups} today={today} />
			<RouteTimeline classGroups={classGroups} routes={routes} today={today} />
		</div>
	)
}
