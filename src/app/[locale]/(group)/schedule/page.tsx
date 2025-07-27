import { getTranslations } from 'next-intl/server'
import type { WeekDay } from '@/types/schedule'
import ScheduleClient from '@/components/schedule/ScheduleClient'

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

	// Examples
	const routes = [
		{ id: 'ROUTE-A', name: 'Route A' },
		{ id: 'ROUTE-B', name: 'Route B' },
		{ id: 'ROUTE-C', name: 'Route C' },
		{ id: 'ROUTE-D', name: 'Route D' },
		{ id: 'ROUTE-E', name: 'Route E' },
	]

	return <ScheduleClient days={days} routes={routes} />
}
