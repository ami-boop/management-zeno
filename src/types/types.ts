interface INotifications {
	message: string
	time: string
}

interface IBusses {
	busNumber: string
	model: string
	capacity: number
	status: string
	location: string
	maintenanceDue: string
}

interface IBussData {
	id: string
	route: string
	driver: string
	status: string
	students: number | 'N/A'
}

interface IRoutes {
	id: number
	name: string
	stops: number
	bus: string
	status: string
}

interface IDashboardStats {
	label: string
	value: number
}

interface IStudents {
	id: number
	name: string
	grade: string
	route: string
	bus: string
}

interface WeekDay {
	name: string
	active: boolean
}

interface Stop {
	type: 'stop' | 'school'
	time: string
	label: string
}

interface BusRoute {
	id: string
	title: string
	description: string
}

interface Contact {
	id: string
	name: string
	relationship: string
	phone: string
}

interface NotificationSetting {
	id: string
	icon: string
	title: string
	enabled: boolean
}

interface User {
	name: string
	class: string
}
