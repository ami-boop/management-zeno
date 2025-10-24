'use client'

import { Bell } from 'lucide-react'
import type { Notification } from '@/types/notification'
import { useTranslations } from 'next-intl'
import NotificationCard from './NotificationCard'

interface NotificationListProps {
  notifications: Notification[]
  markAsRead: (id: string) => void
  removeNotification: (id: string) => void
}

export default function NotificationList({
  notifications,
  markAsRead,
  removeNotification,
}: NotificationListProps) {
  const t = useTranslations('Notifications')

  if (notifications.length === 0) {
    return (
      <div className='text-center py-12 bg-white rounded-lg border border-gray-200'>
        <div className='w-12 h-12 mx-auto mb-4 text-gray-400'>
          <Bell className='w-full h-full' data-testid='bell-icon' />
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
          markAsRead={markAsRead}
          removeNotification={removeNotification}
        />
      ))}
    </div>
  )
}
