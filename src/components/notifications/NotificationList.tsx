'use client'
import { Bell, Clock, X, CheckCircle, AlertCircle } from 'lucide-react'
import type { Notification } from '@/app/[locale]/management/notifications/page'
import { ReactNode } from 'react'

interface NotificationListProps {
	notifications: Notification[]
	t: (key: string) => string
	markAsRead: (id: number) => void
	removeNotification: (id: number) => void
}

export default function NotificationList({
	notifications,
	t,
	markAsRead,
	removeNotification,
}: NotificationListProps) {
	if (notifications.length === 0) {
		return (
			<div className='text-center py-12 bg-white rounded-lg border border-gray-200'>
				<div className='w-12 h-12 mx-auto mb-4 text-gray-400'>
					<Bell className='w-full h-full' />
				</div>
				<h3 className='text-lg font-medium text-gray-900 mb-2'>
					{t('noNotifications')}
				</h3>
				<p className='text-gray-500'>{t('noNotificationsDesc')}</p>
			</div>
		)
	}
	return (
		<div className='space-y-2'>
			{notifications.map(notification => (
				<NotificationCard
					key={notification.id}
					notification={notification}
					t={t}
					markAsRead={markAsRead}
					removeNotification={removeNotification}
				/>
			))}
		</div>
	)
}

function NotificationCard({
	notification,
	t,
	markAsRead,
	removeNotification,
}: {
	notification: Notification
	t: (key: string) => string
	markAsRead: (id: number) => void
	removeNotification: (id: number) => void
}) {
	const getNotificationIcon = (type: Notification['type']): ReactNode => {
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

	const getNotificationStyle = (
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

	const getPriorityBadge = (priority: Notification['priority']) => {
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

	const formatTime = (timeString: string) => {
		const date = new Date(timeString)
		const now = new Date()
		const diffInMinutes = Math.floor((+now - +date) / (1000 * 60))
		if (diffInMinutes < 1) return t('timeAgo.justNow')
		if (diffInMinutes < 60) return `${diffInMinutes} ${t('timeAgo.minutesAgo')}`
		if (diffInMinutes < 1440)
			return `${Math.floor(diffInMinutes / 60)} ${t('timeAgo.hoursAgo')}`
		return `${Math.floor(diffInMinutes / 1440)} ${t('timeAgo.daysAgo')}`
	}

	return (
		<div
			className={`border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${getNotificationStyle(
				notification.type,
				notification.isRead
			)}`}
		>
			<div className='p-4'>
				<div className='flex items-start justify-between gap-4'>
					<div className='flex items-start space-x-3 flex-1'>
						<div className='flex-shrink-0 mt-0.5'>
							{getNotificationIcon(notification.type)}
						</div>
						<div className='flex-1 min-w-0'>
							<div className='flex items-center justify-between mb-2'>
								<div className='flex items-center space-x-2'>
									{getPriorityBadge(notification.priority)}
									{!notification.isRead && (
										<div className='w-2 h-2 bg-blue-500 rounded-full'></div>
									)}
								</div>
								<div className='flex items-center text-xs text-gray-500 space-x-1'>
									<Clock className='w-3 h-3' />
									<span>{formatTime(notification.time)}</span>
								</div>
							</div>
							<p
								className={`text-sm leading-5 ${
									notification.isRead
										? 'text-gray-600'
										: 'text-gray-900 font-medium'
								}`}
							>
								{t(notification.message)}
							</p>
						</div>
					</div>
					<div className='flex items-center space-x-1'>
						{!notification.isRead && (
							<button
								onClick={() => markAsRead(notification.id)}
								className='p-1 text-gray-400 hover:text-blue-600 transition-colors'
								title={t('markAsRead')}
							>
								<CheckCircle className='w-4 h-4' />
							</button>
						)}
						<button
							onClick={() => removeNotification(notification.id)}
							className='p-1 text-gray-400 hover:text-red-600 transition-colors'
						>
							<X className='w-4 h-4' />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
