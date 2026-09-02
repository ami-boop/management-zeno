import { isNonNegativeNumber, isRecord, isString } from '@/utils/type-guards'

export interface RouteItem {
	routeId: string
	name: string
	stops: number
	students: number
}

export function parseRoutes(value: unknown): RouteItem[] {
	if (!Array.isArray(value)) return []
	const routes: RouteItem[] = []
	for (const item of value) {
		if (!isRecord(item)) continue
		const routeId = item.routeId
		const name = item.name
		if (!isString(routeId) || !isString(name)) continue
		routes.push({
			routeId,
			name,
			stops: isNonNegativeNumber(item.stops) ? item.stops : 0,
			students: isNonNegativeNumber(item.students) ? item.students : 0,
		})
	}
	return routes
}

export interface RouteName {
	routeId: string
	name: string
}

export function parseRouteNames(value: unknown): RouteName[] {
	if (!Array.isArray(value)) return []
	const names: RouteName[] = []
	for (const item of value) {
		if (!isRecord(item)) continue
		const routeId = item.routeId
		const name = item.name
		if (!isString(routeId) || !isString(name)) continue
		names.push({ routeId, name })
	}
	return names
}

export interface StopEntry {
	stopId: string
	order: number
	durationMin: number
}

export interface RouteStopsData {
	routeId: string
	name: string
	stopsMorning: StopEntry[]
	stopsAfternoon: StopEntry[]
	pathMorning: [number, number][] | null
	pathAfternoon: [number, number][] | null
}

function parseStopEntry(value: unknown): StopEntry | null {
	if (!isRecord(value)) return null
	const stopId = value.stopId
	const order = value.order
	const durationMin = value.durationMin
	if (!isString(stopId) || !isNonNegativeNumber(order) || !isNonNegativeNumber(durationMin)) {
		return null
	}
	return { stopId, order, durationMin }
}

function parseStopList(value: unknown): StopEntry[] {
	if (!Array.isArray(value)) return []
	const stops: StopEntry[] = []
	for (const item of value) {
		const stop = parseStopEntry(item)
		if (stop) stops.push(stop)
	}
	return stops
}

function parsePath(value: unknown): [number, number][] | null {
	if (!Array.isArray(value) || value.length < 2) return null
	const pairs: [number, number][] = []
	if (typeof value[0] === 'number') {
		if (value.length % 2 !== 0) return null
		for (let i = 0; i < value.length; i += 2) {
			const lng = value[i]
			const lat = value[i + 1]
			if (typeof lng !== 'number' || typeof lat !== 'number' || !Number.isFinite(lng) || !Number.isFinite(lat)) {
				return null
			}
			pairs.push([lng, lat])
		}
		return pairs
	}
	for (const point of value) {
		if (
			!Array.isArray(point) ||
			point.length !== 2 ||
			typeof point[0] !== 'number' ||
			typeof point[1] !== 'number' ||
			!Number.isFinite(point[0]) ||
			!Number.isFinite(point[1])
		) {
			return null
		}
		pairs.push([point[0], point[1]])
	}
	return pairs
}

export function parseRouteStops(value: unknown): RouteStopsData | null {
	if (!isRecord(value)) return null
	const routeId = value.routeId
	const name = value.name
	if (!isString(routeId) || !isString(name)) return null
	return {
		routeId,
		name,
		stopsMorning: parseStopList(value.stopsMorning),
		stopsAfternoon: parseStopList(value.stopsAfternoon),
		pathMorning: parsePath(value.pathMorning),
		pathAfternoon: parsePath(value.pathAfternoon),
	}
}

export interface StopDetail {
	stopId: string
	name: string
	address: string | null
	lat: number | null
	lng: number | null
	type: string | null
}

export function parseStops(value: unknown): StopDetail[] {
	if (!Array.isArray(value)) return []
	const stops: StopDetail[] = []
	for (const item of value) {
		if (!isRecord(item)) continue
		const stopId = item.stopId
		const name = item.name
		if (!isString(stopId) || !isString(name)) continue
		stops.push({
			stopId,
			name,
			address: isString(item.address) ? item.address : null,
			lat: typeof item.lat === 'number' ? item.lat : null,
			lng: typeof item.lng === 'number' ? item.lng : null,
			type: isString(item.type) ? item.type : null,
		})
	}
	return stops
}
