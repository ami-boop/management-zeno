'use server'

import { getSessionToken } from '@/utils/getSessionToken'
import { API_URL } from '@/constants'
import { parseTripStudents, type TripStudent } from '@/lib/api-contracts'

export default async function getTripStudents(tripId: string): Promise<TripStudent[]> {
	const token = await getSessionToken()
	if (!token) return []

	const res = await fetch(`${API_URL}/dashboard/trips/${tripId}/students`, {
		headers: { Authorization: `Bearer ${token}` },
		cache: 'no-store',
	})
	if (!res.ok) return []

	try {
		return parseTripStudents(await res.json())
	} catch {
		return []
	}
}
