'use server'

import { getSessionToken } from '@/utils/getSessionToken'
import type { reportData } from '@/components/report/Form'

interface IBody {
  parallel?: string | null,
  className?: string | null,
  megama?: string | null,
  time: string | null
}

export default async function setStudentReturnStatus(reportData: reportData) {
  const sessionCookie = await getSessionToken()

  const requestBody: IBody = {
    parallel: reportData.parallel,
    className: reportData.className,
    megama: reportData.megama,
    time: reportData.time,
  }

  const res = await fetch(
    'https://setstudentsreturnstatus-ag7er5qhga-ew.a.run.app',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `managementSessionCookie=${sessionCookie}`,
      },
      body: JSON.stringify(requestBody),
    }
  ).then(res => res.json())

  return res
}
