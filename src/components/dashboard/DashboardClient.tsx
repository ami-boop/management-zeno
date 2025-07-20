'use client'
import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import DashboardHeader from './DashboardHeader'
import DashboardStats from './DashboardStats'
import DashboardRouteFilters from './DashboardRouteFilters'
import DashboardRouteTable from './DashboardRouteTable'
import DashboardRouteMobileCards from './DashboardRouteMobileCards'

interface DashboardStat {
	label: string
	value: number
	change?: string
}

interface Route {
	id: string
	name: string
	studentsOnBus: number
	studentsNotMarked: number
	totalStudents: number
	busesNeeded: number
	busesOrdered: number
	status: 'pending' | 'partial' | 'completed'
	lastUpdate: string
	estimatedTime: string
}

interface DashboardClientProps {
	routes: Route[]
}

const DashboardClient = ({ routes }: DashboardClientProps) => {
	const t = useTranslations('Dashboard')
	const [selectedFilter, setSelectedFilter] = useState<string>('all')
	const [selectedRoute, setSelectedRoute] = useState<string>('all')
	const [searchQuery, setSearchQuery] = useState<string>('')
	const [localRoutes, setRoutes] = useState<Route[]>(routes)

	const dashboardStats: DashboardStat[] = useMemo(() => {
		const totalStudentsOnBus = localRoutes.reduce(
			(sum: number, route: Route) => sum + route.studentsOnBus,
			0
		)
		const totalStudentsNotMarked = localRoutes.reduce(
			(sum: number, route: Route) => sum + route.studentsNotMarked,
			0
		)
		const totalBusesNeeded = localRoutes.reduce(
			(sum: number, route: Route) => sum + route.busesNeeded,
			0
		)
		return [
			{ label: 'studentsOnBus', value: totalStudentsOnBus },
			{ label: 'studentsNotMarked', value: totalStudentsNotMarked },
			{ label: 'busesNeeded', value: totalBusesNeeded },
		]
	}, [localRoutes])

	const filteredRoutes = useMemo(() => {
		return localRoutes.filter((route: Route) => {
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
				count: localRoutes.filter((r: Route) => r.status === 'pending').length,
			},
			{
				key: 'partial',
				label: t('partiallyOrdered'),
				count: localRoutes.filter((r: Route) => r.status === 'partial').length,
			},
			{
				key: 'completed',
				label: t('fullyOrdered'),
				count: localRoutes.filter((r: Route) => r.status === 'completed')
					.length,
			},
		],
		[localRoutes, t]
	)

	const routeFilterButtons = useMemo(() => {
		const uniqueRoutes = [
			...new Set(localRoutes.map((route: Route) => route.id)),
		]
		return [
			{ key: 'all', label: t('allRoutes'), count: localRoutes.length },
			...uniqueRoutes.map(routeId => ({
				key: routeId,
				label:
					localRoutes.find((r: Route) => r.id === routeId)?.name || routeId,
				count: localRoutes.filter((r: Route) => r.id === routeId).length,
			})),
		]
	}, [localRoutes, t])

	const handleOrderBuses = (routeId: string, busesToOrder: number) => {
		setRoutes((prevRoutes: Route[]) =>
			prevRoutes.map((route: Route) => {
				if (route.id === routeId) {
					const newBusesOrdered = Math.min(
						route.busesOrdered + busesToOrder,
						route.busesNeeded
					)
					const newStatus =
						newBusesOrdered === 0
							? 'pending'
							: newBusesOrdered === route.busesNeeded
							? 'completed'
							: 'partial'
					return {
						...route,
						busesOrdered: newBusesOrdered,
						status: newStatus,
						lastUpdate: new Date().toLocaleTimeString('en-GB', {
							hour: '2-digit',
							minute: '2-digit',
						}),
					}
				}
				return route
			})
		)
	}

	const getStatusColor = (status: Route['status']) => {
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
	const getStatusDot = (status: Route['status']) => {
		switch (status) {
			case 'completed':
				return 'bg-emerald-500'
			case 'partial':
				return 'bg-amber-500'
			case 'pending':
				return 'bg-red-500'
			default:
				return 'bg-gray-500'
		}
	}
	const getStatusText = (status: Route['status']) => {
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

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<DashboardHeader
					title={t('title')}
					description={t('description')}
					systemStatus={t('systemStatus')}
				/>
				<DashboardStats stats={dashboardStats} />
				<div className='bg-white rounded-lg shadow-sm border border-gray-200'>
					<div className='px-6 py-4 border-b border-gray-200'>
						<DashboardRouteFilters
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
						<DashboardRouteTable
							routes={filteredRoutes}
							onOrderBuses={handleOrderBuses}
							getStatusColor={getStatusColor}
							getStatusDot={getStatusDot}
							getStatusText={getStatusText}
						/>
					</div>
					<DashboardRouteMobileCards
						routes={filteredRoutes}
						onOrderBuses={handleOrderBuses}
						getStatusColor={getStatusColor}
						getStatusDot={getStatusDot}
						getStatusText={getStatusText}
					/>
					{filteredRoutes.length === 0 && (
						<div className='text-center py-12'>
							<span className='text-gray-400 text-4xl'>–</span>
							<h3 className='mt-2 text-sm font-medium text-gray-900'>
								{t('noRoutesFound')}
							</h3>
							<p className='mt-1 text-sm text-gray-500'>
								{t('tryAdjustingSearch')}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default DashboardClient
