'use server'

import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet, apiPut } from '@/lib/api/client'
import { parseSettings, type SettingsData } from '@/lib/api-contracts'

export async function getSettingsData(): Promise<{ ok: boolean; data: SettingsData | null }> {
	const token = await getSessionToken()
	if (!token) return { ok: false, data: null }
	try {
		const raw = await apiGet('settings', token)
		return { ok: true, data: parseSettings(raw) }
	} catch {
		return { ok: false, data: null }
	}
}

export interface SettingsPatch {
	reportDeadlineMinutes?: number
	reportTimes?: string[]
	vehicleCapacities?: { bus: number; minibus: number }
}

export async function updateSettingsData(
	patch: SettingsPatch,
): Promise<{ ok: boolean; data: SettingsData | null }> {
	const token = await getSessionToken()
	if (!token) return { ok: false, data: null }
	try {
		const result = await apiPut('settings', token, patch)
		if (!result.ok) return { ok: false, data: null }
		return { ok: true, data: parseSettings(result.data) }
	} catch {
		return { ok: false, data: null }
	}
}
