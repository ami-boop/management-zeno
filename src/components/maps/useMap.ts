'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import type { Map as MapLibreMap } from 'maplibre-gl'
import { loadMaplibre } from '@/lib/maplibre-loader'
import { MAP_STYLE_URL, type MapPoint } from './mapkit'

export interface UseMapResult {
	mapRef: RefObject<MapLibreMap | null>
	ready: boolean
	failed: boolean
}

/**
 * Creates the MapLibre instance once (pass null options to skip, e.g. no
 * coordinates). Live data must sync through separate effects — never by
 * re-running this hook.
 */
export function useMap(
	containerRef: RefObject<HTMLDivElement | null>,
	options: { center: MapPoint; zoom: number } | null
): UseMapResult {
	const mapRef = useRef<MapLibreMap | null>(null)
	const [ready, setReady] = useState(false)
	const [failed, setFailed] = useState(false)

	useEffect(() => {
		const container = containerRef.current
		if (!container || !options) return
		let cancelled = false
		setReady(false)
		setFailed(false)
		loadMaplibre()
			.then(maplibregl => {
				if (cancelled || containerRef.current !== container) return
				const map = new maplibregl.Map({
					container,
					style: MAP_STYLE_URL,
					center: options.center,
					zoom: options.zoom,
					attributionControl: { compact: true },
				})
				mapRef.current = map
				map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
				map.on('load', () => {
					if (!cancelled && mapRef.current === map) setReady(true)
				})
				map.on('error', () => {
					if (!cancelled && mapRef.current === map) setFailed(true)
				})
			})
			.catch(() => {
				if (!cancelled) setFailed(true)
			})
		return () => {
			cancelled = true
			mapRef.current?.remove()
			mapRef.current = null
		}
		// Map instance is created once per mount by design.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return { mapRef, ready, failed }
}
