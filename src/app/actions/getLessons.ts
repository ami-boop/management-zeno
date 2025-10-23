'use server'

import { getSessionToken } from '@/utils/getSessionToken'

export async function getLessonsSchedule(classId: string) {
	const sessionCookie = await getSessionToken()

	const res = await fetch(
		`https://getlessonsschedule-ag7er5qhga-ew.a.run.app?classId=${encodeURIComponent(
			classId
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
	const { classData } = await res.json()
	return {
		ok: true,
		schedule: classData.schedule,
		className: classData.className,
	}
}
