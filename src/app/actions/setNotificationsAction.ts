'use server'

import { getSessionToken } from '@/utils/getSessionToken'
import { apiDelete, apiPost } from '@/lib/api/client'

type data = {
  markAllAsRead?: boolean
  markAsReadId?: string
  clearAll?: boolean
  clearNotificationId?: string
}

export default async function setNotificationsAction(data: data): Promise<{ ok: boolean }> {
  const sessionCookie = await getSessionToken()
  if (!sessionCookie) return { ok: false }

  try {
    if (data.clearAll || data.clearNotificationId) {
      const result = await apiDelete('notifications', sessionCookie, data)
      return { ok: result.ok }
    }
    const result = await apiPost('notifications', sessionCookie, data)
    return { ok: result.ok }
  } catch {
    return { ok: false }
  }
}
