import type { CalendarException, LessonsSchedule, StopEntry } from '@/lib/api-contracts'

export function parseHHMM(value: string): number | null {
	const match = /^(\d{1,2}):(\d{2})$/.exec(value)
	if (!match) return null
	const hours = Number(match[1])
	const minutes = Number(match[2])
	if (hours > 23 || minutes > 59) return null
	return hours * 60 + minutes
}

export function minutesToHHMM(total: number): string {
	const normalized = ((total % 1440) + 1440) % 1440
	const hours = Math.floor(normalized / 60)
	const minutes = normalized % 60
	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function effectiveEndTime(
	schedule: LessonsSchedule,
	classId: string,
	dayIndex: number,
	exception: CalendarException | null
): string | null {
	const base = schedule.endTimes[String(dayIndex)] ?? null
	if (!exception) return base

	if (exception.type === 'holiday') return null
	if (exception.type === 'half_day') {
		return exception.overrideEndTimes?.[classId] ?? base
	}
	if (
		exception.type === 'special_schedule' &&
		exception.specialSchedule?.scope?.includes(classId)
	) {
		return exception.specialSchedule.departureTime ?? base
	}
	return base
}

export interface TimelineEntry {
	stopId: string
	order: number
	time: string
	isSchool: boolean
}

export interface Timeline {
	departureTime: string | null
	entries: TimelineEntry[]
}

export function buildAfternoonTimeline(
	stops: StopEntry[],
	departureHHMM: string | null
): Timeline {
	const departureMinutes = departureHHMM ? parseHHMM(departureHHMM) : null
	if (departureMinutes === null) {
		return { departureTime: departureHHMM, entries: [] }
	}

	const ordered = [...stops].sort((a, b) => a.order - b.order)
	const entries: TimelineEntry[] = []
	let cumulative = departureMinutes
	for (const stop of ordered) {
		cumulative += stop.durationMin
		entries.push({
			stopId: stop.stopId,
			order: stop.order,
			time: minutesToHHMM(cumulative),
			isSchool: stop.order === ordered[0]?.order,
		})
	}
	return { departureTime: departureHHMM, entries }
}

export function buildMorningTimeline(stops: StopEntry[]): { stopId: string; order: number; offsetMin: number }[] {
	const ordered = [...stops].sort((a, b) => a.order - b.order)
	let cumulative = 0
	return ordered.map(stop => {
		cumulative += stop.durationMin
		return { stopId: stop.stopId, order: stop.order, offsetMin: cumulative }
	})
}

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
