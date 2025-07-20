import { FC } from 'react'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface FilterButton {
	key: string
	label: string
	count: number
}

interface DashboardRouteFiltersProps {
	filterButtons: FilterButton[]
	selectedFilter: string
	setSelectedFilter: (key: string) => void
	routeFilterButtons: FilterButton[]
	selectedRoute: string
	setSelectedRoute: (key: string) => void
	searchQuery: string
	setSearchQuery: (q: string) => void
}

const DashboardRouteFilters: FC<DashboardRouteFiltersProps> = ({
	filterButtons,
	selectedFilter,
	setSelectedFilter,
	routeFilterButtons,
	selectedRoute,
	setSelectedRoute,
	searchQuery,
	setSearchQuery,
}) => {
	const t = useTranslations('Dashboard')
	return (
		<>
			{/* Search */}
			<div className='relative max-w-md mb-4'>
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
			{/* Status Filters */}
			<div className='mb-4'>
				<div className='flex items-center mb-2'>
					<span className='text-sm font-medium text-gray-700 mr-3'>
						{t('filterByStatus')}
					</span>
				</div>
				<div className='flex flex-wrap gap-2'>
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
			{/* Route Filters */}
			<div className='mb-4'>
				<div className='flex items-center mb-2'>
					<span className='text-sm font-medium text-gray-700 mr-3'>
						{t('filterByRoute')}
					</span>
				</div>
				<div className='flex flex-wrap gap-2'>
					{routeFilterButtons.map(filter => (
						<button
							key={filter.key}
							onClick={() => setSelectedRoute(filter.key)}
							className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
								selectedRoute === filter.key
									? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
									: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
							}`}
						>
							{filter.label}
							<span
								className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
									selectedRoute === filter.key
										? 'bg-emerald-200 text-emerald-800'
										: 'bg-gray-100 text-gray-600'
								}`}
							>
								{filter.count}
							</span>
						</button>
					))}
				</div>
			</div>
		</>
	)
}

export default DashboardRouteFilters
