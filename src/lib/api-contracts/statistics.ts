import { isNonNegativeNumber, isRecord, isString } from '@/utils/type-guards'

export interface TripStat {
	tripId: string
	routeId: string
	scheduledTime: string
	status: string
	students: number
	seats: number
	fillRate: number | null
}

export interface StatsDay {
	date: string
	going: number
	notGoing: number
	missing: number
	attendanceRate: number | null
	students: number
	seatsOrdered: number
	trips: number
	tripsDetail: TripStat[]
}

export interface StatsTotals {
	students: number
	going: number
	notGoing: number
	missing: number
	attendanceRate: number | null
	seatsOrdered: number
	trips: number
	cancelledTrips: number
	friendTrips: number
	friendPending: number
}

export interface RouteStat {
	routeId: string
	students: number
	trips: number
}

export interface StopStat {
	stopId: string
	boardings: number
}

export interface ChronicEntry {
	uid: string
	firstName: string
	lastName: string
	notGoing: number
	missing: number
}

export interface FriendPendingItem {
	uid: string
	firstName: string
	lastName: string
	date: string
	tripId: string
}

export interface StatisticsData {
	start: string
	end: string
	range: number
	totals: StatsTotals
	days: StatsDay[]
	routes: RouteStat[]
	stops: StopStat[]
	chronicNoShow: ChronicEntry[]
	tripHighlights: { fullest: TripStat[]; emptiest: TripStat[] }
	friend: { total: number; pending: number; approved: number; rejected: number; pendingItems: FriendPendingItem[] }
	delays: DelaysBlock | null
}

export interface DelayRouteStat {
	routeId: string
	tripsWithFacts: number
	avgDelayMin: number | null
	onTimePct: number | null
	lateDepartureAvgMin: number | null
	lateDeparturePct: number | null
}

export interface DelayTrendDay {
	date: string
	avgDelayMin: number | null
	onTimePct: number | null
	tripCount: number
}

export interface DelaysBlock {
	status: 'ready' | 'collecting'
	factsCollected: number
	factsNeeded: number
	totals: { avgDelayMin: number | null; onTimePct: number | null; tripsWithFacts: number }
	routes: DelayRouteStat[]
	trend: DelayTrendDay[]
}

function num(value: unknown): number {
	return isNonNegativeNumber(value) ? value : 0
}

function parseDelayRoute(value: unknown): DelayRouteStat | null {
	if (!isRecord(value)) return null
	if (!isString(value.routeId)) return null
	return {
		routeId: value.routeId,
		tripsWithFacts: num(value.tripsWithFacts),
		avgDelayMin: nullableRate(value.avgDelayMin),
		onTimePct: nullableRate(value.onTimePct),
		lateDepartureAvgMin: nullableRate(value.lateDepartureAvgMin),
		lateDeparturePct: nullableRate(value.lateDeparturePct),
	}
}

function parseDelayTrendDay(value: unknown): DelayTrendDay | null {
	if (!isRecord(value)) return null
	if (!isString(value.date)) return null
	return {
		date: value.date,
		avgDelayMin: nullableRate(value.avgDelayMin),
		onTimePct: nullableRate(value.onTimePct),
		tripCount: num(value.tripCount),
	}
}

function parseDelays(value: unknown): DelaysBlock | null {
	if (!isRecord(value)) return null
	const status = value.status === 'ready' ? 'ready' : value.status === 'collecting' ? 'collecting' : null
	if (!status) return null
	const totals = isRecord(value.totals) ? value.totals : {}
	const routes: DelayRouteStat[] = Array.isArray(value.routes)
		? value.routes.map(parseDelayRoute).filter((r): r is DelayRouteStat => r !== null)
		: []
	const trend: DelayTrendDay[] = Array.isArray(value.trend)
		? value.trend.map(parseDelayTrendDay).filter((d): d is DelayTrendDay => d !== null)
		: []
	return {
		status,
		factsCollected: num(value.factsCollected),
		factsNeeded: num(value.factsNeeded),
		totals: {
			avgDelayMin: nullableRate(totals.avgDelayMin),
			onTimePct: nullableRate(totals.onTimePct),
			tripsWithFacts: num(totals.tripsWithFacts),
		},
		routes,
		trend,
	}
}

