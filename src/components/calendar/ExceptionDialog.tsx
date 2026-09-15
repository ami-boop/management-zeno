'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import DialogSaveFooter from '@/components/DialogSaveFooter'
import FormField, { fieldInputClassName } from '@/components/FormField'
import { createException, createExceptionsBatch, updateException } from '@/app/actions/calendar'
import {
	GRADE_OPTIONS,
	classesOfGrade,
	gradeOfClass,
	splitClassId,
} from '@/lib/classes'
import { todayInIsrael } from '@/lib/schedule-times'
import {
	CALENDAR_EXCEPTION_TYPES,
	type CalendarExceptionDetail,
	type CalendarExceptionType,
	type ExceptionFormValues,
} from '@/lib/api-contracts'
import { TYPE_COLORS } from './type-colors'
import { PRESETS } from './presets'
import HalfDayEditor, { type EndTimeRow } from './HalfDayEditor'
import ScopeEditor from './ScopeEditor'

interface ExceptionDialogProps {
	open: boolean
	exception: CalendarExceptionDetail | null
	initialDates?: string[]
	megamas?: { id: string; label: string }[]
	classLabels?: Record<string, string>
	parallelLabels?: Record<string, string>
	onClose: () => void
	onCreated: (dates: string[], values: ExceptionFormValues) => void
	onEdited: (date: string, values: ExceptionFormValues) => void
}

const inputClass = fieldInputClassName

const TYPE_LABELS: Record<CalendarExceptionType, string> = {
	holiday: 'holiday',
	exam_day: 'exam_day',
	half_day: 'half_day',
	no_transport: 'no_transport',
	special_schedule: 'special_schedule',
}

function today(): string {
	return todayInIsrael().date
}

