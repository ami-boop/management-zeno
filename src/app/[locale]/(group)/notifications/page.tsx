import Client from '@/components/notifications/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { type Notification } from '@/types/notification'

export default async function NotificationsPage() {
  const sessionCookie = await getSessionToken()

  const notifications: Notification[] = await fetch(
    'https://getnotifications-ag7er5qhga-ew.a.run.app',
    {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `managementSessionCookie=${sessionCookie as string}`,
      },
    }
  ).then(res => res.json())

  return <Client initialNotifications={notifications} />
}
