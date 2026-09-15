import { redirect } from 'next/navigation'
import Client from '@/components/notifications/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import { parseNotificationsPage } from '@/lib/api-contracts'

export const dynamic = 'force-dynamic'

const FIRST_PAGE_LIMIT = 30

export default async function NotificationsPage() {
	const token = await getSessionToken()
	if (!token) redirect('/login')

	const raw = await apiGet('notifications', token, { params: { limit: FIRST_PAGE_LIMIT } }).catch(() => null)
	const initial = parseNotificationsPage(raw)

	return <Client initialNotifications={initial?.items ?? []} initialCursor={initial?.nextCursor ?? null} />
}
