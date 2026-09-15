'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import type { Marker as MapLibreMarker } from 'maplibre-gl'
import { loadMaplibre } from '@/lib/maplibre-loader'
import { makeStopMarker } from '@/components/maps/mapkit'
import { useMap } from '@/components/maps/useMap'
import MapFallback from '@/components/maps/MapFallback'

interface StopMapProps {
	name: string
	lat: number | null
	lng: number | null
}

export default function StopMap({ name, lat, lng }: StopMapProps) {
	const t = useTranslations('Stops')
	const containerRef = useRef<HTMLDivElement | null>(null)
	const empty = lat === null || lng === null
	const { mapRef, ready, failed } = useMap(
		containerRef,
		empty ? null : { center: [lng, lat], zoom: 15 }
	)

	useEffect(() => {
		if (!ready || !mapRef.current || lat === null || lng === null) return
		let cancelled = false
		let marker: MapLibreMarker | null = null
		loadMaplibre().then(maplibregl => {
			if (cancelled || !mapRef.current) return
			marker = new maplibregl.Marker({
				element: makeStopMarker({ name }).element,
				anchor: 'bottom',
			})
				.setLngLat([lng, lat])
				.addTo(mapRef.current)
		})
		return () => {
			cancelled = true
			marker?.remove()
		}
	}, [ready, mapRef, name, lat, lng])

	if (failed) {
		return <MapFallback height='h-[320px]' message={t('mapFailed')} />
	}

	if (empty) {
		return <MapFallback height='h-[320px]' message={t('noCoordinates')} />
	}

	return (
		<div
			ref={containerRef}
			dir='ltr'
			className='h-[320px] w-full rounded-xl border border-gray-200'
		/>
	)
}
