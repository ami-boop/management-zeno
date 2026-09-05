'use server'

import { getSessionToken } from '@/utils/getSessionToken'
import { apiPost, apiPut } from '@/lib/api/client'
import type { StopFormValues } from '@/lib/api-contracts'

export async function createStop(
	values: StopFormValues
): Promise<{ ok: boolean; stopId?: string }> {
	const token = await getSessionToken()
	if (!token) return { ok: false }
	try {
		const result = await apiPost('stops', token, values)
		if (!result.ok) return { ok: false }
		const stopId =
			result.data && typeof result.data === 'object' && 'stopId' in result.data
				? String((result.data as { stopId: unknown }).stopId)
				: undefined
		return { ok: true, stopId }
	} catch {
		return { ok: false }
	}
}

export async function updateStop(
	stopId: string,
	values: Partial<StopFormValues> & { isActive?: boolean }
): Promise<{ ok: boolean }> {
	const token = await getSessionToken()
	if (!token) return { ok: false }
	try {
		const result = await apiPut(`stops/${stopId}`, token, values)
		return { ok: result.ok }
	} catch {
		return { ok: false }
	}
}
