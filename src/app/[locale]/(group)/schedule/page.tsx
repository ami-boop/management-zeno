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

	const facets = parseManagementStudentsResponse(studentsData).meta
	const classGroups = {
		classes: (facets?.facets.classes ?? [])
			.filter(facet => facet.id !== 'none')
			.map(facet => ({ id: facet.id, label: facet.label })),
		megamasByParallel: facets?.megamasByParallel ?? [],
	}
	const routes = parseRouteNames(routeNamesData).map(route => ({
		id: route.routeId,
		name: route.name,
	}))
	const today = todayInIsrael()

	return <Client classGroups={classGroups} routes={routes} today={today} />
}
