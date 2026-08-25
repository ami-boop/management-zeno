'use server'

import { API_URL } from '@/constants'
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

  await fetch(`${API_URL}/notifications`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionCookie as string}`,
    },
    body: JSON.stringify(data as data),
  }).then(async res => {
    return res.json()
  })
}
