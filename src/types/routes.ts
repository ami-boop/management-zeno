export interface Route {
	id: number
	name: string
	stops: number
	bus: string
	status: 'active' | 'inactive' | 'maintenance'
}

export type RouteStatus = 'active' | 'inactive' | 'maintenance'
