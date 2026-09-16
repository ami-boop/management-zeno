'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Check, Loader2, Plus, X } from 'lucide-react'
import ErrorBanner from '@/components/ErrorBanner'
import EmptyState from '@/components/EmptyState'
import FormField, { fieldInputClassName } from '@/components/FormField'
import { updateSettingsData, type SettingsPatch } from '@/app/actions/settings'
import type { SettingsData } from '@/lib/api-contracts'

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

function Section({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
	return (
		<section className='zeno-card p-4 sm:p-6'>
			<h2 className='text-lg font-bold text-zeno-ink'>{title}</h2>
			<p className='mb-4 mt-1 text-sm text-zeno-muted'>{hint}</p>
			{children}
		</section>
	)
}

function SaveRow({ saving, saved, saveLabel, onSave }: {
	saving: boolean
	saved: boolean
	saveLabel: string
	onSave: () => void
}) {
	const t = useTranslations('Rules')
	return (
		<div className='mt-4 flex items-center gap-3'>
			<button
				type='button'
				onClick={onSave}
				disabled={saving}
				className='zeno-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber disabled:opacity-40'
			>
				{saving && <Loader2 className='h-4 w-4 animate-spin' />}
				{saveLabel}
			</button>
			{saved && (
				<span className='inline-flex items-center gap-1 text-sm font-medium text-zeno-sage'>
					<Check className='h-4 w-4' />
					{t('saved')}
				</span>
			)}
		</div>
	)
}

export default function Client({ initial }: { initial: SettingsData | null }) {
	const t = useTranslations('Rules')
	const [deadline, setDeadline] = useState(initial?.reportDeadlineMinutes ?? 45)
	const [times, setTimes] = useState<string[]>(initial?.reportTimes ?? [])
	const [newTime, setNewTime] = useState('')
	const [bus, setBus] = useState(initial?.vehicleCapacities.bus ?? 55)
	const [minibus, setMinibus] = useState(initial?.vehicleCapacities.minibus ?? 20)
	const [minibusesEnabled, setMinibusesEnabled] = useState(initial?.minibusesEnabled ?? false)
	const [autoRadius, setAutoRadius] = useState(initial?.autoCompleteRadiusM ?? 250)
	const [liveFresh, setLiveFresh] = useState(initial?.liveFreshnessMinutes ?? 5)
	const [autoFallback, setAutoFallback] = useState(initial?.autoCompleteFallbackMinutes ?? 20)
	const [saving, setSaving] = useState<string | null>(null)
	const [saved, setSaved] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		return () => {
			if (savedTimer.current) clearTimeout(savedTimer.current)
		}
	}, [])

	if (!initial) {
		return (
			<div className='mx-auto max-w-6xl px-4 py-6'>
				<ErrorBanner message={t('errors.loadFailed')} />
			</div>
		)
	}

	async function save(section: string, patch: SettingsPatch) {
		setSaving(section)
		setSaved(null)
		setError(null)
		const result = await updateSettingsData(patch)
		setSaving(null)
		if (!result.ok || !result.data) {
			setError(t('errors.saveFailed'))
			return
		}
		setDeadline(result.data.reportDeadlineMinutes)
		setTimes(result.data.reportTimes)
		setBus(result.data.vehicleCapacities.bus)
		setMinibus(result.data.vehicleCapacities.minibus)
		setMinibusesEnabled(result.data.minibusesEnabled)
		setAutoRadius(result.data.autoCompleteRadiusM)
		setLiveFresh(result.data.liveFreshnessMinutes)
		setAutoFallback(result.data.autoCompleteFallbackMinutes)
		setSaved(section)
		if (savedTimer.current) clearTimeout(savedTimer.current)
		savedTimer.current = setTimeout(() => setSaved(current => (current === section ? null : current)), 3000)
	}

	function saveDeadline() {
		if (!Number.isInteger(deadline) || deadline < 5 || deadline > 180) {
			setError(t('errors.deadlineRange'))
			return
		}
		void save('deadline', { reportDeadlineMinutes: deadline })
	}

	function saveTimes() {
		if (times.length === 0) {
			setError(t('errors.timesRequired'))
			return
		}
		void save('times', { reportTimes: times })
	}

	function saveCapacities() {
		if (!Number.isInteger(bus) || bus < 1 || !Number.isInteger(minibus) || minibus < 1) {
			setError(t('errors.capacitiesRange'))
			return
		}
		void save('capacities', { vehicleCapacities: { bus, minibus }, minibusesEnabled })
	}

	function saveAutoComplete() {
		if (!Number.isInteger(autoRadius) || autoRadius < 100 || autoRadius > 500) {
			setError(t('errors.autoRadiusRange'))
			return
		}
		if (!Number.isInteger(liveFresh) || liveFresh < 1 || liveFresh > 15) {
			setError(t('errors.liveFreshRange'))
			return
		}
		if (!Number.isInteger(autoFallback) || autoFallback < 5 || autoFallback > 60) {
			setError(t('errors.autoFallbackRange'))
			return
		}
		void save('autoComplete', {
			autoCompleteRadiusM: autoRadius,
			liveFreshnessMinutes: liveFresh,
			autoCompleteFallbackMinutes: autoFallback,
		})
	}

	function addTime() {
		const value = newTime.trim()
		if (!TIME_RE.test(value)) {
			setError(t('errors.timeFormat'))
			return
		}
		setError(null)
		setTimes(prev => [...new Set([...prev, value])].sort())
		setNewTime('')
	}

	return (
		<div className='mx-auto max-w-6xl px-4 py-6'>
			<div className='mb-6'>
				<h1 className='text-3xl font-bold tracking-tight text-zeno-ink'>{t('title')}</h1>
				<p className='zeno-kicker mt-1'>{t('subtitle')}</p>
			</div>

			{error && <div className='mb-4'><ErrorBanner message={error} /></div>}

			<div className='grid gap-4'>
				<Section title={t('deadline.title')} hint={t('deadline.hint')}>
					<FormField label={t('deadline.label')}>
						<input
							className={`${fieldInputClassName} max-w-40 tabular-nums`}
							type='number'
							min={5}
							max={180}
							value={deadline}
							onChange={e => setDeadline(Number(e.target.value))}
						/>
					</FormField>
					<SaveRow saving={saving === 'deadline'} saved={saved === 'deadline'} saveLabel={t('save')} onSave={saveDeadline} />
				</Section>

				<Section title={t('times.title')} hint={t('times.hint')}>
					{times.length === 0 ? (
						<EmptyState message={t('times.empty')} />
					) : (
						<div className='flex flex-wrap gap-1.5'>
							{times.map(time => (
								<span key={time} className='inline-flex items-center gap-1.5 rounded-full bg-zeno-paper-soft px-3 py-1 text-sm font-medium text-zeno-ink border border-zeno-line tabular-nums'>
									{time}
									<button
										type='button'
										onClick={() => setTimes(prev => prev.filter(item => item !== time))}
										className='rounded-full p-0.5 text-zeno-muted hover:bg-zeno-danger-soft hover:text-zeno-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber'
										title={t('times.remove')}
										aria-label={`${t('times.remove')} ${time}`}
									>
										<X className='h-3.5 w-3.5' />
									</button>
								</span>
							))}
						</div>
					)}
					<div className='mt-3 flex max-w-60 items-center gap-2'>
						<input
							className={`${fieldInputClassName} tabular-nums`}
							type='time'
							value={newTime}
							onChange={e => setNewTime(e.target.value)}
							aria-label={t('times.addPlaceholder')}
						/>
						<button
							type='button'
							onClick={addTime}
							className='inline-flex shrink-0 items-center gap-1 rounded-full border border-dashed border-zeno-line-strong px-3 py-2 text-xs font-semibold text-zeno-ink-soft hover:bg-zeno-paper-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber'
						>
							<Plus className='h-3.5 w-3.5' />
							{t('times.add')}
						</button>
					</div>
					<SaveRow saving={saving === 'times'} saved={saved === 'times'} saveLabel={t('save')} onSave={saveTimes} />
				</Section>

				<Section title={t('capacities.title')} hint={t('capacities.hint')}>
					<button
						type='button'
						role='switch'
						aria-checked={minibusesEnabled}
						onClick={() => setMinibusesEnabled(prev => !prev)}
						className='mb-4 flex w-full items-center justify-between gap-3 rounded-xl border border-zeno-line bg-zeno-paper-soft px-3 py-2.5 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber'
					>
						<span>
							<span className='block text-sm font-semibold text-zeno-ink'>{t('minibuses.title')}</span>
							<span className='block text-xs text-zeno-muted'>{t('minibuses.hint')}</span>
						</span>
						<span className={`relative h-6 w-11 shrink-0 rounded-full transition ${minibusesEnabled ? 'bg-zeno-amber' : 'bg-zeno-line-strong'}`}>
							<span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${minibusesEnabled ? 'start-5' : 'start-0.5'}`} />
						</span>
					</button>
					<div className='grid max-w-md gap-3 sm:grid-cols-2'>
						<FormField label={t('capacities.bus')}>
							<input
								className={`${fieldInputClassName} tabular-nums`}
								type='number'
								min={1}
								value={bus}
								onChange={e => setBus(Number(e.target.value))}
							/>
						</FormField>
						<FormField label={t('capacities.minibus')}>
							<input
								className={`${fieldInputClassName} tabular-nums`}
								type='number'
								min={1}
								value={minibus}
								disabled={!minibusesEnabled}
								onChange={e => setMinibus(Number(e.target.value))}
							/>
						</FormField>
					</div>
					<SaveRow saving={saving === 'capacities'} saved={saved === 'capacities'} saveLabel={t('save')} onSave={saveCapacities} />
				</Section>

				<Section title={t('autoComplete.title')} hint={t('autoComplete.hint')}>
					<div className='grid max-w-md gap-3 sm:grid-cols-3'>
						<FormField label={t('autoComplete.radius')}>
							<input
								className={`${fieldInputClassName} tabular-nums`}
								type='number'
								min={100}
								max={500}
								value={autoRadius}
								onChange={e => setAutoRadius(Number(e.target.value))}
							/>
						</FormField>
						<FormField label={t('autoComplete.freshness')}>
							<input
								className={`${fieldInputClassName} tabular-nums`}
								type='number'
								min={1}
								max={15}
								value={liveFresh}
								onChange={e => setLiveFresh(Number(e.target.value))}
							/>
						</FormField>
						<FormField label={t('autoComplete.fallback')}>
							<input
								className={`${fieldInputClassName} tabular-nums`}
								type='number'
								min={5}
								max={60}
								value={autoFallback}
								onChange={e => setAutoFallback(Number(e.target.value))}
							/>
						</FormField>
					</div>
					<SaveRow saving={saving === 'autoComplete'} saved={saved === 'autoComplete'} saveLabel={t('save')} onSave={saveAutoComplete} />
				</Section>
			</div>
		</div>
	)
}
