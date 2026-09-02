import Client from '@/components/schedule/Client'
import { apiGet } from '@/lib/api/client'
import {
	parseManagementStudentsResponse,
	parseRouteNames,
} from '@/lib/api-contracts'
import { todayInIsrael } from '@/lib/schedule-times'
import { getSessionToken } from '@/utils/getSessionToken'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function SchedulePage() {
	const token = await getSessionToken()
	if (!token) redirect('/login')

	const [studentsData, routeNamesData] = await Promise.all([
		apiGet('students/management', token, { params: { limit: 1 } }),
		apiGet('routes/names', token),
	])

	const classFacets = parseManagementStudentsResponse(studentsData).meta?.facets.classes ?? []
	const classes = classFacets.map(facet => ({ id: facet.id, label: facet.label }))
	const routes = parseRouteNames(routeNamesData).map(route => ({
		id: route.routeId,
		name: route.name,
	}))
	const today = todayInIsrael()

	return <Client classes={classes} routes={routes} today={today} />
}
