'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { BusFront, Gauge, Navigation } from 'lucide-react'
import type { Marker as MapLibreMarker } from 'maplibre-gl'
import { loadMaplibre } from '@/lib/maplibre-loader'
import {
	addPathLine,
	fitBoundsTo,
	makeBusMarker,
	makeStopMarker,
	paintBusMarker,
	removePathLine,
	setEtaBadge,
	type MapPoint,
} from '@/components/maps/mapkit'
import { useMap } from '@/components/maps/useMap'
import type { BusLiveTrip, FleetBus } from '@/lib/api-contracts'

interface FleetMapProps {
	trips: BusLiveTrip[]
	buses: FleetBus[] | null
}

const DEFAULT_CENTER: MapPoint = [35.213, 31.768]

export default function FleetMap({ trips, buses }: FleetMapProps) {
	const t = useTranslations('Fleet')
	const containerRef = useRef<HTMLDivElement | null>(null)
	const busMarkersRef = useRef<Map<string, MapLibreMarker>>(new Map())
	const stopMarkersRef = useRef<MapLibreMarker[]>([])
	const etaSpansRef = useRef<Map<string, HTMLSpanElement>>(new Map())
	const tripsRef = useRef<BusLiveTrip[]>(trips)
	tripsRef.current = trips
	const prevSelectedRef = useRef<string | null>(null)
	const userChoseRef = useRef(false)
	const selectedRef = useRef<string | null>(null)
	const [selectedTripId, setSelectedTripId] = useState<string | null>(null)
	selectedRef.current = selectedTripId

	const { mapRef, ready } = useMap(containerRef, { center: DEFAULT_CENTER, zoom: 10 })

	const busById = useMemo(() => {
		const map = new Map<string, FleetBus>()
		for (const bus of buses ?? []) map.set(bus.busId, bus)
		return map
	}, [buses])

	const onRoute = useMemo(
		() => trips.filter(trip => trip.isOnRouteNow && trip.live !== null),
		[trips]
	)
	const selected = useMemo(
		() => onRoute.find(trip => trip.tripId === selectedTripId) ?? null,
		[onRoute, selectedTripId]
	)

	// Default (or fallback) selection follows the live list until the user picks.
	const onRouteKey = useMemo(
		() => JSON.stringify(onRoute.map(trip => trip.tripId)),
		[onRoute]
	)
	useEffect(() => {
		if (!userChoseRef.current) {
			setSelectedTripId(onRoute[0]?.tripId ?? null)
		} else if (selectedTripId && !onRoute.some(trip => trip.tripId === selectedTripId)) {
			userChoseRef.current = false
			setSelectedTripId(onRoute[0]?.tripId ?? null)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onRouteKey])

	// Drop markers of the previous selection when the map unmounts.
	useEffect(() => {
		return () => {
			for (const marker of busMarkersRef.current.values()) marker.remove()
			busMarkersRef.current = new Map()
			for (const marker of stopMarkersRef.current) marker.remove()
			stopMarkersRef.current = []
		}
	}, [])

	function choose(tripId: string) {
		userChoseRef.current = true
		setSelectedTripId(tripId)
	}

	// Sync bus markers in place on every poll: move, add, drop — no rebuild.
	const markersKey = useMemo(
		() =>
			JSON.stringify(
				onRoute.map(trip => [
					trip.tripId,
					trip.live?.lng,
					trip.live?.lat,
					trip.live?.heading,
					trip.busId,
				])
			),
		[onRoute]
	)
	useEffect(() => {
		if (!ready || !mapRef.current) return
		let cancelled = false
		loadMaplibre().then(maplibregl => {
			const map = mapRef.current
			if (cancelled || !map) return
			const seen = new Set<string>()
			for (const trip of onRoute) {
				if (!trip.live) continue
				seen.add(trip.tripId)
				const plate = busById.get(trip.busId)?.licensePlate ?? trip.busId
				const isSelected = trip.tripId === selectedRef.current
				const existing = busMarkersRef.current.get(trip.tripId)
				if (existing) {
					existing.setLngLat([trip.live.lng, trip.live.lat])
					paintBusMarker(existing.getElement(), isSelected)
				} else {
					const element = makeBusMarker(plate, isSelected)
					element.addEventListener('click', () => {
						const latest = tripsRef.current.find(item => item.tripId === trip.tripId)
						if (latest?.isOnRouteNow) choose(trip.tripId)
					})
					const marker = new maplibregl.Marker({ element, anchor: 'bottom' })
						.setLngLat([trip.live.lng, trip.live.lat])
						.addTo(map)
					busMarkersRef.current.set(trip.tripId, marker)
				}
			}
			for (const [tripId, marker] of busMarkersRef.current) {
				if (!seen.has(tripId)) {
					marker.remove()
					busMarkersRef.current.delete(tripId)
				}
			}
		})
		return () => {
			cancelled = true
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ready, markersKey, busById])

	// Repaint selection ring when the user picks a different bus.
	useEffect(() => {
		for (const [tripId, marker] of busMarkersRef.current) {
			paintBusMarker(marker.getElement(), tripId === selectedTripId)
		}
	}, [selectedTripId])

	// Selected-trip overlay: route path + stop markers with ETA badges.
	// Refit only when the selection itself changes, not on ETA polls.
	const overlayKey = useMemo(
		() =>
			selected
				? JSON.stringify([selected.tripId, selected.stops, selected.path, selected.etas])
				: '',
		[selected]
	)
	useEffect(() => {
		if (!ready || !mapRef.current) return
		let cancelled = false
		loadMaplibre().then(maplibregl => {
			const map = mapRef.current
			if (cancelled || !map) return
			removePathLine(map, 'fleet-path')
			for (const marker of stopMarkersRef.current) marker.remove()
			stopMarkersRef.current = []
			etaSpansRef.current = new Map()

			const trip = tripsRef.current.find(item => item.tripId === selectedRef.current)
			const shouldFit = prevSelectedRef.current !== selectedRef.current
			prevSelectedRef.current = selectedRef.current
			if (!trip || !trip.isOnRouteNow) return

			if (trip.path && trip.path.length >= 2) {
				addPathLine(map, 'fleet-path', trip.path)
			}

			const points: MapPoint[] = []
			for (const stop of trip.stops) {
				if (stop.lat === null || stop.lng === null) continue
				points.push([stop.lng, stop.lat])
				const { element, badge } = makeStopMarker({
					name: stop.name,
					badge: { kind: 'eta', text: null },
				})
				if (badge) {
					setEtaBadge(
						badge,
						trip.etas?.[stop.stopId] != null
							? t('detail.etaShort', { minutes: trip.etas[stop.stopId] })
							: null
					)
					etaSpansRef.current.set(stop.stopId, badge)
				}
				stopMarkersRef.current.push(
					new maplibregl.Marker({ element, anchor: 'bottom' })
						.setLngLat([stop.lng, stop.lat])
						.addTo(map)
				)
			}

			if (shouldFit) {
				if (trip.live) points.push([trip.live.lng, trip.live.lat])
				fitBoundsTo(map, points, { maxZoom: 15 })
			}
		})
		return () => {
			cancelled = true
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ready, overlayKey])

	// ETA badges of the selected trip update in place on every poll.
	useEffect(() => {
		if (!ready || !selected?.etas) return
		for (const [stopId, span] of etaSpansRef.current) {
			const eta = selected.etas[stopId]
			setEtaBadge(span, eta != null ? t('detail.etaShort', { minutes: eta }) : null)
		}
	}, [ready, selected?.etas, t])

	const selectedBus = selected ? busById.get(selected.busId) : undefined

	return (
		<div className='overflow-hidden rounded-xl border border-gray-200 bg-white'>
			<div className='flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-3'>
				<h2 className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
					<Navigation className='h-4 w-4 text-blue-600' />
					{t('live.title')}
				</h2>
				<span className='text-xs text-gray-500 tabular-nums'>
					{t('live.onRoute', { count: onRoute.length })}
				</span>
			</div>
			<div className='grid md:grid-cols-[240px_1fr]'>
				<ul className='flex gap-2 overflow-x-auto border-b border-gray-100 p-3 md:max-h-[560px] md:flex-col md:overflow-y-auto md:border-b-0 md:border-e'>
					{onRoute.length === 0 && (
						<li className='w-full rounded-lg bg-gray-50 p-4 text-center text-xs text-gray-500'>
							{t('live.empty')}
						</li>
					)}
					{onRoute.map(trip => {
						const bus = busById.get(trip.busId)
						const isSelected = trip.tripId === selectedTripId
						return (
							<li key={trip.tripId}>
								<button
									type='button'
									onClick={() => choose(trip.tripId)}
									className={`flex w-full items-center gap-2.5 rounded-lg border p-2.5 text-start whitespace-nowrap md:whitespace-normal ${
										isSelected
											? 'border-green-500 bg-green-50'
											: 'border-gray-200 bg-white hover:border-gray-300'
									}`}
								>
									<span className='relative flex h-2.5 w-2.5 shrink-0'>
										<span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75' />
										<span className='relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500' />
									</span>
									<span className='min-w-0'>
										<span className='flex items-center gap-1.5 text-sm font-semibold text-gray-900'>
											<BusFront className='h-4 w-4 shrink-0 text-gray-500' />
											<span className='truncate'>{bus?.licensePlate ?? trip.busId}</span>
										</span>
										<span className='mt-0.5 block truncate text-xs text-gray-500'>
											{trip.routeName ?? trip.routeId}
											{trip.live?.speedKmh != null &&
												` · ${t('detail.speed', { speed: Math.round(trip.live.speedKmh) })}`}
										</span>
									</span>
								</button>
							</li>
						)
					})}
				</ul>
				<div className='relative'>
					<div ref={containerRef} className='h-[420px] w-full md:h-[560px]' />
					{selected && (
						<div className='absolute start-3 top-3 flex items-center gap-2 rounded-full bg-white/95 py-1.5 ps-3 pe-1.5 text-xs shadow-md'>
							<Gauge className='h-3.5 w-3.5 text-gray-500' />
							<span className='font-semibold text-gray-900'>
								{selectedBus?.licensePlate ?? selected.busId}
							</span>
							<span className='text-gray-500'>{selected.routeName ?? selected.routeId}</span>
							<Link
								href={`/buses/${selected.busId}`}
								className='rounded-full bg-blue-600 px-2.5 py-1 font-medium text-white hover:bg-blue-700'
							>
								{t('live.viewDetail')}
							</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
