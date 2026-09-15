import { redirect } from 'next/navigation'
import Client from '@/components/statistics/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import { parseStatistics } from '@/lib/api-contracts'
import { todayInIsrael } from '@/lib/schedule-times'

export const dynamic = 'force-dynamic'

export default async function StatisticsPage() {
	const token = await getSessionToken()
	if (!token) redirect('/login')

	const today = todayInIsrael().date
	const raw = await apiGet('statistics', token, { params: { date: today, range: 1 } }).catch(() => null)

	return <Client initial={parseStatistics(raw)} initialDate={today} initialRange={1} />
}
