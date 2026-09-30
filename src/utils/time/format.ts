import { ISRAEL_TZ, getIsraelOffsetMs } from './israel'

const pad = (n: number): string => String(n).padStart(2, '0')

/** Current time in Israel, HH:mm. */
export function getIsraelTime(nowMs: number = Date.now()): string {
	const d = new Date(nowMs + getIsraelOffsetMs(new Date(nowMs)))
	return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`
}

/** Format an ISO string or epoch ms as HH:MM in Asia/Jerusalem. Falls back to raw input. */
export function formatClockHHMM(value: string | number, locale: string): string {
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return String(value)
	return new Intl.DateTimeFormat(locale, {
		timeZone: ISRAEL_TZ,
		hour: '2-digit',
		minute: '2-digit',
	}).format(date)
}
