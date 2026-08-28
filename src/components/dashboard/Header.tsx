import { useTranslations } from 'next-intl'
import { Clock } from 'lucide-react'

const Header = ({
  lastUpdated,
}: { lastUpdated?: string }) => {
  const t = useTranslations('Dashboard')
  return (
    <div className='mb-8 rounded-xl bg-zeno-paper border border-zeno-line px-5 py-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>{t('title')}</h1>
          <p className='text-gray-600 text-base'>{t('description')}</p>
        </div>
        <div className='flex items-center space-x-4'>
          {lastUpdated && (
            <div className='text-sm text-gray-500 flex items-center'>
              <Clock className='w-4 h-4 mr-1' data-testid='clock-icon' />
              {t('lastUpdated')}: {lastUpdated}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
