import {
	buildAfternoonTimeline,
	buildMorningTimeline,
	resolveManagementEndTime,
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

describe('resolveManagementEndTime', () => {
	const megama: LessonsSchedule = {
		id: 'physics_adv',
		type: 'megama',
		name: 'פיזיקה מוגבר',
		endTimes: { '2': '16:20', '3': '16:20' },
	}

	it('returns class time without megama', () => {
		expect(resolveManagementEndTime(2, schedule, null, null, 'yud_alef_1', null).time).toBe('13:15')
	})

	it('returns the later of class and megama end times', () => {
		expect(resolveManagementEndTime(2, schedule, megama, null, 'yud_alef_1', 'physics_adv').time).toBe('16:20')
		expect(resolveManagementEndTime(3, schedule, megama, null, 'yud_alef_1', 'physics_adv').time).toBe('16:20')
	})

	it('falls back to megama time when class missing', () => {
		expect(resolveManagementEndTime(2, null, megama, null, 'yud_alef_1', 'physics_adv').time).toBe('16:20')
	})

	it('Friday and Saturday are no_school', () => {
		expect(resolveManagementEndTime(5, schedule, null, null, 'yud_alef_1', null).reason).toBe('no_school')
		expect(resolveManagementEndTime(6, schedule, megama, null, 'yud_alef_1', 'physics_adv').time).toBeNull()
	})

	it('holiday and no_transport return null', () => {
		expect(resolveManagementEndTime(2, schedule, megama, { id: 'x', type: 'holiday' }, 'yud_alef_1', 'physics_adv').time).toBeNull()
		expect(resolveManagementEndTime(2, schedule, megama, { id: 'x', type: 'no_transport' }, 'yud_alef_1', 'physics_adv').reason).toBe('no_transport')
	})

	it('applies half-day override by class or megama', () => {
		const ex: CalendarException = {
			id: 'x',
			type: 'half_day',
			overrideEndTimes: { yud_alef_1: '11:00', physics_adv: '11:30' },
		}
		expect(resolveManagementEndTime(2, schedule, megama, ex, 'yud_alef_1', 'physics_adv').time).toBe('11:00')
		expect(resolveManagementEndTime(2, schedule, megama, ex, 'other_1', 'physics_adv').time).toBe('11:30')
	})

	it('applies special-schedule departure when class or megama in scope', () => {
		const ex: CalendarException = {
			id: 'x',
			type: 'special_schedule',
			specialSchedule: { scope: ['physics_adv'], departureTime: '16:00' },
		}
		expect(resolveManagementEndTime(2, schedule, megama, ex, 'yud_alef_1', 'physics_adv').time).toBe('16:00')
		expect(resolveManagementEndTime(2, schedule, megama, ex, 'other_1', null).time).toBe('16:20')
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
