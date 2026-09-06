'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { createException, updateException } from '@/app/actions/calendar'
import {
	ALL_CLASS_OPTIONS,
	GRADE_ORDER,
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

const inputClass =
	'w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'

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
	const [endTimes, setEndTimes] = useState<{ classId: string; time: string }[]>([])
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
					<label className='grid gap-1'>
						<span className='text-xs font-medium text-gray-500'>{t('fields.date')} *</span>
						<input
							className={inputClass}
							type='date'
							value={date}
							disabled={Boolean(exception)}
							onChange={event => setDate(event.target.value)}
						/>
					</label>
					<label className='grid gap-1'>
						<span className='text-xs font-medium text-gray-500'>{t('fields.type')} *</span>
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
					</label>

					{type === 'half_day' && (
						<div className='grid gap-2'>
							<span className='text-xs font-medium text-gray-500'>
								{t('fields.overrideEndTimes')} *
							</span>
							{endTimes.map((row, index) => {
								const grade = row.classId ? gradeOfClass(row.classId) : null
								return (
									<div key={index} className='flex items-center gap-2'>
										{row.classId && !grade ? (
											<select
												className={`${inputClass} flex-1`}
												value={row.classId}
												onChange={event =>
													setEndTimes(prev =>
														prev.map((item, i) =>
															i === index ? { ...item, classId: event.target.value } : item
														)
													)
												}
											>
												<option value={row.classId}>{labelOf(row.classId)}</option>
												{ALL_CLASS_OPTIONS.map(option => (
													<option key={option.id} value={option.id}>
														{option.label}
													</option>
												))}
												{megamas.length > 0 && (
													<optgroup label={t('fields.megamas')}>
														{megamas.map(option => (
															<option key={option.id} value={option.id}>
																{option.label}
															</option>
														))}
													</optgroup>
												)}
											</select>
										) : (
											<>
												<select
													className={`${inputClass} w-28`}
													value={grade ?? ''}
													onChange={event => {
														const first = classesOfGrade(event.target.value)[0]
														setEndTimes(prev =>
															prev.map((item, i) =>
																i === index
																	? { ...item, classId: first?.id ?? '' }
																	: item
															)
														)
													}}
												>
													<option value='' disabled>
														{t('fields.grade')}
													</option>
													{gradeOptions.map(option => (
														<option key={option.id} value={option.id}>
															{option.label}
														</option>
													))}
												</select>
												<select
													className={`${inputClass} flex-1`}
													value={grade ? row.classId : ''}
													disabled={!grade}
													onChange={event =>
														setEndTimes(prev =>
															prev.map((item, i) =>
																i === index ? { ...item, classId: event.target.value } : item
															)
														)
													}
												>
													<option value='' disabled>
														{t('fields.class')}
													</option>
													{(grade ? classesOfGrade(grade) : []).map(option => (
														<option key={option.id} value={option.id}>
															{splitClassId(option.id)[1]}
														</option>
													))}
												</select>
											</>
										)}
										<input
											className={`${inputClass} w-24`}
											type='time'
											value={row.time}
											onChange={event =>
												setEndTimes(prev =>
													prev.map((item, i) =>
														i === index ? { ...item, time: event.target.value } : item
													)
												)
											}
										/>
										<button
											className='rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600'
											title={t('actions.removeRow')}
											onClick={() => setEndTimes(prev => prev.filter((_, i) => i !== index))}
										>
											<Trash2 className='h-4 w-4' />
										</button>
									</div>
								)
							})}
							<div className='flex flex-wrap gap-2'>
								<button
									className='inline-flex w-fit items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50'
									onClick={() => setEndTimes(prev => [...prev, { classId: '', time: '' }])}
								>
									<Plus className='h-3.5 w-3.5' />
									{t('actions.addRow')}
								</button>
								{megamas.length > 0 && (
									<button
										className='inline-flex w-fit items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50'
										onClick={() =>
											setEndTimes(prev => [
												...prev,
												{ classId: megamas.find(option => !prev.some(row => row.classId === option.id))?.id ?? megamas[0].id, time: '' },
											])
										}
									>
										<Plus className='h-3.5 w-3.5' />
										{t('actions.addMegama')}
									</button>
								)}
							</div>
						</div>
					)}

					{type === 'special_schedule' && (
						<div className='grid gap-3'>
							<div className='grid gap-2'>
								<span className='text-xs font-medium text-gray-500'>{t('fields.scope')} *</span>
								{scope.length > 0 && (
									<div className='flex flex-wrap gap-1.5'>
										{[...scope]
											.sort(
												(a, b) =>
													GRADE_ORDER.indexOf(splitClassId(a)[0]) -
														GRADE_ORDER.indexOf(splitClassId(b)[0]) || a.localeCompare(b)
											)
											.map(classId => (
												<button
													key={classId}
													type='button'
													className='inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100'
													title={t('actions.removeRow')}
													onClick={() => setScope(prev => prev.filter(id => id !== classId))}
												>
													{labelOf(classId)}
													<span aria-hidden='true'>×</span>
												</button>
											))}
									</div>
								)}
								<div className='flex items-center gap-2'>
									<select
										className={`${inputClass} w-28`}
										value={scopeGrade}
										onChange={event => setScopeGrade(event.target.value)}
									>
										{gradeOptions.map(option => (
											<option key={option.id} value={option.id}>
												{option.label}
											</option>
										))}
									</select>
									<button
										className='rounded-lg px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50'
										onClick={() =>
											setScope(prev => [
												...new Set([...prev, ...classesOfGrade(scopeGrade).map(o => o.id)]),
											])
										}
									>
										{t('fields.selectAll')}
									</button>
								</div>
								{megamas.length > 0 && (
									<div className='flex items-center gap-2'>
										<select
											className={`${inputClass} flex-1`}
											defaultValue=''
											onChange={event => {
												if (!event.target.value) return
												setScope(prev =>
													prev.includes(event.target.value) ? prev : [...prev, event.target.value]
												)
												event.target.value = ''
											}}
										>
											<option value=''>{t('fields.addMegamaScope')}</option>
											{megamas.map(option => (
												<option key={option.id} value={option.id}>
													{option.label}
												</option>
											))}
										</select>
									</div>
								)}
								<div className='flex flex-wrap gap-1.5'>
									{classesOfGrade(scopeGrade).map(option => {
										const checked = scope.includes(option.id)
										return (
											<button
												key={option.id}
												type='button'
												aria-pressed={checked}
												className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-sm font-medium ${
													checked
														? 'border-blue-500 bg-blue-50 text-blue-700'
														: 'border-gray-200 text-gray-600 hover:bg-gray-50'
												}`}
												onClick={() =>
													setScope(prev =>
														prev.includes(option.id)
															? prev.filter(id => id !== option.id)
															: [...prev, option.id]
													)
												}
											>
												{splitClassId(option.id)[1]}
											</button>
										)
									})}
								</div>
							</div>
							<label className='grid gap-1'>
								<span className='text-xs font-medium text-gray-500'>
									{t('fields.departureTime')} *
								</span>
								<input
									className={inputClass}
									type='time'
									value={departureTime}
									onChange={event => setDepartureTime(event.target.value)}
								/>
							</label>
						</div>
					)}

					<label className='grid gap-1'>
						<span className='text-xs font-medium text-gray-500'>{t('fields.note')}</span>
						<textarea
							className={inputClass}
							rows={2}
							value={note}
							onChange={event => setNote(event.target.value)}
						/>
					</label>
					{error && <p className='text-sm text-red-600'>{error}</p>}
				</div>
				<DialogFooter>
					<Button variant='outline' onClick={onClose} disabled={saving}>
						{t('actions.cancel')}
					</Button>
					<Button onClick={handleSave} disabled={saving}>
						{saving && <Loader2 className='h-4 w-4 animate-spin' />}
						{t('actions.save')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
