import { Bus, Users, Car, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { DashboardRoute } from '@/types/dashboard'
import { ProgressBar } from '@/components/ui/progress-bar'
import FriendIndicator from './FriendIndicator'
import dayjs from 'dayjs'

interface DashboardRouteMobileCardsProps {
  routes: DashboardRoute[]
  routeNameMap?: Record<string, string>
  onOrderBuses: (routeId: string, count: number) => void
  getStatusColor: (status: DashboardRoute['status']) => string
  getStatusText: (status: DashboardRoute['status']) => string
  busyRouteIds?: ReadonlySet<string>
}

const RouteMobileCards = ({
  routes,
  routeNameMap,
  onOrderBuses,
  getStatusColor,
  getStatusText,
  busyRouteIds,
}: DashboardRouteMobileCardsProps) => {
  const t = useTranslations('Dashboard')

  const getStatusIcon = (status: DashboardRoute['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3.5 h-3.5" />
      case 'partial':
        return <Clock className="w-3.5 h-3.5" />
      case 'pending':
        return <AlertCircle className="w-3.5 h-3.5" />
      default:
        return null
    }
  }

  return (
    <div className="lg:hidden divide-y divide-gray-200">
      {routes.map((route) => {
        const isBusy = busyRouteIds?.has(route.id) ?? false
        const busPercent =
          route.totalStudents > 0
            ? Math.round((route.studentsOnBus / route.totalStudents) * 100)
            : 0
        const otherPercent =
          route.totalStudents > 0
            ? Math.round((route.studentsNotMarked / route.totalStudents) * 100)
            : 0
        const busesPercent =
          route.busesNeeded > 0
            ? Math.round((route.busesOrdered / route.busesNeeded) * 100)
            : 0

        return (
          <div
            key={route.id}
            className="p-4 sm:p-6"
            data-testid="route-container"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                  {route.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {t('columns.departure')}: {route.estimatedTime}
                </p>
                <FriendIndicator
                  tripId={route.id}
                  count={route.pendingFriendCount ?? 0}
                  routeNameMap={routeNameMap ?? {}}
                />
              </div>
              <div
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border shrink-0 ${getStatusColor(
                  route.status
                )}`}
              >
                {getStatusIcon(route.status)}
                <span className="hidden sm:inline">
                  {getStatusText(route.status)}
                </span>
              </div>
            </div>

            {/* Total Students */}
            <div className="mb-3 p-2 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  {t('columns.totalStudents')}
                </span>
                <span className="text-sm sm:text-base font-semibold text-gray-900">
                  {route.totalStudents}
                </span>
              </div>
            </div>

            {/* Students Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Going by Bus */}
              <div className="p-3 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-1.5 mb-1">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs text-emerald-700 font-medium truncate">
                    {t('columns.goingByBus')}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg sm:text-xl font-bold text-emerald-600">
                    {route.studentsOnBus}
                  </span>
                  <span className="text-xs text-emerald-500">
                    ({busPercent}%)
                  </span>
                </div>
                <div className="mt-2">
                  <ProgressBar value={busPercent} color="emerald" size="sm" />
                </div>
              </div>

              {/* Going Other Way */}
              <div className="p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-1.5 mb-1">
                  <Car className="w-4 h-4 text-amber-600" />
                  <span className="text-xs text-amber-700 font-medium truncate">
                    {t('columns.goingOtherWay')}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={`text-lg sm:text-xl font-bold ${
                      route.studentsNotMarked > 0
                        ? 'text-amber-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {route.studentsNotMarked}
                  </span>
                  <span className="text-xs text-amber-500">
                    ({otherPercent}%)
                  </span>
                </div>
                <div className="mt-2">
                  <ProgressBar
                    value={otherPercent}
                    color={route.studentsNotMarked > 0 ? 'amber' : 'gray'}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Buses */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Bus className="w-4 h-4 text-blue-600" />
                  <span className="text-xs sm:text-sm text-blue-700 font-medium">
                    {t('columns.busesNeeded')}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-base sm:text-lg font-bold text-blue-600">
                    {route.busesOrdered}
                  </span>
                  <span className="text-xs text-blue-500">
                    {t('tooltips.ofTotal')} {route.busesNeeded}
                  </span>
                </div>
              </div>
              <ProgressBar value={busesPercent} color="blue" size="md" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mb-3">
              {route.busesOrdered < route.busesNeeded && (
                <>
                  <button
                    disabled={isBusy}
                     onClick={() => onOrderBuses(route.id, 1)}
                    title={t('tooltips.addBus')}
                    className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    +1 <Bus className="w-4 h-4 ms-1" />
                  </button>
                  {route.busesOrdered < route.busesNeeded && (
                    <button
                      onClick={() =>
                        onOrderBuses(
                          route.id,
                          route.busesNeeded - route.busesOrdered
                        )
                      }
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      {t('orderAll')}
                    </button>
                  )}
                </>
              )}
              {route.busesOrdered === route.busesNeeded &&
                route.busesOrdered > 0 && (
                  <div className="inline-flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                    <CheckCircle className="w-4 h-4" />
                    {t('allOrdered')}
                  </div>
                )}
              {route.busesOrdered > 0 && (
                <button
                  disabled={isBusy}
                     onClick={() => onOrderBuses(route.id, -1)}
                  title={t('tooltips.removeBus')}
                  className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-200"
                >
                  -1 <Bus className="w-4 h-4 ms-1" />
                </button>
              )}
            </div>

            {/* Footer */}
            <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
              {t('columns.lastUpdated')}:{' '}
              {dayjs(
                route.lastUpdate._seconds * 1000 +
                  Math.floor(route.lastUpdate._nanoseconds / 1e6)
              ).format('HH:mm')}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default RouteMobileCards
