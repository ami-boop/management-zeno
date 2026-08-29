'use client'

import { useTranslations } from 'next-intl'
import { MapPin, Users } from 'lucide-react'
import type { RouteItem } from '@/lib/api-contracts'

interface RoutesTableProps {
	routes: RouteItem[]
}

export default function RoutesTable({ routes }: RoutesTableProps) {
	const t = useTranslations('Routes')

	return (
		<table className='w-full'>
			<thead>
				<tr className='border-b border-gray-200'>
					<th className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('headers.routeName')}
					</th>
					<th className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('headers.stops')}
					</th>
					<th className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('headers.students')}
					</th>
				</tr>
			</thead>
			<tbody>
				{routes.map(route => (
					<tr key={route.routeId} className='hover:bg-gray-50 transition-colors duration-150'>
						<td className='px-6 py-4'>
							<div>
								<div className='text-sm font-semibold text-gray-900'>{route.name}</div>
								<div className='text-xs text-gray-500 font-mono'>{route.routeId}</div>
							</div>
						</td>
						<td className='px-6 py-4 whitespace-nowrap'>
							<span className='inline-flex items-center gap-1.5 text-sm text-gray-700'>
								<MapPin className='h-4 w-4 text-gray-400' />
								<span className='tabular-nums'>{route.stops}</span>
							</span>
						</td>
						<td className='px-6 py-4 whitespace-nowrap'>
							<span className='inline-flex items-center gap-1.5 text-sm text-gray-700'>
								<Users className='h-4 w-4 text-gray-400' />
								<span className='tabular-nums'>{route.students}</span>
							</span>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
