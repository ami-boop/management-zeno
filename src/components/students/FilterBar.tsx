'use client'

import { useTranslations } from 'next-intl'
import type { ManagementFacetEntry } from '@/lib/api-contracts'

export type StatusFilter = 'all' | 'submitted' | 'notMarked' | 'friendPending'

export interface FilterState {
	route: string
	parallel: string
	classId: string
	megama: string
	stop: string
	time: string
	status: StatusFilter
	search: string
}

export const EMPTY_FILTERS: FilterState = {
	route: 'all',
	parallel: 'all',
	classId: 'all',
	megama: 'all',
	stop: 'all',
	time: 'all',
	status: 'all',
	search: '',
}

interface FilterBarProps {
	filters: FilterState
	onUpdate: (patch: Partial<FilterState>) => void
	onResetAdvanced: () => void
	routeOptions: ManagementFacetEntry[]
	parallelOptions: ManagementFacetEntry[]
	visibleClasses: ManagementFacetEntry[]
	megamaOptions: ManagementFacetEntry[]
	stopOptions: ManagementFacetEntry[]
	timeOptions: ManagementFacetEntry[]
	routeNameMap: Record<string, string>
	counts: { total: number; submitted: number; notMarked: number; friendPending: number }
}

const selectClass =
	'rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'

/** Route chips, status chips and advanced selects for the students registry. */
export default function FilterBar({
	filters,
	onUpdate,
	onResetAdvanced,
	routeOptions,
	parallelOptions,
	visibleClasses,
	megamaOptions,
	stopOptions,
	timeOptions,
	routeNameMap,
	counts,
}: FilterBarProps) {
	const t = useTranslations('Students')

	return (
		<div className='px-6 py-4 border-b border-gray-200'>
			{/* Route Filters */}
			{routeOptions.length > 0 && (
				<div className='flex flex-wrap gap-2 mb-3'>
					<button
						onClick={() => onUpdate({ route: 'all' })}
						className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
							filters.route === 'all'
								? 'bg-blue-100 text-blue-800 border border-blue-200'
								: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
						}`}
					>
						{t('filterAll')}
						<span
							className={`ms-2 px-2 py-0.5 rounded-full text-xs tabular-nums ${
								filters.route === 'all'
									? 'bg-blue-200 text-blue-800'
									: 'bg-gray-100 text-gray-600'
							}`}
						>
							{counts.total}
						</span>
					</button>
					{routeOptions.map(r => (
						<button
							key={r.id}
							onClick={() => onUpdate({ route: r.id })}
							className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
								filters.route === r.id
									? 'bg-blue-100 text-blue-800 border border-blue-200'
									: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
							}`}
						>
							{r.id === 'none' ? t('noRoute') : routeNameMap[r.id] ?? r.id}
							<span
								className={`ms-2 px-2 py-0.5 rounded-full text-xs tabular-nums ${
									filters.route === r.id
										? 'bg-blue-200 text-blue-800'
										: 'bg-gray-100 text-gray-600'
								}`}
							>
								{r.count}
							</span>
						</button>
					))}
				</div>
			)}

			{/* Status Filters */}
			<div className='flex flex-wrap gap-2 mb-3'>
				{(
					[
						{ key: 'all' as StatusFilter, label: t('statusAll'), count: counts.submitted + counts.notMarked },
						{ key: 'submitted' as StatusFilter, label: t('statusSubmitted'), count: counts.submitted },
						{ key: 'notMarked' as StatusFilter, label: t('statusNotMarked'), count: counts.notMarked },
						{ key: 'friendPending' as StatusFilter, label: t('statusFriendPending'), count: counts.friendPending },
					] as const
				).map(filter => (
					<button
						key={filter.key}
						onClick={() => onUpdate({ status: filter.key })}
						className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
							filters.status === filter.key
								? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
								: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
						}`}
					>
						{filter.label}
						<span
							className={`ms-2 px-2 py-0.5 rounded-full text-xs tabular-nums ${
								filters.status === filter.key
									? 'bg-emerald-100 text-emerald-800'
									: 'bg-gray-100 text-gray-600'
							}`}
						>
							{filter.count}
						</span>
					</button>
				))}
			</div>

			{/* Advanced Filters: parallel / class / megama / stop / time */}
			<div className='flex flex-wrap items-center gap-2'>
				<span className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
					{t('filters')}:
				</span>
				<select
					aria-label={t('filterParallel')}
					value={filters.parallel}
					onChange={e => onUpdate({ parallel: e.target.value, classId: 'all' })}
					className={`${selectClass} max-w-[180px]`}
				>
					<option value='all'>{t('parallelAll')}</option>
					{parallelOptions.map(p => (
						<option key={p.id} value={p.id}>
							{p.id === 'none' ? t('noClass') : p.label} ({p.count})
						</option>
					))}
				</select>
				<select
					aria-label={t('filterClass')}
					value={filters.classId}
					onChange={e => onUpdate({ classId: e.target.value })}
					className={`${selectClass} max-w-[180px]`}
				>
					<option value='all'>{t('classAll')}</option>
					{visibleClasses.map(c => (
						<option key={c.id} value={c.id}>
							{c.id === 'none' ? t('noClass') : c.label} ({c.count})
						</option>
					))}
				</select>
				{megamaOptions.length > 0 && (
					<select
						aria-label={t('filterMegama')}
						value={filters.megama}
						onChange={e => onUpdate({ megama: e.target.value })}
						className={`${selectClass} max-w-[180px]`}
					>
						<option value='all'>{t('megamaAll')}</option>
						{megamaOptions.map(m => (
							<option key={m.id} value={m.id}>
								{m.label} ({m.count})
							</option>
						))}
					</select>
				)}
				<select
					aria-label={t('filterStop')}
					value={filters.stop}
					onChange={e => onUpdate({ stop: e.target.value })}
					className={selectClass}
				>
					<option value='all'>{t('stopAll')}</option>
					{stopOptions.map(s => (
						<option key={s.id} value={s.id}>
							{s.id === 'none' ? t('noStop') : s.id} ({s.count})
						</option>
					))}
				</select>
				<select
					aria-label={t('filterTime')}
					value={filters.time}
					onChange={e => onUpdate({ time: e.target.value })}
					className={selectClass}
				>
					<option value='all'>{t('timeAll')}</option>
					{timeOptions.map(tm => (
						<option key={tm.id} value={tm.id}>
							{tm.id === 'none' ? t('noTime') : tm.id} ({tm.count})
						</option>
					))}
				</select>
				{(filters.parallel !== 'all' ||
					filters.classId !== 'all' ||
					filters.megama !== 'all' ||
					filters.stop !== 'all' ||
					filters.time !== 'all') && (
					<button
						type='button'
						onClick={onResetAdvanced}
						className='text-sm font-medium text-gray-500 hover:text-gray-700 underline underline-offset-2'
					>
						{t('resetFilters')}
					</button>
				)}
			</div>
		</div>
	)
}
