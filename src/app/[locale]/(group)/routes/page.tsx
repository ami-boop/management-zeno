import type { Route } from '@/types/routes'
import RoutesClient from '@/components/routes/RoutesClient'

const routes: Route[] = [
	{ id: 1, name: 'Route A', stops: 10, bus: 'Bus 1', status: 'active' },
	{ id: 2, name: 'Route B', stops: 8, bus: 'Bus 2', status: 'inactive' },
	{ id: 3, name: 'Route C', stops: 12, bus: 'Bus 3', status: 'active' },
	{ id: 4, name: 'Route D', stops: 7, bus: 'Bus 4', status: 'active' },
	{ id: 5, name: 'Route E', stops: 9, bus: 'Bus 5', status: 'inactive' },
]

export default function RoutesPage() {
	return <RoutesClient routes={routes} />
}
