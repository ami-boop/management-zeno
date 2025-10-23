'use server'

import { getSessionToken } from '@/utils/getSessionToken'

export default async function addBus(routeId: string, busesToOrder: number) {
	const sessionCookie = await getSessionToken()

	const res = await fetch('https://addbus-ag7er5qhga-ew.a.run.app', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Cookie: `managementSessionCookie=${sessionCookie}`,
		},
		body: JSON.stringify({ routeId, busesToOrder }),
	}).then(res => res.json())

	return res
}
