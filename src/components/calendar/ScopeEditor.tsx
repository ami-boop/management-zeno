'use client'

import { useTranslations } from 'next-intl'
import { GRADE_ORDER, classesOfGrade, splitClassId } from '@/lib/classes'
import { fieldInputClassName } from '@/components/FormField'

interface ScopeEditorProps {
	scope: string[]
	onToggle: (id: string) => void
	onRemove: (id: string) => void
	onSelectAllGrade: () => void
	scopeGrade: string
	onScopeGradeChange: (grade: string) => void
	onAddMegama: (id: string) => void
	megamas: { id: string; label: string }[]
	labelOf: (id: string) => string
	gradeOptions: { id: string; label: string }[]
	departureTime: string
	onDepartureTimeChange: (time: string) => void
}

const inputClass = fieldInputClassName

/** Scope chips + grade picker for special_schedule exceptions. */
export default function ScopeEditor({
	scope,
	onToggle,
	onRemove,
	onSelectAllGrade,
	scopeGrade,
	onScopeGradeChange,
	onAddMegama,
	megamas,
	labelOf,
	gradeOptions,
	departureTime,
	onDepartureTimeChange,
}: ScopeEditorProps) {
	const t = useTranslations('Calendar')

	return (
		<div className='grid gap-3'>
			<div className='grid gap-2'>
				<span className='text-xs font-medium text-zeno-ink-soft'>{t('fields.scope')} *</span>
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
									className='inline-flex items-center gap-1 rounded-full bg-zeno-sage-soft px-2.5 py-0.5 text-xs font-medium text-zeno-sage border border-zeno-line hover:border-zeno-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber'
									title={t('actions.removeRow')}
									onClick={() => onRemove(classId)}
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
						onChange={event => onScopeGradeChange(event.target.value)}
					>
						{gradeOptions.map(option => (
							<option key={option.id} value={option.id}>
								{option.label}
							</option>
						))}
					</select>
					<button
						className='rounded-lg px-2 py-1.5 text-xs font-medium text-zeno-sage hover:bg-zeno-sage-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber'
						onClick={onSelectAllGrade}
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
								onAddMegama(event.target.value)
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
								className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-sm font-medium tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber ${
									checked
										? 'border-zeno-night bg-zeno-night text-white'
										: 'border-zeno-line text-zeno-ink-soft hover:bg-zeno-paper-soft'
								}`}
								onClick={() => onToggle(option.id)}
							>
								{splitClassId(option.id)[1]}
							</button>
						)
					})}
				</div>
			</div>
			<label className='grid gap-1'>
				<span className='text-xs font-medium text-zeno-ink-soft'>
					{t('fields.departureTime')} *
				</span>
				<input
					className={inputClass}
					type='time'
					value={departureTime}
					onChange={event => onDepartureTimeChange(event.target.value)}
				/>
			</label>
		</div>
	)
}
