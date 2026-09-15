export type CalendarView = 'day' | 'week' | 'month'
export type DisplayMode = 'list' | 'calendar'

export const VIEW_ORDER: CalendarView[] = ['day', 'week', 'month']

export function nextView(view: CalendarView, dir: number): CalendarView {
	const idx = VIEW_ORDER.indexOf(view)
	const next = idx + dir
	if (next < 0) return VIEW_ORDER[0]
	if (next >= VIEW_ORDER.length) return VIEW_ORDER[VIEW_ORDER.length - 1]
	return VIEW_ORDER[next]
}

export function toISO(date: Date): string {
	const y = date.getFullYear()
	const m = String(date.getMonth() + 1).padStart(2, '0')
	const d = String(date.getDate()).padStart(2, '0')
	return `${y}-${m}-${d}`
}

export function fromISO(iso: string): Date {
	const [y, m, d] = iso.split('-').map(Number)
	return new Date(y, m - 1, d)
}

export function addDays(iso: string, delta: number): string {
	const d = fromISO(iso)
	d.setDate(d.getDate() + delta)
	return toISO(d)
}

export function startOfWeek(iso: string): string {
	const d = fromISO(iso)
	const day = d.getDay()
	d.setDate(d.getDate() - day)
	return toISO(d)
}

export function weekDays(anchor: string): string[] {
	const start = startOfWeek(anchor)
	return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export function monthGrid(anchor: string): string[] {
	const d = fromISO(anchor)
	const first = new Date(d.getFullYear(), d.getMonth(), 1)
	const startDay = first.getDay()
	const start = new Date(first)
	start.setDate(first.getDate() - startDay)
	return Array.from({ length: 42 }, (_, i) => {
		const cur = new Date(start)
		cur.setDate(start.getDate() + i)
		return toISO(cur)
	})
}

export function monthLabel(iso: string, locale: string): string {
	const d = fromISO(iso)
	return d.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
}

export function weekLabel(anchor: string, locale: string): string {
	const days = weekDays(anchor)
	const start = fromISO(days[0])
	const end = fromISO(days[6])
	const sameMonth = start.getMonth() === end.getMonth()
	if (sameMonth) {
		return `${start.getDate()}–${end.getDate()} ${start.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}`
	}
	return `${start.toLocaleDateString(locale, { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}`
}

export function dayLabel(iso: string, locale: string): string {
	return fromISO(iso).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function isSameMonth(a: string, b: string): boolean {
	const da = fromISO(a)
	const db = fromISO(b)
	return da.getMonth() === db.getMonth() && da.getFullYear() === db.getFullYear()
}

let _hebrewPartsFmt: Intl.DateTimeFormat | null = null
let _hebrewMonthFmt: Intl.DateTimeFormat | null = null

const GEMATRIA_TENS: Array<[number, string]> = [
	[400, 'ת'], [300, 'ש'], [200, 'ר'], [100, 'ק'], [90, 'צ'], [80, 'פ'],
	[70, 'ע'], [60, 'ס'], [50, 'נ'], [40, 'מ'], [30, 'ל'], [20, 'כ'], [10, 'י'],
]
const GEMATRIA_ONES = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט']

/** Number to Hebrew-letter numeral (gematria), e.g. 23 → כ״ג, 12 → י״ב, 4 → ד׳. */
export function toHebrewNumeral(n: number): string {
	if (!Number.isInteger(n) || n <= 0) return ''
	if (n === 15) return 'ט״ו'
	if (n === 16) return 'ט״ז'
	let letters = ''
	let rest = n
	for (const [value, ch] of GEMATRIA_TENS) {
		while (rest >= value) {
			letters += ch
			rest -= value
		}
	}
	if (rest === 15) return letters + 'ט״ו'
	if (rest === 16) return letters + 'ט״ז'
	letters += GEMATRIA_ONES[rest]
	if (letters.length <= 1) return letters + '׳'
	return letters.slice(0, -1) + '״' + letters.slice(-1)
}

function hebrewDateParts(iso: string): { day: number; monthName: string; year: number } | null {
	try {
		if (!_hebrewPartsFmt) _hebrewPartsFmt = new Intl.DateTimeFormat('he-u-ca-hebrew', { day: 'numeric', month: 'numeric', year: 'numeric' })
		if (!_hebrewMonthFmt) _hebrewMonthFmt = new Intl.DateTimeFormat('he-u-ca-hebrew', { month: 'long' })
		const date = fromISO(iso)
		const parts = _hebrewPartsFmt.formatToParts(date)
		const day = Number(parts.find(p => p.type === 'day')?.value)
		const year = Number(parts.find(p => p.type === 'year')?.value)
		const monthName = _hebrewMonthFmt.format(date).replace(/^ב/, '')
		if (!day || !year || !monthName) return null
		return { day, monthName, year }
	} catch {
		return null
	}
}

/** Hebrew day-of-month (e.g. כ״ג) for the alternate calendar, like Apple Calendar. */
export function hebrewDayLabel(iso: string): string {
	const parts = hebrewDateParts(iso)
	return parts ? toHebrewNumeral(parts.day) : ''
}

/** Short Hebrew date with month (e.g. כ״ג אלול) to sit next to the Gregorian date. */
export function hebrewShortLabel(iso: string): string {
	const parts = hebrewDateParts(iso)
	return parts ? `${toHebrewNumeral(parts.day)} ${parts.monthName}` : ''
}

/** Full Hebrew date (e.g. כ״ג באלול תשפ״ו). Year is written without millennia, as customary. */
export function hebrewFullLabel(iso: string): string {
	const parts = hebrewDateParts(iso)
	if (!parts) return ''
	return `${toHebrewNumeral(parts.day)} ב${parts.monthName} ${toHebrewNumeral(parts.year % 1000)}`
}

export function rangeDates(start: string, end: string): string[] {
	const s = fromISO(start)
	const e = fromISO(end)
	const out: string[] = []
	const cur = new Date(s)
	while (cur <= e) {
		out.push(toISO(cur))
		cur.setDate(cur.getDate() + 1)
	}
	return out
}
