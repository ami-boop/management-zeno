'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
	AlertCircle,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Clock,
	Search,
	UserPlus,
} from 'lucide-react'
import type { ManagementStudent } from '@/lib/api-contracts'
import { GRADES } from '@/constants'
import Table from './Table'
import MobileCards from './MobileCards'

const PAGE_SIZE = 25

type StatusFilter = 'all' | 'submitted' | 'notMarked' | 'friendPending'

const parallelOfClass = (classId: string | null): string =>
	classId ? classId.replace(/_\d+$/, '') : 'none'

const parallelLabel = (key: string, t: (k: string) => string): string => {
	if (key === 'none') return t('noClass')
	return GRADES.find(g => g.key === key)?.hebrew ?? key
}

const selectClass =
	'rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 max-w-[180px]'

interface StudentsClientProps {
	students: ManagementStudent[]
	routeNameMap: Record<string, string>
}

export default function StudentsClient({ students, routeNameMap }: StudentsClientProps) {
	const t = useTranslations('Students')
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedRoute, setSelectedRoute] = useState('all')
	const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
	const [selectedParallel, setSelectedParallel] = useState('all')
	const [selectedClass, setSelectedClass] = useState('all')
	const [selectedStop, setSelectedStop] = useState('all')
	const [selectedTime, setSelectedTime] = useState('all')
	const [selectedStudents, setSelectedStudents] = useState<string[]>([])
	const [page, setPage] = useState(1)

	const routeFilters = useMemo(() => {
		const uniqueRoutes = [...new Set(students.map(s => s.routeId ?? 'none'))]
		return [
			{ key: 'all', label: t('filterAll'), count: students.length },
			...uniqueRoutes.map(routeId => ({
				key: routeId,
				label: routeId === 'none' ? t('noRoute') : routeNameMap[routeId] ?? routeId,
				count: students.filter(s => (s.routeId ?? 'none') === routeId).length,
			})),
		]
	}, [students, routeNameMap, t])

	const statusFilters = useMemo(
		() => [
			{ key: 'all' as StatusFilter, label: t('statusAll'), count: students.length },
			{
				key: 'submitted' as StatusFilter,
				label: t('statusSubmitted'),
				count: students.filter(s => s.today?.submitted).length,
			},
			{
				key: 'notMarked' as StatusFilter,
				label: t('statusNotMarked'),
				count: students.filter(s => !s.today?.submitted).length,
			},
			{
				key: 'friendPending' as StatusFilter,
				label: t('statusFriendPending'),
				count: students.filter(s => s.today?.friendPending).length,
			},
		],
		[students, t]
	)

	const parallelOptions = useMemo(() => {
		const parallels = [...new Set(students.map(s => parallelOfClass(s.classId)))]
		return [
			{ key: 'all', label: t('parallelAll') },
			...parallels.map(key => ({
				key,
				label: `${parallelLabel(key, t)} (${students.filter(s => parallelOfClass(s.classId) === key).length})`,
			})),
		]
	}, [students, t])

	const classOptions = useMemo(() => {
		const classes = [
			...new Set(
				students
					.map(s => s.classId)
					.filter((id): id is string => Boolean(id) && (selectedParallel === 'all' || parallelOfClass(id) === selectedParallel))
			),
		]
		const gradeByClass = new Map(students.map(s => [s.classId, s.grade]))
		return [
			{ key: 'all', label: t('classAll') },
			...classes
				.sort()
				.map(classId => ({
					key: classId,
					label: `${gradeByClass.get(classId) ?? classId} (${students.filter(s => s.classId === classId).length})`,
				})),
		]
	}, [students, selectedParallel, t])

	const stopOptions = useMemo(() => {
		const stops = [...new Set(students.map(s => s.stopId).filter((id): id is string => Boolean(id)))]
		return [
			{ key: 'all', label: t('stopAll') },
			...stops
				.sort()
				.map(stopId => ({
					key: stopId,
					label: `${stopId} (${students.filter(s => s.stopId === stopId).length})`,
				})),
		]
	}, [students, t])

	const timeOptions = useMemo(() => {
		const times = [
			...new Set(students.map(s => s.departureTime).filter((time): time is string => Boolean(time))),
		]
		return [
			{ key: 'all', label: t('timeAll') },
			...times
				.sort()
				.map(time => ({
					key: time,
					label: `${time} (${students.filter(s => s.departureTime === time).length})`,
				})),
		]
	}, [students, t])

	const filteredStudents = useMemo(() => {
		const query = searchQuery.toLowerCase()
		return students.filter(student => {
			const parallel = parallelOfClass(student.classId)
			const matchesRoute =
				selectedRoute === 'all' || (student.routeId ?? 'none') === selectedRoute
			const matchesParallel =
				selectedParallel === 'all' || parallel === selectedParallel
			const matchesClass =
				selectedClass === 'all' || (student.classId ?? 'none') === selectedClass
			const matchesStop =
				selectedStop === 'all' || (student.stopId ?? 'none') === selectedStop
			const matchesTime =
				selectedTime === 'all' || (student.departureTime ?? 'none') === selectedTime
			const matchesStatus =
				statusFilter === 'all' ||
				(statusFilter === 'submitted' && student.today?.submitted) ||
				(statusFilter === 'notMarked' && !student.today?.submitted) ||
				(statusFilter === 'friendPending' && student.today?.friendPending)
			const fullName = `${student.firstName} ${student.lastName}`.toLowerCase()
			const matchesSearch =
				query === '' ||
				fullName.includes(query) ||
				student.grade.toLowerCase().includes(query) ||
				(student.routeId ?? '').toLowerCase().includes(query) ||
				(student.stopId ?? '').toLowerCase().includes(query) ||
				student.guardian.toLowerCase().includes(query) ||
				student.phone.toLowerCase().includes(query)
			return (
				matchesRoute &&
				matchesParallel &&
				matchesClass &&
				matchesStop &&
				matchesTime &&
				matchesStatus &&
				matchesSearch
			)
		})
	}, [
		students,
		selectedRoute,
		selectedParallel,
		selectedClass,
		selectedStop,
		selectedTime,
		statusFilter,
		searchQuery,
	])

	const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE))
	const currentPage = Math.min(page, totalPages)
	const pageStudents = filteredStudents.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE
	)

	const stats = useMemo(
		() => [
			{ key: 'totalStudents', value: students.length },
			{ key: 'activeToday', value: students.filter(s => s.today?.submitted).length },
			{ key: 'notMarked', value: students.filter(s => !s.today?.submitted).length },
			{ key: 'friendPendingCount', value: students.filter(s => s.today?.friendPending).length },
		],
		[students]
	)

	const handleSelectStudent = (uid: string) => {
		setSelectedStudents(prev =>
			prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
		)
	}

	const handleSelectAll = () => {
		if (selectedStudents.length === pageStudents.length) {
			setSelectedStudents([])
		} else {
			setSelectedStudents(pageStudents.map(s => s.uid))
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
								<h3 className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
									{t(stat.key)}
								</h3>
							</div>
							<p className='text-3xl font-bold text-gray-900 tabular-nums'>{stat.value}</p>
						</div>
					))}
				</div>

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
									value={searchQuery}
									onChange={e => {
										setSearchQuery(e.target.value)
										setPage(1)
									}}
									className='block w-full ps-9 pe-3 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
								/>
							</div>
						</div>

						{/* Route Filters */}
						<div className='flex flex-wrap gap-2 mb-3'>
							{routeFilters.map(filter => (
								<button
									key={filter.key}
									onClick={() => {
										setSelectedRoute(filter.key)
										setPage(1)
									}}
									className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
										selectedRoute === filter.key
											? 'bg-blue-100 text-blue-800 border border-blue-200'
											: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
									}`}
								>
									{filter.label}
									<span
										className={`ms-2 px-2 py-0.5 rounded-full text-xs tabular-nums ${
											selectedRoute === filter.key
												? 'bg-blue-200 text-blue-800'
												: 'bg-gray-100 text-gray-600'
										}`}
									>
										{filter.count}
									</span>
								</button>
							))}
						</div>

						{/* Status Filters */}
						<div className='flex flex-wrap gap-2 mb-3'>
							{statusFilters.map(filter => (
								<button
									key={filter.key}
									onClick={() => {
										setStatusFilter(filter.key)
										setPage(1)
									}}
									className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
										statusFilter === filter.key
											? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
											: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
									}`}
								>
									{filter.label}
									<span
										className={`ms-2 px-2 py-0.5 rounded-full text-xs tabular-nums ${
											statusFilter === filter.key
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
								value={selectedParallel}
								onChange={e => {
									setSelectedParallel(e.target.value)
									setSelectedClass('all')
									setPage(1)
								}}
								className={selectClass}
							>
								{parallelOptions.map(option => (
									<option key={option.key} value={option.key}>
										{option.label}
									</option>
								))}
							</select>
							<select
								aria-label={t('filterClass')}
								value={selectedClass}
								onChange={e => {
									setSelectedClass(e.target.value)
									setPage(1)
								}}
								className={selectClass}
							>
								{classOptions.map(option => (
									<option key={option.key} value={option.key}>
										{option.label}
									</option>
								))}
							</select>
							<select
								aria-label={t('filterStop')}
								value={selectedStop}
								onChange={e => {
									setSelectedStop(e.target.value)
									setPage(1)
								}}
								className={selectClass}
							>
								{stopOptions.map(option => (
									<option key={option.key} value={option.key}>
										{option.label}
									</option>
								))}
							</select>
							<select
								aria-label={t('filterTime')}
								value={selectedTime}
								onChange={e => {
									setSelectedTime(e.target.value)
									setPage(1)
								}}
								className={selectClass}
							>
								{timeOptions.map(option => (
									<option key={option.key} value={option.key}>
										{option.label}
									</option>
								))}
							</select>
							{(selectedParallel !== 'all' ||
								selectedClass !== 'all' ||
								selectedStop !== 'all' ||
								selectedTime !== 'all') && (
								<button
									type='button'
									onClick={() => {
										setSelectedParallel('all')
										setSelectedClass('all')
										setSelectedStop('all')
										setSelectedTime('all')
										setPage(1)
									}}
									className='text-sm font-medium text-gray-500 hover:text-gray-700 underline underline-offset-2'
								>
									{t('resetFilters')}
								</button>
							)}
						</div>

						{/* Bulk Actions */}
						{selectedStudents.length > 0 && (
							<div className='flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3'>
								<span className='text-sm text-blue-800'>
									{selectedStudents.length} {t('selected')}
								</span>
								<div className='flex space-x-2'>
									<button className='text-sm text-blue-700 hover:text-blue-900'>{t('edit')}</button>
									<button className='text-sm text-red-700 hover:text-red-900'>{t('delete')}</button>
								</div>
							</div>
						)}
					</div>

					{/* Desktop Table */}
					<div className='hidden lg:block overflow-x-auto'>
						<Table
							students={pageStudents}
							selectedStudents={selectedStudents}
							onSelectStudent={handleSelectStudent}
							onSelectAll={handleSelectAll}
							routeNameMap={routeNameMap}
						/>
					</div>

					{/* Mobile Cards */}
					<MobileCards
						students={pageStudents}
						selectedStudents={selectedStudents}
						onSelectStudent={handleSelectStudent}
						routeNameMap={routeNameMap}
					/>

					{filteredStudents.length === 0 ? (
						<div className='text-center py-12'>
							<h3 className='mt-2 text-sm font-medium text-gray-900'>{t('noResults')}</h3>
							<p className='mt-1 text-sm text-gray-500'>{t('tryAdjustingSearch')}</p>
						</div>
					) : (
						/* Pagination */
						<div className='flex items-center justify-between px-6 py-4 border-t border-gray-200'>
							<p className='text-sm text-gray-500 tabular-nums'>
								{t('pageInfo', {
									from: (currentPage - 1) * PAGE_SIZE + 1,
									to: Math.min(currentPage * PAGE_SIZE, filteredStudents.length),
									total: filteredStudents.length,
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
