'use server'

import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import { parseNotificationsPage, type NotificationsPage } from '@/lib/api-contracts'

export async function getNotificationsPage(
	cursor: string | null,
	limit = 30,
): Promise<{ ok: boolean; data: NotificationsPage | null }> {
	const token = await getSessionToken()
	if (!token) return { ok: false, data: null }
	const safeLimit = Number.isInteger(limit) ? Math.min(Math.max(limit, 1), 100) : 30
	try {
		const params: Record<string, string | number | undefined> = { limit: safeLimit }
		if (cursor) params.cursor = cursor
		const raw = await apiGet('notifications', token, { params })
		const data = parseNotificationsPage(raw)
		return { ok: data !== null, data }
	} catch {
		return { ok: false, data: null }
	}
}
