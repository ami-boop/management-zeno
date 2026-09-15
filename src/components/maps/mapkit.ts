import type { Map as MapLibreMap } from 'maplibre-gl'

/** Shared building blocks for the MapLibre views (fleet, route, stop). */

export const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'

export type MapPoint = [number, number]

export const STOP_BLUE = '#2563eb'
export const BUS_GREEN = '#16a34a'
export const MORNING_AMBER = '#f59e0b'

export function fitBoundsTo(
	map: MapLibreMap,
	points: MapPoint[],
	options?: { padding?: number; maxZoom?: number }
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
		{ padding: options?.padding ?? 60, maxZoom: options?.maxZoom ?? 16, duration: 600 }
	)
}

export interface PathLineOptions {
	color?: string
	width?: number
	opacity?: number
	dash?: number[] | null
	/** White casing under the line so overlapping routes stay readable. */
	casing?: boolean
}

export function addPathLine(
	map: MapLibreMap,
	key: string,
	coords: MapPoint[],
	options?: PathLineOptions
) {
	if (coords.length < 2) return
	map.addSource(key, {
		type: 'geojson',
		data: {
			type: 'Feature',
			properties: {},
			geometry: { type: 'LineString', coordinates: coords },
		},
	})
	if (options?.casing) {
		map.addLayer({
			id: `${key}-casing`,
			type: 'line',
			source: key,
			layout: { 'line-join': 'round', 'line-cap': 'round' },
			paint: { 'line-color': '#ffffff', 'line-width': 7, 'line-opacity': 0.85 },
		})
	}
	map.addLayer({
		id: key,
		type: 'line',
		source: key,
		layout: { 'line-join': 'round', 'line-cap': 'round' },
		paint: {
			'line-color': options?.color ?? STOP_BLUE,
			'line-width': options?.width ?? 4,
			'line-opacity': options?.opacity ?? 0.8,
			...(options?.dash ? { 'line-dasharray': options.dash } : {}),
		},
	})
}

export function removePathLine(map: MapLibreMap, key: string) {
	// Defensive: the map may already be disposed when a sibling effect cleans up.
	try {
		if (map.getLayer(`${key}-casing`)) map.removeLayer(`${key}-casing`)
		if (map.getLayer(key)) map.removeLayer(key)
		if (map.getSource(key)) map.removeSource(key)
	} catch {
		// Map already removed — nothing to detach.
	}
}

function stylePill(label: HTMLDivElement, borderColor: string) {
	label.style.display = 'flex'
	label.style.alignItems = 'center'
	label.style.gap = '6px'
	label.style.padding = '3px 9px'
	label.style.borderRadius = '999px'
	label.style.backgroundColor = 'rgba(255, 255, 255, 0.95)'
	label.style.border = `1.5px solid ${borderColor}`
	label.style.boxShadow = '0 1px 4px rgba(21, 35, 45, 0.18)'
	label.style.whiteSpace = 'nowrap'
	label.style.fontFamily = 'inherit'
	label.style.fontSize = '11px'
	label.style.fontWeight = '700'
	label.style.color = '#40515c'
	label.style.lineHeight = '1.2'
}

function styleEtaBadge(span: HTMLSpanElement) {
	span.style.padding = '1px 6px'
	span.style.borderRadius = '999px'
	span.style.backgroundColor = STOP_BLUE
	span.style.color = '#ffffff'
	span.style.fontSize = '10px'
}

/** Show the badge with text, or hide it when text is null. */
export function setEtaBadge(span: HTMLSpanElement, text: string | null) {
	if (text == null) {
		span.style.display = 'none'
	} else {
		span.style.display = ''
		span.textContent = text
	}
}

function styleDot(dot: HTMLDivElement, color: string, size: number) {
	dot.style.width = `${size}px`
	dot.style.height = `${size}px`
	dot.style.borderRadius = '50%'
	dot.style.backgroundColor = '#ffffff'
	dot.style.border = `3px solid ${color}`
	dot.style.boxShadow = '0 1px 4px rgba(21, 35, 45, 0.25)'
}

export interface StopMarkerOptions {
	name: string
	/** Order number (route map) or ETA text (live maps, updatable). */
	badge?: { kind: 'eta' | 'order'; text: string | null } | null
	borderColor?: string
	dotColor?: string
	dotSize?: number
	title?: string
}

export function makeStopMarker(options: StopMarkerOptions): {
	element: HTMLDivElement
	badge: HTMLSpanElement | null
} {
	const wrapper = document.createElement('div')
	wrapper.style.display = 'flex'
	wrapper.style.flexDirection = 'column'
	wrapper.style.alignItems = 'center'
	wrapper.style.gap = '4px'
	wrapper.style.pointerEvents = 'auto'
	wrapper.style.cursor = 'default'

	const label = document.createElement('div')
	stylePill(label, options.borderColor ?? '#dfe5e8')

	let badge: HTMLSpanElement | null = null
	if (options.badge?.kind === 'order' && options.badge.text != null) {
		badge = document.createElement('span')
		badge.textContent = options.badge.text
		badge.style.display = 'inline-flex'
		badge.style.alignItems = 'center'
		badge.style.justifyContent = 'center'
		badge.style.minWidth = '14px'
		badge.style.height = '14px'
		badge.style.borderRadius = '50%'
		badge.style.fontSize = '9px'
		badge.style.fontWeight = '800'
		badge.style.color = '#ffffff'
		badge.style.backgroundColor = options.dotColor ?? STOP_BLUE
		label.appendChild(badge)
	}

	const nameSpan = document.createElement('span')
	nameSpan.textContent = options.name
	label.appendChild(nameSpan)

	if (options.badge?.kind === 'eta') {
		badge = document.createElement('span')
		styleEtaBadge(badge)
		setEtaBadge(badge, options.badge.text)
		label.appendChild(badge)
	}

	const dot = document.createElement('div')
	styleDot(dot, options.dotColor ?? STOP_BLUE, options.dotSize ?? 12)

	wrapper.appendChild(label)
	wrapper.appendChild(dot)
	if (options.title) wrapper.title = options.title
	return { element: wrapper, badge }
}

/** Clickable bus pill (fleet map). Repaint selection via paintBusMarker. */
export function makeBusMarker(plate: string, selected: boolean): HTMLDivElement {
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
	label.style.boxShadow = '0 1px 4px rgba(21, 35, 45, 0.25)'
	label.style.whiteSpace = 'nowrap'
	label.style.fontFamily = 'inherit'
	label.style.fontSize = '11px'
	label.style.fontWeight = '700'
	label.style.lineHeight = '1.2'
	label.textContent = plate

	const dot = document.createElement('div')
	dot.style.width = '14px'
	dot.style.height = '14px'
	dot.style.borderRadius = '50%'
	dot.style.backgroundColor = BUS_GREEN
	dot.style.border = '3px solid #ffffff'
	dot.style.boxShadow = '0 1px 4px rgba(21, 35, 45, 0.35)'

	wrapper.appendChild(label)
	wrapper.appendChild(dot)
	paintBusMarker(wrapper, selected)
	return wrapper
}

export function paintBusMarker(element: HTMLElement, selected: boolean) {
	const label = element.firstChild as HTMLElement | null
	if (!label) return
	label.style.backgroundColor = selected ? BUS_GREEN : 'rgba(255, 255, 255, 0.95)'
	label.style.border = selected ? `1.5px solid ${BUS_GREEN}` : '1.5px solid #dfe5e8'
	label.style.color = selected ? '#ffffff' : '#40515c'
}
