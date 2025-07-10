import DashboardClient from '@/components/dashboard/DashboardClient'

interface DashboardStat {
	label: string
	value: number
	change: string
}

interface Bus {
	id: string
	route: string
	driver: string
	status: 'inTransit' | 'atSchool' | 'maintenance'
	students: number
	capacity: number
	lastUpdate: string
}

export default function DashboardPage() {
	const dashboardStats: DashboardStat[] = [
		{ label: 'activeRoutes', value: 15, change: '+2 from yesterday' },
		{ label: 'busesInService', value: 12, change: '+1 from yesterday' },
		{ label: 'studentsTransported', value: 350, change: '+25 from yesterday' },
	]

	const busData: Bus[] = [
		{
			id: 'BUS-101',
			route: 'Route A',
			driver: 'Ethan Carter',
			status: 'inTransit',
			students: 25,
			capacity: 30,
			lastUpdate: '14:23',
		},
		{
			id: 'BUS-102',
			route: 'Route B',
			driver: 'Olivia Harper',
			status: 'atSchool',
			students: 0,
			capacity: 28,
			lastUpdate: '14:18',
		},
		{
			id: 'BUS-103',
			route: 'Route C',
			driver: 'Liam Foster',
			status: 'inTransit',
			students: 30,
			capacity: 32,
			lastUpdate: '14:24',
		},
		{
			id: 'BUS-104',
			route: 'Route A',
			driver: 'Ava Bennett',
			status: 'maintenance',
			students: 0,
			capacity: 30,
			lastUpdate: '13:15',
		},
		{
			id: 'BUS-105',
			route: 'Route B',
			driver: 'Noah Hayes',
			status: 'inTransit',
			students: 20,
			capacity: 25,
			lastUpdate: '14:22',
		},
	]

	return <DashboardClient dashboardStats={dashboardStats} busData={busData} />
}
