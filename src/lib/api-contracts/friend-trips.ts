import { isNonNegativeNumber, isNullableString, isRecord, isString } from '@/utils/type-guards'

export interface FriendTripRequest {
	uid: string
	studentName: string | null
	time: string | null
	fromRouteId: string | null
	fromRouteName: string | null
	fromStopId: string | null
	fromStopName: string | null
	toRouteId: string | null
	toRouteName: string | null
	toStopId: string | null
	toStopName: string | null
	friendUid: string | null
	friendName: string | null
	sleepover: boolean
	note: string | null
	parentStatus: string
}

export interface FriendTripsData {
	date: string
	requests: FriendTripRequest[]
}

export function parseFriendTrips(value: unknown): FriendTripsData | null {
	if (!isRecord(value) || !isString(value.date) || !Array.isArray(value.requests)) return null

	const requests: FriendTripRequest[] = []
	for (const item of value.requests) {
		if (!isRecord(item) || !isString(item.uid)) continue
		requests.push({
			uid: item.uid,
			studentName: isNullableString(item.studentName) ? item.studentName : null,
			time: isNullableString(item.time) ? item.time : null,
			fromRouteId: isNullableString(item.fromRouteId) ? item.fromRouteId : null,
			fromRouteName: isNullableString(item.fromRouteName) ? item.fromRouteName : null,
			fromStopId: isNullableString(item.fromStopId) ? item.fromStopId : null,
			fromStopName: isNullableString(item.fromStopName) ? item.fromStopName : null,
			toRouteId: isNullableString(item.toRouteId) ? item.toRouteId : null,
			toRouteName: isNullableString(item.toRouteName) ? item.toRouteName : null,
			toStopId: isNullableString(item.toStopId) ? item.toStopId : null,
			toStopName: isNullableString(item.toStopName) ? item.toStopName : null,
			friendUid: isNullableString(item.friendUid) ? item.friendUid : null,
			friendName: isNullableString(item.friendName) ? item.friendName : null,
			sleepover: item.sleepover === true,
			note: isNullableString(item.note) ? item.note : null,
			parentStatus: isString(item.parentStatus) ? item.parentStatus : 'pending',
		})
	}

	return { date: value.date, requests }
}

export interface StopUsageRoute {
	routeId: string
	name: string
	morning: { order: number; durationMin: number } | null
	afternoon: { order: number; durationMin: number } | null
}

export interface StopUsage {
	stopId: string
	name: string | null
	address: string | null
	lat: number | null
	lng: number | null
	routes: StopUsageRoute[]
}

function parseStopEntry(value: unknown): { order: number; durationMin: number } | null {
	if (!isRecord(value)) return null
	if (!isNonNegativeNumber(value.order) || !isNonNegativeNumber(value.durationMin)) return null
	return { order: value.order, durationMin: value.durationMin }
}

export function parseStopUsage(value: unknown): StopUsage | null {
	if (!isRecord(value) || !isString(value.stopId)) return null

	const routes: StopUsageRoute[] = []
	if (Array.isArray(value.routes)) {
		for (const item of value.routes) {
			if (!isRecord(item) || !isString(item.routeId)) continue
			routes.push({
				routeId: item.routeId,
				name: isString(item.name) ? item.name : item.routeId,
				morning: parseStopEntry(item.morning),
				afternoon: parseStopEntry(item.afternoon),
			})
		}
	}

	return {
		stopId: value.stopId,
		name: isNullableString(value.name) ? value.name : null,
		address: isNullableString(value.address) ? value.address : null,
		lat: typeof value.lat === 'number' && Number.isFinite(value.lat) ? value.lat : null,
		lng: typeof value.lng === 'number' && Number.isFinite(value.lng) ? value.lng : null,
		routes,
	}
}
