'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useSearchFilter } from '@/hooks/useSearchFilter'
import { Bus, List, Map as MapIcon } from 'lucide-react'
import type { BusLiveTrip, FleetBus } from '@/lib/api-contracts'
import { updateBus } from '@/app/actions/buses'
import SearchInput from '@/components/SearchInput'
import ErrorBanner from '@/components/ErrorBanner'
import EmptyState from '@/components/EmptyState'
import BusDialog, { type BusFormValues } from './BusDialog'
import FleetMap from './FleetMap'
import MobileCards from './MobileCards'
import Table from './Table'

export interface BusLiveBadge {
	onRoute: boolean
	routeName: string | null
}

interface BusesClientProps {
	initialBuses: FleetBus[] | null
	initialLiveByBus: Record<string, BusLiveBadge>
	initialTrips: BusLiveTrip[]
}

export default function Client({ initialBuses, initialLiveByBus, initialTrips }: BusesClientProps) {
	const t = useTranslations('Fleet')
	const router = useRouter()
	const [buses, setBuses] = useState<FleetBus[] | null>(initialBuses)
	const [liveByBus, setLiveByBus] = useState<Record<string, BusLiveBadge>>(initialLiveByBus)
	const [trips, setTrips] = useState<BusLiveTrip[]>(initialTrips)
	const [view, setView] = useState<'list' | 'map'>('list')
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

	// Sync live trips for the map tab with refreshed server props.
	useEffect(() => {
		setTrips(initialTrips)
	}, [initialTrips])

	// Sync the registry with refreshed server props so polling picks up
	// changes made in other sessions. Skipped while a row action is busy
	// to protect the optimistic update.
	useEffect(() => {
		if (busyBusId) return
		setBuses(initialBuses)
	}, [initialBuses, busyBusId])

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

			<SearchInput
				value={search}
				onChange={setSearch}
				placeholder={t('searchPlaceholder')}
			/>

			<div className='mb-4 inline-flex rounded-xl border border-gray-200 bg-white p-1' role='tablist'>
				<button
					type='button'
					role='tab'
					aria-selected={view === 'list'}
					onClick={() => setView('list')}
					className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${
						view === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
					}`}
				>
					<List className='h-4 w-4' />
					{t('tabs.list')}
				</button>
				<button
					type='button'
					role='tab'
					aria-selected={view === 'map'}
					onClick={() => setView('map')}
					className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${
						view === 'map' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
					}`}
				>
					<MapIcon className='h-4 w-4' />
					{t('tabs.map')}
				</button>
			</div>

			{actionError && <p className='mb-3 text-sm text-red-600'>{t('errors.actionFailed')}</p>}

			{view === 'map' ? (
				<FleetMap trips={trips} buses={buses} />
			) : (
				<>
			{filtered === null ? (
				<ErrorBanner message={t('errors.loadFailed')} />
			) : filtered.length === 0 ? (
				<EmptyState message={search ? t('noResults') : t('noBuses')} />
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
				</>
			)}

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