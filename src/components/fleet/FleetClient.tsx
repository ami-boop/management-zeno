'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Download, Plus } from 'lucide-react'
import type {
	BusData,
	FleetStats as FleetStatsType,
	FilterOption,
	SortField,
	SortOrder,
} from '@/types/fleet'
import FleetStats from './FleetStats'
import FleetFilters from './FleetFilters'
import FleetTable from './FleetTable'
import FleetMobileCards from './FleetMobileCards'

interface FleetClientProps {
	busData: BusData[]
}

export default function FleetClient({ busData }: FleetClientProps) {
	const t = useTranslations('Fleet')
	const [searchQuery, setSearchQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [sortBy, setSortBy] = useState<SortField>('busNumber')
	const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

	// Статистика
	const stats = useMemo((): FleetStatsType => {
		const inService = busData.filter(bus => bus.status === 'inService').length
		const maintenance = busData.filter(
			bus => bus.status === 'maintenance'
		).length
		const outOfService = busData.filter(
			bus => bus.status === 'outOfService'
		).length
		const totalCapacity = busData.reduce((sum, bus) => sum + bus.capacity, 0)
		const avgCapacity = Math.round(totalCapacity / busData.length)

		return { inService, maintenance, outOfService, totalCapacity, avgCapacity }
	}, [busData])

	// Фильтрация и сортировка
	const filtered = useMemo(() => {
		const filtered = busData.filter(bus => {
			const query = searchQuery.toLowerCase()
			const matchesSearch =
				bus.busNumber.toLowerCase().includes(query) ||
				bus.model.toLowerCase().includes(query) ||
				bus.location.toLowerCase().includes(query) ||
				bus.driver.toLowerCase().includes(query) ||
				bus.capacity.toString().includes(query)

			const matchesStatus =
				statusFilter === 'all' || bus.status === statusFilter

			return matchesSearch && matchesStatus
		})

		// Сортировка
		filtered.sort((a, b) => {
			let aVal: string | number, bVal: string | number
			switch (sortBy) {
				case 'busNumber':
					aVal = a.busNumber
					bVal = b.busNumber
					break
				case 'model':
					aVal = a.model
					bVal = b.model
					break
				case 'capacity':
					aVal = a.capacity
					bVal = b.capacity
					break
				case 'status':
					aVal = a.status
					bVal = b.status
					break
				default:
					aVal = a.busNumber
					bVal = b.busNumber
			}

			if (typeof aVal === 'number' && typeof bVal === 'number') {
				return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
			} else {
				const aStr = String(aVal)
				const bStr = String(bVal)
				return sortOrder === 'asc'
					? aStr.localeCompare(bStr)
					: bStr.localeCompare(aStr)
			}
		})

		return filtered
	}, [busData, searchQuery, statusFilter, sortBy, sortOrder])

	const filterOptions: FilterOption[] = [
		{ key: 'all', label: t('filterAll'), count: busData.length },
		{
			key: 'inService',
			label: t('filterInService'),
			count: stats.inService,
		},
		{
			key: 'maintenance',
			label: t('filterMaintenance'),
			count: stats.maintenance,
		},
		{
			key: 'outOfService',
			label: t('filterOutOfService'),
			count: stats.outOfService,
		},
	]

	const handleSort = (field: SortField) => {
		if (sortBy === field) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
		} else {
			setSortBy(field)
			setSortOrder('asc')
		}
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Header */}
				<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
					<div>
						<h1 className='text-3xl font-bold text-gray-900 mb-2'>
							{t('title')}
						</h1>
						<p className='text-gray-600'>
							{filtered.length} {t('vehicleCount')} • {stats.totalCapacity}{' '}
							total seats
						</p>
					</div>
					<div className='flex gap-3'>
						<button className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
							<Download className='-ml-1 mr-2 h-4 w-4' />
							{t('exportData')}
						</button>
						<button className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
							<Plus className='-ml-1 mr-2 h-4 w-4' />
							{t('addBus')}
						</button>
					</div>
				</div>

				{/* Stats Cards */}
				<FleetStats stats={stats} t={t} />

				{/* Filters and Search */}
				<FleetFilters
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					statusFilter={statusFilter}
					setStatusFilter={setStatusFilter}
					sortBy={sortBy}
					setSortBy={setSortBy}
					sortOrder={sortOrder}
					setSortOrder={setSortOrder}
					filterOptions={filterOptions}
					t={t}
				/>

				{/* Table and Mobile Cards */}
				<div className='bg-white rounded-lg shadow-sm border border-gray-200'>
					<FleetTable
						buses={filtered}
						sortBy={sortBy}
						sortOrder={sortOrder}
						onSort={handleSort}
						t={t}
					/>
					<FleetMobileCards buses={filtered} t={t} />
				</div>
			</div>
		</div>
	)
}
