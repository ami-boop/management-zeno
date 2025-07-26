import DashboardClient from '@/components/dashboard/DashboardClient'

interface Route {
	id: string
	name: string
	studentsOnBus: number
	studentsNotMarked: number
	totalStudents: number
	busesNeeded: number
	busesOrdered: number
	status: 'pending' | 'partial' | 'completed'
	lastUpdate: string
	estimatedTime: string
}

export default async function DashboardPage() {
	// Здесь можно заменить на загрузку данных с сервера
	const routes: Route[] = [
		{
			id: 'ROUTE-A',
			name: 'Route A',
			studentsOnBus: 85,
			studentsNotMarked: 25,
			totalStudents: 110,
			busesNeeded: 4,
			busesOrdered: 2,
			status: 'partial',
			lastUpdate: '14:23',
			estimatedTime: '12:00',
		},
		{
			id: 'ROUTE-B',
			name: 'Route B',
			studentsOnBus: 60,
			studentsNotMarked: 15,
			totalStudents: 75,
			busesNeeded: 3,
			busesOrdered: 3,
			status: 'completed',
			lastUpdate: '14:18',
			estimatedTime: '12:00',
		},
		{
			id: 'ROUTE-C',
			name: 'Route C',
			studentsOnBus: 95,
			studentsNotMarked: 35,
			totalStudents: 130,
			busesNeeded: 5,
			busesOrdered: 0,
			status: 'pending',
			lastUpdate: '14:24',
			estimatedTime: '12:00',
		},
		{
			id: 'ROUTE-D',
			name: 'Route D',
			studentsOnBus: 45,
			studentsNotMarked: 10,
			totalStudents: 55,
			busesNeeded: 2,
			busesOrdered: 1,
			status: 'partial',
			lastUpdate: '14:22',
			estimatedTime: '12:00',
		},
		{
			id: 'ROUTE-E',
			name: 'Route E',
			studentsOnBus: 70,
			studentsNotMarked: 20,
			totalStudents: 90,
			busesNeeded: 3,
			busesOrdered: 3,
			status: 'completed',
			lastUpdate: '14:20',
			estimatedTime: '12:00',
		},
	]
	return <DashboardClient routes={routes} />
}
