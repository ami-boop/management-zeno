/**
 * Date/time helpers for Israel timezone.
 */

/** Current date (YYYY-MM-DD) and day index (0=Sun) in Asia/Jerusalem. */
export function todayInIsrael(): { date: string; dayIndex: number } {
	const now = new Date()
	const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(now)
	const weekday = new Intl.DateTimeFormat('en-US', {
		timeZone: 'Asia/Jerusalem',
		weekday: 'short',
	}).format(now)
	const order = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	const dayIndex = order.indexOf(weekday)
	return { date, dayIndex: dayIndex === -1 ? 0 : dayIndex }
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