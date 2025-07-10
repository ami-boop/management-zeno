'use client'
import type { Bus } from './DashboardClient'

interface BusTableProps {
	buses: Bus[]
	t: (key: string) => string
}

export default function BusTable({ buses, t }: BusTableProps) {
	const getStatusColor = (status: Bus['status']) => {
		switch (status) {
			case 'inTransit':
				return 'bg-emerald-50 text-emerald-900 border-emerald-200'
			case 'atSchool':
				return 'bg-blue-50 text-blue-900 border-blue-200'
			case 'maintenance':
				return 'bg-amber-50 text-amber-900 border-amber-200'
			default:
				return 'bg-gray-50 text-gray-900 border-gray-200'
		}
	}
	const getStatusDot = (status: Bus['status']) => {
		switch (status) {
			case 'inTransit':
				return 'bg-emerald-500'
			case 'atSchool':
				return 'bg-blue-500'
			case 'maintenance':
				return 'bg-amber-500'
			default:
				return 'bg-gray-500'
		}
	}
	return (
		<table className='min-w-full divide-y divide-gray-200'>
			<thead className='bg-gray-50'>
				<tr>
					<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('columns.busId')}
					</th>
					<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('columns.route')}
					</th>
					<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('columns.driver')}
					</th>
					<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('columns.status')}
					</th>
					<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('columns.students')}
					</th>
					<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
						{t('lastUpdated')}
					</th>
				</tr>
			</thead>
			<tbody className='bg-white divide-y divide-gray-200'>
				{buses.map(bus => (
					<tr
						key={bus.id}
						className='hover:bg-gray-50 transition-colors duration-150'
					>
						<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
							{bus.id}
						</td>
						<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
							{bus.route}
						</td>
						<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
							{bus.driver}
						</td>
						<td className='px-6 py-4 whitespace-nowrap'>
							<div
								className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
									bus.status
								)}`}
							>
								<div
									className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(
										bus.status
									)}`}
								></div>
								{t(`status.${bus.status}`)}
							</div>
						</td>
						<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
							<div className='flex items-center'>
								<div className='flex-1'>
									<div className='flex justify-between text-sm mb-1'>
										<span>
											{bus.students}/{bus.capacity}
										</span>
										<span className='text-gray-500'>
											{Math.round((bus.students / bus.capacity) * 100)}%
										</span>
									</div>
									<div className='w-full bg-gray-200 rounded-full h-1.5'>
										<div
											className='bg-blue-600 h-1.5 rounded-full transition-all duration-300'
											style={{
												width: `${(bus.students / bus.capacity) * 100}%`,
											}}
										></div>
									</div>
								</div>
							</div>
						</td>
						<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
							{bus.lastUpdate}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
