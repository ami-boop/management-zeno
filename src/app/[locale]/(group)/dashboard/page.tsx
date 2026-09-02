import Client from '@/components/dashboard/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import {
  parseDashboardResponse,
  parseManagementStudentsResponse,
  parseRouteNames,
  type DashboardResponse,
} from '@/lib/api-contracts'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const token = await getSessionToken()
  if (!token) redirect('/login')

  const [data, routeNames, studentsMeta] = await Promise.all([
    apiGet('dashboard', token),
    apiGet('routes/names', token),
    apiGet('students/management', token, { params: { limit: 1 } }).catch(() => null),
  ])

  const dashboard: DashboardResponse = parseDashboardResponse(data)
  const routeNameMap = Object.fromEntries(
    parseRouteNames(routeNames).map((route) => [route.routeId, route.name])
  )
  const globalNotMarked = parseManagementStudentsResponse(studentsMeta).meta?.counts.notMarked

  return <Client data={dashboard} routeNameMap={routeNameMap} globalNotMarked={globalNotMarked} />
}
