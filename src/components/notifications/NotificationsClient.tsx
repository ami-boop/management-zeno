'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { X, Bell, Clock, AlertCircle, CheckCircle, Archive } from 'lucide-react'
import type { Notification } from '@/app/[locale]/management/notifications/page'
import NotificationList from './NotificationList'

interface NotificationsClientProps {
	initialNotifications: Notification[]
}

export default function NotificationsClient({
	initialNotifications,
}: NotificationsClientProps) {
	const t = useTranslations('Notifications')
	const [selectedFilter, setSelectedFilter] = useState<string>('all')
	const [notifications, setNotifications] =
		useState<Notification[]>(initialNotifications)

	const getNotificationIcon = (type: Notification['type']) => {
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

	const removeNotification = (id: number) => {
		setNotifications(notifications.filter(n => n.id !== id))
	}

	const markAsRead = (id: number) => {
		setNotifications(
			notifications.map(n => (n.id === id ? { ...n, isRead: true } : n))
		)
	}

	const markAllAsRead = () => {
		setNotifications(notifications.map(n => ({ ...n, isRead: true })))
	}

	const clearAll = () => {
		setNotifications([])
	}

	const filteredNotifications = useMemo(() => {
		return notifications.filter(notification => {
			switch (selectedFilter) {
				case 'unread':
					return !notification.isRead
				case 'alerts':
					return notification.type === 'alert'
				case 'info':
					return notification.type === 'info' || notification.type === 'success'
				default:
					return true
			}
		})
	}, [notifications, selectedFilter])

	const unreadCount = notifications.filter(n => !n.isRead).length
	const alertCount = notifications.filter(n => n.type === 'alert').length

	const filterButtons = [
		{ key: 'all', label: t('filterAll'), count: notifications.length },
		{ key: 'unread', label: t('filterUnread'), count: unreadCount },
		{ key: 'alerts', label: t('filterAlerts'), count: alertCount },
		{
			key: 'info',
			label: t('filterInfo'),
			count: notifications.filter(
				n => n.type === 'info' || n.type === 'success'
			).length,
		},
	]

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='mb-8'>
					<div className='flex items-center justify-between'>
						<div>
							<h1 className='text-3xl font-bold text-gray-900 mb-2'>
								{t('title')}
							</h1>
							<p className='text-gray-600'>{t('description')}</p>
						</div>
						<div className='flex items-center space-x-2'>
							{unreadCount > 0 && (
								<div className='bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium'>
									{unreadCount} {t('unread')}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Controls */}
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 mb-6'>
					<div className='px-6 py-4 border-b border-gray-200'>
						<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
							{/* Filters */}
							<div className='flex flex-wrap gap-2'>
								{filterButtons.map(filter => (
									<button
										key={filter.key}
										onClick={() => setSelectedFilter(filter.key)}
										className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
											selectedFilter === filter.key
												? 'bg-blue-100 text-blue-800 border border-blue-200'
												: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
										}`}
									>
										{filter.label}
										<span
											className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
												selectedFilter === filter.key
													? 'bg-blue-200 text-blue-800'
													: 'bg-gray-100 text-gray-600'
											}`}
										>
											{filter.count}
										</span>
									</button>
								))}
							</div>

							{/* Actions */}
							<div className='flex items-center space-x-2'>
								{unreadCount > 0 && (
									<button
										onClick={markAllAsRead}
										className='inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium'
									>
										<CheckCircle className='w-4 h-4 mr-1' />
										{t('markAllRead')}
									</button>
								)}
								{notifications.length > 0 && (
									<button
										onClick={clearAll}
										className='inline-flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-800 font-medium'
									>
										<Archive className='w-4 h-4 mr-1' />
										{t('clearAll')}
									</button>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Notifications List */}
				<NotificationList
					notifications={filteredNotifications}
					t={t}
					markAsRead={markAsRead}
					removeNotification={removeNotification}
				/>
			</div>
		</div>
	)
}
