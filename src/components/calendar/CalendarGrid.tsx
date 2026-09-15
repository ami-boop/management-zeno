'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { todayInIsrael } from '@/lib/schedule-times'
import type { CalendarExceptionDetail } from '@/lib/api-contracts'
import { TYPE_COLORS } from './type-colors'
import { addDays, dayLabel, fromISO, hebrewFullLabel, hebrewShortLabel, isSameMonth, monthGrid, monthLabel, toISO, weekDays, weekLabel, type CalendarView } from './calendar-utils'

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

function labelOf(id: string, classLabels: Record<string, string>, megamas: { id: string; label: string }[]): string {
	return classLabels[id] ?? megamas.find(m => m.id === id)?.label ?? id
}

function weekdayShort(iso: string, locale: string): string {
	return fromISO(iso).toLocaleDateString(locale, { weekday: 'short' })
}

export default function CalendarGrid({ view, anchor, exceptions, onPickDate, onPickRange, onNavigate, onViewChange, classLabels, megamas }: Props) {
	const t = useTranslations('Calendar')
	const locale = useLocale()
	const today = todayInIsrael().date
	const [dragStart, setDragStart] = useState<string | null>(null)
	const [dragEnd, setDragEnd] = useState<string | null>(null)
	const [dir, setDir] = useState(0)
	const reduceMotion = useReducedMotion()
	const containerRef = useRef<HTMLDivElement>(null)

	// ease-zeno from the design system: cubic-bezier(0.22, 1, 0.36, 1)
	const EASE_ZENO: [number, number, number, number] = [0.22, 1, 0.36, 1]
	// Mirror the slide in RTL so "next" still moves forward visually.
	const slideDir = (locale === 'he' ? -1 : 1) * dir

	const fade: Variants = {
		enter: { opacity: 0 },
		center: { opacity: 1 },
		exit: { opacity: 0 },
	}
	const slide: Variants = {
		enter: (d: number) => ({ x: reduceMotion ? 0 : 56 * d, opacity: 0 }),
		center: { x: 0, opacity: 1 },
		exit: (d: number) => ({ x: reduceMotion ? 0 : -56 * d, opacity: 0 }),
	}

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
		setDir(-1)
		if (view === 'day') onNavigate(addDays(anchor, -1))
		else if (view === 'week') onNavigate(addDays(anchor, -7))
		else {
			const d = fromISO(anchor)
			d.setMonth(d.getMonth() - 1)
			onNavigate(toISO(d))
		}
	}
	const goNext = () => {
		setDir(1)
		if (view === 'day') onNavigate(addDays(anchor, 1))
		else if (view === 'week') onNavigate(addDays(anchor, 7))
		else {
			const d = fromISO(anchor)
			d.setMonth(d.getMonth() + 1)
			onNavigate(toISO(d))
		}
	}
	const goToday = () => {
		setDir(0)
		onNavigate(today)
	}

	const days: string[] =
		view === 'day' ? [anchor] : view === 'week' ? weekDays(anchor) : monthGrid(anchor)

	// Day view shows a single-column header with that day's weekday name,
	// otherwise the header would look like a week (Sun–Sat) above one cell.
	// weekDays() always starts on Sunday, so it also feeds the month header.
	const headerDays: string[] = view === 'day' ? [anchor] : weekDays(anchor)

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
		<div ref={containerRef} className='zeno-card overflow-hidden' onMouseLeave={() => { setDragStart(null); setDragEnd(null) }} onMouseUp={handleMouseUp}>
			<div className='flex flex-wrap items-center justify-between gap-3 border-b border-zeno-line bg-zeno-surface px-4 py-3'>
				<div className='flex items-center gap-2'>
					<button type='button' onClick={goPrev} aria-label={t('navPrev')} className='rounded-full border border-zeno-line bg-zeno-surface p-2 text-zeno-ink-soft hover:border-zeno-line-strong hover:bg-zeno-paper-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber'><ChevronLeft className='h-4 w-4' /></button>
					<button type='button' onClick={goNext} aria-label={t('navNext')} className='rounded-full border border-zeno-line bg-zeno-surface p-2 text-zeno-ink-soft hover:border-zeno-line-strong hover:bg-zeno-paper-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber'><ChevronRight className='h-4 w-4' /></button>
					<button type='button' onClick={goToday} className='rounded-full bg-zeno-amber px-3 py-1.5 text-xs font-bold text-zeno-amber-fg hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber-deep'>{t('today')}</button>
					<div className='ms-2 flex flex-wrap items-baseline gap-x-2'>
						<h2 className='text-sm font-bold text-zeno-ink sm:text-base tabular-nums'>{title}</h2>
						{view === 'day' && <span className='text-xs font-medium text-zeno-muted'>{hebrewFullLabel(anchor)}</span>}
					</div>
				</div>
				<div className='text-xs text-zeno-muted hidden sm:block'>{t('wheelHint')}</div>
			</div>

			<AnimatePresence mode='wait' initial={false}>
				<motion.div key={view} variants={fade} initial='enter' animate='center' exit='exit' transition={{ duration: 0.18 }}>
					<AnimatePresence mode='popLayout' initial={false} custom={slideDir}>
						<motion.div key={anchor} custom={slideDir} variants={slide} initial='enter' animate='center' exit='exit' transition={{ duration: 0.25, ease: EASE_ZENO }}>
							<div className={`grid ${view === 'day' ? 'grid-cols-1' : 'grid-cols-7'} border-b border-zeno-line bg-zeno-paper-soft`}>
								{headerDays.map(iso => (
									<div key={iso} className='zeno-kicker px-2 py-2 text-center'>{weekdayShort(iso, locale)}</div>
								))}
							</div>

							<div className={`grid ${view === 'day' ? 'grid-cols-1' : 'grid-cols-7'} gap-px bg-zeno-line`}>
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
							className={`relative min-h-[96px] cursor-pointer select-none bg-zeno-surface p-2 transition ${isOutside ? 'bg-zeno-paper-soft text-zeno-muted' : ''} ${isSelected ? 'bg-zeno-cream-surface ring-2 ring-inset ring-zeno-amber' : 'hover:bg-zeno-paper-soft'} ${view === 'day' ? 'min-h-[320px]' : ''}`}
						>
							<div className='flex items-start justify-between gap-2'>
								<span className='flex min-w-0 items-center gap-1.5'>
									<span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums ${isToday ? 'bg-zeno-amber text-zeno-amber-fg' : 'text-zeno-ink'}`}>{dayNum}</span>
									<span className='truncate text-[10px] leading-none text-zeno-muted'>{hebrewShortLabel(iso)}</span>
								</span>
								{ex && <span className={`h-2 w-2 rounded-full ${colors?.bg ?? 'bg-zeno-muted'}`} />}
							</div>

							{ex ? (
								<div className='mt-2 space-y-1.5'>
									<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${colors?.badge ?? 'bg-zeno-paper-soft text-zeno-ink-soft'}`}>{t(`types.${ex.type}`)}</span>
									{ex.type === 'half_day' && ex.overrideEndTimes && (
										<div className='flex flex-wrap gap-1'>
											{Object.entries(ex.overrideEndTimes).slice(0, 6).map(([cid, time]) => (
												<span key={cid} className='rounded-md bg-zeno-cream px-1.5 py-0.5 text-[11px] font-medium text-zeno-amber-ink border border-zeno-line-strong tabular-nums'>{labelOf(cid, classLabels, megamas)} {time}</span>
											))}
											{Object.keys(ex.overrideEndTimes).length > 6 && <span className='text-[11px] text-zeno-muted tabular-nums'>+{Object.keys(ex.overrideEndTimes).length - 6}</span>}
										</div>
									)}
									{ex.type === 'special_schedule' && ex.specialSchedule && (
										<div className='text-[11px] text-zeno-ink-soft font-medium tabular-nums'>{ex.specialSchedule.departureTime} · {ex.specialSchedule.scope.length} {t('fields.scope').toLowerCase()}</div>
									)}
									{ex.note && <div className='truncate text-[11px] text-zeno-muted'>{ex.note}</div>}
									{!ex.isActive && <span className='inline-flex rounded-full bg-zeno-paper-soft px-2 py-0.5 text-[11px] text-zeno-muted'>{t('status.inactive')}</span>}
								</div>
							) : (
								<div className='mt-3 text-[11px] text-zeno-muted'>{t('noException')}</div>
							)}
						</div>
					)
				})}
							</div>
						</motion.div>
					</AnimatePresence>
				</motion.div>
			</AnimatePresence>
		</div>
	)
}
