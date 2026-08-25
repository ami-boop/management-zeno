import type { Route } from '@/types/routes'
import Client from '@/components/routes/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { cacheTTL } from '@/constants'

export default async function RoutesPage() {

  let routes: Route[] = []

  const sessionCookie = await getSessionToken()

  try {
    routes = await fetch('https://api-ag7er5qhga-ew.a.run.app/v1/routes', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionCookie}`,
      },
      next: { revalidate: cacheTTL.routes } // 3 часа
    }).then(res => res.json())
  }
  catch {
    routes = []
    throw new Error('Failed to fetch data')
  }

  return <Client routes={routes} />
}