export default function ExceptionDialog({
	open,
	exception,
	initialDates,
	megamas = [],
	classLabels = {},
	parallelLabels = {},
	onClose,
	onCreated,
	onEdited,
}: ExceptionDialogProps) {
	const t = useTranslations('Calendar')
	const [dates, setDates] = useState<string[]>([today()])
	const [singleDate, setSingleDate] = useState(today())
	const [type, setType] = useState<CalendarExceptionType>('holiday')
	const [note, setNote] = useState('')
	const [endTimes, setEndTimes] = useState<EndTimeRow[]>([])
	const [scope, setScope] = useState<string[]>([])
	const [scopeGrade, setScopeGrade] = useState<string>('')
	const [departureTime, setDepartureTime] = useState('')
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [conflicts, setConflicts] = useState<string[] | null>(null)

	const labelOf = (id: string): string =>
		classLabels[id] ?? megamas.find(m => m.id === id)?.label ?? id
	const gradeOptions = GRADE_OPTIONS.map(o => ({ ...o, label: parallelLabels[o.id] ?? o.label }))

	useEffect(() => {
		if (!open) return
		if (exception) {
			setDates([exception.id])
			setSingleDate(exception.id)
			setType(exception.type)
			setNote(exception.note ?? '')
			setEndTimes(Object.entries(exception.overrideEndTimes ?? {}).map(([classId, time]) => ({ classId, time })))
			const initialScope = exception.specialSchedule?.scope ?? []
			setScope(initialScope)
			const firstKnown = initialScope.find(id => gradeOfClass(id))
			setScopeGrade(firstKnown ? splitClassId(firstKnown)[0] : 'alef')
			setDepartureTime(exception.specialSchedule?.departureTime ?? '')
		} else {
			const init = initialDates && initialDates.length > 0 ? initialDates : [today()]
			setDates(init)
			setSingleDate(init[0])
			setType('holiday')
			setNote('')
			setEndTimes([])
			setScope([])
			setScopeGrade('alef')
			setDepartureTime('')
		}
		setError(null)
		setConflicts(null)
	}, [open, exception, initialDates])

	const isBatch = !exception && dates.length > 1

	async function handleSave() {
		if (!exception && dates.length === 0) {
			setError(t('errors.dateInvalid'))
			return
		}
		if (!exception && dates.length === 1 && !/^\d{4}-\d{2}-\d{2}$/.test(singleDate)) {
			setError(t('errors.dateInvalid'))
			return
		}
		const effectiveDates = exception ? [exception.id] : isBatch ? [...dates].sort() : [singleDate]
		if (note.length > 30) {
			setError('note too long')
			return
		}
		let overrideEndTimes: Record<string, string> | null = null
		if (type === 'half_day') {
			const valid = endTimes.filter(r => r.classId.trim() && r.time.trim())
			if (valid.length === 0) {
				setError(t('errors.endTimesRequired'))
				return
			}
			overrideEndTimes = Object.fromEntries(valid.map(r => [r.classId.trim(), r.time.trim()]))
		}
		let specialSchedule: ExceptionFormValues['specialSchedule'] = null
		if (type === 'special_schedule') {
			if (scope.length === 0 || !departureTime.trim()) {
				setError(t('errors.specialScheduleRequired'))
				return
			}
			specialSchedule = {
				...(exception?.specialSchedule?.extra ?? {}),
				scope: [...scope],
				departureTime: departureTime.trim(),
			}
		}
		setSaving(true)
		setError(null)
		setConflicts(null)
		const body = { type, note: note.trim() || null, overrideEndTimes, specialSchedule }
		if (exception) {
			const result = await updateException(exception.id, body)
			setSaving(false)
			if (!result.ok) {
				setError(t('errors.saveFailed'))
				return
			}
			onEdited(exception.id, body)
		} else if (effectiveDates.length === 1) {
			const result = await createException(effectiveDates[0], body)
			setSaving(false)
			if (!result.ok) {
				setError(t('errors.saveFailed'))
				return
			}
			onCreated(effectiveDates, body)
		} else {
			const result = await createExceptionsBatch(effectiveDates, body)
			setSaving(false)
			if (!result.ok) {
				if (result.conflicts && result.conflicts.length > 0) {
					setConflicts(result.conflicts)
					setError(t('batch.conflict'))
					return
				}
				setError(t('errors.saveFailed'))
				return
			}
			onCreated(effectiveDates, body)
		}
		onClose()
	}

	const typeColor = TYPE_COLORS[type] ?? TYPE_COLORS.holiday

	return (
		<Dialog open={open} onOpenChange={v => !v && onClose()}>
			<DialogContent className='max-h-[90vh] overflow-y-auto rounded-2xl border-0 p-0 shadow-2xl'>
				<div className='bg-gradient-to-br from-blue-600 via-violet-600 to-emerald-500 p-6 text-white'>
					<DialogHeader className='space-y-1'>
						<DialogTitle className='text-white text-xl'>{exception ? t('dialog.editTitle') : isBatch ? t('selectedRange', { count: dates.length }) : t('dialog.createTitle')}</DialogTitle>
						<DialogDescription className='text-white/80'>{isBatch ? `${dates[0]} → ${dates[dates.length-1]}` : t('dialog.description')}</DialogDescription>
					</DialogHeader>
				</div>

				<div className='grid gap-4 p-6'>
					{!exception && (
						<div className='rounded-xl bg-gradient-to-r from-amber-50 to-blue-50 p-3 border border-amber-100'>
							<div className='text-xs font-semibold text-gray-700 mb-2'>{t('presets.title')}</div>
							<div className='flex flex-wrap gap-1.5'>
								{PRESETS.map(p => (
									<button
										key={p.id}
										type='button'
										onClick={() => {
											setType(p.type)
											setNote(p.note ?? '')
											if (p.type === 'half_day') setEndTimes(p.overrideEndTimes ? Object.entries(p.overrideEndTimes).map(([k,v])=>({classId:k,time:v})) : [{classId:'',time:'12:00'}])
											if (p.type === 'special_schedule') {
												setScope(p.specialSchedule?.scope ?? [])
												setDepartureTime(p.specialSchedule?.departureTime ?? '13:30')
											}
										}}
										className='rounded-full bg-white px-3 py-1 text-xs font-medium shadow-sm border border-gray-200 hover:border-violet-300 hover:bg-violet-50'
									>
										{t(p.labelKey)}
									</button>
								))}
							</div>
						</div>
					)}

					{exception ? (
						<FormField label={t('fields.date')} required>
							<input className={`${inputClass} bg-gray-50`} type='date' value={singleDate} disabled />
						</FormField>
					) : isBatch ? (
						<div className='rounded-xl border border-blue-200 bg-blue-50 p-3'>
							{(() => {
								const sorted = [...dates].sort()
								return (
									<>
										<div className='text-xs font-semibold text-blue-900'>{t('rangeLabel', { start: sorted[0], end: sorted[sorted.length-1], count: sorted.length })}</div>
										<div className='mt-1 flex flex-wrap gap-1 max-h-20 overflow-y-auto'>
											{sorted.map(d => (
												<span key={d} className='rounded-full bg-white px-2 py-0.5 text-xs border border-blue-200'>{d}</span>
											))}
										</div>
									</>
								)
							})()}
						</div>
					) : (
						<FormField label={t('fields.date')} required>
							<input className={inputClass} type='date' value={singleDate} onChange={e => setSingleDate(e.target.value)} />
						</FormField>
					)}

					<FormField label={t('fields.type')} required>
						<div className='flex items-center gap-2'>
							<span className={`h-3 w-3 rounded-full ${typeColor.bg}`} />
							<select className={inputClass} value={type} onChange={e => setType(e.target.value as CalendarExceptionType)}>
								{CALENDAR_EXCEPTION_TYPES.map(v => (
									<option key={v} value={v}>{t(`types.${TYPE_LABELS[v]}`)}</option>
								))}
							</select>
						</div>
					</FormField>

					{type === 'half_day' && (
						<HalfDayEditor
							rows={endTimes}
							onUpdateRow={(i,p)=> setEndTimes(prev=> prev.map((r,idx)=> idx===i?{...r, ...p}:r))}
							onRemoveRow={i=> setEndTimes(prev=> prev.filter((_,idx)=> idx!==i))}
							onAddRow={()=> setEndTimes(prev=> [...prev, {classId:'', time:''}])}
							onAddMegama={()=> setEndTimes(prev=> [...prev, {classId: megamas.find(o=> !prev.some(r=> r.classId===o.id))?.id ?? megamas[0]?.id ?? '', time:''}])}
							megamas={megamas}
							labelOf={labelOf}
							gradeOptions={gradeOptions}
						/>
					)}

					{type === 'special_schedule' && (
						<ScopeEditor
							scope={scope}
							onToggle={id=> setScope(prev=> prev.includes(id)? prev.filter(x=> x!==id): [...prev,id])}
							onRemove={id=> setScope(prev=> prev.filter(x=> x!==id))}
							onSelectAllGrade={()=> setScope(prev=> [...new Set([...prev, ...classesOfGrade(scopeGrade).map(o=> o.id)])])}
							scopeGrade={scopeGrade}
							onScopeGradeChange={setScopeGrade}
							onAddMegama={id=> setScope(prev=> prev.includes(id)? prev: [...prev,id])}
							megamas={megamas}
							labelOf={labelOf}
							gradeOptions={gradeOptions}
							departureTime={departureTime}
							onDepartureTimeChange={setDepartureTime}
						/>
					)}

					<FormField label={`${t('fields.note')} · ${note.length}/30`}>
						<textarea className={inputClass} rows={2} maxLength={30} value={note} onChange={e=> setNote(e.target.value)} placeholder={t('fields.note')} />
					</FormField>

					{conflicts && (
						<div className='rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm'>
							<div className='font-semibold text-amber-900'>{t('batch.conflict')}</div>
							<div className='mt-1 text-amber-800'>{t('batch.conflictHint')}</div>
							<div className='mt-2 flex flex-wrap gap-1'>
								{conflicts.map(d=> <span key={d} className='rounded-full bg-white px-2 py-0.5 text-xs border border-amber-200'>{d}</span>)}
							</div>
							<div className='mt-2 text-xs text-amber-700'>{t('batch.editSuggestion')}</div>
						</div>
					)}

					{error && !conflicts && <p className='text-sm text-red-600'>{error}</p>}
				</div>

				<div className='border-t border-gray-100 p-4 bg-gray-50/60 rounded-b-2xl'>
					<DialogSaveFooter onCancel={onClose} onSave={() => void handleSave()} saving={saving} cancelLabel={t('actions.cancel')} saveLabel={t('actions.save')} />
				</div>
			</DialogContent>
		</Dialog>
	)
}
