'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Pencil, PowerOff, RotateCcw } from 'lucide-react'
import type { FleetBus } from '@/lib/api-contracts'
import ActiveBadge from '@/components/ActiveBadge'
import type { BusLiveBadge } from './Client'
import OnRouteBadge from './OnRouteBadge'

interface BusesMobileCardsProps {
	buses: FleetBus[]
	liveByBus: Record<string, BusLiveBadge>
	busyBusId: string | null
	onEdit: (bus: FleetBus) => void
	onToggleActive: (bus: FleetBus) => void
}

export default function MobileCards({
	buses,
	liveByBus,
	busyBusId,
	onEdit,
	onToggleActive,
}: BusesMobileCardsProps) {
	const t = useTranslations('Fleet')

	return (
		<>
			{buses.map(bus => (
				<div key={bus.busId} className='rounded-xl border border-gray-200 bg-white p-4'>
					<div className='mb-2 flex items-start justify-between gap-2'>
						<div>
							<Link
								href={`/buses/${bus.busId}`}
								className='text-sm font-semibold text-gray-900 hover:text-blue-700'
							>
								{bus.licensePlate}
							</Link>
							{bus.notes && <div className='text-xs text-gray-500'>{bus.notes}</div>}
						</div>
						<div className='flex flex-col items-end gap-1.5'>
							<ActiveBadge
								active={bus.isActive}
								activeLabel={t('status.active')}
								inactiveLabel={t('status.inactive')}
							/>
							{liveByBus[bus.busId]?.onRoute && (
								<OnRouteBadge label={t('status.onRoute')} />
							)}
						</div>
					</div>
					<div className='mb-3 grid grid-cols-2 gap-2 text-sm text-gray-700'>
						<div>
							<span className='text-xs text-gray-500'>{t('fields.capacity')}: </span>
							<span className='tabular-nums'>{bus.capacity}</span>
						</div>
						<div>
							<span className='text-xs text-gray-500'>{t('fields.driverName')}: </span>
							{bus.driverName ?? '—'}
						</div>
						{bus.driverPhone && (
							<div className='col-span-2'>
								<span className='text-xs text-gray-500'>{t('fields.driverPhone')}: </span>
								{bus.driverPhone}
							</div>
						)}
					</div>
					<div className='flex items-center gap-1 border-t border-gray-100 pt-2'>
						<button
							className='inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700'
							onClick={() => onEdit(bus)}
						>
							<Pencil className='h-3.5 w-3.5' />
							{t('actions.edit')}
						</button>
						<button
							className='inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40'
							disabled={busyBusId === bus.busId}
							onClick={() => onToggleActive(bus)}
						>
							{bus.isActive ? (
								<>
									<PowerOff className='h-3.5 w-3.5' />
									{t('actions.deactivate')}
								</>
							) : (
								<>
									<RotateCcw className='h-3.5 w-3.5' />
									{t('actions.activate')}
								</>
							)}
						</button>
					</div>
				</div>
			))}
		</>
	)
}
