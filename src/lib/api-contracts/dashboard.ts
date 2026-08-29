import {
	isNonNegativeNumber,
	isNullableNumber,
	isNullableString,
	isRecord,
	isString,
	parseISODateString,
} from '@/utils/type-guards'

export type TripStatus = 'scheduled' | 'boarding' | 'in_transit' | 'completed' | 'cancelled'

export interface TripMetrics {
	totalStudents: number
	busesNeeded: number
	minibusesNeeded: number
}

export interface DashboardTrip {
	tripId: string
	routeId: string
	scheduledTime: string
	scheduledAt: string | null
	status: TripStatus
	busId: string | null
	driverUid: string | null
	metrics: TripMetrics | null
	autoBusesNeeded: number
	autoMinibusesNeeded: number
	assignedBuses: number | null
	assignedMinibuses: number | null
	pendingFriendCount: number
	capacityAvailable: number
}

export interface DashboardResponse {
	trips: DashboardTrip[]
	totals: {
		totalStudents: number
		totalBusesNeeded: number
		totalMinibusesNeeded: number
		tripCount: number
	} | null
	capacities: {
		bus: number
		minibus: number
	} | null
}

function parseTripMetrics(value: unknown): TripMetrics | null {
	if (!isRecord(value)) return null
	const totalStudents = value.totalStudents
	const busesNeeded = value.busesNeeded
	const minibusesNeeded = value.minibusesNeeded
	if (!isNonNegativeNumber(totalStudents) || !isNonNegativeNumber(busesNeeded) || !isNonNegativeNumber(minibusesNeeded)) {
		return null
	}
	return { totalStudents, busesNeeded, minibusesNeeded }
}

function parseDashboardTrip(value: unknown): DashboardTrip | null {
	if (!isRecord(value)) return null
	const tripId = value.tripId
	const routeId = value.routeId
	const scheduledTime = value.scheduledTime
	const status = value.status
	if (!isString(tripId) || !isString(routeId) || !isString(scheduledTime) || !isString(status)) {
		return null
	}
	return {
		tripId,
		routeId,
		scheduledTime,
		scheduledAt: parseISODateString(value.scheduledAt) ?? (isNullableString(value.scheduledAt) ? null : null),
		status: status as TripStatus,
		busId: isNullableString(value.busId) ? value.busId : null,
		driverUid: isNullableString(value.driverUid) ? value.driverUid : null,
		metrics: parseTripMetrics(value.metrics),
		autoBusesNeeded: isNonNegativeNumber(value.autoBusesNeeded) ? value.autoBusesNeeded : 0,
		autoMinibusesNeeded: isNonNegativeNumber(value.autoMinibusesNeeded) ? value.autoMinibusesNeeded : 0,
		assignedBuses: isNullableNumber(value.assignedBuses) ? value.assignedBuses : null,
		assignedMinibuses: isNullableNumber(value.assignedMinibuses) ? value.assignedMinibuses : null,
		pendingFriendCount: isNonNegativeNumber(value.pendingFriendCount) ? value.pendingFriendCount : 0,
		capacityAvailable: isNonNegativeNumber(value.capacityAvailable) ? value.capacityAvailable : 0,
	}
}

export function parseDashboardResponse(value: unknown): DashboardResponse {
	const trips: DashboardTrip[] = []
	if (isRecord(value) && Array.isArray(value.trips)) {
		for (const item of value.trips) {
			const trip = parseDashboardTrip(item)
			if (trip) trips.push(trip)
		}
	}

	let totals: DashboardResponse['totals'] = null
	if (isRecord(value) && isRecord(value.totals)) {
		const totalsObj = value.totals
		totals = {
			totalStudents: isNonNegativeNumber(totalsObj.totalStudents) ? totalsObj.totalStudents : 0,
			totalBusesNeeded: isNonNegativeNumber(totalsObj.totalBusesNeeded)
				? totalsObj.totalBusesNeeded
				: 0,
			totalMinibusesNeeded: isNonNegativeNumber(totalsObj.totalMinibusesNeeded)
				? totalsObj.totalMinibusesNeeded
				: 0,
			tripCount: trips.length,
		}
	}

	let capacities: DashboardResponse['capacities'] = null
	if (isRecord(value) && isRecord(value.capacities)) {
		const capObj = value.capacities
		capacities = {
			bus: isNonNegativeNumber(capObj.bus) ? capObj.bus : 0,
			minibus: isNonNegativeNumber(capObj.minibus) ? capObj.minibus : 0,
		}
	}

	return { trips, totals, capacities }
}
