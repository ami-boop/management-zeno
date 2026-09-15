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
      className={`rounded-zeno-sm border shadow-zeno-card hover:shadow-zeno-board transition ${getNotificationStyle(
        notification.type,
        notification.isRead
      )}`}
    >
      <div className='p-4'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex items-start gap-3 flex-1'>
            <div className='flex-shrink-0 mt-0.5'>
              {getNotificationIcon(notification.type)}
            </div>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                  {getPriorityBadge(notification.priority, t)}
                  {!notification.isRead && (
                    <div className='w-2 h-2 bg-zeno-amber rounded-full'></div>
                  )}
                </div>
                <div className='flex items-center text-xs text-zeno-muted gap-1 tabular-nums'>
                  <Clock className='w-3 h-3' data-testid='clock-icon' />
                  <span>{notification.time}</span>
                </div>
              </div>
              <p
                className={`text-sm leading-5 ${notification.isRead
                  ? 'text-zeno-muted'
                  : 'text-zeno-ink font-medium'
                  }`}
              >
                {notification.message}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-1'>
            {!notification.isRead && (
              <button
                onClick={() => markAsRead(notification.id)}
                className='rounded-lg p-1.5 text-zeno-muted hover:bg-zeno-sage-soft hover:text-zeno-sage transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber'
                title={t('markAsRead')}
                aria-label={t('markAsRead')}
                data-testid='mark-as-read-button'
              >
                <CheckCircle className='w-4 h-4' data-testid='check-circle-icon' />
              </button>
            )}
            <button
              onClick={() => removeNotification(notification.id)}
              className='rounded-lg p-1.5 text-zeno-muted hover:bg-zeno-danger-soft hover:text-zeno-danger transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber'
              title={t('clearAll')}
              aria-label={t('clearAll')}
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
