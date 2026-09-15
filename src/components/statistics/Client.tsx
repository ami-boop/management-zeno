'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Armchair, Bus, CalendarCheck, Download, Users } from 'lucide-react'
import StatCard from '@/components/ui/stat-card'
import ErrorBanner from '@/components/ErrorBanner'
import EmptyState from '@/components/EmptyState'
import { getStatistics } from '@/app/actions/statistics'
import type { StatisticsData, TripStat } from '@/lib/api-contracts'
import { todayInIsrael } from '@/lib/schedule-times'
import { AttendanceTrend, LoadBars, RouteBars, TripFillBars } from './charts'
import { downloadCsv, statisticsCsv } from './csv'

type Tab = 'load' | 'attendance' | 'routes' | 'friend'

interface StatisticsClientProps {
	initial: StatisticsData | null
	initialDate: string
	initialRange: number
}

function formatDate(date: string): string {
	const [y, m, d] = date.split('-')
	if (!y || !m || !d) return date
	return `${d}.${m}.${y}`
}

function pct(rate: number | null): string {
	if (rate === null) return '—'
	return `${(rate * 100).toFixed(1)}%`
}

function TripTable({ trips, routeLabel, timeLabel, studentsLabel, seatsLabel, fillLabel }: {
	trips: TripStat[]
	routeLabel: string
	timeLabel: string
	studentsLabel: string
	seatsLabel: string
	fillLabel: string
}) {
	return (
		<div className='overflow-x-auto'>
			<table className='w-full text-sm'>
				<thead>
					<tr className='text-start text-xs text-zeno-muted'>
						<th className='px-2 py-1.5 font-semibold'>{routeLabel}</th>
						<th className='px-2 py-1.5 font-semibold tabular-nums'>{timeLabel}</th>
						<th className='px-2 py-1.5 font-semibold tabular-nums'>{studentsLabel}</th>
						<th className='px-2 py-1.5 font-semibold tabular-nums'>{seatsLabel}</th>
						<th className='px-2 py-1.5 font-semibold tabular-nums'>{fillLabel}</th>
					</tr>
				</thead>
				<tbody>
					{trips.map(t => (
						<tr key={t.tripId} className='border-t border-zeno-line text-zeno-ink'>
							<td className='px-2 py-1.5 font-medium'>{t.routeId || '—'}</td>
							<td className='px-2 py-1.5 tabular-nums'>{t.scheduledTime || '—'}</td>
							<td className='px-2 py-1.5 tabular-nums'>{t.students}</td>
							<td className='px-2 py-1.5 tabular-nums'>{t.seats}</td>
							<td className={`px-2 py-1.5 font-bold tabular-nums ${t.fillRate !== null && t.fillRate > 1 ? 'text-zeno-danger' : ''}`}>
								{t.fillRate === null ? '—' : `${Math.round(t.fillRate * 100)}%`}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default function Client({ initial, initialDate, initialRange }: StatisticsClientProps) {
	const t = useTranslations('Statistics')
	const locale = useLocale()
	const isRTL = locale === 'he'
	const [data, setData] = useState<StatisticsData | null>(initial)
	const [end, setEnd] = useState(initialDate)
	const [range, setRange] = useState<number>(initialRange)
	const [tab, setTab] = useState<Tab>('load')
	const [loading, setLoading] = useState(false)
	const [loadError, setLoadError] = useState(false)

	async function reload(nextEnd: string, nextRange: number) {
		setEnd(nextEnd)
		setRange(nextRange)
		setLoading(true)
		setLoadError(false)
		const result = await getStatistics(nextEnd, nextRange)
		setLoading(false)
		if (!result.ok || !result.data) {
			setLoadError(true)
			return
		}
		setData(result.data)
	}

	const today = todayInIsrael().date
	const periodLabel = data
		? data.range === 1
			? formatDate(data.end)
			: `${formatDate(data.start)} – ${formatDate(data.end)}`
		: formatDate(end)

	const overfull = (data?.tripHighlights.fullest ?? []).filter(t => t.fillRate !== null && t.fillRate > 1)
	const showAlert = data !== null && (overfull.length > 0 || data.totals.missing > 0 || data.totals.friendPending > 0)

	function handleCsv() {
		if (!data) return
		downloadCsv(`statistics-${data.start}_${data.end}.csv`, statisticsCsv(data))
	}

	return (
		<div className='mx-auto max-w-6xl px-4 py-6'>
			<div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight text-zeno-ink'>{t('title')}</h1>
					<p className='zeno-kicker mt-1 tabular-nums'>{periodLabel}</p>
				</div>
				<div className='flex flex-wrap items-center gap-2'>
					<div className='inline-flex rounded-full border border-zeno-line bg-zeno-surface p-1'>
						<button type='button' onClick={() => void reload(today, 1)} aria-pressed={range === 1 && end === today} className={`rounded-full px-3 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber ${range === 1 && end === today ? 'bg-zeno-amber text-zeno-amber-fg' : 'text-zeno-ink-soft hover:bg-zeno-paper-soft'}`}>{t('period.today')}</button>
						{([7, 30] as const).map(r => (
							<button key={r} type='button' onClick={() => void reload(today, r)} aria-pressed={range === r} className={`rounded-full px-3 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber ${range === r ? 'bg-zeno-amber text-zeno-amber-fg' : 'text-zeno-ink-soft hover:bg-zeno-paper-soft'}`}>{t(`period.range${r}`)}</button>
						))}
					</div>
					<input
						type='date'
						value={end}
						max={today}
						onChange={e => { if (e.target.value) void reload(e.target.value, range) }}
						className='rounded-xl border border-zeno-line bg-zeno-surface px-3 py-1.5 text-xs font-medium text-zeno-ink-soft tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber'
						aria-label={t('period.customDay')}
					/>
					<button type='button' onClick={handleCsv} disabled={!data} className='zeno-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber disabled:opacity-40'>
						<Download className='h-4 w-4' />
						{t('csv')}
					</button>
				</div>
			</div>

			{loadError && <ErrorBanner message={t('errors.loadFailed')} />}
			{loading && <p className='mb-3 text-sm text-zeno-muted'>{t('loading')}</p>}

			{!data ? (
				<EmptyState message={t('noData')} />
			) : (
				<>
					{showAlert && (
						<div role='alert' className='mb-4 rounded-xl border border-zeno-danger/40 bg-zeno-danger-soft px-4 py-2.5 text-sm text-zeno-danger tabular-nums'>
							{[
								overfull.length > 0 ? t('alerts.overfull', { count: overfull.length }) : null,
								data.totals.missing > 0 ? t('alerts.missing', { count: data.totals.missing }) : null,
								data.totals.friendPending > 0 ? t('alerts.friendPending', { count: data.totals.friendPending }) : null,
							].filter(Boolean).join(' · ')}
						</div>
					)}

					<div className='mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4'>
						<StatCard label={t('cards.riding')} value={data.totals.going} tone='sage' icon={<Users className='h-5 w-5' />} />
						<StatCard label={t('cards.attendance')} value={pct(data.totals.attendanceRate)} tone='ink' icon={<CalendarCheck className='h-5 w-5' />} />
						<StatCard label={t('cards.seats')} value={data.totals.seatsOrdered} tone='amber' icon={<Armchair className='h-5 w-5' />} />
						<StatCard label={t('cards.trips')} value={data.totals.trips} tone='ink' icon={<Bus className='h-5 w-5' />} />
					</div>

					<div className='mb-4 inline-flex rounded-full border border-zeno-line bg-zeno-surface p-1'>
						{(['load', 'attendance', 'routes', 'friend'] as const).map(v => (
							<button key={v} type='button' onClick={() => setTab(v)} aria-pressed={tab === v} className={`rounded-full px-3 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber ${tab === v ? 'bg-zeno-amber text-zeno-amber-fg' : 'text-zeno-ink-soft hover:bg-zeno-paper-soft'}`}>{t(`tabs.${v}`)}</button>
						))}
					</div>

					{tab === 'load' && (
						<div className='grid gap-4'>
							<section className='zeno-card p-4 sm:p-6'>
								<h2 className='mb-1 text-lg font-bold text-zeno-ink'>{t('load.title')}</h2>
								<p className='mb-4 text-sm text-zeno-muted'>{t('load.hint')}</p>
								{data.range === 1 ? (
									data.days[0]?.tripsDetail.length ? (
										<>
											<TripFillBars trips={data.days[0].tripsDetail} isRTL={isRTL} />
											<div className='mt-4'>
												<TripTable trips={data.days[0].tripsDetail} routeLabel={t('load.route')} timeLabel={t('load.time')} studentsLabel={t('load.students')} seatsLabel={t('load.seats')} fillLabel={t('load.fill')} />
											</div>
										</>
									) : (
										<EmptyState message={t('noData')} />
									)
								) : (
									<LoadBars days={data.days} studentsLabel={t('load.students')} seatsLabel={t('load.seats')} isRTL={isRTL} />
								)}
							</section>
							<div className='grid gap-4 md:grid-cols-2'>
								<section className='zeno-card p-4 sm:p-6'>
									<h3 className='mb-3 text-base font-bold text-zeno-ink'>{t('load.fullest')}</h3>
									{data.tripHighlights.fullest.length === 0 ? (
										<EmptyState message={t('noData')} />
									) : (
										<TripTable trips={data.tripHighlights.fullest} routeLabel={t('load.route')} timeLabel={t('load.time')} studentsLabel={t('load.students')} seatsLabel={t('load.seats')} fillLabel={t('load.fill')} />
									)}
								</section>
								<section className='zeno-card p-4 sm:p-6'>
									<h3 className='mb-3 text-base font-bold text-zeno-ink'>{t('load.emptiest')}</h3>
									{data.tripHighlights.emptiest.length === 0 ? (
										<EmptyState message={t('noData')} />
									) : (
										<TripTable trips={data.tripHighlights.emptiest} routeLabel={t('load.route')} timeLabel={t('load.time')} studentsLabel={t('load.students')} seatsLabel={t('load.seats')} fillLabel={t('load.fill')} />
									)}
								</section>
							</div>
						</div>
					)}

					{tab === 'attendance' && (
						<div className='grid gap-4'>
							<section className='zeno-card p-4 sm:p-6'>
								<h2 className='mb-1 text-lg font-bold text-zeno-ink'>{t('attendance.title')}</h2>
								<p className='mb-4 text-sm text-zeno-muted tabular-nums'>
									{t('attendance.summary', { going: data.totals.going, notGoing: data.totals.notGoing, missing: data.totals.missing })}
								</p>
								{data.range === 1 ? (
									<EmptyState message={t('attendance.singleDayHint')} />
								) : (
									<AttendanceTrend days={data.days} rateLabel={t('attendance.rate')} isRTL={isRTL} />
								)}
							</section>
							<section className='zeno-card p-4 sm:p-6'>
								<h3 className='mb-3 text-base font-bold text-zeno-ink'>{t('attendance.chronic')}</h3>
								{data.chronicNoShow.length === 0 ? (
									<EmptyState message={t('noData')} />
								) : (
									<div className='overflow-x-auto'>
										<table className='w-full text-sm'>
											<thead>
												<tr className='text-start text-xs text-zeno-muted'>
													<th className='px-2 py-1.5 font-semibold'>{t('attendance.student')}</th>
													<th className='px-2 py-1.5 font-semibold tabular-nums'>{t('attendance.notGoing')}</th>
													<th className='px-2 py-1.5 font-semibold tabular-nums'>{t('attendance.missing')}</th>
												</tr>
											</thead>
											<tbody>
												{data.chronicNoShow.map(e => (
													<tr key={e.uid} className='border-t border-zeno-line text-zeno-ink'>
														<td className='px-2 py-1.5 font-medium'>{`${e.firstName} ${e.lastName}`.trim() || e.uid}</td>
														<td className='px-2 py-1.5 tabular-nums'>{e.notGoing}</td>
														<td className='px-2 py-1.5 tabular-nums'>{e.missing}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}
							</section>
						</div>
					)}

					{tab === 'routes' && (
						<div className='grid gap-4'>
							<section className='zeno-card p-4 sm:p-6'>
								<h2 className='mb-4 text-lg font-bold text-zeno-ink'>{t('routes.title')}</h2>
								{data.routes.length === 0 ? (
									<EmptyState message={t('noData')} />
								) : (
									<RouteBars routes={data.routes} isRTL={isRTL} />
								)}
							</section>
							<section className='zeno-card p-4 sm:p-6'>
								<h3 className='mb-3 text-base font-bold text-zeno-ink'>{t('routes.stops')}</h3>
								{data.stops.length === 0 ? (
									<EmptyState message={t('noData')} />
								) : (
									<div className='overflow-x-auto'>
										<table className='w-full text-sm'>
											<thead>
												<tr className='text-start text-xs text-zeno-muted'>
													<th className='px-2 py-1.5 font-semibold'>{t('routes.stop')}</th>
													<th className='px-2 py-1.5 font-semibold tabular-nums'>{t('routes.boardings')}</th>
													<th className='px-2 py-1.5 font-semibold'>{t('routes.note')}</th>
												</tr>
											</thead>
											<tbody>
												{data.stops.map(s => (
													<tr key={s.stopId} className='border-t border-zeno-line text-zeno-ink'>
														<td className='px-2 py-1.5 font-medium'>{s.stopId}</td>
														<td className='px-2 py-1.5 tabular-nums'>{s.boardings}</td>
														<td className='px-2 py-1.5 text-xs text-zeno-muted'>{s.boardings <= 1 ? t('routes.mergeCandidate') : '—'}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}
							</section>
						</div>
					)}

					{tab === 'friend' && (
						<div className='grid gap-4'>
							<div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
								<StatCard label={t('friend.total')} value={data.friend.total} tone='ink' icon={<Users className='h-5 w-5' />} />
								<StatCard label={t('friend.pending')} value={data.friend.pending} tone='amber' icon={<Users className='h-5 w-5' />} />
								<StatCard label={t('friend.approved')} value={data.friend.approved} tone='sage' icon={<Users className='h-5 w-5' />} />
								<StatCard label={t('friend.rejected')} value={data.friend.rejected} tone='ink' icon={<Users className='h-5 w-5' />} />
							</div>
							<section className='zeno-card p-4 sm:p-6'>
								<h3 className='mb-3 text-base font-bold text-zeno-ink'>{t('friend.pendingTitle')}</h3>
								{data.friend.pendingItems.length === 0 ? (
									<EmptyState message={t('noData')} />
								) : (
									<div className='overflow-x-auto'>
										<table className='w-full text-sm'>
											<thead>
												<tr className='text-start text-xs text-zeno-muted'>
													<th className='px-2 py-1.5 font-semibold'>{t('attendance.student')}</th>
													<th className='px-2 py-1.5 font-semibold tabular-nums'>{t('friend.date')}</th>
													<th className='px-2 py-1.5 font-semibold'>{t('load.route')}</th>
												</tr>
											</thead>
											<tbody>
												{data.friend.pendingItems.map(item => (
													<tr key={`${item.date}_${item.uid}`} className='border-t border-zeno-line text-zeno-ink'>
														<td className='px-2 py-1.5 font-medium'>{`${item.firstName} ${item.lastName}`.trim() || item.uid}</td>
														<td className='px-2 py-1.5 tabular-nums'>{formatDate(item.date)}</td>
														<td className='px-2 py-1.5'>{item.tripId}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}
							</section>
						</div>
					)}
				</>
			)}
		</div>
	)
}
