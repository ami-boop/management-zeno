import { isNullableNumber, isNonNegativeNumber, isRecord, isString } from '@/utils/type-guards'
import type { CalendarExceptionType } from './schedule'

export interface FleetBus {
	busId: string
	licensePlate: string
	capacity: number
	driverName: string | null
	driverPhone: string | null
	notes: string | null
	isActive: boolean
}

export function parseBuses(value: unknown): FleetBus[] {
	if (!Array.isArray(value)) return []
	const buses: FleetBus[] = []
	for (const item of value) {
		if (!isRecord(item)) continue
		const busId = item.busId
		const licensePlate = item.licensePlate
		if (!isString(busId) || !isString(licensePlate)) continue
		buses.push({
			busId,
			licensePlate,
			capacity: isNonNegativeNumber(item.capacity) ? item.capacity : 0,
			driverName: isString(item.driverName) ? item.driverName : null,
			driverPhone: isString(item.driverPhone) ? item.driverPhone : null,
			notes: isString(item.notes) ? item.notes : null,
			isActive: item.isActive !== false,
		})
	}
	return buses
}

export const CALENDAR_EXCEPTION_TYPES = [
	'holiday',
	'exam_day',
	'half_day',
	'no_transport',
	'special_schedule',
] as const

export interface BusFormValues {
	licensePlate: string
	capacity: number
	driverName: string | null
	driverPhone: string | null
	notes: string | null
}

export interface StopFormValues {
	name: string
	address: string | null
	lat: number | null
	lng: number | null
	notes: string | null
}

export interface ExceptionFormValues {
	type: CalendarExceptionType
	note: string | null
	overrideEndTimes: Record<string, string> | null
	specialSchedule: CalendarSpecialSchedule | null
}

export interface CalendarSpecialSchedule {
	scope: string[]
	departureTime: string
	extra?: Record<string, unknown>
}

export interface CalendarExceptionDetail {
	id: string
	type: CalendarExceptionType
	note: string | null
	overrideEndTimes: Record<string, string> | null
	specialSchedule: CalendarSpecialSchedule | null
	isActive: boolean
}

function parseSpecialSchedule(value: unknown): CalendarSpecialSchedule | null {
	if (!isRecord(value) || !Array.isArray(value.scope)) return null
	const scope = value.scope.filter(isString)
	const departureTime = value.departureTime
	if (scope.length === 0 || !isString(departureTime)) return null
	const extra: Record<string, unknown> = {}
	for (const [key, entry] of Object.entries(value)) {
		if (key !== 'scope' && key !== 'departureTime') extra[key] = entry
	}
	return { scope, departureTime, extra }
}

function parseOverrideEndTimes(value: unknown): Record<string, string> | null {
	if (!isRecord(value)) return null
	const result: Record<string, string> = {}
	for (const [key, entry] of Object.entries(value)) {
		if (isString(entry)) result[key] = entry
	}
	return Object.keys(result).length > 0 ? result : null
}

export function parseCalendarExceptions(value: unknown): CalendarExceptionDetail[] {
	if (!Array.isArray(value)) return []
	const exceptions: CalendarExceptionDetail[] = []
	for (const item of value) {
		if (!isRecord(item)) continue
		const id = item.id
		const type = item.type
		if (!isString(id) || !isString(type)) continue
		if (!(CALENDAR_EXCEPTION_TYPES as readonly string[]).includes(type)) continue
		exceptions.push({
			id,
			type: type as CalendarExceptionType,
			note: isString(item.note) ? item.note : null,
			overrideEndTimes: parseOverrideEndTimes(item.overrideEndTimes),
			specialSchedule: parseSpecialSchedule(item.specialSchedule),
			isActive: item.isActive !== false,
		})
	}
	return exceptions
}

export interface BusLivePosition {
	lat: number
	lng: number
	heading: number | null
	speedKmh: number | null
	updatedAtMs: number | null
}

export interface BusLiveStop {
	stopId: string
	name: string
	order: number
	lat: number | null
	lng: number | null
}

export interface BusLiveTrip {
	tripId: string
	routeId: string
	routeName: string | null
	scheduledTime: string
	scheduledAtISO: string
	status: string
	busId: string
	stops: BusLiveStop[]
	path: Array<[number, number]> | null
	etas: Record<string, number> | null
	live: BusLivePosition | null
	isOnRouteNow: boolean
}

export interface BusLiveSummary {
	serverTimeISO: string
	trips: BusLiveTrip[]
	/** busId → сегодняшний рейс этого автобуса (первый по времени выезда) */
	byBus: Map<string, BusLiveTrip>
}

