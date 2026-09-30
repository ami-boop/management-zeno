'use client'

import { useEffect, useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import {
	ArrowLeft,
	BusFront,
	Clock,
	Gauge,
	MapPin,
	Pencil,
	Route as RouteIcon,
	User,
} from 'lucide-react'
import type { BusLiveTrip, FleetBus } from '@/lib/api-contracts'
import { formatClockHHMM } from '@/utils/time'
import BusMap from './BusMap'

const POLL_INTERVAL_MS = 15_000

interface BusDetailClientProps {
	bus: FleetBus
	trips: BusLiveTrip[]
}

export default function Client({ bus, trips }: BusDetailClientProps) {
	const t = useTranslations('Fleet')
	const locale = useLocale()
	const router = useRouter()
	const [, setTick] = useState(0)

	const activeTrip = useMemo(
		() => trips.find(trip => trip.isOnRouteNow) ?? null,
		[trips]
	)

	// Live positions arrive with RSC refreshes; poll by re-rendering the server tree.
	useEffect(() => {
		const interval = setInterval(() => {
			router.refresh()
			setTick(value => value + 1)
		}, POLL_INTERVAL_MS)
		return () => clearInterval(interval)
	}, [router])

	return (
		<div className='mx-auto max-w-5xl px-4 py-8'>
			<div className='mb-6 flex flex-wrap items-start justify-between gap-3'>
				<div>
					<Link
						href='/buses'
						className='mb-2 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-700'
					>
						<ArrowLeft className='h-4 w-4' />
						{t('detail.backToList')}
					</Link>
					<h1 className='flex items-center gap-2 text-2xl font-bold text-gray-900'>
						<BusFront className='h-6 w-6 text-blue-600' />
						{bus.licensePlate}
					</h1>
				</div>
				<span
					className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
						bus.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
					}`}
				>
					{bus.isActive ? t('status.active') : t('status.inactive')}
				</span>
			</div>

			<div className='mb-6 grid gap-3 sm:grid-cols-3'>
				<div className='rounded-xl border border-gray-200 bg-white p-4'>
					<div className='flex items-center gap-2 text-xs text-gray-500'>
						<User className='h-3.5 w-3.5' />
						{t('fields.driverName')}
					</div>
					<div className='mt-1 text-sm font-semibold text-gray-900'>
						{bus.driverName ?? '—'}
					</div>
				</div>
				<div className='rounded-xl border border-gray-200 bg-white p-4'>
					<div className='flex items-center gap-2 text-xs text-gray-500'>
						<Gauge className='h-3.5 w-3.5' />
						{t('fields.capacity')}
					</div>
					<div className='mt-1 text-sm font-semibold text-gray-900 tabular-nums'>
						{bus.capacity}
					</div>
				</div>
				<div className='rounded-xl border border-gray-200 bg-white p-4'>
					<div className='flex items-center gap-2 text-xs text-gray-500'>
						<Pencil className='h-3.5 w-3.5' />
						{t('fields.notes')}
					</div>
					<div className='mt-1 truncate text-sm font-semibold text-gray-900'>
						{bus.notes ?? '—'}
					</div>
				</div>
			</div>

			<div
				className={`mb-6 rounded-xl border p-5 ${
					activeTrip ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
				}`}
			>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<div className='flex items-center gap-2.5'>
						<span
							className={`relative flex h-3 w-3 ${
								activeTrip ? '' : 'opacity-40'
							}`}
						>
							{activeTrip && (
								<span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75' />
							)}
							<span
								className={`relative inline-flex h-3 w-3 rounded-full ${
									activeTrip ? 'bg-green-500' : 'bg-gray-300'
								}`}
							/>
						</span>
						<div>
							<div className='text-sm font-semibold text-gray-900'>
								{activeTrip ? t('detail.onRouteNow') : t('detail.notOnRoute')}
							</div>
							{activeTrip ? (
								<div className='mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600'>
									<span className='inline-flex items-center gap-1'>
										<RouteIcon className='h-3.5 w-3.5' />
										{activeTrip.routeName ?? activeTrip.routeId}
									</span>
									<span className='inline-flex items-center gap-1'>
										<Clock className='h-3.5 w-3.5' />
										{t('detail.departure', {
											time: formatClockHHMM(activeTrip.scheduledAtISO, locale),
										})}
									</span>
									{activeTrip.live?.speedKmh != null && (
										<span className='inline-flex items-center gap-1'>
											<Gauge className='h-3.5 w-3.5' />
											{t('detail.speed', {
												speed: Math.round(activeTrip.live.speedKmh),
											})}
										</span>
									)}
								</div>
							) : (
								<div className='mt-0.5 text-xs text-gray-500'>
									{t('detail.noTripsToday')}
								</div>
							)}
						</div>
					</div>
					{activeTrip?.live?.updatedAtMs != null && (
						<div className='text-xs text-gray-500 tabular-nums'>
							{t('detail.lastUpdate', {
								time: formatClockHHMM(activeTrip.live.updatedAtMs, locale),
							})}
						</div>
					)}
				</div>
			</div>

			{activeTrip ? (
				<BusMap trip={activeTrip} />
			) : (
				trips.length > 0 && (
					<div className='rounded-xl border border-gray-200 bg-white p-4'>
						<h2 className='mb-3 text-sm font-semibold text-gray-900'>
							{t('detail.tripsToday')}
						</h2>
						<ul className='divide-y divide-gray-100'>
							{trips.map(trip => (
								<li key={trip.tripId} className='flex items-center gap-3 py-2 text-sm'>
									<MapPin className='h-4 w-4 text-gray-400' />
									<span className='text-gray-900'>{trip.routeName ?? trip.routeId}</span>
									<span className='text-gray-500 tabular-nums'>
										{formatClockHHMM(trip.scheduledAtISO, locale)}
									</span>
									<span className='ms-auto rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600'>
										{t(`detail.tripStatus.${trip.status}`)}
									</span>
								</li>
							))}
						</ul>
					</div>
				)
			)}
		</div>
	)
}
