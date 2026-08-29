import Client from '@/components/students/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import {
	parseManagementStudents,
	parseRouteNames,
} from '@/lib/api-contracts'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function StudentsPage() {
	const token = await getSessionToken()
	if (!token) redirect('/login')

	const [data, routeNames] = await Promise.all([
		apiGet('students/management', token),
		apiGet('routes/names', token),
	])

	const students = parseManagementStudents(data)
	const routeNameMap = Object.fromEntries(
		parseRouteNames(routeNames).map((route) => [route.routeId, route.name])
	)

	return <Client students={students} routeNameMap={routeNameMap} />
}
