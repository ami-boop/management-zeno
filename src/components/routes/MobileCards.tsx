'use client'

import { useTranslations } from 'next-intl'
import { MapPin, Users } from 'lucide-react'
import type { RouteItem } from '@/lib/api-contracts'

interface RoutesMobileCardsProps {
	routes: RouteItem[]
}

function RoutesMobileCards({ routes }: RoutesMobileCardsProps) {
	const t = useTranslations('Routes')

	return (
		<div className='md:hidden px-4 py-4 space-y-3'>
			{routes.map(route => (
				<div
					key={route.routeId}
					className='bg-white border border-gray-200 rounded-xl p-4'
				>
					<h3 className='text-base font-semibold text-gray-900'>{route.name}</h3>
					<p className='text-xs text-gray-500 font-mono mb-3'>{route.routeId}</p>
					<div className='flex items-center gap-4 text-sm text-gray-600'>
						<span className='inline-flex items-center gap-1.5'>
							<MapPin className='h-4 w-4 text-gray-400' />
							<span className='tabular-nums'>{route.stops}</span>
							{t('headers.stops')}
						</span>
						<span className='inline-flex items-center gap-1.5'>
							<Users className='h-4 w-4 text-gray-400' />
							<span className='tabular-nums'>{route.students}</span>
							{t('headers.students')}
						</span>
					</div>
				</div>
			))}
		</div>
	)
}

export default RoutesMobileCards
