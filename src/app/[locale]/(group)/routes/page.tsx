import type { Route } from '@/types/routes'
import Client from '@/components/routes/Client'

export default async function RoutesPage() {

  const routes: Route[] = await (new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Route A', stops: 10, students: 25, status: 'active' },
        { id: 2, name: 'Route B', stops: 8, students: 20, status: 'inactive' },
        { id: 3, name: 'Route C', stops: 12, students: 30, status: 'active' },
        { id: 4, name: 'Route D', stops: 7, students: 18, status: 'active' },
        { id: 5, name: 'Route E', stops: 9, students: 22, status: 'inactive' },
      ])
    }, 1500)
  }))

  return <Client routes={routes} />
}
