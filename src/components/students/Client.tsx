'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	RefreshCw,
	AlertCircle,
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
import FilterBar, { EMPTY_FILTERS, type FilterState } from './FilterBar'
import SearchInput from '@/components/SearchInput'
import ErrorBanner from '@/components/ErrorBanner'
import { PAGE_SIZE } from '@/utils/constants'

interface StudentsClientProps {
	initial: ManagementStudentsResponse
	routeNameMap: Record<string, string>
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
					<ErrorBanner
						message={t('loadError')}
						onRetry={() => void fetchPage(filters, currentPage)}
						retryLabel={t('retry')}
					/>
				)}

				{/* Main Content */}
				<div className='bg-white rounded-lg shadow-sm border border-gray-200'>
					<div className='px-6 py-4 border-b border-gray-200'>
						<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4'>
							<h2 className='text-xl font-semibold text-gray-900'>{t('title')}</h2>
							<SearchInput
								value={filters.search}
								onChange={value => updateFilters({ search: value })}
								placeholder={t('searchPlaceholder')}
								wrapperClassName='relative max-w-md w-full sm:w-80'
								inputClassName='block w-full ps-9 pe-3 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
							/>
						</div>
					</div>

					<FilterBar
						filters={filters}
						onUpdate={updateFilters}
						onResetAdvanced={resetAdvancedFilters}
						routeOptions={routeOptions}
						parallelOptions={parallelOptions}
						visibleClasses={visibleClasses}
						megamaOptions={megamaOptions}
						stopOptions={stopOptions}
						timeOptions={timeOptions}
						routeNameMap={routeNameMap}
						counts={{
							total: effectiveMeta.total,
							submitted: effectiveMeta.counts.submitted,
							notMarked: effectiveMeta.counts.notMarked,
							friendPending: effectiveMeta.counts.friendPending,
						}}
					/>

					{/* Bulk Actions */}
					{selectedUids.length > 0 && (
						<div className='flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3 mx-6 my-3'>
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