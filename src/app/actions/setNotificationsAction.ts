'use server'

import { getSessionToken } from '@/utils/getSessionToken'

type data = {
  markAllAsRead?: boolean
  markAsReadId?: string
  clearAll?: boolean
  clearNotificationId?: string
}

export default async function setNotificationsAction(data: data) {
  const sessionCookie = await getSessionToken()

  const method: string = data.clearAll || data.clearNotificationId ? 'DELETE' : 'POST'

  await fetch('https://setnotifications-ag7er5qhga-ew.a.run.app', {
    method,
    headers: {
      'Content-Type': 'application/json',
      Cookie: `managementSessionCookie=${sessionCookie as string}`,
    },
    body: JSON.stringify(data as data),
  }).then(async res => {
    console.log(res)
    return res.json()
  })
}
