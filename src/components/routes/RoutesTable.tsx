'use client'

import type { Route } from '@/types/routes'
import { Bus, CheckCircle, Ban, Wrench } from 'lucide-react'

interface RoutesTableProps {
	routes: Route[]
	t: (key: string) => string
}

const statusIcon = {
	active: <CheckCircle className='w-4 h-4 text-emerald-500 inline' />,
	inactive: <Ban className='w-4 h-4 text-gray-400 inline' />,
	maintenance: <Wrench className='w-4 h-4 text-amber-500 inline' />,
}

export default function RoutesTable({ routes, t }: RoutesTableProps) {
	return (
		<div className='hidden md:flex px-4 py-3 overflow-hidden rounded-xl border border-[#dbe1e6] bg-white'>
			<table className='w-full'>
				<thead>
					<tr>
						<th className='px-4 py-3 text-left text-sm font-medium'>
							{t('headers.routeName')}
						</th>
						<th className='px-4 py-3 text-left text-sm font-medium'>
							{t('headers.stops')}
						</th>
						<th className='px-4 py-3 text-left text-sm font-medium'>
							{t('headers.bus')}
						</th>
						<th className='px-4 py-3 text-left text-sm font-medium'>
							{t('headers.status')}
						</th>
						<th className='px-4 py-3 text-left text-sm font-medium'>
							{t('headers.actions')}
						</th>
					</tr>
				</thead>
				<tbody>
					{routes.length > 0 ? (
						routes.map(route => (
							<tr key={route.id} className='border-t'>
								<td className='px-4 py-3 text-sm'>{route.name}</td>
								<td className='px-4 py-3 text-sm text-[#617989]'>
									{route.stops}
								</td>
								<td className='px-4 py-3 text-sm text-[#617989] flex items-center gap-2'>
									<Bus className='w-4 h-4' />
									{route.bus}
								</td>
								<td className='px-4 py-3 text-sm'>
									<span className='inline-flex items-center gap-1'>
										{statusIcon[route.status]}
										{t(`status.${route.status}`)}
									</span>
								</td>
								<td className='px-4 py-3 text-sm font-bold text-[#617989] hover:text-blue-600 cursor-pointer'>
									{t('view')}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td
								colSpan={5}
								className='px-4 py-8 text-center text-[#617989] text-sm'
							>
								{t('noRoutes')}
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}
