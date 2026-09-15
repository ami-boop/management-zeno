'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CalendarPlus, RotateCcw } from 'lucide-react'
import { GRADE_ORDER, classToHebrew, gradeOfClass, splitClassId } from '@/lib/classes'
import type { CalendarExceptionDetail, ExceptionFormValues } from '@/lib/api-contracts'
import { restoreException, updateException } from '@/app/actions/calendar'
import ActiveBadge from '@/components/ActiveBadge'
import EmptyState from '@/components/EmptyState'
import EntityActions from '@/components/EntityActions'
import ErrorBanner from '@/components/ErrorBanner'
import ExceptionDialog from './ExceptionDialog'
import CalendarGrid from './CalendarGrid'
import Legend from './Legend'
import { TYPE_COLORS } from './type-colors'
import { todayInIsrael } from '@/lib/schedule-times'
import { addDays, type CalendarView, type DisplayMode } from './calendar-utils'

interface CalendarClientProps {
	initialExceptions: CalendarExceptionDetail[] | null
	megamas?: { id: string; label: string }[]
	classLabels?: Record<string, string>
	parallelLabels?: Record<string, string>
}

export default function Client({
	initialExceptions,
	megamas = [],
	classLabels = {},
	parallelLabels = {},
}: CalendarClientProps) {
	const t = useTranslations('Calendar')
	const [exceptions, setExceptions] = useState<CalendarExceptionDetail[] | null>(initialExceptions)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editing, setEditing] = useState<CalendarExceptionDetail | null>(null)
	const [initialDates, setInitialDates] = useState<string[] | undefined>(undefined)
	const [busyId, setBusyId] = useState<string | null>(null)
	const [actionError, setActionError] = useState(false)
	const [undo, setUndo] = useState<{ date: string; prevActive: boolean } | null>(null)

	const [displayMode, setDisplayMode] = useState<DisplayMode>('calendar')
	const [view, setView] = useState<CalendarView>('week')
	const [anchor, setAnchor] = useState<string>(todayInIsrael().date)
	const [filterTypes, setFilterTypes] = useState<Set<string>>(new Set())
	const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')

	useEffect(() => {
		try {
			const m = localStorage.getItem('calendar:displayMode') as DisplayMode | null
			if (m === 'list' || m === 'calendar') setDisplayMode(m)
			const v = localStorage.getItem('calendar:view') as CalendarView | null
			if (v && ['day', 'week', 'month'].includes(v)) setView(v)
			const a = localStorage.getItem('calendar:anchor')
			if (a && /^\d{4}-\d{2}-\d{2}$/.test(a)) setAnchor(a)
		} catch {}
	}, [])
	useEffect(() => {
		try { localStorage.setItem('calendar:displayMode', displayMode) } catch {}
	}, [displayMode])
	useEffect(() => {
		try { localStorage.setItem('calendar:view', view) } catch {}
	}, [view])
	useEffect(() => {
		try { localStorage.setItem('calendar:anchor', anchor) } catch {}
	}, [anchor])

	const labelOf = (id: string): string =>
		classLabels[id] ?? megamas.find(m => m.id === id)?.label ?? classToHebrew(id)

	const classRank = (id: string): number => {
		const grade = gradeOfClass(id)
		if (!grade) return GRADE_ORDER.length
		return GRADE_ORDER.indexOf(grade) * 100 + Number(splitClassId(id)[1] ?? 0)
	}

	const exceptionMap = useMemo(() => {
		const map = new Map<string, CalendarExceptionDetail>()
		for (const ex of exceptions ?? []) map.set(ex.id, ex)
		return map
	}, [exceptions])

	const filtered = useMemo(() => {
		if (!exceptions) return null
		return exceptions.filter(ex => {
			if (filterTypes.size > 0 && !filterTypes.has(ex.type)) return false
			if (filterActive === 'active' && !ex.isActive) return false
			if (filterActive === 'inactive' && ex.isActive) return false
			return true
		}).sort((a, b) => b.id.localeCompare(a.id))
	}, [exceptions, filterTypes, filterActive])

	const filteredMap = useMemo(() => {
		const map = new Map<string, CalendarExceptionDetail>()
		for (const ex of filtered ?? []) map.set(ex.id, ex)
		return map
	}, [filtered])

	function formatDate(date: string): string {
		const [y, m, d] = date.split('-')
		if (!y || !m || !d) return date
		return `${d}.${m}.${y}`
	}

	function applyCreated(dates: string[], values: ExceptionFormValues) {
		setExceptions(prev => {
			const next = [...(prev ?? [])]
			for (const date of dates) {
				next.push({ id: date, isActive: true, ...values })
			}
			return next.sort((a, b) => b.id.localeCompare(a.id))
		})
	}

	function applyEdited(date: string, values: ExceptionFormValues) {
		setExceptions(prev => prev ? prev.map(item => (item.id === date ? { ...item, ...values } : item)) : prev)
	}

	async function toggleActive(exception: CalendarExceptionDetail) {
		const prevActive = exception.isActive
		setBusyId(exception.id)
		setActionError(false)
		const result = await updateException(exception.id, { isActive: !exception.isActive })
		setBusyId(null)
		if (!result.ok) {
			setActionError(true)
			return
		}
		setExceptions(prev => prev ? prev.map(item => item.id === exception.id ? { ...item, isActive: !exception.isActive } : item) : prev)
		setUndo({ date: exception.id, prevActive })
		setTimeout(() => setUndo(null), 5000)
	}

	async function handleUndo() {
		if (!undo) return
		const { date, prevActive } = undo
		setUndo(null)
		const result = prevActive ? await restoreException(date) : await updateException(date, { isActive: false })
		if (result.ok) {
			setExceptions(prev => prev ? prev.map(item => item.id === date ? { ...item, isActive: prevActive } : item) : prev)
		}
	}

	function onPickDate(iso: string) {
		const ex = exceptionMap.get(iso)
		if (ex) {
			setEditing(ex)
			setInitialDates(undefined)
			setDialogOpen(true)
		} else {
			setEditing(null)
			setInitialDates([iso])
			setDialogOpen(true)
		}
	}
	function onPickRange(start: string, end: string) {
		const [a, b] = [start, end].sort()
		const days: string[] = []
		let cur = a
		while (cur <= b) {
			days.push(cur)
			cur = addDays(cur, 1)
			if (days.length > 60) break
		}
		setEditing(null)
		setInitialDates(days)
		setDialogOpen(true)
	}

	function ExceptionDetail({ exception }: { exception: CalendarExceptionDetail }) {
		const chip = (id: string) => (
			<span key={id} className='inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-100'>
				{labelOf(id)}
			</span>
		)
		if (exception.type === 'half_day' && exception.overrideEndTimes) {
			const byTime = new Map<string, string[]>()
			for (const [id, time] of Object.entries(exception.overrideEndTimes)) {
				if (!time) continue
				const list = byTime.get(time) ?? []
				list.push(id)
				byTime.set(time, list)
			}
			const times = [...byTime.keys()].sort((a, b) => a.localeCompare(b))
			return (
				<div className='mb-3 grid gap-1'>
					{times.map(time => (
						<div key={time} className='flex flex-wrap items-center gap-1.5'>
							<span className='text-xs font-semibold text-gray-500 tabular-nums'>{time}</span>
							{byTime.get(time)!.sort((a, b) => classRank(a) - classRank(b)).map(chip)}
						</div>
					))}
				</div>
			)
		}
		if (exception.type === 'special_schedule' && exception.specialSchedule) {
			const scope = [...(exception.specialSchedule.scope ?? [])].sort((a, b) => classRank(a) - classRank(b))
			return (
				<div className='mb-3 flex flex-wrap items-center gap-1.5'>
					<span className='text-xs font-semibold text-gray-500'>{t('fields.departureTime')} {exception.specialSchedule.departureTime}</span>
					{scope.map(chip)}
				</div>
			)
		}
		return null
	}

	const activeCount = exceptions?.filter(item => item.isActive).length ?? 0

	return (
		<div className='mx-auto max-w-6xl px-4 py-6'>
			<div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
				<div>
					<h1 className='text-2xl font-bold tracking-tight text-gray-900'>{t('title')}</h1>
					<p className='text-sm text-gray-500'>{t('stats.active', { active: activeCount, total: exceptions?.length ?? 0 })}</p>
				</div>
				<div className='flex items-center gap-2'>
					<div className='hidden sm:inline-flex rounded-full border border-gray-200 bg-white p-1'>
						<button type='button' onClick={() => setDisplayMode('calendar')} className={`rounded-full px-3 py-1 text-xs font-semibold ${displayMode === 'calendar' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>{t('displayMode.calendar')}</button>
						<button type='button' onClick={() => setDisplayMode('list')} className={`rounded-full px-3 py-1 text-xs font-semibold ${displayMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>{t('displayMode.list')}</button>
					</div>
					{displayMode === 'calendar' && (
						<div className='inline-flex rounded-full border border-gray-200 bg-white p-1'>
							{(['day', 'week', 'month'] as const).map(v => (
								<button key={v} type='button' onClick={() => setView(v)} className={`rounded-full px-3 py-1 text-xs font-semibold ${view === v ? 'bg-violet-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>{t(`view.${v}`)}</button>
							))}
						</div>
					)}
					<button className='inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow hover:from-blue-700 hover:to-violet-700' onClick={() => { setEditing(null); setInitialDates(undefined); setDialogOpen(true) }}>
						<CalendarPlus className='h-4 w-4' />
						{t('actions.add')}
					</button>
				</div>
			</div>

			<div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
				<Legend active={filterTypes.size ? filterTypes : undefined} onToggle={type => {
					setFilterTypes(prev => {
						const next = new Set(prev)
						if (next.has(type)) next.delete(type)
						else next.add(type)
						return next
					})
				}} />
				<div className='flex items-center gap-2'>
					<select value={filterActive} onChange={e => setFilterActive(e.target.value as never)} className='rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium'>
						<option value='all'>{t('filters.activeAll')}</option>
						<option value='active'>{t('filters.activeOnly')}</option>
						<option value='inactive'>{t('filters.inactiveOnly')}</option>
					</select>
					{(filterTypes.size > 0 || filterActive !== 'all') && (
						<button type='button' onClick={() => { setFilterTypes(new Set()); setFilterActive('all') }} className='text-xs text-gray-500 underline'>Reset</button>
					)}
				</div>
			</div>

			{actionError && <ErrorBanner message={t('errors.actionFailed')} />}
			{undo && (
				<div className='mb-3 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm'>
					<span className='text-amber-800'>{t('undoRestored')} {undo.date}</span>
					<button onClick={() => void handleUndo()} className='inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold border border-amber-200 hover:bg-amber-100'>
						<RotateCcw className='h-3 w-3' />{t('undo')}
					</button>
				</div>
			)}

			{displayMode === 'calendar' ? (
				<CalendarGrid view={view} anchor={anchor} exceptions={filteredMap} onPickDate={onPickDate} onPickRange={onPickRange} onNavigate={setAnchor} onViewChange={setView} classLabels={classLabels} megamas={megamas} />
			) : (
				<>
					{!filtered ? (
						<ErrorBanner message={t('errors.loadFailed')} />
					) : filtered.length === 0 ? (
						<EmptyState message={t('noExceptions')} />
					) : (
						<div className='grid gap-3'>
							{filtered.map(exception => {
								const colors = TYPE_COLORS[exception.type] ?? TYPE_COLORS.holiday
								return (
									<div key={exception.id} className={`rounded-2xl border bg-white p-4 shadow-sm ${exception.isActive ? 'border-gray-200' : 'border-gray-100 bg-gray-50'}`}>
										<div className='mb-2 flex flex-wrap items-start justify-between gap-2'>
											<div className='flex items-center gap-2'>
												<span className={`h-2.5 w-2.5 rounded-full ${colors.bg}`} />
												<div>
													<div className='text-sm font-bold text-gray-900'>{formatDate(exception.id)}</div>
													<div className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold border ${colors.badge}`}>{t(`types.${exception.type}`)}</div>
												</div>
											</div>
											<ActiveBadge active={exception.isActive} activeLabel={t('status.active')} inactiveLabel={t('status.inactive')} />
										</div>
										<ExceptionDetail exception={exception} />
										{exception.note && <div className='mb-3 rounded-lg bg-gray-50 px-2 py-1 text-xs text-gray-600 border border-gray-100'>{exception.note}</div>}
										<EntityActions onEdit={() => { setEditing(exception); setInitialDates(undefined); setDialogOpen(true) }} onToggle={() => void toggleActive(exception)} active={exception.isActive} busy={busyId === exception.id} editLabel={t('actions.edit')} deactivateLabel={t('actions.deactivate')} activateLabel={t('actions.activate')} />
									</div>
								)
							})}
						</div>
					)}
				</>
			)}

			<ExceptionDialog
				open={dialogOpen}
				exception={editing}
				initialDates={initialDates}
				megamas={megamas}
				classLabels={classLabels}
				parallelLabels={parallelLabels}
				onClose={() => setDialogOpen(false)}
				onCreated={applyCreated}
				onEdited={applyEdited}
			/>
		</div>
	)
}
