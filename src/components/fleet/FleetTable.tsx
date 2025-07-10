'use client'

import { ChevronUp, ChevronDown, FileText } from 'lucide-react'
import type { BusData, SortField, SortOrder } from '@/types/fleet'

interface FleetTableProps {
	buses: BusData[]
	sortBy: SortField
	sortOrder: SortOrder
	onSort: (field: SortField) => void
	t: (key: string) => string
}

export default function FleetTable({
	buses,
	sortBy,
	sortOrder,
	onSort,
	t,
}: FleetTableProps) {
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

	const SortIcon = ({ field }: { field: SortField }) => {
		if (sortBy !== field) return null
		return sortOrder === 'desc' ? (
			<ChevronDown className='ml-1 w-3 h-3' />
		) : (
			<ChevronUp className='ml-1 w-3 h-3' />
		)
	}

	return (
		<div className='hidden lg:block overflow-hidden'>
			<table className='min-w-full divide-y divide-gray-200'>
				<thead className='bg-gray-50'>
					<tr>
						<th
							className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
							onClick={() => onSort('busNumber')}
						>
							<div className='flex items-center'>
								{t('headers.busNumber')}
								<SortIcon field='busNumber' />
							</div>
						</th>
						<th
							className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
							onClick={() => onSort('model')}
						>
							<div className='flex items-center'>
								{t('headers.model')}
								<SortIcon field='model' />
							</div>
						</th>
						<th
							className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
							onClick={() => onSort('capacity')}
						>
							<div className='flex items-center'>
								{t('headers.capacity')}
								<SortIcon field='capacity' />
							</div>
						</th>
						<th
							className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
							onClick={() => onSort('status')}
						>
							<div className='flex items-center'>
								{t('headers.status')}
								<SortIcon field='status' />
							</div>
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							{t('headers.location')}
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							{t('headers.maintenance')}
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							{t('headers.driver')}
						</th>
					</tr>
				</thead>
				<tbody className='bg-white divide-y divide-gray-200'>
					{buses.length > 0 ? (
						buses.map((bus, index) => (
							<tr
								key={index}
								className='hover:bg-gray-50 transition-colors duration-150'
							>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
									{bus.busNumber}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
									{bus.model}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
									{bus.capacity} seats
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
								<td className='px-6 py-4 text-sm text-gray-700 max-w-xs truncate'>
									{bus.location}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
									{bus.maintenanceDue}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
									{bus.driver}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan={7} className='px-6 py-12 text-center'>
								<FileText className='mx-auto h-12 w-12 text-gray-400' />
								<h3 className='mt-2 text-sm font-medium text-gray-900'>
									{t('noResults')}
								</h3>
								<p className='mt-1 text-sm text-gray-500'>
									{t('emptyState.searchMessage')}
								</p>
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}
