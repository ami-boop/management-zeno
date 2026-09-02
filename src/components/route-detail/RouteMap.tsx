'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { LngLatBounds, Map as MapLibreMap } from 'maplibre-gl'
import type { RouteDetailStop } from './Client'

const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'
const MAPLIBRE_VERSION = '6.6.0'
const MAPLIBRE_CSS_URL = `https://cdn.jsdelivr.net/npm/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.css`
const MAPLIBRE_JS_URL = `https://cdn.jsdelivr.net/npm/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.mjs`

type MapLibreNamespace = typeof import('maplibre-gl')

let maplibrePromise: Promise<MapLibreNamespace> | null = null

function loadMaplibre(): Promise<MapLibreNamespace> {
	if (!maplibrePromise) {
		maplibrePromise = import(
			/* webpackIgnore: true */
			/* turbopackIgnore: true */
			MAPLIBRE_JS_URL
		) as Promise<MapLibreNamespace>
		maplibrePromise.catch(() => {
			maplibrePromise = null
		})
		if (!document.querySelector(`link[data-maplibre="true"]`)) {
			const link = document.createElement('link')
			link.rel = 'stylesheet'
			link.href = MAPLIBRE_CSS_URL
			link.dataset.maplibre = 'true'
			document.head.appendChild(link)
		}
	}
	return maplibrePromise
}

const COLOR_AFTERNOON = '#2563eb'
const COLOR_MORNING = '#f59e0b'
const COLOR_INK_SOFT = '#40515c'
const COLOR_LINE = '#dfe5e8'

type MapLineCoord = [number, number]

function createStopMarker(stop: RouteDetailStop, schoolLabel: string): HTMLElement {
	const isSchool = stop.type === 'school'
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
	label.style.gap = '4px'
	label.style.padding = '3px 9px'
	label.style.borderRadius = '999px'
	label.style.backgroundColor = 'rgba(255, 255, 255, 0.95)'
	label.style.border = `1.5px solid ${isSchool ? COLOR_MORNING : COLOR_LINE}`
	label.style.boxShadow = '0 1px 4px rgba(21, 35, 45, 0.18)'
	label.style.whiteSpace = 'nowrap'
	label.style.fontFamily = 'inherit'
	label.style.fontSize = '11px'
	label.style.fontWeight = '700'
	label.style.color = COLOR_INK_SOFT
	label.style.lineHeight = '1.2'

	const order = stop.afternoonOrder ?? stop.morningOrder
	if (order !== null) {
		const orderBadge = document.createElement('span')
		orderBadge.textContent = String(order)
		orderBadge.style.display = 'inline-flex'
		orderBadge.style.alignItems = 'center'
		orderBadge.style.justifyContent = 'center'
		orderBadge.style.minWidth = '14px'
		orderBadge.style.height = '14px'
		orderBadge.style.borderRadius = '50%'
		orderBadge.style.fontSize = '9px'
		orderBadge.style.fontWeight = '800'
		orderBadge.style.color = '#ffffff'
		orderBadge.style.backgroundColor = isSchool ? COLOR_MORNING : COLOR_AFTERNOON
		label.appendChild(orderBadge)
	}

	const nameSpan = document.createElement('span')
	nameSpan.textContent = isSchool ? schoolLabel : stop.name
	label.appendChild(nameSpan)

	const dot = document.createElement('div')
	dot.style.width = isSchool ? '16px' : '12px'
	dot.style.height = isSchool ? '16px' : '12px'
	dot.style.borderRadius = '50%'
	dot.style.backgroundColor = '#ffffff'
	dot.style.border = `3px solid ${isSchool ? COLOR_MORNING : COLOR_AFTERNOON}`
	dot.style.boxShadow = '0 1px 4px rgba(21, 35, 45, 0.25)'

	wrapper.appendChild(label)
	wrapper.appendChild(dot)
	wrapper.title = stop.address ? `${stop.name} — ${stop.address}` : stop.name
	return wrapper
}

