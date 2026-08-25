import Client from '@/components/notifications/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { type Notification } from '@/types/notification'
import { API_URL } from '@/constants'

export default async function NotificationsPage() {
  const sessionCookie = await getSessionToken()

  const notifications: Notification[] = await fetch(
    `${API_URL}/notifications`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionCookie as string}`,
      },
    }
  ).then(res => res.json())

  return <Client initialNotifications={notifications} />
}
