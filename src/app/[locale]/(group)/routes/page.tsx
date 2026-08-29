import { redirect } from 'next/navigation'
import Client from '@/components/routes/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import { parseRoutes } from '@/lib/api-contracts'

export default async function RoutesPage() {
  const token = await getSessionToken()
  if (!token) {
    redirect('/login')
  }

  const [routes] = await Promise.all([apiGet('routes', token)])
  const parsed = parseRoutes(routes)

  return <Client routes={parsed} />
}
