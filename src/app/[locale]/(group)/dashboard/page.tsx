import DashboardClient from '@/components/dashboard/DashboardClient'
import { getSessionToken } from '@/utils/getSessionToken'

interface DashboardRoute {
  id: string
  name: string
  studentsOnBus: number
  studentsNotMarked: number
  totalStudents: number
  busesNeeded: number
  busesOrdered: number
  status: 'pending' | 'partial' | 'completed'
  lastUpdate: Record<string, number>
  estimatedTime: string
}

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

  return <DashboardClient routes={routes} />
}
