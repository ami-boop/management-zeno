export interface BusData {
	busNumber: string
	model: string
	capacity: number
	status: 'inService' | 'maintenance' | 'outOfService'
	location: string
	maintenanceDue: string
	mileage: string
	driver: string
}

export interface FleetStats {
	inService: number
	maintenance: number
	outOfService: number
	totalCapacity: number
	avgCapacity: number
}

export interface FilterOption {
	key: string
	label: string
	count: number
}

export type SortField = 'busNumber' | 'model' | 'capacity' | 'status'
export type SortOrder = 'asc' | 'desc'
