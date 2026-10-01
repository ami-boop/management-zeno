import { parseDashboardResponse } from '@/lib/api-contracts/dashboard'

function tripPayload(overrides: Record<string, unknown> = {}) {
	return {
		tripId: '2026-09-30_route_A_1535',
		routeId: 'route_A',
		scheduledTime: '15:35',
		scheduledAt: null,
		status: 'scheduled',
		busId: null,
		driverUid: null,
		metrics: { totalStudents: 10, busesNeeded: 1, minibusesNeeded: 0 },
		autoBusesNeeded: 1,
		autoMinibusesNeeded: 0,
		assignedBuses: null,
		assignedMinibuses: null,
		pendingFriendCount: 0,
		capacityAvailable: 55,
		...overrides,
	}
}

describe('parseDashboardResponse lateDepartureMinutes', () => {
	it('parses lateDepartureMinutes when present', () => {
		const parsed = parseDashboardResponse({ trips: [tripPayload({ lateDepartureMinutes: 7 })] })
		expect(parsed.trips).toHaveLength(1)
		expect(parsed.trips[0].lateDepartureMinutes).toBe(7)
	})

	it('falls back to null when absent or invalid', () => {
		const parsed = parseDashboardResponse({
			trips: [tripPayload(), tripPayload({ lateDepartureMinutes: -3 }), tripPayload({ lateDepartureMinutes: 'soon' })],
		})
		expect(parsed.trips.map(t => t.lateDepartureMinutes)).toEqual([null, null, null])
	})
})
