import type { Notification } from "@/types/notification"

export const notifications: Notification[] = [
  {
    id: '1',
    message: 'messages.late',
    time: '2024-03-15T08:00:00',
    type: 'alert',
    isRead: false,
    priority: 'high',
  },
  {
    id: '2',
    message: 'messages.modifiedSchedule',
    time: '2024-03-14T16:30:00',
    type: 'info',
    isRead: false,
    priority: 'medium',
  },
]
