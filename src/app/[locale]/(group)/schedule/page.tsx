import { getTranslations } from 'next-intl/server'
import type { WeekDay } from '@/types/schedule'
import { apiGet } from '@/lib/api/client'
import { parseRouteNames } from '@/lib/api-contracts'
import { getSessionToken } from '@/utils/getSessionToken'
import Client from '@/components/schedule/Client'

export const dynamic = 'force-dynamic'

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

  const token = await getSessionToken()
  const routeNames = token ? parseRouteNames(await apiGet('routes/names', token)) : []
  const routes = routeNames.map((route) => ({ id: route.routeId, name: route.name }))

  return <Client days={days} routes={routes} />
}
