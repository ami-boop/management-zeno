'use server'

import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import {
	parseManagementStudentsResponse,
	type ManagementStudentsResponse,
} from '@/lib/api-contracts'

export interface StudentsQuery {
	routeId?: string
	parallel?: string
	classId?: string
	stopId?: string
	status?: string
	search?: string
	limit?: number
	offset?: number
}

export default async function getManagementStudents(
	query: StudentsQuery = {}
): Promise<ManagementStudentsResponse> {
	const token = await getSessionToken()
	if (!token) return { students: [], meta: null, error: true }

	try {
		const data = await apiGet('students/management', token, {
			params: {
				routeId: query.routeId && query.routeId !== 'all' ? query.routeId : undefined,
				parallel: query.parallel && query.parallel !== 'all' ? query.parallel : undefined,
				classId: query.classId && query.classId !== 'all' ? query.classId : undefined,
				stopId: query.stopId && query.stopId !== 'all' ? query.stopId : undefined,
				status: query.status && query.status !== 'all' ? query.status : undefined,
				search: query.search || undefined,
				limit: query.limit,
				offset: query.offset,
			},
		})
		return parseManagementStudentsResponse(data)
	} catch {
		return { students: [], meta: null, error: true }
	}
}
