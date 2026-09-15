'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useTranslations } from 'next-intl'
import type { Marker as MapLibreMarker } from 'maplibre-gl'
import { loadMaplibre } from '@/lib/maplibre-loader'
import {
	MORNING_AMBER,
	STOP_BLUE,
	addPathLine,
	fitBoundsTo,
	makeStopMarker,
	removePathLine,
	type MapPoint,
} from '@/components/maps/mapkit'
import { useMap } from '@/components/maps/useMap'
import MapFallback from '@/components/maps/MapFallback'
import type { RouteDetailStop } from './Client'

interface RouteMapProps {
	stops: RouteDetailStop[]
	pathAfternoon: [number, number][] | null
	pathMorning: [number, number][] | null
}

export default function RouteMap({ stops, pathAfternoon, pathMorning }: RouteMapProps) {
	const t = useTranslations('Routes')
	const containerRef = useRef<HTMLDivElement | null>(null)

	const geoStops = useMemo(
		() =>
			stops
				.filter(stop => stop.lat !== null && stop.lng !== null)
				.sort((a, b) => (a.afternoonOrder ?? a.morningOrder ?? 999) - (b.afternoonOrder ?? b.morningOrder ?? 999)),
		[stops]
	)
	const empty = geoStops.length === 0
	const { mapRef, ready, failed } = useMap(
		containerRef,
		empty ? null : { center: [geoStops[0].lng!, geoStops[0].lat!], zoom: 12 }
	)

	// Static route data: overlay syncs once the map is ready.
	useEffect(() => {
		const map = mapRef.current
		if (!ready || !map || empty) return
		let cancelled = false
		const markers: MapLibreMarker[] = []
		loadMaplibre().then(maplibregl => {
			if (cancelled || mapRef.current !== map) return

			const afternoonLine =
				pathAfternoon && pathAfternoon.length >= 2
					? pathAfternoon
					: geoStops
							.filter(stop => stop.afternoonOrder !== null)
							.sort((a, b) => a.afternoonOrder! - b.afternoonOrder!)
							.map(stop => [stop.lng!, stop.lat!] as MapPoint)
			addPathLine(map, 'afternoon', afternoonLine, { color: STOP_BLUE, casing: true })

			const morningLine =
				pathMorning && pathMorning.length >= 2
					? pathMorning
					: geoStops
							.filter(stop => stop.morningOrder !== null)
							.sort((a, b) => a.morningOrder! - b.morningOrder!)
							.map(stop => [stop.lng!, stop.lat!] as MapPoint)
			addPathLine(map, 'morning', morningLine, {
				color: MORNING_AMBER,
				casing: true,
				dash: [2, 2],
			})

			const schoolLabel = t('schoolStop')
			for (const stop of geoStops) {
				const isSchool = stop.type === 'school'
				const order = stop.afternoonOrder ?? stop.morningOrder
				markers.push(
					new maplibregl.Marker({
						element: makeStopMarker({
							name: isSchool ? schoolLabel : stop.name,
							badge: order !== null ? { kind: 'order', text: String(order) } : null,
							borderColor: isSchool ? MORNING_AMBER : '#dfe5e8',
							dotColor: isSchool ? MORNING_AMBER : STOP_BLUE,
							dotSize: isSchool ? 16 : 12,
							title: stop.address ? `${stop.name} — ${stop.address}` : stop.name,
						}).element,
						anchor: 'bottom',
					})
						.setLngLat([stop.lng!, stop.lat!])
						.addTo(map)
				)
			}

			fitBoundsTo(
				map,
				geoStops.map(stop => [stop.lng!, stop.lat!] as MapPoint),
				{ padding: 72 }
			)
		})
		return () => {
			cancelled = true
			removePathLine(map, 'afternoon')
			removePathLine(map, 'morning')
			for (const marker of markers) marker.remove()
		}
	}, [ready, mapRef, empty, geoStops, pathAfternoon, pathMorning, t])

	if (failed) {
		return <MapFallback message={t('mapFailed')} />
	}

	if (empty) {
		return <MapFallback message={t('mapNoCoordinates')} />
	}

	return (
		<div
			ref={containerRef}
			dir='ltr'
			className='h-[420px] w-full rounded-xl border border-gray-200'
		/>
	)
}
