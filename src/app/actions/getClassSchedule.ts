'use server'

import { ApiError, apiGet } from '@/lib/api/client'
import { parseLessonsManagementResponse, type LessonsSchedule } from '@/lib/api-contracts'
import { getSessionToken } from '@/utils/getSessionToken'

export type ClassScheduleResult =
	| { ok: true; schedule: LessonsSchedule }
	| { ok: false; error: 'unauthorized' | 'not_found' | 'server_error' }

export default async function getClassSchedule(classId: string): Promise<ClassScheduleResult> {
	const token = await getSessionToken()
	if (!token) return { ok: false, error: 'unauthorized' }

	try {
		const data = await apiGet('lessons/management', token, {
			params: { classId },
		})
		const schedule = parseLessonsManagementResponse(data)
		if (!schedule) return { ok: false, error: 'not_found' }
		return { ok: true, schedule }
	} catch (error) {
		if (error instanceof ApiError && error.status === 404) {
			return { ok: false, error: 'not_found' }
		}
		return { ok: false, error: 'server_error' }
	}
}
