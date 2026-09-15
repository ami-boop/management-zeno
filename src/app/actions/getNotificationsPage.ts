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
	try {
		const params: Record<string, string | number | undefined> = { limit }
		if (cursor) params.cursor = cursor
		const raw = await apiGet('notifications', token, { params })
		return { ok: true, data: parseNotificationsPage(raw) }
	} catch {
		return { ok: false, data: null }
	}
}
