'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Header from './Header'
import Stats from './Stats'
import RouteFilters from './RouteFilters'
import RouteTable from './RouteTable'
import RouteMobileCards from './RouteMobileCards'
import dayjs from 'dayjs'
import setTripBuses from '@/app/actions/setTripBuses'
import { DashboardResponse } from '@/lib/api-contracts'
import { DashboardRoute } from '@/types/dashboard'

interface DashboardStat {
  label: string
  value: number
  change?: string
}

const adaptTrip = (
  trip: DashboardResponse['trips'][number],
  routeNameMap: Record<string, string>
): DashboardRoute => {
  const busesNeeded = trip.metrics?.busesNeeded ?? 0
  const totalStudents = trip.metrics?.totalStudents ?? 0
  const status: DashboardRoute['status'] =
    trip.status === 'completed'
      ? 'completed'
      : trip.status === 'boarding' || trip.status === 'in_transit'
        ? 'partial'
        : 'pending'
  const ts = trip.scheduledAt ? dayjs(trip.scheduledAt).unix() : dayjs().unix()
  return {
    id: trip.tripId,
    name: routeNameMap[trip.routeId] ?? trip.routeId,
    studentsOnBus: totalStudents,
    studentsNotMarked: 0,
    totalStudents,
    busesNeeded,
    busesOrdered: busesNeeded,
    status,
    lastUpdate: { _seconds: ts, _nanoseconds: 0 },
    estimatedTime: trip.scheduledTime,
    pendingFriendCount: trip.pendingFriendCount,
  }
}

