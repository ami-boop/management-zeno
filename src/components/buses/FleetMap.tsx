'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { BusFront, Gauge, Navigation } from 'lucide-react'
import type { Map as MapLibreMap, Marker as MapLibreMarker } from 'maplibre-gl'
import { loadMaplibre } from '@/lib/maplibre-loader'
import type { BusLiveTrip, FleetBus } from '@/lib/api-contracts'

interface FleetMapProps {
	trips: BusLiveTrip[]
	buses: FleetBus[] | null
}

const BUS_COLOR = '#16a34a'
const STOP_COLOR = '#2563eb'
const DEFAULT_CENTER: [number, number] = [35.213, 31.768]

function fitBoundsTo(map: MapLibreMap, points: Array<[number, number]>) {
	if (points.length === 0) return
	if (points.length === 1) {
		map.easeTo({ center: points[0], zoom: 14 })
		return
	}
	let minLng = points[0][0]
	let maxLng = points[0][0]
	let minLat = points[0][1]
	let maxLat = points[0][1]
	for (const [lng, lat] of points) {
		minLng = Math.min(minLng, lng)
		maxLng = Math.max(maxLng, lng)
		minLat = Math.min(minLat, lat)
		maxLat = Math.max(maxLat, lat)
	}
	map.fitBounds(
		[
			[minLng, minLat],
			[maxLng, maxLat],
		],
		{ padding: 60, maxZoom: 15, duration: 600 }
	)
}

function makeBusElement(plate: string, selected: boolean): HTMLDivElement {
	const wrapper = document.createElement('div')
	wrapper.style.display = 'flex'
	wrapper.style.flexDirection = 'column'
	wrapper.style.alignItems = 'center'
	wrapper.style.gap = '2px'
	wrapper.style.pointerEvents = 'auto'
	wrapper.style.cursor = 'pointer'

	const label = document.createElement('div')
	label.style.padding = '3px 9px'
	label.style.borderRadius = '999px'
	label.style.backgroundColor = selected ? BUS_COLOR : 'rgba(255, 255, 255, 0.95)'
	label.style.border = selected ? `1.5px solid ${BUS_COLOR}` : '1.5px solid #dfe5e8'
	label.style.boxShadow = '0 1px 4px rgba(21, 35, 45, 0.25)'
	label.style.whiteSpace = 'nowrap'
	label.style.fontFamily = 'inherit'
	label.style.fontSize = '11px'
	label.style.fontWeight = '700'
	label.style.color = selected ? '#ffffff' : '#40515c'
	label.style.lineHeight = '1.2'
	label.textContent = plate

	const dot = document.createElement('div')
	dot.style.width = '14px'
	dot.style.height = '14px'
	dot.style.borderRadius = '50%'
	dot.style.backgroundColor = BUS_COLOR
	dot.style.border = '3px solid #ffffff'
	dot.style.boxShadow = '0 1px 4px rgba(21, 35, 45, 0.35)'

	wrapper.appendChild(label)
	wrapper.appendChild(dot)
	return wrapper
}

function paintBusElement(element: HTMLElement, selected: boolean) {
	const label = element.firstChild as HTMLElement | null
	if (!label) return
	label.style.backgroundColor = selected ? BUS_COLOR : 'rgba(255, 255, 255, 0.95)'
	label.style.border = selected ? `1.5px solid ${BUS_COLOR}` : '1.5px solid #dfe5e8'
	label.style.color = selected ? '#ffffff' : '#40515c'
}

