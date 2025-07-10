import NotificationsClient from '@/components/notifications/NotificationsClient'

export interface Notification {
	id: number
	message: string
	time: string
	type: 'alert' | 'info' | 'success'
	isRead: boolean
	priority: 'high' | 'medium' | 'low'
}

export default function NotificationsPage() {
	const notifications: Notification[] = [
		{
			id: 1,
			message: 'messages.late',
			time: '2024-03-15T08:00:00',
			type: 'alert',
			isRead: false,
			priority: 'high',
		},
		{
			id: 2,
			message: 'messages.modifiedSchedule',
			time: '2024-03-14T16:30:00',
			type: 'info',
			isRead: false,
			priority: 'medium',
		},
		{
			id: 3,
			message: 'messages.onTime',
			time: '2024-03-14T07:00:00',
			type: 'success',
			isRead: true,
			priority: 'low',
		},
		{
			id: 4,
			message: 'messages.maintenance',
			time: '2024-03-13T14:20:00',
			type: 'alert',
			isRead: false,
			priority: 'high',
		},
		{
			id: 5,
			message: 'messages.newDriver',
			time: '2024-03-13T09:15:00',
			type: 'info',
			isRead: true,
			priority: 'medium',
		},
		{
			id: 6,
			message: 'messages.weatherAlert',
			time: '2024-03-12T06:45:00',
			type: 'alert',
			isRead: false,
			priority: 'high',
		},
	]

	return <NotificationsClient initialNotifications={notifications} />
}
