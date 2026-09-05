import { notFound, redirect } from 'next/navigation'
import Client from '@/components/student-detail/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import { parseManagementStudentDetail, parseRouteNames, parseStops } from '@/lib/api-contracts'

export const dynamic = 'force-dynamic'

export default async function StudentDetailPage({ params }: { params: Promise<{ uid: string }> }) {
	const token = await getSessionToken()
	if (!token) redirect('/login')

	const { uid } = await params

	const [data, routeNames, stops] = await Promise.all([
		apiGet(`students/management/${uid}`, token).catch(() => null),
		apiGet('routes/names', token).catch(() => null),
		apiGet('stops', token).catch(() => null),
	])
	const detail = data ? parseManagementStudentDetail(data) : null
	if (!detail) notFound()

	const routeNameMap = Object.fromEntries(
		routeNames ? parseRouteNames(routeNames).map(route => [route.routeId, route.name]) : []
	)
	const stopNameMap = Object.fromEntries(
		stops ? parseStops(stops).map(stop => [stop.stopId, stop.name]) : []
	)

	return <Client detail={detail} routeNameMap={routeNameMap} stopNameMap={stopNameMap} />
}
