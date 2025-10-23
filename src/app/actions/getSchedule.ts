'use server'

import { getSessionToken } from '@/utils/getSessionToken'

export async function getSchedule(routeId: string) {
	const sessionCookie = await getSessionToken()

	const res = await fetch(
		`https://getmanagementschedule-ag7er5qhga-ew.a.run.app?routeId=${encodeURIComponent(
			routeId
		)}`,
		{
			headers: {
				'Content-Type': 'application/json',
				Cookie: `managementSessionCookie=${sessionCookie}`,
			},
			cache: 'force-cache',
		}
	)
	if (!res.ok) throw new Error('Failed to fetch schedule')
	const data = await res.json()
	return { ok: true, schedule: data.schedule }
}
