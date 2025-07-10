import StudentsClient from '@/components/students/StudentsClient'

export interface Student {
	id: number
	name: string
	grade: string
	route: string
	bus: string
	status: 'onboard' | 'boarding' | 'absent' | 'dropped'
	pickupTime: string
	dropoffTime: string
	guardian: string
	phone: string
}

export default function StudentsPage() {
	const students: Student[] = [
		{
			id: 1,
			name: 'Owen Bennett',
			grade: '5th Grade',
			route: 'Route A',
			bus: 'BUS-101',
			status: 'onboard',
			pickupTime: '07:30',
			dropoffTime: '15:45',
			guardian: 'Sarah Bennett',
			phone: '+1-555-0123',
		},
		{
			id: 2,
			name: 'Sophia Hughes',
			grade: '3rd Grade',
			route: 'Route B',
			bus: 'BUS-102',
			status: 'dropped',
			pickupTime: '07:45',
			dropoffTime: '15:30',
			guardian: 'Michael Hughes',
			phone: '+1-555-0124',
		},
		{
			id: 3,
			name: 'Lucas Hayes',
			grade: '6th Grade',
			route: 'Route A',
			bus: 'BUS-101',
			status: 'boarding',
			pickupTime: '07:35',
			dropoffTime: '15:50',
			guardian: 'Jennifer Hayes',
			phone: '+1-555-0125',
		},
		{
			id: 4,
			name: 'Isabella Reed',
			grade: '4th Grade',
			route: 'Route C',
			bus: 'BUS-103',
			status: 'absent',
			pickupTime: '08:00',
			dropoffTime: '16:00',
			guardian: 'David Reed',
			phone: '+1-555-0126',
		},
		{
			id: 5,
			name: 'Caleb Foster',
			grade: '2nd Grade',
			route: 'Route B',
			bus: 'BUS-102',
			status: 'onboard',
			pickupTime: '07:50',
			dropoffTime: '15:35',
			guardian: 'Lisa Foster',
			phone: '+1-555-0127',
		},
		{
			id: 6,
			name: 'Emma Watson',
			grade: '1st Grade',
			route: 'Route C',
			bus: 'BUS-103',
			status: 'boarding',
			pickupTime: '08:05',
			dropoffTime: '16:05',
			guardian: 'James Watson',
			phone: '+1-555-0128',
		},
	]

	return <StudentsClient initialStudents={students} />
}
