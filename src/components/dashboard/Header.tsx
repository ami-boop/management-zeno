import { FC } from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle, Clock } from 'lucide-react'

interface DashboardHeaderProps {
  title: string
  description: string
  systemStatus: string
  lastUpdated?: string
}

const Header: FC<DashboardHeaderProps> = ({
  title,
  description,
  systemStatus,
  lastUpdated,
}) => {
  const t = useTranslations('Dashboard')
  return (
    <div className='mb-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>{title}</h1>
          <p className='text-gray-600 text-base'>{description}</p>
        </div>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center text-sm text-gray-600'>
            <CheckCircle className='w-4 h-4 text-green-500 mr-2' />
            {systemStatus}
          </div>
          {lastUpdated && (
            <div className='text-sm text-gray-500 flex items-center'>
              <Clock className='w-4 h-4 mr-1' />
              {t('lastUpdated')}: {lastUpdated}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
