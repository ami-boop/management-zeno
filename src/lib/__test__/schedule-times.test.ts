import {
	buildAfternoonTimeline,
	buildMorningTimeline,
	effectiveEndTime,
	minutesToHHMM,
	parseHHMM,
	todayInIsrael,
} from '../schedule-times'
import type { CalendarException, LessonsSchedule } from '@/lib/api-contracts'

const schedule: LessonsSchedule = {
	id: 'yud_alef_1',
	type: 'base_class',
	name: 'י"א 1',
	endTimes: { '0': '15:35', '1': '15:35', '2': '13:15', '3': '15:35', '4': '15:35', '5': '12:30' },
}

const stops = [
	{ stopId: 'school_main', order: 1, durationMin: 0 },
	{ stopId: 'stop_north', order: 2, durationMin: 10 },
	{ stopId: 'stop_south', order: 3, durationMin: 15 },
]

describe('parseHHMM / minutesToHHMM', () => {
	it('parses valid HH:MM to minutes', () => {
		expect(parseHHMM('15:35')).toBe(15 * 60 + 35)
		expect(parseHHMM('9:05')).toBe(9 * 60 + 5)
	})

	it('rejects invalid values', () => {
		expect(parseHHMM('24:00')).toBeNull()
		expect(parseHHMM('12:60')).toBeNull()
		expect(parseHHMM('abc')).toBeNull()
	})

	it('formats minutes back to HH:MM with day wrap', () => {
		expect(minutesToHHMM(15 * 60 + 35)).toBe('15:35')
		expect(minutesToHHMM(25 * 60)).toBe('01:00')
	})
})

describe('effectiveEndTime', () => {
	it('returns base time without exception', () => {
		expect(effectiveEndTime(schedule, 'yud_alef_1', 2, null)).toBe('13:15')
	})

	it('returns null on holiday', () => {
		const ex: CalendarException = { id: 'x', type: 'holiday' }
		expect(effectiveEndTime(schedule, 'yud_alef_1', 2, ex)).toBeNull()
	})

	it('applies half-day override only to listed class', () => {
		const ex: CalendarException = {
			id: 'x',
			type: 'half_day',
			overrideEndTimes: { yud_alef_1: '11:00' },
		}
		expect(effectiveEndTime(schedule, 'yud_alef_1', 2, ex)).toBe('11:00')
		expect(effectiveEndTime(schedule, 'other_1', 2, ex)).toBe('13:15')
	})

	it('applies special-schedule departure only to scoped class', () => {
		const ex: CalendarException = {
			id: 'x',
			type: 'special_schedule',
			specialSchedule: { scope: ['yud_alef_1'], departureTime: '16:00' },
		}
		expect(effectiveEndTime(schedule, 'yud_alef_1', 2, ex)).toBe('16:00')
		expect(effectiveEndTime(schedule, 'other_1', 2, ex)).toBe('13:15')
	})

	it('returns null for missing day key', () => {
		expect(effectiveEndTime(schedule, 'yud_alef_1', 6, null)).toBeNull()
	})
})

describe('buildAfternoonTimeline', () => {
	it('computes cumulative arrival times from departure', () => {
		const timeline = buildAfternoonTimeline(stops, '15:35')
		expect(timeline.departureTime).toBe('15:35')
		expect(timeline.entries.map(e => e.time)).toEqual(['15:35', '15:45', '16:00'])
		expect(timeline.entries[0].isSchool).toBe(true)
	})

	it('returns empty entries when departure unknown', () => {
		expect(buildAfternoonTimeline(stops, null).entries).toEqual([])
	})
})

describe('buildMorningTimeline', () => {
	it('computes offsets from route start', () => {
		expect(buildMorningTimeline(stops).map(s => s.offsetMin)).toEqual([0, 10, 25])
	})
})

describe('todayInIsrael', () => {
	it('returns a YYYY-MM-DD date and valid day index', () => {
		const today = todayInIsrael()
		expect(today.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
		expect(today.dayIndex).toBeGreaterThanOrEqual(0)
		expect(today.dayIndex).toBeLessThanOrEqual(6)
	})
})
