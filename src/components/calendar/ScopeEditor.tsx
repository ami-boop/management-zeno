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
						className='rounded-lg px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50'
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
								className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-sm font-medium ${
									checked
										? 'border-blue-500 bg-blue-50 text-blue-700'
										: 'border-gray-200 text-gray-600 hover:bg-gray-50'
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
				<span className='text-xs font-medium text-gray-500'>
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
