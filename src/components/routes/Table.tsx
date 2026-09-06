'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ChevronRight, MapPin, Users } from 'lucide-react'
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
					<th className='w-10 px-2 py-3' aria-hidden />
				</tr>
			</thead>
			<tbody>
				{routes.map(route => (
					<tr
						key={route.routeId}
						className='group cursor-pointer border-b border-gray-100 last:border-0 hover:bg-blue-50/50 transition-colors duration-150'
					>
						<td className='px-6 py-4'>
							<Link href={`/routes/${route.routeId}`} className='block'>
								<div className='text-sm font-semibold text-gray-900 group-hover:text-blue-700'>
									{route.name}
								</div>
								<div className='text-xs text-gray-500 font-mono'>{route.routeId}</div>
							</Link>
						</td>
						<td className='px-6 py-4 whitespace-nowrap'>
							<Link href={`/routes/${route.routeId}`} className='flex items-center gap-1.5 text-sm text-gray-700'>
								<MapPin className='h-4 w-4 text-gray-400' />
								<span className='tabular-nums'>{route.stops}</span>
							</Link>
						</td>
						<td className='px-6 py-4 whitespace-nowrap'>
							<Link href={`/routes/${route.routeId}`} className='flex items-center gap-1.5 text-sm text-gray-700'>
								<Users className='h-4 w-4 text-gray-400' />
								<span className='tabular-nums'>{route.students}</span>
							</Link>
						</td>
						<td className='px-2 py-4'>
							<ChevronRight className='h-4 w-4 text-gray-300 group-hover:text-blue-500' />
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
