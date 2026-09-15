'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Pencil, PowerOff, RotateCcw } from 'lucide-react'
import type { FleetBus } from '@/lib/api-contracts'
import ActiveBadge from '@/components/ActiveBadge'
import { Td, Th } from '@/components/DataTable'
import type { BusLiveBadge } from './Client'
import OnRouteBadge from './OnRouteBadge'

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
					<Th>{t('fields.licensePlate')}</Th>
					<Th>{t('fields.capacity')}</Th>
					<Th>{t('fields.driverName')}</Th>
					<Th>{t('status.label')}</Th>
					<Th end>{t('actions.label')}</Th>
				</tr>
			</thead>
			<tbody>
				{buses.map(bus => (
					<tr key={bus.busId} className='border-b border-gray-100 last:border-0 hover:bg-blue-50/50'>
						<Td>
							<Link
								href={`/buses/${bus.busId}`}
								className='text-sm font-semibold text-gray-900 hover:text-blue-700'
							>
								{bus.licensePlate}
							</Link>
							{bus.notes && <div className='text-xs text-gray-500'>{bus.notes}</div>}
						</Td>
						<Td className='text-sm whitespace-nowrap text-gray-700 tabular-nums'>
							{bus.capacity}
						</Td>
						<Td className='text-sm whitespace-nowrap text-gray-700'>
							{bus.driverName ?? '—'}
						</Td>
						<Td>
							<div className='flex flex-wrap items-center gap-1.5'>
								<ActiveBadge
									active={bus.isActive}
									activeLabel={t('status.active')}
									inactiveLabel={t('status.inactive')}
								/>
								{liveByBus[bus.busId]?.onRoute && (
									<OnRouteBadge label={t('status.onRoute')} />
								)}
							</div>
						</Td>
						<Td>
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
						</Td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
