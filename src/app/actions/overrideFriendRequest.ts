'use server'

import { getSessionToken } from '@/utils/getSessionToken'
import { API_URL } from '@/constants'

export type OverrideAction = 'approve' | 'reject'

export default async function overrideFriendRequest(
	uid: string,
	action: OverrideAction,
	note?: string,
): Promise<{ ok: boolean; status: number }> {
	const token = await getSessionToken()
	if (!token) return { ok: false, status: 401 }

	const res = await fetch(`${API_URL}/friend-requests/${uid}/override`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ action, note }),
		cache: 'no-store',
	})

	return { ok: res.ok, status: res.status }
}
