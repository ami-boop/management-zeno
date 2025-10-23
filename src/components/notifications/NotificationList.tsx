'use client'
import { Bell, Clock, X, CheckCircle } from 'lucide-react'
import type { Notification } from '@/app/[locale]/(group)/notifications/page'
import {
	getNotificationIcon,
	getNotificationStyle,
	getPriorityBadge,
} from '@/utils/notificationUtils'

interface NotificationListProps {
	notifications: Notification[]
	t: (key: string) => string
	markAsRead: (id: string) => void
	removeNotification: (id: string) => void
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
	markAsRead: (id: string) => void
	removeNotification: (id: string) => void
}) {
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
									{getPriorityBadge(notification.priority, t)}
									{!notification.isRead && (
										<div className='w-2 h-2 bg-blue-500 rounded-full'></div>
									)}
								</div>
								<div className='flex items-center text-xs text-gray-500 space-x-1'>
									<Clock className='w-3 h-3' />
									<span>{notification.time}</span>
								</div>
							</div>
							<p
								className={`text-sm leading-5 ${
									notification.isRead
										? 'text-gray-600'
										: 'text-gray-900 font-medium'
								}`}
							>
								{notification.message}
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
