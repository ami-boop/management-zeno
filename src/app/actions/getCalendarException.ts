'use server'

import { ApiError, apiGet } from '@/lib/api/client'
import {
	parseCalendarExceptionResponse,
	type CalendarException,
} from '@/lib/api-contracts'
import { getSessionToken } from '@/utils/getSessionToken'

export type CalendarExceptionResult =
	| { ok: true; exception: CalendarException | null }
	| { ok: false; error: 'unauthorized' | 'server_error' }

export default async function getCalendarException(
	date: string
): Promise<CalendarExceptionResult> {
	const token = await getSessionToken()
	if (!token) return { ok: false, error: 'unauthorized' }

	try {
		const data = await apiGet(`calendar-exceptions/${encodeURIComponent(date)}`, token)
		return { ok: true, exception: parseCalendarExceptionResponse(data) }
	} catch (error) {
		if (error instanceof ApiError && error.status === 404) {
			return { ok: true, exception: null }
		}
		return { ok: false, error: 'server_error' }
	}
}
