'use server'

import { getSessionToken } from '@/utils/getSessionToken'
import { apiPost } from '@/lib/api/client'

export type OverrideAction = 'approve' | 'reject'

export async function overrideFriendRequest(
	uid: string,
	action: OverrideAction,
	note?: string
): Promise<{ ok: boolean }> {
	const token = await getSessionToken()
	if (!token) return { ok: false }
	try {
		const result = await apiPost(
			`friend-requests/${uid}/override`,
			token,
			note === undefined ? { action } : { action, note }
		)
		return { ok: result.ok }
	} catch {
		return { ok: false }
	}
}
