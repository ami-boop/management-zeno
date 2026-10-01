import { parseStatistics } from '@/lib/api-contracts/statistics'

describe('parseStatistics', () => {
	it('returns null for garbage', () => {
		expect(parseStatistics(null)).toBeNull()
		expect(parseStatistics([])).toBeNull()
		expect(parseStatistics({})).toBeNull()
	})

	it('parses a full payload and drops malformed entries', () => {
		const raw = {
			start: '2026-09-15',
			end: '2026-09-15',
			range: 1,
			totals: { students: 2, going: 1, notGoing: 1, missing: 0, attendanceRate: 0.5, seatsOrdered: 55, trips: 1, cancelledTrips: 0, friendTrips: 1, friendPending: 1 },
			days: [
				{ date: '2026-09-15', going: 1, notGoing: 1, missing: 0, attendanceRate: 0.5, students: 40, seatsOrdered: 55, trips: 1, tripsDetail: [{ tripId: 't1', routeId: 'route_A', scheduledTime: '15:35', status: 'scheduled', students: 40, seats: 55, fillRate: 0.727 }] },
				{ nope: true },
			],
			routes: [{ routeId: 'route_A', students: 40, trips: 1 }, { nope: 1 }],
			stops: [{ stopId: 's1', boardings: 5 }],
			chronicNoShow: [{ uid: 'u2', firstName: 'C', lastName: 'D', notGoing: 2, missing: 1 }],
			tripHighlights: { fullest: [], emptiest: [] },
			friend: { total: 1, pending: 1, approved: 0, rejected: 0, pendingItems: [{ uid: 'u1', firstName: 'A', lastName: 'B', date: '2026-09-15', tripId: 't2' }] },
			delays: null,
		}
		const parsed = parseStatistics(raw)
		expect(parsed).not.toBeNull()
		expect(parsed!.days).toHaveLength(1)
		expect(parsed!.days[0].tripsDetail[0]).toMatchObject({ tripId: 't1', fillRate: 0.727 })
		expect(parsed!.routes).toHaveLength(1)
		expect(parsed!.chronicNoShow[0]).toMatchObject({ uid: 'u2', notGoing: 2 })
		expect(parsed!.friend.pendingItems).toHaveLength(1)
		expect(parsed!.delays).toBeNull()
	})

	it('defaults missing numbers to zero', () => {
		const parsed = parseStatistics({ start: '2026-09-15', end: '2026-09-15' })
		expect(parsed).not.toBeNull()
		expect(parsed!.totals.going).toBe(0)
		expect(parsed!.totals.attendanceRate).toBeNull()
		expect(parsed!.days).toEqual([])
	})

	it('parses delays block and drops malformed entries', () => {
		const parsed = parseStatistics({
			start: '2026-09-15',
			end: '2026-09-15',
			delays: {
				status: 'ready',
				factsCollected: 8,
				factsNeeded: 7,
				totals: { avgDelayMin: 2.6, onTimePct: 57.1, tripsWithFacts: 8 },
				routes: [
					{ routeId: 'route_A', tripsWithFacts: 8, avgDelayMin: 2.6, onTimePct: 57.1, lateDepartureAvgMin: 5, lateDeparturePct: 100 },
					{ nope: 1 },
				],
				trend: [{ date: '2026-09-15', avgDelayMin: 2.6, onTimePct: 57.1, tripCount: 8 }],
			},
		})
		expect(parsed!.delays).toMatchObject({ status: 'ready', factsCollected: 8, factsNeeded: 7 })
		expect(parsed!.delays!.routes).toHaveLength(1)
		expect(parsed!.delays!.trend).toHaveLength(1)
	})

	it('parses collecting delays and rejects bad status', () => {
		const parsed = parseStatistics({
			start: '2026-09-15',
			end: '2026-09-15',
			delays: { status: 'collecting', factsCollected: 3, factsNeeded: 7, totals: {}, routes: [], trend: [] },
		})
		expect(parsed!.delays).toMatchObject({ status: 'collecting', factsCollected: 3 })
		const bad = parseStatistics({ start: '2026-09-15', end: '2026-09-15', delays: { status: 'soon' } })
		expect(bad!.delays).toBeNull()
	})
})
