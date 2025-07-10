'use client'

import { Search, ChevronUp, ChevronDown } from 'lucide-react'
import type { FilterOption, SortField, SortOrder } from '@/types/fleet'

interface FleetFiltersProps {
	searchQuery: string
	setSearchQuery: (query: string) => void
	statusFilter: string
	setStatusFilter: (filter: string) => void
	sortBy: SortField
	setSortBy: (field: SortField) => void
	sortOrder: SortOrder
	setSortOrder: (order: SortOrder) => void
	filterOptions: FilterOption[]
	t: (key: string) => string
}

export default function FleetFilters({
	searchQuery,
	setSearchQuery,
	statusFilter,
	setStatusFilter,
	sortBy,
	setSortBy,
	sortOrder,
	setSortOrder,
	filterOptions,
	t,
}: FleetFiltersProps) {
	return (
		<div className='bg-white rounded-lg shadow-sm border border-gray-200 mb-6'>
			<div className='p-6 border-b border-gray-200'>
				<div className='flex flex-col lg:flex-row gap-4'>
					{/* Search */}
					<div className='flex-1'>
						<div className='relative'>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<Search className='h-4 w-4 text-gray-400' />
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

					{/* Sort */}
					<div className='flex items-center gap-2'>
						<span className='text-sm text-gray-700 whitespace-nowrap'>
							{t('sortBy')}:
						</span>
						<select
							value={sortBy}
							onChange={e => setSortBy(e.target.value as SortField)}
							className='block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
						>
							<option value='busNumber'>{t('sortByNumber')}</option>
							<option value='model'>{t('sortByModel')}</option>
							<option value='capacity'>{t('sortByCapacity')}</option>
							<option value='status'>{t('sortByStatus')}</option>
						</select>
						<button
							onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
							className='p-2 text-gray-400 hover:text-gray-600 focus:outline-none'
						>
							{sortOrder === 'desc' ? (
								<ChevronDown className='w-4 h-4' />
							) : (
								<ChevronUp className='w-4 h-4' />
							)}
						</button>
					</div>
				</div>

				{/* Filter Buttons */}
				<div className='flex flex-wrap gap-2 mt-4'>
					{filterOptions.map(filter => (
						<button
							key={filter.key}
							onClick={() => setStatusFilter(filter.key)}
							className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
								statusFilter === filter.key
									? 'bg-blue-100 text-blue-800 border border-blue-200'
									: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
							}`}
						>
							{filter.label}
							<span
								className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
									statusFilter === filter.key
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
		</div>
	)
}
