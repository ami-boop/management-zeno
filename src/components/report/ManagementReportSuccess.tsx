import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'

export default function ManagementReportSuccess({
  onReset,
}: {
  onReset: () => void
}) {
  const t = useTranslations('managementReport')
  return (
    <div className='text-center'>
      <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
        <Check className='w-8 h-8 text-green-600' data-testid='check-icon' />
      </div>
      <h2 className='text-xl font-semibold text-gray-900 mb-2'>
        {t('successTitle')}
      </h2>
      <p className='text-gray-600 mb-6'>{t('successMessage')}</p>
      <button
        onClick={onReset}
        className='w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200'
      >
        {t('backButton')}
      </button>
    </div>
  )
}
