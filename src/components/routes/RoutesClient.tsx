'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Plus, Search, ListChecks } from 'lucide-react'
import type { Route } from '@/types/routes'
import RoutesTable from './RoutesTable'
import RoutesMobileCards from './RoutesMobileCards'

interface RoutesClientProps {
	routes: Route[]
}

export default function RoutesClient({ routes }: RoutesClientProps) {
	const t = useTranslations('Routes')
	const [searchQuery, setSearchQuery] = useState('')

	const filteredRoutes = useMemo(() => {
		return routes.filter(route =>
			route.name.toLowerCase().includes(searchQuery.toLowerCase())
		)
	}, [routes, searchQuery])

	return (
		<div className='min-h-screen bg-white'>
			<div className='max-w-4xl mx-auto px-4 sm:px-8 py-8'>
				<div className='flex flex-col sm:flex-row justify-between gap-3 mb-6'>
					<h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
						<ListChecks className='w-6 h-6 text-blue-600' />
						{t('title')}
					</h1>
					<button className='inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700'>
						<Plus className='w-4 h-4' />
						{t('addRoute')}
					</button>
				</div>

				<div className='mb-6'>
					<div className='relative'>
						<span className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
							<Search className='h-4 w-4 text-gray-400' />
						</span>
						<input
							type='text'
							placeholder={t('searchPlaceholder')}
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
							className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
						/>
					</div>
				</div>

				<RoutesTable routes={filteredRoutes} t={t} />
				<RoutesMobileCards routes={filteredRoutes} t={t} />
			</div>
		</div>
	)
}