function parseBusLivePosition(value: unknown): BusLivePosition | null {
	if (!isRecord(value)) return null
	const lat = value.lat
	const lng = value.lng
	if (typeof lat !== 'number' || !Number.isFinite(lat)) return null
	if (typeof lng !== 'number' || !Number.isFinite(lng)) return null
	return {
		lat,
		lng,
		heading:
			typeof value.heading === 'number' && Number.isFinite(value.heading) ? value.heading : null,
		speedKmh:
			typeof value.speedKmh === 'number' && Number.isFinite(value.speedKmh)
				? value.speedKmh
				: null,
		updatedAtMs:
			typeof value.updatedAtMs === 'number' && Number.isFinite(value.updatedAtMs)
				? value.updatedAtMs
				: null,
	}
}

function parseBusLiveStops(value: unknown): BusLiveStop[] {
	if (!Array.isArray(value)) return []
	const stops: BusLiveStop[] = []
	for (const item of value) {
		if (!isRecord(item)) continue
		const stopId = item.stopId
		if (!isString(stopId)) continue
		stops.push({
			stopId,
			name: isString(item.name) ? item.name : stopId,
			order: isNonNegativeNumber(item.order) ? item.order : 0,
			lat: isNullableNumber(item.lat) ? item.lat : null,
			lng: isNullableNumber(item.lng) ? item.lng : null,
		})
	}
	return stops
}

function parseBusLivePath(value: unknown): Array<[number, number]> | null {
	if (!Array.isArray(value) || value.length < 2) return null
	const pairs: Array<[number, number]> = []
	if (typeof value[0] === 'number') {
		// Flat encoding: [lng, lat, lng, lat, ...]
		if (value.length < 4 || value.length % 2 !== 0) return null
		for (let i = 0; i < value.length; i += 2) {
			const lng = value[i]
			const lat = value[i + 1]
			if (typeof lng !== 'number' || !Number.isFinite(lng)) return null
			if (typeof lat !== 'number' || !Number.isFinite(lat)) return null
			pairs.push([lng, lat])
		}
		return pairs
	}
	for (const pair of value) {
		if (!Array.isArray(pair) || pair.length !== 2) return null
		const lng = pair[0]
		const lat = pair[1]
		if (typeof lng !== 'number' || !Number.isFinite(lng)) return null
		if (typeof lat !== 'number' || !Number.isFinite(lat)) return null
		pairs.push([lng, lat])
	}
	return pairs
}

function parseBusLiveEtas(value: unknown): Record<string, number> | null {
	if (!isRecord(value)) return null
	const etas: Record<string, number> = {}
	for (const [stopId, minutes] of Object.entries(value)) {
		if (isNonNegativeNumber(minutes)) etas[stopId] = minutes
	}
	return Object.keys(etas).length > 0 ? etas : null
}

function parseBusLiveTrip(value: unknown): BusLiveTrip | null {
	if (!isRecord(value)) return null
	const tripId = value.tripId
	const routeId = value.routeId
	const busId = value.busId
	if (!isString(tripId) || !isString(routeId) || !isString(busId)) return null
	return {
		tripId,
		routeId,
		routeName: isString(value.routeName) ? value.routeName : null,
		scheduledTime: isString(value.scheduledTime) ? value.scheduledTime : '',
		scheduledAtISO: isString(value.scheduledAtISO) ? value.scheduledAtISO : '',
		status: isString(value.status) ? value.status : 'scheduled',
		busId,
		stops: parseBusLiveStops(value.stops),
		path: parseBusLivePath(value.path),
		etas: parseBusLiveEtas(value.etas),
		live: parseBusLivePosition(value.live),
		isOnRouteNow: value.isOnRouteNow === true,
	}
}

export function parseBusLive(value: unknown): BusLiveSummary | null {
	if (!isRecord(value) || !Array.isArray(value.trips)) return null
	const trips: BusLiveTrip[] = []
	for (const item of value.trips) {
		const trip = parseBusLiveTrip(item)
		if (trip) trips.push(trip)
	}
	const byBus = new Map<string, BusLiveTrip>()
	for (const trip of trips) {
		const current = byBus.get(trip.busId)
		if (!current) {
			byBus.set(trip.busId, trip)
			continue
		}
		// Prefer the trip the bus is actually on right now.
		if (!current.isOnRouteNow && trip.isOnRouteNow) byBus.set(trip.busId, trip)
	}
	return {
		serverTimeISO: isString(value.serverTimeISO) ? value.serverTimeISO : new Date().toISOString(),
		trips,
		byBus,
	}
}
