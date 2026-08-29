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
	}
}
