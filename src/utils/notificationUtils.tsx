import { Bell, AlertCircle, CheckCircle } from 'lucide-react'
import { ReactNode } from 'react'
import type { Notification } from '@/app/[locale]/(group)/notifications/page'

export const getNotificationIcon = (type: Notification['type']): ReactNode => {
	switch (type) {
		case 'alert':
			return <AlertCircle className='w-5 h-5 text-red-500' />
		case 'success':
			return <CheckCircle className='w-5 h-5 text-green-500' />
		case 'info':
			return <Bell className='w-5 h-5 text-blue-500' />
		default:
			return <Bell className='w-5 h-5 text-gray-500' />
	}
}

export const getNotificationStyle = (
	type: Notification['type'],
	isRead: boolean
) => {
	const baseStyle = isRead ? 'bg-white' : 'bg-blue-50'
	const borderStyle = isRead ? 'border-gray-200' : 'border-blue-200'
	switch (type) {
		case 'alert':
			return `${baseStyle} ${borderStyle} ${
				!isRead ? 'border-l-4 border-l-red-500' : ''
			}`
		case 'success':
			return `${baseStyle} ${borderStyle} ${
				!isRead ? 'border-l-4 border-l-green-500' : ''
			}`
		case 'info':
			return `${baseStyle} ${borderStyle} ${
				!isRead ? 'border-l-4 border-l-blue-500' : ''
			}`
		default:
			return `${baseStyle} ${borderStyle}`
	}
}

export const getPriorityBadge = (
	priority: Notification['priority'],
	t: (key: string) => string
) => {
	switch (priority) {
		case 'high':
			return (
				<span className='px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium'>
					{t('priority.high')}
				</span>
			)
		case 'medium':
			return (
				<span className='px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium'>
					{t('priority.medium')}
				</span>
			)
		case 'low':
			return (
				<span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium'>
					{t('priority.low')}
				</span>
			)
		default:
			return null
	}
}
