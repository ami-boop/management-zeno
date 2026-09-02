import { isRecord, isString } from '@/utils/type-guards'

export interface ScheduleDoc {
	type: 'base_class' | 'megama'
	endTimes: Record<string, string>
}

export function parseScheduleDoc(value: unknown): ScheduleDoc | null {
	if (!isRecord(value)) return null
	const type = value.type
	if (type !== 'base_class' && type !== 'megama') return null
	const endTimes: Record<string, string> = {}
	if (isRecord(value.endTimes)) {
		for (const [key, val] of Object.entries(value.endTimes)) {
			if (isString(val)) endTimes[key] = val
		}
	}
	return { type, endTimes }
}

export function parseLessonsSchedule(value: unknown): ScheduleDoc | null {
	if (!isRecord(value)) return null
	return parseScheduleDoc(value.schedule)
}

export interface LessonsSchedule {
	id: string
	type: 'base_class' | 'megama'
	name: string
	endTimes: Record<string, string>
}

export function parseLessonsManagementResponse(value: unknown): LessonsSchedule | null {
	if (!isRecord(value)) return null
	const schedule = value.schedule
	if (!isRecord(schedule)) return null
	if (!isString(schedule.id) || !isString(schedule.name)) return null
	if (schedule.type !== 'base_class' && schedule.type !== 'megama') return null
	if (!isRecord(schedule.endTimes)) return null

	const endTimes: Record<string, string> = {}
	for (const [key, val] of Object.entries(schedule.endTimes)) {
		if (isString(val)) endTimes[key] = val
	}
	return { id: schedule.id, type: schedule.type, name: schedule.name, endTimes }
}

export type CalendarExceptionType =
	| 'holiday'
	| 'exam_day'
	| 'half_day'
	| 'no_transport'
	| 'special_schedule'

export interface CalendarException {
	id: string
	type: CalendarExceptionType
	note?: string
	overrideEndTimes?: Record<string, string>
	specialSchedule?: {
		scope?: string[]
		returnsToSchool?: boolean
		departureTime?: string
	}
}

const EXCEPTION_TYPES: CalendarExceptionType[] = ['holiday', 'exam_day', 'half_day', 'no_transport', 'special_schedule']

export function parseCalendarExceptionResponse(value: unknown): CalendarException | null {
	if (!isRecord(value)) return null
	if (!isString(value.id)) return null
	if (typeof value.type !== 'string' || !EXCEPTION_TYPES.includes(value.type as CalendarExceptionType)) {
		return null
	}

	const exception: CalendarException = { id: value.id, type: value.type as CalendarExceptionType }
	if (isString(value.note)) exception.note = value.note

	if (isRecord(value.overrideEndTimes)) {
		const overrides: Record<string, string> = {}
		for (const [key, val] of Object.entries(value.overrideEndTimes)) {
			if (isString(val)) overrides[key] = val
		}
		exception.overrideEndTimes = overrides
	}

	if (isRecord(value.specialSchedule)) {
		const special: NonNullable<CalendarException['specialSchedule']> = {}
		if (Array.isArray(value.specialSchedule.scope)) {
			special.scope = value.specialSchedule.scope.filter(isString)
		}
		if (typeof value.specialSchedule.returnsToSchool === 'boolean') {
			special.returnsToSchool = value.specialSchedule.returnsToSchool
		}
		if (isString(value.specialSchedule.departureTime)) {
			special.departureTime = value.specialSchedule.departureTime
		}
		exception.specialSchedule = special
	}

	return exception
}
