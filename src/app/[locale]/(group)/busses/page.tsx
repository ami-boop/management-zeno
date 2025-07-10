import FleetClient from '@/components/fleet/FleetClient'
import type { BusData } from '@/types/fleet'

// Моковые данные - в реальном приложении будут загружаться с сервера
const busData: BusData[] = [
	{
		busNumber: 'BUS-101',
		model: 'Blue Bird Vision',
		capacity: 40,
		status: 'inService',
		location: '123 Main St, Downtown',
		maintenanceDue: '2024-08-15',
		mileage: '45,230',
		driver: 'John Smith',
	},
	{
		busNumber: 'BUS-102',
		model: 'Thomas HDX',
		capacity: 35,
		status: 'maintenance',
		location: 'Central Garage',
		maintenanceDue: '2024-07-20',
		mileage: '52,100',
		driver: 'N/A',
	},
	{
		busNumber: 'BUS-103',
		model: 'Blue Bird Vision',
		capacity: 40,
		status: 'inService',
		location: '456 Oak Ave, Suburbs',
		maintenanceDue: '2024-09-01',
		mileage: '38,750',
		driver: 'Sarah Johnson',
	},
	{
		busNumber: 'BUS-104',
		model: 'IC Bus CE Series',
		capacity: 50,
		status: 'outOfService',
		location: 'Central Garage',
		maintenanceDue: 'N/A',
		mileage: '67,890',
		driver: 'N/A',
	},
	{
		busNumber: 'BUS-105',
		model: 'Thomas HDX',
		capacity: 35,
		status: 'inService',
		location: '789 Pine Ln, Eastside',
		maintenanceDue: '2024-08-22',
		mileage: '41,600',
		driver: 'Mike Davis',
	},
]

export default function FleetPage() {
	return <FleetClient busData={busData} />
}
