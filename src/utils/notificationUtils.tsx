import { Bell, AlertCircle, CheckCircle } from 'lucide-react'
import { ReactNode } from 'react'
import type { Notification } from '@/types/notification'

export const getNotificationIcon = (type: Notification['type']): ReactNode => {
  switch (type) {
    case 'alert':
      return <AlertCircle className='w-5 h-5 text-zeno-danger' />
    case 'success':
      return <CheckCircle className='w-5 h-5 text-zeno-sage' />
    case 'info':
      return <Bell className='w-5 h-5 text-zeno-amber-deep' />
    default:
      return <Bell className='w-5 h-5 text-zeno-muted' />
  }
}

const unreadAccent: Record<Notification['type'], string> = {
  alert: 'border-s-zeno-danger',
  success: 'border-s-zeno-sage',
  info: 'border-s-zeno-amber',
}

export const getNotificationStyle = (
  type: Notification['type'],
  isRead: boolean
) => {
  if (isRead) return 'border-zeno-line bg-zeno-surface'
  return `border-zeno-line-strong bg-zeno-cream-surface border-s-4 ${unreadAccent[type] ?? 'border-s-zeno-amber'}`
}

export const getPriorityBadge = (
  priority: Notification['priority'],
  t: (key: string) => string
) => {
  switch (priority) {
    case 'high':
      return (
        <span className='px-2 py-1 bg-zeno-danger-soft text-zeno-danger text-xs rounded-full font-medium'>
          {t('priority.high')}
        </span>
      )
    case 'medium':
      return (
        <span className='px-2 py-1 bg-zeno-cream text-zeno-amber-ink text-xs rounded-full font-medium'>
          {t('priority.medium')}
        </span>
      )
    case 'low':
      return (
        <span className='px-2 py-1 bg-zeno-sage-soft text-zeno-sage text-xs rounded-full font-medium'>
          {t('priority.low')}
        </span>
      )
    default:
      return null
  }
}
