import { ISRAEL_TZ } from './israel'

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
