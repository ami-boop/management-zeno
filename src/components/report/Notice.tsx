import { useTranslations } from 'next-intl'
import { AlertTriangle } from 'lucide-react'

export default function Notice() {
  const t = useTranslations('managementReport')
  return (
    <div className='mt-6 p-3 bg-amber-50 border border-amber-200 rounded-md'>
      <div className='flex'>
        <AlertTriangle className='w-5 h-5 text-amber-400 me-2 shrink-0 mt-0.5' data-testid='alert-triangle-icon' />
        <p className='text-sm text-amber-800'>{t('noticeMessage')}</p>
      </div>
    </div>
  )
}
