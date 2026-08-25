'use server'

import { API_URL } from '@/constants'
import { getSessionToken } from '@/utils/getSessionToken'

export default async function addBus(routeId: string, busesToOrder: number) {
	const sessionCookie = await getSessionToken()

	const res = await fetch(`${API_URL}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${sessionCookie}`,
		},
		body: JSON.stringify({ routeId, busesToOrder }),
	}).then(res => res.json())

	return res
}
