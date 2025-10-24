export interface Notification {
  id: string
  message: string
  time: string
  type: 'alert' | 'info' | 'success'
  isRead: boolean
  priority: 'high' | 'medium' | 'low'
}