const Client = ({
  data,
  routeNameMap,
}: {
  data: DashboardResponse
  routeNameMap: Record<string, string>
}) => {
  const t = useTranslations('Dashboard')
  const router = useRouter()
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [selectedRoute, setSelectedRoute] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [localRoutes, setRoutes] = useState<DashboardRoute[]>(() =>
    (data?.trips ?? []).map((trip) => adaptTrip(trip, routeNameMap))
  )

  const dashboardStats: DashboardStat[] = useMemo(() => {
    const totalStudentsOnBus = localRoutes.reduce(
      (sum: number, route: DashboardRoute) => sum + route.studentsOnBus,
      0
    )
    const totalStudentsNotMarked = localRoutes.reduce(
      (sum: number, route: DashboardRoute) => sum + route.studentsNotMarked,
      0
    )
    const totalBusesNeeded = localRoutes.reduce(
      (sum: number, route: DashboardRoute) => sum + route.busesNeeded,
      0
    )
    return [
      { label: 'studentsOnBus', value: totalStudentsOnBus },
      { label: 'studentsNotMarked', value: totalStudentsNotMarked },
      { label: 'busesNeeded', value: totalBusesNeeded },
    ]
  }, [localRoutes])

  const filteredRoutes = useMemo(() => {
    return localRoutes.filter((route: DashboardRoute) => {
      const matchesStatusFilter =
        selectedFilter === 'all' || route.status === selectedFilter
      const matchesRouteFilter =
        selectedRoute === 'all' || route.id === selectedRoute
      const matchesSearch =
        searchQuery === '' ||
        route.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatusFilter && matchesRouteFilter && matchesSearch
    })
  }, [localRoutes, selectedFilter, selectedRoute, searchQuery])

  const filterButtons = useMemo(
    () => [
      { key: 'all', label: t('allRoutes'), count: localRoutes.length },
      {
        key: 'pending',
        label: t('pendingOrders'),
        count: localRoutes.filter((r: DashboardRoute) => r.status === 'pending').length,
      },
      {
        key: 'partial',
        label: t('partiallyOrdered'),
        count: localRoutes.filter((r: DashboardRoute) => r.status === 'partial').length,
      },
      {
        key: 'completed',
        label: t('fullyOrdered'),
        count: localRoutes.filter((r: DashboardRoute) => r.status === 'completed')
          .length,
      },
    ],
    [localRoutes, t]
  )

  const routeFilterButtons = useMemo(() => {
    const uniqueRoutes = [
      ...new Set(localRoutes.map((route: DashboardRoute) => route.id)),
    ]
    return [
      { key: 'all', label: t('allRoutes'), count: localRoutes.length },
      ...uniqueRoutes.map(routeId => ({
        key: routeId,
        label:
          localRoutes.find((r: DashboardRoute) => r.id === routeId)?.name || routeId,
        count: localRoutes.filter((r: DashboardRoute) => r.id === routeId).length,
      })),
    ]
  }, [localRoutes, t])

  const handleOrderBuses = async (routeId: string, busesToOrder: number) => {
    let newOrdered = 0
    setRoutes((prevRoutes: DashboardRoute[]) =>
      prevRoutes.map((route: DashboardRoute) => {
        if (route.id === routeId) {
          newOrdered = Math.min(
            route.busesOrdered + busesToOrder,
            route.busesNeeded
          )
          const newStatus =
            newOrdered === 0
              ? 'pending'
              : newOrdered === route.busesNeeded
                ? 'completed'
                : 'partial'
          return {
            ...route,
            busesOrdered: newOrdered,
            status: newStatus,
            lastUpdate: {
              _seconds: dayjs().unix(),
              _nanoseconds: 0,
            },
          }
        }
        return route
      })
    )
    await setTripBuses(routeId, { buses: newOrdered })
    router.refresh()
  }

  const getStatusColor = (status: DashboardRoute['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-900 border-emerald-200'
      case 'partial':
        return 'bg-amber-50 text-amber-900 border-amber-200'
      case 'pending':
        return 'bg-red-50 text-red-900 border-red-200'
      default:
        return 'bg-gray-50 text-gray-900 border-gray-200'
    }
  }
  const getStatusText = (status: DashboardRoute['status']): string => {
    switch (status) {
      case 'completed':
        return t('fullyOrdered')
      case 'partial':
        return t('partiallyOrdered')
      case 'pending':
        return t('pendingOrder')
      default:
        return t('unknown')
    }
  }

  function getLatestUpdate(
    routes: DashboardRoute[],
    noUpdatesText: string
  ): string {
    if (!routes || routes.length === 0) {
      return noUpdatesText
    }

    const latestRoute = routes.reduce((latest, current) => {
      const latestTime = dayjs.unix(latest.lastUpdate._seconds).add(latest.lastUpdate._nanoseconds / 1e9, 'second')
      const currentTime = dayjs.unix(current.lastUpdate._seconds).add(current.lastUpdate._nanoseconds / 1e9, 'second')
      return currentTime.isAfter(latestTime) ? current : latest
    })

    if (!latestRoute) {
      return noUpdatesText
    }

    return dayjs
      .unix(latestRoute.lastUpdate._seconds)
      .add(latestRoute.lastUpdate._nanoseconds / 1e9, 'second')
      .format('YYYY-MM-DD HH:mm:ss')
  }

  return (
    <div className='bg-gray-50'>
      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Header
          lastUpdated={getLatestUpdate(localRoutes, t('noUpdatesYet'))}
        />
        <Stats stats={dashboardStats} />
        <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <RouteFilters
              filterButtons={filterButtons}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              routeFilterButtons={routeFilterButtons}
              selectedRoute={selectedRoute}
              setSelectedRoute={setSelectedRoute}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          <div className='hidden lg:block'>
            <RouteTable
              routes={filteredRoutes}
              routeNameMap={routeNameMap}
              onOrderBuses={handleOrderBuses}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
            />
          </div>
          <RouteMobileCards
            routes={filteredRoutes}
            routeNameMap={routeNameMap}
            onOrderBuses={handleOrderBuses}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
          />
          {filteredRoutes.length === 0 && (
            <div className='text-center py-12'>
              <span className='text-gray-400 text-4xl'>–</span>
              <h3 className='mt-2 text-sm font-medium text-gray-900'>
                {t('noRoutesFound')}
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Client
