'use server'

import { getSessionToken } from '@/utils/getSessionToken'

export async function getSchedule(routeId: string) {
	const sessionCookie = await getSessionToken()

	const res = await fetch(
		'https://getmanagementschedule-ag7er5qhga-ew.a.run.app',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: `managementSessionCookie=${sessionCookie}`,
			},
			cache: 'force-cache',
			body: JSON.stringify({ routeId }),
		}
	)
	if (!res.ok) throw new Error('Failed to fetch schedule')
	const data = await res.json()
	return { ok: true, schedule: data.schedule }
}
