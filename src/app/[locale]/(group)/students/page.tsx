import Client from '@/components/students/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import {
	parseManagementStudentsResponse,
	parseRouteNames,
	type ManagementStudentsResponse,
} from '@/lib/api-contracts'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function StudentsPage() {
	const token = await getSessionToken()
	if (!token) redirect('/login')

	let initial: ManagementStudentsResponse = { students: [], meta: null, error: true }
	let routeNameMap: Record<string, string> = {}

	try {
		const [data, routeNames] = await Promise.all([
			apiGet('students/management', token, { params: { limit: 25, offset: 0 } }),
			apiGet('routes/names', token),
		])
		initial = parseManagementStudentsResponse(data)
		routeNameMap = Object.fromEntries(
			parseRouteNames(routeNames).map((route) => [route.routeId, route.name])
		)
	} catch {
		initial = { students: [], meta: null, error: true }
	}

	return <Client initial={initial} routeNameMap={routeNameMap} />
}
