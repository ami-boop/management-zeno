'use server'

import { getSessionToken } from '@/utils/getSessionToken'
import { apiPost, apiPut } from '@/lib/api/client'
import type { ExceptionFormValues } from '@/lib/api-contracts'

export async function createException(
	date: string,
	values: ExceptionFormValues
): Promise<{ ok: boolean }> {
	const token = await getSessionToken()
	if (!token) return { ok: false }
	try {
		const result = await apiPost('calendar-exceptions', token, { date, ...values })
		return { ok: result.ok }
	} catch {
		return { ok: false }
	}
}

export async function updateException(
	date: string,
	values: Partial<ExceptionFormValues> & { isActive?: boolean }
): Promise<{ ok: boolean }> {
	const token = await getSessionToken()
	if (!token) return { ok: false }
	try {
		const result = await apiPut(`calendar-exceptions/${date}`, token, values)
		return { ok: result.ok }
	} catch {
		return { ok: false }
	}
}

export async function createExceptionsBatch(
	dates: string[],
	values: ExceptionFormValues
): Promise<{ ok: boolean; conflicts?: string[] }> {
	const token = await getSessionToken()
	if (!token) return { ok: false }
	try {
		const result = await apiPost('calendar-exceptions/batch', token, { dates, ...values })
		if (!result.ok) {
			const body = result.data as { conflicts?: string[] } | null
			return { ok: false, conflicts: body?.conflicts }
		}
		return { ok: true }
	} catch {
		return { ok: false }
	}
}

export async function restoreException(date: string): Promise<{ ok: boolean }> {
	const token = await getSessionToken()
	if (!token) return { ok: false }
	try {
		const result = await apiPost(`calendar-exceptions/${date}/restore`, token, {})
		return { ok: result.ok }
	} catch {
		return { ok: false }
	}
}
