'use client'

import type { Bus } from './DashboardClient'

interface BusMobileCardsProps {
	buses: Bus[]
	t: (key: string) => string
}

export default function BusMobileCards({ buses, t }: BusMobileCardsProps) {
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
		<div className='lg:hidden divide-y divide-gray-200'>
			{buses.map(bus => (
				<div key={bus.id} className='p-6'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='text-lg font-medium text-gray-900'>{bus.id}</h3>
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
					</div>
					<div className='grid grid-cols-2 gap-4 mb-4'>
						<div>
							<dt className='text-sm font-medium text-gray-500'>
								{t('columns.route')}
							</dt>
							<dd className='text-sm text-gray-900'>{bus.route}</dd>
						</div>
						<div>
							<dt className='text-sm font-medium text-gray-500'>
								{t('columns.driver')}
							</dt>
							<dd className='text-sm text-gray-900'>{bus.driver}</dd>
						</div>
					</div>
					<div className='mb-4'>
						<div className='flex justify-between text-sm mb-2'>
							<span className='font-medium text-gray-500'>
								{t('columns.students')}
							</span>
							<span className='text-gray-900'>
								{bus.students}/{bus.capacity} (
								{Math.round((bus.students / bus.capacity) * 100)}%)
							</span>
						</div>
						<div className='w-full bg-gray-200 rounded-full h-2'>
							<div
								className='bg-blue-600 h-2 rounded-full transition-all duration-300'
								style={{ width: `${(bus.students / bus.capacity) * 100}%` }}
							></div>
						</div>
					</div>
					<div className='text-sm text-gray-500'>
						{t('lastUpdated')}: {bus.lastUpdate}
					</div>
				</div>
			))}
		</div>
	)
}
