import type { Route } from '@/types/routes'
import RoutesClient from '@/components/routes/RoutesClient'

const routes: Route[] = [
	{ id: 1, name: 'Route A', stops: 10, students: 25, status: 'active' },
	{ id: 2, name: 'Route B', stops: 8, students: 20, status: 'inactive' },
	{ id: 3, name: 'Route C', stops: 12, students: 30, status: 'active' },
	{ id: 4, name: 'Route D', stops: 7, students: 18, status: 'active' },
	{ id: 5, name: 'Route E', stops: 9, students: 22, status: 'inactive' },
]

export default function RoutesPage() {
	return <RoutesClient routes={routes} />
}
