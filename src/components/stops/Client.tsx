'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { MapPin } from 'lucide-react'
import type { StopDetail, StopFormValues } from '@/lib/api-contracts'
import { updateStop } from '@/app/actions/stops'
import ActiveBadge from '@/components/ActiveBadge'
import EmptyState from '@/components/EmptyState'
import EntityActions from '@/components/EntityActions'
import ErrorBanner from '@/components/ErrorBanner'
import SearchInput from '@/components/SearchInput'
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

			<SearchInput
				value={search}
				onChange={setSearch}
				placeholder={t('searchPlaceholder')}
			/>

			{actionError && <p className='mb-3 text-sm text-red-600'>{t('errors.actionFailed')}</p>}

			{filtered === null ? (
				<ErrorBanner message={t('errors.loadFailed')} />
			) : filtered.length === 0 ? (
				<EmptyState message={search ? t('noResults') : t('noStops')} />
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
							<ActiveBadge
								active={stop.isActive}
								activeLabel={t('status.active')}
								inactiveLabel={t('status.inactive')}
							/>
						</div>
						<div className='mb-3 text-sm text-gray-700'>
							{stop.address && <div>{stop.address}</div>}
							{stop.lat != null && stop.lng != null && (
								<div className='text-xs text-gray-500 tabular-nums'>
									{stop.lat.toFixed(5)}, {stop.lng.toFixed(5)}
								</div>
							)}
						</div>
						<EntityActions
							onEdit={() => {
								setEditingStop(stop)
								setDialogOpen(true)
							}}
							onToggle={() => toggleActive(stop)}
							active={stop.isActive}
							busy={busyStopId === stop.stopId}
							editLabel={t('actions.edit')}
							deactivateLabel={t('actions.deactivate')}
							activateLabel={t('actions.activate')}
						/>
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