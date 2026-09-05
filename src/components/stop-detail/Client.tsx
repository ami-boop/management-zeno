'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { MapPin, Route as RouteIcon } from 'lucide-react'
import type { StopUsage } from '@/lib/api-contracts'
import StopMap from './StopMap'

interface StopDetailProps {
	usage: StopUsage
}

export default function Client({ usage }: StopDetailProps) {
	const t = useTranslations('Stops')

	return (
		<div className='bg-gray-50'>
			<div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='mb-6'>
					<h1 className='text-3xl font-bold text-gray-900'>{usage.name ?? usage.stopId}</h1>
					<p className='mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500'>
						{usage.address && (
							<span className='inline-flex items-center gap-1.5'>
								<MapPin className='h-3.5 w-3.5' />
								{usage.address}
							</span>
						)}
						{usage.lat !== null && usage.lng !== null && (
							<span className='font-mono'>
								{usage.lat.toFixed(5)}, {usage.lng.toFixed(5)}
							</span>
						)}
					</p>
				</div>

				<div className='grid gap-6 lg:grid-cols-3'>
					<div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:col-span-2'>
						<StopMap name={usage.name ?? usage.stopId} lat={usage.lat} lng={usage.lng} />
					</div>

					<div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
						<h2 className='mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500'>
							<RouteIcon className='h-4 w-4' />
							{t('routesServing')} ({usage.routes.length})
						</h2>
						{usage.routes.length === 0 ? (
							<p className='text-sm text-gray-400'>{t('noRoutes')}</p>
						) : (
							<ul className='space-y-3 text-sm'>
								{usage.routes.map(route => (
									<li key={route.routeId} className='border-b border-gray-100 pb-3 last:border-0 last:pb-0'>
										<Link
											href={`/routes/${route.routeId}`}
											className='font-medium text-gray-900 hover:text-blue-700'
										>
											{route.name}
										</Link>
										<div className='mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500'>
											<span>
												{t('morningColumn')}:{' '}
												{route.morning ? (
													<span className='tabular-nums'>
														#{route.morning.order} · +{route.morning.durationMin} {t('minutesShort')}
													</span>
												) : (
													'—'
												)}
											</span>
											<span>
												{t('afternoonColumn')}:{' '}
												{route.afternoon ? (
													<span className='tabular-nums'>
														#{route.afternoon.order} · +{route.afternoon.durationMin} {t('minutesShort')}
													</span>
												) : (
													'—'
												)}
											</span>
										</div>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
