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

export interface ScheduleDoc {
	type: 'base_class' | 'megama'
	endTimes: Record<string, string>
}

export function parseScheduleDoc(value: unknown): ScheduleDoc | null {
	if (!isRecord(value)) return null
	const type = value.type
	if (type !== 'base_class' && type !== 'megama') return null
	const endTimes: Record<string, string> = {}
	if (isRecord(value.endTimes)) {
		for (const [key, val] of Object.entries(value.endTimes)) {
			if (isString(val)) endTimes[key] = val
		}
	}
	return { type, endTimes }
}

export function parseLessonsSchedule(value: unknown): ScheduleDoc | null {
	if (!isRecord(value)) return null
	return parseScheduleDoc(value.schedule)
}

export interface StudentListItem {
	id: number
	studentUid: string
	name: string
	grade: string
	route: string
	stop: string
	guardian: string
	phone: string
}

export function parseStudents(value: unknown): StudentListItem[] {
	if (!Array.isArray(value)) return []
	const students: StudentListItem[] = []
	for (const item of value) {
		if (!isRecord(item)) continue
		const studentUid = item.studentUid
		const name = item.name
		const id = item.id
		if (!isString(studentUid) || !isString(name)) continue
		students.push({
			id: isNonNegativeNumber(id) ? id : 0,
			studentUid,
			name,
			grade: isNullableString(item.grade) ? item.grade ?? '' : '',
			route: isNullableString(item.route) ? item.route ?? '' : '',
			stop: isNullableString(item.stop) ? item.stop ?? '' : '',
			guardian: isNullableString(item.guardian) ? item.guardian ?? '' : '',
			phone: isNullableString(item.phone) ? item.phone ?? '' : '',
		})
	}
	return students
}

export interface TripStudentFriendRoute {
	toRouteId: string
	toStopId: string | null
	friendUid: string | null
	sleepover: boolean
	note: string | null
	parentStatus: string
}

export interface TripStudent {
	uid: string
	firstName: string
	lastName: string
	status: string
	stopId: string
	time: string | null
	friendPending: boolean
	friendRoute: TripStudentFriendRoute | null
}

function parseTripStudent(value: unknown): TripStudent | null {
	if (!isRecord(value)) return null
	const uid = value.uid
	if (!isString(uid)) return null

	let friendRoute: TripStudentFriendRoute | null = null
	if (isRecord(value.friendRoute)) {
		const fr = value.friendRoute
		const toRouteId = fr.toRouteId
		if (isString(toRouteId) && isString(fr.parentStatus)) {
			friendRoute = {
				toRouteId,
				toStopId: isNullableString(fr.toStopId) ? fr.toStopId : null,
				friendUid: isNullableString(fr.friendUid) ? fr.friendUid : null,
				sleepover: fr.sleepover === true,
				note: isNullableString(fr.note) ? fr.note : null,
				parentStatus: fr.parentStatus,
			}
		}
	}

	return {
		uid,
		firstName: isString(value.firstName) ? value.firstName : '',
		lastName: isString(value.lastName) ? value.lastName : '',
		status: isString(value.status) ? value.status : '',
		stopId: isString(value.stopId) ? value.stopId : '',
		time: parseISODateString(value.time),
		friendPending: friendRoute?.parentStatus === 'pending',
		friendRoute,
	}
}

export function parseTripStudents(value: unknown): TripStudent[] {
	if (!Array.isArray(value)) return []
	const students: TripStudent[] = []
	for (const item of value) {
		const student = parseTripStudent(item)
		if (student) students.push(student)
	}
	return students
}

export interface NotificationMetadata {
	tripId: string | null
	routeId: string | null
}

export interface NotificationData {
	id: string
	type: string
	message: string
	createdAt: string | null
	isRead: boolean
	metadata: NotificationMetadata
}

export function parseNotifications(value: unknown): NotificationData[] {
	if (!Array.isArray(value)) return []
	const notifications: NotificationData[] = []
	for (const item of value) {
		if (!isRecord(item)) continue
		const id = item.id
		const message = item.message
		if (!isString(id) || !isString(message)) continue
		const metadata = isRecord(item.metadata) ? item.metadata : {}
		notifications.push({
			id,
			type: isString(item.type) ? item.type : 'info',
			message,
			createdAt: parseISODateString(item.createdAt),
			isRead: item.isRead === true,
			metadata: {
				tripId: isNullableString(metadata.tripId) ? metadata.tripId : null,
				routeId: isNullableString(metadata.routeId) ? metadata.routeId : null,
			},
		})
	}
	return notifications
}
