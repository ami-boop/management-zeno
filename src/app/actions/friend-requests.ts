'use server'

import { getSessionToken } from '@/utils/getSessionToken'
import { apiPost } from '@/lib/api/client'

export async function overrideFriendRequest(
	uid: string,
	action: 'approve' | 'reject'
): Promise<{ ok: boolean }> {
	const token = await getSessionToken()
	if (!token) return { ok: false }
	try {
		const result = await apiPost(`friend-requests/${uid}/override`, token, { action })
		return { ok: result.ok }
	} catch {
		return { ok: false }
	}
}
