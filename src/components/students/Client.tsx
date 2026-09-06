'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
	AlertCircle,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	RefreshCw,
	Search,
	UserPlus,
} from 'lucide-react'
import type {
	ManagementStudent,
	ManagementStudentsMeta,
	ManagementStudentsResponse,
} from '@/lib/api-contracts'
import getManagementStudents, {
	type StudentsQuery,
} from '@/app/actions/getManagementStudents'
import Table from './Table'
import MobileCards from './MobileCards'
import { PAGE_SIZE } from '@/utils/constants'

type StatusFilter = 'all' | 'submitted' | 'notMarked' | 'friendPending'

interface StudentsClientProps {
	initial: ManagementStudentsResponse
	routeNameMap: Record<string, string>
}

interface FilterState {
	route: string
	parallel: string
	classId: string
	megama: string
	stop: string
	time: string
	status: StatusFilter
	search: string
}

const EMPTY_FILTERS: FilterState = {
	route: 'all',
	parallel: 'all',
	classId: 'all',
	megama: 'all',
	stop: 'all',
	time: 'all',
	status: 'all',
	search: '',
}

export default function StudentsClient({ initial, routeNameMap }: StudentsClientProps) {
	const t = useTranslations('Students')
	const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)
	const [page, setPage] = useState(1)
	const [data, setData] = useState<ManagementStudentsResponse>(initial)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const requestSeq = useRef(0)
	const firstRun = useRef(true)

	const meta = data.meta
	const students = data.students

	const fetchPage = useCallback(
		async (filterState: FilterState, currentPage: number) => {
			const seq = ++requestSeq.current
			setLoading(true)
			setError(false)
			const query: StudentsQuery = {
				routeId: filterState.route,
				parallel: filterState.parallel,
				classId: filterState.classId,
				megamaId: filterState.megama,
				stopId: filterState.stop,
				status: filterState.status,
				search: filterState.search,
				limit: PAGE_SIZE,
				offset: (currentPage - 1) * PAGE_SIZE,
			}
			const result = await getManagementStudents(query)
			if (seq !== requestSeq.current) return
			if (result.error) {
				setError(true)
			} else {
				setData(result)
			}
			setLoading(false)
		},
		[]
	)

	useEffect(() => {
		if (firstRun.current) {
			firstRun.current = false
			return
		}
		if (debounceRef.current) clearTimeout(debounceRef.current)
		debounceRef.current = setTimeout(() => {
			void fetchPage(filters, page)
		}, 250)
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current)
		}
	}, [filters, page, fetchPage])

	const updateFilters = (patch: Partial<FilterState>) => {
		setFilters(prev => ({ ...prev, ...patch }))
		setPage(1)
	}

	const resetAdvancedFilters = () =>
		updateFilters({ parallel: 'all', classId: 'all', megama: 'all', stop: 'all', time: 'all' })

	// Fallback meta when the backend response has no meta (legacy shape)
	const effectiveMeta: ManagementStudentsMeta = useMemo(() => {
		if (meta) return meta
		const count = (fn: (s: ManagementStudent) => boolean) => students.filter(fn).length
		return {
			total: students.length,
			filtered: students.length,
			counts: {
				submitted: count(s => s.today?.submitted === true),
				notMarked: count(s => s.today?.submitted !== true),
				friendPending: count(s => s.today?.friendPending === true),
			},
			facets: { routes: [], parallels: [], classes: [], megamas: [], stops: [], times: [] },
			megamasByParallel: [],
		}
	}, [meta, students])

	const totalPages = Math.max(1, Math.ceil(effectiveMeta.filtered / PAGE_SIZE))
	const currentPage = Math.min(page, totalPages)

	const stats = [
		{ key: 'totalStudents', value: effectiveMeta.counts.submitted + effectiveMeta.counts.notMarked },
		{ key: 'activeToday', value: effectiveMeta.counts.submitted },
		{ key: 'notMarked', value: effectiveMeta.counts.notMarked },
		{ key: 'friendPendingCount', value: effectiveMeta.counts.friendPending },
	]

	const parallelOptions = meta?.facets.parallels ?? []
	const classOptions = meta?.facets.classes ?? []
	const megamaOptions = (meta?.facets.megamas ?? []).filter(m => m.id !== 'none')
	const stopOptions = meta?.facets.stops ?? []
	const timeOptions = meta?.facets.times ?? []
	const routeOptions = meta?.facets.routes ?? []

	const visibleClasses =
		filters.parallel === 'all'
			? classOptions
			: classOptions.filter(c => c.id === 'none' || c.id.startsWith(`${filters.parallel}_`))

	const [selectedUids, setSelectedUids] = useState<string[]>([])
	const handleSelectStudent = (uid: string) => {
		setSelectedUids(prev =>
			prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
		)
	}
	const handleSelectAll = () => {
		if (selectedUids.length === students.length) {
			setSelectedUids([])
		} else {
			setSelectedUids(students.map(s => s.uid))
		}
	}

	return (
		<div className='bg-gray-50'>
			<div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Header */}
				<div className='mb-8 flex items-start justify-between gap-4'>
					<div>
						<h1 className='text-3xl font-bold text-gray-900 mb-2'>{t('management')}</h1>
						<p className='text-gray-600'>{t('description')}</p>
					</div>
					<button
						type='button'
						className='inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
					>
						{t('export')}
					</button>
				</div>

				{/* Stats */}
				<div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
					{stats.map(stat => (
						<div key={stat.key} className='bg-white rounded-2xl border border-gray-200 p-5'>
							<div className='flex items-center gap-2 mb-1'>
								{stat.key === 'activeToday' && (
									<CheckCircle2 className='h-4 w-4 text-emerald-600' />
								)}
								{stat.key === 'notMarked' && (
									<AlertCircle className='h-4 w-4 text-amber-600' />
								)}
								{stat.key === 'friendPendingCount' && (
									<UserPlus className='h-4 w-4 text-emerald-700' />
								)}
							</div>
							<p className='text-3xl font-bold text-gray-900 tabular-nums'>{stat.value}</p>
							<p className='mt-1 text-sm text-gray-500'>{t(stat.key)}</p>
						</div>
					))}
				</div>

				{/* Error banner */}
				{error && (
					<div className='mb-6 flex items-center justify-between gap-4 bg-red-50 border border-red-200 rounded-xl p-4'>
						<div className='flex items-center gap-2 text-sm text-red-800'>
							<AlertCircle className='h-4 w-4' />
							{t('loadError')}
						</div>
						<button
							type='button'
							onClick={() => void fetchPage(filters, currentPage)}
							className='inline-flex items-center gap-1.5 text-sm font-medium text-red-800 hover:text-red-900'
						>
							<RefreshCw className='h-4 w-4' />
							{t('retry')}
						</button>
					</div>
				)}

				{/* Main Content */}
				<div className='bg-white rounded-lg shadow-sm border border-gray-200'>
					<div className='px-6 py-4 border-b border-gray-200'>
						<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4'>
							<h2 className='text-xl font-semibold text-gray-900'>{t('title')}</h2>
							<div className='relative max-w-md w-full sm:w-80'>
								<Search className='absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
								<input
									type='text'
									placeholder={t('searchPlaceholder')}
									value={filters.search}
									onChange={e => updateFilters({ search: e.target.value })}
									className='block w-full ps-9 pe-3 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
								/>
							</div>
						</div>
					</div>

					{/* Route Filters */}
					{routeOptions.length > 0 && (
						<div className='flex flex-wrap gap-2 mb-3'>
							<button
								onClick={() => updateFilters({ route: 'all' })}
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
									{effectiveMeta.total}
								</span>
							</button>
							{routeOptions.map(r => (
								<button
									key={r.id}
									onClick={() => updateFilters({ route: r.id })}
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
								{ key: 'all' as StatusFilter, label: t('statusAll'), count: effectiveMeta.counts.submitted + effectiveMeta.counts.notMarked },
								{ key: 'submitted' as StatusFilter, label: t('statusSubmitted'), count: effectiveMeta.counts.submitted },
								{ key: 'notMarked' as StatusFilter, label: t('statusNotMarked'), count: effectiveMeta.counts.notMarked },
								{ key: 'friendPending' as StatusFilter, label: t('statusFriendPending'), count: effectiveMeta.counts.friendPending },
							] as const
						).map(filter => (
							<button
								key={filter.key}
								onClick={() => updateFilters({ status: filter.key })}
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

					{/* Advanced Filters: parallel / class / stop / time */}
					<div className='flex flex-wrap items-center gap-2'>
						<span className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
							{t('filters')}:
						</span>
						<select
							aria-label={t('filterParallel')}
							value={filters.parallel}
							onChange={e => updateFilters({ parallel: e.target.value, classId: 'all' })}
							className='rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 max-w-[180px]'
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
							onChange={e => updateFilters({ classId: e.target.value })}
							className='rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 max-w-[180px]'
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
								onChange={e => updateFilters({ megama: e.target.value })}
								className='rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 max-w-[180px]'
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
							onChange={e => updateFilters({ stop: e.target.value })}
							className='rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
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
							onChange={e => updateFilters({ time: e.target.value })}
							className='rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
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
								onClick={resetAdvancedFilters}
								className='text-sm font-medium text-gray-500 hover:text-gray-700 underline underline-offset-2'
							>
								{t('resetFilters')}
							</button>
						)}
					</div>

					{/* Bulk Actions */}
					{selectedUids.length > 0 && (
						<div className='flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3'>
							<span className='text-sm text-blue-800'>
								{selectedUids.length} {t('selected')}
							</span>
						</div>
					)}

					{/* Loading overlay */}
					{loading && (
						<div className='flex items-center justify-center py-3 bg-blue-50/50 border-b border-gray-100'>
							<RefreshCw className='h-4 w-4 text-blue-500 animate-spin' />
							<span className='ms-2 text-sm text-gray-600'>{t('loading')}</span>
						</div>
					)}

					{/* Desktop Table */}
					<div className='hidden lg:block overflow-x-auto'>
						<Table
							students={students}
							selectedStudents={selectedUids}
							onSelectStudent={handleSelectStudent}
							onSelectAll={handleSelectAll}
							routeNameMap={routeNameMap}
						/>
					</div>

					{/* Mobile Cards */}
					<MobileCards
						students={students}
						selectedStudents={selectedUids}
						onSelectStudent={handleSelectStudent}
						routeNameMap={routeNameMap}
					/>

					{students.length === 0 && !loading && (
						<div className='text-center py-12'>
							<h3 className='mt-2 text-sm font-medium text-gray-900'>{t('noResults')}</h3>
							<p className='mt-1 text-sm text-gray-500'>{t('tryAdjustingSearch')}</p>
						</div>
					)}

					{/* Pagination */}
					{effectiveMeta.filtered > 0 && (
						<div className='flex items-center justify-between px-6 py-4 border-t border-gray-200'>
							<p className='text-sm text-gray-500 tabular-nums'>
								{t('pageInfo', {
									from: (currentPage - 1) * PAGE_SIZE + 1,
									to: Math.min(currentPage * PAGE_SIZE, effectiveMeta.filtered),
									total: effectiveMeta.filtered,
								})}
							</p>
							<div className='flex items-center gap-2'>
								<button
									type='button'
									disabled={currentPage <= 1}
									onClick={() => setPage(currentPage - 1)}
									className='inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none'
								>
									<ChevronLeft className='h-4 w-4' />
									{t('previous')}
								</button>
								<span className='text-sm text-gray-600 tabular-nums px-2'>
									{currentPage} / {totalPages}
								</span>
								<button
									type='button'
									disabled={currentPage >= totalPages}
									onClick={() => setPage(currentPage + 1)}
									className='inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none'
								>
									{t('next')}
									<ChevronRight className='h-4 w-4' />
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}