export interface Route {
	id: number
	name: string
	stops: number
	students: number
	status: 'active' | 'inactive' | 'maintenance'
}

export type RouteStatus = 'active' | 'inactive' | 'maintenance'
