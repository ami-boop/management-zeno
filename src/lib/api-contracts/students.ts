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

export interface ManagementFacetEntry {
	id: string
	label: string
	count: number
}

export interface ManagementStudentsMeta {
	total: number
	filtered: number
	counts: {
		submitted: number
		notMarked: number
		friendPending: number
	}
	facets: {
		routes: ManagementFacetEntry[]
		parallels: ManagementFacetEntry[]
		classes: ManagementFacetEntry[]
		stops: ManagementFacetEntry[]
		times: ManagementFacetEntry[]
	}
}

export interface ManagementStudentsResponse {
	students: ManagementStudent[]
	meta: ManagementStudentsMeta | null
	error?: boolean
}

export function parseManagementStudentsMeta(value: unknown): ManagementStudentsMeta | null {
	if (!isRecord(value)) return null
	if (!isNonNegativeNumber(value.total) || !isNonNegativeNumber(value.filtered)) return null
	if (!isRecord(value.counts) || !isRecord(value.facets)) return null

	const parseFacet = (v: unknown): ManagementFacetEntry[] => {
		if (!Array.isArray(v)) return []
		const entries: ManagementFacetEntry[] = []
		for (const item of v) {
			if (!isRecord(item)) continue
			if (!isString(item.id)) continue
			entries.push({
				id: item.id,
				label: isString(item.label) ? item.label : item.id,
				count: isNonNegativeNumber(item.count) ? item.count : 0,
			})
		}
		return entries
	}

	const counts = value.counts
	const facets = value.facets
	return {
		total: value.total,
		filtered: value.filtered,
		counts: {
			submitted: isNonNegativeNumber(counts.submitted) ? counts.submitted : 0,
			notMarked: isNonNegativeNumber(counts.notMarked) ? counts.notMarked : 0,
			friendPending: isNonNegativeNumber(counts.friendPending) ? counts.friendPending : 0,
		},
		facets: {
			routes: parseFacet(facets.routes),
			parallels: parseFacet(facets.parallels),
			classes: parseFacet(facets.classes),
			stops: parseFacet(facets.stops),
			times: parseFacet(facets.times),
		},
	}
}

export function parseManagementStudentsResponse(value: unknown): ManagementStudentsResponse {
	if (Array.isArray(value)) {
		return { students: parseManagementStudents(value), meta: null }
	}
	if (!isRecord(value)) {
		return { students: [], meta: null }
	}
	return {
		students: parseManagementStudents(value.students),
		meta: parseManagementStudentsMeta(value.meta),
	}
}
