import { FC } from 'react'
import { Bus, Users, AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import dayjs from 'dayjs'

interface Route {
  id: string
  name: string
  studentsOnBus: number
  studentsNotMarked: number
  totalStudents: number
  busesNeeded: number
  busesOrdered: number
  status: 'pending' | 'partial' | 'completed'
  lastUpdate: Record<string, number>
  estimatedTime: string
}

interface DashboardRouteMobileCardsProps {
  routes: Route[]
  onOrderBuses: (routeId: string, count: number) => void
  getStatusColor: (status: Route['status']) => string
  getStatusDot: (status: Route['status']) => string
  getStatusText: (status: Route['status']) => string
}

const RouteMobileCards: FC<DashboardRouteMobileCardsProps> = ({
  routes,
  onOrderBuses,
  getStatusColor,
  getStatusDot,
  getStatusText,
}) => {
  const t = useTranslations('Dashboard')
  return (
    <div className='lg:hidden divide-y divide-gray-200'>
      {routes.map(route => (
        <div key={route.id} className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3 className='text-lg font-medium text-gray-900'>
                {route.name}
              </h3>
              <p className='text-sm text-gray-500'>
                {t('columns.departure')}: {route.estimatedTime}
              </p>
            </div>
            <div
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                route.status
              )}`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(
                  route.status
                )}`}
              ></div>
              {getStatusText(route.status)}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4 mb-4'>
            <div>
              <dt className='text-sm font-medium text-gray-500'>
                <Users className='inline w-4 h-4 mr-1' />{' '}
                {t('columns.studentsOnBus')}
              </dt>
              <dd className='text-lg font-semibold text-emerald-600'>
                {route.studentsOnBus}
              </dd>
            </div>
            <div>
              <dt className='text-sm font-medium text-gray-500'>
                <AlertTriangle className='inline w-4 h-4 mr-1' />{' '}
                {t('columns.notMarked')}
              </dt>
              <dd
                className={`text-lg font-semibold ${route.studentsNotMarked > 0
                    ? 'text-amber-600'
                    : 'text-gray-500'
                  }`}
              >
                {route.studentsNotMarked}
              </dd>
            </div>
          </div>

          <div className='mb-4'>
            <div className='flex justify-between text-sm mb-2'>
              <span className='font-medium text-gray-500'>
                {t('columns.totalStudents')}
              </span>
              <span className='text-gray-900'>{route.totalStudents}</span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2'>
              <div
                className='bg-emerald-500 h-2 rounded-full transition-all duration-300'
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      0,
                      (route.studentsOnBus / route.totalStudents) * 100
                    )
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          <div className='mb-4'>
            <div className='flex justify-between text-sm mb-2'>
              <span className='font-medium text-gray-500'>
                <Bus className='inline w-4 h-4 mr-1' />{' '}
                {t('columns.busesOrdered')}
              </span>
              <span className='text-gray-900'>
                {route.busesOrdered}/{route.busesNeeded}
              </span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2'>
              <div
                className='bg-blue-500 h-2 rounded-full transition-all duration-300'
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, (route.busesOrdered / route.busesNeeded) * 100)
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {route.busesOrdered < route.busesNeeded && (
            <div className='flex items-center space-x-2 mb-4'>
              <button
                onClick={() => onOrderBuses(route.id, 1)}
                className='flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
              >
                +1 <Bus className='w-4 h-4 ml-1' />
              </button>
              {route.busesOrdered + 2 <= route.busesNeeded && (
                <button
                  onClick={() =>
                    onOrderBuses(
                      route.id,
                      route.busesNeeded - route.busesOrdered
                    )
                  }
                  className='flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
                >
                  {t('orderAll')}
                </button>
              )}
            </div>
          )}

          {route.busesOrdered === route.busesNeeded && (
            <span className='text-xs text-emerald-600 font-medium'>
              {t('allOrdered')}
            </span>
          )}

          <div className='text-sm text-gray-500'>
            {t('columns.lastUpdated')}:{' '}
            {dayjs(
              route.lastUpdate._seconds * 1000 +
              Math.floor(route.lastUpdate._nanoseconds / 1e6)
            ).format('HH:MM')}
          </div>
        </div>
      ))}
    </div>
  )
}

export default RouteMobileCards
