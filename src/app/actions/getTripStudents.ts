'use server'

import { getSessionToken } from '@/utils/getSessionToken'
import { API_URL } from '@/constants'
import { parseTripStudents, type TripStudent } from '@/lib/api-contracts'

/** Returns null on failure so callers can distinguish "empty" from "failed". */
export default async function getTripStudents(tripId: string): Promise<TripStudent[] | null> {
	const token = await getSessionToken()
	if (!token) return null

	const res = await fetch(`${API_URL}/dashboard/trips/${tripId}/students`, {
		headers: { Authorization: `Bearer ${token}` },
		cache: 'no-store',
	})
	if (!res.ok) return null

	try {
		return parseTripStudents(await res.json())
	} catch {
		return null
	}
}
