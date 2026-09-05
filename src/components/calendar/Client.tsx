'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CalendarPlus, Pencil, PowerOff, RotateCcw } from 'lucide-react'
import { classToHebrew } from '@/lib/classes'
import type { CalendarExceptionDetail, ExceptionFormValues } from '@/lib/api-contracts'
import { updateException } from '@/app/actions/calendar'
import ExceptionDialog from './ExceptionDialog'

interface CalendarClientProps {
	initialExceptions: CalendarExceptionDetail[] | null
}

function formatDate(date: string): string {
	const [year, month, day] = date.split('-')
	if (!year || !month || !day) return date
	return `${day}.${month}.${year}`
}

function describe(exception: CalendarExceptionDetail): string | null {
	const parts: string[] = []
	if (exception.type === 'half_day' && exception.overrideEndTimes) {
		parts.push(
			Object.entries(exception.overrideEndTimes)
				.map(([classId, time]) => `${classToHebrew(classId)} → ${time}`)
				.join(', ')
		)
	}
	if (exception.type === 'special_schedule' && exception.specialSchedule) {
		parts.push(
			`${exception.specialSchedule.scope.map(classToHebrew).join(', ')} → ${exception.specialSchedule.departureTime}`
		)
	}
	if (exception.note) parts.push(exception.note)
	return parts.length > 0 ? parts.join(' · ') : null
}

export default function Client({ initialExceptions }: CalendarClientProps) {
	const t = useTranslations('Calendar')
	const [exceptions, setExceptions] = useState<CalendarExceptionDetail[] | null>(initialExceptions)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editing, setEditing] = useState<CalendarExceptionDetail | null>(null)
	const [busyId, setBusyId] = useState<string | null>(null)
	const [actionError, setActionError] = useState(false)

	const sorted = useMemo(() => {
		if (!exceptions) return null
		return [...exceptions].sort((a, b) => b.id.localeCompare(a.id))
	}, [exceptions])

	function applyCreated(date: string, values: ExceptionFormValues) {
		setExceptions(prev =>
			[...(prev ?? []), { id: date, isActive: true, ...values }].sort((a, b) =>
				b.id.localeCompare(a.id)
			)
		)
	}

	function applyEdited(date: string, values: ExceptionFormValues) {
		setExceptions(prev =>
			prev ? prev.map(item => (item.id === date ? { ...item, ...values } : item)) : prev
		)
	}

	async function toggleActive(exception: CalendarExceptionDetail) {
		setBusyId(exception.id)
		setActionError(false)
		const result = await updateException(exception.id, { isActive: !exception.isActive })
		setBusyId(null)
		if (!result.ok) {
			setActionError(true)
			return
		}
		setExceptions(prev =>
			prev
				? prev.map(item =>
						item.id === exception.id ? { ...item, isActive: !exception.isActive } : item
					)
				: prev
		)
	}

	const activeCount = exceptions?.filter(item => item.isActive).length ?? 0

	return (
		<div className='mx-auto max-w-3xl px-4 py-8'>
			<div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>{t('title')}</h1>
					<p className='text-sm text-gray-500'>
						{t('stats.active', { active: activeCount, total: exceptions?.length ?? 0 })}
					</p>
				</div>
				<button
					className='inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
					onClick={() => {
						setEditing(null)
						setDialogOpen(true)
					}}
				>
					<CalendarPlus className='h-4 w-4' />
					{t('actions.add')}
				</button>
			</div>

			{actionError && <p className='mb-3 text-sm text-red-600'>{t('errors.actionFailed')}</p>}

			{!sorted ? (
				<p className='rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
					{t('errors.loadFailed')}
				</p>
			) : sorted.length === 0 ? (
				<p className='rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500'>
					{t('noExceptions')}
				</p>
			) : (
				<div className='grid gap-3'>
					{sorted.map(exception => (
						<div
							key={exception.id}
							className={`rounded-xl border bg-white p-4 ${
								exception.isActive ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
							}`}
						>
							<div className='mb-2 flex flex-wrap items-start justify-between gap-2'>
								<div>
									<div className='text-sm font-semibold text-gray-900'>
										{formatDate(exception.id)}
									</div>
									<div className='text-xs text-gray-500'>{t(`types.${exception.type}`)}</div>
								</div>
								<span
									className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
										exception.isActive
											? 'bg-green-100 text-green-700'
											: 'bg-gray-100 text-gray-500'
									}`}
								>
									{exception.isActive ? t('status.active') : t('status.inactive')}
								</span>
							</div>
							{describe(exception) && (
								<div className='mb-3 text-sm text-gray-700'>{describe(exception)}</div>
							)}
							<div className='flex items-center gap-1 border-t border-gray-100 pt-2'>
								<button
									className='inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700'
									onClick={() => {
										setEditing(exception)
										setDialogOpen(true)
									}}
								>
									<Pencil className='h-3.5 w-3.5' />
									{t('actions.edit')}
								</button>
								<button
									className='inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40'
									disabled={busyId === exception.id}
									onClick={() => toggleActive(exception)}
								>
									{exception.isActive ? (
										<>
											<PowerOff className='h-3.5 w-3.5' />
											{t('actions.deactivate')}
										</>
									) : (
										<>
											<RotateCcw className='h-3.5 w-3.5' />
											{t('actions.activate')}
										</>
									)}
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			<ExceptionDialog
				open={dialogOpen}
				exception={editing}
				onClose={() => setDialogOpen(false)}
				onCreated={applyCreated}
				onEdited={applyEdited}
			/>
		</div>
	)
}
