'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ChevronRight, MapPin, Users } from 'lucide-react'
import type { RouteItem } from '@/lib/api-contracts'

interface RoutesMobileCardsProps {
	routes: RouteItem[]
}

function RoutesMobileCards({ routes }: RoutesMobileCardsProps) {
	const t = useTranslations('Routes')

	return (
		<div className='md:hidden px-4 py-4 space-y-3'>
			{routes.map(route => (
				<Link
					key={route.routeId}
					href={`/routes/${route.routeId}`}
					className='flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl p-4 transition-colors hover:bg-blue-50/50'
				>
					<div className='min-w-0'>
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
					<ChevronRight className='h-5 w-5 shrink-0 text-gray-300' />
				</Link>
			))}
		</div>
	)
}

export default RoutesMobileCards
