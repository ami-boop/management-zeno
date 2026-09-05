import { parseBuses, parseCalendarExceptions, parseStops } from '@/lib/api-contracts'

describe('parseBuses', () => {
	it('parses valid buses', () => {
		const buses = parseBuses([
			{
				busId: 'bus_1',
				licensePlate: '123-45-678',
				capacity: 45,
				driverName: 'Ivan',
				driverPhone: '050-1234567',
				notes: 'spare',
				isActive: true,
			},
		])
		expect(buses).toHaveLength(1)
		expect(buses[0]).toEqual({
			busId: 'bus_1',
			licensePlate: '123-45-678',
			capacity: 45,
			driverName: 'Ivan',
			driverPhone: '050-1234567',
			notes: 'spare',
			isActive: true,
		})
	})

	it('defaults missing optional fields', () => {
		const buses = parseBuses([{ busId: 'bus_2', licensePlate: 'X', capacity: 20 }])
		expect(buses[0]).toMatchObject({
			driverName: null,
			driverPhone: null,
			notes: null,
			isActive: true,
		})
	})

	it('skips invalid entries and non-arrays', () => {
		expect(parseBuses([{ capacity: 10 }, null, { busId: 'b', licensePlate: 5 }])).toEqual([])
		expect(parseBuses('nope')).toEqual([])
		expect(parseBuses(undefined)).toEqual([])
	})
})

describe('parseStops', () => {
	it('parses coordinates, notes and isActive', () => {
		const stops = parseStops([
			{ stopId: 's1', name: 'Central', lat: 32.7, lng: 35.3, address: 'Main St', notes: null, isActive: false },
		])
		expect(stops[0]).toEqual({
			stopId: 's1',
			name: 'Central',
			address: 'Main St',
			lat: 32.7,
			lng: 35.3,
			type: null,
			notes: null,
			isActive: false,
		})
	})

	it('skips entries without stopId or name', () => {
		expect(parseStops([{ name: 'no id' }, { stopId: 'no name' }, 'x'])).toEqual([])
	})
})

describe('parseCalendarExceptions', () => {
	it('parses a full exception', () => {
		const [item] = parseCalendarExceptions([
			{
				id: '2026-09-10',
				type: 'half_day',
				note: 'pre-holiday',
				overrideEndTimes: { '10-1': '12:30' },
				specialSchedule: null,
				isActive: true,
			},
		])
		expect(item).toEqual({
			id: '2026-09-10',
			type: 'half_day',
			note: 'pre-holiday',
			overrideEndTimes: { '10-1': '12:30' },
			specialSchedule: null,
			isActive: true,
		})
	})

	it('parses special schedule with scope', () => {
		const [item] = parseCalendarExceptions([
			{
				id: '2026-09-11',
				type: 'special_schedule',
				note: null,
				specialSchedule: { scope: ['10-1', '11-2'], departureTime: '09:00' },
			},
		])
		expect(item.specialSchedule).toEqual({ scope: ['10-1', '11-2'], departureTime: '09:00', extra: {} })
		expect(item.isActive).toBe(true)
	})

	it('keeps unknown special schedule fields as extra', () => {
		const [item] = parseCalendarExceptions([
			{
				id: '2026-09-13',
				type: 'special_schedule',
				note: null,
				specialSchedule: {
					scope: ['10-1'],
					departureTime: '09:00',
					returnsToSchool: false,
					departureStopOverride: 'stop_x',
				},
			},
		])
		expect(item.specialSchedule?.scope).toEqual(['10-1'])
		expect(item.specialSchedule?.extra).toEqual({
			returnsToSchool: false,
			departureStopOverride: 'stop_x',
		})
	})

	it('drops malformed overrideEndTimes and specialSchedule', () => {
		const [item] = parseCalendarExceptions([
			{
				id: '2026-09-12',
				type: 'holiday',
				overrideEndTimes: { a: 42 },
				specialSchedule: { scope: 'not-array', departureTime: '09:00' },
			},
		])
		expect(item.overrideEndTimes).toBeNull()
		expect(item.specialSchedule).toBeNull()
	})

	it('skips entries without id or type', () => {
		expect(parseCalendarExceptions([{ type: 'holiday' }, null, 'x'])).toEqual([])
		expect(parseCalendarExceptions(42)).toEqual([])
	})
})
