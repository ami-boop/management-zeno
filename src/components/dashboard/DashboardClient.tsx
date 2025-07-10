'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import BusTable from './BusTable'
import BusMobileCards from './BusMobileCards'

interface DashboardStat {
	label: string
	value: number
	change: string
}

export interface Bus {
	id: string
	route: string
	driver: string
	status: 'inTransit' | 'atSchool' | 'maintenance'
	students: number
	capacity: number
	lastUpdate: string
}

interface DashboardClientProps {
	dashboardStats: DashboardStat[]
	busData: Bus[]
}

export default function DashboardClient({
	dashboardStats,
	busData,
}: DashboardClientProps) {
	const t = useTranslations('Dashboard')
	const [selectedFilter, setSelectedFilter] = useState<string>('all')
	const [searchQuery, setSearchQuery] = useState<string>('')

	const filteredBuses = useMemo(() => {
		return busData.filter(bus => {
			const matchesFilter =
				selectedFilter === 'all' || bus.status === selectedFilter
			const matchesSearch =
				searchQuery === '' ||
				bus.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
				bus.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
				bus.driver.toLowerCase().includes(searchQuery.toLowerCase())
			return matchesFilter && matchesSearch
		})
	}, [busData, selectedFilter, searchQuery])

	const filterButtons = [
		{ key: 'all', label: t('filterAll'), count: busData.length },
		{
			key: 'inTransit',
			label: t('filterInTransit'),
			count: busData.filter(b => b.status === 'inTransit').length,
		},
		{
			key: 'atSchool',
			label: t('filterAtSchool'),
			count: busData.filter(b => b.status === 'atSchool').length,
		},
		{
			key: 'maintenance',
			label: t('filterMaintenance'),
			count: busData.filter(b => b.status === 'maintenance').length,
		},
	]

	const getStatusColor = (status: Bus['status']) => {
		switch (status) {
			case 'inTransit':
				return 'bg-emerald-50 text-emerald-900 border-emerald-200'
			case 'atSchool':
				return 'bg-blue-50 text-blue-900 border-blue-200'
			case 'maintenance':
				return 'bg-amber-50 text-amber-900 border-amber-200'
			default:
				return 'bg-gray-50 text-gray-900 border-gray-200'
		}
	}

	const getStatusDot = (status: Bus['status']) => {
		switch (status) {
			case 'inTransit':
				return 'bg-emerald-500'
			case 'atSchool':
				return 'bg-blue-500'
			case 'maintenance':
				return 'bg-amber-500'
			default:
				return 'bg-gray-500'
		}
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Header */}
				<div className='mb-8'>
					<div className='flex items-center justify-between'>
						<div>
							<h1 className='text-3xl font-bold text-gray-900 mb-2'>
								{t('title')}
							</h1>
							<p className='text-gray-600 text-base'>{t('description')}</p>
						</div>
						<div className='flex items-center space-x-4'>
							<div className='flex items-center text-sm text-gray-600'>
								<div className='w-2 h-2 bg-green-500 rounded-full mr-2'></div>
								{t('systemStatus')}
							</div>
							<div className='text-sm text-gray-500'>
								{t('lastUpdated')}: 14:25
							</div>
						</div>
					</div>
				</div>

				{/* Stats Grid */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
					{dashboardStats.map(stat => (
						<div
							key={stat.label}
							className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200'
						>
							<div className='flex items-center justify-between mb-4'>
								<h3 className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
									{t(`stats.${stat.label}`)}
								</h3>
							</div>
							<div className='flex items-baseline'>
								<p className='text-3xl font-bold text-gray-900'>{stat.value}</p>
							</div>
							<p className='text-sm text-gray-500 mt-2'>{stat.change}</p>
						</div>
					))}
				</div>

				{/* Fleet Status Section */}
				<div className='bg-white rounded-lg shadow-sm border border-gray-200'>
					<div className='px-6 py-4 border-b border-gray-200'>
						<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
							<h2 className='text-xl font-semibold text-gray-900'>
								{t('busStatus')}
							</h2>

							{/* Search */}
							<div className='relative max-w-md'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<svg
										className='h-4 w-4 text-gray-400'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
										/>
									</svg>
								</div>
								<input
									type='text'
									placeholder={t('searchPlaceholder')}
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
									className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
								/>
							</div>
						</div>

						{/* Filters */}
						<div className='flex flex-wrap gap-2 mt-4'>
							{filterButtons.map(filter => (
								<button
									key={filter.key}
									onClick={() => setSelectedFilter(filter.key)}
									className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
										selectedFilter === filter.key
											? 'bg-blue-100 text-blue-800 border border-blue-200'
											: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
									}`}
								>
									{filter.label}
									<span
										className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
											selectedFilter === filter.key
												? 'bg-blue-200 text-blue-800'
												: 'bg-gray-100 text-gray-600'
										}`}
									>
										{filter.count}
									</span>
								</button>
							))}
						</div>
					</div>

					{/* Desktop Table */}
					<div className='hidden lg:block overflow-hidden'>
						<BusTable buses={filteredBuses} t={t} />
					</div>

					{/* Mobile Cards */}
					<BusMobileCards buses={filteredBuses} t={t} />

					{filteredBuses.length === 0 && (
						<div className='text-center py-12'>
							<svg
								className='mx-auto h-12 w-12 text-gray-400'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={1}
									d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
								/>
							</svg>
							<h3 className='mt-2 text-sm font-medium text-gray-900'>
								{t('noVehiclesFound')}
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
