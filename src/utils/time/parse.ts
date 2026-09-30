import { SUMMER_OFFSET_MS, WINTER_OFFSET_MS, wallKey } from './israel'

export function parseIsraelTime(dateStr: string, timeStr: string): Date {
	const naiveUtc = new Date(`${dateStr}T${timeStr}:00Z`)
	if (Number.isNaN(naiveUtc.getTime())) return naiveUtc
	const key = `${dateStr}T${timeStr}`
	const summer = naiveUtc.getTime() - SUMMER_OFFSET_MS
	if (wallKey(summer) === key) return new Date(summer)
	return new Date(naiveUtc.getTime() - WINTER_OFFSET_MS)
}

/** Parse "H:MM" or "HH:MM" to minutes since midnight. Returns null on invalid. */
export function parseHHMM(value: string): number | null {
	const match = /^(\d{1,2}):(\d{2})$/.exec(value)
	if (!match) return null
	const hours = Number(match[1])
	const minutes = Number(match[2])
	if (hours > 23 || minutes > 59) return null
	return hours * 60 + minutes
}

/** Convert minutes since midnight to "HH:MM" (normalized to 0-1439). */
export function minutesToHHMM(total: number): string {
	const normalized = ((total % 1440) + 1440) % 1440
	const hours = Math.floor(normalized / 60)
	const minutes = normalized % 60
	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}
