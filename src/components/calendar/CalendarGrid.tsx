'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { todayInIsrael } from '@/lib/schedule-times'
import type { CalendarExceptionDetail } from '@/lib/api-contracts'
import { TYPE_COLORS } from './type-colors'
import { addDays, dayLabel, fromISO, isSameMonth, monthGrid, monthLabel, toISO, weekDays, weekLabel, type CalendarView } from './calendar-utils'

interface Props {
	view: CalendarView
	anchor: string
	exceptions: Map<string, CalendarExceptionDetail>
	onPickDate: (iso: string) => void
	onPickRange: (start: string, end: string) => void
	onNavigate: (nextAnchor: string) => void
	onViewChange: (v: CalendarView) => void
	classLabels: Record<string, string>
	megamas: { id: string; label: string }[]
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function labelOf(id: string, classLabels: Record<string, string>, megamas: { id: string; label: string }[]): string {
	return classLabels[id] ?? megamas.find(m => m.id === id)?.label ?? id
}

export default function CalendarGrid({ view, anchor, exceptions, onPickDate, onPickRange, onNavigate, onViewChange, classLabels, megamas }: Props) {
	const t = useTranslations('Calendar')
	const locale = useLocale()
	const today = todayInIsrael().date
	const [dragStart, setDragStart] = useState<string | null>(null)
	const [dragEnd, setDragEnd] = useState<string | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)

	const viewOrder: CalendarView[] = ['day', 'week', 'month']

