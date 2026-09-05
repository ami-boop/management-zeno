'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Pencil, PowerOff, RotateCcw } from 'lucide-react'
import type { FleetBus } from '@/lib/api-contracts'
import type { BusLiveBadge } from './Client'

interface BusesTableProps {
	buses: FleetBus[]
	liveByBus: Record<string, BusLiveBadge>
	busyBusId: string | null
	onEdit: (bus: FleetBus) => void
	onToggleActive: (bus: FleetBus) => void
}

export default function Table({ buses, liveByBus, busyBusId, onEdit, onToggleActive }: BusesTableProps) {
	const t = useTranslations('Fleet')

	return (
		<table className='w-full'>
			<thead>
				<tr className='border-b border-gray-200'>
					<th className='px-6 py-3 text-start text-xs font-medium tracking-wider text-gray-500 uppercase'>
						{t('fields.licensePlate')}
					</th>
					<th className='px-6 py-3 text-start text-xs font-medium tracking-wider text-gray-500 uppercase'>
						{t('fields.capacity')}
					</th>
					<th className='px-6 py-3 text-start text-xs font-medium tracking-wider text-gray-500 uppercase'>
						{t('fields.driverName')}
					</th>
					<th className='px-6 py-3 text-start text-xs font-medium tracking-wider text-gray-500 uppercase'>
						{t('status.label')}
					</th>
					<th className='px-6 py-3 text-end text-xs font-medium tracking-wider text-gray-500 uppercase'>
						{t('actions.label')}
					</th>
				</tr>
			</thead>
			<tbody>
				{buses.map(bus => (
					<tr key={bus.busId} className='border-b border-gray-100 last:border-0 hover:bg-blue-50/50'>
						<td className='px-6 py-4'>
							<Link
								href={`/buses/${bus.busId}`}
								className='text-sm font-semibold text-gray-900 hover:text-blue-700'
							>
								{bus.licensePlate}
							</Link>
							{bus.notes && <div className='text-xs text-gray-500'>{bus.notes}</div>}
						</td>
						<td className='px-6 py-4 text-sm whitespace-nowrap text-gray-700 tabular-nums'>
							{bus.capacity}
						</td>
						<td className='px-6 py-4 text-sm whitespace-nowrap text-gray-700'>
							{bus.driverName ?? '—'}
						</td>
						<td className='px-6 py-4'>
							<div className='flex flex-wrap items-center gap-1.5'>
								<span
									className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
										bus.isActive
											? 'bg-green-100 text-green-700'
											: 'bg-gray-100 text-gray-500'
									}`}
								>
									{bus.isActive ? t('status.active') : t('status.inactive')}
								</span>
								{liveByBus[bus.busId]?.onRoute && (
									<span className='inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700'>
										<span className='relative flex h-1.5 w-1.5'>
											<span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75' />
											<span className='relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500' />
										</span>
										{t('status.onRoute')}
									</span>
								)}
							</div>
						</td>
						<td className='px-6 py-4'>
							<div className='flex items-center justify-end gap-1'>
								<button
									className='rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-700'
									title={t('actions.edit')}
									onClick={() => onEdit(bus)}
								>
									<Pencil className='h-4 w-4' />
								</button>
								<button
									className='rounded-lg p-2 text-gray-500 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40'
									title={bus.isActive ? t('actions.deactivate') : t('actions.activate')}
									disabled={busyBusId === bus.busId}
									onClick={() => onToggleActive(bus)}
								>
									{bus.isActive ? (
										<PowerOff className='h-4 w-4' />
									) : (
										<RotateCcw className='h-4 w-4' />
									)}
								</button>
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
