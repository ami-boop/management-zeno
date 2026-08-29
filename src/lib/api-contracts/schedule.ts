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
