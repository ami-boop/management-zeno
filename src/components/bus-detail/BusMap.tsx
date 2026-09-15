'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Navigation } from 'lucide-react'
import type { Marker as MapLibreMarker } from 'maplibre-gl'
import { loadMaplibre } from '@/lib/maplibre-loader'
import {
	BUS_GREEN,
	addPathLine,
	fitBoundsTo,
	makeStopMarker,
	removePathLine,
	setEtaBadge,
	type MapPoint,
} from '@/components/maps/mapkit'
import { useMap } from '@/components/maps/useMap'
import type { BusLiveTrip } from '@/lib/api-contracts'

interface BusMapProps {
	trip: BusLiveTrip
}

export default function BusMap({ trip }: BusMapProps) {
	const t = useTranslations('Fleet')
	const containerRef = useRef<HTMLDivElement | null>(null)
	const busMarkerRef = useRef<MapLibreMarker | null>(null)
	// ETA badges by stopId — updated in place on every poll without a map rebuild.
	const etaSpansRef = useRef<Map<string, HTMLSpanElement>>(new Map())
	const [ready, setReady] = useState(false)
	const [lng, lat] = [trip.live?.lng ?? null, trip.live?.lat ?? null]
	// RSC refreshes produce new (deep-equal) arrays every poll — rebuild the map
	// only when the geometry itself changes.
	const pathKey = useMemo(() => JSON.stringify(trip.path), [trip.path])
	const stopsKey = useMemo(() => JSON.stringify(trip.stops), [trip.stops])

	const geoStops = useMemo(
		() =>
			trip.stops
				.filter(stop => stop.lat !== null && stop.lng !== null)
				.map(stop => [stop.lng!, stop.lat!] as MapPoint),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[stopsKey]
	)
	const initialCenter: MapPoint =
		lng !== null && lat !== null
			? [lng, lat]
			: (geoStops[0] ?? [35.213, 31.768])
	const { mapRef, ready: mapReady } = useMap(containerRef, {
		center: initialCenter,
		zoom: 13,
	})

	useEffect(() => {
		if (!mapReady || !mapRef.current) return
		const map = mapRef.current
		etaSpansRef.current = new Map()

		if (trip.path && trip.path.length >= 2) {
			addPathLine(map, 'route-path', trip.path)
		}

		const markers: MapLibreMarker[] = []
		let cancelled = false
		loadMaplibre().then(maplibregl => {
			if (cancelled || mapRef.current !== map) return
			for (const stop of trip.stops) {
				if (stop.lat === null || stop.lng === null) continue
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
				markers.push(
					new maplibregl.Marker({ element, anchor: 'bottom' })
						.setLngLat([stop.lng, stop.lat])
						.addTo(map)
				)
			}
		})

		const points: MapPoint[] = [...geoStops]
		if (lng !== null && lat !== null) points.push([lng, lat])
		fitBoundsTo(map, points)
		setReady(true)

		return () => {
			cancelled = true
			for (const marker of markers) marker.remove()
			removePathLine(map, 'route-path')
			setReady(false)
		}
		// Rebuild only when the route geometry changes; live marker and ETA
		// badges update below without touching the map.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mapReady, trip.tripId, pathKey, stopsKey])

	// Update ETA badges in place when a new poll arrives — no map teardown.
	useEffect(() => {
		if (!ready || !trip.etas) return
		for (const [stopId, span] of etaSpansRef.current) {
			const eta = trip.etas[stopId]
			setEtaBadge(span, eta != null ? t('detail.etaShort', { minutes: eta }) : null)
		}
	}, [ready, trip.etas, t])

	// Live marker follows incoming positions without rebuilding the map.
	useEffect(() => {
		if (!ready || !mapRef.current) return
		let cancelled = false
		if (lng === null || lat === null) {
			busMarkerRef.current?.remove()
			busMarkerRef.current = null
			return
		}
		loadMaplibre().then(maplibregl => {
			const map = mapRef.current
			if (cancelled || !map) return
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
				arrow.style.borderBottom = '14px solid ' + BUS_GREEN
				arrow.style.filter = 'drop-shadow(0 1px 2px rgba(21,35,45,0.4))'

				const dot = document.createElement('div')
				dot.style.width = '14px'
				dot.style.height = '14px'
				dot.style.borderRadius = '50%'
				dot.style.backgroundColor = BUS_GREEN
				dot.style.border = '3px solid #ffffff'
				dot.style.boxShadow = '0 1px 4px rgba(21, 35, 45, 0.35)'

				wrapper.appendChild(arrow)
				wrapper.appendChild(dot)

				busMarkerRef.current = new maplibregl.Marker({ element: wrapper, anchor: 'bottom' })
					.setLngLat([lng, lat])
					.addTo(map)
			} else {
				busMarkerRef.current.setLngLat([lng, lat])
			}
			const arrow = busMarkerRef.current.getElement().firstChild as HTMLElement | null
			if (arrow) arrow.style.transform = heading !== null ? `rotate(${heading}deg)` : 'rotate(0deg)'
		})
		return () => {
			cancelled = true
		}
	}, [ready, mapRef, lng, lat, trip.live?.heading])

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
