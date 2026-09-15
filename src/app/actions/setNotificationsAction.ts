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
    const isDelete = Boolean(data.clearAll || data.clearNotificationId)
    const result = isDelete
      ? await apiDelete('notifications', sessionCookie)
      : await apiPost('notifications', sessionCookie, data)
    return { ok: result.ok }
  } catch {
    return { ok: false }
  }
}