function addLine(map: MapLibreMap, id: string, coords: MapLineCoord[], color: string, dash: number[] | null) {
	if (coords.length < 2) return
	map.addSource(`line-${id}`, {
		type: 'geojson',
		data: {
			type: 'Feature',
			properties: {},
			geometry: { type: 'LineString', coordinates: coords },
		},
	})
	map.addLayer({
		id: `line-${id}-casing`,
		type: 'line',
		source: `line-${id}`,
		layout: { 'line-join': 'round', 'line-cap': 'round' },
		paint: { 'line-color': '#ffffff', 'line-width': 7, 'line-opacity': 0.85 },
	})
	map.addLayer({
		id: `line-${id}`,
		type: 'line',
		source: `line-${id}`,
		layout: { 'line-join': 'round', 'line-cap': 'round' },
		paint: {
			'line-color': color,
			'line-width': 4,
			'line-opacity': 0.9,
			...(dash ? { 'line-dasharray': dash } : {}),
		},
	})
}

interface RouteMapProps {
	stops: RouteDetailStop[]
	pathAfternoon: [number, number][] | null
	pathMorning: [number, number][] | null
}

export default function RouteMap({ stops, pathAfternoon, pathMorning }: RouteMapProps) {
	const t = useTranslations('Routes')
	const containerRef = useRef<HTMLDivElement | null>(null)
	const mapRef = useRef<MapLibreMap | null>(null)
	const [failed, setFailed] = useState(false)
	const [empty, setEmpty] = useState(false)

	useEffect(() => {
		let cancelled = false
		const container = containerRef.current
		if (!container) return

		const geoStops = stops
			.filter(stop => stop.lat !== null && stop.lng !== null)
			.sort((a, b) => (a.afternoonOrder ?? 99) - (b.afternoonOrder ?? 99))
		if (geoStops.length === 0) {
			setEmpty(true)
			return
		}
		setEmpty(false)

		loadMaplibre()
			.then(maplibregl => {
				if (cancelled || !containerRef.current || containerRef.current !== container) return

				const coordinates = geoStops.map(stop => [stop.lng!, stop.lat!] as MapLineCoord)
				const bounds = coordinates.reduce(
					(acc: LngLatBounds, coord) => acc.extend(coord),
					new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
				)

				const map = new maplibregl.Map({
					container,
					style: STYLE_URL,
					bounds,
					fitBoundsOptions: { padding: 72 },
					attributionControl: { compact: true },
				})
				mapRef.current = map
				map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')

				map.on('load', () => {
					if (mapRef.current !== map) return

					const afternoonLine =
						pathAfternoon && pathAfternoon.length >= 2
							? pathAfternoon
							: geoStops
									.filter(stop => stop.afternoonOrder !== null)
									.sort((a, b) => a.afternoonOrder! - b.afternoonOrder!)
									.map(stop => [stop.lng!, stop.lat!] as MapLineCoord)
					addLine(map, 'afternoon', afternoonLine, COLOR_AFTERNOON, null)

					const morningLine =
						pathMorning && pathMorning.length >= 2
							? pathMorning
							: geoStops
									.filter(stop => stop.morningOrder !== null)
									.sort((a, b) => a.morningOrder! - b.morningOrder!)
									.map(stop => [stop.lng!, stop.lat!] as MapLineCoord)
					addLine(map, 'morning', morningLine, COLOR_MORNING, [2, 2])

					for (const stop of geoStops) {
						new maplibregl.Marker({ element: createStopMarker(stop, t('schoolStop')), anchor: 'bottom' })
							.setLngLat([stop.lng!, stop.lat!])
							.addTo(map)
					}
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
	}, [stops, pathAfternoon, pathMorning, t])

	if (failed) {
		return (
			<div className='flex h-[420px] w-full items-center justify-center rounded-xl bg-gray-50'>
				<p className='text-sm font-medium text-gray-500'>{t('mapFailed')}</p>
			</div>
		)
	}

	if (empty) {
		return (
			<div className='flex h-[420px] w-full items-center justify-center rounded-xl bg-gray-50'>
				<p className='text-sm font-medium text-gray-500'>{t('mapNoCoordinates')}</p>
			</div>
		)
	}

	return (
		<div
			ref={containerRef}
			dir='ltr'
			className='h-[420px] w-full rounded-xl border border-gray-200'
		/>
	)
}