export default function FleetMap({ trips, buses }: FleetMapProps) {
	const t = useTranslations('Fleet')
	const containerRef = useRef<HTMLDivElement | null>(null)
	const mapRef = useRef<MapLibreMap | null>(null)
	const busMarkersRef = useRef<Map<string, MapLibreMarker>>(new Map())
	const stopMarkersRef = useRef<MapLibreMarker[]>([])
	const etaSpansRef = useRef<Map<string, HTMLSpanElement>>(new Map())
	const tripsRef = useRef<BusLiveTrip[]>(trips)
	tripsRef.current = trips
	const prevSelectedRef = useRef<string | null>(null)
	const userChoseRef = useRef(false)
	const selectedRef = useRef<string | null>(null)
	const [ready, setReady] = useState(false)
	const [selectedTripId, setSelectedTripId] = useState<string | null>(null)
	selectedRef.current = selectedTripId

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

	function choose(tripId: string) {
		userChoseRef.current = true
		setSelectedTripId(tripId)
	}

	// Map instance is created once; all live data syncs below without teardown.
	useEffect(() => {
		let cancelled = false
		const container = containerRef.current
		if (!container) return
		loadMaplibre().then(maplibregl => {
			if (cancelled || !containerRef.current || containerRef.current !== container) return
			const map = new maplibregl.Map({
				container,
				style: 'https://tiles.openfreemap.org/styles/liberty',
				center: DEFAULT_CENTER,
				zoom: 10,
				attributionControl: { compact: true },
			})
			mapRef.current = map
			map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
			map.on('load', () => {
				if (mapRef.current !== map) return
				setReady(true)
			})
		})
		setReady(false)
		return () => {
			cancelled = true
			for (const marker of busMarkersRef.current.values()) marker.remove()
			busMarkersRef.current = new Map()
			for (const marker of stopMarkersRef.current) marker.remove()
			stopMarkersRef.current = []
			mapRef.current?.remove()
			mapRef.current = null
		}
	}, [])

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
			if (cancelled || !mapRef.current) return
			const map = mapRef.current
			const seen = new Set<string>()
			for (const trip of onRoute) {
				if (!trip.live) continue
				seen.add(trip.tripId)
				const plate = busById.get(trip.busId)?.licensePlate ?? trip.busId
				const isSelected = trip.tripId === selectedRef.current
				const existing = busMarkersRef.current.get(trip.tripId)
				if (existing) {
					existing.setLngLat([trip.live.lng, trip.live.lat])
					paintBusElement(existing.getElement(), isSelected)
				} else {
					const element = makeBusElement(plate, isSelected)
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
			paintBusElement(marker.getElement(), tripId === selectedTripId)
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
			if (cancelled || !mapRef.current) return
			const map = mapRef.current
			if (map.getLayer('fleet-path-line')) map.removeLayer('fleet-path-line')
			if (map.getSource('fleet-path')) map.removeSource('fleet-path')
			for (const marker of stopMarkersRef.current) marker.remove()
			stopMarkersRef.current = []
			etaSpansRef.current = new Map()

			const trip = tripsRef.current.find(item => item.tripId === selectedRef.current)
			const shouldFit = prevSelectedRef.current !== selectedRef.current
			prevSelectedRef.current = selectedRef.current
			if (!trip || !trip.isOnRouteNow) return

			if (trip.path && trip.path.length >= 2) {
				map.addSource('fleet-path', {
					type: 'geojson',
					data: {
						type: 'Feature',
						properties: {},
						geometry: { type: 'LineString', coordinates: trip.path },
					},
				})
				map.addLayer({
					id: 'fleet-path-line',
					type: 'line',
					source: 'fleet-path',
					layout: { 'line-join': 'round', 'line-cap': 'round' },
					paint: { 'line-color': '#2563eb', 'line-width': 4, 'line-opacity': 0.8 },
				})
			}

			const points: Array<[number, number]> = []
			for (const stop of trip.stops) {
				if (stop.lat === null || stop.lng === null) continue
				points.push([stop.lng, stop.lat])
				const eta = trip.etas?.[stop.stopId]

				const wrapper = document.createElement('div')
				wrapper.style.display = 'flex'
				wrapper.style.flexDirection = 'column'
				wrapper.style.alignItems = 'center'
				wrapper.style.gap = '4px'
				wrapper.style.pointerEvents = 'auto'
				wrapper.style.cursor = 'default'

				const label = document.createElement('div')
				label.style.display = 'flex'
				label.style.alignItems = 'center'
				label.style.gap = '6px'
				label.style.padding = '3px 9px'
				label.style.borderRadius = '999px'
				label.style.backgroundColor = 'rgba(255, 255, 255, 0.95)'
				label.style.border = '1.5px solid #dfe5e8'
				label.style.boxShadow = '0 1px 4px rgba(21, 35, 45, 0.18)'
				label.style.whiteSpace = 'nowrap'
				label.style.fontFamily = 'inherit'
				label.style.fontSize = '11px'
				label.style.fontWeight = '700'
				label.style.color = '#40515c'
				label.style.lineHeight = '1.2'

				const nameSpan = document.createElement('span')
				nameSpan.textContent = stop.name
				label.appendChild(nameSpan)

				const etaSpan = document.createElement('span')
				etaSpan.style.padding = '1px 6px'
				etaSpan.style.borderRadius = '999px'
				etaSpan.style.backgroundColor = '#2563eb'
				etaSpan.style.color = '#ffffff'
				etaSpan.style.fontSize = '10px'
				if (eta != null) {
					etaSpan.textContent = t('detail.etaShort', { minutes: eta })
				} else {
					etaSpan.style.display = 'none'
				}
				etaSpansRef.current.set(stop.stopId, etaSpan)
				label.appendChild(etaSpan)

				const dot = document.createElement('div')
				dot.style.width = '12px'
				dot.style.height = '12px'
				dot.style.borderRadius = '50%'
				dot.style.backgroundColor = '#ffffff'
				dot.style.border = `3px solid ${STOP_COLOR}`
				dot.style.boxShadow = '0 1px 4px rgba(21, 35, 45, 0.25)'

				wrapper.appendChild(label)
				wrapper.appendChild(dot)
				stopMarkersRef.current.push(
					new maplibregl.Marker({ element: wrapper, anchor: 'bottom' })
						.setLngLat([stop.lng, stop.lat])
						.addTo(map)
				)
			}

			if (shouldFit) {
				if (trip.live) points.push([trip.live.lng, trip.live.lat])
				fitBoundsTo(map, points)
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
			if (eta == null) {
				span.style.display = 'none'
			} else {
				span.style.display = ''
				span.textContent = t('detail.etaShort', { minutes: eta })
			}
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