	useEffect(() => {
		const el = containerRef.current
		if (!el) return
		const onWheel = (e: WheelEvent) => {
			if (e.ctrlKey || e.metaKey) return
			if (Math.abs(e.deltaY) < 15) return
			e.preventDefault()
			const dir = e.deltaY > 0 ? 1 : -1
			const idx = viewOrder.indexOf(view)
			const next = viewOrder[Math.min(viewOrder.length - 1, Math.max(0, idx + dir))]
			if (next !== view) onViewChange(next)
		}
		el.addEventListener('wheel', onWheel, { passive: false })
		return () => el.removeEventListener('wheel', onWheel)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [view])

	const goPrev = () => {
		if (view === 'day') onNavigate(addDays(anchor, -1))
		else if (view === 'week') onNavigate(addDays(anchor, -7))
		else {
			const d = fromISO(anchor)
			d.setMonth(d.getMonth() - 1)
			onNavigate(toISO(d))
		}
	}
	const goNext = () => {
		if (view === 'day') onNavigate(addDays(anchor, 1))
		else if (view === 'week') onNavigate(addDays(anchor, 7))
		else {
			const d = fromISO(anchor)
			d.setMonth(d.getMonth() + 1)
			onNavigate(toISO(d))
		}
	}
	const goToday = () => onNavigate(today)

	const days: string[] =
		view === 'day' ? [anchor] : view === 'week' ? weekDays(anchor) : monthGrid(anchor)

	const title = view === 'day' ? dayLabel(anchor, locale) : view === 'week' ? weekLabel(anchor, locale) : monthLabel(anchor, locale)

	const isInRange = (iso: string) => {
		if (!dragStart || !dragEnd) return false
		const [a, b] = [dragStart, dragEnd].sort()
		return iso >= a && iso <= b
	}

	const handleMouseDown = (iso: string) => {
		setDragStart(iso)
		setDragEnd(iso)
	}
	const handleMouseEnter = (iso: string) => {
		if (dragStart) setDragEnd(iso)
	}
	const handleMouseUp = () => {
		if (!dragStart || !dragEnd) return
		const [a, b] = [dragStart, dragEnd].sort()
		setDragStart(null)
		setDragEnd(null)
		if (a === b) onPickDate(a)
		else onPickRange(a, b)
	}

	return (
		<div ref={containerRef} className='rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden' onMouseLeave={() => { setDragStart(null); setDragEnd(null) }} onMouseUp={handleMouseUp}>
			<div className='flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-blue-50/60 via-violet-50/40 to-emerald-50/60 px-4 py-3'>
				<div className='flex items-center gap-2'>
					<button type='button' onClick={goPrev} className='rounded-full border border-gray-200 bg-white p-1.5 hover:bg-gray-50'><ChevronLeft className='h-4 w-4' /></button>
					<button type='button' onClick={goNext} className='rounded-full border border-gray-200 bg-white p-1.5 hover:bg-gray-50'><ChevronRight className='h-4 w-4' /></button>
					<button type='button' onClick={goToday} className='rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700'>{t('today')}</button>
					<h2 className='ms-2 text-sm font-bold text-gray-900 sm:text-base'>{title}</h2>
				</div>
				<div className='text-xs text-gray-500 hidden sm:block'>{t('wheelHint')}</div>
			</div>

			<div className='grid grid-cols-7 border-b border-gray-100 bg-gray-50/60 text-[11px] font-semibold uppercase tracking-wide text-gray-500'>
				{WEEKDAYS.map(d => (
					<div key={d} className='px-2 py-2 text-center'>{d}</div>
				))}
			</div>

			<div className={`grid ${view === 'day' ? 'grid-cols-1' : 'grid-cols-7'} gap-px bg-gray-100`}>
				{days.map(iso => {
					const ex = exceptions.get(iso)
					const isToday = iso === today
					const isSelected = isInRange(iso) || iso === dragStart
					const isOutside = view === 'month' && !isSameMonth(iso, anchor)
					const colors = ex ? TYPE_COLORS[ex.type] ?? TYPE_COLORS.holiday : null
					const dayNum = Number(iso.split('-')[2])
					return (
						<div
							key={iso}
							onMouseDown={() => handleMouseDown(iso)}
							onMouseEnter={() => handleMouseEnter(iso)}
							className={`relative min-h-[96px] cursor-pointer select-none bg-white p-2 transition ${isOutside ? 'bg-gray-50 text-gray-400' : ''} ${isSelected ? 'ring-2 ring-blue-500 ring-inset bg-blue-50/60' : 'hover:bg-blue-50/40'} ${view === 'day' ? 'min-h-[320px]' : ''}`}
						>
							<div className='flex items-start justify-between gap-2'>
								<span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${isToday ? 'bg-blue-600 text-white' : 'text-gray-900'}`}>{dayNum}</span>
								{ex && <span className={`h-2 w-2 rounded-full ${colors?.bg ?? 'bg-gray-300'}`} />}
							</div>

							{ex ? (
								<div className='mt-2 space-y-1.5'>
									<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${colors?.badge ?? 'bg-gray-100 text-gray-600'}`}>{t(`types.${ex.type}`)}</span>
									{ex.type === 'half_day' && ex.overrideEndTimes && (
										<div className='flex flex-wrap gap-1'>
											{Object.entries(ex.overrideEndTimes).slice(0, 6).map(([cid, time]) => (
												<span key={cid} className='rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-800 border border-amber-200'>{labelOf(cid, classLabels, megamas)} {time}</span>
											))}
											{Object.keys(ex.overrideEndTimes).length > 6 && <span className='text-[11px] text-gray-500'>+{Object.keys(ex.overrideEndTimes).length - 6}</span>}
										</div>
									)}
									{ex.type === 'special_schedule' && ex.specialSchedule && (
										<div className='text-[11px] text-blue-700 font-medium'>{ex.specialSchedule.departureTime} · {ex.specialSchedule.scope.length} {t('fields.scope').toLowerCase()}</div>
									)}
									{ex.note && <div className='truncate text-[11px] text-gray-500'>{ex.note}</div>}
									{!ex.isActive && <span className='inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500'>{t('status.inactive')}</span>}
								</div>
							) : (
								<div className='mt-3 text-[11px] text-gray-400'>{t('noException')}</div>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}
