import { getTranslations } from 'next-intl/server'
import { Info } from 'lucide-react'
import Form from '@/components/report/Form'
import { API_URL, GRADES, PROFILES } from '@/constants'
import { getSessionToken } from '@/utils/getSessionToken'

export default async function ReportPage() {
  const sessionToken = await getSessionToken()

  let timeOptions: string[] = []

  try {
    const res = await fetch(`${API_URL}/report-time/management`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
      cache: 'force-cache',
    })

    const data = await res.json()
    
    timeOptions = data.times || []
  } catch (error) {
    console.error('Failed to fetch time options:', error)
  }

  const classNumbers = Array.from({ length: 11 }, (_, i) => i + 1)

  const t = await getTranslations('managementReport')

  return (
    <div className='min-h-screen bg-gray-50'>
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
