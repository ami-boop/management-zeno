import { DashboardRoute } from '@/types/dashboard'
import { Bus, Car, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ProgressBar } from '@/components/ui/progress-bar'
import FriendIndicator from './FriendIndicator'

interface DashboardRouteTableProps {
  routes: DashboardRoute[]
  routeNameMap?: Record<string, string>
  onOrderBuses: (routeId: string, count: number) => void
  getStatusColor: (status: DashboardRoute['status']) => string
  getStatusText: (status: DashboardRoute['status']) => string
}

const RouteTable = ({
  routes,
  routeNameMap,
  onOrderBuses,
  getStatusColor,
  getStatusText,
}: DashboardRouteTableProps) => {
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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('columns.route')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('columns.totalStudents')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <Bus className="w-4 h-4 text-emerald-600" />
                <span title={t('tooltips.goingByBus')} className="cursor-help">
                  {t('columns.goingByBus')}
                </span>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <Car className="w-4 h-4 text-amber-600" />
                <span title={t('tooltips.goingOtherWay')} className="cursor-help">
                  {t('columns.goingOtherWay')}
                </span>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <Bus className="w-4 h-4 text-blue-600" />
                <span
                  title={`${t('tooltips.busesNeeded')} (${t('tooltips.busesFormat')})`}
                  className="cursor-help"
                >
                  {t('columns.busesNeeded')}
                </span>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('columns.status')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('columns.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {routes.map((route) => {
            const busPercent = Math.round(
              (route.studentsOnBus / route.totalStudents) * 100
            )
            const otherPercent = Math.round(
              (route.studentsNotMarked / route.totalStudents) * 100
            )
            const busesPercent = Math.round(
              (route.busesOrdered / route.busesNeeded) * 100
            )

            return (
              <tr
                key={route.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {route.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t('columns.departure')}: {route.estimatedTime}
                    </div>
                    <FriendIndicator
                      tripId={route.id}
                      count={route.pendingFriendCount ?? 0}
                      routeNameMap={routeNameMap ?? {}}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {route.totalStudents}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="flex items-center gap-2"
                    title={t('tooltips.goingByBus')}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-emerald-600">
                        {route.studentsOnBus}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({busPercent}%)
                      </span>
                    </div>
                    <div className="w-16">
                      <ProgressBar
                        value={busPercent}
                        color="emerald"
                        size="lg"
                        showBorder
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="flex items-center gap-2"
                    title={t('tooltips.goingOtherWay')}
                  >
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-sm font-semibold ${
                          route.studentsNotMarked > 0
                            ? 'text-amber-600'
                            : 'text-gray-500'
                        }`}
                      >
                        {route.studentsNotMarked}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({otherPercent}%)
                      </span>
                    </div>
                    <div className="w-16">
                      <ProgressBar
                        value={otherPercent}
                        color={route.studentsNotMarked > 0 ? 'amber' : 'gray'}
                        size="lg"
                        showBorder
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="flex items-center gap-2"
                    title={`${t('tooltips.busesNeeded')} (${t('tooltips.busesFormat')})`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-blue-600">
                        {route.busesOrdered}
                      </span>
                      <span className="text-xs text-gray-400">
                        {t('tooltips.ofTotal')} {route.busesNeeded}
                      </span>
                    </div>
                    <div className="w-16">
                      <ProgressBar
                        value={busesPercent}
                        color="blue"
                        size="lg"
                        showBorder
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      route.status
                    )}`}
                  >
                    {getStatusIcon(route.status)}
                    {getStatusText(route.status)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    {route.busesOrdered < route.busesNeeded && (
                      <>
                        <button
                          onClick={() => onOrderBuses(route.id, 1)}
                          title={t('tooltips.addBus')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          +1 <Bus className="w-3 h-3 ml-1" />
                        </button>
                        {route.busesOrdered + 2 <= route.busesNeeded && (
                          <button
                            onClick={() =>
                              onOrderBuses(
                                route.id,
                                route.busesNeeded - route.busesOrdered
                              )
                            }
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                          >
                            {t('orderAll')}
                          </button>
                        )}
                      </>
                    )}
                    {route.busesOrdered === route.busesNeeded &&
                      route.busesOrdered > 0 && (
                        <div className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" />
                          {t('allOrdered')}
                        </div>
                      )}
                    {route.busesOrdered > 0 && (
                      <button
                        onClick={() => onOrderBuses(route.id, -1)}
                        title={t('tooltips.removeBus')}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-200"
                      >
                        -1 <Bus className="w-3 h-3 ml-1" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default RouteTable