function nullableRate(value: unknown): number | null {
	return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function parseTrip(value: unknown): TripStat | null {
	if (!isRecord(value)) return null
	if (!isString(value.tripId) || !isString(value.routeId)) return null
	return {
		tripId: value.tripId,
		routeId: value.routeId,
		scheduledTime: isString(value.scheduledTime) ? value.scheduledTime : '',
		status: isString(value.status) ? value.status : 'scheduled',
		students: num(value.students),
		seats: num(value.seats),
		fillRate: nullableRate(value.fillRate),
	}
}

function parseTrips(value: unknown): TripStat[] {
	if (!Array.isArray(value)) return []
	const out: TripStat[] = []
	for (const item of value) {
		const parsed = parseTrip(item)
		if (parsed) out.push(parsed)
	}
	return out
}

export function parseStatistics(value: unknown): StatisticsData | null {
	if (!isRecord(value)) return null
	if (!isString(value.start) || !isString(value.end)) return null
	const totals = isRecord(value.totals) ? value.totals : {}
	const friend = isRecord(value.friend) ? value.friend : {}

	const days: StatsDay[] = []
	if (Array.isArray(value.days)) {
		for (const item of value.days) {
			if (!isRecord(item) || !isString(item.date)) continue
			days.push({
				date: item.date,
				going: num(item.going),
				notGoing: num(item.notGoing),
				missing: num(item.missing),
				attendanceRate: nullableRate(item.attendanceRate),
				students: num(item.students),
				seatsOrdered: num(item.seatsOrdered),
				trips: num(item.trips),
				tripsDetail: parseTrips(item.tripsDetail),
			})
		}
	}

	const routes: RouteStat[] = []
	if (Array.isArray(value.routes)) {
		for (const item of value.routes) {
			if (!isRecord(item) || !isString(item.routeId)) continue
			routes.push({ routeId: item.routeId, students: num(item.students), trips: num(item.trips) })
		}
	}

	const stops: StopStat[] = []
	if (Array.isArray(value.stops)) {
		for (const item of value.stops) {
			if (!isRecord(item) || !isString(item.stopId)) continue
			stops.push({ stopId: item.stopId, boardings: num(item.boardings) })
		}
	}

	const chronicNoShow: ChronicEntry[] = []
	if (Array.isArray(value.chronicNoShow)) {
		for (const item of value.chronicNoShow) {
			if (!isRecord(item) || !isString(item.uid)) continue
			chronicNoShow.push({
				uid: item.uid,
				firstName: isString(item.firstName) ? item.firstName : '',
				lastName: isString(item.lastName) ? item.lastName : '',
				notGoing: num(item.notGoing),
				missing: num(item.missing),
			})
		}
	}

	const highlights = isRecord(value.tripHighlights) ? value.tripHighlights : {}
	const pendingItems: FriendPendingItem[] = []
	if (Array.isArray(friend.pendingItems)) {
		for (const item of friend.pendingItems) {
			if (!isRecord(item) || !isString(item.uid)) continue
			pendingItems.push({
				uid: item.uid,
				firstName: isString(item.firstName) ? item.firstName : '',
				lastName: isString(item.lastName) ? item.lastName : '',
				date: isString(item.date) ? item.date : '',
				tripId: isString(item.tripId) ? item.tripId : '',
			})
		}
	}

	return {
		start: value.start,
		end: value.end,
		range: num(value.range),
		totals: {
			students: num(totals.students),
			going: num(totals.going),
			notGoing: num(totals.notGoing),
			missing: num(totals.missing),
			attendanceRate: nullableRate(totals.attendanceRate),
			seatsOrdered: num(totals.seatsOrdered),
			trips: num(totals.trips),
			cancelledTrips: num(totals.cancelledTrips),
			friendTrips: num(totals.friendTrips),
			friendPending: num(totals.friendPending),
		},
		days,
		routes,
		stops,
		chronicNoShow,
		tripHighlights: {
			fullest: parseTrips(highlights.fullest),
			emptiest: parseTrips(highlights.emptiest),
		},
		friend: {
			total: num(friend.total),
			pending: num(friend.pending),
			approved: num(friend.approved),
			rejected: num(friend.rejected),
			pendingItems,
		},
		delays: parseDelays(value.delays),
	}
}
