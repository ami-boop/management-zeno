'use server'

import { API_URL } from '@/constants'
import { getSessionToken } from '@/utils/getSessionToken'

export async function getLessons(classId: string) {
  const sessionCookie = await getSessionToken()

  const res = await fetch(
    `${API_URL}/lessons?classId=${encodeURIComponent(classId)}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionCookie}`,
      },
      cache: 'force-cache',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch schedule')
  const { classData } = await res.json()
  return {
    ok: true,
    schedule: classData.schedule,
    className: classData.className,
  }
}
