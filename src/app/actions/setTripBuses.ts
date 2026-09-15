'use server'

import { getSessionToken } from '@/utils/getSessionToken'
import { API_URL } from '@/constants'

export default async function setTripBuses(
	tripId: string,
	body: { buses?: number | null; minibuses?: number | null },
): Promise<{ ok: boolean; status: number }> {
	const token = await getSessionToken()
	if (!token) return { ok: false, status: 401 }

	try {
		const res = await fetch(`${API_URL}/dashboard/trips/${tripId}/buses`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(body),
			cache: 'no-store',
		})

		return { ok: res.ok, status: res.status }
	} catch {
		return { ok: false, status: 0 }
	}
}
