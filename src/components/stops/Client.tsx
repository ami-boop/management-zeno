'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { AlertCircle, MapPin, Pencil, PowerOff, RotateCcw, Search } from 'lucide-react'
import type { StopDetail, StopFormValues } from '@/lib/api-contracts'
import { updateStop } from '@/app/actions/stops'
import StopDialog from './StopDialog'
import { useSearchFilter } from '@/hooks/useSearchFilter'

interface StopsClientProps {
	initialStops: StopDetail[] | null
}

export default function Client({ initialStops }: StopsClientProps) {
	const t = useTranslations('Stops')
	const [stops, setStops] = useState<StopDetail[] | null>(initialStops)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editingStop, setEditingStop] = useState<StopDetail | null>(null)
	const [busyStopId, setBusyStopId] = useState<string | null>(null)
	const [actionError, setActionError] = useState(false)

	const { filtered, search, setSearch } = useSearchFilter(stops, {
		searchFields: ['name', 'address'],
	})

	function applyCreated(stopId: string, values: StopFormValues) {
		setStops(prev =>
			[...(prev ?? []), { stopId, isActive: true, type: null, ...values }].sort((a, b) =>
				a.name.localeCompare(b.name)
			)
		)
	}

	function applyEdited(stopId: string, values: StopFormValues) {
		setStops(prev =>
			prev
				? prev.map(item => (item.stopId === stopId ? { ...item, ...values } : item))
				: prev
		)
	}

	async function toggleActive(stop: StopDetail) {
		setBusyStopId(stop.stopId)
		setActionError(false)
		const result = await updateStop(stop.stopId, { isActive: !stop.isActive })
		setBusyStopId(null)
		if (!result.ok) {
			setActionError(true)
			return
		}
		setStops(prev =>
			prev
				? prev.map(item =>
						item.stopId === stop.stopId ? { ...item, isActive: !stop.isActive } : item
					)
				: prev
		)
	}

	const activeCount = stops?.filter(stop => stop.isActive).length ?? 0

	return (
		<div className='mx-auto max-w-5xl px-4 py-8'>
			<div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>{t('title')}</h1>
					<p className='text-sm text-gray-500'>
						{t('stats.active', { active: activeCount, total: stops?.length ?? 0 })}
					</p>
				</div>
				<button
					className='inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
					onClick={() => {
						setEditingStop(null)
						setDialogOpen(true)
					}}
				>
					<MapPin className='h-4 w-4' />
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
					{search ? t('noResults') : t('noStops')}
				</p>
			) : null}

			<div className='grid gap-3'>
				{(filtered ?? []).map(stop => (
					<div
						key={stop.stopId}
						className={`rounded-xl border bg-white p-4 ${
							stop.isActive ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
						}`}
					>
						<div className='mb-2 flex flex-wrap items-start justify-between gap-2'>
							<div>
								<Link
									href={`/stops/${stop.stopId}`}
									className='text-sm font-semibold text-gray-900 hover:text-blue-700'
								>
									{stop.name}
								</Link>
								<div className='text-xs text-gray-500 font-mono'>{stop.stopId}</div>
							</div>
							<span
								className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
									stop.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
								}`}
							>
								{stop.isActive ? t('status.active') : t('status.inactive')}
							</span>
						</div>
						<div className='mb-3 text-sm text-gray-700'>
							{stop.address && <div>{stop.address}</div>}
							{stop.lat != null && stop.lng != null && (
								<div className='text-xs text-gray-500 tabular-nums'>
									{stop.lat.toFixed(5)}, {stop.lng.toFixed(5)}
								</div>
							)}
						</div>
						<div className='flex items-center gap-1 border-t border-gray-100 pt-2'>
							<button
								className='inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700'
								onClick={() => {
									setEditingStop(stop)
									setDialogOpen(true)
								}}
							>
								<Pencil className='h-3.5 w-3.5' />
								{t('actions.edit')}
							</button>
							<button
								className='inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40'
								disabled={busyStopId === stop.stopId}
								onClick={() => toggleActive(stop)}
							>
								{stop.isActive ? (
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
			</div>

			<StopDialog
				open={dialogOpen}
				stop={editingStop}
				onClose={() => setDialogOpen(false)}
				onCreated={applyCreated}
				onEdited={applyEdited}
			/>
		</div>
	)
}