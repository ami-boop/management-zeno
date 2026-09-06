'use client'

import { useTranslations } from 'next-intl'
import { useSearchFilter } from '@/hooks/useSearchFilter'
import { AlertCircle, Info, ListChecks, RefreshCw, Search } from 'lucide-react'
import type { RouteItem } from '@/lib/api-contracts'
import Table from './Table'
import MobileCards from './MobileCards'

interface RoutesClientProps {
	routes: RouteItem[] | null
}

export default function Client({ routes }: RoutesClientProps) {
	const t = useTranslations('Routes')

	const { filtered, search, setSearch } = useSearchFilter(routes, {
		searchFields: ['name', 'routeId'],
	})

	const filteredRoutes = filtered ?? []

	if (routes === null) {
		return (
			<div className='bg-gray-50'>
				<div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8'>
					<div className='flex flex-col items-center justify-center py-24 text-center'>
						<div className='text-center'>
							<AlertCircle className='h-10 w-10 text-red-400 mb-4' />
							<h2 className='text-lg font-semibold text-gray-900 mb-1'>{t('loadError')}</h2>
							<p className='text-sm text-gray-500 mb-6'>{t('loadErrorHint')}</p>
							<button
								type='button'
								onClick={() => window.location.reload()}
								className='inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
							>
								<RefreshCw className='h-4 w-4' />
								{t('retry')}
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='bg-gray-50'>
			<div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Header */}
				<div className='mb-8'>
					<h1 className='text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2'>
						<ListChecks className='h-7 w-7 text-blue-600' />
						{t('title')}
					</h1>
					<div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm'>
						<Info className='h-4 w-4' />
						{t('readOnlyHint')}
					</div>
				</div>

				{/* Main Content */}
				<div className='bg-white rounded-lg shadow-sm border border-gray-200'>
					<div className='px-6 py-4 border-b border-gray-200'>
						<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
							<h2 className='text-xl font-semibold text-gray-900'>{t('title')}</h2>
							<div className='relative max-w-md w-full sm:w-80'>
								<Search className='absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
								<input
									type='text'
									placeholder={t('searchPlaceholder')}
									value={search}
									onChange={e => setSearch(e.target.value)}
									className='block w-full ps-9 pe-3 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
								/>
							</div>
						</div>
					</div>

					{/* Desktop Table */}
					<div className='hidden md:block overflow-x-auto'>
						<Table routes={filteredRoutes} />
					</div>

					{/* Mobile Cards */}
					<MobileCards routes={filteredRoutes} />

					{filteredRoutes.length === 0 && (
						<div className='text-center py-12'>
							<h3 className='mt-2 text-sm font-medium text-gray-900'>{t('noResults')}</h3>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}