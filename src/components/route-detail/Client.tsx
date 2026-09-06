'use client'

import { useMemo } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ArrowLeft, MapPin, Users } from 'lucide-react'
import type { RouteStopsData, StopDetail } from '@/lib/api-contracts'
import RouteMap from './RouteMap'

export interface RouteDetailStop {
	stopId: string
	name: string
	address: string | null
	lat: number | null
	lng: number | null
	type: string | null
	morningOrder: number | null
	morningMin: number | null
	afternoonOrder: number | null
	afternoonMin: number | null
}

interface RouteDetailProps {
	route: RouteStopsData
	stops: StopDetail[]
	students: number | null
}

export default function Client({ route, stops, students }: RouteDetailProps) {
	const t = useTranslations('Routes')

	const detailStops = useMemo<RouteDetailStop[]>(() => {
		const byId = new Map(stops.map(stop => [stop.stopId, stop]))
		const merged = new Map<string, RouteDetailStop>()

		const base = (stopId: string): RouteDetailStop => {
			const existing = merged.get(stopId)
			if (existing) return existing
			const info = byId.get(stopId)
			const created: RouteDetailStop = {
				stopId,
				name: info?.name ?? stopId,
				address: info?.address ?? null,
				lat: info?.lat ?? null,
				lng: info?.lng ?? null,
				type: info?.type ?? null,
				morningOrder: null,
				morningMin: null,
				afternoonOrder: null,
				afternoonMin: null,
			}
			merged.set(stopId, created)
			return created
		}

		for (const stop of route.stopsAfternoon) {
			const entry = base(stop.stopId)
			entry.afternoonOrder = stop.order
			entry.afternoonMin = stop.durationMin
		}
		for (const stop of route.stopsMorning) {
			const entry = base(stop.stopId)
			entry.morningOrder = stop.order
			entry.morningMin = stop.durationMin
		}

		return [...merged.values()].sort((a, b) => {
			const orderA = a.afternoonOrder ?? a.morningOrder ?? 999
			const orderB = b.afternoonOrder ?? b.morningOrder ?? 999
			return orderA - orderB
		})
	}, [route, stops])

	const hasMissingCoordinates = detailStops.some(stop => stop.lat === null || stop.lng === null)

	return (
		<div className='bg-gray-50'>
			<div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<Link
					href='/routes'
					className='mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-700'
				>
					<ArrowLeft className='h-4 w-4' />
					{t('backToList')}
				</Link>

				<div className='mb-6 flex flex-wrap items-end justify-between gap-4'>
					<div>
						<h1 className='text-3xl font-bold text-gray-900'>{route.name}</h1>
						<p className='mt-1 text-sm text-gray-500 font-mono'>{route.routeId}</p>
					</div>
					<div className='flex items-center gap-3'>
						<span className='inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-700'>
							<Users className='h-4 w-4 text-gray-400' />
							{students !== null ? (
								<span className='tabular-nums'>
									{students} {t('assignedStudents')}
								</span>
							) : (
								'—'
							)}
						</span>
						<span className='inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-700'>
							<MapPin className='h-4 w-4 text-gray-400' />
							<span className='tabular-nums'>
								{detailStops.length} {t('stopsOnRoute')}
							</span>
						</span>
					</div>
				</div>

				<div className='grid gap-6 lg:grid-cols-3'>
					<div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:col-span-2'>
						<RouteMap
							stops={detailStops}
							pathAfternoon={route.pathAfternoon}
							pathMorning={route.pathMorning}
						/>
					</div>

					<div className='space-y-6'>
						<div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
							<h2 className='mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500'>
								{t('routeLines')}
							</h2>
							<div className='space-y-3 text-sm text-gray-700'>
								<div className='flex items-center gap-3'>
									<span
										className='h-1 w-10 shrink-0 rounded-full'
										style={{ backgroundColor: '#2563eb' }}
									/>
									{t('afternoonLine')}
								</div>
								<div className='flex items-center gap-3'>
									<span
										className='h-0 w-10 shrink-0 border-t-2 border-dashed'
										style={{ borderColor: '#f59e0b' }}
									/>
									{t('morningLine')}
								</div>
							</div>
							<p className='mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500'>{t('offsetHint')}</p>
						</div>

						<div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
							<h2 className='mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500'>
								{t('routeInfo')}
							</h2>
							<dl className='space-y-3 text-sm'>
								<div className='flex justify-between gap-4'>
									<dt className='text-gray-500'>{t('assignedStudents')}</dt>
									<dd className='font-medium text-gray-900 tabular-nums'>{students ?? '—'}</dd>
								</div>
								<div className='flex justify-between gap-4'>
									<dt className='text-gray-500'>{t('morningColumn')}</dt>
									<dd className='font-medium text-gray-900 tabular-nums'>
										{route.stopsMorning.length} {t('stopsOnRoute').toLowerCase()}
									</dd>
								</div>
								<div className='flex justify-between gap-4'>
									<dt className='text-gray-500'>{t('afternoonColumn')}</dt>
									<dd className='font-medium text-gray-900 tabular-nums'>
										{route.stopsAfternoon.length} {t('stopsOnRoute').toLowerCase()}
									</dd>
								</div>
							</dl>
						</div>
					</div>
				</div>

				<div className='mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'>
					<div className='overflow-x-auto'>
						<table className='w-full'>
							<thead>
								<tr className='border-b border-gray-200'>
									<th className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider'>
										{t('stopColumn')}
									</th>
									<th className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider'>
										{t('morningColumn')}
									</th>
									<th className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider'>
										{t('afternoonColumn')}
									</th>
								</tr>
							</thead>
							<tbody>
								{detailStops.map(stop => (
									<tr key={stop.stopId} className='border-b border-gray-100 last:border-0'>
										<td className='px-6 py-4'>
											<div className='flex items-center gap-3'>
												<span
													className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
														stop.type === 'school' ? 'bg-amber-500' : 'bg-blue-600'
													}`}
												>
													{stop.afternoonOrder ?? stop.morningOrder ?? '—'}
												</span>
												<div>
													<div className='text-sm font-semibold text-gray-900'>{stop.name}</div>
													{stop.address && <div className='text-xs text-gray-500'>{stop.address}</div>}
												</div>
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
											{stop.morningMin !== null ? (
												<span className='tabular-nums'>
													+{stop.morningMin} {t('minutesShort')}
												</span>
											) : (
												<span className='text-gray-300'>—</span>
											)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
											{stop.afternoonMin !== null ? (
												<span className='tabular-nums'>
													+{stop.afternoonMin} {t('minutesShort')}
												</span>
											) : (
												<span className='text-gray-300'>—</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{hasMissingCoordinates && (
					<p className='mt-3 text-xs text-gray-500'>{t('mapNoCoordinates')}</p>
				)}
			</div>
		</div>
	)
}
