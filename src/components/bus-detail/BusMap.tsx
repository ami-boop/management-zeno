'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Navigation } from 'lucide-react'
import type { Map as MapLibreMap, Marker as MapLibreMarker } from 'maplibre-gl'
import { loadMaplibre } from '@/lib/maplibre-loader'
import type { BusLiveTrip } from '@/lib/api-contracts'

interface BusMapProps {
	trip: BusLiveTrip
}

const STOP_COLOR = '#2563eb'
const BUS_COLOR = '#16a34a'

function fitBoundsTo(
	map: MapLibreMap,
	points: Array<[number, number]>
) {
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
		{ padding: 60, maxZoom: 16, duration: 600 }
	)
}

export default function BusMap({ trip }: BusMapProps) {
	const t = useTranslations('Fleet')
	const containerRef = useRef<HTMLDivElement | null>(null)
	const mapRef = useRef<MapLibreMap | null>(null)
	const busMarkerRef = useRef<MapLibreMarker | null>(null)
	// ETA badges by stopId — updated in place on every poll without a map rebuild.
	const etaSpansRef = useRef<Map<string, HTMLSpanElement>>(new Map())
	const [ready, setReady] = useState(false)
	const [lng, lat] = [trip.live?.lng ?? null, trip.live?.lat ?? null]
	// RSC refreshes produce new (deep-equal) arrays every poll — rebuild the map
	// only when the geometry itself changes.
	const pathKey = useMemo(() => JSON.stringify(trip.path), [trip.path])
	const stopsKey = useMemo(() => JSON.stringify(trip.stops), [trip.stops])

	useEffect(() => {
		const geoStops = trip.stops
			.filter(stop => stop.lat !== null && stop.lng !== null)
			.map(stop => [stop.lng!, stop.lat!] as [number, number])
		const first = geoStops[0]
		const center: [number, number] = lng !== null && lat !== null
			? [lng, lat]
			: first ?? [35.213, 31.768]

		let cancelled = false
		const container = containerRef.current
		if (!container) return

		loadMaplibre().then(maplibregl => {
			if (cancelled || !containerRef.current || containerRef.current !== container) return
			const map = new maplibregl.Map({
				container,
				style: 'https://tiles.openfreemap.org/styles/liberty',
				center,
				zoom: 13,
				attributionControl: { compact: true },
			})
			mapRef.current = map
			map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
			etaSpansRef.current = new Map()
			map.on('load', () => {
				if (mapRef.current !== map) return

				if (trip.path && trip.path.length >= 2) {
					map.addSource('route-path', {
						type: 'geojson',
						data: {
							type: 'Feature',
							properties: {},
							geometry: {
								type: 'LineString',
								coordinates: trip.path,
							},
						},
					})
					map.addLayer({
						id: 'route-path-line',
						type: 'line',
						source: 'route-path',
						layout: { 'line-join': 'round', 'line-cap': 'round' },
						paint: {
							'line-color': '#2563eb',
							'line-width': 4,
							'line-opacity': 0.8,
						},
					})
				}

				for (const stop of trip.stops) {
					if (stop.lat === null || stop.lng === null) continue
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

					new maplibregl.Marker({ element: wrapper, anchor: 'bottom' })
						.setLngLat([stop.lng, stop.lat])
						.addTo(map)
				}

				const points: Array<[number, number]> = [...geoStops]
				if (lng !== null && lat !== null) points.push([lng, lat])
				fitBoundsTo(map, points)
				setReady(true)
			})
		})

		setReady(false)
		return () => {
			cancelled = true
			mapRef.current?.remove()
			mapRef.current = null
			busMarkerRef.current = null
		}
		// Rebuild only when the route geometry changes; live marker and ETA
		// badges update below without touching the map.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [trip.tripId, pathKey, stopsKey])

	// Update ETA badges in place when a new poll arrives — no map teardown.
	useEffect(() => {
		if (!ready || !trip.etas) return
		for (const [stopId, span] of etaSpansRef.current) {
			const eta = trip.etas[stopId]
			if (eta == null) {
				span.style.display = 'none'
			} else {
				span.style.display = ''
				span.textContent = t('detail.etaShort', { minutes: eta })
			}
		}
	}, [ready, trip.etas, t])

	// Live marker follows incoming positions without rebuilding the map.
	useEffect(() => {
		if (!ready || !mapRef.current || !containerRef.current) return
		let cancelled = false
		if (lng === null || lat === null) {
			busMarkerRef.current?.remove()
			busMarkerRef.current = null
			return
		}
		loadMaplibre().then(maplibregl => {
			if (cancelled || !mapRef.current) return
			const heading = trip.live?.heading ?? null
			if (!busMarkerRef.current) {
				const wrapper = document.createElement('div')
				wrapper.style.display = 'flex'
				wrapper.style.flexDirection = 'column'
				wrapper.style.alignItems = 'center'
				wrapper.style.gap = '2px'
				wrapper.style.pointerEvents = 'auto'
				wrapper.style.cursor = 'default'

				const arrow = document.createElement('div')
				arrow.style.width = '0'
				arrow.style.height = '0'
				arrow.style.borderLeft = '7px solid transparent'
				arrow.style.borderRight = '7px solid transparent'
				arrow.style.borderBottom = '14px solid ' + BUS_COLOR
				arrow.style.filter = 'drop-shadow(0 1px 2px rgba(21,35,45,0.4))'

				const dot = document.createElement('div')
				dot.style.width = '14px'
				dot.style.height = '14px'
				dot.style.borderRadius = '50%'
				dot.style.backgroundColor = BUS_COLOR
				dot.style.border = '3px solid #ffffff'
				dot.style.boxShadow = '0 1px 4px rgba(21, 35, 45, 0.35)'

				wrapper.appendChild(arrow)
				wrapper.appendChild(dot)

				busMarkerRef.current = new maplibregl.Marker({ element: wrapper, anchor: 'bottom' })
					.setLngLat([lng, lat])
					.addTo(mapRef.current)
			} else {
				busMarkerRef.current.setLngLat([lng, lat])
			}
			const arrow = (busMarkerRef.current.getElement().firstChild as HTMLElement | null)
			if (arrow) arrow.style.transform = heading !== null ? `rotate(${heading}deg)` : 'rotate(0deg)'
		})
		return () => {
			cancelled = true
		}
	}, [ready, lng, lat, trip.live?.heading])

	return (
		<div className='overflow-hidden rounded-xl border border-gray-200 bg-white'>
			<div className='flex items-center justify-between border-b border-gray-100 px-4 py-3'>
				<h2 className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
					<Navigation className='h-4 w-4 text-blue-600' />
					{t('detail.mapTitle')}
				</h2>
				{trip.live?.speedKmh != null && (
					<span className='text-xs text-gray-500 tabular-nums'>
						{t('detail.speed', { speed: Math.round(trip.live.speedKmh) })}
					</span>
				)}
			</div>
			<div ref={containerRef} className='h-[420px] w-full' />
		</div>
	)
}
