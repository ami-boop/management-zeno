import { notFound, redirect } from 'next/navigation'
import Client from '@/components/route-detail/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import { parseRouteStops, parseRoutes, parseStops, type RouteItem, type StopDetail } from '@/lib/api-contracts'

export const dynamic = 'force-dynamic'

export default async function RouteDetailPage({ params }: { params: Promise<{ routeId: string }> }) {
	const token = await getSessionToken()
	if (!token) redirect('/login')

	const { routeId } = await params

	const [stopsRes, allStopsRes, routesRes] = await Promise.all([
		apiGet('route-stops/management', token, { params: { routeId } }).catch(() => null),
		apiGet('stops', token).catch(() => null),
		apiGet('routes', token).catch(() => null),
	])

	const routeStops = stopsRes ? parseRouteStops(stopsRes) : null
	if (!routeStops) notFound()

	const stopDetails: StopDetail[] = allStopsRes ? parseStops(allStopsRes) : []
	const routes: RouteItem[] = routesRes ? parseRoutes(routesRes) : []
	const students = routes.find(route => route.routeId === routeId)?.students ?? null

	return (
		<Client
			route={routeStops}
			stops={stopDetails}
			students={students}
		/>
	)
}
