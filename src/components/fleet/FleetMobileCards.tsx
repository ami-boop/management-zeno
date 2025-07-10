'use client'

import { FileText } from 'lucide-react'
import type { BusData } from '@/types/fleet'

interface FleetMobileCardsProps {
	buses: BusData[]
	t: (key: string) => string
}

export default function FleetMobileCards({ buses, t }: FleetMobileCardsProps) {
	const getStatusColor = (status: BusData['status']) => {
		switch (status) {
			case 'inService':
				return 'bg-emerald-50 text-emerald-900 border-emerald-200'
			case 'maintenance':
				return 'bg-amber-50 text-amber-900 border-amber-200'
			case 'outOfService':
				return 'bg-red-50 text-red-900 border-red-200'
			default:
				return 'bg-gray-50 text-gray-900 border-gray-200'
		}
	}

	const getStatusDot = (status: BusData['status']) => {
		switch (status) {
			case 'inService':
				return 'bg-emerald-500'
			case 'maintenance':
				return 'bg-amber-500'
			case 'outOfService':
				return 'bg-red-500'
			default:
				return 'bg-gray-500'
		}
	}

	return (
		<div className='lg:hidden divide-y divide-gray-200'>
			{buses.length > 0 ? (
				buses.map((bus, index) => (
					<div key={index} className='p-6'>
						<div className='flex items-center justify-between mb-4'>
							<h3 className='text-lg font-medium text-gray-900'>
								{bus.busNumber}
							</h3>
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
									{t('headers.model')}
								</dt>
								<dd className='text-sm text-gray-900'>{bus.model}</dd>
							</div>
							<div>
								<dt className='text-sm font-medium text-gray-500'>
									{t('headers.capacity')}
								</dt>
								<dd className='text-sm text-gray-900'>{bus.capacity} seats</dd>
							</div>
							<div>
								<dt className='text-sm font-medium text-gray-500'>
									{t('headers.driver')}
								</dt>
								<dd className='text-sm text-gray-900'>{bus.driver}</dd>
							</div>
							<div>
								<dt className='text-sm font-medium text-gray-500'>
									{t('headers.maintenance')}
								</dt>
								<dd className='text-sm text-gray-900'>{bus.maintenanceDue}</dd>
							</div>
						</div>

						<div>
							<dt className='text-sm font-medium text-gray-500'>
								{t('headers.location')}
							</dt>
							<dd className='text-sm text-gray-900'>{bus.location}</dd>
						</div>
					</div>
				))
			) : (
				<div className='p-12 text-center'>
					<FileText className='mx-auto h-12 w-12 text-gray-400' />
					<h3 className='mt-2 text-sm font-medium text-gray-900'>
						{t('noResults')}
					</h3>
					<p className='mt-1 text-sm text-gray-500'>
						{t('emptyState.searchMessage')}
					</p>
				</div>
			)}
		</div>
	)
}
