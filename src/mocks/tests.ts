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

export const lessons = [
  {
    color: '#ffffff',
    name: 'Math',
    teacher: 'Misha'
  },
  {
    color: '#00bcd4',
    name: 'English',
    teacher: 'Anna'
  },
  {
    color: '#ff9800',
    name: 'History',
    teacher: 'David'
  },
  {
    color: '#8bc34a',
    name: 'Physics',
    teacher: 'Lior'
  }
]

export const grades = [
  { key: 'alef', label: 'א׳', hebrew: 'א׳' },
  { key: 'bet', label: 'ב׳', hebrew: 'ב׳' },
]
export const days = [
  { key: 'sunday', label: 'Sunday', hebrew: 'א׳' },
  { key: 'monday', label: 'Monday', hebrew: 'ב׳' },
]

export const times: Record<number, string> = {
  1: '08:30 - 09:10',
  2: '09:10 - 09:50',
}
