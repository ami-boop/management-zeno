'use client'

import type { Route } from '@/types/routes'
import { CheckCircle, Ban, Wrench } from 'lucide-react'

interface RoutesMobileCardsProps {
	routes: Route[]
	t: (key: string) => string
}

const statusIcon = {
	active: <CheckCircle className='w-4 h-4 text-emerald-500 inline' />,
	inactive: <Ban className='w-4 h-4 text-gray-400 inline' />,
	maintenance: <Wrench className='w-4 h-4 text-amber-500 inline' />,
}

function RoutesMobileCards({ routes, t }: RoutesMobileCardsProps) {
	return (
		<div className='md:hidden px-4 py-3 space-y-4'>
			{routes.length > 0 ? (
				routes.map(route => (
					<div
						key={route.id}
						className='bg-white border border-[#dbe1e6] rounded-xl p-4 space-y-3'
					>
						<div className='flex justify-between items-start'>
							<div>
								<h3 className='text-lg font-semibold'>{route.name}</h3>
								<p className='text-sm text-[#617989]'>
									{route.stops} {t('headers.stops')} •{' '}
								</p>
							</div>
							<span className='h-8 px-4 bg-[#f0f3f4] text-[#111518] text-sm font-medium rounded-full inline-flex items-center gap-1'>
								{statusIcon[route.status]}
								{t(`status.${route.status}`)}
							</span>
						</div>
						<div className='flex justify-between items-center pt-2 border-t border-[#dbe1e6]'>
							<button className='text-sm font-bold text-[#617989] hover:text-blue-600'>
								{t('view')}
							</button>
						</div>
					</div>
				))
			) : (
				<div className='bg-white border border-[#dbe1e6] rounded-xl p-8 text-center'>
					<p className='text-[#617989] text-sm'>{t('noRoutes')}</p>
				</div>
			)}
		</div>
	)
}

export default RoutesMobileCards
