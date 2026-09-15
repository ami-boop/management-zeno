'use server'

import { getSessionToken } from '@/utils/getSessionToken'
import { apiPost, apiPut } from '@/lib/api/client'
import type { BusFormValues } from '@/lib/api-contracts'

export async function createBus(
	values: BusFormValues
): Promise<{ ok: boolean; busId?: string }> {
	const token = await getSessionToken()
	if (!token) return { ok: false }
	try {
		const result = await apiPost('buses', token, values)
		if (!result.ok) return { ok: false }
		const busId =
			result.data && typeof result.data === 'object' && 'busId' in result.data
				&& typeof (result.data as { busId: unknown }).busId === 'string'
				? (result.data as { busId: string }).busId
				: undefined
		return { ok: true, busId }
	} catch {
		return { ok: false }
	}
}

export async function updateBus(
	busId: string,
	values: Partial<BusFormValues> & { isActive?: boolean }
): Promise<{ ok: boolean }> {
	const token = await getSessionToken()
	if (!token) return { ok: false }
	try {
		const result = await apiPut(`buses/${busId}`, token, values)
		return { ok: result.ok }
	} catch {
		return { ok: false }
	}
}
