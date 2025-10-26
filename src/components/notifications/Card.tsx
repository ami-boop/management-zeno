import { useTranslations } from "next-intl"
import {
  getNotificationIcon,
  getNotificationStyle,
  getPriorityBadge,
} from '@/utils/notificationUtils'
import { CheckCircle, X, Clock } from "lucide-react"
import { type Notification } from "@/types/notification"

export default function Card({
  notification,
  markAsRead,
  removeNotification,
}: {
  notification: Notification
  markAsRead: (id: string) => void
  removeNotification: (id: string) => void
}) {
  const t = useTranslations('Notifications')

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
                  <Clock className='w-3 h-3' data-testid='clock-icon' />
                  <span>{notification.time}</span>
                </div>
              </div>
              <p
                className={`text-sm leading-5 ${notification.isRead
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
                data-testid='mark-as-read-button'
              >
                <CheckCircle className='w-4 h-4' data-testid='check-circle-icon' />
              </button>
            )}
            <button
              onClick={() => removeNotification(notification.id)}
              className='p-1 text-gray-400 hover:text-red-600 transition-colors'
              data-testid='remove-notification-button'
            >
              <X className='w-4 h-4' data-testid='x-icon' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
