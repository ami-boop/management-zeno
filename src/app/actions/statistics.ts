'use server'

import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import { parseStatistics, type StatisticsData } from '@/lib/api-contracts'

export async function getStatistics(
	date: string,
	range: number,
): Promise<{ ok: boolean; data: StatisticsData | null }> {
	const token = await getSessionToken()
	if (!token) return { ok: false, data: null }
	try {
		const raw = await apiGet('statistics', token, { params: { date, range } })
		return { ok: true, data: parseStatistics(raw) }
	} catch {
		return { ok: false, data: null }
	}
}
