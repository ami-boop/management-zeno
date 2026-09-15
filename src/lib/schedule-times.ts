import type { CalendarException, LessonsSchedule, StopEntry } from '@/lib/api-contracts'
import { parseHHMM, minutesToHHMM } from '@/utils/date'

export { parseHHMM, minutesToHHMM }

export function parallelOfClassId(classId: string): string {
	return classId.replace(/_\d+$/, '')
}

export type ResolvedEndReason =
	| 'normal'
	| 'half_day'
	| 'special_schedule'
	| 'holiday'
	| 'no_transport'
	| 'no_school'

export interface ResolvedEnd {
	time: string | null
	reason: ResolvedEndReason
}

/**
 * Точное зеркало backend utils/resolve-end-time.ts: пт/сб — нет занятий,
 * holiday/no_transport — нет занятий, half_day — override по классу или мегаме,
 * special_schedule — departureTime для scope, иначе max(класс, мегама).
 */
export function resolveManagementEndTime(
	dayIndex: number,
	classSchedule: LessonsSchedule | null,
	megamaSchedule: LessonsSchedule | null,
	exception: CalendarException | null,
	classId: string,
	megamaId: string | null
): ResolvedEnd {
	if (dayIndex === 5 || dayIndex === 6) {
		return { time: null, reason: 'no_school' }
	}

	if (exception) {
		if (exception.type === 'holiday' || exception.type === 'no_transport') {
			return { time: null, reason: exception.type }
		}

		if (exception.type === 'half_day' && exception.overrideEndTimes) {
			const override =
				exception.overrideEndTimes[classId] ??
				(megamaId ? exception.overrideEndTimes[megamaId] : undefined)
			if (override) {
				return { time: override, reason: 'half_day' }
			}
		}

		if (exception.type === 'special_schedule' && exception.specialSchedule) {
			const scope = exception.specialSchedule.scope ?? []
			if (scope.includes(classId) || (megamaId !== null && scope.includes(megamaId))) {
				return { time: exception.specialSchedule.departureTime ?? null, reason: 'special_schedule' }
			}
		}
	}

	const classEndTime = classSchedule?.endTimes[String(dayIndex)] ?? null
	const megamaEndTime = megamaSchedule?.endTimes[String(dayIndex)] ?? null

	if (!classEndTime && !megamaEndTime) {
		return { time: null, reason: 'no_school' }
	}

	if (classEndTime && megamaEndTime) {
		const classMinutes = parseHHMM(classEndTime)
		const megamaMinutes = parseHHMM(megamaEndTime)
		if (classMinutes !== null && megamaMinutes !== null) {
			return { time: classMinutes >= megamaMinutes ? classEndTime : megamaEndTime, reason: 'normal' }
		}
		return { time: classEndTime > megamaEndTime ? classEndTime : megamaEndTime, reason: 'normal' }
	}

	return { time: classEndTime ?? megamaEndTime, reason: 'normal' }
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

export { todayInIsrael } from '@/utils/date'
