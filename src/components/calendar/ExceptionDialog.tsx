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
import { createException, updateException } from '@/app/actions/calendar'
import {
	GRADE_OPTIONS,
	classToHebrew,
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
import HalfDayEditor, { type EndTimeRow } from './HalfDayEditor'
import ScopeEditor from './ScopeEditor'

interface ExceptionDialogProps {
	open: boolean
	exception: CalendarExceptionDetail | null
	megamas?: { id: string; label: string }[]
	classLabels?: Record<string, string>
	parallelLabels?: Record<string, string>
	onClose: () => void
	onCreated: (date: string, values: ExceptionFormValues) => void
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
	megamas = [],
	classLabels = {},
	parallelLabels = {},
	onClose,
	onCreated,
	onEdited,
}: ExceptionDialogProps) {
	const t = useTranslations('Calendar')
	const [date, setDate] = useState(today())
	const [type, setType] = useState<CalendarExceptionType>('holiday')
	const [note, setNote] = useState('')
	const [endTimes, setEndTimes] = useState<EndTimeRow[]>([])
	const [scope, setScope] = useState<string[]>([])
	const [scopeGrade, setScopeGrade] = useState<string>('')
	const [departureTime, setDepartureTime] = useState('')
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Hebrew labels: backend facets first, static fallback for ids without students.
	const labelOf = (id: string): string =>
		classLabels[id] ?? megamas.find(megama => megama.id === id)?.label ?? classToHebrew(id)
	const gradeOptions = GRADE_OPTIONS.map(option => ({
		...option,
		label: parallelLabels[option.id] ?? option.label,
	}))

	useEffect(() => {
		if (!open) return
		setDate(exception?.id ?? today())
		setType(exception?.type ?? 'holiday')
		setNote(exception?.note ?? '')
		setEndTimes(
			Object.entries(exception?.overrideEndTimes ?? {}).map(([classId, time]) => ({
				classId,
				time,
			}))
		)
		const initialScope = exception?.specialSchedule?.scope ?? []
		setScope(initialScope)
		const firstKnown = initialScope.find(id => gradeOfClass(id))
		setScopeGrade(firstKnown ? splitClassId(firstKnown)[0] : 'alef')
		setDepartureTime(exception?.specialSchedule?.departureTime ?? '')
		setError(null)
	}, [open, exception])

	async function handleSave() {
		if (!exception && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
			setError(t('errors.dateInvalid'))
			return
		}
		let overrideEndTimes: Record<string, string> | null = null
		if (type === 'half_day') {
			const valid = endTimes.filter(row => row.classId.trim() && row.time.trim())
			if (valid.length === 0) {
				setError(t('errors.endTimesRequired'))
				return
			}
			overrideEndTimes = Object.fromEntries(valid.map(row => [row.classId.trim(), row.time.trim()]))
		}
		let specialSchedule: ExceptionFormValues['specialSchedule'] = null
		if (type === 'special_schedule') {
			if (scope.length === 0 || !departureTime.trim()) {
				setError(t('errors.specialScheduleRequired'))
				return
			}
			// Preserve service fields (returnsToSchool, departureStopOverride, …)
			// that the UI doesn't edit but the schedule pipeline relies on.
			specialSchedule = {
				...(exception?.specialSchedule?.extra ?? {}),
				scope: [...scope],
				departureTime: departureTime.trim(),
			}
		}
		setSaving(true)
		setError(null)
		const body = {
			type,
			note: note.trim() || null,
			overrideEndTimes,
			specialSchedule,
		}
		const result = exception
			? await updateException(exception.id, body)
			: await createException(date, body)
		setSaving(false)
		if (!result.ok) {
			setError(t('errors.saveFailed'))
			return
		}
		if (exception) {
			onEdited(exception.id, body)
		} else {
			onCreated(date, body)
		}
		onClose()
	}

	return (
		<Dialog open={open} onOpenChange={value => !value && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{exception ? t('dialog.editTitle') : t('dialog.createTitle')}
					</DialogTitle>
					<DialogDescription>{t('dialog.description')}</DialogDescription>
				</DialogHeader>
				<div className='grid gap-3'>
					<FormField label={t('fields.date')} required>
						<input
							className={inputClass}
							type='date'
							value={date}
							disabled={Boolean(exception)}
							onChange={event => setDate(event.target.value)}
						/>
					</FormField>
					<FormField label={t('fields.type')} required>
						<select
							className={inputClass}
							value={type}
							onChange={event => setType(event.target.value as CalendarExceptionType)}
						>
							{CALENDAR_EXCEPTION_TYPES.map(value => (
								<option key={value} value={value}>
									{t(`types.${TYPE_LABELS[value]}`)}
								</option>
							))}
						</select>
					</FormField>

					{type === 'half_day' && (
						<HalfDayEditor
							rows={endTimes}
							onUpdateRow={(index, patch) =>
								setEndTimes(prev =>
									prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
								)
							}
							onRemoveRow={index =>
								setEndTimes(prev => prev.filter((_, i) => i !== index))
							}
							onAddRow={() => setEndTimes(prev => [...prev, { classId: '', time: '' }])}
							onAddMegama={() =>
								setEndTimes(prev => [
									...prev,
									{
										classId:
											megamas.find(option => !prev.some(row => row.classId === option.id))
												?.id ?? megamas[0].id,
										time: '',
									},
								])
							}
							megamas={megamas}
							labelOf={labelOf}
							gradeOptions={gradeOptions}
						/>
					)}

					{type === 'special_schedule' && (
						<ScopeEditor
							scope={scope}
							onToggle={id =>
								setScope(prev =>
									prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
								)
							}
							onRemove={id => setScope(prev => prev.filter(item => item !== id))}
							onSelectAllGrade={() =>
								setScope(prev => [
									...new Set([...prev, ...classesOfGrade(scopeGrade).map(o => o.id)]),
								])
							}
							scopeGrade={scopeGrade}
							onScopeGradeChange={setScopeGrade}
							onAddMegama={id =>
								setScope(prev => (prev.includes(id) ? prev : [...prev, id]))
							}
							megamas={megamas}
							labelOf={labelOf}
							gradeOptions={gradeOptions}
							departureTime={departureTime}
							onDepartureTimeChange={setDepartureTime}
						/>
					)}

					<FormField label={t('fields.note')}>
						<textarea
							className={inputClass}
							rows={2}
							value={note}
							onChange={event => setNote(event.target.value)}
						/>
					</FormField>
					{error && <p className='text-sm text-red-600'>{error}</p>}
				</div>
				<DialogSaveFooter
					onCancel={onClose}
					onSave={() => void handleSave()}
					saving={saving}
					cancelLabel={t('actions.cancel')}
					saveLabel={t('actions.save')}
				/>
			</DialogContent>
		</Dialog>
	)
}
