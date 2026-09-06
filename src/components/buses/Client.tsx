'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useSearchFilter } from '@/hooks/useSearchFilter'
import { AlertCircle, Bus, Search } from 'lucide-react'
import type { FleetBus } from '@/lib/api-contracts'
import { updateBus } from '@/app/actions/buses'
import BusDialog, { type BusFormValues } from './BusDialog'
import MobileCards from './MobileCards'
import Table from './Table'

export interface BusLiveBadge {
	onRoute: boolean
	routeName: string | null
}

interface BusesClientProps {
	initialBuses: FleetBus[] | null
	initialLiveByBus: Record<string, BusLiveBadge>
}

export default function Client({ initialBuses, initialLiveByBus }: BusesClientProps) {
	const t = useTranslations('Fleet')
	const router = useRouter()
	const [buses, setBuses] = useState<FleetBus[] | null>(initialBuses)
	const [liveByBus, setLiveByBus] = useState<Record<string, BusLiveBadge>>(initialLiveByBus)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editingBus, setEditingBus] = useState<FleetBus | null>(null)
	const [busyBusId, setBusyBusId] = useState<string | null>(null)
	const [actionError, setActionError] = useState(false)

	const { filtered, search, setSearch } = useSearchFilter(buses, {
		searchFields: ['licensePlate', 'driverName', 'notes'],
	})

	// Live "on route" badges refresh with the RSC tree.
	useEffect(() => {
		const interval = setInterval(() => router.refresh(), 30_000)
		return () => clearInterval(interval)
	}, [router])

	// Sync badges with refreshed server props (initialLiveByBus changes every refresh).
	useEffect(() => {
		setLiveByBus(initialLiveByBus)
	}, [initialLiveByBus])

	function applyCreated(busId: string, values: BusFormValues) {
		setBuses(prev =>
			[...(prev ?? []), { busId, isActive: true, ...values }].sort((a, b) =>
				a.licensePlate.localeCompare(b.licensePlate)
			)
		)
	}

	function applyEdited(busId: string, values: BusFormValues) {
		setBuses(prev =>
			prev
				? prev.map(item =>
						item.busId === busId
							? { ...item, ...values, capacity: values.capacity }
							: item
					)
				: prev
		)
	}

	async function toggleActive(bus: FleetBus) {
		setBusyBusId(bus.busId)
		setActionError(false)
		const result = await updateBus(bus.busId, { isActive: !bus.isActive })
		setBusyBusId(null)
		if (!result.ok) {
			setActionError(true)
			return
		}
		setBuses(prev =>
			prev
				? prev.map(item =>
						item.busId === bus.busId ? { ...item, isActive: !bus.isActive } : item
					)
				: prev
		)
	}

	const active = buses?.filter(bus => bus.isActive) ?? []
	const totalCapacity = active.reduce((sum, bus) => sum + bus.capacity, 0)

	return (
		<div className='mx-auto max-w-5xl px-4 py-8'>
			<div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>{t('title')}</h1>
					<p className='text-sm text-gray-500'>
						{t('stats.active', { active: active.length, total: buses?.length ?? 0 })} ·{' '}
						{t('stats.capacity', { capacity: totalCapacity })}
					</p>
				</div>
				<button
					className='inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
					onClick={() => {
						setEditingBus(null)
						setDialogOpen(true)
					}}
				>
					<Bus className='h-4 w-4' />
					{t('actions.add')}
				</button>
			</div>

			<div className='relative mb-4'>
				<Search className='pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
				<input
					className='w-full rounded-xl border border-gray-300 bg-white py-2 pe-3 ps-9 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none'
					placeholder={t('searchPlaceholder')}
					value={search}
					onChange={event => setSearch(event.target.value)}
				/>
			</div>

			{actionError && <p className='mb-3 text-sm text-red-600'>{t('errors.actionFailed')}</p>}

			{filtered === null ? (
				<div className='mb-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
					<AlertCircle className='h-4 w-4 shrink-0' />
					{t('errors.loadFailed')}
				</div>
			) : filtered.length === 0 ? (
				<p className='rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500'>
					{search ? t('noResults') : t('noBuses')}
				</p>
			) : null}

			<div className='hidden rounded-xl border border-gray-200 bg-white md:block'>
				<Table
					buses={filtered ?? []}
					liveByBus={liveByBus}
					busyBusId={busyBusId}
					onEdit={bus => {
						setEditingBus(bus)
						setDialogOpen(true)
					}}
					onToggleActive={toggleActive}
				/>
			</div>
			<div className='grid gap-3 md:hidden'>
				<MobileCards
					buses={filtered ?? []}
					liveByBus={liveByBus}
					busyBusId={busyBusId}
					onEdit={bus => {
						setEditingBus(bus)
						setDialogOpen(true)
					}}
					onToggleActive={toggleActive}
				/>
			</div>

			<BusDialog
				open={dialogOpen}
				bus={editingBus}
				onClose={() => setDialogOpen(false)}
				onCreated={applyCreated}
				onEdited={applyEdited}
			/>
		</div>
	)
}