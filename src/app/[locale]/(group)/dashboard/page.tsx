import Client from '@/components/dashboard/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { DashboardRoute } from '@/types/dashboard'

export default async function DashboardPage() {
  const sessionCookie = await getSessionToken()

  // Здесь можно заменить на загрузку данных с сервера
  const routes: DashboardRoute[] = await fetch(
    'https://getdashboardinfo-ag7er5qhga-ew.a.run.app',
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
