import {
	isNullableString,
	isRecord,
	isString,
	parseISODateString,
} from '@/utils/type-guards'

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
	parentPhone?: string | null
	parentName?: string | null
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
		parentPhone: isNullableString(value.parentPhone) ? value.parentPhone : null,
		parentName: isNullableString(value.parentName) ? value.parentName : null,
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
