'use server'

import { getSessionToken } from '@/utils/getSessionToken'

export async function getLessonsSchedule(classId: string) {
	const sessionCookie = await getSessionToken()

	const res = await fetch(
		'https://getlessonsschedule-ag7er5qhga-ew.a.run.app',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: `managementSessionCookie=${sessionCookie}`,
			},
			cache: 'force-cache',
			body: JSON.stringify({ classId }),
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
