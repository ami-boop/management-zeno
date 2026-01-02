import Client from '@/components/dashboard/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { DashboardRoute } from '@/types/dashboard'
import { API_URL } from '@/constants'

export default async function DashboardPage() {
  const sessionCookie = await getSessionToken()

  // Здесь можно заменить на загрузку данных с сервера
  const routes: DashboardRoute[] = await fetch(
    `${API_URL}/dashboard`,
    {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `managementSessionCookie=${sessionCookie}`,
      },
    }
  ).then(res => res.json())

  console.log(routes)

  return <Client routes={routes} />
}
