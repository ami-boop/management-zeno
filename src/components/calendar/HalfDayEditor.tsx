'use client'

import { useTranslations } from 'next-intl'
import { Plus, Trash2 } from 'lucide-react'
import { ALL_CLASS_OPTIONS, classesOfGrade, gradeOfClass, splitClassId } from '@/lib/classes'
import { fieldInputClassName } from '@/components/FormField'

export interface EndTimeRow {
	classId: string
	time: string
}

interface HalfDayEditorProps {
	rows: EndTimeRow[]
	onUpdateRow: (index: number, patch: Partial<EndTimeRow>) => void
	onRemoveRow: (index: number) => void
	onAddRow: () => void
	onAddMegama: () => void
	megamas: { id: string; label: string }[]
	labelOf: (id: string) => string
	gradeOptions: { id: string; label: string }[]
}

const inputClass = fieldInputClassName

/** Class → end-time rows for half_day exceptions. */
export default function HalfDayEditor({
	rows,
	onUpdateRow,
	onRemoveRow,
	onAddRow,
	onAddMegama,
	megamas,
	labelOf,
	gradeOptions,
}: HalfDayEditorProps) {
	const t = useTranslations('Calendar')

	return (
		<div className='grid gap-2'>
			<span className='text-xs font-medium text-zeno-ink-soft'>
				{t('fields.overrideEndTimes')} *
			</span>
			{rows.map((row, index) => {
				const grade = row.classId ? gradeOfClass(row.classId) : null
				return (
					<div key={index} className='flex items-center gap-2'>
						{row.classId && !grade ? (
							<select
								className={`${inputClass} flex-1`}
								value={row.classId}
								onChange={event => onUpdateRow(index, { classId: event.target.value })}
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
										onUpdateRow(index, { classId: first?.id ?? '' })
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
									onChange={event => onUpdateRow(index, { classId: event.target.value })}
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
							onChange={event => onUpdateRow(index, { time: event.target.value })}
						/>
						<button
							className='rounded-lg p-2 text-zeno-muted hover:bg-zeno-danger-soft hover:text-zeno-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber'
							title={t('actions.removeRow')}
							aria-label={t('actions.removeRow')}
							onClick={() => onRemoveRow(index)}
						>
							<Trash2 className='h-4 w-4' />
						</button>
					</div>
				)
			})}
			<div className='flex flex-wrap gap-2'>
				<button
					className='inline-flex w-fit items-center gap-1.5 rounded-lg border border-dashed border-zeno-line-strong px-3 py-1.5 text-xs font-medium text-zeno-ink-soft hover:bg-zeno-paper-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber'
					onClick={onAddRow}
				>
					<Plus className='h-3.5 w-3.5' />
					{t('actions.addRow')}
				</button>
				{megamas.length > 0 && (
					<button
						className='inline-flex w-fit items-center gap-1.5 rounded-lg border border-dashed border-zeno-line-strong px-3 py-1.5 text-xs font-medium text-zeno-ink-soft hover:bg-zeno-paper-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber'
						onClick={onAddMegama}
					>
						<Plus className='h-3.5 w-3.5' />
						{t('actions.addMegama')}
					</button>
				)}
			</div>
		</div>
	)
}
