export const ISRAEL_TZ = 'Asia/Jerusalem'

export const WINTER_OFFSET_MS = 2 * 3600000
export const SUMMER_OFFSET_MS = 3 * 3600000

export function getIsraelOffsetMs(reference: Date): number {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone: ISRAEL_TZ,
		hourCycle: 'h23',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	})
		.formatToParts(reference)
		.reduce<Record<string, string>>((acc, part) => {
			if (part.type !== 'literal') acc[part.type] = part.value
			return acc
		}, {})

	const asUtc = Date.UTC(
		+parts.year,
		+parts.month - 1,
		+parts.day,
		+parts.hour,
		+parts.minute,
		+parts.second,
	)
	return asUtc - reference.getTime()
}

export function wallKey(ms: number): string {
	return new Date(ms + getIsraelOffsetMs(new Date(ms))).toISOString().slice(0, 16)
}

export const israelDateStr = (date: Date): string =>
	new Intl.DateTimeFormat('en-CA', {
		timeZone: ISRAEL_TZ,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(date)
