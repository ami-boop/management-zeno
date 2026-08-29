import {
	isNonNegativeNumber,
	isNullableString,
	isRecord,
	isString,
} from '@/utils/type-guards'

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

export interface ManagementStudentToday {
	submitted: boolean
	time: string | null
	status: string | null
	friendPending: boolean
}

export interface ManagementStudent {
	uid: string
	firstName: string
	lastName: string
	classId: string | null
	grade: string
	routeId: string | null
	stopId: string | null
	guardian: string
	phone: string
	departureTime: string | null
	today: ManagementStudentToday | null
}

function parseManagementStudent(value: unknown): ManagementStudent | null {
	if (!isRecord(value)) return null
	if (!isString(value.uid)) return null

	let today: ManagementStudentToday | null = null
	if (isRecord(value.today)) {
		today = {
			submitted: value.today.submitted === true,
			time: isNullableString(value.today.time) ? value.today.time : null,
			status: isNullableString(value.today.status) ? value.today.status : null,
			friendPending: value.today.friendPending === true,
		}
	}

	return {
		uid: value.uid,
		firstName: isString(value.firstName) ? value.firstName : '',
		lastName: isString(value.lastName) ? value.lastName : '',
		classId: isNullableString(value.classId) ? value.classId : null,
		grade: isString(value.grade) ? value.grade : '',
		routeId: isNullableString(value.routeId) ? value.routeId : null,
		stopId: isNullableString(value.stopId) ? value.stopId : null,
		guardian: isString(value.guardian) ? value.guardian : '',
		phone: isString(value.phone) ? value.phone : '',
		departureTime: isNullableString(value.departureTime) ? value.departureTime : null,
		today,
	}
}

export function parseManagementStudents(value: unknown): ManagementStudent[] {
	if (!Array.isArray(value)) return []
	const students: ManagementStudent[] = []
	for (const item of value) {
		const student = parseManagementStudent(item)
		if (student) students.push(student)
	}
	return students
}
