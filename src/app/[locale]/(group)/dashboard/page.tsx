import Client from '@/components/dashboard/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import {
  parseDashboardResponse,
  parseRouteNames,
  type DashboardResponse,
} from '@/lib/api-contracts'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const token = await getSessionToken()
  if (!token) redirect('/login')

  const [data, routeNames] = await Promise.all([
    apiGet('dashboard', token),
    apiGet('routes/names', token),
  ])

  const dashboard: DashboardResponse = parseDashboardResponse(data)
  const routeNameMap = Object.fromEntries(
    parseRouteNames(routeNames).map((route) => [route.routeId, route.name])
  )

  return <Client data={dashboard} routeNameMap={routeNameMap} />
}
