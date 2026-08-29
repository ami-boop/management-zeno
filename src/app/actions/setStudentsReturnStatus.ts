'use server'

import { getSessionToken } from '@/utils/getSessionToken'
import { API_URL } from '@/constants'

export interface ReportData {
	parallel?: string | null
	className?: string | null
	megama?: string | null
	manualUids?: string[]
	manualStopId?: string | null
	time: string | null
}

export interface ReportResult {
	ok: boolean
	updatedCount?: number
	operation?: string
	error?: string
}

export default async function setStudentReturnStatus(
	reportData: ReportData
): Promise<ReportResult> {
	const sessionCookie = await getSessionToken()
	if (!sessionCookie) {
		return { ok: false, error: 'unauthorized' }
	}

	const requestBody: Record<string, unknown> = { time: reportData.time }

	if (reportData.manualUids && reportData.manualUids.length > 0) {
		requestBody.manualUids = reportData.manualUids
		if (reportData.manualStopId) requestBody.manualStopId = reportData.manualStopId
	} else {
		if (reportData.parallel) requestBody.parallel = reportData.parallel
		if (reportData.className) requestBody.className = reportData.className
		if (reportData.megama) requestBody.megama = reportData.megama
	}

	try {
		const res = await fetch(`${API_URL}/return-status/management`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${sessionCookie}`,
			},
			body: JSON.stringify(requestBody),
			cache: 'no-store',
		})

		let data: Record<string, unknown> = {}
		try {
			data = await res.json()
		} catch {
			data = {}
		}

		if (!res.ok) {
			return { ok: false, error: typeof data.error === 'string' ? data.error : `status_${res.status}` }
		}

		return {
			ok: true,
			updatedCount: typeof data.updatedCount === 'number' ? data.updatedCount : undefined,
			operation: typeof data.operation === 'string' ? data.operation : undefined,
		}
	} catch {
		return { ok: false, error: 'network' }
	}
}
