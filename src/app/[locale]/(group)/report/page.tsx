import { getTranslations } from 'next-intl/server'
import { Info } from 'lucide-react'
import Form from '@/components/report/Form'
import { GRADES, PROFILES } from '@/constants'
import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ReportPage() {
  const token = await getSessionToken()
  if (!token) redirect('/login')

  let timeOptions: string[] = []

  try {
    const data = await apiGet('report-time/management', token)
    if (data && typeof data === 'object' && Array.isArray((data as { times?: unknown }).times)) {
      timeOptions = ((data as { times: unknown[] }).times).filter(
        (time): time is string => typeof time === 'string'
      )
    }
  } catch (error) {
    console.error('Failed to fetch time options:', error)
  }

  const classNumbers = Array.from({ length: 11 }, (_, i) => i + 1)

  const t = await getTranslations('managementReport')

  return (
    <div className='bg-gray-50'>
      <div className='flex justify-center py-12 px-4'>
        <div className='max-w-md w-full'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
            {/* Header */}
            <div className='text-center mb-8'>
              <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Info className='w-8 h-8 text-blue-600' />
              </div>
              <h1 className='text-2xl font-bold text-gray-900 mb-2'>
                {t('title')}
              </h1>
              <p className='text-gray-600 text-sm'>{t('description')}</p>
            </div>
            <Form
              grades={GRADES}
              profiles={PROFILES}
              timeOptions={timeOptions}
              classNumbers={classNumbers}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
